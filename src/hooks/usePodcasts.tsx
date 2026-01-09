import { useAppContext } from "context/AppContext";
import { useEffect, useMemo, useState } from "react";
import type { ApiError, Podcast } from "types/types";
import { filterPodcasts } from "domain/usecases/filter-podcasts.usecase";

type UsePodcastsState = {
  podcasts: Podcast[];
  isLoading: boolean;
  error: ApiError | null;
  filteredPodcastsCount: number;
  onFilterPodcasts: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const usePodcasts = (): UsePodcastsState => {
  const { state, loadPodcasts } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPodcasts = useMemo(() => {
    return filterPodcasts(state.podcasts, searchTerm);
  }, [state.podcasts, searchTerm]);

  useEffect(() => {
    loadPodcasts();
  }, [loadPodcasts]);

  function onFilterPodcasts(event: React.ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(event.target.value);
  }

  return {
    isLoading: state.isLoading,
    podcasts: filteredPodcasts,
    filteredPodcastsCount: filteredPodcasts.length,
    error: state.error,
    onFilterPodcasts,
  };
};
