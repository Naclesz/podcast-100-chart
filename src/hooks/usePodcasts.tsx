import { useEffect, useState } from "react";
import { podcastService } from "services/podcast.service";
import type { ApiError, Podcast } from "types/types";

type UsePodcastsState = {
  podcasts: Podcast[];
  isLoading: boolean;
  error: ApiError | null;
  filteredPodcastsCount: number;
  onFilterPodcasts: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const usePodcasts = (): UsePodcastsState => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcastsCount, setFilteredPodcastsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  async function fetchPodcasts(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const podcasts = await podcastService.getListPodcasts();

      setPodcasts(podcasts);
      setFilteredPodcasts(podcasts);
      setFilteredPodcastsCount(podcasts.length);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      cleanPodcasts();
      setIsLoading(false);
      setError({
        message: error instanceof Error ? error.message : "Error desconocido",
        status: (error as ApiError)?.status,
        code: (error as ApiError)?.code,
      });
    }
  }

  useEffect(() => {
    fetchPodcasts();
  }, []);

  function onFilterPodcasts(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    const filter = podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(value.toLowerCase()) ||
        podcast.author.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPodcasts(filter);
    setFilteredPodcastsCount(filter.length);
  }

  function cleanPodcasts(): void {
    setPodcasts([]);
    setFilteredPodcasts([]);
    setFilteredPodcastsCount(0);
  }

  return {
    isLoading,
    podcasts: filteredPodcasts,
    filteredPodcastsCount,
    error,
    onFilterPodcasts,
  };
};
