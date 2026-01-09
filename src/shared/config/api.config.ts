export const API_BASE_URLS = {
  ITUNES: "/api/itunes",
} as const;

export const API_ENDPOINTS = {
  PODCASTS: {
    LIST: "/us/rss/toppodcasts/limit=100/genre=1310/json",
    DETAIL: "/lookup",
  },
} as const;

export const API_PARAMS = {
  PODCAST_DETAIL: {
    ID: "id",
  },
} as const;

export const buildApiUrl = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl}${endpoint}`;
};

export const buildPodcastDetailUrl = (podcastId: string): string => {
  return `${API_BASE_URLS.ITUNES}${API_ENDPOINTS.PODCASTS.DETAIL}?${API_PARAMS.PODCAST_DETAIL.ID}=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`;
};

export const buildListPodcastsUrl = (): string => {
  return `${API_BASE_URLS.ITUNES}${API_ENDPOINTS.PODCASTS.LIST}`;
};

export const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  headers: {},
} as const;
