CR-SST-0115 closure checkpoint.

SST-45 can move to `Listo`.

Completed:

- Defined annotated selection BFF/API contract.
- Defined payload fields for `sourceRef`, `sourceText`, `selector`,
  `selectionRange`, `contentTags`, `relevance`, `acceptanceState` and
  `originArticleId`.
- Preserved `node-auth` as the required BFF boundary.
- Preserved `sst-bend` as owner of persistence/query semantics.
- Kept `ArticleTag` separate from `LearningContentTag`.

Validation:

- `4uentes-orchestor npm.cmd run check`: PASS.
- Owner documentation enforcement: PASS.

Evidence:

- `evidence/requests/CR-SST-0115/annotated-selection-bff-api-contract.md`
- `evidence/requests/CR-SST-0115/implementation-boundary.md`
- `evidence/requests/CR-SST-0115/validation-results.md`

Boundary:

- This CR is contract-only.
- Runtime persistence is handled by CR-SST-0116.
- Jira remains an operational mirror; ARDS/SDD remains source of truth.
