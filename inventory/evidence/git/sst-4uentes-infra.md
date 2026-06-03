# Git Evidence - sst-4uentes-infra

Observed at: 2026-05-26

## Local Binding

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra
```

## Git

- Remote: `git@github.com:afpogo/sst-4uentes-infra.git`
- Branch: `develop`
- Upstream: `origin/develop`
- HEAD: `2acf47c`
- Working tree: dirty, 68 porcelain entries observed
- Stash: none observed

Observed dirty entries include:

```text
 M .gitignore
 M AGENTS.md
 M README.md
 M docs/00-overview.md
 M docs/ai/policy.md
 M docs/environments/README.md
 M docs/infra/README.md
 M docs/reference-sources.md
 M docs/runbooks/README.md
 D k8s-manifests/base/ingress.yml
 M k8s-manifests/base/kustomization.yml
 D k8s-manifests/base/namespace.yml
 D k8s-manifests/base/node-auth-configmap.yml
 D k8s-manifests/base/node-auth-deployment.yml
 D k8s-manifests/base/node-auth-mongo-init.yml
 D k8s-manifests/base/node-auth-mongo.yml
 D k8s-manifests/base/node-auth-secret.example.yml
 D k8s-manifests/base/sst-bend-configmap.yml
 D k8s-manifests/base/sst-bend-deployment.yml
 D k8s-manifests/base/sst-bend-migrations.yml
```

## ARDS/SDD Artifacts

- `AGENTS.md`: present
- `specs/00-index.yaml`: present
- `docs/00-overview.md`: present
- `docs/ai/policy.md`: present

## Validation

- Check command: `TODO` in catalog.
- Manual validation candidate: `kubectl kustomize k8s-manifests/overlays/development`.
