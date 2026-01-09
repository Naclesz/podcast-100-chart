import { describe, it, expect, beforeEach } from "vitest";
import {
  MockPodcastRepository,
  createMockPodcastRepository,
  createMockPodcastRepositoryWithDetails,
} from "./mock-podcast.repository";
import type { Podcast, PodcastDetails } from "domain/models/podcast.model";

describe("MockPodcastRepository", () => {
  let repository: MockPodcastRepository;

  beforeEach(() => {
    repository = new MockPodcastRepository();
  });

  describe("getAll", () => {
    it("should return default podcasts", async () => {
      const podcasts = await repository.getAll();

      expect(podcasts).toHaveLength(3);
      expect(podcasts[0]).toMatchObject({
        id: "1",
        title: "Test Podcast 1",
        author: "Test Author 1",
      });
    });

    it("should return custom podcasts when set", async () => {
      const customPodcasts: Podcast[] = [
        {
          id: "custom-1",
          title: "Custom Podcast",
          author: "Custom Author",
          imageUrl: "https://example.com/custom.jpg",
          summary: "Custom summary",
          details: { episodes: [], totalEpisodes: null },
          lastUpdated: null,
        },
      ];

      repository.setPodcasts(customPodcasts);
      const podcasts = await repository.getAll();

      expect(podcasts).toHaveLength(1);
      expect(podcasts[0].id).toBe("custom-1");
      expect(podcasts[0].title).toBe("Custom Podcast");
    });

    it("should return a copy to prevent test pollution", async () => {
      const podcasts1 = await repository.getAll();
      const podcasts2 = await repository.getAll();

      // Modify first result
      podcasts1[0].title = "Modified Title";

      // Second result should not be affected
      expect(podcasts2[0].title).toBe("Test Podcast 1");
    });

    it("should simulate delay when configured", async () => {
      repository.setDelay(100);

      const startTime = Date.now();
      await repository.getAll();
      const endTime = Date.now();

      // Allow small timing variance (95ms instead of 100ms)
      expect(endTime - startTime).toBeGreaterThanOrEqual(95);
    });

    it("should throw error when configured", async () => {
      repository.setShouldThrowError(true, "Custom error message");

      await expect(repository.getAll()).rejects.toThrow("Custom error message");
    });
  });

  describe("getDetails", () => {
    it("should return podcast details when set", async () => {
      const details: PodcastDetails = {
        episodes: [
          {
            id: 1,
            title: "Test Episode",
            description: "Test description",
            duration: "30:00",
            date: "1/1/2024",
            episodeUrl: "https://example.com/episode.mp3",
          },
        ],
        totalEpisodes: 1,
      };

      repository.setPodcastDetails("1", details);
      const result = await repository.getDetails("1");

      expect(result.episodes).toHaveLength(1);
      expect(result.episodes[0].title).toBe("Test Episode");
      expect(result.totalEpisodes).toBe(1);
    });

    it("should throw error for non-existent podcast", async () => {
      await expect(repository.getDetails("non-existent")).rejects.toThrow(
        'Podcast with ID "non-existent" not found'
      );
    });

    it("should return a copy to prevent test pollution", async () => {
      const details: PodcastDetails = {
        episodes: [
          {
            id: 1,
            title: "Original Title",
            description: "Test description",
            duration: "30:00",
            date: "1/1/2024",
            episodeUrl: "https://example.com/episode.mp3",
          },
        ],
        totalEpisodes: 1,
      };

      repository.setPodcastDetails("1", details);

      const result1 = await repository.getDetails("1");
      const result2 = await repository.getDetails("1");

      // Modify first result
      result1.episodes[0].title = "Modified Title";

      // Second result should not be affected
      expect(result2.episodes[0].title).toBe("Original Title");
    });

    it("should simulate delay when configured", async () => {
      repository.setPodcastDetails("1", {
        episodes: [],
        totalEpisodes: 0,
      });
      repository.setDelay(100);

      const startTime = Date.now();
      await repository.getDetails("1");
      const endTime = Date.now();

      // Allow small timing variance (95ms instead of 100ms)
      expect(endTime - startTime).toBeGreaterThanOrEqual(95);
    });

    it("should throw error when configured", async () => {
      repository.setPodcastDetails("1", {
        episodes: [],
        totalEpisodes: 0,
      });
      repository.setShouldThrowError(true, "Details error");

      await expect(repository.getDetails("1")).rejects.toThrow("Details error");
    });
  });

  describe("reset", () => {
    it("should reset to default state", async () => {
      // Configure custom state
      repository.setPodcasts([]);
      repository.setDelay(100);
      repository.setShouldThrowError(true);

      // Reset
      repository.reset();

      // Should be back to defaults
      const podcasts = await repository.getAll();
      expect(podcasts).toHaveLength(3);
    });
  });

  describe("factory functions", () => {
    it("createMockPodcastRepository should create repository with config", () => {
      const customPodcasts: Podcast[] = [
        {
          id: "factory-1",
          title: "Factory Podcast",
          author: "Factory Author",
          imageUrl: "https://example.com/factory.jpg",
          summary: "Factory summary",
          details: { episodes: [], totalEpisodes: null },
          lastUpdated: null,
        },
      ];

      const repo = createMockPodcastRepository({
        podcasts: customPodcasts,
        delay: 50,
      });

      expect(repo).toBeInstanceOf(MockPodcastRepository);
    });

    it("createMockPodcastRepositoryWithDetails should include episode data", async () => {
      const repo = createMockPodcastRepositoryWithDetails();

      const details = await repo.getDetails("1");

      expect(details.episodes).toHaveLength(2);
      expect(details.episodes[0].title).toBe("Episode 1: Introduction");
      expect(details.totalEpisodes).toBe(2);
    });
  });

  describe("LSP - Liskov Substitution Principle", () => {
    it("should be usable anywhere IPodcastRepository is expected", async () => {
      // This test demonstrates that MockPodcastRepository can replace
      // any implementation of IPodcastRepository without breaking code

      // Example: a function that uses IPodcastRepository
      async function fetchAndProcessPodcasts(
        repo: { getAll: () => Promise<Podcast[]> }
      ): Promise<string[]> {
        const podcasts = await repo.getAll();
        return podcasts.map((p) => p.title);
      }

      const titles = await fetchAndProcessPodcasts(repository);

      expect(titles).toContain("Test Podcast 1");
      expect(titles).toContain("Test Podcast 2");
      expect(titles).toContain("Test Podcast 3");
    });
  });
});
