import type { Podcast } from "../models/podcast.model";
import type { Episode } from "../models/episode.model";

export type GetEpisodeResult = {
  podcast: Podcast | null;
  episode: Episode | null;
};

/**
 * Retrieves a specific episode from a podcast.
 * This is a pure function that searches through podcasts to find the matching episode.
 *
 * @param podcasts - The list of podcasts to search through
 * @param podcastId - The unique identifier of the podcast
 * @param episodeId - The unique identifier of the episode (as string)
 * @returns An object containing the podcast and episode, or null values if not found
 */
export const getEpisode = (
  podcasts: Podcast[],
  podcastId: string,
  episodeId: string
): GetEpisodeResult => {
  const podcast = podcasts.find((p) => p.id === podcastId);

  if (!podcast) {
    return { podcast: null, episode: null };
  }

  const episode = podcast.details.episodes.find(
    (ep) => ep.id === Number(episodeId)
  );

  return {
    podcast,
    episode: episode || null,
  };
};
