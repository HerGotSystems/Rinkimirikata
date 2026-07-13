# WHAT CHANGED?
## An Omnunity crossing — implemented v1

WHAT CHANGED? is a single-page, no-login, no-tracker experience. The visitor crosses ten scenes built from five paired human needs: healthcare, shelter, work, care for people who cannot cross alone, and forgiveness.

Each need first appears without a strong identity label. It later returns with the material facts held stable and one identifying signal changed. The second pass is deliberately reordered so the pairs are not presented back-to-back or in the same sequence.

The visitor chooses **Yes**, **No**, or **It depends** through in-world actions. “It depends” requires one stated condition. No numerical ideology score is created.

The final **SAME GROUND** mirror compares only the visitor’s own paired answers:

- same yes/no: held steady;
- same conditional answer and same reason: held steady with a condition;
- same conditional answer but a different reason: condition moved;
- different answer: moved.

The app works fully for visitor #1. Population data is secondary and stays hidden until 100 completed crossings.

## Privacy architecture

- Personal answers and mirror logic stay in the browser.
- Session progress uses `sessionStorage`.
- A local one-bit submitted flag reduces accidental duplicate aggregate submissions.
- The API receives five pair summaries only after completion.
- D1 stores aggregate counters only.
- There are no visitor rows, names, emails, account IDs, IP addresses, user agents, timestamps, exact locations, advertising IDs, or third-party analytics in the application database.

## Implemented structure

- `apps/what-changed/index.html`
- `apps/what-changed/styles.css`
- `apps/what-changed/data.js`
- `apps/what-changed/app.js`
- `apps/what-changed/water.js`
- `functions/api/what-changed.js`
- `migrations/0001_what_changed.sql`

The frontend fails open: if the D1 binding or API is absent, the personal crossing and mirror remain complete and the population panel honestly remains in baseline mode.
