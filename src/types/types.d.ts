//Data Types
export type Podcast = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  summary: string;
  details: PodcastDetails;
  lastUpdated: Date | null;
};

export type PodcastDetails = {
  episodes: Episode[];
  totalEpisodes: number | null;
};

export type Episode = {
  id: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  episodeUrl: string;
};

//API Responses Types
export type ListPodcastsResponse = {
  feed: {
    entry: PodcastEntry[];
  };
};

export type PodcastEntry = {
  id: {
    attributes: {
      "im:id": string;
    };
  };
  "im:name": {
    label: string;
  };
  "im:artist": {
    label: string;
  };
  "im:image": {
    label: string;
    attributes: {
      height: string;
    };
  }[];
  summary: {
    label: string;
  };
};

export type DetailResponse = {
  resultCount: number;
  results: EpisodeEntry[];
};

export type EpisodeEntry = {
  wrapperType: string;
  trackId: number;
  trackName: string;
  description: string;
  releaseDate: string;
  episodeUrl: string;
  trackTimeMillis: number;
  trackCount: number;
};
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
};
