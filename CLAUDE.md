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

The codebase follows **Hexagonal Architecture (Ports & Adapters)** with functional programming principles and SOLID design. This architecture ensures clear separation of concerns, dependency inversion, and framework independence for the business logic.

#### Key Principles

1. **Domain-centric**: Business logic is isolated and framework-agnostic
2. **Functional approach**: Use pure functions instead of classes (except for repositories)
3. **Dependency inversion**: Dependencies point inward toward the domain
4. **Unidirectional flow**: UI → Application → Domain → Infrastructure

### Layer Structure

#### 1. Domain Layer (`src/domain/`)
**Purpose**: Contains pure business logic, isolated from frameworks and external dependencies.

- **`models/`**: Domain entities (Podcast, Episode, PodcastDetails, ApiError)
  - Pure TypeScript types representing core business concepts
  - Exported through barrel file (`index.ts`) for clean imports

- **`repositories/`** (PORTS): Repository interfaces defining contracts
  - `IPodcastRepository`: Contract for podcast data access
  - `IStorageRepository`: Contract for storage operations
  - Interfaces are implemented by infrastructure adapters

- **`usecases/`**: Pure business logic functions
  - `get-podcasts.usecase.ts`: Fetches all podcasts
  - `get-podcast-details.usecase.ts`: Fetches podcast details
  - `filter-podcasts.usecase.ts`: Filters podcasts by search term
  - `get-episode.usecase.ts`: Retrieves specific episode
  - All usecases are pure functions with no side effects

#### 2. Infrastructure Layer (`src/infrastructure/`)
**Purpose**: Implements domain interfaces using concrete technologies (HTTP, localStorage, etc.).

- **`adapters/`** (ADAPTERS): Repository implementations
  - `HttpPodcastRepository`: Implements `IPodcastRepository` using HTTP
  - `LocalStorageRepository`: Implements `IStorageRepository` using localStorage
  - Classes that bridge external systems to domain interfaces

- **`http/`**: HTTP client implementation
  - `http-client.ts`: Generic HTTP client with timeout and error handling
  - Includes comprehensive test suite

- **`mappers/`**: Transform external data to domain models
  - `podcast.mapper.ts`: PodcastEntry → Podcast
  - `episode.mapper.ts`: EpisodeEntry → Episode
  - Pure functions that translate between DTOs and domain models

- **`dto/`**: Data Transfer Objects (API types)
  - `itunes-api.dto.ts`: iTunes API response types
  - External contracts isolated from domain

#### 3. Application Layer (`src/application/`)
**Purpose**: Orchestrates domain usecases with React-specific patterns (hooks, context).

- **`context/`**: State management using React Context + useReducer
  - `AppContext.tsx`: Main app state with podcasts data, loading states, and errors
    - Includes `StorageService` class for localStorage persistence
    - Data refreshes every 24 hours (checked via `isStale()` utility)
    - Reducer pattern for state updates (`SET_LOADING`, `SET_PODCASTS`, etc.)
  - `NavigationContext.tsx`: Navigation state for loading indicators

- **`hooks/`**: Custom React hooks that use domain usecases
  - `usePodcasts.tsx`: Fetches podcast list, handles filtering by search term
  - `usePodcastDetail.tsx`: Fetches podcast details and episodes
  - `useEpisode.tsx`: Manages episode selection and playback state
  - Hooks bridge domain usecases with React component lifecycle

- **`di/`**: Dependency Injection / Composition Root
  - `dependencies.ts`: Single place where all dependencies are wired up
  - Creates repository instances and exports them for application use
  - Enables easy swapping of implementations (e.g., mock for testing)

#### 4. Presentation Layer (`src/presentation/`)
**Purpose**: UI components and routing (React-specific).

- **`components/`**: Follow **Atomic Design** pattern
  - `atoms/`: Basic UI elements (Input, Label, NavLink, TextHtml)
  - `molecules/`: Composed components (PodcastCard, PodcastGrid, EpisodesTable, PodcastDetailDescription)
  - `organisms/`: Complex sections (Header, HeaderHomeSearch, RouteError)
  - `templates/`: Page layouts (Layout)
  - Components are presentational; data/logic comes from application hooks

- **`pages/`**: Top-level route components
  - `HomePage/`: Grid of 100 podcasts with search filter
  - `PodcastPage/`: Podcast details with episode list (two-column layout)
  - `EpisodePage/`: Episode details with audio player (two-column layout)

