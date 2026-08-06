# CR-CP-0016 - Codex Model Selection Matrix

## Decision

The existing `agent-model-selection-policy` was extended without changing its
id. The extension applies to Codex and combines task classification with the
operational resource levels `very-low`, `low`, `normal`, and `high`.

`normal` is the default until INIT-CP-0003 / ARDS-13 supplies a runtime signal.
Explicit values are recorded as manual overrides.

## Effective routing

| Resources | Short | Long context | High risk |
| --- | --- | --- | --- |
| `high` | Sol `high` | Sol `high` | Sol `max` |
| `normal` | Sol `low` | Sol `high` | Sol `max` |
| `low` | 5.3 Spark `low` | 5.4 fast-high `high` | 5.5 `high` |
| `very-low` | Spark `low` for safe bounded work | reduce, atomize, or block | block |

## Boundaries

- Historical requests and evidence are not rewritten.
- Child repositories are not modified by this CR.
- Child adoption remains request-driven.
- Runtime resource detection remains deferred to ARDS-13.

