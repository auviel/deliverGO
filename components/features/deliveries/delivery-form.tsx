export function DeliveryFormPlaceholder() {
  return (
    <div className="max-w-2xl space-y-4">
      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Pickup</h2>
        <p className="mt-2 text-sm text-text-secondary">From store profile — Phase 1</p>
      </section>
      <section className="rounded-lg border border-border bg-surface-elevated p-5">
        <h2 className="text-lg font-semibold">Dropoff</h2>
        <p className="mt-2 text-sm text-text-secondary">Form fields — Phase 7</p>
      </section>
    </div>
  );
}
