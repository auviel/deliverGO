import { isUberLiveMode } from "@/lib/config/environment";

export function SandboxBanner() {
  if (isUberLiveMode()) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-sandbox-banner px-4 py-2 text-center text-sm text-sandbox-text"
    >
      Test mode — robo courier enabled. No real drivers will be dispatched.
    </div>
  );
}