- **`router/`**: React Router v7 with `createBrowserRouter`
  - `routes.tsx`: Route configuration with error boundaries
  - Uses `RouteWrapper` to wait for state hydration from localStorage
  - `errorElement` for controlled error handling with `RouteError` component

#### 5. Shared Layer (`src/shared/`)
**Purpose**: Common utilities and configuration used across layers.

- **`config/`**: Configuration files
  - `api.config.ts`: Centralized API endpoint definitions

- **`utils/`**: Utility functions
  - `utils.tsx`: Pure utility functions (formatMillisecondsToTime, isStale, etc.)
  - `profiler.ts`: Performance profiling utilities

- **`constants/`**: Application constants
  - `cache.constants.ts`: Cache duration and other constants

### Data Flow

1. **App loads** → `AppContext` hydrates state from localStorage via `StorageService`
2. **Route components render** → Custom hooks orchestrate domain usecases
3. **Hooks invoke usecases** → Usecases call repository interfaces (ports)
4. **Infrastructure adapters** → Fetch data, apply mappers to transform DTOs → Domain models
5. **Context updates state** → localStorage persists → Components re-render

### Dependency Flow

```
Presentation → Application → Domain ← Infrastructure
     ↓             ↓            ↑           ↑
  (UI Only)    (React)      (Pure)    (External)
```

- **Presentation** depends on Application
- **Application** depends on Domain
- **Infrastructure** depends on Domain (implements interfaces)
- **Domain** has NO dependencies (pure business logic)

### Important Patterns

**Import Aliases**: Configured in `vite.config.ts` and `vitest.config.ts`
```typescript
// Domain layer imports
import type { Podcast, Episode, ApiError } from "domain/models";
import { getPodcasts } from "domain/usecases/get-podcasts.usecase";

// Infrastructure layer imports
import { HttpPodcastRepository } from "infrastructure/adapters/http-podcast.repository";
import { httpClient } from "infrastructure/http/http-client";

// Application layer imports
import { usePodcasts } from "application/hooks/usePodcasts";
import { useAppContext } from "application/context/AppContext";

// Presentation layer imports
import { PodcastCard } from "presentation/components/molecules/PodcastCard/PodcastCard";
import HomePage from "presentation/pages/HomePage/HomePage";

// Shared imports
import { API_CONFIG } from "shared/config/api.config";
import { formatMillisecondsToTime } from "shared/utils/utils";
```

**Dependency Injection**:
- All repository instances created in `application/di/dependencies.ts`
- Single composition root for the entire application
- Makes testing easy (can inject mock repositories)
- Example:
```typescript
// In dependencies.ts
export const podcastRepository = new HttpPodcastRepository(httpClient, API_BASE_URL);

// In usecases or context
import { podcastRepository } from "application/di/dependencies";
const podcasts = await getPodcasts(podcastRepository);
```

**CSS/Styling**:
- SCSS with BEM naming convention (Block__Element--Modifier)
- Global styles and variables in `src/styles/`
- Component-specific styles colocated with components in presentation layer

**API Configuration**:
- `shared/config/api.config.ts`: Centralized endpoint definitions
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
- Test files colocated with source code:
  - `infrastructure/http/http-client.test.ts`: HTTP client tests
  - `shared/utils/utils.test.tsx`: Utility function tests
- Setup file: `src/test/setup.ts`
- Uses jsdom environment for React component testing
- Coverage reports exclude config files and test utilities
- Domain usecases are pure functions, easy to test without mocks
- Infrastructure adapters can be tested with mock HTTP clients

**E2E Tests** (Playwright):
- Located in `tests/` directory
- Runs against `http://localhost:5173`
- Currently configured for Chromium only
- Note: `headless: false` in config (may want to change for CI)

## Key Technical Decisions

- **Hexagonal Architecture**: Clear separation of concerns with dependency inversion
  - Domain layer is pure and framework-agnostic
  - Infrastructure adapters implement domain interfaces
  - Application layer orchestrates usecases with React
  - Presentation layer contains only UI components
- **Functional Programming**: Domain usecases are pure functions (no classes)
- **Dependency Injection**: Single composition root in `application/di/dependencies.ts`
- **React 19** with TypeScript for type safety
- **Vite** for fast dev server and optimized production builds (SWC for React compilation)
- **React Router v7** with modern `createBrowserRouter` API
- **No CSS-in-JS or UI library**: Custom SCSS with BEM naming
- **No external state library**: React Context + useReducer is sufficient
- **localStorage** for client-side caching with 24-hour TTL
- **ESLint** enforces explicit function return types and module boundary types (warnings)
