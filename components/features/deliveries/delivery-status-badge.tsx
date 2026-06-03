import type { DeliveryStatus } from "@/lib/domain/delivery/types";
import { cn } from "@/lib/utils/cn";

const STATUS_CONFIG: Record<
  DeliveryStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700",
  },
  pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-700",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-amber-50 text-amber-800",
  },
  en_route_to_pickup: {
    label: "En route to pickup",
    className: "bg-blue-50 text-blue-700",
  },
  arrived_at_pickup: {
    label: "At pickup",
    className: "bg-blue-100 text-blue-800",
  },
  en_route_to_dropoff: {
    label: "En route",
    className: "bg-blue-50 text-blue-700",
  },
  arrived_at_dropoff: {
    label: "At dropoff",
    className: "bg-blue-100 text-blue-800",
  },
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-500",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
  },
};

type DeliveryStatusBadgeProps = {
  status: DeliveryStatus;
  className?: string;
};

export function DeliveryStatusBadge({ status, className }: DeliveryStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className,
      )}
      aria-label={`Delivery status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
