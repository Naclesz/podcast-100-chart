import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpClient } from "./api.client";

describe("HttpClient", () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient(5000, { "Content-Type": "application/json" });
    vi.clearAllMocks();
  });

  describe("get", () => {
    it("should make a successful GET request and return parsed JSON", async () => {
      const mockData = { message: "success" };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      };

      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse) as any;

      const result = await httpClient.get("https://api.example.com/data");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should throw error when response is not ok (404)", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
      };

      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse) as any;

      await expect(
        httpClient.get("https://api.example.com/not-found")
      ).rejects.toThrow("HTTP 404: Not Found");
    });

    it("should throw error when response is not ok (500)", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      };

      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse) as any;

      await expect(
        httpClient.get("https://api.example.com/error")
      ).rejects.toThrow("HTTP 500: Internal Server Error");
    });
  });
});
