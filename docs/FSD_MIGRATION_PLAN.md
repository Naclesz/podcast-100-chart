# Feature-Sliced Design Migration Plan

## Overview

This document outlines the strategy for migrating the podcast-100-chart application from its current Atomic Design architecture to Feature-Sliced Design (FSD) architecture.

**Migration Strategy**: Incremental, feature-by-feature migration with parallel structures to minimize disruption.

**Difficulty Assessment**: 6/10 (Medium complexity)

---

## Prerequisites

### 1. Setup FSD Tooling

```bash
# Install FSD ESLint plugin for enforcing layer boundaries
npm install -D @feature-sliced/eslint-config
```

**Update `eslint.config.ts`**:
```typescript
import fsd from '@feature-sliced/eslint-config';

export default tseslint.config([
  // ... existing config
  {
    files: ["src/**/*.{ts,tsx}"],
    ...fsd.configs.recommended,
  }
]);
```

### 2. Create FSD Documentation

- Review FSD documentation: https://feature-sliced.design
- Share with team members for alignment
- Document project-specific FSD conventions

### 3. Backup & Branch Strategy

```bash
# Create feature branch
git checkout -b feat/fsd-migration

# Create checkpoint commits after each phase
git commit -m "chore: FSD migration - Phase X complete"
```

---

## Migration Phases

### Phase 0: Preparation (Foundation)
**Goal**: Set up FSD structure without breaking existing code

**Tasks**:
1. Create new FSD directory structure (empty folders)
2. Update TypeScript path aliases in `vite.config.ts` and `vitest.config.ts`
3. Create index barrel exports for each layer
4. Document layer responsibilities

**Files to modify**:
- `vite.config.ts`
- `vitest.config.ts`
- `tsconfig.json`

**New structure**:
```
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

**Updated `vite.config.ts` aliases**:
```typescript
resolve: {
  alias: {
    "@": "/src",
    "@app": "/src/app",
    "@pages": "/src/pages",
    "@widgets": "/src/widgets",
    "@features": "/src/features",
    "@entities": "/src/entities",
    "@shared": "/src/shared",
    // Keep old aliases temporarily for backwards compatibility
    components: "/src/components",
    hooks: "/src/hooks",
    services: "/src/services",
    context: "/src/context",
    // ... etc
  },
}
```

**Validation**:
- [ ] All folders created
- [ ] TypeScript recognizes new path aliases
- [ ] Build still works
- [ ] Tests still pass

---

### Phase 1: Shared Layer Migration
**Goal**: Move all reusable, non-business code to `shared/`

**Priority**: High (foundation for other layers)

#### 1.1 Migrate Shared UI Components (Atoms)

**Source → Destination**:
```
src/components/atoms/Input/      → src/shared/ui/Input/
src/components/atoms/Label/      → src/shared/ui/Label/
src/components/atoms/NavLink/    → src/shared/ui/NavLink/
src/components/atoms/TextHtml/   → src/shared/ui/TextHtml/
```

**Steps**:
1. Copy files to new locations
2. Create `src/shared/ui/index.ts` barrel export:
   ```typescript
   export { Input } from './Input/Input';
   export { Label } from './Label/Label';
   export { NavLink } from './NavLink/NavLink';
   export { TextHtml } from './TextHtml/TextHtml';
   ```
3. Update imports in consuming components to use `@shared/ui`
4. Run tests to verify nothing broke
5. Delete old files once all imports updated

**Commands**:
```bash
# Create structure
mkdir -p src/shared/ui/{Input,Label,NavLink,TextHtml}

