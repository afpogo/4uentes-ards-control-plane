# Payloads aprobados para JIRA-SEC-PREPROD-01

## SST-89 — descripción

Mirror operativo de `INIT-SST-0008`.

### Objetivo

Reducir exposición de credenciales y secretos, endurecer las superficies cliente y servidor, establecer ciclos recuperables de sesión y claves, y preparar gates verificables de seguridad antes de producción.

### Prioridad y activación

Esta Epic permanece en prioridad `Low` durante development. Debe revisarse y elevarse al comenzar el readiness de preproducción, antes de aceptar tráfico productivo. No autoriza posponer controles críticos hasta después del lanzamiento.

### Líneas de trabajo

- password lifecycle, `raw-v2`, scrypt, migración y antiabuso;
- prevención XSS, CSP estricta, sanitización y Trusted Types;
- observabilidad segura y redacción de credenciales;
- hardening del runtime de Auth, mínimo privilegio, secretos, rotación y respuesta a incidentes;
- auditoría de permisos de extensiones y estudio de WebAuthn/passkeys;
- cripto-agilidad y perfil PQC como track separado;
- gates integrados de seguridad previos a producción.

### Estado observado en development

`CR-SST-0201` desplegó y validó `raw-v2` en development, incluyendo scrypt server-side, migración oportunista, no-downgrade, rollback legacy y dos ventanas sintéticas de observación. Sigue pendiente el QA autenticado mediante el dominio ngrok reservado y protegido por GitHub OAuth. No existe autorización de producción.

### Boundaries

`raw-v2`, scrypt y TLS convencional no significan que SST sea post-cuántico. Password recovery continúa como gap independiente de `CR-SST-0159`. Jira es un mirror operativo; `initiatives/INIT-SST-0008-cryptographic-security-and-secret-lifecycle-hardening.yaml` y los requests locales conservan la autoridad. No almacenar passwords, hashes, verificadores, tokens, cookies, claves ni secretos en Jira.

Proceso de sincronización: `CR-SST-0203`.

## SST-89 — comentario

Reconciliación gobernada de `CR-SST-0203` / `JIRA-SEC-PREPROD-01`.

La Epic queda en prioridad `Low` durante development, con revisión obligatoria al iniciar preproducción y antes de tráfico productivo. Se incorporó el hardening por capas: XSS/CSP, redacción segura, runtime Auth, permisos de extensiones, passkeys, password lifecycle y cripto-agilidad/PQC como track independiente.

Estado actual: `raw-v2` está desplegado y validado en localhost development; el gate autenticado del dominio ngrok reservado permanece pendiente. No se autoriza producción ni se afirma quantum safety. No se modificó el estado de la Epic ni se crearon issues.

Jira sigue siendo mirror; ARDS/SDD local es source of truth. El comentario no contiene secretos ni valores de sesión.

## SST-92 — descripción

Mirror operativo de `CR-SST-0159` bajo `INIT-SST-0008`.

### Objetivo

Gobernar la modernización completa del password lifecycle: protocolo versionado, política, KDF server-side, migración/rehash, compatibilidad y rollback, antiabuso y recuperación de password sin invalidar credenciales existentes.

### Slice entregado en development

`CR-SST-0201` implementó la adopción web gradual de `raw-v2`: password de 15–128 caracteres, scrypt server-side, aceptación versionada fail-closed, una sola request sin downgrade, migración oportunista y rollback legacy. Los owner checks, dos ventanas sintéticas de 15 minutos y el QA localhost pasaron sin conservar credenciales ni verificadores.

### Gaps que mantienen abierto CR-SST-0159

- password recovery sigue siendo independiente y no está cerrado por `raw-v2`;
- permanece pendiente el QA autenticado por el dominio ngrok reservado;
- cualquier producción requiere capacity benchmark, controles de abuso, redacción de observabilidad y gates de seguridad preproducción;
- `raw-v2`, scrypt y TLS convencional no constituyen PQC.

Source of truth: lifecycle local de `CR-SST-0159` y `CR-SST-0201`. Jira es un mirror operativo. No almacenar passwords, hashes, verificadores, tokens, cookies, claves ni secretos en Jira.

Proceso de sincronización: `CR-SST-0203`.

## SST-92 — comentario

Actualización de seguimiento mediante `CR-SST-0203`.

