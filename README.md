# deliverGO

Store manager dashboard for dispatching **Uber Direct** deliveries in Canada.

## Docs

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Code structure, layers, scaling principles |
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Phased build plan with checkboxes |
| [STYLING.md](./STYLING.md) | UI tokens and component guidelines |

## Stack

- **Next.js 16** (App Router) + TypeScript
- **PostgreSQL** + Prisma
- **Tailwind CSS v4** (Uber-inspired design tokens)
- **Uber Direct API** (sandbox + robo courier)

## Prerequisites

- Node.js 20+
- Docker (for local Postgres)
- Uber Direct sandbox credentials from [direct.uber.com](https://direct.uber.com)
- Mapbox access token (Phase 4)

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Uber sandbox credentials and Mapbox token when ready.

Get a Mapbox access token from [mapbox.com](https://account.mapbox.com/access-tokens/) (used for Canadian address geocoding).

Generate an auth secret:

```bash
openssl rand -base64 32
```

Set the output as `AUTH_SECRET` in `.env`.

### 3. Start PostgreSQL

```bash
docker compose up -d
```

Connection string (already in `.env.example`):

```
postgresql://delivergo:delivergo@localhost:5433/delivergo?schema=public
```

> **Note:** Docker Postgres runs on port **5433** to avoid conflicts with a local Homebrew PostgreSQL install on 5432.

### 4. Database

```bash
npm run db:migrate
npm run db:seed
```

**Seed credentials (local dev only):**

| Field | Value |
|-------|-------|
| Email | `store.manager@delivergo.local` |
| Password | `DeliverGODev2026!` |
| Store | Demo Market — 280 Lester St #102, Waterloo, ON |

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

- Dashboard: `/dashboard/deliveries` (requires login)
- Login: `/login`
- Session API: `/api/me`
- Geocode API: `POST /api/geocode` (auth required, Canada only)
- Health check: `/api/health`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run unit tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |
| `docker compose up -d` | Start local Postgres |

## Project structure

```
app/           → Routes (thin handlers)
components/    → UI (ui/, layout/, features/)
lib/
  domain/      → Types, validation, pure logic
  services/    → Use cases
  db/          → Prisma client + repositories
  integrations/→ Uber, Mapbox, future carriers
prisma/        → Schema + migrations + seed
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## Sandbox mode

When `UBER_LIVE_MODE=false` (default in `.env.example`):

- A **test-mode banner** appears at the top of the dashboard
- A **Test mode** badge appears in the sidebar and top bar
- **Robo courier** is injected automatically on delivery create — no real drivers are dispatched
- Deliveries are stored with `liveMode: false`

### Robo courier behavior

In sandbox, Uber simulates a full delivery trip without a human courier:

1. Create a delivery → status starts as `pending`
2. Uber sends `dapi.status_changed` webhooks as the robo courier progresses
3. Typical progression: pending → en route to pickup → at pickup → en route to dropoff → at dropoff → completed
4. On completion, deliverGO fetches proof-of-delivery (photo/signature if configured)

The detail page auto-refreshes every 30 seconds, but webhooks update status in near real time when your webhook URL is reachable.

### Sandbox test checklist

Use this before going live:

- [ ] `POST /api/deliveries/quote` returns a fee in CAD (sandbox credentials configured)
- [ ] `POST /api/deliveries` returns a delivery with `tracking_url` and `liveMode: false`
- [ ] Webhook URL registered and `UBER_WEBHOOK_SIGNING_SECRET` set (or client secret fallback)
- [ ] Robo courier webhooks advance status on the delivery detail timeline
- [ ] Full flow: login → new delivery → quote → send → track → complete → POD visible

### Going to production

1. Obtain **live** Uber Direct credentials in the [Uber Direct dashboard](https://direct.uber.com)
2. Update Vercel env vars: `UBER_CLIENT_ID`, `UBER_CLIENT_SECRET`, `UBER_CUSTOMER_ID`
3. Set `UBER_LIVE_MODE=true` and redeploy
4. Robo courier spec is **not** sent when live mode is on — real couriers are dispatched
5. Register production webhook URL in Uber Developer Dashboard → Settings → Ride Requests
6. Pilot with one store before wider rollout

## Deployment (Vercel + Neon)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com)
2. Connect a [Neon](https://neon.tech) Postgres database (Vercel integration recommended)
3. Set environment variables in Vercel:

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Neon **pooled** connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `UBER_*` | Sandbox creds first; switch to live when ready |
| `UBER_LIVE_MODE` | `false` until production pilot |
| `MAPBOX_ACCESS_TOKEN` | Required for geocoding |
| `UBER_WEBHOOK_SIGNING_SECRET` | From Uber dashboard webhook settings |

4. Run migrations against Neon once:

```bash
DATABASE_URL="your-neon-url" npx prisma migrate deploy
DATABASE_URL="your-neon-url" npm run db:seed
```

5. Set Vercel build command (optional): `npx prisma migrate deploy && npm run build`

## API routes

All dashboard API routes require an authenticated session except `/api/webhooks/uber` (signature verified) and `/api/health`.

| Route | Method | Auth |
|-------|--------|------|
| `/api/geocode` | POST | Session |
| `/api/deliveries/quote` | POST | Session |
| `/api/deliveries` | GET, POST | Session |
| `/api/deliveries/[id]` | GET | Session |
| `/api/deliveries/[id]/cancel` | POST | Session |
| `/api/webhooks/uber` | POST | HMAC signature |
| `/api/me` | GET | Session |
| `/api/health` | GET | Public |

Errors return `{ error, code?, details? }`. Validation errors include a `details` object with field messages.

## Webhooks

Uber Direct sends `dapi.status_changed` events when delivery status updates. deliverGO verifies the `X-Uber-Signature` header (HMAC-SHA256 of the raw body) and updates local delivery records automatically.

### Production (Vercel)

1. Open the [Uber Developer Dashboard](https://developer.uber.com/) → **Settings** → **Ride Requests**
2. Set your webhook URL:

```
https://your-app.vercel.app/api/webhooks/uber
```

3. Copy the **signing key** into Vercel as `UBER_WEBHOOK_SIGNING_SECRET` (or rely on `UBER_CLIENT_SECRET` as fallback)
4. Redeploy after setting env vars

When a delivery completes, the webhook triggers a POD fetch from Uber and saves verification images to the delivery record.

### Local development

Uber cannot reach `localhost`. Use a tunnel to forward webhooks to your dev server:

**ngrok**

```bash
npm run dev
ngrok http 3000
```

Register the ngrok HTTPS URL in the Uber dashboard:

```
https://YOUR-SUBDOMAIN.ngrok-free.app/api/webhooks/uber
```

**Cloudflare Tunnel**

```bash
cloudflared tunnel --url http://localhost:3000
```

Use the generated `*.trycloudflare.com` URL the same way.

> Tip: create a delivery in sandbox with robo courier enabled — status webhooks should arrive within seconds and advance the detail page timeline without manual refresh.

## License

Private — all rights reserved.
