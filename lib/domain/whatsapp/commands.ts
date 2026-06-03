import { normalizeCanadianPhone } from "@/lib/utils/phone";

export type ParsedWhatsAppCommand =
  | { type: "help" }
  | { type: "cancel" }
  | { type: "yes" }
  | { type: "pick"; index: number }
  | { type: "customer_name"; name: string }
  | { type: "new_wizard"; name?: string; phone?: string }
  | { type: "new_one_line"; name: string; phone: string; address: string }
  | { type: "ping" }
  | { type: "wizard_input"; text: string }
  | { type: "interactive"; id: string; title: string }
  | { type: "unknown"; text: string };

export type NewCustomerFields = {
  name: string;
  phone: string;
  address: string;
};

const HELP_ALIASES = new Set(["help", "?", "/help"]);
const CANCEL_ALIASES = new Set(["cancel", "no", "/cancel"]);
const YES_ALIASES = new Set(["yes", "y", "send", "/yes", "/send"]);
const NEW_PREFIX = /^\/new\s+|^new\s+/i;
const NEW_COMMAND = /^(\/)?new(\s|$)/i;

function stripNewPrefix(line: string): string {
  const trimmed = line.trim();
  if (/^(\/)?new$/i.test(trimmed)) {
    return "";
  }

  return trimmed.replace(/^\/new\s+/i, "").replace(/^new\s+/i, "").trim();
}

/** Parse `NEW name | phone | address` with `|`, `,`, or `;` delimiters. */
export function parseNewCustomerOneLine(rawText: string): NewCustomerFields | null {
  const body = rawText.replace(NEW_PREFIX, "").trim();
  if (!body) {
    return null;
  }

  const delimiterMatch = body.match(/[|,;]/);
  if (!delimiterMatch) {
    return null;
  }

  const delimiter = delimiterMatch[0]!;
  const parts = body
    .split(delimiter)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    return null;
  }

  const phone = normalizeCanadianPhone(parts[1]!);
  if (!phone) {
    return null;
  }

  return {
    name: parts[0]!,
    phone,
    address: parts.slice(2).join(delimiter === "," ? ", " : delimiter).trim(),
  };
}

/**
 * Parse a single message with line breaks:
 *   NEW Val
 *   5193300303
 *   123 Roger St, Waterloo
 *
 * Also supports address spanning extra lines, and:
 *   NEW
 *   Val
 *   5193300303
 *   123 Roger St
 */
export function parseNewCustomerMultiline(rawText: string): NewCustomerFields | null {
  const trimmed = rawText.trim();
  if (!NEW_COMMAND.test(trimmed) || !/\r?\n/.test(trimmed)) {
    return null;
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 3) {
    return null;
  }

  let name: string;
  let phoneRaw: string;
  let addressParts: string[];

  const nameFromFirstLine = stripNewPrefix(lines[0]!);

  if (nameFromFirstLine) {
    name = nameFromFirstLine;
    phoneRaw = lines[1]!;
    addressParts = lines.slice(2);
  } else {
    if (lines.length < 4) {
      return null;
    }

    name = lines[1]!;
    phoneRaw = lines[2]!;
    addressParts = lines.slice(3);
  }

  const phone = normalizeCanadianPhone(phoneRaw);
  if (!phone || !name) {
    return null;
  }

  const address = addressParts.join(", ").trim();
  if (address.length < 5) {
    return null;
  }

  return { name, phone, address };
}

/** Try delimiter one-liner first, then multiline block (with optional NEW prefix). */
export function parseNewCustomerFields(rawText: string): NewCustomerFields | null {
  return (
    parseNewCustomerOneLine(rawText) ??
    parseNewCustomerMultiline(rawText) ??
    parsePlainCustomerOneLine(rawText) ??
    parsePlainCustomerMultiline(rawText)
  );
}

/**
 * Multiline without NEW — e.g. pasted customer details:
 *   Val
 *   5193300303
 *   123 Roger St, Waterloo
 */
export function parsePlainCustomerMultiline(rawText: string): NewCustomerFields | null {
  const trimmed = rawText.trim();
  if (NEW_COMMAND.test(trimmed) || !/\r?\n/.test(trimmed)) {
    return null;
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 3) {
    return null;
  }

  const name = lines[0]!;
  const phone = normalizeCanadianPhone(lines[1]!);
  if (!phone || HELP_ALIASES.has(name.toLowerCase())) {
    return null;
  }

  const address = lines.slice(2).join(", ").trim();
  if (address.length < 5) {
    return null;
  }

  return { name, phone, address };
}

