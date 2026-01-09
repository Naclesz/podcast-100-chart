import type { IPodcastRepository } from "domain/repositories/podcast.repository";
import type { Podcast, PodcastDetails } from "domain/models/podcast.model";
import type { IHttpClient } from "../http/http-client";
import { mapPodcastEntryToPodcast, mapEpisodeEntryToEpisode } from "../mappers";
import type {
  ListPodcastsResponse,
  DetailResponse,
  EpisodeEntry,
} from "../dto/itunes-api.dto";

/**
 * HttpPodcastRepository is an ADAPTER that implements the IPodcastRepository PORT.
 * It handles communication with the iTunes API via HTTP.
 */
export class HttpPodcastRepository implements IPodcastRepository {
  private readonly httpClient: IHttpClient;
  private readonly listPodcastsUrl: string;
  private readonly detailUrlBuilder: (podcastId: string) => string;

  constructor(
    httpClient: IHttpClient,
    listPodcastsUrl: string,
    detailUrlBuilder: (podcastId: string) => string
  ) {
    this.httpClient = httpClient;
    this.listPodcastsUrl = listPodcastsUrl;
    this.detailUrlBuilder = detailUrlBuilder;
  }

  async getAll(): Promise<Podcast[]> {
    const response = await this.httpClient.get<ListPodcastsResponse>(
      this.listPodcastsUrl
    );

    return response?.feed?.entry.map(mapPodcastEntryToPodcast) || [];
  }

  async getDetails(podcastId: string): Promise<PodcastDetails> {
    const url = this.detailUrlBuilder(podcastId);
    const response = await this.httpClient.get<DetailResponse>(url);

    const episodes =
      response?.results
        ?.filter((result) => result.wrapperType === "podcastEpisode")
        .map(mapEpisodeEntryToEpisode) || [];

    const totalEpisodes = this.getTotalEpisodes(response?.results || []);

    return {
      episodes,
      totalEpisodes,
    };
  }

  private getTotalEpisodes(results: EpisodeEntry[]): number {
    const trackInfo = results.find((result) => result.wrapperType === "track");
    return trackInfo?.trackCount || 0;
  }
}
