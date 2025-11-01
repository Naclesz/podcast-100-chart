import type { DetailResponse, ListPodcastsResponse } from "types/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IHttpClient } from "./api.client";
import { PodcastService } from "./podcast.service";

describe("PodcastService", () => {
  let mockHttpClient: IHttpClient;
  let podcastService: PodcastService;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
    };
    podcastService = new PodcastService(mockHttpClient);
  });

  describe("getListPodcasts", () => {
    it("should fetch and map podcasts correctly", async () => {
      const mockResponse: ListPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { "im:id": "123" } },
              "im:name": { label: "Test Podcast" },
              "im:artist": { label: "Test Author" },
              "im:image": [
                { label: "small.jpg", attributes: { height: "55" } },
                { label: "large.jpg", attributes: { height: "170" } },
                { label: "medium.jpg", attributes: { height: "100" } },
              ],
              summary: { label: "Test summary" },
            },
          ],
        },
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getListPodcasts();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("/us/rss/toppodcasts")
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "123",
        title: "Test Podcast",
        author: "Test Author",
        imageUrl: "large.jpg",
        details: { episodes: [] },
      });
      expect(result[0].lastUpdated).toBeNull();
    });

    it("should select the largest image from available images", async () => {
      const mockResponse: ListPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { "im:id": "456" } },
              "im:name": { label: "Podcast 2" },
              "im:artist": { label: "Author 2" },
              "im:image": [
                { label: "tiny.jpg", attributes: { height: "30" } },
                { label: "huge.jpg", attributes: { height: "600" } },
                { label: "medium.jpg", attributes: { height: "100" } },
              ],
              summary: { label: "Summary" },
            },
          ],
        },
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getListPodcasts();

      expect(result[0].imageUrl).toBe("huge.jpg");
    });

    it("should handle multiple podcasts", async () => {
      const mockResponse: ListPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { "im:id": "1" } },
              "im:name": { label: "Podcast 1" },
              "im:artist": { label: "Author 1" },
              "im:image": [
                { label: "img1.jpg", attributes: { height: "100" } },
              ],
              summary: { label: "Summary 1" },
            },
            {
              id: { attributes: { "im:id": "2" } },
              "im:name": { label: "Podcast 2" },
              "im:artist": { label: "Author 2" },
              "im:image": [
                { label: "img2.jpg", attributes: { height: "100" } },
              ],
              summary: { label: "Summary 2" },
            },
          ],
        },
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getListPodcasts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });

    it("should handle empty image array gracefully", async () => {
      const mockResponse: ListPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { "im:id": "789" } },
              "im:name": { label: "No Image Podcast" },
              "im:artist": { label: "No Image Author" },
              "im:image": [],
              summary: { label: "Summary" },
            },
          ],
        },
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getListPodcasts();

      expect(result[0].imageUrl).toBe("");
    });
  });

  describe("getPodcastDetails", () => {
    it("should fetch and map podcast details with episodes correctly", async () => {
      const mockResponse: DetailResponse = {
        resultCount: 3,
        results: [
          {
            wrapperType: "track",
            trackId: 0,
            trackName: "Podcast Info",
            description: "",
            releaseDate: "",
            episodeUrl: "",
            trackTimeMillis: 0,
            trackCount: 50,
          },
          {
            wrapperType: "podcastEpisode",
            trackId: 1001,
            trackName: "Episode 1: Introduction",
            description: "This is the first episode",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "https://example.com/episode1.mp3",
            trackTimeMillis: 1800000, // 30 minutes
            trackCount: 0,
          },
          {
            wrapperType: "podcastEpisode",
            trackId: 1002,
            trackName: "Episode 2: Deep Dive",
            description: "This is the second episode",
            releaseDate: "2024-01-22T10:00:00Z",
            episodeUrl: "https://example.com/episode2.mp3",
            trackTimeMillis: 2700000, // 45 minutes
            trackCount: 0,
          },
        ],
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getPodcastDetails("123");

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("/lookup?id=123")
      );
      expect(result.episodes).toHaveLength(2);
      expect(result.totalEpisodes).toBe(50);
      expect(result.episodes[0]).toMatchObject({
        id: 1001,
        title: "Episode 1: Introduction",
        description: "This is the first episode",
        duration: "30:00",
        date: "1/15/2024",
        episodeUrl: "https://example.com/episode1.mp3",
      });
    });

    it("should filter out non-episode entries", async () => {
      const mockResponse: DetailResponse = {
        resultCount: 4,
        results: [
          {
            wrapperType: "track",
            trackId: 0,
            trackName: "Podcast Info",
            description: "",
            releaseDate: "",
            episodeUrl: "",
            trackTimeMillis: 0,
            trackCount: 25,
          },
          {
            wrapperType: "podcastEpisode",
            trackId: 1001,
            trackName: "Valid Episode",
            description: "This should be included",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "https://example.com/episode1.mp3",
            trackTimeMillis: 1800000,
            trackCount: 0,
          },
          {
            wrapperType: "audiobook",
            trackId: 2001,
            trackName: "Not an Episode",
            description: "This should be filtered out",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "",
            trackTimeMillis: 0,
            trackCount: 0,
          },
          {
            wrapperType: "song",
            trackId: 3001,
            trackName: "Also Not an Episode",
            description: "This should also be filtered out",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "",
            trackTimeMillis: 0,
            trackCount: 0,
          },
        ],
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getPodcastDetails("456");

      expect(result.episodes).toHaveLength(1);
      expect(result.episodes[0].title).toBe("Valid Episode");
      expect(result.totalEpisodes).toBe(25);
    });

    it("should handle empty results gracefully", async () => {
      const mockResponse: DetailResponse = {
        resultCount: 0,
        results: [],
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getPodcastDetails("789");

      expect(result.episodes).toHaveLength(0);
      expect(result.totalEpisodes).toBe(0);
    });

    it("should handle missing track info for total episodes", async () => {
      const mockResponse: DetailResponse = {
        resultCount: 1,
        results: [
          {
            wrapperType: "podcastEpisode",
            trackId: 1001,
            trackName: "Lonely Episode",
            description: "Only episode with no track info",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "https://example.com/episode1.mp3",
            trackTimeMillis: 1800000,
            trackCount: 0,
          },
        ],
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getPodcastDetails("999");

      expect(result.episodes).toHaveLength(1);
      expect(result.totalEpisodes).toBe(0);
    });

    it("should format episode duration correctly", async () => {
      const mockResponse: DetailResponse = {
        resultCount: 2,
        results: [
          {
            wrapperType: "podcastEpisode",
            trackId: 1001,
            trackName: "Short Episode",
            description: "5 minute episode",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "https://example.com/short.mp3",
            trackTimeMillis: 300000, // 5 minutes
            trackCount: 0,
          },
          {
            wrapperType: "podcastEpisode",
            trackId: 1002,
            trackName: "Long Episode",
            description: "2 hour episode",
            releaseDate: "2024-01-15T10:00:00Z",
            episodeUrl: "https://example.com/long.mp3",
            trackTimeMillis: 7200000, // 2 hours
            trackCount: 0,
          },
        ],
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getPodcastDetails("duration-test");

      expect(result.episodes[0].duration).toBe("05:00");
      expect(result.episodes[1].duration).toBe("00:00");
    });

    it("should format episode dates correctly", async () => {
      const mockResponse: DetailResponse = {
        resultCount: 1,
        results: [
          {
            wrapperType: "podcastEpisode",
            trackId: 1001,
            trackName: "Date Test Episode",
            description: "Testing date formatting",
            releaseDate: "2024-12-25T15:30:00Z",
            episodeUrl: "https://example.com/date-test.mp3",
            trackTimeMillis: 1800000,
            trackCount: 0,
          },
        ],
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await podcastService.getPodcastDetails("date-test");

      expect(result.episodes[0].date).toBe("12/25/2024");
    });
  });
});
