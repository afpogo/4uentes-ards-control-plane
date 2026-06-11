# Status Signal Approval Intake Flow

## Scope

This evidence records the CR-SST-0045 implementation decision. The work is
limited to control-plane lifecycle documentation and evidence.

No Jira writes were executed. No feature-state files were transitioned. No
functional repositories were modified.

## Intake Flow

1. Read the latest Jira observation evidence.
2. Read local transition proposals.
3. Read sync health summary.
4. Classify each item as `no-op`, `record-signal`, `continue-request`,
   `open-request-candidate`, blocker candidate, or approved write candidate.
5. For `record-signal`, preserve the signal as evidence and stop.
6. For `continue-request`, require a matching active or planned CR-SST request.
7. For `open-request-candidate`, create a new request candidate before any repo
   modification.
8. For Jira writes, require explicit issue key, target status, local evidence,
   approval, and post-write evidence.

## Current Pending Signals

The current pending signals are:

- `document-agent` linked to `SST-8`
- `cluster-publication-ngrok-domain` linked to `SST-11`

Both remain intake signals only because the observed action is `record-signal`,
not `continue-request` or `approved-write`.

## Boundary

The SST user internal memory work is a product/runtime memory concern. It should
not be attached to an unrelated Jira feature issue just because that issue is
currently visible in the Jira sync set.
