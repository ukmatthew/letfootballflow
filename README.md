# Let Football Flow 🌊

A mobile-first fan vote on mandatory hydration breaks in football.

> **Hydrate the players. Don't dam the game.**

Vote once. No account. No email. No nonsense.

Built on a Cloudflare-native stack: **Vite + React + TypeScript + Tailwind** on the
front end, **Cloudflare Pages Functions** for the API, **D1** for storage, and
**Turnstile** for bot protection.

---

## Features

- One-page, mobile-first voting site with a flowing-water theme
- Three vote options: `flow`, `breaks`, `depends`
- Optional country dropdown and optional handle
- Live Global Flow Meter and country leaderboard
- Share to X / WhatsApp / clipboard
- Donation + sponsor block
- Privacy-first: no logins, no emails, no raw IPs stored

## Privacy & repeat-vote prevention

- A single anonymous cookie (`lff_voter`) is set as `HttpOnly; Secure; SameSite=Lax`.
- The **raw cookie is never stored**. Only a salted SHA-256 hash is written to D1.
- A `UNIQUE (poll_id, voter_hash)` constraint blocks repeat votes per browser.
- The client IP is sent to Cloudflare only to verify Turnstile — it is never stored.

---

## Project structure

```
src/                 React front end (components + lib)
functions/api/       Pages Functions: vote.ts, results.ts, health.ts
shared/              Server-side helpers imported by the functions (not routes)
migrations/          D1 SQL migrations
public/              Static assets (favicon, OG image)
wrangler.toml        Cloudflare Pages + D1 config
```

## API

| Method | Route                      | Purpose                                   |
| ------ | -------------------------- | ----------------------------------------- |
| GET    | `/api/results?poll=global` | Totals, leaderboard, and your vote status |
| POST   | `/api/vote`                | Cast a vote                               |
| GET    | `/api/health`              | DB health check                           |

`POST /api/vote` body:

```json
{
  "pollSlug": "global",
  "choice": "flow",
  "countryCode": "GB",
  "handle": "@yourname",
  "turnstileToken": "..."
}
```

---

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local secrets and apply the migration to the local D1 database:

   ```bash
   cp .dev.vars.example .dev.vars
   npm run db:migrate:local
   ```

3. Build once (Wrangler needs a `dist/` folder even in dev):

   ```bash
   npm run build
   ```

4. Run the full local stack (Vite HMR + `/api` functions + D1):

   ```bash
   npm run dev
   ```

   Open **http://127.0.0.1:8788** — voting, results, and UI hot reload all work here.

   UI-only (no API): `npm run dev:ui` → http://127.0.0.1:5173

   Production-like preview (rebuilds first): `npm run preview`

## Deploying to Cloudflare Pages

1. Create the D1 database and paste the returned `database_id` into `wrangler.toml`:

   ```bash
   wrangler d1 create lff_db
   ```

2. Apply migrations to the remote database:

   ```bash
   npm run db:migrate:remote
   ```

3. Set secrets (these are **not** committed):

   ```bash
   wrangler pages secret put VOTER_HASH_SECRET
   wrangler pages secret put TURNSTILE_SECRET_KEY   # optional
   ```

4. Deploy:

   ```bash
   npm run deploy
   ```

## Turnstile

- Create a Turnstile widget in the Cloudflare dashboard.
- Front end: set `VITE_TURNSTILE_SITE_KEY` at build time (e.g. in a `.env` file).
  When unset, the widget is hidden and votes still work (useful in dev).
- Back end: set `TURNSTILE_SECRET_KEY` and `TURNSTILE_REQUIRED=1` to enforce it.

---

Independent fan project. Not affiliated with FIFA or any tournament organiser.
