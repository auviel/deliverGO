import { createHmac } from "crypto";
import type { DoorDashConfig } from "./config";

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

/** Create a short-lived JWT for DoorDash Drive API requests. */
export function createDoorDashJwt(config: DoorDashConfig, ttlSeconds = 300): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
    "dd-ver": "DD-JWT-V1",
  };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: "doordash",
    iss: config.developerId,
    kid: config.keyId,
    exp: now + ttlSeconds,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const secret = Buffer.from(config.signingSecret, "base64");
  const signature = createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
}
