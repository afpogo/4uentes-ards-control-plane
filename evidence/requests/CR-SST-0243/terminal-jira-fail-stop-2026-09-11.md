# Fail-stop del lote Jira terminal de CR-SST-0243

Fecha local: 2026-09-11.

## Resultado

El PR de autorización terminal `#321` fue fusionado en
`de091cf638f8048afae022e1f70be7e5c259207c` y leído desde `main`. La ventana
Jira comenzó a las `2026-09-11T20:10:49.2113860-03:00`, con vencimiento
original a las `2026-09-11T20:40:49.2113860-03:00`.

El preflight encontró exactamente `SST-130`, id `10291`, como `Subtask` de
`SST-128`, en estado `En curso`, sin resolución, con el único comentario
inicial `10440`, el vínculo `10093` que indica que está bloqueado por
`SST-129`, y la transición `41` disponible hacia `Finalizada`.

La escritura 1 de un máximo de 2 creó el comentario `10441` a las
`2026-09-11T20:11:08.398-03:00`. Jira devolvió el cuerpo exacto autorizado,
cuyo SHA-256 UTF-8 registrado es
`1572e6cf198be66f5f4733814c9b5eb7a4b855c3b8f6d3552f72f82a04ec0f28`.

## Motivo del corte

El primer wrapper de readback recibió la respuesta de Jira, pero falló antes
de exponer el resultado al intentar calcular el hash con una API local no
disponible: `ReferenceError: TextEncoder is not defined`. Ese wrapper no
intentaba ninguna escritura Jira.

La regla autorizada decía que cualquier fallo o incertidumbre consumía el
lote y bloqueaba las escrituras restantes. Por lo tanto se aplicó fail-stop y
no se ejecutó la transición `41`.

Una lectura posterior, estrictamente no mutante, confirmó:

- comentario total: 2, ids `10440` y `10441`;
- `10441` coincide exactamente con el cuerpo autorizado;
- estado `En curso` (`10006`) y resolución nula;
- parent `SST-128` y vínculo `10093` hacia el bloqueante `SST-129` intactos.

## Estado y próximo gate

El lote terminal queda consumido parcialmente: 1/2 escrituras, detenido. No
se declara `SST-130` finalizada ni `CR-SST-0243` done. Antes de ejecutar sólo
la transición pendiente se requiere publicar y leer esta evidencia y obtener
una nueva autorización explícita, acotada a una única escritura sobre
`SST-130`.

No hubo otras escrituras Jira ni cambios en Auth, Bend, Fend, Infra, runtime,
rollback, migraciones, flags, datos reales o QA integrada.
