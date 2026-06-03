# deliverGO — Implementation Plan

> Store manager dashboard for dispatching Uber Direct deliveries in Canada.  
> Check off tasks with `[x]` as they are completed.

---

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Stack | Next.js 15 (App Router) + TypeScript + PostgreSQL + Prisma |
| Auth | Auth.js (NextAuth v5) — credentials provider, seeded store manager |
| Styling | Tailwind CSS v4 + design tokens from [STYLING.md](./STYLING.md) |
| Region | Canada (`country: "CA"`, `+1` phone, postal codes) |
| Geocoding | Single dropoff text field → Mapbox Geocoding API (CA-biased) |
| Payments | Store pays via Uber Direct account — no customer payment UI |
| Uber env | Sandbox first; robo courier for automated test flows |
| Design reference | Uber Base / Direct dashboard simplicity — see [STYLING.md](./STYLING.md) |
| Engineering | Layered modular monolith — see [ARCHITECTURE.md](./ARCHITECTURE.md) |

---

## Architecture overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Store Manager  │────▶│  deliverGO App   │────▶│  Uber Direct    │
│  (browser)      │     │  Next.js + PG    │     │  Sandbox API    │
└─────────────────┘     └────────┬─────────┘     └────────▲────────┘
                                 │                        │
                                 │  webhooks              │
                                 └────────────────────────┘
