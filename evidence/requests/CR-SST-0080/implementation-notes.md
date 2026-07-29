# CR-SST-0080 implementation notes

Status: work in progress

Implemented in `sst-extension`:
- Added a storage-level purge for local quick-save, text-article-pdf, and captured-session queues plus their visible `lastResult` state.
- Integrated the purge into `node-auth` logout.
- Integrated the purge into `node-auth` base URL changes so a new origin or next operator does not inherit old local snapshots.
- Updated the session integration spec and human doc to reflect that local queues are device-local state and must be purged on logout or base-url changes.
- Added focused tests for storage purge and for `updateConfig` plus `logout` queue clearing.

Residual note:
- The extension still does not model per-user ownership for local queues. This change enforces purge boundaries on logout and base-url changes, but it does not introduce selective multi-user local isolation.

Not validated yet:
- `pnpm run check` in `sst-extension`
- Manual smoke for logout/change-user snapshot purge in the browser
