CR: CR-SST-0100
Initiative: INIT-SST-0003
Epic: SST-29

Purpose:

Show session capture progress and per-tab degradation metadata in `sst-extension`
so users can understand whether each tab was captured as visual PDF or textual
fallback, without exposing private page content.

Scope:

- Surface session capture progress in popup/sidepanel.
- Show aggregate counts for visual PDF captures, textual PDF fallback and
  degraded tabs.
- Show per-tab sanitized warning metadata based on local snapshot fields from
  `CR-SST-0099`: `outcome`, `captureMode`, `warnings`.
- Preserve retry, restore and delete actions.
- Keep all metadata local to the extension UI unless an existing contract already
  exposes it.
- Update `sst-extension` owner specs/docs for observable UI behavior.

Out of scope:

- No backend/BFF contract changes.
- No `node-auth` mutation.
- No `sst-bend` mutation.
- No real private page text, cookies, JWTs, secrets, raw PDFs or credentials in
  Jira or ARDS/SDD evidence.
- No LearningWorkspace handoff implementation in this CR.

Subtasks / checklist:

- [ ] Analyze current popup/sidepanel session queue UI.
- [ ] Define presentation helpers for visual/text/degraded counts.
- [ ] Render per-tab sanitized degradation metadata.
- [ ] Preserve retry/restore/delete controls.
- [ ] Add focused tests for presentation helpers and UI state.
- [ ] Update owner docs/specs or record an explicit owner-documentation exception.
- [ ] Run `pnpm.cmd check` in `sst-extension`.
- [ ] Run `npm.cmd run check` in `4uentes-orchestor`.

Definition of Done:

- [ ] The user can understand capture quality per session.
- [ ] Per-tab metadata does not expose private content.
- [ ] Existing session queue actions remain available.
- [ ] Owner documentation gate passes.
- [ ] Jira is updated as mirror; ARDS/SDD remains source of truth.
