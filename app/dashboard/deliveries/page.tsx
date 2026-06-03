import { PageHeader, PrimaryLink } from "../layout";
import { DeliveryListPlaceholder } from "@/components/features/deliveries/delivery-list";

export default function DeliveriesPage() {
  return (
    <>
      <PageHeader
        title="Deliveries"
        action={<PrimaryLink href="/dashboard/deliveries/new">New delivery</PrimaryLink>}
      />
      <DeliveryListPlaceholder />
    </>
  );
}
