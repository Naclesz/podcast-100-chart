import { useAppContext } from "context/AppContext";
import { useEffect, useState } from "react";
import type { ApiError, Podcast } from "types/types";

type UsePodcastsState = {
  podcasts: Podcast[];
  isLoading: boolean;
  error: ApiError | null;
  filteredPodcastsCount: number;
  onFilterPodcasts: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const usePodcasts = (): UsePodcastsState => {
  const { state, loadPodcasts } = useAppContext();
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcastsCount, setFilteredPodcastsCount] = useState(0);

  useEffect(() => {
    loadPodcasts();
  }, [loadPodcasts]);

  useEffect(() => {
    setFilteredPodcasts(state.podcasts);
    setFilteredPodcastsCount(state.podcasts.length);
  }, [state.podcasts]);

  function onFilterPodcasts(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    const filter = state.podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(value.toLowerCase()) ||
        podcast.author.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPodcasts(filter);
    setFilteredPodcastsCount(filter.length);
  }

  return {
    isLoading: state.isLoading,
    podcasts: filteredPodcasts,
    filteredPodcastsCount,
    error: state.error,
    onFilterPodcasts,
  };
};
