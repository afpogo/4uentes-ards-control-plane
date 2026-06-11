# Document Agent Workflow Contract Summary

## Status

- Date: 2026-06-07
- Request: `CR-SST-0008`
- Capability: `capability.inbound.sst-document-agent-workflows`
- Contract file: `specs/capabilities/inbound/4uentes-orchestor--document-agent-workflows.yaml`
- Jira issue: `SST-8`
- Jira status observed: `En curso`

## Required Contract Artifacts

The inbound capability defines the three artifacts requested by `CR-SST-0008`:

| Artifact | Location | Status |
| --- | --- | --- |
| `operation_intent` schema | `schema.operation_intent` | documented |
| `handoff_payload` schema | `schema.handoff_payload` | documented |
| `document_agent_event` schema | `schema.document_agent_event` | documented |

## Operation Intent

The contract requires stable identity and routing fields:

- `operation_intent_id`
- `capability_id`
- `tenant_id`
- `user_id`
- `payload`
- `preferred_execution_window`
- `priority`
- `idempotency_key`
- `correlation_id`

Allowed document-agent capability ids are:

- `document-agent.document_ingest`
- `document-agent.document_process`
- `document-agent.document_tagging`

## Handoff Payload

The handoff payload keeps execution backend-first and auditable. Required fields
include operation identity, tenant scope, retry policy, idempotency,
correlation, and `audit_metadata`.

The required audit metadata fields are:

- `origin_service`
- `created_at`
- `created_by`
- `reason`

## Document Agent Event

The document event contract requires:

- `document_agent_event_id`
- `tenant_id`
- `user_id`
- `document_id`
- `event_type`
- `document_state`
- `persisted`
- `received_at`
- `source_service`

## Ownership Decision

- `sst-fend` produces user-facing document workflow events.
- `4uentes-auth` validates user, tenant, and account scope.
- `sst-bend` owns the first durable job state machine.
- `4uentes-orchestor` keeps the control-plane contract, evidence, and lifecycle
  decision boundary.

## Boundary

No functional repository was modified by this request. Runtime implementation
and E2E validation must happen through a later approved request if required.
