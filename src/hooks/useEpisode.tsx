import { useAppContext } from "context/AppContext";
import { useMemo } from "react";
import type { Episode, Podcast } from "types/types";
import { getEpisode } from "domain/usecases/get-episode.usecase";

type UseEpisodeState = {
  podcast: Podcast;
  episode: Episode;
};

export const useEpisode = (
  podcastId: string,
  episodeId: string
): UseEpisodeState => {
  const { state } = useAppContext();

  const result = useMemo(
    () => getEpisode(state.podcasts, podcastId, episodeId),
    [state.podcasts, podcastId, episodeId]
  );

  return {
    podcast: result.podcast as Podcast,
    episode: result.episode as Episode,
  };
};
