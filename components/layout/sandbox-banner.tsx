export function SandboxBanner() {
  const isLive = process.env.UBER_LIVE_MODE === "true";

  if (isLive) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-sandbox-banner px-4 py-2 text-center text-sm text-sandbox-text"
    >
      Test mode — deliveries use robo courier. No real drivers.
    </div>
  );
}
