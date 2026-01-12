import { useAppContext } from "application/context/AppContext";
import type { ApiError, Podcast } from "domain/models";
import { filterPodcasts } from "domain/usecases/filter-podcasts.usecase";
import { useEffect, useMemo, useState } from "react";

type UsePodcastsState = {
  podcasts: Podcast[];
  isLoading: boolean;
  error: ApiError | null;
  filteredPodcastsCount: number;
  onFilterPodcasts: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFavoriteToggle: (
    e: React.MouseEvent<HTMLButtonElement>,
    podcastId: string
  ) => void;
};

export const usePodcasts = (): UsePodcastsState => {
  const { state, loadPodcasts, dispatch } = useAppContext();

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

  function onFavoriteToggle(
    e: React.MouseEvent<HTMLButtonElement>,
    podcastId: string
  ): void {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "TOGGLE_PODCAST_FAVORITE",
      payload: { podcastId },
    });
  }

  return {
    isLoading: state.isLoading,
    podcasts: filteredPodcasts,
    filteredPodcastsCount: filteredPodcasts.length,
    error: state.error,
    onFilterPodcasts,
    onFavoriteToggle,
  };
};
