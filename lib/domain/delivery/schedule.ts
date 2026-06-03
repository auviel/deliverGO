/** Minimum lead time before a scheduled pickup (Uber Direct). */
export const MIN_SCHEDULE_LEAD_MINUTES = 15;

/** Uber Direct allows scheduling pickup up to ~30 days ahead (see Uber Direct API docs). */
export const MAX_SCHEDULE_DAYS = 30;

export function getMinScheduledPickupAt(now = new Date()): Date {
  return new Date(now.getTime() + MIN_SCHEDULE_LEAD_MINUTES * 60_000);
}

export function getMaxScheduledPickupAt(now = new Date()): Date {
  return new Date(now.getTime() + MAX_SCHEDULE_DAYS * 24 * 60 * 60_000);
}

export function validateScheduledPickupAt(
  date: Date,
  now = new Date(),
): string | null {
  const min = getMinScheduledPickupAt(now);
  const max = getMaxScheduledPickupAt(now);

  if (date < min) {
    return `Scheduled pickup must be at least ${MIN_SCHEDULE_LEAD_MINUTES} minutes from now.`;
  }

  if (date > max) {
    return `Scheduled pickup cannot be more than ${MAX_SCHEDULE_DAYS} days ahead.`;
  }

  return null;
}

/** Format for HTML datetime-local inputs (browser local timezone). */
export function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
