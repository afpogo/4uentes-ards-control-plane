# Jira Live Comparison - INIT-SST-0001 / SST-6 / SST-28

Date: 2026-07-03

## Mode

Mode: `mcp-read-only`.

Read path used:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\observe-issue.js --connect --request-id CR-SST-0092 --output-dir evidence\requests\CR-SST-0092 --issue-key <issue>
```

Direct Atlassian MCP search still returned `403 app is not installed`, so the
working path is the documented `mcp-remote` operational endpoint.

No Jira write was executed.

## Observed Jira Mirror

| Jira issue | Local mapping | Jira status | Jira updated | Evidence |
| --- | --- | --- | --- | --- |
| `SST-27` | `INIT-SST-0001` epic mirror | `En curso` | `2026-07-03T01:54:55.676-0300` | `evidence/requests/CR-SST-0092/jira-issue-SST-27-observation.md` |
| `SST-6` | `learning-content-tags` active feature-state mirror | `En curso` | `2026-06-29T00:04:19.066-0300` | `evidence/requests/CR-SST-0092/jira-issue-SST-6-observation.md` |
| `SST-28` | `CR-SST-0092` execution task mirror | `En curso` | `2026-06-29T22:43:38.022-0300` | `evidence/requests/CR-SST-0092/jira-issue-SST-28-observation.md` |

## ARDS/SDD Local Source

| Local artifact | Local status | Notes |
| --- | --- | --- |
| `initiatives/INIT-SST-0001-tags-governance-continuity.yaml` | `planned` | Tracking block says Jira `SST-27` is `En curso`; open gaps record lifecycle drift. |
| `state/features/learning-content-tags.current.yaml` | `implemented-local` | Includes `CR-SST-0088` through `CR-SST-0097`; gaps remain for frontend rendering and remaining parser flows. |
| `requests/planned/CR-SST-0092-sst-bend-learning-workspace-first-runtime-slice.yaml` | `planned`, `decision: pending` | Evidence shows implementation and validation were executed. |
| `requests/planned/CR-SST-0097-sst-bend-learning-workspace-owner-docs-remediation.yaml` | `planned`, `decision: pending` | Evidence shows owner documentation remediation and follow-up were executed. |

## Comparison

### INIT-SST-0001 vs SST-27

Aligned:

- Jira `SST-27` exists as the initiative-level epic mirror.
- Jira status `En curso` matches the initiative tracking block.
- Labels match the initiative scope.

Drift:

- Local initiative status remains `planned`.
- Jira description lists `CR-SST-0088` through `CR-SST-0091`, but does not list
  `CR-SST-0092`, `CR-SST-0097`, or the 2026-07-03 owner enforcement review.

### learning-content-tags / SST-6

Aligned:

- Jira `SST-6` remains `En curso`.
- Jira labels still represent `implemented-local` and `not-done`, matching the
  feature-state not being complete.
- Local gaps still justify keeping `SST-6` active.

Drift:

- Jira description is stale. It only references `CR-SST-0015` and
  `CR-SST-0016`, while local ARDS/SDD now includes `CR-SST-0088` through
  `CR-SST-0097`.
- Jira description does not mention that the first backend
  `LearningWorkspace` runtime slice is implemented and owner-doc remediated.

### CR-SST-0092 / SST-28

Aligned:

- Jira `SST-28` maps to `CR-SST-0092`.
- Jira parent is the `SST-27` epic.
- Jira description matches the original execution scope and boundary.

Drift:

- Jira status remains `En curso`, while local evidence shows the backend slice
  was implemented and validated.
- `CR-SST-0097` remediated the owner documentation gap after `CR-SST-0092`, but
  `SST-28` does not mention that remediation.
- Local request lifecycle still says `planned` and `decision: pending`.

## Recommended Next Actions

1. Normalize local lifecycle for `CR-SST-0092` and `CR-SST-0097` before or
   alongside any Jira transition.
2. Prepare Jira update payloads for `SST-27`, `SST-6`, and `SST-28` as a dry run.
3. If approved, update Jira descriptions/comments to mirror current ARDS/SDD.
4. Consider transitioning `SST-28` to `In Review` or `Listo` only after local
   lifecycle normalization records closure criteria and remaining consumer gaps
   are separated from the backend execution task.

## Secret Handling

No tokens, cookies, authorization headers, or credentials were written to this
evidence.
