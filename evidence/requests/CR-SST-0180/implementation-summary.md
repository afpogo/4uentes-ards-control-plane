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

## Publicación

La autenticación de GitHub fue restaurada y el flujo revisado se publicó sin
modificar los checkouts canónicos:

- Auth PR `#6`, merge `78b0eec5b3c7065e1d3f85cdbe7ab853fe847187`.
- Frontend PR `#11`, merge `d4bed266c76cef58d65ae8936cf9d9547a984a09`.
- Extensión PR `#1`, merge `3732673474913caefcbce7d8ae7676053e5d77b7`.
- Backend PR `#13`, merge `57cf7ce67fcfa19327d56800df7a1bbd3ed5955b`.
- Infra PR `#4`, merge `81f90114cee028e11a6030747de32629d0697b29`.
- Imagen Auth inmutable
  `ghcr.io/afpogo/4uentes-auth:develop-78b0eec5b3c7` publicada por el workflow
  exitoso `31909426898`.
- Actualización automática del overlay en el commit GitOps
  `53dea2cdacbbd11adaa92e682255b8f918832bd6`.

El PR del control plane permanece abierto para incorporar esta evidencia y los
resultados de rollout antes de su merge final.

## Rollout development y QA desplegado

Argo sincronizó la revisión GitOps
`c35a40309a303b17557afffb2cbbdf3167d228f0`. `node-auth` quedó con una réplica
ready, cero reinicios, la imagen inmutable esperada y configuración efectiva
`observe/1/60000`.

El smoke sintético desplegado verificó:

- registro `200` y 21 de 21 logins válidos desde la misma IP con `200`;
- JWT RS256 verificado criptográficamente contra JWKS, con `sid`,
  `token_use=access`, `scope=chat:connect`, issuer `sst-auth` y audiences
  `sst-api`/`scrapper-api`;
- refresh concurrente con un ganador exacto (`200/401`) y un refresh posterior
  del ganador en `200`;
- logout `204` y refresh revocado en `401`;
- seis credenciales incorrectas en `401` y recuperación válida en `200` bajo
  `observe`.

La telemetría acumulativa posterior registró `guard:would-block=2`, seis fallos
del verifier, cero `storage-error` y máximo observado de verifier de 208 ms. Los
eventos revisados no contienen email, IP, tokens, cuerpos ni secretos.

La sesión aislada `chrome-devtools-cr-sst-0180` cargó el frontend y abrió el
formulario de login. Comenzó sin cookies, JWT ni material de refresh; las únicas
claves creadas al cargar fueron el idioma y el estado Redux inicial.

## Bloqueo de integración chat

El smoke real alcanzó registro y login, pero Bend devolvió `404` al crear la
conversación. El deployment development no define `CHAT_REALTIME_ENABLED` ni el
wiring M2M/chat; por diseño las rutas no se montan. No se agregó un override de
BFF ni se inventaron secretos porque excedería el alcance aprobado. Este gate
requiere una decisión/request explícita de configuración del runtime de chat.

## Gates todavía abiertos

No se declara cierre ni rollout exitoso mientras falten:

- smoke integrado Socket.IO/BFF/NDJSON/chatbot una vez habilitado el runtime;
- dos ventanas consecutivas de 15 minutos en `observe` con los criterios de
  bloqueo, storage, tasa de éxito, p95 y privacidad satisfechos.

El request permanece en `running`. No se promueve a `enforce` ni se crea
evidencia de cierre antes de completar esos puntos.