# Copy files (example for Input)
cp src/components/atoms/Input/* src/shared/ui/Input/

# Find all imports to update
grep -r "components/atoms/Input" src/
```

#### 1.2 Migrate API Layer

**Source → Destination**:
```
src/services/api.client.ts       → src/shared/api/client.ts
src/config/api.config.ts         → src/shared/api/config.ts
src/types/types.ts (ApiError)    → src/shared/api/types.ts
```

**Steps**:
1. Create `src/shared/api/` directory
2. Move `api.client.ts` and rename to `client.ts`
3. Move `api.config.ts` and rename to `config.ts`
4. Extract `ApiError` type to `src/shared/api/types.ts`
5. Create `src/shared/api/index.ts`:
   ```typescript
   export { HttpClient, httpClient } from './client';
   export type { IHttpClient, RequestOptions } from './client';
   export { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from './config';
   export type { ApiError } from './types';
   ```
6. Update all imports to use `@shared/api`

#### 1.3 Migrate Utilities

**Source → Destination**:
```
src/utils/utils.ts (formatMillisecondsToTime) → src/shared/lib/format.ts
src/utils/utils.ts (isStale)                  → src/shared/lib/date.ts
src/context/AppContext.tsx (StorageService)   → src/shared/lib/storage.ts
```

**Steps**:
1. Create `src/shared/lib/` directory
2. Split `utils.ts` into focused modules:
   - `format.ts` - formatting functions
   - `date.ts` - date/time utilities
3. Extract `StorageService` class from `AppContext.tsx`
4. Create barrel export `src/shared/lib/index.ts`
5. Update imports

**Example `src/shared/lib/storage.ts`**:
```typescript
export class StorageService {
  private static readonly STORAGE_KEY = "podcast-app-state";

  static save(data: unknown): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  static load<T>(): T | null {
    try {
      const serializedData = localStorage.getItem(this.STORAGE_KEY);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
      console.error("Error loading from storage:", error);
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
}
```

**Validation**:
- [ ] All shared UI components migrated and working
- [ ] API client migrated, services still functional
- [ ] Utilities migrated and accessible
- [ ] All tests passing
- [ ] No import errors

---

### Phase 2: Entities Layer Migration
**Goal**: Extract business entities (podcast, episode) with their data, types, and UI

**Priority**: High (foundation for features and pages)

#### 2.1 Migrate Podcast Entity

**Source → Destination**:
```
src/components/molecules/PodcastCard/              → src/entities/podcast/ui/PodcastCard/
src/components/molecules/PodcastGrid/              → src/entities/podcast/ui/PodcastGrid/
src/components/molecules/PodcastDetailDescription/ → src/entities/podcast/ui/PodcastDetails/
src/services/podcast.service.ts                    → src/entities/podcast/api/podcastApi.ts
src/types/types.ts (Podcast types)                 → src/entities/podcast/model/types.ts
```

**Directory structure**:
```
src/entities/podcast/
├── ui/
│   ├── PodcastCard/
│   │   ├── PodcastCard.tsx
│   │   └── PodcastCard.scss
│   ├── PodcastGrid/
│   │   ├── PodcastGrid.tsx
│   │   └── PodcastGrid.scss
│   └── PodcastDetails/
│       ├── PodcastDetails.tsx
│       └── PodcastDetails.scss
├── model/
│   ├── types.ts
│   └── store.ts
├── api/
│   └── podcastApi.ts
└── index.ts
```

**Steps**:

1. **Create types file** (`src/entities/podcast/model/types.ts`):
   ```typescript
   export type Podcast = {
     id: string;
     title: string;
     author: string;
     summary: string;
     imageUrl: string;
     details: PodcastDetails;
     lastUpdated: Date | null;
   };

   export type PodcastDetails = {
     episodes: Episode[];
     totalEpisodes: number | null;
   };

   export type PodcastEntry = {
     // ... iTunes API response types
   };
   ```

2. **Move API service** (`src/entities/podcast/api/podcastApi.ts`):
   - Copy `podcast.service.ts`
   - Update imports to use `@shared/api` and `@entities/podcast/model`
   - Keep interface-based design

3. **Move UI components**:
   - Copy each component to new location
   - Update internal imports
   - Keep component logic unchanged

4. **Create barrel export** (`src/entities/podcast/index.ts`):
   ```typescript
   // Types
   export type { Podcast, PodcastDetails, PodcastEntry } from './model/types';

   // API
   export { PodcastService, podcastService } from './api/podcastApi';
   export type { IPodcastService } from './api/podcastApi';

   // UI
   export { PodcastCard } from './ui/PodcastCard/PodcastCard';
   export { PodcastGrid } from './ui/PodcastGrid/PodcastGrid';
   export { PodcastDetails } from './ui/PodcastDetails/PodcastDetails';
   ```

5. **Update imports across codebase**:
   ```bash
   # Find all podcast-related imports
   grep -r "components/molecules/Podcast" src/
   grep -r "services/podcast.service" src/
   grep -r "types/types.*Podcast" src/
   ```

#### 2.2 Migrate Episode Entity

**Source → Destination**:
```
src/components/molecules/EpisodesTable/ → src/entities/episode/ui/EpisodesTable/
src/types/types.ts (Episode types)      → src/entities/episode/model/types.ts
src/hooks/useEpisode.tsx                → src/entities/episode/model/useEpisode.ts
```

**Directory structure**:
```
src/entities/episode/
├── ui/
│   └── EpisodesTable/
│       ├── EpisodesTable.tsx
│       └── EpisodesTable.scss
├── model/
│   ├── types.ts
│   └── useEpisode.ts
└── index.ts
```

**Steps**:
1. Create types file with Episode-related types
2. Move `EpisodesTable` component
3. Move `useEpisode` hook to `model/`
4. Create barrel export
5. Update imports

**Validation**:
- [ ] Podcast entity fully migrated
- [ ] Episode entity fully migrated
- [ ] All entity components render correctly
- [ ] API calls still work
- [ ] Tests passing

---

### Phase 3: Features Layer Migration
**Goal**: Extract user-facing features (search, filtering, etc.)

**Priority**: Medium

#### 3.1 Migrate Podcast Search Feature

**Source → Destination**:
```
src/components/organisms/HeaderHomeSearch/ → src/features/podcast-search/ui/PodcastSearch/
src/hooks/usePodcasts.tsx (search logic)   → src/features/podcast-search/model/usePodcastSearch.ts
```

**Directory structure**:
```
src/features/podcast-search/
├── ui/
│   ├── PodcastSearch.tsx
│   └── PodcastSearch.scss
├── model/
│   └── usePodcastSearch.ts
└── index.ts
```

**Steps**:

1. **Extract search logic** from `usePodcasts.tsx`:
   ```typescript
   // src/features/podcast-search/model/usePodcastSearch.ts
   import { useMemo, useState } from 'react';
   import type { Podcast } from '@entities/podcast';

   type UsePodcastSearchReturn = {
     searchTerm: string;
     filteredPodcasts: Podcast[];
     filteredCount: number;
     onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
   };

   export const usePodcastSearch = (
     podcasts: Podcast[]
   ): UsePodcastSearchReturn => {
     const [searchTerm, setSearchTerm] = useState("");

     const filteredPodcasts = useMemo(() => {
       if (!searchTerm.trim()) return podcasts;

       const normalized = searchTerm.toLowerCase();
       return podcasts.filter(
         (podcast) =>
           podcast.title.toLowerCase().includes(normalized) ||
           podcast.author.toLowerCase().includes(normalized)
       );
     }, [podcasts, searchTerm]);

     function onSearch(event: React.ChangeEvent<HTMLInputElement>): void {
       setSearchTerm(event.target.value);
     }

     return {
       searchTerm,
       filteredPodcasts,
       filteredCount: filteredPodcasts.length,
       onSearch,
     };
   };
   ```

2. **Move UI component**:
   - Rename `HeaderHomeSearch` → `PodcastSearch`
   - Update to use new hook

3. **Create barrel export**

4. **Update consuming pages** (HomePage)

**Validation**:
- [ ] Search feature works correctly
- [ ] Filtering logic unchanged
- [ ] Performance is the same (memoization still working)

---

### Phase 4: Widgets Layer Migration
**Goal**: Move large layout blocks and composite sections

**Priority**: Medium

#### 4.1 Migrate Header Widget

**Source → Destination**:
```
src/components/organisms/Header/    → src/widgets/header/ui/Header/
src/components/templates/Layout/    → src/widgets/page-layout/ui/PageLayout/
```

**Directory structure**:
```
src/widgets/
├── header/
│   ├── ui/
│   │   ├── Header.tsx
│   │   └── Header.scss
│   └── index.ts
└── page-layout/
    ├── ui/
    │   ├── PageLayout.tsx
    │   └── PageLayout.scss
    └── index.ts
```

**Steps**:
1. Move Header component
2. Move Layout component, rename to PageLayout
3. Update imports in pages
4. Create barrel exports

**Validation**:
- [ ] Header renders correctly
- [ ] Layout structure unchanged
- [ ] Navigation still works

---

### Phase 5: Pages Layer Migration
**Goal**: Move route-level page components

**Priority**: Medium

#### 5.1 Migrate All Pages

**Source → Destination**:
```
src/pages/HomePage/     → src/pages/home/ui/HomePage.tsx
src/pages/PodcastPage/  → src/pages/podcast-detail/ui/PodcastPage.tsx
src/pages/EpisodePage/  → src/pages/episode-detail/ui/EpisodePage.tsx
```

**Directory structure**:
```
src/pages/
├── home/
│   ├── ui/
│   │   ├── HomePage.tsx
│   │   └── HomePage.scss
│   └── index.ts
├── podcast-detail/
│   ├── ui/
│   │   ├── PodcastPage.tsx
│   │   └── PodcastPage.scss
│   └── index.ts
├── episode-detail/
│   ├── ui/
│   │   ├── EpisodePage.tsx
│   │   └── EpisodePage.scss
│   └── index.ts
└── error/
    ├── ui/
    │   ├── RouteError.tsx
    │   └── RouteError.scss
    └── index.ts
```

**Steps**:
1. Create page directories
2. Move page components
3. Update page imports to use new FSD paths:
   - `@entities/podcast` for podcast components
   - `@features/podcast-search` for search
   - `@widgets/page-layout` for layout
4. Update router imports in `src/app/router/routes.tsx`
5. Create barrel exports

**Example updated HomePage**:
```typescript
// src/pages/home/ui/HomePage.tsx
import { PodcastGrid } from '@entities/podcast';
import { PodcastSearch } from '@features/podcast-search';
import { PageLayout } from '@widgets/page-layout';
import { usePodcasts } from './model/usePodcasts'; // or keep in a hook location

export default function HomePage(): React.ReactElement {
  const { podcasts, isLoading, error, filteredCount, onSearch } = usePodcasts();

  return (
    <PageLayout>
      <PodcastSearch
        onFilterPodcasts={onSearch}
        filteredPodcastsCount={filteredCount}
      />
      <PodcastGrid podcasts={podcasts} isLoading={isLoading} />
      {error && <div>Error: {error.message}</div>}
    </PageLayout>
  );
}
```

**Validation**:
- [ ] All pages render correctly
- [ ] Routing works
- [ ] Data fetching works
- [ ] User interactions work

---

### Phase 6: App Layer Migration
**Goal**: Move app initialization, providers, and routing to `app/`

**Priority**: High (final core piece)

#### 6.1 Migrate Providers

**Source → Destination**:
```
src/context/AppContext.tsx        → src/app/providers/AppProvider.tsx
src/context/NavigationContext.tsx → src/app/providers/NavigationProvider.tsx
```

**Directory structure**:
```
src/app/
├── providers/
│   ├── AppProvider.tsx
│   ├── NavigationProvider.tsx
│   ├── index.tsx                # Compose all providers
│   └── types.ts
├── router/
│   ├── routes.tsx
│   └── index.ts
├── styles/
│   ├── index.scss
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _global.scss
└── index.tsx                    # App entry point
```

**Steps**:

1. **Move and refactor AppProvider**:
   - Move to `src/app/providers/AppProvider.tsx`
   - Import `StorageService` from `@shared/lib/storage`
   - Update type imports from entities

2. **Create provider composition** (`src/app/providers/index.tsx`):
   ```typescript
   import { AppProvider } from './AppProvider';
   import { NavigationProvider } from './NavigationProvider';

   export function AppProviders({ children }: { children: React.ReactNode }) {
     return (
       <AppProvider>
         <NavigationProvider>
           {children}
         </NavigationProvider>
       </AppProvider>
     );
   }

   export { useAppContext } from './AppProvider';
   export { useNavigationContext } from './NavigationProvider';
   ```

3. **Move router**:
   - Move `src/router/routes.tsx` → `src/app/router/routes.tsx`
   - Update page imports to use `@pages/*`

4. **Move main.tsx**:
   - Rename `src/main.tsx` → `src/app/index.tsx`
   - Update imports
   - Simplify to use composed providers

5. **Move global styles**:
   - Move `src/styles/*` → `src/app/styles/`
   - Update import in `index.tsx`

**Example `src/app/index.tsx`**:
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AppProviders } from './providers';
import { router } from './router';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
```

**Validation**:
- [ ] App initializes correctly
- [ ] All providers work
- [ ] Routing works
- [ ] State management works
- [ ] LocalStorage persistence works

---

### Phase 7: State Management Refactor (Optional Advanced)
**Goal**: Split monolithic AppContext into entity-specific state slices

**Priority**: Low (optional optimization)

**Current approach**: Single `AppContext` with all podcasts data

**FSD approach**: Each entity manages its own state

**Options**:

**Option A: Keep centralized state** (Recommended for now)
- Keep AppContext in `app/providers/`
- Minimal changes required
- Good enough for current app size

**Option B: Distributed state** (Future enhancement)
- Create `entities/podcast/model/store.ts`
- Create `entities/episode/model/store.ts`
- Use Zustand, Jotai, or plain Context per entity
- More complex but better isolation

**Implementation for Option B**:

```typescript
// src/entities/podcast/model/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Podcast } from './types';
import { podcastService } from '../api/podcastApi';

type PodcastStore = {
  podcasts: Podcast[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: Error | null;
  loadPodcasts: () => Promise<void>;
  getPodcastById: (id: string) => Podcast | undefined;
};

export const usePodcastStore = create<PodcastStore>()(
  persist(
    (set, get) => ({
      podcasts: [],
      lastUpdated: null,
      isLoading: false,
      error: null,

      loadPodcasts: async () => {
        const { lastUpdated, isLoading } = get();

        if (isLoading || (lastUpdated && !isStale(lastUpdated))) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const podcasts = await podcastService.getListPodcasts();
          set({ podcasts, lastUpdated: new Date(), isLoading: false });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
        }
      },

      getPodcastById: (id: string) => {
        return get().podcasts.find(p => p.id === id);
      },
    }),
    {
      name: 'podcast-store',
      partialize: (state) => ({
        podcasts: state.podcasts,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
```

**Decision Point**: Discuss with team before implementing Option B.

---

### Phase 8: Cleanup & Optimization
**Goal**: Remove old structure, optimize imports, enforce FSD rules

**Priority**: High (final step)

#### 8.1 Remove Old Structure

**Steps**:
1. Verify all imports updated to FSD paths
2. Remove old directories:
   ```bash
   rm -rf src/components
   rm -rf src/hooks
   rm -rf src/services
   rm -rf src/context
   rm -rf src/config
   rm -rf src/utils
   rm -rf src/pages/HomePage
   rm -rf src/pages/PodcastPage
   rm -rf src/pages/EpisodePage
   rm -rf src/router
   ```
3. Remove old aliases from `vite.config.ts`:
   ```typescript
   resolve: {
     alias: {
       "@": "/src",
       "@app": "/src/app",
       "@pages": "/src/pages",
       "@widgets": "/src/widgets",
       "@features": "/src/features",
       "@entities": "/src/entities",
       "@shared": "/src/shared",
       // Remove old aliases
     },
   }
   ```

#### 8.2 Enforce FSD Rules

**Add ESLint rules** to `eslint.config.ts`:
```typescript
import fsd from '@feature-sliced/eslint-config';

export default tseslint.config([
  // ... existing config
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [fsd.configs.recommended],
    rules: {
      // Enforce strict layer boundaries
      '@feature-sliced/layers-slices': 'error',
      '@feature-sliced/absolute-relative': 'error',
      '@feature-sliced/public-api': 'error',
    },
  }
]);
```

**FSD Import Rules**:
- ✅ `app/` can import from: `pages/`, `widgets/`, `features/`, `entities/`, `shared/`
- ✅ `pages/` can import from: `widgets/`, `features/`, `entities/`, `shared/`
- ✅ `widgets/` can import from: `features/`, `entities/`, `shared/`
- ✅ `features/` can import from: `entities/`, `shared/`
- ✅ `entities/` can import from: `shared/`
- ✅ `shared/` can only import from within `shared/`
- ❌ Never import from parent or sibling layers

#### 8.3 Update Documentation

**Files to update**:
1. **README.md**:
   - Update "Estructura de directorios" section
   - Explain FSD architecture
   - Update component examples

2. **CLAUDE.md**:
   - Update "Architecture Overview" section
   - Document FSD layers
   - Update import patterns

3. **Create FSD_ARCHITECTURE.md**:
   - Detailed FSD layer explanations
   - Import rules and examples
   - How to add new features
   - Where to put new code

#### 8.4 Update Tests

**Steps**:
1. Ensure test files moved with their source files
2. Update test imports to use FSD paths
3. Verify coverage still works
4. Update `vitest.config.ts` if needed

**Run full test suite**:
```bash
npm test
npm run test:coverage
npm run test:e2e
```

**Validation**:
- [ ] Old directories removed
- [ ] All imports use FSD paths
- [ ] ESLint FSD rules passing
- [ ] All tests passing
- [ ] Test coverage maintained or improved
- [ ] Documentation updated
- [ ] Build succeeds
- [ ] App works in dev and production

---

## Testing Strategy

### After Each Phase

**Unit Tests**:
```bash
npm test                 # Run all unit tests
npm run test:coverage    # Verify coverage maintained
```

**E2E Tests**:
```bash
npm run test:e2e         # Verify user flows still work
```

**Manual Testing Checklist**:
- [ ] Homepage loads and displays 100 podcasts
- [ ] Search/filter works
- [ ] Click podcast card navigates to detail page
- [ ] Podcast detail page shows episodes
- [ ] Click episode navigates to episode page
- [ ] Audio player works
- [ ] Navigation back to home works
- [ ] Loading indicators appear during navigation
- [ ] Error page appears for invalid routes
- [ ] Data persists after page refresh
- [ ] Data refreshes after 24 hours

**Linting**:
```bash
npm run lint             # Verify no linting errors
```

**Build Verification**:
```bash
npm run build            # Production build succeeds
npm run preview          # Production build works locally
```

---

## Rollback Plan

### If Issues Arise

**Option 1: Revert Specific Phase**
```bash
# Revert to previous phase checkpoint
git log --oneline | grep "FSD migration"
git reset --hard <commit-hash>
```

**Option 2: Gradual Rollback**
- Keep old imports working temporarily
- Fix issues in new structure
- Re-migrate once fixed

**Option 3: Feature Flag**
- Use environment variable to toggle between old/new structure
- Requires more complex setup but allows A/B testing

---

## Success Criteria

### Technical Metrics
- [ ] All tests passing (100% of original tests)
- [ ] Test coverage maintained or improved (current: check with `npm run test:coverage`)
- [ ] Build size same or smaller
- [ ] No console errors or warnings
- [ ] ESLint FSD rules all passing
- [ ] TypeScript compilation with no errors

### Code Quality Metrics
- [ ] All imports follow FSD layer rules
- [ ] No circular dependencies
- [ ] Clear separation of concerns
- [ ] Public APIs well-defined (barrel exports)
- [ ] Documentation updated

### Functional Metrics
- [ ] All user flows working
- [ ] Performance maintained (use Lighthouse)
- [ ] LocalStorage persistence working
- [ ] 24-hour cache refresh working
- [ ] Error handling working

---

## Post-Migration Tasks

### 1. Team Onboarding
- Conduct FSD architecture walkthrough
- Update onboarding documentation
- Create "Where to put code" guide

### 2. CI/CD Updates
- Update build scripts if needed
- Update deployment documentation
- Verify Netlify deployment still works

### 3. Future Improvements
- Consider distributed state management (Phase 7 Option B)
- Add more features following FSD pattern
- Create component library from `shared/ui`
- Document common patterns and anti-patterns

---

## Timeline Dependencies

**Sequential Phases** (must be done in order):
1. Phase 0 → Phase 1 → Phase 2 → Phase 3/4/5 (parallel) → Phase 6 → Phase 8

**Parallel Phases** (can be done simultaneously):
- Phase 3 (Features) + Phase 4 (Widgets) + Phase 5 (Pages)

**Optional Phase**:
- Phase 7 (State refactor) - can be done later

**Critical Path**:
Phase 0 → Phase 1 → Phase 2 → (Phase 3/4/5) → Phase 6 → Phase 8

---

## Risk Mitigation

### High Risk Areas

**1. AppContext Refactoring**
- **Risk**: Breaking state management
- **Mitigation**: Extensive testing after Phase 6, keep logic identical initially

**2. Import Path Updates**
- **Risk**: Missing imports causing runtime errors
- **Mitigation**: Use TypeScript, run tests frequently, use find-replace carefully

**3. Test File Relocation**
- **Risk**: Breaking test suite
- **Mitigation**: Move tests with source files, update imports immediately

### Medium Risk Areas

**1. Router Configuration**
- **Risk**: Breaking navigation
- **Mitigation**: Test all routes after Phase 6

**2. CSS/SCSS Imports**
- **Risk**: Styles not loading
- **Mitigation**: Verify styles after moving each component

### Low Risk Areas

**1. Documentation Updates**
- **Risk**: Outdated docs
- **Mitigation**: Update docs in Phase 8

---

## Commands Quick Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run lint             # Run linting

# Migration Helpers
grep -r "old/path" src/  # Find imports to update
find src/ -name "*.test.*" # Find all test files

# Git
git status               # Check migration progress
git commit -m "chore: FSD migration - Phase X complete"
git diff                 # Review changes
```

---

## Additional Resources

- [Feature-Sliced Design Official Documentation](https://feature-sliced.design)
- [FSD Examples Repository](https://github.com/feature-sliced/examples)
- [FSD ESLint Plugin](https://github.com/feature-sliced/eslint-config)
- [FSD Discord Community](https://discord.gg/S8MzWTUsmp)

---

## Questions & Support

**Common Questions**:

**Q: Can I mix Atomic Design with FSD?**
A: No. FSD replaces Atomic Design with its own layer structure. However, concepts translate well (atoms → shared/ui, molecules → entities/ui, organisms → widgets).

**Q: Where do I put new features?**
A: User-facing interactions → `features/`, business entity displays → `entities/`, large sections → `widgets/`, pages → `pages/`.

**Q: Can entities import from features?**
A: No. Entities are lower-level than features. Only features can import entities.

**Q: Where do hooks go?**
A: Depends on scope: Entity-specific hooks → `entities/*/model/`, feature-specific → `features/*/model/`, shared hooks → `shared/lib/hooks/`.

**Q: Should I migrate tests?**
A: Yes, colocate tests with source files following FSD structure.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-07
**Status**: Ready for Implementation
