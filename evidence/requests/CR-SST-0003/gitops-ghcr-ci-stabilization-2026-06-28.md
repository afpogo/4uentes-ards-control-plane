# GitOps/GHCR/CI Stabilization Execution

Date: 2026-06-28

## Scope

Execution followed the user-provided plan for points 2, 3 and 4:

- stabilize development GitOps desired state for `sst-4uentes-infra`;
- document private GHCR pull through `ghcr-pull-secret`;
- harden development image publish workflows in `sst-fend`, `sst-bend` and
  `4uentes-auth`.

## Lifecycle Note

The closest control-plane request is `CR-SST-0003`, currently planned with
`decision.status: pending`. The user explicitly requested implementation from a
previous agent plan, so this execution proceeded as a human-directed slice.

This is an ordering deviation from the preferred flow. No secrets were committed
and no functional runtime code was changed.

## Changes By Repo

### sst-4uentes-infra

- Added `docs/runbooks/argocd-kind-development.md`.
- Added `docs/runbooks/ghcr-private-pull-development.md`.
- Updated `docs/runbooks/README.md`.
- Updated `specs/states/install-argocd.yaml` and `specs/states/00-index.yaml`
  to reflect the observed cluster state: Argo CD is installed and `sst-app` is `Synced/Healthy`.
- Updated `specs/infra/gitops/sst-app.yaml` and
  `specs/infra/gitops/00-index.yaml` to model `develop` as desired state
  tracked by Argo CD from `develop`.
- Updated `specs/infra/ci/workflow-gap-review.yaml` to record the private GHCR
  decision, `ghcr-pull-secret`, `IfNotPresent` fallback and `Always` pull probe.

### sst-fend

- Updated `.github/workflows/build-publish-development.yml`.
- Added explicit `SST_INFRA_WRITE_TOKEN` preflight for push events.
- Kept GHCR tags `develop-<sha12>` and `develop`.
- Kept infra tag update in
  `k8s-manifests/overlays/development/kustomization.yml`.
- Added rebase/push retry loop for infra tag update races.
- Did not touch the pre-existing local change in
  `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`.

### sst-bend

- Updated `.github/workflows/build-publish-development.yml` with the same
  preflight and retry behavior.
- Did not touch pre-existing local dictionary secret management changes.

### 4uentes-auth

- Updated `.github/workflows/build-publish-development.yml` with the same
  preflight and retry behavior.
- Did not touch pre-existing local `tmp-bf-dev.*` log changes.

## Observed Runtime State

- Argo CD UI is available without manual port-forward at http://argocd.localhost:8088.

- Argo CD v3.4.1 was installed with server-side apply after client-side apply hit the CRD annotation limit.
- Runtime repo credential for `sst-4uentes-infra` was created in `argocd` from local GitHub CLI auth without committing the token.
- `kubectl -n argocd get app sst-app` reports `Synced/Healthy`.
- `kubectl -n 4uentes-sst get secret ghcr-pull-secret` succeeded; the secret
  exists as type `kubernetes.io/dockerconfigjson`.

## Validation

- `sst-4uentes-infra`: `npm run check:development` passed.
- `4uentes-orchestor`: `npm.cmd run check` passed with existing remote-observe
  warnings.
- `git diff --check` passed for:
  - `sst-4uentes-infra`;
  - `sst-fend` workflow;
  - `sst-bend` workflow;
  - `4uentes-auth` workflow.

## Remaining Manual Actions

- Investigate why `Application/sst-app` remains `Progressing` after successful sync.
- Recreate `ghcr-pull-secret` with a token that can read the private package and rerun the `imagePullPolicy: Always` probe.
- Configure `SST_INFRA_WRITE_TOKEN` in:
  - `afpogo/sst-fend`;
  - `afpogo/sst-bend`;
  - `afpogo/4uentes-auth`.
- Re-run or trigger development workflows after the secret is configured.
