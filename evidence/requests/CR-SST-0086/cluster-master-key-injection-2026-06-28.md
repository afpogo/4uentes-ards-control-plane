# Inyeccion Cluster De Master Key

## Contexto

- Request: `CR-SST-0086`
- Jira: `SST-26`
- Capability: `dictionary-secret-management-v1`
- Fecha local: `2026-06-28`
- Cluster observado: `kind-sst-cluster-dev`
- Namespace: `4uentes-sst`

## Decision

Se eligio el modelo de cluster como fuente runtime para `sst-bend`:

- Git no almacena valores secretos.
- `sst-bend` consume `SST_DICTIONARY_SECRETS_MASTER_KEY` desde Kubernetes
  Secret.
- `SST_DICTIONARY_SECRETS_KEY_REF` queda como configuracion no sensible con
  valor `env:SST_DICTIONARY_SECRETS_MASTER_KEY`.
- GitHub Secret se mantiene como fuente CI/CD opcional, pero no basta por si
  solo para runtime si el workflow no crea/actualiza el Secret Kubernetes.

## Cambios Declarativos En Infra

Repo: `sst-4uentes-infra`

- `k8s-manifests/base/sst-bend/configmap.yml`: agrega
  `SST_DICTIONARY_SECRETS_KEY_REF`.
- `k8s-manifests/base/sst-bend/deployment.yml`: agrega
  `SST_DICTIONARY_SECRETS_MASTER_KEY` via `secretKeyRef`.
- `k8s-manifests/base/sst-bend/dictionary-secrets-secret.example.yml`: ejemplo
  sin valores reales, no incluido en Kustomize.
- `specs/infra/security/secrets-provider.yaml`: inventaria el nuevo Secret.
- `specs/states/provision-development-secrets.yaml`: agrega el Secret al estado
  de provisioning manual.
- `specs/infra/deployment-contracts/sst-bend.yaml`: agrega contrato runtime del
  Secret y de `KEY_REF`.

## Inyeccion Runtime

Se creo/actualizo `sst-bend-dictionary-secrets-secret` en `4uentes-sst` y se
reinicio `Deployment/sst-bend`.

Validacion final segura:

- `kubectl get secret sst-bend-dictionary-secrets-secret`: PRESENTE, type
  `Opaque`, `DATA=1`.
- `hasLastApplied=false`: el Secret fue recreado sin anotacion
  `kubectl.kubernetes.io/last-applied-configuration`.
- Pod `deploy/sst-bend`:
  - `SST_DICTIONARY_SECRETS_MASTER_KEY=set`
  - `SST_DICTIONARY_SECRETS_KEY_REF=env:SST_DICTIONARY_SECRETS_MASTER_KEY`
- GitHub Secret `SST_DICTIONARY_SECRETS_MASTER_KEY`: actualizado en
  `2026-06-29T02:25:14Z`.
- `.env` local de `sst-bend`: actualizado con nueva master key, sin registrar
  valor.

## Incidente Y Mitigacion

Durante una verificacion inicial, un error de `kubectl jsonpath` imprimio el
objeto de depuracion del Secret e incluyo `.data` en base64. Eso se trata como
exposicion de la master key.

Mitigacion aplicada:

- Rotacion inmediata de la master key.
- Actualizacion de `.env` local.
- Actualizacion de GitHub Secret.
- Re-creacion del Kubernetes Secret con `kubectl create` directo, no
  `kubectl apply`, para evitar guardar `last-applied-configuration` con data.
- Reinicio de `Deployment/sst-bend`.
- Verificacion posterior sin imprimir `.data`.

## Smoke Cluster

Endpoint: `http://localhost:8088/api/diccionario/secrets/*`

Resultado con usuario y secreto dummy efimeros:

- register/login: PASS.
- create: PASS.
- list metadata-only: PASS.
- detail metadata-only: PASS.
- reveal: PASS.
- copy: PASS.
- rotate: PASS.
- revoke: PASS.
- Plaintext/JWT/master key impresos: NO.

## Gaps

- Si queremos que GitHub Actions reprovisione el Secret Kubernetes
  automaticamente, falta un cambio de politica/infra: el workflow necesita
  credenciales de cluster seguras y un job explicito de provisioning. Hoy la
  politica aprobada en infra sigue siendo `manual-local-k8s-secrets`.
- Si existian secretos protegidos cifrados con la key expuesta antes de esta
  rotacion, pueden quedar ilegibles. Para development se acepto la rotacion
  inmediata como mitigacion de seguridad.
