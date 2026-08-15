# CR-SST-0180 — Evidencia de implementación local

Fecha: 2026-08-15

## Resultado

La implementación quedó aislada en seis worktrees nuevos. Los checkouts
canónicos sucios no se reutilizaron ni modificaron. No hubo datos productivos ni
escrituras Jira.

- Auth integra la reserva pre-KDF, reconciliación de reservas, `Retry-After`
  estable, una familia activa por cuenta, `sid` estable, refresh CAS, logout
  terminal, migración legacy de una sola vez, contratos M2M/chat y telemetría
  agregada periódica.
- Frontend aplica 15 s a todas las llamadas al BFF, localiza el timeout y
  comparte una sola operación de refresh por runtime.
- Extensión cancela requests con `AbortController`, conserva una sola operación
  de refresh y no amplía permisos ni agrega superficies visuales.
- El harness SST cancela smokes HTTP/JWT/chat y reporta método y URL de la etapa.
- Infra configura sólo `node-auth`: base local `enforce/0/60000` y primer rollout
  development `observe/1/60000`, con thresholds 5/20/15m/15m.

## Validación ejecutada

- `4uentes-auth`: `npm run check` — PASS. Incluye build, guard/KDF, 21 logins
  válidos desde IP compartida, telemetría secret-safe, matriz de familia y
  contratos de chat.
- `sst-fend`: `npm run check` — PASS, 33 suites y 214 tests; quedan 22 warnings
  ESLint preexistentes sin errores.
- `sst-extension`: `pnpm run check` — PASS, 22 archivos de test, 94 tests y
  build Chrome MV3.
- `sst-bend`: `npm run build` y `npm run check` — PASS. El check explicita que
  la cobertura protegida se omitió por no suministrar `SMOKE_JWT`; el timeout
  sintético sí pasó.
- `sst-4uentes-infra`: `npm run check` y render Kustomize — PASS; dry-run client
  correcto y sin variables del guard en `sst-bend-config`.
- `git -c core.whitespace=cr-at-eol diff --check` — PASS en worktrees Windows.

## Gates todavía abiertos

No se declara cierre ni rollout exitoso mientras falten:

- publicación y revisión de las ramas;
- imagen Auth inmutable `develop-<sha>` y actualización GitOps del overlay;
- smoke integrado con Mongo sintético y JWT protegido;
- sesión de navegador nueva `chrome-devtools-cr-sst-0180`;
- dos ventanas consecutivas de 15 minutos en `observe` con los criterios de
  bloqueo, storage, tasa de éxito, p95 y privacidad satisfechos.

El request permanece en `running`. No se promueve a `enforce` ni se crea
evidencia de cierre antes de completar esos puntos.

## Bloqueo de publicación

El 2026-08-15 se verificó `gh 2.64.0`, pero `gh auth status` informó que el token
activo de `afpogo` en el keyring es inválido. No se hicieron commits, pushes,
PRs ni merges. Para reanudar, el operador debe ejecutar
`gh auth login -h github.com`; luego se repetirá el control de scope antes de
publicar.
