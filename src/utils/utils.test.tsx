import { describe, expect, it } from "vitest";
import { getMilliseconds, isStale } from "./utils";

describe("utils", () => {
  describe("getMilliseconds", () => {
    it("should return a valid timestamp", () => {
      const result = getMilliseconds();
      expect(result).toBeTypeOf("number");
      expect(result).toBeGreaterThan(0);
    });

    it("should return current time", () => {
      const before = Date.now();
      const result = getMilliseconds();
      const after = Date.now();
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });
  });

  describe("isStale", () => {
    it("should return true when data is older than 24 hours", () => {
      const oneDayAgo = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      expect(isStale(oneDayAgo)).toBe(true);
    });

    it("should return false when data is less than 24 hours old", () => {
      const oneHourAgo = Date.now() - 1 * 60 * 60 * 1000; // 1 hour ago
      expect(isStale(oneHourAgo)).toBe(false);
    });

    it("should return false when data is exactly at 24 hours boundary", () => {
      const exactlyOneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      expect(isStale(exactlyOneDayAgo)).toBe(false);
    });

    it("should return true when data is just over 24 hours", () => {
      const justOverOneDay = Date.now() - (24 * 60 * 60 * 1000 + 1000);
      expect(isStale(justOverOneDay)).toBe(true);
    });
  });
});
