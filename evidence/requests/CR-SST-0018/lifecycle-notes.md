# CR-SST-0018 - Lifecycle Notes

Observed on: 2026-05-28

## Ordering

This request was recorded retroactively.

The implementation and runtime validation happened before the control-plane
request lifecycle was fully materialized. That ordering is a deviation from the
preferred orchestrator-first process.

## Correct Process Going Forward

For cross-repo work, the expected order is:

1. create `requests/inbox/<request-id>.yaml`
2. generate or write `requests/planned/<request-id>.yaml`
3. approve execution
4. modify child repositories
5. record validation in `evidence/requests/<request-id>/`
6. close with `requests/done/<request-id>.yaml`

## Normalization

The following files normalize this completed work back into the control-plane:

- `requests/inbox/CR-SST-0018-auth-session-recovery.yaml`
- `requests/planned/CR-SST-0018-auth-session-recovery.yaml`
- `requests/done/CR-SST-0018-auth-session-recovery.yaml`
- `evidence/requests/CR-SST-0018/implementation-summary.md`
- `evidence/requests/CR-SST-0018/validation-results.md`
- `state/bugfixes/auth-session-stale-recovery.current.yaml`

This normalization does not imply that future agents may bypass the request
lifecycle. It exists to preserve traceability for work already completed.
