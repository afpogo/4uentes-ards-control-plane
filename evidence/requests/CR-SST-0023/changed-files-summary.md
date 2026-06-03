# CR-SST-0023 Changed Files Summary

Date: 2026-06-02

Control-plane:

- `requests/inbox/CR-SST-0023-local-infra-auth-scraper-errors.yaml`
- `requests/planned/CR-SST-0023-local-infra-auth-scraper-errors.yaml`
- `evidence/requests/CR-SST-0023/subagent-deployment-evidence.md`
- `evidence/requests/CR-SST-0023/browser-network-console-summary.md`
- `evidence/requests/CR-SST-0023/runtime-service-state.md`
- `evidence/requests/CR-SST-0023/root-cause-summary.md`
- `evidence/requests/CR-SST-0023/changed-files-summary.md`

Functional and infra repos:

- `C:/Users/andre/Desktop/4uentes/apps/sst-fend/src/store/instances/constants.ts`
  - The legacy axios factory now honors `useToken` and attaches the in-memory access token as `Authorization: Bearer <token>`.
- `C:/Users/andre/Desktop/4uentes/apps/4uentes-infra/sst-4uentes-infra/k8s-manifests/base/sst-bend/configmap.yml`
  - Adds explicit Kubernetes JWT verifier config for `sst-bend`.
- `C:/Users/andre/Desktop/4uentes/apps/4uentes-infra/sst-4uentes-infra/k8s-manifests/overlays/development/sst-bend/env.patch.yml`
  - Adds explicit development JWT verifier config for `sst-bend`.
- `C:/Users/andre/Desktop/4uentes/apps/4uentes-infra/sst-4uentes-infra/k8s-manifests/base/sst-bend/scrapper.yml`
  - Adds `Deployment/scrapper` and `Service/scrapper`.
- `C:/Users/andre/Desktop/4uentes/apps/4uentes-infra/sst-4uentes-infra/k8s-manifests/base/kustomization.yml`
  - Includes the new `sst-bend/scrapper.yml` resource.

Dirty working tree note:

- The control-plane, frontend, and infra repos already had many unrelated modified or untracked files before this investigation. Those changes were not reverted.
