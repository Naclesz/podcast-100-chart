import { useAppContext } from "context/AppContext";
import type { Episode, Podcast } from "types/types";

type UseEpisodeState = {
  podcast: Podcast;
  episode: Episode;
};

export const useEpisode = (
  podcastId: string,
  episodeId: string
): UseEpisodeState => {
  const { state } = useAppContext();
  const podcast = state.podcasts.find((podcast) => podcast.id === podcastId);

  const episode = podcast?.details.episodes.find(
    (episode) => episode.id === Number(episodeId)
  );

  return { podcast: podcast as Podcast, episode: episode as Episode };
};
