import { buildListPodcastsUrl, buildPodcastDetailUrl } from "config/api.config";
import type {
  DetailResponse,
  DetailResult,
  ListPodcastsResponse,
  Podcast,
  PodcastEntry,
} from "types/types";
import { getMilliseconds } from "utils/utils";
import { httpClient, type IHttpClient } from "./api.client";

export interface IPodcastService {
  getListPodcasts(): Promise<Podcast[]>;
  getPodcastDetails(podcastId: string): Promise<DetailResult | null>;
}

class PodcastService implements IPodcastService {
  constructor(private readonly httpClient: IHttpClient) {}

  async getListPodcasts(): Promise<Podcast[]> {
    const url = buildListPodcastsUrl();
    const response = await this.httpClient.get<ListPodcastsResponse>(url);

    return response.feed.entry.map(this.mapEntryToPodcast);
  }

  async getPodcastDetails(podcastId: string): Promise<DetailResult | null> {
    const url = buildPodcastDetailUrl(podcastId);
    const response = await this.httpClient.get<DetailResponse>(url);

    return response.results.length > 0 ? response.results[0] : null;
  }

  private mapEntryToPodcast(entry: PodcastEntry): Podcast {
    const largestImage = entry["im:image"].sort(
      (a, b) => parseInt(b.attributes.height) - parseInt(a.attributes.height)
    )[0];

    return {
      id: entry.id.attributes["im:id"],
      title: entry["im:name"].label,
      author: entry["im:artist"].label,
      imageUrl: largestImage?.label || "",
      details: {
        episodes: [],
      },
      lastUpdated: getMilliseconds(),
    };
  }
}

export const podcastService = new PodcastService(httpClient);
