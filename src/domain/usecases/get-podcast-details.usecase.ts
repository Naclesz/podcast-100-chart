import type { IPodcastRepository } from "../repositories/podcast.repository";
import type { PodcastDetails } from "../models/podcast.model";

/**
 * Retrieves detailed information about a specific podcast, including its episodes.
 * This is a pure function that delegates data access to the repository.
 *
 * @param repository - The podcast repository implementation
 * @param podcastId - The unique identifier of the podcast
 * @returns Promise resolving to podcast details with episodes
 */
export const getPodcastDetails = async (
  repository: IPodcastRepository,
  podcastId: string
): Promise<PodcastDetails> => {
  return await repository.getDetails(podcastId);
};
