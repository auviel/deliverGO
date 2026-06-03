const CAD_FORMATTER = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

/** Format cents as CAD display string (e.g. 558 → "$5.58"). */
export function formatCadFromCents(cents: number): string {
  return CAD_FORMATTER.format(cents / 100);
}
