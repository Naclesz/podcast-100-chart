import type { Episode } from "domain/models/episode.model";
import type { EpisodeEntry } from "../dto/itunes-api.dto";
import { formatMillisecondsToTime } from "shared/utils/utils";

/**
 * Maps an iTunes API EpisodeEntry to a domain Episode model.
 * Formats duration from milliseconds to human-readable time.
 * Formats release date to locale date string.
 *
 * @param entry - The episode entry from the iTunes API response
 * @returns A domain Episode entity
 */
export const mapEpisodeEntryToEpisode = (entry: EpisodeEntry): Episode => {
  return {
    id: entry.trackId,
    title: entry.trackName,
    description: entry.description,
    duration: entry.trackTimeMillis
      ? formatMillisecondsToTime(entry.trackTimeMillis)
      : "",
    date: entry.releaseDate
      ? new Date(entry.releaseDate).toLocaleDateString()
      : "",
    episodeUrl: entry.episodeUrl,
    closedCaptioning: entry.closedCaptioning,
  };
};
