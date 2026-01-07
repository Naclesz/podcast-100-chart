# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:5173 with HMR
npm run build        # Build for production (runs TypeScript compilation + Vite build)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on all files
```

### Testing
```bash
npm test                # Run unit tests in watch mode (Vitest)
npm run test:ui         # Open Vitest UI in browser
npm run test:coverage   # Generate code coverage report
npm run test:e2e        # Run E2E tests with Playwright
npm run test:e2e:ui     # Run E2E tests with Playwright UI
npm run test:e2e:headed # Run E2E tests in headed mode
```

## Architecture Overview

### Core Architecture Pattern

The codebase follows **SOLID principles** with a clear separation between data access, business logic, and presentation:

1. **Services Layer** (`src/services/`): Handles data fetching and transformation
   - `api.client.ts`: Generic HTTP client with timeout and error handling
   - `podcast.service.ts`: Business logic for podcast operations (implements `IPodcastService`)
   - Services use dependency injection (interfaces) to allow testing and extensibility

2. **State Management** (`src/context/`): Global application state using React Context + useReducer
   - `AppContext.tsx`: Main app state with podcasts data, loading states, and errors
     - Includes `StorageService` class for localStorage persistence
     - Data refreshes every 24 hours (checked via `isStale()` utility)
     - Reducer pattern for state updates (`SET_LOADING`, `SET_PODCASTS`, `SET_PODCAST_DETAILS`, etc.)
   - `NavigationContext.tsx`: Navigation state for loading indicators

3. **Custom Hooks** (`src/hooks/`): Encapsulate data fetching and UI state logic
   - `usePodcasts.tsx`: Fetches podcast list, handles filtering by search term
   - `usePodcastDetail.tsx`: Fetches podcast details and episodes
   - `useEpisode.tsx`: Manages episode selection and playback state
   - Hooks consume AppContext and expose simplified interfaces to components

4. **Components** (`src/components/`): Follow **Atomic Design** pattern
   - `atoms/`: Basic UI elements (Input, Label, NavLink, TextHtml)
   - `molecules/`: Composed components (PodcastCard, PodcastGrid, EpisodesTable, PodcastDetailDescription)
   - `organisms/`: Complex sections (Header, HeaderHomeSearch, RouteError)
   - `templates/`: Page layouts (Layout)
   - Components are presentational; data/logic comes from hooks

5. **Pages** (`src/pages/`): Top-level route components
   - HomePage: Grid of 100 podcasts with search filter
   - PodcastPage: Podcast details with episode list (two-column layout)
   - EpisodePage: Episode details with audio player (two-column layout)

6. **Router** (`src/router/`): React Router v7 with `createBrowserRouter`
   - Uses `RouteWrapper` to wait for state hydration from localStorage
   - `errorElement` for controlled error handling with `RouteError` component

### Data Flow

1. App loads → `AppContext` hydrates state from localStorage
2. Route components render → Custom hooks fetch data via services
3. Hooks check if data is stale (24h) before making API calls
4. Services transform external API responses into internal types
5. Context updates state → localStorage persists → Components re-render

### Important Patterns

**Import Aliases**: Configured in `vite.config.ts` and `vitest.config.ts`
```typescript
import { PodcastCard } from "components/molecules/PodcastCard";
import { usePodcasts } from "hooks/usePodcasts";
import { podcastService } from "services/podcast.service";
```

**CSS/Styling**:
- SCSS with BEM naming convention (Block__Element--Modifier)
- Global styles and variables in `src/styles/`
- Component-specific styles colocated with components

**API Configuration**:
- `src/config/api.config.ts`: Centralized endpoint definitions
- Vite dev server proxy configured for iTunes API (handles CORS)
- Production uses proxied paths (`/api/itunes`)

**Error Handling**:
- `ApiError` type includes message, status, and optional code
- HTTP client throws structured errors with timeout support (default 10s)
- Context manages error state, UI can access via hooks

**Pre-commit Hooks**:
- Husky + lint-staged automatically runs ESLint on staged files
- Blocks commits with TypeScript errors or warnings

## Testing Approach

**Unit Tests** (Vitest + React Testing Library):
- Test files colocated with source (e.g., `api.client.test.ts`)
- Setup file: `src/test/setup.ts`
- Uses jsdom environment for React component testing
- Coverage reports exclude config files and test utilities

**E2E Tests** (Playwright):
- Located in `tests/` directory
- Runs against `http://localhost:5173`
- Currently configured for Chromium only
- Note: `headless: false` in config (may want to change for CI)

## Key Technical Decisions

- **React 19** with TypeScript for type safety
- **Vite** for fast dev server and optimized production builds (SWC for React compilation)
- **React Router v7** with modern `createBrowserRouter` API
- **No CSS-in-JS or UI library**: Custom SCSS with BEM naming
- **No external state library**: React Context + useReducer is sufficient
- **localStorage** for client-side caching with 24-hour TTL
- **ESLint** enforces explicit function return types and module boundary types (warnings)
