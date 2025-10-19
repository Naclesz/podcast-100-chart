import type { ListPodcastsResponse } from "types/types";
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
      expect(result[0].lastUpdated).toBeTypeOf("number");
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
});
