CR-SST-0111 closure checkpoint.

SST-41 can move to `Listo`.

Completed:
- Defined the ArticleTag versus LearningContentTag intent contract.
- Defined source anchors, selectors, relevance, and acceptance-state expectations.
- Established BFF/API considerations and the child-repo implementation boundary.
- Kept this slice as a control-plane contract only; no runtime repository mutation was performed.

Validation:
- `4uentes-orchestor npm.cmd run check`: PASS.
- Owner documentation enforcement: PASS.

Evidence:
- `evidence/requests/CR-SST-0111/tagging-intent-contract.md`
- `evidence/requests/CR-SST-0111/implementation-boundary.md`
- `evidence/requests/CR-SST-0111/validation-results.md`

Boundary:
- Runtime implementation continues in later CRs.
- Jira remains operational mirror; ARDS/SDD remains source of truth.
