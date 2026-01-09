import type { IStorageRepository } from "domain/repositories/storage.repository";

type StorageItem<T> = {
  data: T;
  timestamp: number;
};

/**
 * LocalStorageRepository is an ADAPTER that implements the IStorageRepository PORT.
 * It provides persistent storage using the browser's localStorage API.
 */
export class LocalStorageRepository<T> implements IStorageRepository<T> {
  get(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed: StorageItem<T> = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  set(key: string, value: T): void {
    try {
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  isStale(key: string, maxAgeMs: number): boolean {
    try {
      const item = localStorage.getItem(key);
      if (!item) return true;

      const parsed: StorageItem<T> = JSON.parse(item);
      const age = Date.now() - (parsed.timestamp || 0);
      return age > maxAgeMs;
    } catch (error) {
      console.error(`Error checking staleness for localStorage (${key}):`, error);
      return true;
    }
  }
}
