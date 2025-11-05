import { buildListPodcastsUrl, buildPodcastDetailUrl } from "config/api.config";
import type {
  DetailResponse,
  Episode,
  EpisodeEntry,
  ListPodcastsResponse,
  Podcast,
  PodcastDetails,
  PodcastEntry,
} from "types/types";
import { formatMillisecondsToTime } from "utils/utils";
import type { IHttpClient } from "./api.client";
import { httpClient } from "./api.client";

export interface IPodcastService {
  getListPodcasts(): Promise<Podcast[]>;
  getPodcastDetails(podcastId: string): Promise<PodcastDetails | null>;
}

export class PodcastService implements IPodcastService {
  private readonly httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getListPodcasts(): Promise<Podcast[]> {
    const url = buildListPodcastsUrl();
    const response = await this.httpClient.get<ListPodcastsResponse>(url);

    return response.feed.entry.map(this.mapEntryToPodcast);
  }

  async getPodcastDetails(podcastId: string): Promise<PodcastDetails> {
    const url = buildPodcastDetailUrl(podcastId);
    const response = await this.httpClient.get<DetailResponse>(url);

    const episodes = response.results
      .filter((result) => result.wrapperType === "podcastEpisode")
      .map(this.mapDetailResultToEpisode);

    return { episodes, totalEpisodes: this.getTotalEpisodes(response.results) };
  }

  private mapEntryToPodcast(entry: PodcastEntry): Podcast {
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
    };
  }

  private mapDetailResultToEpisode(result: EpisodeEntry): Episode {
    return {
      id: result.trackId,
      title: result.trackName,
      description: result.description,
      duration: formatMillisecondsToTime(result.trackTimeMillis),
      date: new Date(result.releaseDate).toLocaleDateString(),
      episodeUrl: result.episodeUrl,
      closedCaptioning: result.closedCaptioning,
    };
  }

  private getTotalEpisodes(results: EpisodeEntry[]): number {
    const trackInfo = results.find((result) => result.wrapperType === "track");
    if (trackInfo?.trackCount) {
      return trackInfo.trackCount;
    }
    return 0;
  }
}

export const podcastService = new PodcastService(httpClient);
