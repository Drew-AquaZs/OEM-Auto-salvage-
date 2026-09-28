# OEM Salvage Planner

Salvage-yard target list and arbitrage planner for 2000–2015 Japanese and German vehicles: fast-pull OEM part lists, a yard pull planner with PDF/CSV export, AI part lookup, yard-drop parsing, market insights, extraction guides, and a marketplace listing generator.

Every Gemini-backed endpoint has a rule-based fallback, so the app stays usable when no API key is set or the models are rate-limited.

## Run locally

Requires Node.js 20+.

```bash
npm ci
cp .env.example .env         # set GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

## Production

```bash
npm run build   # client -> dist/, server -> dist/server.cjs
NODE_ENV=production npm start
```

`GET /api/health` reports server status and whether a Gemini key is configured.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Express + Vite dev server with HMR |
| `npm run build` | Production client and server bundles |
| `npm start` | Run the production bundle |
| `npm run lint` | Type-check with `tsc --noEmit` |

See `.env.example` for all configuration options.
