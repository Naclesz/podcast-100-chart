import type { Podcast, PodcastDetails } from "../models/podcast.model";

/**
 * IPodcastRepository defines the contract for podcast data access.
 * This is a PORT in hexagonal architecture - the domain defines what it needs,
 * and the infrastructure layer provides concrete implementations (ADAPTERS).
 */
export interface IPodcastRepository {
  /**
   * Retrieves all podcasts from the data source.
   * @returns Promise resolving to an array of Podcast entities
   */
  getAll(): Promise<Podcast[]>;

  /**
   * Retrieves detailed information about a specific podcast, including episodes.
   * @param podcastId - The unique identifier of the podcast
   * @returns Promise resolving to PodcastDetails
   */
  getDetails(podcastId: string): Promise<PodcastDetails>;
}
