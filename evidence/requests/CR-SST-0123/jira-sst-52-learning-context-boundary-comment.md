CR-SST-0123 / SST-52 capability boundary update.

We clarified the backend/BFF capabilities so frontend QA can validate the real content-generation sheet as a LearningContext surface, separate from live Article resources.

Owner docs/specs updated:

- sst-bend outbound capability:
  - `specs/capabilities/outbound/learning-workspace-context.yaml`
  - `docs/capabilities/outbound/learning-workspace-context.md`
- node-auth inbound capability:
  - `specs/capabilities/inbound/sst-bend--learning-workspace-context.yaml`
  - `docs/capabilities/inbound/sst-bend--learning-workspace-context.md`

Contract clarified:

- LearningContext can be previewed/accepted without creating an Article first.
- LearningContext does not require external `url` or `sourceUrl`.
- `originArticleId` is optional linkage/provenance, not a required identity.
- ArticleTag remains article-wide; LearningContentTag/relevance applies to fragments/content blocks.
- BFF must not convert LearningContext payloads into Article CRUD requests.

Validation:

- `sst-bend npm.cmd run check`: exit 0, protected smoke coverage remains partial without `SMOKE_JWT`.
- `node-auth npm.cmd run check`: PASS.
- `4uentes-orchestor npm.cmd run check`: PASS.

Relation to SST-53:

- SST-53 remains a separate Article runtime issue for native text Article creation without URL returning `400 Missing url`.
- SST-52 frontend UX QA can proceed through LearningWorkspace preview/accept/context without depending on Article creation.
