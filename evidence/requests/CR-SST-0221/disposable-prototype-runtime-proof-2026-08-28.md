# CR-SST-0221: prueba runtime del prototipo descartable

Fecha de cierre: `2026-08-28T00:34:39-03:00`  
Estado: `passed-and-published`  
Owner: `sst-4uentes-infra`

## Publicación de la autorización

- Control-plane PR: `#159`.
- Head: `c25402777b26eb58c9041954c5024094fc8a97d3`.
- Merge en `main`: `4057446c00a67f41d03b9508a86cc3724097b2b4`.
- Readback de la autorización temporal: `passed`.

## Corrida gobernada

El playbook owner elevó temporalmente
`fs.inotify.max_user_instances` de `128` a `1024`, ejecutó el harness contra
`sst-secret-encryption-prototype` y restauró `128` dentro de `finally`.

La sexta corrida, después de cinco iteraciones fallidas y limpiadas, verificó:

- baseline con `identity`;
- migración y reescritura de `3` Secrets con `secretbox v1`;
- rotación y reescritura con `secretbox v2`;
- rollback con la clave retenida `v1`;
- retorno a `v2` sin `identity`;
- lectura API y `/readyz`;
- comparación silenciosa de prefijos en etcd, sin imprimir payloads.

Cada intento fallido restauró `128`, eliminó el clúster y directorio temporal,
restauró el contexto original y confirmó dos nodos compartidos `Ready`.

## Readback final independiente

```text
fs.inotify.max_user_instances=128
kind clusters: sst-cluster-dev
kubectl context: kind-sst-cluster-dev
sst-cluster-dev-control-plane: Ready
sst-cluster-dev-worker: Ready
temporary CR-SST-0221 directories: none
```

## Publicación owner

- Rama: `feat/CR-SST-0221/disposable-secret-encryption-prototype`.
- Head publicado: `c9e0ceec40a5489ee1e6c93bee3963110d762eb9`.
- Pull request: `afpogo/sst-4uentes-infra#19`.
- Merge en `develop`: `5a2193515020831fc813c7ccd7141608fe453d02`.
- Checks remotos: `validate-desired-state`, dos matrices
  `validate-manifests` y `validate-repository`, todos `pass`.
- Readback remoto de la evidencia owner: `passed`.

Artefactos owner:

- `scripts/run-kind-secret-encryption-playbook.ps1`;
- `scripts/test-kind-secret-encryption-prototype.ps1`;
- `docs/runbooks/kind-secret-encryption-host-remediation-playbook.md`;
- `docs/runbooks/kind-secret-encryption-prototype.md`;
- `docs/qa/CR-SST-0221-kind-secret-encryption-run-2026-08-28.md`.

## Límites preservados

- No se mutó el clúster compartido ni sus Secrets.
- No se persistió el sysctl.
- No se detuvieron ni reiniciaron workloads existentes.
- No se expusieron claves, valores de Secret o payloads crudos.
- No se habilita la migración compartida ni una escritura en Jira.
