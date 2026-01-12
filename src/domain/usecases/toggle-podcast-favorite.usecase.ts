import type { Podcast } from "../models/podcast.model";

export const togglePodcastFavorite = (
  podcasts: Podcast[],
  podcastId: string
): Podcast[] => {
  return podcasts.map((podcast) =>
    podcast.id === podcastId
      ? { ...podcast, favorite: !podcast.favorite }
      : podcast
  );
};
