/** Runtime environment helpers — server-side only. */
export function isUberLiveMode(): boolean {
  return process.env.UBER_LIVE_MODE === "true";
}

export function isSandboxMode(): boolean {
  return !isUberLiveMode();
}

/** Store timezone for date display — configurable via env later. */
export function getStoreTimeZone(): string {
  return process.env.STORE_TIMEZONE?.trim() || "America/Toronto";
}
