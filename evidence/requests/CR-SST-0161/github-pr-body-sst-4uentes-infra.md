## Que cambia

- declara la allowlist inicial del keyring de Dictionary Secrets;
- inyecta el Secret dedicado mediante `envFrom.secretRef` para soportar
  variables versionadas;
- mantiene PostgreSQL en referencias de Secret separadas;
- documenta staging, rollback, retencion y remocion en specs y runbook owner.

## Por que

El contrato anterior inyectaba una sola variable y no podia suministrar varias
versiones de clave al backend. El nuevo contrato permite conservar material
historico mientras el `keyRef` persistido lo necesite, sin activar una nueva
clave ni ejecutar rotacion.

## Impacto y limites

- alcance exclusivo de desarrollo para SST-94 / CR-SST-0161;
- la allowlist y la activa siguen apuntando solamente a la referencia actual;
- no contiene material secreto;
- no aplica Kubernetes ni modifica un cluster;
- sin DB, rotacion, re-encryption, produccion, KMS o TLS.

## Validacion

- `npm run check` — PASS;
- `kubectl kustomize k8s-manifests/overlays/development` — PASS;
- `kubectl apply --dry-run=client -k k8s-manifests/overlays/development` — PASS;
- inspeccion manual del render del selector, allowlist y `envFrom.secretRef` —
  PASS;
- `git diff --check` y revision secret-safe — PASS.

La evidencia gobernada vive en
`4uentes-orchestor/evidence/requests/CR-SST-0161/`.
