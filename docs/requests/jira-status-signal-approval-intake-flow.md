# Jira Status Signal Approval Intake Flow

## Purpose

This document defines how the control-plane handles Jira status signals after
read-only observation and local dry-run proposal generation.

The control-plane remains the source of truth for ARDS/SDD lifecycle state. Jira
is an operational mirror and coordination surface.

## Inputs

- Jira status observations from read-only evidence.
- Local status transition proposals.
- Sync health classifications.
- Feature-state and request lifecycle evidence.

## Signal Classes

### no-op

The Jira observation does not require local action.

Allowed result:

- keep local state unchanged
- keep Jira unchanged
- record health as synchronized when other reconciliation checks pass

### record-signal

The Jira observation contains useful operational information but does not prove
that local work has started, continued, or completed.

Allowed result:

- record the signal in evidence
- keep local state unchanged
- keep Jira unchanged
- route the signal to intake review

Forbidden result:

- automatic local lifecycle transition
- automatic Jira transition to `En curso`
- treating assignment alone as implementation approval

### continue-request

The observation and local evidence together indicate that an existing request
should continue.

Required before execution:

- matching active or planned CR-SST request
- evidence that the requested work is in scope of that request
- explicit approval to continue or execute the next lifecycle step

### open-request-candidate

The observation points to work that does not map cleanly to an existing local
request.

Required before execution:

- create a new inbox request candidate
- define scope and dependencies
- plan the request before touching functional repositories

### approved-write

A Jira write is only allowed after a local request explicitly approves it.

Required before execution:

- exact Jira issue key
- exact transition target
- reason for the transition
- local evidence supporting the transition
- human approval or approved write gate
- execution evidence after the write

## Current Decision Rule

For CR-SST-0045, `STATUS_SIGNAL_PENDING` items from CR-SST-0044 are intake
signals only. They do not authorize Jira writes or local lifecycle transitions.

If the next product objective is SST user internal memory, it should be handled
through its own CR-SST request and, if needed, its own Jira ticket or explicit
linkage. It should not be inferred from unrelated feature-state issues.
