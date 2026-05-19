# CR-SST-0002 - Blocked Items

Observed at: 2026-05-18

## Operational Blockers

| Blocker | Status | Detail | Required Action |
|---|---|---|---|
| Missing local bindings | accepted warning | `environments/local/bindings.local.yaml` does not exist. | Create ignored local bindings before future execution that depends on host paths. |
| Infra overlay render | blocked | `kubectl kustomize k8s-manifests/overlays/development` failed with access denied while resolving the overlay path. | Fix local filesystem/access issue and rerun. |
| Kubernetes dry-run | blocked | `kubectl apply --dry-run=client -k ...` failed because kube config access was denied. | Fix kubeconfig access or provide a clean local kube context. |
| Live SST API QA | skipped | Requires SST API running on port 3005. | Run only in an approved local/staging environment. |
| Protected dictionary QA | skipped | Requires JWT/account context and mutates local DB via API. | Run only with owner JWT and disposable database or explicit approval. |

## Product/Architecture Items Not Closed

| Item | Status | Reason |
|---|---|---|
| translations | deferred | Domain artifact exists, but public endpoint/adoption is not fully established. |
| aliases | deferred | Documented with translations; runtime adoption is not established. |
| extension account context | gap | Extension does not have local account-context selection/persistence wired. |
| final encryption-at-rest | deferred | Secure masking/reveal exists, but encryption-at-rest is explicitly outside current stage. |
| offline/server isolation model | deferred | Concept exists in intake, not implemented as runtime. |
| `article-tags` handoff | deferred | Adjacent capability exists in `sst-bend`; it is not the completion target for CR-SST-0002. |

## Decision

These blockers do not invalidate the dictionary implementation evidence. They prevent closing the request as fully done.
