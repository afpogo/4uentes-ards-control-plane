# Backend-First Persistence Flow

## Status

- Date: 2026-06-07
- Request: `CR-SST-0008`
- Scope: control-plane contract and evidence

## Flow

1. `sst-fend` emits a structured document-agent event after user action.
2. The event carries tenant, user, document, idempotency, and correlation data.
3. `4uentes-auth` is the authority for user, tenant, and account scope.
4. `sst-bend` persists the durable job before execution.
5. `4uentes-orchestor` records or validates the handoff contract and lifecycle
   evidence.
6. Execution proceeds only after deterministic validation and request lifecycle
   approval.

## Acceptance Rules

- Free-form agent or UI output is not execution.
- Missing `tenant_id`, `user_id`, `idempotency_key`, or `correlation_id`
  rejects the handoff or keeps it out of execution.
- `preferred_execution_window` is a scheduling hint, not approval.
- Functional repo changes require a separate approved request.

## Persistence Requirements

Durable job creation must happen before document processing starts. The job
record must preserve:

- source event id;
- tenant and user scope;
- capability id;
- requested operation;
- retry policy;
- idempotency key;
- correlation id;
- audit metadata.

## Validation Boundary

`CR-SST-0008` validates the control-plane contract locally. It does not prove a
live runtime path across `sst-fend`, `sst-bend`, and `4uentes-auth`.
