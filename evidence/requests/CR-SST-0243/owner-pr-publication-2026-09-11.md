# Publicación owner de CR-SST-0243

Fecha: 2026-09-11. Repositorio owner: `4uentes-auth`.

La implementación se realizó en un worktree limpio basado en
`origin/develop@d9263d1801963047eb01a1956b2a5ee54244a12f`, sin reutilizar el
checkout primario sucio. El commit publicado es
`682eff6298154e84fde22010bbb41c8a645be323` en la rama
`agent/cr-sst-0243-onboarding-relay`.

El lote implementa el relay autenticado y sin estado para GET/PATCH
`/api/onboarding/me` y POST `/api/onboarding/me/outcomes`, con allowlist de
headers, idempotencia de mutaciones, sanitización exacta, timeout y rechazo de
redirect. También preserva el UUID opcional `onboardingAttemptId` en el create
real de artículos y en el hash idempotente local, sin persistir ni inferir
estado de onboarding en Auth.

Se publicaron specs, capabilities inbound/outbound, feature index y
documentación owner. Dos auditorías independientes revisaron contrato técnico y
límites de arquitectura; después de corregir drift documental acotado, ambas
dieron PASS.

Validación ejecutada dos veces sobre el estado final relevante:

- `git diff --check`: PASS.
- `npm.cmd run check`: PASS.
- `ARDS CHECK`, build TypeScript y suites históricas: PASS.
- harness de onboarding: PASS para auth, paths, headers, body stripping,
  idempotencia, matriz de errores, no-store, timeout/redirect/red, concurrencia
  y metadata de intento.
- harness de learning relay: PASS.

El PR owner abierto es `afpogo/4uentes-auth#17`, base `develop`, head
`682eff6298154e84fde22010bbb41c8a645be323`, no draft, `OPEN`, `MERGEABLE` y
`CLEAN`. El check remoto `build-publish-update` terminó `SUCCESS` a las
`2026-09-11T19:24:10Z`. El workflow de pull request construye la imagen con
`push=false`; login GHCR y actualización de Infra están condicionados
exclusivamente al evento `push` sobre `develop`.

Este gate no fusiona el PR, no publica imagen, no modifica Infra/GitOps, no
ejecuta runtime, migración, flags ni datos reales y no modifica Bend o Fend. El
próximo gate requiere una autorización independiente de integración.

Nota de dependencias: `npm ci` reportó vulnerabilidades del árbol existente
(4 low, 3 moderate, 11 high y 2 critical). No se ejecutó `npm audit fix` porque
sería una mutación de dependencias fuera de alcance; queda como deuda explícita
y no invalida la suite funcional de este lote.
