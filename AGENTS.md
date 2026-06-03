# AGENTS.md - 4uentes-ards-control-plane

## Purpose

This repository is the ARDS/SDD control plane for 4uentes. It catalogs logical
services, logical solutions, local binding evidence, requests, validation rules,
and execution evidence.

It does not contain product runtime code and does not replace local ARDS/SDD
inside functional repositories.

## Source of standard

Use `4uentes-ards-core` as the standard source for ARDS/SDD kinds, profiles,
capability templates, schemas, and handoff rules.

This repository consumes the standard. It does not redefine it.

## Responsibilities

- Maintain `catalog/services/*.yaml` as stable logical service identities.
- Maintain `solutions/*.yaml` as logical solution maps.
- Keep local paths out of stable catalog files.
- Use `environments/local/bindings.local.yaml` only for host-specific paths.
- Validate catalog, solutions, local bindings, requests, and evidence.
- Plan cross-repo requests before any repo is modified.
- For cross-repo work, create or advance the internal request lifecycle before
  modifying child repositories whenever feasible.

## Non-goals

- Do not create product services.
- Do not create `sst-solution` or `fulbito-solution` in this phase.
- Do not replace Kubernetes, Docker Compose, GitOps, or CI/CD.
- Do not touch functional repos without an approved request and plan.
- Do not treat legacy aliases as canonical identities.

## Editing rules

- Keep changes small and auditable.
- If information is missing, write `TODO`.
- Do not use absolute local paths in `catalog/` or `solutions/`.
- Absolute local paths may appear only in `inventory/` evidence or ignored local bindings.
- Do not modify `4uentes-core` from this repo workflow.
- Do not modify `sst-fend`, `sst-bend`, `sst-extension`, `4uentes-auth`, or infra repos without a request.
- If child repositories were already modified before the lifecycle was created,
  record a retroactive request/evidence entry and make the ordering deviation
  explicit.

## Model and Subagent Selection Annex

This repo has an operational annex for model and subagent selection:

- `docs/ai/model-selection-policy.md`

Before planning or executing a task, agents must classify it as:

- `short-defined-task`
- `long-context-task`
- `complex-high-risk-task`

Then apply the policy defined in the ARDS/SDD annex. For planned work, the
classification must become an auditable `task_weight`, `model_selection`, and
`subagent_deployment_plan` entry. If subagents are required by policy but cannot
be spawned by the runtime, record the fallback instead of silently skipping the
step.

This rule complements the existing ARDS/SDD; it does not replace working
agreements, specs, docs, playbooks, requests, handoffs, or current repository
decisions.

## Validation

Run:

```bash
npm run check
```

This runs:

- `node scripts/verify-catalog.js`
- `node scripts/verify-local-bindings.js --optional`

Validation failures must be fixed before moving to requests.
