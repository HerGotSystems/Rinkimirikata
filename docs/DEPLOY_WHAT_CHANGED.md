# Deploy WHAT CHANGED? on the RINKIMIRIKATA Cloudflare Pages project

The frontend deploys as a static route at:

`/apps/what-changed/`

The aggregate layer is a Pages Function at:

`/api/what-changed`

## D1 binding

Create one D1 database for this app, apply `migrations/0001_what_changed.sql`, then bind it to the RINKIMIRIKATA Pages project with the variable name:

`WHAT_CHANGED_DB`

Cloudflare Pages Functions expose D1 bindings through `context.env`, which is what the API uses.

Without the binding, the API reports itself unavailable and the personal mirror still works. No fake population data appears.

## Pages layout

Keep the root `functions/` directory at repository root so Cloudflare Pages discovers `/api/what-changed` automatically. No framework or build command is required for the app route.

## Smoke checks

1. Open `/apps/what-changed/` and complete all ten stations.
2. Confirm the SAME GROUND mirror appears even before D1 is connected.
3. Once D1 is connected, `GET /api/what-changed` should return JSON with `available: true`.
4. Complete one crossing and confirm `totalCrossings` increases by one.
5. Confirm D1 contains only the three aggregate tables from the migration.
