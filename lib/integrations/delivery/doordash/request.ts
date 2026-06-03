import { logger } from "@/lib/utils/logger";
import { createDoorDashJwt } from "./auth";
import type { DoorDashConfig } from "./config";
import { mapDoorDashApiError } from "./errors";

type DoorDashRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function doordashRequest<T>(
  config: DoorDashConfig,
  path: string,
  options: {
    method: DoorDashRequestMethod;
    body?: Record<string, unknown>;
  },
): Promise<T> {
  const token = createDoorDashJwt(config);
  const url = `${config.apiBase}${path}`;

  const response = await fetch(url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : {};

  if (!response.ok) {
    logger.error("doordash.api.error", {
      path,
      status: response.status,
      message: (parsed as { message?: string }).message,
    });
    throw mapDoorDashApiError(response.status, parsed);
  }

  return parsed as T;
}

/** Same as doordashRequest but returns null on 404 instead of throwing. */
export async function doordashRequestOptional<T>(
  config: DoorDashConfig,
  path: string,
  options: {
    method: DoorDashRequestMethod;
    body?: Record<string, unknown>;
  },
): Promise<T | null> {
  const token = createDoorDashJwt(config);
  const url = `${config.apiBase}${path}`;

  const response = await fetch(url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (response.status === 404) {
    return null;
  }

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : {};

  if (!response.ok) {
    logger.error("doordash.api.error", {
      path,
      status: response.status,
      message: (parsed as { message?: string }).message,
    });
    throw mapDoorDashApiError(response.status, parsed);
  }

  return parsed as T;
}
