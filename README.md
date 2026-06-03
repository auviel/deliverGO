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

Edit `.env` and add your Uber sandbox credentials and `MAPBOX_ACCESS_TOKEN` when ready.

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
postgresql://delivergo:delivergo@localhost:5432/delivergo?schema=public
```

### 4. Database (Phase 1+)

After models are added in Phase 1:

```bash
npm run db:migrate
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Dashboard: `/dashboard/deliveries`
- Login (stub): `/login`
- Health check: `/api/health`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
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

When `UBER_LIVE_MODE=false` (default):

- A test-mode banner appears in the dashboard
- Robo courier is injected on delivery create (Phase 3)
- No real drivers are dispatched

## Webhooks (Phase 9)

Register your webhook URL in the Uber Developer Dashboard → Settings → Ride Requests:

```
https://your-domain.com/api/webhooks/uber
```

For local development, use ngrok or Cloudflare Tunnel.

## License

Private — all rights reserved.