/** One line without NEW — e.g. Val,5193300303,123 Roger St, Waterloo */
export function parsePlainCustomerOneLine(rawText: string): NewCustomerFields | null {
  const trimmed = rawText.trim();
  if (NEW_COMMAND.test(trimmed) || /\r?\n/.test(trimmed)) {
    return null;
  }

  const delimiterMatch = trimmed.match(/[|,;]/);
  if (!delimiterMatch) {
    return null;
  }

  const delimiter = delimiterMatch[0]!;
  const parts = trimmed
    .split(delimiter)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    return null;
  }

  const phone = normalizeCanadianPhone(parts[1]!);
  if (!phone) {
    return null;
  }

  return {
    name: parts[0]!,
    phone,
    address: parts.slice(2).join(delimiter === "," ? ", " : delimiter).trim(),
  };
}

/** Partial multiline: name + phone on two lines after NEW — wizard continues at address. */
export function parseNewCustomerPartialMultiline(
  rawText: string,
): { name: string; phone: string } | null {
  const trimmed = rawText.trim();
  if (!NEW_COMMAND.test(trimmed) || !/\r?\n/.test(trimmed)) {
    return null;
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length !== 2) {
    return null;
  }

  const name = stripNewPrefix(lines[0]!);
  const phone = normalizeCanadianPhone(lines[1]!);

  if (!name || !phone) {
    return null;
  }

  return { name, phone };
}

export function parseWhatsAppCommand(
  rawText: string,
  options?: { wizardActive?: boolean },
): ParsedWhatsAppCommand {
  const text = rawText.trim();
  const normalized = text.toLowerCase();

  if (!text) {
    return { type: "unknown", text };
  }

  if (HELP_ALIASES.has(normalized)) {
    return { type: "help" };
  }

  if (CANCEL_ALIASES.has(normalized)) {
    return { type: "cancel" };
  }

  if (YES_ALIASES.has(normalized)) {
    return { type: "yes" };
  }

  if (normalized === "ping" || normalized === "/ping") {
    return { type: "ping" };
  }

  if (normalized === "new" || normalized === "/new") {
    return { type: "new_wizard", name: undefined };
  }

  if (NEW_PREFIX.test(text) || (NEW_COMMAND.test(text) && /\r?\n/.test(text))) {
    const complete = parseNewCustomerFields(text);
    if (complete) {
      return {
        type: "new_one_line",
        name: complete.name,
        phone: complete.phone,
        address: complete.address,
      };
    }

    const partial = parseNewCustomerPartialMultiline(text);
    if (partial) {
      return {
        type: "new_wizard",
        name: partial.name,
        phone: partial.phone,
      };
    }

    if (/\r?\n/.test(text)) {
      return {
        type: "unknown",
        text: "NEW block needs 3 lines: name, phone, address — or use commas.",
      };
    }

    const name = stripNewPrefix(text.split(/\r?\n/)[0] ?? text);
    return { type: "new_wizard", name: name || undefined };
  }

  if (options?.wizardActive) {
    return { type: "wizard_input", text };
  }

  const pickMatch = normalized.match(/^(\d+)$/);
  if (pickMatch) {
    return { type: "pick", index: Number.parseInt(pickMatch[1]!, 10) };
  }

  const sendMatch = text.match(/^(?:send|\/send)\s+(.+)$/i);
  if (sendMatch?.[1]?.trim()) {
    return { type: "customer_name", name: sendMatch[1].trim() };
  }

  const plainCustomer = parsePlainCustomerMultiline(text) ?? parsePlainCustomerOneLine(text);
  if (plainCustomer) {
    return {
      type: "new_one_line",
      name: plainCustomer.name,
      phone: plainCustomer.phone,
      address: plainCustomer.address,
    };
  }

  return { type: "customer_name", name: text };
}

export function parseInteractiveSelection(id: string): ParsedWhatsAppCommand {
  const normalized = id.trim().toLowerCase();

  if (normalized === "send" || normalized === "yes") {
    return { type: "yes" };
  }

  if (normalized === "cancel") {
    return { type: "cancel" };
  }

  const customerMatch = normalized.match(/^cust:(.+)$/);
  if (customerMatch?.[1]) {
    return { type: "interactive", id: `cust:${customerMatch[1]}`, title: "" };
  }

  const addressMatch = normalized.match(/^addr:(.+)$/);
  if (addressMatch?.[1]) {
    return { type: "interactive", id: `addr:${addressMatch[1]}`, title: "" };
  }

  const providerMatch = normalized.match(/^prov:(\d+)$/);
  if (providerMatch?.[1]) {
    return { type: "pick", index: Number.parseInt(providerMatch[1]!, 10) + 1 };
  }

  return { type: "unknown", text: id };
}
