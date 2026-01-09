import { useAppContext } from "application/context/AppContext";
import { useEffect, useMemo } from "react";
import type { Podcast } from "domain/models";

type UsePodcastDetailState = {
  podcast: Podcast;
  loadPodcastDetails: (podcastId: string) => Promise<void>;
};

export const usePodcastDetail = (podcastId: string): UsePodcastDetailState => {
  const { state, loadPodcastDetails } = useAppContext();

  const podcast = useMemo(
    () => state.podcasts.find((podcast) => podcast.id === podcastId),
    [state.podcasts, podcastId]
  );

  useEffect(() => {
    loadPodcastDetails(podcastId);
  }, [loadPodcastDetails, podcastId]);

  return {
    podcast: podcast as Podcast,
    loadPodcastDetails,
  };
};
