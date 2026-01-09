# Hexagonal Architecture Proposal for Podcast 100 Chart

## Overview

This document outlines the migration from the current layered architecture to a **hexagonal (ports & adapters) architecture** following functional programming principles and React best practices.

### Key Principles

1. **Domain-centric**: Business logic is isolated and framework-agnostic
2. **Functional approach**: Use pure functions instead of classes (except for repositories)
3. **Dependency inversion**: Dependencies point inward toward the domain
4. **Unidirectional flow**: UI → Application → Domain → Infrastructure

---

## Proposed Directory Structure

```
src/
├── domain/                          # Core business logic (pure, framework-agnostic)
│   ├── models/                      # Domain entities
│   │   ├── podcast.model.ts         # Podcast, PodcastDetails types
│   │   └── episode.model.ts         # Episode type
│   │
│   ├── repositories/                # Repository interfaces (PORTS)
│   │   ├── podcast.repository.ts    # IPodcastRepository interface
│   │   └── storage.repository.ts    # IStorageRepository interface
│   │
│   └── usecases/                    # Pure business logic functions
│       ├── get-podcasts.usecase.ts
│       ├── get-podcast-details.usecase.ts
│       ├── filter-podcasts.usecase.ts
│       └── get-episode.usecase.ts
│
├── infrastructure/                  # External implementations (ADAPTERS)
│   ├── adapters/                    # Repository implementations
│   │   ├── http-podcast.repository.ts    # HTTP implementation (class)
│   │   └── localstorage.repository.ts    # localStorage implementation (class)
│   │
│   ├── http/                        # HTTP client
│   │   ├── http-client.ts
│   │   └── http-client.test.ts
│   │
│   ├── mappers/                     # API response → Domain model transformers
│   │   ├── podcast.mapper.ts        # PodcastEntry → Podcast
│   │   └── episode.mapper.ts        # EpisodeEntry → Episode
│   │
│   └── dto/                         # Data Transfer Objects (API types)
│       └── itunes-api.dto.ts        # ListPodcastsResponse, DetailResponse, etc.
│
├── application/                     # Application layer (React-specific)
│   ├── hooks/                       # Custom hooks using domain usecases
│   │   ├── usePodcasts.tsx
│   │   ├── usePodcastDetail.tsx
│   │   └── useEpisode.tsx
│   │
│   ├── context/                     # State management
│   │   ├── AppContext.tsx
│   │   └── NavigationContext.tsx
│   │
│   └── di/                          # Dependency injection / composition root
│       └── dependencies.ts          # Create and wire up repositories
│
├── presentation/                    # UI layer
│   ├── components/                  # React components (Atomic Design)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   │
│   ├── pages/                       # Route components
│   │   ├── HomePage/
│   │   ├── PodcastPage/
│   │   └── EpisodePage/
│   │
│   └── router/                      # Routing configuration
│       └── routes.tsx
│
├── shared/                          # Shared utilities and configuration
│   ├── config/
│   │   └── api.config.ts
│   ├── utils/
│   │   ├── utils.ts
│   │   └── profiler.ts
│   └── constants/
│       └── cache.constants.ts       # CACHE_DURATION, etc.
│
├── styles/                          # Global styles
└── test/                            # Test setup and utilities
```

---

## Layer Responsibilities

### 1. Domain Layer (`domain/`)

**Purpose**: Contains pure business logic, isolated from frameworks and external dependencies.

#### `models/`
Domain entities representing core concepts:
```typescript
// domain/models/podcast.model.ts
export type Podcast = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  summary: string;
  details: PodcastDetails;
  lastUpdated: Date | null;
};

export type PodcastDetails = {
  episodes: Episode[];
  totalEpisodes: number | null;
};
```

#### `repositories/` (PORTS)
Interfaces defining contracts for data access:
```typescript
// domain/repositories/podcast.repository.ts
import type { Podcast, PodcastDetails } from '../models/podcast.model';

export interface IPodcastRepository {
  getAll(): Promise<Podcast[]>;
  getDetails(podcastId: string): Promise<PodcastDetails>;
}
```

```typescript
// domain/repositories/storage.repository.ts
export interface IStorageRepository<T> {
  get(key: string): T | null;
  set(key: string, value: T): void;
  remove(key: string): void;
  isStale(key: string, maxAgeMs: number): boolean;
}
```

#### `usecases/` (Business Logic)
Pure functions implementing business operations:
```typescript
// domain/usecases/get-podcasts.usecase.ts
import type { IPodcastRepository } from '../repositories/podcast.repository';
import type { Podcast } from '../models/podcast.model';

export const getPodcasts = async (
  repository: IPodcastRepository
): Promise<Podcast[]> => {
  return await repository.getAll();
};
```

```typescript
// domain/usecases/filter-podcasts.usecase.ts
import type { Podcast } from '../models/podcast.model';

export const filterPodcasts = (
  podcasts: Podcast[],
  searchTerm: string
): Podcast[] => {
  if (!searchTerm.trim()) return podcasts;

  const term = searchTerm.toLowerCase();
  return podcasts.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(term) ||
      podcast.author.toLowerCase().includes(term)
  );
};
```

