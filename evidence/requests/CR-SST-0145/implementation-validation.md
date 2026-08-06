# CR-SST-0145 - Implementation and validation evidence

Status: validated-local

## Intent and architecture

The visible catalog `Type` selector now filters the canonical business
classification through `payloadKind`. The query crosses `sst-fend -> node-auth
-> sst-bend` unchanged. SST validates `web|text|transcript` and applies a
required join over the persisted `ArticlePayload.kind` association while
retaining account scope, count and pagination.

The legacy `filterType` query remains independently supported. No URL,
`filter.type`, transport or node metadata is used to infer or mutate article
kind, and no historical rows were changed.

## Implementation anchors

- `sst-fend`: service/query types, URL state, Redux action, catalog toolbar and
  regression tests.
- `node-auth`: typed query parsing and passthrough to the SST facade.
- `sst-bend`: Joi query contract, controller/use-case propagation and required
  payload include in the Sequelize repository.

## Automated validation

- `sst-fend npm.cmd test -- Articles.test.tsx ArticlesToolbar.test.tsx articulo.action.test.ts --runInBand`: PASS, 3 suites / 42 tests.
- `sst-fend npm.cmd run check`: PASS, 30 suites / 187 tests; 22 pre-existing
  hook warnings and existing Ant Design/React test deprecation output remain
  non-blocking.
- `node-auth npm.cmd run check`: PASS.
- `node-auth npm.cmd run build`: PASS (`tsc`).
- `sst-bend npm.cmd run test:article-kind-contract`: PASS. The existing mock
  preview warning remains non-blocking.
- `sst-bend npm.cmd run check`: PASS. Protected smoke remains partial without
  `SMOKE_JWT`; the command reports the existing coverage warnings and exits 0.

## Authenticated browser QA

Date: 2026-07-19. Browser: Chrome DevTools MCP against the local bind-mounted
stack (`sst-fend:4090`, `node-auth:4000`, `sst-bend:3005`).

- Desktop `1440x900`: `payloadKind=text` showed only `E2E Kind Text
  2026-07-18`; `payloadKind=web` showed Web records and excluded the Text test
  record.
- Selector interaction: choosing `Text` from `Type` changed the URL to
  `payloadKind=text`; the resulting request was `GET /api/articulos?...&payloadKind=text&...`
  and the UI converged to `Showing 1-1 of 1 briefings`.
- The selector contains `All types`, `Text`, `Web` and `Transcript`; legacy
  audio/video filter metadata is not presented as semantic article kind.
- Mobile emulation `390x844`: Text and Web result sets remained kind-correct;
  `documentElement.scrollWidth=390`, so no horizontal overflow was present.
- No console messages were present in the final selector-driven navigation.
  Requests used the existing articles endpoint; no new endpoint was introduced.
- Existing authorized test records were reused. No deletion or historical-data
  mutation was performed.

Screenshots:

- `evidence/requests/CR-SST-0145/desktop-text-filter.png`
- `evidence/requests/CR-SST-0145/desktop-web-filter.png`
- `evidence/requests/CR-SST-0145/mobile-text-filter.png`
- `evidence/requests/CR-SST-0145/mobile-web-filter.png`

## Owner enforcement

Normative/derived ARDS/SDD was updated in `sst-fend`, `node-auth` and
`sst-bend`. The controlling links are `CR-SST-0145`, `INIT-SST-0005` and Jira
mirror `SST-85`; predecessor links remain recorded.

## Decision

The defect is corrected and validated locally. This does not publish a release
and does not close the initiative/Epic: `CR-SST-0134 / SST-64` remains the
separate human-reviewed historical-reconciliation gate.

## Jira mirror

- `SST-85`: closure comment `10227`; transitioned to `Listo` after local closure.
- `SST-84`: closure comment `10228`; transitioned to `Listo` after the E2E gate was revalidated.
- `SST-57`: intentionally remains `En curso` because `CR-SST-0134 / SST-64`
  is still open and no publication evidence exists.
