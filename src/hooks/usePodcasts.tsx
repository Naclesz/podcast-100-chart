import { useAppContext } from "context/AppContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { ApiError, Podcast } from "types/types";

type UsePodcastsState = {
  podcasts: Podcast[];
  isLoading: boolean;
  error: ApiError | null;
  filteredPodcastsCount: number;
  onFilterPodcasts: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickPodcast: (podcastId: string) => void;
};

export const usePodcasts = (): UsePodcastsState => {
  const navigate = useNavigate();

  const { state, loadPodcasts } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPodcasts = useMemo(() => {
    if (!searchTerm.trim()) return state.podcasts;

    const normalizedSearchTerm = searchTerm.toLowerCase();
    return state.podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(normalizedSearchTerm) ||
        podcast.author.toLowerCase().includes(normalizedSearchTerm)
    );
  }, [state.podcasts, searchTerm]);

  useEffect(() => {
    loadPodcasts();
  }, [loadPodcasts]);

  function onFilterPodcasts(event: React.ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(event.target.value);
  }

  function onClickPodcast(podcastId: string): void {
    navigate(`/podcast/${podcastId}`);
  }

  return {
    isLoading: state.isLoading,
    podcasts: filteredPodcasts,
    filteredPodcastsCount: filteredPodcasts.length,
    error: state.error,
    onFilterPodcasts,
    onClickPodcast,
  };
};
