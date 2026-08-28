# CR-SST-0230: preflight de identidad y owners

Fecha: 2026-08-28

Ref canónica observada: `origin/main@7e059ab`

Resultado: `available-for-local-reservation-validation`

## Identidad global

La búsqueda en el árbol canónico, branches, worktrees y archivos locales no
encontró `CR-SST-0230` antes de crear esta reserva. CR-SST-0228 y CR-SST-0229
ya están publicados para otros trabajos y no se reutilizan.

El preflight Jira read-only no encontró un issue con la identidad exacta
CR-SST-0230. Los resultados SST-114 y SST-113 son contexto compatible del
programa de retención, no duplicados del follow-up. No se realizó ninguna
escritura Jira ni se persistieron identificadores de conexión.

## Gap canónico de CR-SST-0207

El lifecycle canónico de CR-SST-0207 permanece `running` y SST-117 continúa
`En curso`. Después del cierre de CR-SST-0218, las filas terminales y de carrera
están en PASS. El bloqueo localhost restante es cache-aside:

- no existe un contrato de producto para observar hit/miss;
- el harness no puede provocar eviction mediante comandos Redis;
- la autoridad PostgreSQL y el modo fail-open no deben cambiar;
- reserved edge y limpieza histórica son gates independientes.

## Estado owner observado

`sst-bend` se leyó sin mutación desde `origin/develop@9faae46`. Su runtime:

- revalida existencia y ownership durable en PostgreSQL;
- usa Redis sólo para cachear mensajes y eventos guardados;
- incrementa una generación al anexar mensajes o eventos, invalidando de forma
  acotada el historial mediante comportamiento normal de producto;
- cae a PostgreSQL ante miss o Redis no disponible;
- no expone al cliente el resultado hit/miss.

`4uentes-auth` se leyó sin mutación desde `origin/develop@b9c38fc`. El facade
preserva status y body de las seis operaciones de retención, reenvía una
allowlist de request headers y actualmente no propaga metadata de response del
historial.

Los roots locales de ambos owners contienen o pueden contener trabajo ajeno y
no son elegibles para ejecución. Una futura mutación debe usar worktrees
aislados desde refs canónicas refrescadas.

## Boundary candidato para planificación

La alternativa mínima que debe evaluar el plan es:

1. un turno sintético autenticado invalida el historial por el flujo existente;
2. Bend produce una señal HTTP metadata-only con estado `hit`, `miss` o
   `bypass`, sin IDs, keys ni datos privados;
3. Auth reenvía únicamente esa señal para la ruta de history;
4. el harness de CR-SST-0207 prueba miss en la primera lectura y hit en la
   segunda, siempre por `/api/chat/*`;
5. la conversación se elimina por el contrato de producto.

El nombre y formato exactos de la señal son una decisión del plan y de los
owners. Esta reserva no adopta un endpoint administrativo, no autoriza acceso
directo a Redis y no obliga a modificar Fend o Infra.

## Límites aplicados

Este preflight fue read-only para repos hijos, Jira y runtime. No creó datos
sintéticos, no leyó mensajes o credenciales, no ejecutó comandos Redis y no
modificó cluster, deployment, flags, secretos ni producción.

El próximo gate es fusionar y releer esta reserva. Sólo después corresponde
publicar el lifecycle `planned` y pedir autorización separada para cualquier
mutación de Bend/Auth o escritura Jira.
