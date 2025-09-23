//Data Types
export type Podcast = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  details: PodcastDetails;
  lastUpdated: number;
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
  results: DetailResult[];
};

export type DetailResult = {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl600: string;
  feedUrl: string;
  primaryGenreName: string;
};
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
};
