# CR-SST-0207 - Resultados de validación

Fecha: 2026-08-22.

## Resultado

La canonicalización local, los lifecycles portados y el gate de identidad son
estructuralmente válidos. No se realizó ninguna escritura Jira, mutación de
repositorios funcionales ni retiro de worktrees.

El resultado corresponde al árbol local actual. `origin/main` avanzó tres
commits durante la ejecución; por tanto la publicación permanece bloqueada
hasta integrar esa base y repetir el gate sobre el merge result.

## Checks

- `npm.cmd run check:request-ids:self-test`: PASS,
  `6 OK / 0 WARN / 0 FAIL`.
- `npm.cmd run check:request-ids`: PASS,
  `622 lifecycle files / 1 WARN / 0 FAIL`.
- `npm.cmd run check:worktree-policy`: PASS, `1 OK / 0 WARN / 0 FAIL`.
- `node scripts/verify-initiatives.js`: PASS, `18 OK / 0 WARN / 0 FAIL`.
- scan focalizado de whitespace: PASS.
- `git diff --check`: PASS.
- `npm.cmd run check`: PASS.

El gate completo reportó:

- catálogo: `5 OK / 0 WARN / 0 FAIL`;
- bindings: warning no bloqueante porque el binding local ignorado no se copia
  a worktrees limpios;
- state model: `56 OK / 0 WARN / 0 FAIL`;
- initiatives: `18 OK / 0 WARN / 0 FAIL`;
- request identities: `622` archivos, una excepción histórica congelada y cero fallas;
- worktree lifecycle policy: registrada, discoverable y conectada al full gate;
- owner documentation: `120 OK / 0 WARN / 0 FAIL`;
- visual documentation: nueve mapas, cero fallas.

El warning de bindings es esperado: `environments/local/bindings.local.yaml` es
ignorado y no se copia al worktree limpio.

## Gate de identidad

`scripts/verify-request-identities.js` quedó ejecutado al inicio de `npm run
check`. Rechaza ID/formato de filename divergente, múltiples slugs, duplicados
en una misma fase, referencias cruzadas y coexistencia running/terminal.

La regresión `CR-SST-0199` fue corregida en el árbol vivo. El scan descubrió
además `CR-SST-0016`: se mantiene como excepción histórica congelada por cuatro
rutas exactas. Cualquier archivo adicional bajo ese ID convierte el warning en
falla.

## Estado

- `CR-SST-0207`: running, normalización local completa.
- canonicalización: aplicada en el worktree limpio.
- publicación: bloqueada por deriva `behind 3`, sin rebase destructivo.
- Jira: read-only; sin autorización de escritura.
- repos funcionales: no modificados.
- prerequisito de identidad/scope de memoria: `CR-SST-0210` propuesto, todavía
  no publicado porque `INIT-SST-0010` sigue en un worktree en cuarentena.
