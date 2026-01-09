/**
 * IStorageRepository defines the contract for persistent storage operations.
 * This is a PORT in hexagonal architecture - it abstracts storage mechanisms
 * (localStorage, sessionStorage, IndexedDB, etc.) from the domain logic.
 */
export interface IStorageRepository<T> {
  /**
   * Retrieves an item from storage by its key.
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  get(key: string): T | null;

  /**
   * Stores an item in storage with a timestamp.
   * @param key - The storage key
   * @param value - The value to store
   */
  set(key: string, value: T): void;

  /**
   * Removes an item from storage.
   * @param key - The storage key to remove
   */
  remove(key: string): void;

  /**
   * Checks if a stored item has exceeded its maximum age.
   * @param key - The storage key to check
   * @param maxAgeMs - Maximum age in milliseconds
   * @returns true if the item is stale or doesn't exist, false otherwise
   */
  isStale(key: string, maxAgeMs: number): boolean;
}
