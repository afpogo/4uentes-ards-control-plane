# SST Isolated Service-Backed Check

Observed date: 2026-08-29

## Outcome

The service-backed owner check for `CR-HPT-0023` passed against an isolated SST
process and an ephemeral PostgreSQL database. The reviewed owner tip is
`sst-bend@2a0de56`. No remote publication or shared runtime mutation occurred.

## Isolation Controls

- PostgreSQL 16 ran in the request-specific container
  `cr-hpt-0023-sst-check-pg` on loopback port `55432`.
- The database used trust authentication, synthetic names and no volume, so no
  password or persistent data was created.
- SST ran directly from the promotion worktree on port `3005` with chat, user
  memory, Plaud and the Phinance proxy disabled.
- No JWT, membership identifier, receipt object, secret or financial record was
  provided.
- SST and the database were stopped after the check. Readback confirmed that no
  listener or container remained.

## Validation Result

- The public gallery smoke returned `200` with the expected empty pagination.
- `npm run check` exited `0` and passed all functional, contract, receipt,
  Automation, article-processing and ARDS checks.
- Protected coverage remained intentionally partial because no promoted JWT,
  receipt binding, clean object or Scrapper fixture was authorized. The owner
  check reported `1/2` protected endpoints and preserved the skip reasons.
- `SMOKE_REQUIRE_AUTH` was not enabled; the result proves the public
  service-backed gate, not protected integrated receipt traffic.

## Fresh Database Drift

Both request-owned migrations completed successfully:

- `20260827120000-create-receipt-intake-boundary`;
- `20260828100000-add-receipt-binding-provisioning`.

The later baseline migration
`20260829010000-adopt-article-agent-processing-v1` failed while adding
`document_agent_jobs.tenant_id` because the historical
`20260524120000-create-document-agent-jobs` migration imports the mutable
current `DocumentAgentJobSchema`, which already contains that column.

The conflicting migration belongs to the Article Agent owner history
(`d10a044`, outside `CR-HPT-0023`). It was not modified. Canonical promotion
remains held until SST reconciles the fresh-database migration chain through a
separate approved lifecycle or explicitly accepts the unrelated baseline risk.

## Collision Boundary

`CR-HPT-0021` remained clean at `dbd5515` and retained its Kubernetes Secret
protection blocker. This check did not use its Phinance image, Compose surface,
kind cluster, infrastructure manifests, secrets or Jira scope.
