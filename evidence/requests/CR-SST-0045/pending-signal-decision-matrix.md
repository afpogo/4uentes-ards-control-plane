# Pending Signal Decision Matrix

## Inputs

- Source request: `CR-SST-0044`
- Source proposal request: `CR-SST-0042`
- Sync health state: `STATUS_SIGNAL_PENDING`

## Decisions

| Feature state | Jira issue | Jira status | Proposal action | Decision | Reason |
| --- | --- | --- | --- | --- | --- |
| `document-agent` | `SST-8` | `Tareas por hacer` | `record-signal` | record only | Assignment is a useful signal, but it does not prove current implementation work or authorize Jira transition. |
| `cluster-publication-ngrok-domain` | `SST-11` | `Tareas por hacer` | `record-signal` | record only | Assignment is a useful signal, but the feature is already `validated-live`; changing Jira requires a separate approved write decision. |

## Transition Decision

No Jira issue should be moved to `En curso` from this evidence.

## Next Eligible Paths

- If the user wants to work on SST user internal memory, create or continue a
  dedicated CR-SST request for that product runtime memory scope.
- If the user wants Jira to mirror current feature state, create an approved
  Jira write request with exact issue keys and target statuses.
- If a Jira assignment should become implementation work, convert the signal
  into a scoped request candidate first.
