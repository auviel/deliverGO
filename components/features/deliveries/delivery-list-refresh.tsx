"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 30_000;

type DeliveryListRefreshProps = {
  enabled: boolean;
};

/** Refresh server-rendered list every 30s when active deliveries may be updating. */
export function DeliveryListRefresh({ enabled }: DeliveryListRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      router.refresh();
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [enabled, router]);

  return null;
}
