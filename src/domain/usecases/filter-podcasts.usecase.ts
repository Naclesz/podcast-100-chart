import type { Podcast } from "../models/podcast.model";

/**
 * Filters a list of podcasts by a search term.
 * The search is case-insensitive and matches against podcast title and author.
 * This is a pure function with no side effects.
 *
 * @param podcasts - The list of podcasts to filter
 * @param searchTerm - The search term to filter by
 * @returns Filtered array of podcasts matching the search term
 */
export const filterPodcasts = (
  podcasts: Podcast[],
  searchTerm: string
): Podcast[] => {
  if (!searchTerm.trim()) {
    return podcasts;
  }

  const term = searchTerm.toLowerCase();
  return podcasts.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(term) ||
      podcast.author.toLowerCase().includes(term)
  );
};
