# Reconciliacion de QA publico ngrok - 2026-08-21

## Resultado

El dominio ngrok reservado y protegido por GitHub OAuth alcanzo el Ingress de development desde desktop y mobile. La evidencia se obtuvo mediante access logs y telemetria agregada, sin leer cuerpos de mensajes, tokens, cookies, passwords, verifiers ni identificadores de sesion.

`CR-SST-0199` y `CR-SST-0201` cumplen sus gates y pueden cerrar. `CR-SST-0200` y el coordinador `CR-SST-0178` permanecen `running` por un fallo acotado del teardown publico de logout que el owner team ya esta atacando.

## Señales aprobadas

- Login publico: cinco respuestas `200`; Auth confirmo `credential:raw-v2` y `verifier:v2-scrypt:success`.
- Refresh publico: cuatro respuestas `200`.
- Conversaciones: dos creaciones `201`.
- Historial: tres respuestas `200`, desde el JSON vacio inicial de 27 bytes hasta una representacion de 2354 bytes con historial persistido.
- Historial sin cambios: siete respuestas `304` con cuerpo de cero bytes. Esto es semantica HTTP esperada: el browser reutiliza la representacion cacheada; no indica perdida de historial.
- Realtime publico: 27 GET y 9 POST de Engine.IO/Socket.IO con status `200`, por el mismo origen HTTPS.
- El usuario confirmo que el chat queda online, acepta mensajes y responde.

## Gate pendiente

El logout publico produjo respuestas `401`; en una secuencia observada fue seguido inmediatamente por una carga autenticada tambien rechazada. Aunque la limpieza local tolera que la revocacion remota falle, el criterio integral exige cero requests autenticadas posteriores al inicio del logout.

No se atribuye causa ni se muta `sst-fend` en este corte porque el usuario indico que los errores ya estan siendo atacados. El siguiente gate es repetir por ngrok: logout unico, limpieza local y cero cargas autenticadas posteriores.

## Lifecycle

- `CR-SST-0199`: cerrado como edge realtime validado en vivo.
- `CR-SST-0201`: cerrado como adopcion raw-v2 validada en vivo.
- `CR-SST-0200`: permanece running por teardown publico.
- `CR-SST-0178`: permanece running y coordina el ultimo retest.
- `CR-SST-0159`: permanece running por password recovery, fuera de este alcance.

Se consolidaron dos representaciones concurrentes de `CR-SST-0199` en un unico lifecycle canonico. No hubo escrituras Jira, cambios manuales al cluster, bypass OAuth ni persistencia de secretos.
