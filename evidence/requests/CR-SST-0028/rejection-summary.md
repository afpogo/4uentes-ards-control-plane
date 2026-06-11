# CR-SST-0028 - Rechazo Por Obsolescencia

Observado el: 2026-06-05

## Decision

CR-SST-0028 queda cerrado como `rejected` porque su concepto principal quedo
obsoleto.

El request hablaba de "user ARDS intelligence UI and persistence workflow".
CR-SST-0030 corrigio esa direccion: SST no debe implementar un ARDS/SDD por
usuario, sino una memoria interna de usuario.

## Motivo

Ejecutar CR-SST-0028 como estaba escrito mantendria tres errores:

- presentar memoria de usuario como ARDS/SDD de usuario;
- partir desde UI/persistencia antes de cerrar el modelo runtime de memoria;
- mezclar fuentes largas y derivacion por parrafos con el primer slice de
  memoria interna.

## Estado Correcto

CR-SST-0028 no debe moverse a `queued` ni `running`.

Debe reemplazarse por un nuevo request enfocado en:

- `user_memory_event`;
- `user_memory_fact`;
- `user_memory_intention`;
- `user_memory_thread`;
- `user_memory_recall`;
- validacion backend;
- recall basico por chatbot.

## Relacion Con Requests Previos

CR-SST-0026 y CR-SST-0027 ya estaban cerrados en `done`, por lo que no se
reabren ni se borran.

Ambos quedan como evidencia historica corregida por CR-SST-0030.
