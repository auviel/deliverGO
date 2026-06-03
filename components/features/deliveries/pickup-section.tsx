import type { StoreProfile } from "@/lib/domain/store/types";
import { formatStoreProfileAddress } from "@/lib/domain/store/format";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type PickupSectionProps = {
  store: StoreProfile;
};

export function PickupSection({ store }: PickupSectionProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-foreground">Pickup</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Courier picks up from your store location.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Store
          </p>
          <p className="mt-1 font-medium text-foreground">{store.name}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Phone
          </p>
          <p className="mt-1 text-foreground">{store.phone}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Address
          </p>
          <p className="mt-1 text-foreground">{formatStoreProfileAddress(store)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
