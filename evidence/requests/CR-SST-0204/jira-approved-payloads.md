# Payloads aprobados para JIRA-SEC-PREPROD-02

## SST-86 — descripción

Mirror operativo de `INIT-SST-0007`.

### Objetivo

Completar la primera versión gobernada del chatbot conectado a SST, con identidad revocable, conversaciones persistidas por `sst-bend`, procesamiento interno por `sst-chatbot`, chat web visible y realtime protegido, sin transferir ownership al Control Plane.

### Estado de los CR coordinados

- `CR-SST-0178`: `running`, coordinador del cierre integrado;
- `CR-SST-0199`: `done/validated-live`, edge realtime protegido por el mismo origen HTTPS;
- `CR-SST-0200`: `running`, correcciones de signup, continuidad de registro y teardown/logout;
- `CR-SST-0201`: `done/validated-live`, adopción `raw-v2`, migración, login y refresh público.

### Validación completada

Pasaron localhost y el origen ngrok reservado con GitHub OAuth para login, refresh, chat visible, creación de conversación, realtime, historial y transporte `raw-v2`. El edge público no expone Bend en general ni `sst-chatbot`.

### Gate restante

El cierre depende de `CR-SST-0200`:

- corregir el copy de signup a 15–128 caracteres;
- restaurar register → hard navigation → refresh → `/chat`;
- corregir el logout público `401` y evitar cargas autenticadas posteriores;
- repetir QA localhost y público del teardown.

Hasta entonces `CR-SST-0178` continúa `running`. Jira es un mirror; la iniciativa y los requests locales conservan autoridad. No almacenar datos de usuario, passwords, tokens, cookies o secretos en Jira.

Proceso de sincronización: `CR-SST-0204`.

## SST-86 — comentario

Corrección canónica mediante `CR-SST-0204` / `JIRA-SEC-PREPROD-02`.

Este comentario reemplaza el estado narrado por `CR-SST-0203`: el QA ngrok autenticado de login, refresh, chat, historial y realtime ya pasó. `CR-SST-0199` y `CR-SST-0201` están `done/validated-live`.

`CR-SST-0178` permanece `running` exclusivamente por los follow-ups de `CR-SST-0200`: copy 15–128, continuidad register → refresh → `/chat` y teardown/logout sin requests autenticadas posteriores.

No se modifica estado, prioridad, labels, parent ni summary. Jira continúa como mirror y este comentario no contiene valores sensibles.

## SST-89 — descripción

Mirror operativo de `INIT-SST-0008`.

### Objetivo

Reducir exposición de credenciales y secretos, endurecer superficies cliente/servidor, establecer ciclos recuperables de sesión y claves, y preparar gates verificables antes de producción.

### Prioridad y activación

Esta Epic permanece en prioridad `Low` durante development. Debe revisarse y elevarse al comenzar el readiness de preproducción, antes de aceptar tráfico productivo. Esto no autoriza posponer controles críticos hasta después del lanzamiento.

### Líneas de trabajo

- password lifecycle, `raw-v2`, scrypt, migración y antiabuso;
- prevención XSS, CSP estricta, sanitización y Trusted Types;
- observabilidad segura y redacción de credenciales;
- hardening del runtime de Auth, mínimo privilegio, rotación y respuesta a incidentes;
- auditoría de permisos de extensiones y estudio de WebAuthn/passkeys;
- cripto-agilidad y perfil PQC como track separado;
- gates integrados de seguridad previos a producción.

### Estado actual

`CR-SST-0201` está `done/validated-live`: `raw-v2`, scrypt server-side, migración/rollback, no-downgrade, login y refresh por el origen HTTPS protegido pasaron sin saturación KDF observada. No existe autorización de producción.

Password recovery continúa como gap independiente de `CR-SST-0159`. `raw-v2`, scrypt y TLS convencional no significan que SST sea post-cuántico. Jira es un mirror; la iniciativa y los requests locales conservan autoridad. No almacenar passwords, hashes, verificadores, tokens, cookies, claves ni secretos en Jira.

Proceso de sincronización: `CR-SST-0204`.

## SST-89 — comentario

Corrección canónica mediante `CR-SST-0204` / `JIRA-SEC-PREPROD-02`.

El comentario de `CR-SST-0203` quedó superado por el read-model de PR #35: `CR-SST-0201` está `done/validated-live` y el login/refresh público por ngrok pasó. La Epic permanece `Low` durante development y debe revisarse antes de producción.

Password recovery sigue abierto bajo `CR-SST-0159`; `raw-v2` no implica PQC. No se modifica estado, prioridad, labels, parent ni summary, y no se publican valores sensibles.

## SST-92 — descripción

Mirror operativo de `CR-SST-0159` bajo `INIT-SST-0008`.

### Objetivo

Gobernar la modernización completa del password lifecycle: protocolo versionado, política, KDF server-side, migración/rehash, compatibilidad y rollback, antiabuso y recuperación de password sin invalidar credenciales existentes.

### Slice completado en development

`CR-SST-0201` está `done/validated-live`. La adopción web de `raw-v2` validó password de 15–128 caracteres, scrypt server-side, versión fail-closed, una sola request sin downgrade, migración/rollback, dos ventanas sintéticas y login/refresh por ngrok sin conservar credenciales o verificadores.

### Gaps que mantienen abierto CR-SST-0159

- password recovery continúa como gap independiente;
- producción requiere capacity benchmark, enforcement antiabuso, redacción de observabilidad y gates preproducción;
- `raw-v2`, scrypt y TLS convencional no constituyen PQC.

Source of truth: lifecycle local de `CR-SST-0159` y `CR-SST-0201`. Jira es un mirror operativo. No almacenar passwords, hashes, verificadores, tokens, cookies, claves ni secretos en Jira.

Proceso de sincronización: `CR-SST-0204`.

## SST-92 — comentario

Corrección canónica mediante `CR-SST-0204` / `JIRA-SEC-PREPROD-02`.

El comentario anterior quedó superado: `CR-SST-0201` está `done/validated-live` y el login/refresh público por ngrok pasó. `CR-SST-0159` permanece abierto por password recovery y los gates preproducción, no por la adopción web de `raw-v2` en development.

No se modifica estado, prioridad, labels, parent ni summary. Jira continúa como mirror y no se publican valores sensibles.
