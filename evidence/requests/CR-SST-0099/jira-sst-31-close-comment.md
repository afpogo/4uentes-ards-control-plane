CR-SST-0099 closure checkpoint.

SST-31 can move to `Listo`.

Completed:

- Added local session snapshot outcome metadata in `sst-extension`.
- Added local capture mode metadata.
- Added sanitized local warning codes for session snapshot diagnostics.
- Preserved node-auth payload compatibility.
- Added storage normalization for legacy local queue items.
- Updated owner ARDS/SDD documentation.

Validation:

- `pnpm.cmd check` in `sst-extension`: PASS.
- `npm.cmd run check` in `4uentes-orchestor`: PASS.
- `CR-SST-0099 owner_documentation gate is valid`.

Evidence:

- `evidence/requests/CR-SST-0099/implementation-summary.md`
- `evidence/requests/CR-SST-0099/validation-results.md`
- `evidence/requests/CR-SST-0099/owner-documentation-enforcement.md`
- `evidence/requests/CR-SST-0099/jira-sst-31-implementation-sync-summary.md`

Connection policy:

- Direct Jira MCP was attempted first.
- Fallback used `scripts/jira-mcp/transition-issue-status.js`, still through MCP,
  because direct MCP search returned access denied.
- Jira REST API was not used.

Boundary:

- No backend/BFF contract change.
- No `node-auth` or `sst-bend` mutation.
- Jira remains an operational mirror; ARDS/SDD remains the source of truth.
- Evidence does not include private page content, real PDFs, cookies, JWTs,
  secrets, or plaintext credentials.
