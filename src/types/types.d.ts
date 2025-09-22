export type Podcast = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  details: PodcastDetails;
  lastUpdated: Date;
};

export type PodcastDetails = {
  episodes: Episode[];
};

export type Episode = {
  id: string;
  title: string;
  duration: string;
  date: string;
};
