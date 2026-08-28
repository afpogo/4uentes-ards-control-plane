# CR-SST-0228: evidencia de ejecución del Lote A

Fecha: 2026-08-28  
Estado del request: `running`  
Resultado del lote: `completed-awaiting-lot-b`

## Resultado

El Lote A quedó publicado, ejecutado y leído de forma remota. `age` 1.3.1 fue
instalado mediante Winget y el owner `sst-4uentes-infra` incorporó un playbook
key-free con validación sintética. CR-SST-0228 no se cierra: la migración real
continúa bloqueada por un Lote B separado.

## Publicación previa a ejecución

- Control plane PR: `#169`.
- Head: `276f1d198db0683690eb32e9c05f0541638245fc`.
- Merge en `main`: `7e059abdc329c9b83b82042a17716600ea449e68`.
- Readback: `requests/running/CR-SST-0228-migrate-shared-development-secret-storage.yaml`
  leído desde `origin/main` antes de instalar software o crear el worktree.

## Tooling y aislamiento

- Winget package: `FiloSottile.age 1.3.1`.
- `age --version`: `v1.3.1`.
- `age-keygen --version`: `v1.3.1`.
- Verificar la instalación no generó claves.
- Worktree owner:
  `worktrees/CR-SST-0228-infra-preparation`.
- Base owner: `develop@5a2193515020831fc813c7ccd7141608fe453d02`.
- El checkout físico sucio de `sst-4uentes-infra` se preservó sin cambios.

## Validación owner

```text
OK: CR-SST-0228 Lot A playbook is key-free, synthetic-only and live-locked
LOCK-PASS=Preflight
LOCK-PASS=Backup
LOCK-PASS=Migrate
LOCK-PASS=Rollback
[CR-SST-0228] PASS: age v1.3.1 synthetic round-trip passed; values and recipient suppressed.
[CR-SST-0228] PASS: ephemeral identity and synthetic runtime directory removed.
[CR-SST-0228] PASS: no Kubernetes context, Secret, datastore or shared workload was accessed.
TEMP-DIRS-BEFORE=0
TEMP-DIRS-AFTER=0
npm run check: exit 0
```

La primera corrida sintética falló de forma segura porque Windows PowerShell
elevó un warning nativo de `age-keygen`; `finally` eliminó el temporal. El
owner corrigió la captura de stderr conservando la validación del exit code y
la segunda corrida pasó.

## Publicación owner

- Repositorio: `afpogo/sst-4uentes-infra`.
- PR: `#20`.
- Head: `7329df5bed4a9c531a1a85cba5d391d7ecda04c7`.
- CI `validate-repository`: `success`, run `33141513903`.
- Merge en `develop`: `620c42ce9f1e2b7f2dfc81180a0409ec31d032a6`.
- Readback remoto confirmó `$LotBExecutionEnabled = $false`, el modo
  `ValidateSynthetic` y la evidencia `TEMP-DIRS-AFTER=0`.

## Artefactos owner

- `scripts/run-shared-kind-secret-encryption-migration.ps1`
- `scripts/verify-shared-secret-encryption-playbook.js`
- `docs/runbooks/shared-kind-secret-encryption-migration.md`
- `docs/qa/CR-SST-0228-shared-secret-encryption-lot-a-2026-08-28.md`
- `specs/infra/security/kubernetes-secret-storage-encryption.yaml`
- `specs/states/kubernetes-secret-storage-encryption.yaml`

## Readback de exclusiones

| Operación excluida | Resultado |
| --- | --- |
| Leer Kubernetes Secrets | `0` |
| Leer PostgreSQL, MongoDB o etcd compartidos | `0` |
| Crear backups reales | `0` |
| Generar claves persistentes | `0` |
| Mutar o reiniciar el clúster compartido | `0` |
| Escribir en Jira | `0` |

El gate completo del owner ejecutó sus renders y dry-run client existentes; no
aplicó manifests ni leyó valores de Secret.

## Próximo gate

Antes de habilitar `Preflight`, `Backup`, `Migrate` o `Rollback` se requiere
publicar y releer una autorización Lote B que defina custodio, destinos de
backup cifrado, restore drill, ventana, criterio de abortar y permisos exactos
para lecturas y mutaciones reales. Ningún punto de esa autorización se infiere
del éxito del Lote A.
