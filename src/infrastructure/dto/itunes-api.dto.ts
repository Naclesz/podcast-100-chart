// iTunes API Response Types (External API Contracts)

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
  closedCaptioning?: string;
};