El slice `raw-v2` de `CR-SST-0201` está fusionado, desplegado y validado en localhost development con scrypt server-side, no-downgrade, migración y rollback. Esto no cierra `CR-SST-0159`: password recovery y los gates preproducción continúan abiertos; también falta el QA autenticado del dominio ngrok reservado.

No se cambia el estado ni la prioridad de `SST-92`. Jira permanece como mirror y no contiene valores sensibles.

## SST-95 — descripción

Mirror operativo de `CR-SST-0162` bajo `INIT-SST-0008`.

### Objetivo

Definir un inventario criptográfico, horizonte de transición, baseline clásico, perfil objetivo post-cuántico o híbrido, interoperabilidad, rotación, observabilidad y rollback antes de modificar JWT, JWKS, TLS u otros contratos criptográficos.

### Separación respecto de passwords

`raw-v2` es una versión del protocolo de credenciales; scrypt es una KDF de password y TLS protege el transporte con la suite negociada. Ninguno demuestra por sí solo resistencia post-cuántica. La adopción `raw-v2` en development es evidencia de modernización del password pipeline, no aceptación de este perfil PQC.

### Gate

No afirmar que SST es quantum-safe hasta definir y validar algoritmos, soporte de clientes/proxies, certificados, inventario, rotación, métricas, interoperabilidad y rollback en un lifecycle aprobado.

Source of truth: lifecycle local de `CR-SST-0162`. Jira es un mirror operativo. No almacenar secretos, claves, tokens o material criptográfico en Jira.

Proceso de sincronización: `CR-SST-0203`.

## SST-95 — comentario

Clarificación de boundary mediante `CR-SST-0203`.

La adopción de `raw-v2`, scrypt server-side y TLS convencional no satisface ni cierra el objetivo PQC de `CR-SST-0162`. `SST-95` conserva un track separado para inventario, perfil híbrido/PQC, interoperabilidad, rotación, observabilidad y rollback.

No se cambia estado, prioridad ni parent. Jira continúa como mirror y no se publica material criptográfico sensible.

## SST-86 — descripción

Mirror operativo de `INIT-SST-0007`.

### Objetivo

Completar la primera versión gobernada del chatbot conectado a SST, con identidad revocable, conversaciones persistidas por `sst-bend`, procesamiento interno por `sst-chatbot`, chat web visible y realtime protegido, sin transferir ownership al Control Plane.

### Coordinación actual

- `CR-SST-0178`: coordinación del cierre integrado en development;
- `CR-SST-0199`: edge realtime protegido y acotado;
- `CR-SST-0200`: acceso visible al chat y teardown de sesión SPA;
- `CR-SST-0201`: adopción `raw-v2` en development como dependencia de autenticación.

### Estado observado

Los cambios owner fueron fusionados y desplegados mediante imágenes inmutables y GitOps. Argo CD quedó `Synced/Healthy`. En localhost pasaron Engine.IO, WebSocket `101`, registro, hard reload, refresh, creación de conversación, mensaje, deltas, completion, recuperación de historial y logout single-flight. El edge público no expone Bend en general ni `sst-chatbot`.

### Gate restante

Falta el QA autenticado por el dominio ngrok reservado y protegido con GitHub OAuth. Hasta que ese gate pase, `CR-SST-0178`, `CR-SST-0199`, `CR-SST-0200` y `CR-SST-0201` permanecen `running`; la Epic no se considera cerrada.

Source of truth: `initiatives/INIT-SST-0007-sst-chatbot-first-connected-version.yaml` y requests locales. Jira es un mirror operativo. No almacenar datos de usuario, passwords, tokens, cookies o secretos en Jira.

Proceso de sincronización: `CR-SST-0203`.

## SST-86 — comentario

Reconciliación de estado mediante `CR-SST-0203`.

La primera versión conectada ya está fusionada, desplegada y validada en localhost development. Pasaron chat visible, realtime, persistencia/recuperación, registro/refresh y logout single-flight. El único gate integrado pendiente es el QA autenticado mediante el dominio ngrok reservado con GitHub OAuth legítimo.

No se cambia el estado ni la prioridad de `SST-86`, y no se crean tickets en este lote. Jira permanece como mirror; el cierre lo determina la evidencia local de `CR-SST-0178` y sus CRs coordinados.

