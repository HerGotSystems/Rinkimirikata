# Human Testing Lab — Integration v0.1

## Status

Prototype integration branch. No production Human Test Network API is connected yet.

## Role

Rinkimirikata is the public-facing discovery and testing surface. It must not own the economic ledger or duplicate the Human Test Network database.

The Human Test Network core owns:

- identities and tester profiles
- projects
- tests and tasks
- claims
- task results and evidence
- Test Minutes ledger
- future reputation and disputes

Rinkimirikata consumes a sanitized public feed and launches bounded testing sessions.

## Planned API contract

- `GET /api/public/tests` — sanitized open-test feed
- `POST /api/tests/:id/claim` — authenticated claim
- `POST /api/claims/:id/submit` — authenticated submission

The public feed must never expose creator email, credentials, private notes or sensitive evidence.

## Permission scopes

Initial safe scopes:

- `public_navigation`
- `account_creation`
- `test_account`
- `file_upload`
- `simulated_payment`

Real payment or destructive testing require separate high-risk gates and are not part of the first public release.
