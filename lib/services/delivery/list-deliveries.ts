import { requireStoreManager } from "@/lib/auth/session";
import {
  deliveryRepository,
  mapDeliveryToListItem,
} from "@/lib/db/repositories/delivery.repository";
import {
  parseDeliveryListFilter,
  type DeliveryListFilter,
} from "@/lib/domain/delivery/filters";
import type { DeliveryListItem } from "@/lib/domain/delivery/types";

export type ListDeliveriesInput = {
  filter?: DeliveryListFilter | string;
  search?: string;
  limit?: number;
  offset?: number;
};

export type ListDeliveriesResult = {
  items: DeliveryListItem[];
  filter: DeliveryListFilter;
  search: string;
};

export async function listDeliveries(
  input: ListDeliveriesInput = {},
): Promise<ListDeliveriesResult> {
  const user = await requireStoreManager();
  const filter = parseDeliveryListFilter(
    typeof input.filter === "string" ? input.filter : input.filter,
  );
  const search = input.search?.trim() ?? "";

  const deliveries = await deliveryRepository.findManyForStore({
    storeId: user.storeId,
    filter,
    search: search || undefined,
    limit: input.limit,
    offset: input.offset,
  });

  return {
    items: deliveries.map(mapDeliveryToListItem),
    filter,
    search,
  };
}
