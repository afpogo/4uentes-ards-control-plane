CR-SST-0100 implementation checkpoint.

Implemented in `sst-extension`:

- Session queue items now show capture quality counts:
  visual PDF, textual fallback and tabs with warnings.
- Per-tab metadata is rendered from sanitized local snapshot fields only.
- Existing actions remain available: retry, restore, open origin and delete.
- Owner ARDS/SDD docs were updated.

Validation:

- `pnpm.cmd check` in `sst-extension`: PASS.
- Control-plane enforcement pending after this comment will remain the local
  closure gate.

Pending before closure:

- Manual QA in popup/sidepanel after reloading the extension from `.output/chrome-mv3`.

Boundary:

- No backend/BFF contract change.
- No `node-auth` or `sst-bend` mutation.
- Evidence does not include private page content, real PDFs, cookies, JWTs,
  secrets or plaintext credentials.
