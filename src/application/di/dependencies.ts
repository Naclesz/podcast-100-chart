import { HttpPodcastRepository } from "infrastructure/adapters/http-podcast.repository";
import { LocalStorageRepository } from "infrastructure/adapters/localstorage.repository";
import { httpClient } from "infrastructure/http/http-client";
import {
  buildListPodcastsUrl,
  buildPodcastDetailUrl,
} from "config/api.config";
import type { Podcast } from "domain/models/podcast.model";

/**
 * Dependency Injection / Composition Root
 *
 * This file is the single place where we wire up all dependencies.
 * It creates instances of repositories (adapters) and exports them
 * for use throughout the application layer.
 *
 * Benefits:
 * - Single source of truth for dependency configuration
 * - Easy to swap implementations (e.g., mock for testing)
 * - Dependencies flow from infrastructure → application → presentation
 */

// Create the HTTP podcast repository instance
export const podcastRepository = new HttpPodcastRepository(
  httpClient,
  buildListPodcastsUrl(),
  buildPodcastDetailUrl
);

// Create the localStorage repository instance for podcast storage
export const storageRepository = new LocalStorageRepository<Podcast[]>();
