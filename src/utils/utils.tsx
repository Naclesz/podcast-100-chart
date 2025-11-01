export function getMilliseconds(): number {
  return new Date().getTime();
}

export function isStale(lastUpdated: number): boolean {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = getMilliseconds();
  const isStale = now - lastUpdated > ONE_DAY_MS;
  return isStale;
}

export function isStaleDebug(lastUpdated: number): boolean {
  const ONE_MINUTE_MS = 60 * 1000;
  const now = getMilliseconds();
  const isStale = now - lastUpdated > ONE_MINUTE_MS;
  return isStale;
}

export function formatMillisecondsToTime(ms: number): string {
  const date = new Date(ms);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
