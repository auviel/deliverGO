import { PageHeader } from "../../layout";
import { DeliveryDetailPlaceholder } from "@/components/features/deliveries/delivery-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeliveryDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <PageHeader title="Delivery details" />
      <DeliveryDetailPlaceholder deliveryId={id} />
    </>
  );
}
