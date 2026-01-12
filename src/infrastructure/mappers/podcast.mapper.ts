import type { Podcast } from "domain/models/podcast.model";
import type { PodcastEntry } from "../dto/itunes-api.dto";

/**
 * Maps an iTunes API PodcastEntry to a domain Podcast model.
 * Extracts the largest image from the available image sizes.
 *
 * @param entry - The podcast entry from the iTunes API response
 * @returns A domain Podcast entity
 */
export const mapPodcastEntryToPodcast = (entry: PodcastEntry): Podcast => {
  const largestImage = entry["im:image"].sort(
    (a, b) => parseInt(b.attributes.height) - parseInt(a.attributes.height)
  )[0];

  return {
    id: entry.id.attributes["im:id"],
    title: entry["im:name"].label,
    author: entry["im:artist"].label,
    summary: entry.summary.label,
    imageUrl: largestImage?.label || "",
    details: {
      episodes: [],
      totalEpisodes: null,
    },
    lastUpdated: null,
    favorite: false,
  };
};
