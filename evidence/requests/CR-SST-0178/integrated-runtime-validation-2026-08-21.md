# Validacion integrada de runtime - 2026-08-21

## Resultado

La adopcion de chat visible y `raw-v2` esta implementada, fusionada y desplegada en development. Argo CD reconcilio exclusivamente desde Git y quedo `Synced/Healthy`. El flujo localhost completo aprobo. El cierre permanece abierto porque falta ejecutar el mismo flujo por el dominio ngrok reservado con una sesion GitHub OAuth legitima.

No se realizaron escrituras Jira, cambios manuales al cluster, bypass de OAuth ni uso de perfiles personales del navegador. Todas las identidades fueron sinteticas. No se conservaron valores de passwords, CSRF, JWT, cookies, verifiers, hashes ni secretos.

## Publicacion owner

- Bend CORS/realtime: PR #18, merge `4674a41142`; Infra Ingress: PR #9, merge `50c9367`.
- Fend chat/sesion: PR #15, merge `95ba7aa`; Fend raw-v2: PR #16, merge `44e1c2a`.
- Infra flags iniciales: PR #10, merge `fbddcec`; revision de observacion: PR #11, merge `b31fbf6`; URL del facade Auth: PR #12, merge `051afeb50f01`; promocion de migracion: PR #13, merge `1c899ee295b5`.
- Correccion Bend de carrera de membresia: PR #19, merge `7e0eb988a2bc`; imagen live `develop-7e0eb988a2bc`.
- Correccion Auth de indices de sesion: PR #10, merge `ca5365ad1e70`; imagen live `develop-ca5365ad1e70`; pin Infra `0f25dcc3d7d9`.

## Hallazgos corregidos durante QA

1. La primera conexion Socket.IO y la primera carga HTTP podian crear en paralelo la membresia default. Bend ahora serializa esa provision dentro de la transaccion con un advisory lock y tiene regresion concurrente.
2. El facade de Auth no tenia `SST_CHAT_BASE_URL` y caia en una URL obsoleta. Infra ahora declara el service DNS y path internos correctos.
3. El preflight de migracion detecto un indice legacy `refresh_tokens.userId_1` incompatible con sesiones validas posteriores. Se activo la excepcion contractual de Auth: el startup reconcilia solamente las formas legacy exactas y crea los indices canonicos, preservando indices no relacionados. No se inspeccionaron documentos ni hashes.

## Gates owner y GitOps

- Bend: `npm run check`, build, seguridad realtime y regresion concurrente PASS. El smoke protegido parcial sin `SMOKE_JWT` se conserva como warning conocido; el E2E autenticado se valido por separado.
- Fend: `npm run check`, navegacion, registro, logout, transporte, no-downgrade y build PASS.
- Auth: `npm run check`, password adoption, migracion CAS, familias de sesion e index reconciliation PASS.
- Infra: `npm run check`, Kustomize render y `kubectl apply --dry-run=client` PASS en cada corte.
- GitOps: workload con imagenes inmutables; Argo CD `Synced/Healthy`; sin `kubectl apply` ni edicion directa.

## QA localhost

- Engine.IO HTTP: `200`, `text/plain`, payload de apertura de protocolo y no HTML.
- Upgrade WebSocket: `101`.
- Browser E2E agregado: una request de login `raw-v2`; hard reload y refresh; chat `online`; conversacion creada; mensaje aceptado con deltas y `completed`; historial recuperado tras recarga; una sola request logout; cero requests autenticadas posteriores al logout.
- Resultado reproducible: `login_requests=1`, `socket_requests=15`, `logout_requests=1`, `authenticated_requests_after_logout=0`, `chat_online=true`, `chat_completed=true`, `history_recovered_after_reload=true`.
- Evidencia visual sanitizada: `localhost-authenticated-dashboard.png` y `localhost-chat-completed.png`.

## Observacion y migracion raw-v2

Se ejecutaron dos ventanas sinteticas consecutivas de 15 minutos. Ambas conservaron readiness y cero restarts, `5xx`, saturacion KDF o fallos de protocolo. Los status observados fueron `[200,200,200,200]` y `[200,200,200]`.

Tras promover `PASSWORD_MIGRATE_ON_LOGIN_ENABLED=true`, la matriz final aprobo: registro legacy `200`, login de migracion raw-v2 `200`, login raw-v2 posterior `200`, rollback de cliente legacy `200` y material legacy presentado como raw-v2 sin downgrade `401`.

## Superficie publica y gate restante

El Ingress publico mantiene `/` hacia Fend, `/api` hacia Auth y agrega exclusivamente `/4uentes/realtime/socket.io` hacia Bend. No publica `/4uentes/v1`, otros endpoints Bend ni Chatbot.

Sin OAuth, el dominio ngrok reservado responde con redirect `302` al proveedor configurado. El flujo autenticado no se ejecuto: el navegador aislado in-app no estuvo disponible y usar un perfil personal, reutilizar cookies o eludir OAuth quedo fuera de los limites autorizados.

Por la regla de cierre, `CR-SST-0178`, `CR-SST-0199`, `CR-SST-0200` y `CR-SST-0201` permanecen `running` hasta validar por ngrok: login raw-v2, refresh, Socket.IO por mismo origen HTTPS, flujo de chat y logout. `CR-SST-0159` permanece `running` por el gap independiente de password recovery.

## Harnesses reproducibles

- `scripts/qa-cr-sst-0178-browser.js`
- `scripts/observe-cr-sst-0201-raw-v2.js`
- `scripts/qa-cr-sst-0201-migration.js`

Los harnesses emiten solamente estados y contadores agregados; los valores sensibles existen solo en memoria durante la ejecucion.

## Continuacion publica

El gate ngrok fue ejecutado posteriormente. Sus resultados y el unico follow-up pendiente se registran en `public-ngrok-reconciliation-2026-08-21.md`.
