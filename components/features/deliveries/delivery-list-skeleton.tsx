import { Skeleton } from "@/components/ui/skeleton";

export function DeliveryListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-border bg-surface-elevated p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-6 w-20 rounded-full" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
