# Deploy WHAT CHANGED? on the RINKIMIRIKATA Cloudflare Worker

The frontend is served from Worker static assets at:

`/apps/what-changed/`

The aggregate API is routed through `src/index.js` at:

`/api/what-changed`

## 1. Create the D1 database

From the repository root:

```bash
npx wrangler@latest d1 create what-changed-db
```

Wrangler prints a `database_id` and may offer to add the binding automatically. The required binding name is:

`WHAT_CHANGED_DB`

The resulting section in `wrangler.jsonc` must be:

```jsonc
"d1_databases": [
  {
    "binding": "WHAT_CHANGED_DB",
    "database_name": "what-changed-db",
    "database_id": "<database id returned by Cloudflare>"
  }
]
```

Do not commit a placeholder database ID.

## 2. Apply and verify the schema locally

The real migration file is `migrations/0001_what_changed.sql`.

```bash
npx wrangler@latest d1 execute what-changed-db --local --file=./migrations/0001_what_changed.sql
npx wrangler@latest d1 execute what-changed-db --local --command="SELECT * FROM what_changed_meta; SELECT situation_id, total, steady, moved FROM what_changed_situation_stats ORDER BY situation_id;"
```

The verification must show:

- `total_crossings = 0`
- five zeroed situation rows

## 3. Apply the schema remotely

Only after the local execution succeeds:

```bash
npx wrangler@latest d1 execute what-changed-db --remote --file=./migrations/0001_what_changed.sql
npx wrangler@latest d1 execute what-changed-db --remote --command="SELECT * FROM what_changed_meta; SELECT situation_id, total, steady, moved FROM what_changed_situation_stats ORDER BY situation_id;"
```

## 4. Deploy verification

After `wrangler.jsonc` contains the real database ID and Cloudflare deploys the commit:

1. `GET /api/what-changed` returns `available: true`, `totalCrossings: 0`, and five zeroed situation rows.
2. Complete all ten stations in `/apps/what-changed/`.
3. The aggregate `POST /api/what-changed` returns HTTP `201`.
4. A second `GET /api/what-changed` reports `totalCrossings: 1`.
5. D1 still contains only aggregate tables and no per-visitor response rows.

Without the D1 binding, the personal crossing and SAME GROUND mirror continue to work, but the API intentionally reports the aggregate database as unavailable.
