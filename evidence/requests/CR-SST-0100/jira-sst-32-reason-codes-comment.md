CR-SST-0100 refinement checkpoint.

Manual QA clarified that “all items have PDF” is true technically, but not
functionally: some PDFs are visual captures and others are textual fallback PDFs.

Adjusted in SST-32:

- Fallback warnings are now more specific when the browser exposes a safe cause:
  - `unsupported-url`
  - `tab-readiness-timeout`
  - `visual-capture-too-long`
  - `visual-capture-metrics-unavailable`
  - `visual-capture-empty-image`
  - `visual-capture-unavailable`
  - `pdf-materialization-fallback`
- UI labels remain sanitized and do not expose page content, HTML, real PDFs,
  cookies, JWTs, secrets, or plaintext credentials.
- Owner docs now state that current capture behavior is `auto`: visual PDF first,
  textual fallback when visual capture is unavailable.

Follow-up:

- Configurable capture modes (`auto`, `visual-only`, `text-only`, `prefer-text`)
  are reserved as `CR-SST-0119` under `INIT-SST-0003`.
- This keeps SST-32 focused on UI clarity and precise degradation reasons without
  expanding behavior scope.

Validation:

- `pnpm.cmd test -- --run src/features/sessions/create-session-capture-service.test.ts src/ui/quick-save/session-queue-helpers.test.ts src/platform/storage/extension-storage.test.ts`: PASS.
- `pnpm.cmd check`: PASS after escalated retry for WXT `.output` cleanup.
- `npm.cmd run check` in control-plane: PASS.