```

**Core API flow per delivery**

1. Geocode dropoff address (Mapbox)
2. `POST /delivery_quotes` → fee + ETA + `quote_id` (expires ~15 min)
3. User confirms → `POST /deliveries` with `quote_id` + manifest + optional schedule + POD config
4. Save delivery record + `tracking_url`
5. Webhook `dapi.status_changed` → update local status
6. On complete → fetch + display proof of delivery from `Get Delivery`

---

## Phase 0 — Project foundation

- [x] Initialize Next.js 15 app with TypeScript, App Router, ESLint, Tailwind v4
- [x] Scaffold folder structure per [ARCHITECTURE.md](./ARCHITECTURE.md) (`lib/domain`, `lib/services`, `lib/integrations/delivery/uber`, etc.)
- [x] Add `DeliveryProvider` interface + Uber adapter stub (no logic yet — establishes boundary)
- [x] Configure environment variables template (`.env.example`)
  - [x] `DATABASE_URL`
  - [x] `AUTH_SECRET`
  - [x] `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_CUSTOMER_ID`
  - [x] `UBER_API_BASE` (sandbox default)
  - [x] `UBER_WEBHOOK_SIGNING_SECRET` (if applicable)
  - [x] `MAPBOX_ACCESS_TOKEN`
  - [x] `NEXT_PUBLIC_APP_URL`
- [x] Set up PostgreSQL (local Docker Compose or hosted)
- [x] Install and configure Prisma
- [x] Add `README.md` with local dev setup (install, migrate, seed, run)
- [x] Configure path aliases (`@/components`, `@/lib`, etc.)

---

## Phase 1 — Database & seed data

### Schema

- [ ] **Store** model
  - [ ] `id`, `name`, `phone`, `addressLine1`, `addressLine2`, `city`, `province`, `postalCode`, `country` (default `CA`)
  - [ ] `latitude`, `longitude`
  - [ ] `createdAt`, `updatedAt`
- [ ] **User** model
  - [ ] `id`, `email`, `passwordHash`, `name`, `role` (enum: `STORE_MANAGER`)
  - [ ] `storeId` → Store
  - [ ] `createdAt`, `updatedAt`
- [ ] **Delivery** model (provider-agnostic naming — see [ARCHITECTURE.md](./ARCHITECTURE.md))
  - [ ] `id`, `externalId` (our reference, sent to provider as `external_id`)
  - [ ] `storeId` → Store
  - [ ] `providerId` (default `uber_direct`), `providerDeliveryId`, `providerOrderId`, `quoteId`
  - [ ] `orderId` nullable (future ecommerce FK)
  - [ ] `providerPayload` JSON (raw provider snapshot)
  - [ ] Pickup snapshot: `pickupName`, `pickupPhone`, `pickupAddress`, `pickupLat`, `pickupLng`
  - [ ] Dropoff: `dropoffName`, `dropoffPhone`, `dropoffAddress`, `dropoffLat`, `dropoffLng`
  - [ ] `feeCents`, `currency`, `status` (local enum mirroring Uber lifecycle)
  - [ ] `trackingUrl`, `pickupReadyAt`, `scheduledFor` (nullable)
  - [ ] POD flags: `podSignature`, `podPicture` (booleans)
  - [ ] POD results (JSON): `proofOfDelivery` (signature URL, picture URL, signer name, fetched_at)
  - [ ] `cancelledAt`, `cancelReason`, `cancelledBy`
  - [ ] `liveMode` (boolean — sandbox vs production)
  - [ ] `createdAt`, `updatedAt`
- [ ] **WebhookEvent** model (idempotency + audit)
  - [ ] `eventId` (unique), `eventType`, `payload`, `processedAt`, `deliveryId`

### Migrations & seed

- [ ] Run initial migration
- [ ] Seed script: one Canadian store (Toronto or user-provided address)
- [ ] Seed script: one store manager user (`store.manager@delivergo.local` / dev password in README only)
- [ ] Verify seed via Prisma Studio or SQL query

---

## Phase 2 — Authentication

- [ ] Install and configure Auth.js with credentials provider
- [ ] Password hashing (bcrypt)
- [ ] Login page (`/login`) — email + password, minimal Uber-style layout
- [ ] Session middleware — protect `/dashboard/*` routes
- [ ] Logout action
- [ ] Redirect unauthenticated users to `/login`
- [ ] Load store profile into session or server context after login
- [ ] Add `GET /api/me` (optional) for client session + store info

---

## Phase 3 — Uber Direct client (server-only)

- [ ] Implement under `lib/integrations/delivery/uber/` (implements `DeliveryProvider` — see [ARCHITECTURE.md](./ARCHITECTURE.md))
- [ ] `client.ts` — OAuth client credentials, scope `eats.deliveries`, token cache with expiry refresh
- [ ] `adapter.ts` — maps domain ↔ Uber API
  - [ ] `createQuote(pickup, dropoff, pickupReady?)`
  - [ ] `createDelivery(payload)` — includes `quote_id`, manifest, lat/lng, optional schedule
  - [ ] `getDelivery(uberDeliveryId)`
  - [ ] `listDeliveries(filters?)`
  - [ ] `cancelDelivery(orderId, reason, cancellingParty)`
- [ ] `mappers.ts` — format Canadian addresses as Uber JSON string
- [ ] `lib/utils/phone.ts` — normalize to E.164 `+1XXXXXXXXXX`
- [ ] `lib/domain/delivery/manifest.ts` — default manifest item helper (`"Store order"`, size `small`, qty 1)
- [ ] Sandbox mode flag — when `UBER_LIVE_MODE=false`:
  - [ ] Attach `test_specifications.robo_courier_specification.mode: "auto"` on create delivery
  - [ ] Set `live_mode: false` expectation in responses
- [ ] Error mapping — user-friendly messages for invalid_params, expired quote, etc.
- [ ] Unit tests for address + phone formatters

---

## Phase 4 — Geocoding (Canada)

- [ ] Create `lib/geocoding/mapbox.ts`
  - [ ] Geocode single-line Canadian address
  - [ ] Return structured: line1, city, province, postalCode, lat, lng
  - [ ] Bias to Canada (`country=CA`)
- [ ] `POST /api/geocode` — server route, rate-limited
- [ ] Address validation UX rules
  - [ ] Show parsed address preview before quote
  - [ ] Block quote if geocode confidence too low
- [ ] Store pickup lat/lng validated at seed time (geocode store address once)

---

## Phase 5 — App shell & navigation

- [ ] Dashboard layout with sidebar + top bar (see STYLING.md)
- [ ] Navigation items: **Deliveries**, **New delivery**
- [ ] Store name + manager name in header
- [ ] Sandbox badge when not in live mode (“Test mode — robo courier enabled”)
- [ ] Empty states for list pages
- [ ] Toast/alert system for success and errors
- [ ] Loading skeletons for list and detail views

---

## Phase 6 — Deliveries list page

**Route:** `/dashboard/deliveries`

- [ ] Server component fetches deliveries for logged-in store (paginated, newest first)
- [ ] Table/card list columns:
  - [ ] Customer name
  - [ ] Dropoff address (truncated)
  - [ ] Status badge
  - [ ] Fee (formatted CAD)
  - [ ] Created date
  - [ ] Scheduled time (if set)
- [ ] Status filter tabs: All | Active | Scheduled | Completed | Cancelled
- [ ] Search by customer name or external ID
- [ ] Row click → delivery detail
- [ ] “New delivery” primary CTA (top right)
- [ ] Auto-refresh or SWR polling for active deliveries (30s fallback if webhooks lag)

---

## Phase 7 — New delivery page

**Route:** `/dashboard/deliveries/new`

### Pickup section (read-only, from store profile)

- [ ] Store name
- [ ] Store phone
- [ ] Store address (formatted)

### Dropoff section (editable)

- [ ] Customer name (required)
- [ ] Customer phone (required, CA validation)
- [ ] Dropoff address — single text field with autocomplete (Mapbox)
- [ ] Geocoded address preview card

### Schedule section

- [ ] Toggle: **ASAP** vs **Schedule pickup**
- [ ] Date + time picker for scheduled pickup (`pickup_ready_dt`)
  - [ ] Min: now + 15 minutes
  - [ ] Max: per Uber limits (document in code comment)
- [ ] Pass schedule to quote + create delivery

### Proof of delivery section

- [ ] Toggle: **Signature required** (`dropoff_verification.signature_requirement`)
- [ ] Toggle: **Photo proof** (`dropoff_verification.picture`)
- [ ] Helper text explaining courier steps (from Uber POD guide)
- [ ] Default: signature OFF, picture ON (leave at door friendly) — confirm in UI copy

### Quote flow

- [ ] “Get delivery quote” button (disabled until dropoff valid)
- [ ] Call `POST /api/deliveries/quote`
- [ ] Display quote card:
  - [ ] Fee (CAD)
  - [ ] Estimated pickup duration
  - [ ] Estimated delivery time (ETA)
  - [ ] Quote expiry countdown (~15 min)
- [ ] Re-quote automatically if expired on submit

### Send delivery

- [ ] “Send delivery” primary button (enabled after valid quote)
- [ ] Call `POST /api/deliveries`
- [ ] Include: quote_id, pickup/dropoff, manifest, schedule, POD config, robo courier (sandbox)
- [ ] On success → redirect to delivery detail
- [ ] On error → inline error + preserve form state

---

## Phase 8 — Delivery detail page

**Route:** `/dashboard/deliveries/[id]`

- [ ] Fetch delivery from DB + refresh from Uber if active
- [ ] Header: status badge + external ID + created time
- [ ] **Status timeline** component
  - [ ] pending → scheduled → en route to pickup → at pickup → en route to dropoff → at dropoff → completed
  - [ ] failed / cancelled terminal states
- [ ] Pickup & dropoff info cards
- [ ] Fee + currency display
- [ ] Scheduled pickup time (if applicable)
- [ ] **Tracking link** — open Uber `tracking_url` in new tab (never modify URL)
- [ ] Courier section (when available from Uber): name, vehicle, ETA

### Cancel delivery

- [ ] Show “Cancel delivery” when status is cancellable (before terminal state)
- [ ] Cancel modal with reason select:
  - [ ] `CUSTOMER_CALLED_TO_CANCEL`
  - [ ] `OUT_OF_ITEMS`
  - [ ] `RESTAURANT_TOO_BUSY`
  - [ ] `OTHER` (+ details field)
- [ ] `POST /api/deliveries/[id]/cancel` → Uber cancel API, `cancelling_party: MERCHANT`
- [ ] Update local status + show confirmation
- [ ] Disable cancel button after success

### Proof of delivery

- [ ] When status = completed, fetch latest from Uber `Get Delivery`
- [ ] Display POD section if verification data exists:
  - [ ] Signature image + signer name
  - [ ] Delivery photo
  - [ ] Barcode scan result (if configured later)
- [ ] Handle expired POD URLs gracefully (Uber retains ~30 days via API)
- [ ] “Proof pending” state if completed but verification not yet available

---

## Phase 9 — Webhooks

- [ ] `POST /api/webhooks/uber` endpoint
- [ ] Verify webhook signature (Uber security docs)
- [ ] Handle `dapi.status_changed` events
- [ ] Idempotency via `WebhookEvent.eventId`
- [ ] Map Uber status → local `Delivery.status`
- [ ] On `COMPLETED` → trigger POD fetch + save to `proofOfDelivery`
- [ ] Return `200` empty body on success
- [ ] Log failures for retry visibility
- [ ] Document webhook URL setup in README (Uber Developer Dashboard → Settings → Ride Requests)
- [ ] Local dev: ngrok / Cloudflare tunnel instructions for webhook testing

---

## Phase 10 — API routes summary

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/geocode` | POST | Geocode dropoff address |
| `/api/deliveries/quote` | POST | Create Uber quote |
| `/api/deliveries` | POST | Create delivery |
| `/api/deliveries` | GET | List store deliveries |
| `/api/deliveries/[id]` | GET | Get delivery + Uber sync |
| `/api/deliveries/[id]/cancel` | POST | Cancel delivery |
| `/api/webhooks/uber` | POST | Status + POD updates |

- [ ] Implement all routes with auth checks (webhook excluded)
- [ ] Zod validation on all request bodies
- [ ] Consistent error response shape `{ error, code?, details? }`

---

## Phase 11 — Sandbox & robo courier

- [ ] `UBER_LIVE_MODE=false` in `.env.example` by default
- [ ] Visual sandbox indicator across dashboard
- [ ] Auto-inject robo courier spec on delivery create in test mode
- [ ] Document robo courier behavior in README (simulated trip progression)
- [ ] Test checklist:
  - [ ] Quote in sandbox returns fee
  - [ ] Create delivery returns `tracking_url` + `live_mode: false`
  - [ ] Robo courier advances status via webhooks
  - [ ] Full flow: quote → create → track → complete → POD visible
- [ ] Production toggle checklist (separate section in README)
  - [ ] Switch credentials in Uber Direct dashboard
  - [ ] Set `UBER_LIVE_MODE=true`
  - [ ] Remove robo courier spec
  - [ ] Pilot with real store before full rollout

---

## Phase 12 — Polish & quality

- [ ] Apply [STYLING.md](./STYLING.md) across all pages
- [ ] Responsive layout (tablet + desktop; mobile usable)
- [ ] Accessibility pass: focus states, labels, aria on status badges, keyboard nav
- [ ] Form validation messages (inline, plain language)
- [ ] Currency formatting (`en-CA`, CAD)
- [ ] Date/time formatting (store timezone — default `America/Toronto`, configurable later)
- [ ] Error boundary on dashboard routes
- [ ] Rate limiting on quote + create endpoints
- [ ] Audit log for cancel actions (optional: extend WebhookEvent or separate table)

---

## Phase 13 — Testing & deployment

- [ ] Integration test: quote + create with mocked Uber (or sandbox in CI secrets)
- [ ] E2E smoke test: login → new delivery → list shows delivery (Playwright)
- [ ] Deploy target documented (Vercel + Neon/Supabase Postgres, or Railway)
- [ ] Production env vars checklist
- [ ] Webhook URL registered in Uber dashboard for production
- [ ] Health check route `/api/health`

---

## Future (post-v1 — not in scope now)

- [ ] Roles admin + multi-store (Organizations API)
- [ ] Barcode POD + order reference scanning
- [ ] Return deliveries
- [ ] Email/SMS notifications to customers
- [ ] Embedded map (tracking URL link-out is sufficient for v1)
- [ ] Analytics dashboard (delivery volume, spend, avg fee)

---

## Progress tracker

| Phase | Name | Status |
|-------|------|--------|
| 0 | Project foundation | [x] |
| 1 | Database & seed | [ ] |
| 2 | Authentication | [ ] |
| 3 | Uber Direct client | [ ] |
| 4 | Geocoding | [ ] |
| 5 | App shell | [ ] |
| 6 | Deliveries list | [ ] |
| 7 | New delivery | [ ] |
| 8 | Delivery detail | [ ] |
| 9 | Webhooks | [ ] |
| 10 | API routes | [ ] |
| 11 | Sandbox & robo courier | [ ] |
| 12 | Polish & quality | [ ] |
| 13 | Testing & deployment | [ ] |

---

## Reference links

### Project docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [STYLING.md](./STYLING.md)

### Uber Direct

- [Uber Direct Overview](https://developer.uber.com/docs/deliveries/overview)
- [Get Started / Sandbox](https://developer.uber.com/docs/deliveries/get-started)
- [Proof of Delivery](https://developer.uber.com/docs/deliveries/guides/proof-of-delivery)
- [Delivery Status Webhook](https://developer.uber.com/docs/deliveries/direct/api/webhook-dapi-statuschanged)
- [Cancel Order](https://developer.uber.com/docs/deliveries/direct/api/v1/post-eats-orders-orderid-cancel)
- [Uber Direct SDK (npm)](https://www.npmjs.com/package/uber-direct)
