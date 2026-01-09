import type { IPodcastRepository } from "domain/repositories/podcast.repository";
import type { Podcast, PodcastDetails } from "domain/models/podcast.model";

/**
 * Mock implementation of IPodcastRepository for testing purposes.
 *
 * This class demonstrates the Liskov Substitution Principle (LSP):
 * It can be used anywhere IPodcastRepository is expected without
 * breaking the application logic.
 *
 * Features:
 * - Configurable mock data
 * - Simulated delays
 * - Error simulation
 * - Immutable data (returns copies to avoid test pollution)
 */
export class MockPodcastRepository implements IPodcastRepository {
  private podcasts: Podcast[];
  private podcastDetails: Map<string, PodcastDetails>;
  private delay: number;
  private shouldThrowError: boolean;
  private errorMessage: string;

  constructor(config?: {
    podcasts?: Podcast[];
    podcastDetails?: Map<string, PodcastDetails>;
    delay?: number;
    shouldThrowError?: boolean;
    errorMessage?: string;
  }) {
    this.podcasts = config?.podcasts || this.getDefaultPodcasts();
    this.podcastDetails = config?.podcastDetails || new Map();
    this.delay = config?.delay || 0;
    this.shouldThrowError = config?.shouldThrowError || false;
    this.errorMessage = config?.errorMessage || "Mock error";
  }

  /**
   * Returns a copy of all podcasts to prevent test pollution.
   * Simulates async behavior with optional delay.
   */
  async getAll(): Promise<Podcast[]> {
    await this.simulateDelay();
    this.throwErrorIfConfigured();

    // Return a deep copy to prevent test pollution
    return this.podcasts.map((podcast) => ({ ...podcast }));
  }

  /**
   * Returns details for a specific podcast.
   * Throws error if podcast ID is not found.
   */
  async getDetails(podcastId: string): Promise<PodcastDetails> {
    await this.simulateDelay();
    this.throwErrorIfConfigured();

    const details = this.podcastDetails.get(podcastId);
    if (!details) {
      throw new Error(`Podcast with ID "${podcastId}" not found`);
    }

    // Return a deep copy to prevent test pollution
    return {
      episodes: details.episodes.map((ep) => ({ ...ep })),
      totalEpisodes: details.totalEpisodes,
    };
  }

  // --- Configuration methods for tests ---

  /**
   * Set custom podcasts data for tests
   */
  setPodcasts(podcasts: Podcast[]): void {
    this.podcasts = podcasts;
  }

  /**
   * Set details for a specific podcast
   */
  setPodcastDetails(podcastId: string, details: PodcastDetails): void {
    this.podcastDetails.set(podcastId, details);
  }

  /**
   * Configure simulated delay in milliseconds
   */
  setDelay(ms: number): void {
    this.delay = ms;
  }

  /**
   * Configure error throwing for testing error scenarios
   */
  setShouldThrowError(shouldThrow: boolean, message?: string): void {
    this.shouldThrowError = shouldThrow;
    if (message) {
      this.errorMessage = message;
    }
  }

  /**
   * Reset to default state
   */
  reset(): void {
    this.podcasts = this.getDefaultPodcasts();
    this.podcastDetails.clear();
    this.delay = 0;
    this.shouldThrowError = false;
    this.errorMessage = "Mock error";
  }

  // --- Private helper methods ---

  private async simulateDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
  }

  private throwErrorIfConfigured(): void {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }
  }

  /**
   * Default mock data for tests
   */
  private getDefaultPodcasts(): Podcast[] {
    return [
      {
        id: "1",
        title: "Test Podcast 1",
        author: "Test Author 1",
        imageUrl: "https://example.com/image1.jpg",
        summary: "This is a test podcast summary 1",
        details: {
          episodes: [],
          totalEpisodes: null,
        },
        lastUpdated: null,
      },
      {
        id: "2",
        title: "Test Podcast 2",
        author: "Test Author 2",
        imageUrl: "https://example.com/image2.jpg",
        summary: "This is a test podcast summary 2",
        details: {
          episodes: [],
          totalEpisodes: null,
        },
        lastUpdated: null,
      },
      {
        id: "3",
        title: "Test Podcast 3",
        author: "Test Author 3",
        imageUrl: "https://example.com/image3.jpg",
        summary: "This is a test podcast summary 3",
        details: {
          episodes: [],
          totalEpisodes: null,
        },
        lastUpdated: null,
      },
    ];
  }
}

/**
 * Factory function to create a MockPodcastRepository with default data
 */
export function createMockPodcastRepository(
  config?: ConstructorParameters<typeof MockPodcastRepository>[0]
): MockPodcastRepository {
  return new MockPodcastRepository(config);
}

/**
 * Factory function to create a MockPodcastRepository with rich test data
 */
export function createMockPodcastRepositoryWithDetails(): MockPodcastRepository {
  const repo = new MockPodcastRepository();

  // Add detailed data for podcast "1"
  repo.setPodcastDetails("1", {
    episodes: [
      {
        id: 101,
        title: "Episode 1: Introduction",
        description: "This is the first episode",
        duration: "30:00",
        date: "1/15/2024",
        episodeUrl: "https://example.com/episode1.mp3",
        closedCaptioning: "none",
      },
      {
        id: 102,
        title: "Episode 2: Deep Dive",
        description: "This is the second episode",
        duration: "45:00",
        date: "1/22/2024",
        episodeUrl: "https://example.com/episode2.mp3",
        closedCaptioning: "none",
      },
    ],
    totalEpisodes: 2,
  });

  return repo;
}
