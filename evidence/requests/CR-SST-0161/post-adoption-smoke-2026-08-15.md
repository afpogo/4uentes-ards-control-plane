# Smoke post-adopcion de SST-94

Fecha: 2026-08-15

## Resultado

PASS. El smoke se ejecuto desde worktrees temporales detached que apuntaban a
los commits exactos adoptados en `develop`.

## Adopcion observada

| Repo | PR | Merge commit |
| --- | --- | --- |
| `sst-bend` | `afpogo/sst-bend#14` | `a91e42c4440b4597986f7888913cc33810e0c127` |
| `sst-4uentes-infra` | `afpogo/sst-4uentes-infra#5` | `6abe408ca897288daf79dd97c6e4bdea92a6645d` |

El pipeline backend publico la imagen
`ghcr.io/afpogo/sst-bend:develop-a91e42c4440b` y actualizo
`infra/develop`. Los cuatro checks de ese update y los cuatro checks posteriores
al merge de infra terminaron en PASS.

## Backend adoptado

| Comando | Resultado |
| --- | --- |
| `npm run qa:diccionario:keyring` | PASS, 8/8 y salida sanitizada |
| `npm run test:diccionario:keyring` | PASS |
| `npm run test:diccionario:secrets` | PASS |
| `npm run build` | PASS |

El harness confirmo lectura V1 con V2 activa, escritura nueva V2, rollback del
selector, fallas cerradas para referencia no permitida o ausente, integridad y
ausencia de campos sensibles en la salida.

## Infraestructura adoptada

`npm run check` completo en el merge commit de infra paso. Incluyo render
kustomize y `kubectl apply --dry-run=client`, sin aplicar recursos.

La inspeccion sanitizada del render confirmo:

- imagen `develop-a91e42c4440b` para `sst-bend`, `scrapper` y migration job;
- activa y allowlist iniciales en
  `env:SST_DICTIONARY_SECRETS_MASTER_KEY`;
- `sst-bend-dictionary-secrets-secret` montado mediante `envFrom.secretRef`.

## CI post-merge

- backend Node.js 18: PASS;
- backend Node.js 20: PASS;
- backend build/publish/update: PASS;
- infra CI Pipeline: PASS;
- infra CD Pipeline: PASS;
- infra Validate SST-Bend GitOps: PASS;
- infra Validate SST-Fend GitOps: PASS.

GitHub informo una advertencia no bloqueante: acciones que declaran Node.js 20
son ejecutadas por el runner sobre Node.js 24 debido a deprecacion. No hubo
fallos de build o test.

## Boundary

No se uso DB, migrations, seeders, JWT, claves reales, rotacion o
re-encryption. No se aplico Kubernetes y no se valido un pod o endpoint HTTP
live. Este smoke prueba la adopcion de source, imagen y contrato declarativo
permitida por CR-SST-0161; no declara rollout de cluster ni produccion.

Los worktrees temporales y la junction temporal de dependencias fueron
retirados al finalizar.
