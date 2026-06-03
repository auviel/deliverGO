import { PageHeader } from "../../layout";
import { DeliveryForm } from "@/components/features/deliveries/delivery-form";
import { requireSessionContext } from "@/lib/auth/session";

export default async function NewDeliveryPage() {
  const { store } = await requireSessionContext();

  return (
    <>
      <PageHeader title="New delivery" />
      <DeliveryForm store={store} />
    </>
  );
}
