CR-SST-0117 start checkpoint.

SST-47 can move to `En curso`.

Purpose:

- Render accepted annotated text into a stable Markdown-like or themed view.
- Preserve semantic source metadata from accepted annotations.
- Keep selectors, `contentTags`, `relevance`, source references and accepted
  state traceable after rendering.

Inputs already completed:

- CR-SST-0114: contextual selection tagging in `sst-fend`.
- CR-SST-0115: annotated selection BFF/API contract.
- CR-SST-0116: backend/BFF persistence for accepted annotated text context.

Planned scope:

- Review `sst-fend` and `sst-bend` readiness.
- Implement render/template view without discarding semantic annotation data.
- Update owner ARDS/SDD docs in affected repos.
- Validate with repo checks and control-plane owner enforcement.

Boundary:

- Jira remains an operational mirror.
- ARDS/SDD remains source of truth.
- SST-6 remains `En curso` until remaining CRs are closed.
