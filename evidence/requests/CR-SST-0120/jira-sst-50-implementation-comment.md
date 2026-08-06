# CR-SST-0120 implementation checkpoint

ARDS/SDD source of truth was updated for the SST-50 frontend consumer slice.

Implemented in `sst-fend`:

- Governed `ArticlePreviewResult` consumer contract for Articles.
- Reusable preview presentation resolver with `available`, `pending`,
  `unavailable`, and `rejected` states.
- Deterministic placeholder plus functional unavailable reasons for text-only
  and PDF-text articles.
- Compatibility guard for the legacy preview blob endpoint.
- Owner docs updated in `specs/33-articles-frontend.yml`,
  `docs/33-articles-frontend.md`, and task evidence.

Validation:

- Targeted Jest: PASS.
- Targeted ESLint: PASS.
- Production build: PASS with existing bundle-size warnings.
- Control-plane `npm run check`: PASS, including owner documentation gate for
  `CR-SST-0120`.

Known blocker outside this slice:

- Full `sst-fend npm run check` remains blocked by unrelated LearningWorkspace
  CRLF Prettier errors, not by SST-50 files.

Boundary:

- No changes were made to `sst-extension`, `node-auth`, `sst-bend`, API
  contracts, persistence, or private preview storage.
- Producer thumbnail generation and BFF ingestion remain future
  owner-governed slices if needed.
