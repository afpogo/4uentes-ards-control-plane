# GHCR Pull Secret And Argo CD Unblock

Date: 2026-07-03

## Context

`Application/sst-app` in Argo CD was stuck with:

```text
waiting for completion of hook batch/Job/sst-bend-migrations
```

The hook pod `sst-bend-migrations` was in `ImagePullBackOff` while pulling:

```text
ghcr.io/afpogo/sst-bend:develop-8d36a91832a3
```

The Kubernetes event showed `403 Forbidden` from GHCR during the manifest HEAD
request.

## Findings

- `ghcr-pull-secret` existed in namespace `4uentes-sst`.
- `ServiceAccount/default` already referenced `ghcr-pull-secret`.
- Recreating only the stuck pod before changing credentials reproduced the
  `403 Forbidden`, so the issue was not pod cache.
- Local `gh auth status` did not include `read:packages`.
- `gh api /users/afpogo/packages/container/sst-bend/versions` returned:
  `You need at least read:packages scope`.
- Docker local config had no reusable `ghcr.io` credential.

## Resolution

The operator created a GitHub PAT classic with `read:packages` and pasted it in
a local terminal prompt that did not echo the token. The terminal recreated:

```text
secret/ghcr-pull-secret
```

The ServiceAccount patch command printed a JSON quoting error, but validation
confirmed `ServiceAccount/default` still referenced `ghcr-pull-secret`.

After deleting only the stuck hook pod:

```powershell
kubectl -n 4uentes-sst delete pod -l app=sst-bend-migrations
```

Kubernetes created a new hook pod, pulled the image successfully, and the Job
completed.

## Final Runtime State

Observed final state:

- `Application/sst-app`: `Synced`, `Healthy`, operation `Succeeded`.
- `sst-bend`: `ghcr.io/afpogo/sst-bend:develop-8d36a91832a3`.
- `scrapper`: `ghcr.io/afpogo/sst-bend:develop-8d36a91832a3`.
- `sst-fend`: `ghcr.io/afpogo/sst-fend:develop-164c19cfcb88`.
- `node-auth`: `ghcr.io/afpogo/4uentes-auth:develop-82f84da4a99f`.

## Owner Documentation Updated

Owner repo: `sst-4uentes-infra`.

Updated owner docs:

- `docs/runbooks/ghcr-private-pull-development.md`
- `docs/runbooks/argocd-kind-development.md`

The control-plane records this execution evidence only. Runtime ownership for
GitOps, Argo CD, GHCR image pull, and Kubernetes `imagePullSecret` behavior
remains in `sst-4uentes-infra`.

## Secret Handling

No token, Argo password, Docker config value, Kubernetes Secret payload, or
authorization header was written to evidence.

The operational rule remains:

- use metadata-only checks for Kubernetes Secrets;
- never print `.data.password`, docker config auth payloads, or PAT values;
- store GHCR pull credentials only as runtime Kubernetes Secrets;
- retrieve the Argo admin password locally from `argocd-initial-admin-secret`
  only when an operator needs to log in.
