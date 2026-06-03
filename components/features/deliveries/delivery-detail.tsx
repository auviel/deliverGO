type DeliveryDetailPlaceholderProps = {
  deliveryId: string;
};

export function DeliveryDetailPlaceholder({
  deliveryId,
}: DeliveryDetailPlaceholderProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-elevated p-8">
      <p className="text-sm text-text-secondary">
        Delivery detail — Phase 8
      </p>
      <p className="mt-2 font-mono text-xs text-text-tertiary">{deliveryId}</p>
    </div>
  );
}
