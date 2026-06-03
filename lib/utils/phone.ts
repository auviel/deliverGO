/** Normalize Canadian phone numbers to E.164 (+1XXXXXXXXXX). */
export function normalizeCanadianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (input.startsWith("+1") && digits.length === 11) {
    return `+${digits}`;
  }

  return null;
}
