# sst-chatbot Orchestrator Handoff

## Purpose

This document records the control-plane view of how `sst-chatbot` can be
governed by `4uentes-orchestor`.

`sst-chatbot` is not allowed to execute server work directly. It can emit
validated operation intents and agent result payloads. The orchestrator decides
whether to accept, queue, retry, schedule, reject, or reconcile that work.

## Current Flow

```text
sst-bend event or SST request
  -> 4uentes-orchestor schedules agent work
  -> sst-chatbot produces structured validated output
  -> 4uentes-orchestor validates and records outcome
  -> SST-owned service consumes accepted result
```

## Required Inbound Contract

The control-plane inbound capability is:

```text
specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml
```

The first upstream capability mapped is:

```text
agent-lifecycle-and-orchestrator-boundary
```

Related upstream capabilities include:

- `plaud-transcript-derivations`
- `ards-structure-generation`
- `user-activity-ards-memory`
- `generated-workspace-governance`
- `prompt-catalog-and-versioning`

## Open Adoption Gap

The child repository has ARDS/SDD material and a passing check, but it has not
yet adopted the explicit `orchestrator_link` metadata required by the child
repo link rule.
