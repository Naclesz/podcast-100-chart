import type { IPodcastRepository } from "../repositories/podcast.repository";
import type { Podcast } from "../models/podcast.model";

/**
 * Retrieves all podcasts from the repository.
 * This is a pure function that delegates data access to the repository.
 *
 * @param repository - The podcast repository implementation
 * @returns Promise resolving to an array of podcasts
 */
export const getPodcasts = async (
  repository: IPodcastRepository
): Promise<Podcast[]> => {
  return await repository.getAll();
};