```typescript
// domain/usecases/get-podcast-details.usecase.ts
import type { IPodcastRepository } from '../repositories/podcast.repository';
import type { PodcastDetails } from '../models/podcast.model';

export const getPodcastDetails = async (
  repository: IPodcastRepository,
  podcastId: string
): Promise<PodcastDetails> => {
  return await repository.getDetails(podcastId);
};
```

---

### 2. Infrastructure Layer (`infrastructure/`)

**Purpose**: Implements domain interfaces using concrete technologies (HTTP, localStorage, etc.).

#### `adapters/` (Repository Implementations)
Concrete implementations of repository interfaces:
```typescript
// infrastructure/adapters/http-podcast.repository.ts
import type { IPodcastRepository } from 'domain/repositories/podcast.repository';
import type { Podcast, PodcastDetails } from 'domain/models/podcast.model';
import type { IHttpClient } from '../http/http-client';
import { mapPodcastEntryToPodcast } from '../mappers/podcast.mapper';
import { mapEpisodeEntryToEpisode } from '../mappers/episode.mapper';
import type { ListPodcastsResponse, DetailResponse } from '../dto/itunes-api.dto';

export class HttpPodcastRepository implements IPodcastRepository {
  constructor(
    private readonly httpClient: IHttpClient,
    private readonly baseUrl: string
  ) {}

  async getAll(): Promise<Podcast[]> {
    const url = `${this.baseUrl}/podcasts/100`;
    const response = await this.httpClient.get<ListPodcastsResponse>(url);

    return response?.feed?.entry.map(mapPodcastEntryToPodcast) || [];
  }

  async getDetails(podcastId: string): Promise<PodcastDetails> {
    const url = `${this.baseUrl}/podcasts/${podcastId}`;
    const response = await this.httpClient.get<DetailResponse>(url);

    const episodes = response?.results
      ?.filter((result) => result.wrapperType === 'podcastEpisode')
      .map(mapEpisodeEntryToEpisode) || [];

    const totalEpisodes = this.getTotalEpisodes(response?.results || []);

    return { episodes, totalEpisodes };
  }

  private getTotalEpisodes(results: any[]): number {
    const trackInfo = results.find((result) => result.wrapperType === 'track');
    return trackInfo?.trackCount || 0;
  }
}
```

```typescript
// infrastructure/adapters/localstorage.repository.ts
import type { IStorageRepository } from 'domain/repositories/storage.repository';

export class LocalStorageRepository<T> implements IStorageRepository<T> {
  get(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      return parsed.data as T;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  set(key: string, value: T): void {
    try {
      const item = {
        data: value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  isStale(key: string, maxAgeMs: number): boolean {
    try {
      const item = localStorage.getItem(key);
      if (!item) return true;

      const parsed = JSON.parse(item);
      const age = Date.now() - (parsed.timestamp || 0);
      return age > maxAgeMs;
    } catch {
      return true;
    }
  }
}
```

#### `mappers/`
Transform external API data to domain models:
```typescript
// infrastructure/mappers/podcast.mapper.ts
import type { PodcastEntry } from '../dto/itunes-api.dto';
import type { Podcast } from 'domain/models/podcast.model';

export const mapPodcastEntryToPodcast = (entry: PodcastEntry): Podcast => {
  const largestImage = entry['im:image'].sort(
    (a, b) => parseInt(b.attributes.height) - parseInt(a.attributes.height)
  )[0];

  return {
    id: entry.id.attributes['im:id'],
    title: entry['im:name'].label,
    author: entry['im:artist'].label,
    summary: entry.summary.label,
    imageUrl: largestImage?.label || '',
    details: {
      episodes: [],
      totalEpisodes: null,
    },
    lastUpdated: null,
  };
};
```

#### `dto/`
API response types (external contracts):
```typescript
// infrastructure/dto/itunes-api.dto.ts
export type ListPodcastsResponse = {
  feed: {
    entry: PodcastEntry[];
  };
};

export type PodcastEntry = {
  id: { attributes: { 'im:id': string } };
  'im:name': { label: string };
  'im:artist': { label: string };
  'im:image': { label: string; attributes: { height: string } }[];
  summary: { label: string };
};

// ... other API types
```

---

### 3. Application Layer (`application/`)

**Purpose**: Orchestrates domain usecases with React-specific patterns (hooks, context).

