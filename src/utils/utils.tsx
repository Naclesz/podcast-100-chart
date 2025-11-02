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
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours === 0) {
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
}
