CR-SST-0116 closure checkpoint.

SST-46 can move to `Listo`.

Completed:

- Implemented accepted annotated text context persistence in `sst-bend`.
- Added `LearningAnnotationRef` and migration
  `20260704120000-create-learning-annotation-refs`.
- `POST /learning-workspaces/sources/preview` accepts `annotations[]`.
- Previewed annotations are persisted as non-context `previewed` state.
- `accept` and `reject` support `annotationIds`.
- `GET /learning-workspaces/context` exposes accepted annotations only.
- `node-auth` keeps the BFF passthrough and now supports `API_BODY_LIMIT=1mb`.
- Owner ARDS/SDD documentation was updated in `sst-bend` and `node-auth`.

Validation:

- `sst-bend npm.cmd run migration:run`: PASS.
- `sst-bend npm.cmd run test:learning-workspace`: PASS, 15/15.
- `sst-bend npm.cmd run check`: PASS with existing partial protected smoke warning because `SMOKE_JWT`/`SMOKE_JWT_OWNER` were not provided.
- `node-auth npm.cmd run check`: PASS.
- `4uentes-orchestor npm.cmd run check`: PASS.
- Owner documentation enforcement: PASS.

Evidence:

- `evidence/requests/CR-SST-0116/implementation-summary.md`
- `evidence/requests/CR-SST-0116/owner-documentation-summary.md`
- `evidence/requests/CR-SST-0116/validation-results.md`

Boundary:

- Markdown/template rendering remains in CR-SST-0117.
- End-to-end validation remains in CR-SST-0118.
- Jira remains an operational mirror; ARDS/SDD remains source of truth.
