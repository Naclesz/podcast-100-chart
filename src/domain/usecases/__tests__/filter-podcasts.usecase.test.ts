import { describe, it, expect } from "vitest";
import { filterPodcasts } from "../filter-podcasts.usecase";
import type { Podcast } from "domain/models/podcast.model";

/**
 * Example tests for pure domain logic (no repository needed)
 *
 * This demonstrates another benefit of Hexagonal Architecture:
 * - Pure functions can be tested without any mocks or dependencies
 * - Tests are extremely fast (no async operations)
 * - Very easy to write and maintain
 */
describe("filterPodcasts usecase", () => {
  const mockPodcasts: Podcast[] = [
    {
      id: "1",
      title: "JavaScript Weekly",
      author: "John Doe",
      imageUrl: "https://example.com/js.jpg",
      summary: "Weekly JavaScript news",
      details: { episodes: [], totalEpisodes: null },
      lastUpdated: null,
    },
    {
      id: "2",
      title: "TypeScript Deep Dive",
      author: "Jane Smith",
      imageUrl: "https://example.com/ts.jpg",
      summary: "Advanced TypeScript concepts",
      details: { episodes: [], totalEpisodes: null },
      lastUpdated: null,
    },
    {
      id: "3",
      title: "React Patterns",
      author: "John Doe",
      imageUrl: "https://example.com/react.jpg",
      summary: "Best practices for React",
      details: { episodes: [], totalEpisodes: null },
      lastUpdated: null,
    },
    {
      id: "4",
      title: "Python for Beginners",
      author: "Alice Johnson",
      imageUrl: "https://example.com/python.jpg",
      summary: "Learn Python from scratch",
      details: { episodes: [], totalEpisodes: null },
      lastUpdated: null,
    },
  ];

  describe("filtering by title", () => {
    it("should filter podcasts by title (case-insensitive)", () => {
      const result = filterPodcasts(mockPodcasts, "javascript");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("JavaScript Weekly");
    });

    it("should filter podcasts by partial title match", () => {
      const result = filterPodcasts(mockPodcasts, "script");

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toContain("JavaScript Weekly");
      expect(result.map((p) => p.title)).toContain("TypeScript Deep Dive");
    });

    it("should be case-insensitive", () => {
      const resultLower = filterPodcasts(mockPodcasts, "react");
      const resultUpper = filterPodcasts(mockPodcasts, "REACT");
      const resultMixed = filterPodcasts(mockPodcasts, "ReAcT");

      expect(resultLower).toHaveLength(1);
      expect(resultUpper).toHaveLength(1);
      expect(resultMixed).toHaveLength(1);
    });
  });

  describe("filtering by author", () => {
    it("should filter podcasts by author name", () => {
      const result = filterPodcasts(mockPodcasts, "John Doe");

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.title)).toContain("JavaScript Weekly");
      expect(result.map((p) => p.title)).toContain("React Patterns");
    });

    it("should filter by partial author match", () => {
      const result = filterPodcasts(mockPodcasts, "John");

      expect(result).toHaveLength(3); // John Doe (2) + Alice Johnson (1)
    });
  });

  describe("edge cases", () => {
    it("should return all podcasts when search term is empty", () => {
      const result = filterPodcasts(mockPodcasts, "");

      expect(result).toHaveLength(4);
      expect(result).toEqual(mockPodcasts);
    });

    it("should return all podcasts when search term is only whitespace", () => {
      const result = filterPodcasts(mockPodcasts, "   ");

      expect(result).toHaveLength(4);
      expect(result).toEqual(mockPodcasts);
    });

    it("should return empty array when no matches found", () => {
      const result = filterPodcasts(mockPodcasts, "Golang");

      expect(result).toHaveLength(0);
    });

    it("should return empty array when input is empty", () => {
      const result = filterPodcasts([], "test");

      expect(result).toHaveLength(0);
    });

    it("should handle special characters in search term", () => {
      const specialPodcasts: Podcast[] = [
        {
          id: "1",
          title: "C++ Mastery",
          author: "Test Author",
          imageUrl: "https://example.com/cpp.jpg",
          summary: "Learn C++",
          details: { episodes: [], totalEpisodes: null },
          lastUpdated: null,
        },
      ];

      const result = filterPodcasts(specialPodcasts, "C++");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("C++ Mastery");
    });
  });

  describe("combined title and author filtering", () => {
    it("should return results matching either title or author", () => {
      const result = filterPodcasts(mockPodcasts, "Doe");

      // Should match both podcasts by "John Doe" (author)
      expect(result).toHaveLength(2);
    });
  });

  describe("pure function characteristics", () => {
    it("should not modify original array", () => {
      const originalLength = mockPodcasts.length;
      const originalFirst = mockPodcasts[0].title;

      filterPodcasts(mockPodcasts, "test");

      expect(mockPodcasts).toHaveLength(originalLength);
      expect(mockPodcasts[0].title).toBe(originalFirst);
    });

    it("should return same results for same inputs (idempotent)", () => {
      const result1 = filterPodcasts(mockPodcasts, "JavaScript");
      const result2 = filterPodcasts(mockPodcasts, "JavaScript");

      expect(result1).toEqual(result2);
    });

    it("should return new array reference when filtering", () => {
      const result = filterPodcasts(mockPodcasts, "JavaScript");

      // When actually filtering, should return a new array
      expect(result).not.toBe(mockPodcasts);
      expect(result.length).toBeLessThan(mockPodcasts.length);
    });

    it("should return same reference when no filtering (optimization)", () => {
      const result = filterPodcasts(mockPodcasts, "");

      // Optimization: no need to create new array if not filtering
      expect(result).toBe(mockPodcasts);
    });
  });
});
