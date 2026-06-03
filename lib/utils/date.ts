import { getStoreTimeZone } from "@/lib/config/environment";

function createDateFormatter() {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: getStoreTimeZone(),
  });
}

let cachedFormatter: Intl.DateTimeFormat | undefined;

function getDateFormatter(): Intl.DateTimeFormat {
  cachedFormatter ??= createDateFormatter();
  return cachedFormatter;
}

export function formatDateTime(date: Date): string {
  return getDateFormatter().format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}
