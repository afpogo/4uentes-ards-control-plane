# CR-SST-0124 Policy And Owner Enforcement Start

Date: 2026-07-07

## Request

- CR: `CR-SST-0124`
- Initiative: `INIT-SST-0001`
- Jira parent: `SST-6`
- Jira epic: `SST-27`
- Related prior CR: `CR-SST-0123`
- Related prior Jira issue: `SST-52`

## Policies Reviewed

- Registry: `specs/integration/policies.yaml`
- Owner authority: `docs/policies/owner-documentation-authority-policy.md`
- Control-plane instructions: `AGENTS.md`

## Owner Enforcement

The CR allows child repository mutation only after request planning. Planned
mutation starts in `sst-fend`; `node-auth` and `sst-bend` are verify-only unless
analysis proves their owner boundary must change.

Required owner documentation for any `sst-fend` mutation:

- `docs/33-articles-frontend.md`
- `specs/33-articles-frontend.yml`
- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`

Closure must include the full control-plane check:

```bash
npm.cmd run check
```

## Boundary

This CR must keep these concepts separate:

- External source URL: optional for native text articles and used only when the
  article represents an external source.
- Runtime/app URL: derived from the current SST runtime origin plus article id,
  used so a user can open a native SST article in a browser.

Internal runtime URLs must not be routed into scraping/import source semantics.

