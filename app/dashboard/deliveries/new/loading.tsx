import { Skeleton } from "@/components/ui/skeleton";

export default function NewDeliveryLoading() {
  return (
    <div className="max-w-2xl space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );
}
