# Execution Model

## From catalog to request

The control-plane starts from the stable catalog and solution maps. A future
request records a desired change and names the initial solution or services.

## Request lifecycle

Phase 2 introduces the request lifecycle:

```text
inbox -> planned -> queued -> running -> done
                         `-> rejected
```

- `inbox`: request received but not expanded.
- `planned`: impact calculated by the planner.
- `queued`: approved for later execution.
- `running`: execution in progress.
- `done`: completed with evidence.
- `rejected`: not accepted for execution.

`planned` does not mean approved. It means the control-plane computed impact,
required context, required checks, and initial risk.

## Impact detection

Impact analysis reads:

- `catalog/services/*.yaml`
- `solutions/*.yaml`
- local bindings when available
- local ARDS artifacts when a request is approved for inspection

The output should list affected services, ARDS kinds, required local context,
risks, and required checks.

## Planner

`scripts/plan-change.js` reads one request from `requests/inbox/`, validates the
declared solution and services, expands the affected services from
`solutions/*.yaml`, and writes a planned copy to `requests/planned/`.

The planner:

- reads `catalog/services/*.yaml`;
- reads `solutions/*.yaml`;
- resolves `ards.kind` per affected service;
- adds `required_context`;
- adds `required_checks`;
- classifies risk;
- never modifies functional repositories;
- never executes functional repository checks.

## Validation

Validation starts with:

```bash
npm run check
```

This verifies the control-plane catalog and optional local bindings. Functional
repo checks are not executed in Fase 1B or by the Phase 2 planner.

## Evidence

Observed state belongs in `inventory/` or future `evidence/` folders. Evidence
can include command output, changed file summaries, affected service summaries,
and validation results.

Evidence must not become stable configuration unless a later phase promotes it
explicitly.
