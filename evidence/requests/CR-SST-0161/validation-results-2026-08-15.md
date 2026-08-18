# Validacion local de SST-94

Fecha: 2026-08-15

## sst-bend

| Comando | Resultado |
| --- | --- |
| `npm run qa:diccionario:keyring` | PASS, 8/8; salida sanitizada |
| `npm run test:diccionario:keyring` | PASS |
| `npm run test:diccionario:secrets` | PASS |
| `npm run test:diccionario:stage3` | PASS, 11/11 |
| `npm run build` | PASS |
| `npm run check` | PASS, exit 0 |
| `git diff --check` | PASS |
| parse YAML de specs modificados | PASS |

El ARDS check termino con exit 0. Como en la baseline sin JWT, informo cobertura
HTTP protegida parcial y omitio smokes autenticados. Esos smokes no se
ejecutaron porque el lote aprobado prohibe base de datos y runtime real.

## sst-4uentes-infra

| Comando | Resultado |
| --- | --- |
| `npm run check` | PASS |
| `kubectl kustomize` incluido por el check | PASS |
| `kubectl apply --dry-run=client` incluido por el check | PASS |
| `git diff --check` | PASS |
| parse YAML de specs/manifests modificados | PASS |

`--dry-run=client` no aplico recursos al cluster.

## 4uentes-orchestor

| Comando | Resultado |
| --- | --- |
| `npm.cmd run check` | PASS; 0 FAIL |
| owner documentation validator incluido | PASS para CR-SST-0161 |

El verificador de bindings informo nueve warnings de remotes no observables;
son diagnosticos de entorno y no fallos del gate.

## Cobertura funcional sintetica

- ciphertext con referencia anterior legible despues de seleccionar una nueva
  activa;
- escrituras nuevas con la referencia activa;
- rollback del selector a la referencia anterior sin reescritura;
- referencia no permitida, material ausente, formato invalido y activa fuera de
  allowlist fallan con `503` sanitizado;
- auditoria de fallo registra solamente `decrypt_failed`;
- tampering hacia otra referencia permitida falla por integridad AAD/AES-GCM;
- alias single-key legacy sigue siendo aceptado.

La ejecucion manual detallada y la inspeccion del render se conservan en
`evidence/requests/CR-SST-0161/manual-qa-2026-08-15.md`.

## Exclusiones confirmadas

No se ejecuto el smoke HTTP de Dictionary Secrets, no se abrio una conexion de
base de datos y no se aplicaron manifests.
