import type { Episode } from "./episode.model";

export type Podcast = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  summary: string;
  details: PodcastDetails;
  lastUpdated: Date | null;
  favorite: boolean;
};

export type PodcastDetails = {
  episodes: Episode[];
  totalEpisodes: number | null;
};
