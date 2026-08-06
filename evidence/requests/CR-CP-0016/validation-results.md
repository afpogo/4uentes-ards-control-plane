# CR-CP-0016 - Validation Results

## Core canon

Command: `npm.cmd run check`

Working directory: `C:\Users\andre\Desktop\4uentes\apps\4uentes-core`

Result: passed with 0 errors and 0 warnings. Node emitted only unrelated
experimental loader and deprecation notices.

## Control plane

Commands:

- `node --check scripts/plan-change.js`
- `npm.cmd run check`

Result: passed. Catalog, local bindings, state model, initiatives, and owner
documentation checks completed without failures.

## Planner scenarios

The planner was exercised in an isolated temporary copy:

- `normal` short -> `gpt-5.6-sol/low`
- `high` long -> `gpt-5.6-sol/high`
- `normal` high-risk -> `gpt-5.6-sol/max`
- `low` short -> `gpt-5.3-spark/low`
- `low` long -> `gpt-5.4-fast-high/high`
- `low` high-risk -> `gpt-5.5/high`
- `very-low` short low-risk -> `gpt-5.3-spark/low`
- `very-low` long -> blocked
- `very-low` high-risk -> blocked

## Source validation

The core records the official OpenAI latest-model and GPT-5.6 Sol guidance in
`docs/reference-sources.md` and
`governance/source-validation-gpt-5.6-codex.md`.

