"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import {
  getRecommendedQuote,
  isRecommendedQuote,
} from "@/lib/domain/delivery/compare-quotes";
import { getQuoteAcceptWindowLabel } from "@/lib/domain/delivery/quote-display";
import {
  DELIVERY_PROVIDER_LABELS,
  type DeliveryQuote,
  type DeliveryQuoteFailure,
  type DeliveryProviderId,
} from "@/lib/domain/delivery/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCadFromCents } from "@/lib/utils/currency";
import { formatDateTime } from "@/lib/utils/date";

type QuoteComparisonProps = {
  quotes: DeliveryQuote[];
  failures: DeliveryQuoteFailure[];
  selectedProviderId: DeliveryProviderId | null;
  onSelect: (providerId: DeliveryProviderId) => void;
};

function getRemainingSeconds(expiresAt: Date): number {
  return Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function QuoteOption({
  quote,
  quotes,
  selected,
  onSelect,
}: {
  quote: DeliveryQuote;
  quotes: DeliveryQuote[];
  selected: boolean;
  onSelect: () => void;
}) {
  const expiresAt = new Date(quote.expiresAt);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(expiresAt),
  );
  const recommended = isRecommendedQuote(quote, quotes);
  const isExpired = remainingSeconds <= 0;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(expiresAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAt]);

  return (
    <label
      className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
        selected
          ? "border-accent bg-surface ring-1 ring-accent"
          : "border-border bg-surface hover:border-border-strong"
      } ${isExpired ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="delivery-provider"
          className="mt-1 h-4 w-4 border-border-strong"
          checked={selected}
          disabled={isExpired}
          onChange={onSelect}
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {DELIVERY_PROVIDER_LABELS[quote.providerId]}
            </span>
            {recommended ? (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                Recommended
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
                Delivery fee
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                {formatCadFromCents(quote.feeCents)}
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 text-sm ${isExpired ? "text-error" : "text-text-secondary"}`}
            >
              <Clock className="h-4 w-4 shrink-0" aria-hidden />
            {isExpired ? (
              <span>Quote expired</span>
            ) : (
              <span>
                Valid for {formatCountdown(remainingSeconds)} ·{" "}
                {getQuoteAcceptWindowLabel(quote.providerId)}
              </span>
            )}
            </div>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {quote.pickupDurationMinutes !== undefined ? (
              <div>
                <dt className="text-text-tertiary">Courier arrives in</dt>
                <dd className="mt-0.5 font-medium text-foreground">
                  ~{quote.pickupDurationMinutes} min
                </dd>
              </div>
            ) : null}
            {quote.dropoffEta ? (
              <div>
                <dt className="text-text-tertiary">Delivered by</dt>
                <dd className="mt-0.5 font-medium text-foreground">
                  {formatDateTime(quote.dropoffEta)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </label>
  );
}

export function QuoteComparison({
  quotes,
  failures,
  selectedProviderId,
  onSelect,
}: QuoteComparisonProps) {
  const recommended = getRecommendedQuote(quotes);

  return (
    <Card className="border-accent/30 bg-accent-subtle/30">
      <CardContent className="space-y-4 pt-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Choose a carrier</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {quotes.length > 1 && recommended
              ? `${DELIVERY_PROVIDER_LABELS[recommended.providerId]} has the lowest fee. You can pick either option.`
              : "Review the price before you send."}
          </p>
        </div>

        <div className="space-y-3">
          {quotes.map((quote) => (
            <QuoteOption
              key={quote.providerId}
              quote={quote}
              quotes={quotes}
              selected={selectedProviderId === quote.providerId}
              onSelect={() => onSelect(quote.providerId)}
            />
          ))}
        </div>

        {failures.length > 0 ? (
          <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
            {failures.map((failure) => (
              <p key={failure.providerId} className="text-sm text-text-secondary">
                <span className="font-medium text-foreground">
                  {DELIVERY_PROVIDER_LABELS[failure.providerId]}:
                </span>{" "}
                {failure.error}
              </p>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function getSelectedQuote(
  quotes: DeliveryQuote[],
  selectedProviderId: DeliveryProviderId | null,
): DeliveryQuote | null {
  if (!selectedProviderId) {
    return getRecommendedQuote(quotes);
  }

  return quotes.find((quote) => quote.providerId === selectedProviderId) ?? null;
}

export function isQuoteValid(quote: DeliveryQuote | null): boolean {
  if (!quote) {
    return false;
  }

  return getRemainingSeconds(new Date(quote.expiresAt)) > 0;
}

export function isQuoteSelectionValid(
  quotes: DeliveryQuote[],
  selectedProviderId: DeliveryProviderId | null,
): boolean {
  return isQuoteValid(getSelectedQuote(quotes, selectedProviderId));
}
