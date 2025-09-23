import { API_CONFIG } from "config/api.config";
import type { ApiError } from "types/types";

export interface IHttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
}

export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient implements IHttpClient {
  private readonly defaultTimeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(
    timeout: number = API_CONFIG.timeout,
    headers: Record<string, string> = API_CONFIG.headers
  ) {
    this.defaultTimeout = timeout;
    this.defaultHeaders = headers;
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || this.defaultTimeout
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        const apiError: ApiError = {
          message: error.message,
          status: error.name === "AbortError" ? 408 : undefined,
        };
        throw apiError;
      }

      throw error;
    }
  }
}

export const httpClient = new HttpClient();
