# Autorizacion de cierre Jira para CR-SST-0206

Fecha: 2026-08-23.

## Autoridad

Despues del merge owner, el usuario instruyo: `Recordemos trasicionar jira y
respaldar completando documentacion ARDS/SDD al final. continua`.

La instruccion se registra como autorizacion de un unico lote Jira, consumible
solamente despues de que el lifecycle de cierre de `CR-SST-0206` quede
fusionado en el control plane.

## Operacion exacta autorizada

1. Verificar en modo lectura que `SST-116` sigue siendo Subtask de `SST-113` y
   refleja `CR-SST-0206`.
2. Verificar que la transicion disponible `Listo` tiene como destino
   `Finalizada`.
3. Transicionar solamente `SST-116` a `Finalizada` mediante esa transicion.
4. Releer `SST-116` y registrar status, categoria, resolucion, tipo y parent.

No se autorizan comentarios, edicion de campos, creacion, borrado, links,
reparenting ni escritura sobre `SST-113`, `SST-117` u otro issue. El lote no
autoriza iniciar QA integrada ni mutar repos hijos. Jira sigue siendo espejo;
ARDS/SDD conserva la autoridad del lifecycle.

## Estado

`authorized-pending-control-plane-closure-merge`.
