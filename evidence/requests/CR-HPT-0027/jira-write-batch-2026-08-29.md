# Lote Jira de CR-HPT-0027

Fecha: 2026-08-29.

## Autoridad

Este lote refleja en Jira el plan publicado de `CR-HPT-0027`. ARDS/SDD en
`4uentes-orchestor` conserva la autoridad. La instrucción humana fue:
`ok avancemos con el siguiente paso`, después de solicitar crear el nuevo CR.

## Precondiciones

- La reserva fue fusionada mediante PR `#186` y releída en
  `origin/main@07e494ead42448c5191296c84f9697a0fc59e9aa`.
- Este plan debe estar fusionado y releído antes de ejecutar el lote.
- Una búsqueda JQL exacta por `CR-HPT-0027` debe seguir sin coincidencias.
- `HPT-5` debe conservar tipo Epic y proyecto HPT.

## Escritura exacta autorizada

Crear un único issue:

- proyecto: `HPT`;
- tipo: `Tarea`;
- parent: `HPT-5`;
- summary: `[CR-HPT-0027] Govern local development secrets and Docker Compose port allocation`;
- estado esperado: `En curso`;
- labels: `ards-sdd`, `cr-hpt-0027`, `local-development`, `secrets`, `docker-compose`;
- descripción: objetivo, alcance, boundaries y referencia al request canónico;
- comentario 1: inicio de planificación, sin autorización de repos hijos ni
  runtime;
- comentario 2: reserva y plan publicados, matriz de puertos definida y
  siguiente gate identificado.

Se autoriza la transición inicial a `En curso` junto con la creación y los dos
comentarios enumerados. No se autorizan assignment, links, worklogs, borrados
ni otras escrituras. `En curso` refleja planificación y coordinación activas;
no autoriza mutación owner o runtime.

## Readback requerido

- key creada;
- summary, tipo, parent, estado, labels y dos comentarios exactos;
- ausencia de duplicado adicional;
- descripción sanitizada sin secretos, URLs privadas o datos personales.