#### `hooks/`
React hooks that use domain usecases:
```typescript
// application/hooks/usePodcasts.tsx
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getPodcasts } from 'domain/usecases/get-podcasts.usecase';
import { filterPodcasts } from 'domain/usecases/filter-podcasts.usecase';
import { podcastRepository } from '../di/dependencies';

export const usePodcasts = (searchTerm: string) => {
  const { state, dispatch } = useContext(AppContext);
  const [filteredPodcasts, setFilteredPodcasts] = useState(state.podcasts);

  useEffect(() => {
    const fetchPodcasts = async () => {
      if (state.podcasts.length > 0) return; // Already loaded

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const podcasts = await getPodcasts(podcastRepository);
        dispatch({ type: 'SET_PODCASTS', payload: podcasts });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchPodcasts();
  }, []);

  useEffect(() => {
    const filtered = filterPodcasts(state.podcasts, searchTerm);
    setFilteredPodcasts(filtered);
  }, [searchTerm, state.podcasts]);

  return {
    podcasts: filteredPodcasts,
    loading: state.loading,
    error: state.error,
  };
};
```

#### `di/dependencies.ts` (Dependency Injection / Composition Root)
Wire up all dependencies in one place:
```typescript
// application/di/dependencies.ts
import { HttpPodcastRepository } from 'infrastructure/adapters/http-podcast.repository';
import { LocalStorageRepository } from 'infrastructure/adapters/localstorage.repository';
import { httpClient } from 'infrastructure/http/http-client';
import { API_BASE_URL } from 'shared/config/api.config';

// Create repository instances
export const podcastRepository = new HttpPodcastRepository(
  httpClient,
  API_BASE_URL
);

export const storageRepository = new LocalStorageRepository();
```

---

### 4. Presentation Layer (`presentation/`)

**Purpose**: UI components and routing (React-specific).

- Components remain unchanged (atomic design structure)
- Pages consume hooks from `application/hooks/`
- Router configuration stays the same

---

## Migration Strategy

### Phase 1: Setup New Structure (No Breaking Changes)
1. Create new directory structure alongside existing code
2. Move types to appropriate locations:
   - Domain models → `domain/models/`
   - API DTOs → `infrastructure/dto/`

### Phase 2: Extract Domain Logic
1. Create repository interfaces in `domain/repositories/`
2. Create usecases as pure functions in `domain/usecases/`
3. Keep existing services working

### Phase 3: Implement Infrastructure Adapters
1. Create `HttpPodcastRepository` class in `infrastructure/adapters/`
2. Create mappers in `infrastructure/mappers/`
3. Move HTTP client to `infrastructure/http/`

### Phase 4: Update Application Layer
1. Create `application/di/dependencies.ts` composition root
2. Update hooks to use domain usecases and DI repositories
3. Update context to use new repositories

### Phase 5: Update Presentation Layer
1. Move components to `presentation/components/`
2. Move pages to `presentation/pages/`
3. Move router to `presentation/router/`

### Phase 6: Cleanup
1. Remove old `src/services/` directory
2. Update all import paths
3. Update tests
4. Update documentation

---

## Benefits of This Architecture

1. **Testability**: Domain logic is pure functions, easy to test without mocks
2. **Flexibility**: Can swap HTTP client, localStorage, or external APIs without touching domain
3. **Clarity**: Each layer has a single responsibility
4. **Maintainability**: Business logic is isolated and framework-agnostic
5. **Scalability**: Easy to add new features following the same pattern

---

## Example: Adding a New Feature

**Task**: Add caching with TTL (time-to-live) for podcasts

1. **Domain**: Update `IPodcastRepository` interface if needed
2. **Infrastructure**: Create `CachedPodcastRepository` decorator class
3. **Application**: Update `dependencies.ts` to wrap repository with caching
4. **Presentation**: No changes needed!

```typescript
// infrastructure/adapters/cached-podcast.repository.ts
export class CachedPodcastRepository implements IPodcastRepository {
  constructor(
    private readonly innerRepository: IPodcastRepository,
    private readonly storage: IStorageRepository<Podcast[]>,
    private readonly cacheKey: string,
    private readonly ttl: number
  ) {}

  async getAll(): Promise<Podcast[]> {
    if (!this.storage.isStale(this.cacheKey, this.ttl)) {
      const cached = this.storage.get(this.cacheKey);
      if (cached) return cached;
    }

    const podcasts = await this.innerRepository.getAll();
    this.storage.set(this.cacheKey, podcasts);
    return podcasts;
  }

  // ... getDetails with similar caching logic
}
```

---

## Key Differences from Current Architecture

| Aspect | Current | Hexagonal |
|--------|---------|-----------|
| Business Logic | Mixed in `PodcastService` class | Pure functions in `domain/usecases/` |
| Data Access | Tightly coupled to HTTP client | Interface in domain, implementation in infrastructure |
| Types | All in one `types.d.ts` file | Separated: domain models vs API DTOs |
| Dependencies | Services depend on concrete implementations | Depend on interfaces (dependency inversion) |
| Testing | Must mock HTTP client | Can test usecases with fake repositories |
| React Integration | Hooks directly use services | Hooks use usecases + DI repositories |

---

## Conclusion

This hexagonal architecture provides a clean separation of concerns while maintaining a functional, React-friendly approach. The domain layer is pure and testable, infrastructure is swappable, and the application layer orchestrates everything with React hooks and context.

The migration can be done incrementally without breaking existing functionality, allowing for a smooth transition.
