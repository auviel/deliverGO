/**
 * Uber Direct HTTP client — OAuth + REST calls.
 * Implemented in Phase 3.
 */
export class UberDirectClient {
  constructor(
    private readonly config: {
      clientId: string;
      clientSecret: string;
      customerId: string;
      apiBase: string;
      liveMode: boolean;
    },
  ) {}

  get isLiveMode(): boolean {
    return this.config.liveMode;
  }
}

export function createUberDirectClient(): UberDirectClient {
  return new UberDirectClient({
    clientId: process.env.UBER_CLIENT_ID ?? "",
    clientSecret: process.env.UBER_CLIENT_SECRET ?? "",
    customerId: process.env.UBER_CUSTOMER_ID ?? "",
    apiBase: process.env.UBER_API_BASE ?? "https://api.uber.com",
    liveMode: process.env.UBER_LIVE_MODE === "true",
  });
}
