import { PageHeader } from "../../layout";
import { DeliveryFormPlaceholder } from "@/components/features/deliveries/delivery-form";

export default function NewDeliveryPage() {
  return (
    <>
      <PageHeader title="New delivery" />
      <DeliveryFormPlaceholder />
    </>
  );
}
