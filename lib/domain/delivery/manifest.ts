export type ManifestItem = {
  name: string;
  quantity: number;
  size: "small" | "medium" | "large" | "xlarge";
};

/** Default manifest for v1 when no order line items exist. */
export function createDefaultManifest(): ManifestItem[] {
  return [
    {
      name: "Store order",
      quantity: 1,
      size: "small",
    },
  ];
}
