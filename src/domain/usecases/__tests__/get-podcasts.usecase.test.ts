import { describe, it, expect, beforeEach } from "vitest";
import { getPodcasts } from "../get-podcasts.usecase";
import {
  MockPodcastRepository,
  createMockPodcastRepository,
} from "infrastructure/adapters/mock-podcast.repository";
import type { Podcast } from "domain/models/podcast.model";

/**
 * Example tests for domain usecases using MockPodcastRepository
 *
 * This demonstrates the benefits of Hexagonal Architecture:
 * - Domain logic can be tested without HTTP calls
 * - No need to mock fetch or axios
 * - Tests are fast and reliable
 * - MockPodcastRepository is a real implementation, not a mock framework
 */
describe("getPodcasts usecase", () => {
  let repository: MockPodcastRepository;

  beforeEach(() => {
    repository = new MockPodcastRepository();
  });

  it("should return all podcasts from repository", async () => {
    const podcasts = await getPodcasts(repository);

    expect(podcasts).toHaveLength(3);
    expect(podcasts[0].title).toBe("Test Podcast 1");
    expect(podcasts[1].title).toBe("Test Podcast 2");
    expect(podcasts[2].title).toBe("Test Podcast 3");
  });

  it("should return empty array when repository has no podcasts", async () => {
    repository.setPodcasts([]);

    const podcasts = await getPodcasts(repository);

    expect(podcasts).toHaveLength(0);
  });

  it("should return podcasts with correct structure", async () => {
    const podcasts = await getPodcasts(repository);

    podcasts.forEach((podcast) => {
      expect(podcast).toHaveProperty("id");
      expect(podcast).toHaveProperty("title");
      expect(podcast).toHaveProperty("author");
      expect(podcast).toHaveProperty("imageUrl");
      expect(podcast).toHaveProperty("summary");
      expect(podcast).toHaveProperty("details");
      expect(podcast).toHaveProperty("lastUpdated");
    });
  });

  it("should work with custom podcast data", async () => {
    const customPodcasts: Podcast[] = [
      {
        id: "custom-1",
        title: "My Custom Podcast",
        author: "Custom Author",
        imageUrl: "https://example.com/custom.jpg",
        summary: "A custom podcast for testing",
        details: { episodes: [], totalEpisodes: null },
        lastUpdated: null,
      },
      {
        id: "custom-2",
        title: "Another Custom Podcast",
        author: "Another Author",
        imageUrl: "https://example.com/another.jpg",
        summary: "Another podcast for testing",
        details: { episodes: [], totalEpisodes: null },
        lastUpdated: null,
      },
    ];

    repository.setPodcasts(customPodcasts);

    const podcasts = await getPodcasts(repository);

    expect(podcasts).toHaveLength(2);
    expect(podcasts[0].title).toBe("My Custom Podcast");
    expect(podcasts[1].title).toBe("Another Custom Podcast");
  });

  it("should handle repository errors gracefully", async () => {
    repository.setShouldThrowError(true, "Network error");

    await expect(getPodcasts(repository)).rejects.toThrow("Network error");
  });

  it("should work with factory-created repository", async () => {
    const customRepo = createMockPodcastRepository({
      podcasts: [
        {
          id: "factory-1",
          title: "Factory Podcast",
          author: "Factory Author",
          imageUrl: "https://example.com/factory.jpg",
          summary: "Created via factory",
          details: { episodes: [], totalEpisodes: null },
          lastUpdated: null,
        },
      ],
    });

    const podcasts = await getPodcasts(customRepo);

    expect(podcasts).toHaveLength(1);
    expect(podcasts[0].title).toBe("Factory Podcast");
  });

  it("should preserve podcast data immutability", async () => {
    const podcasts1 = await getPodcasts(repository);
    const podcasts2 = await getPodcasts(repository);

    // Modify first result
    podcasts1[0].title = "Modified Title";

    // Second call should return unmodified data
    expect(podcasts2[0].title).toBe("Test Podcast 1");
  });
});
