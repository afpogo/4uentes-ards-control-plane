# CR-SST-0031 - Flujo Evento, Propuesta Y Recall

Observado el: 2026-06-05

## Captura De Evento

El backend debe poder capturar un `user_memory_event` cuando ocurre una accion
relevante dentro de SST.

Eventos iniciales recomendados:

- mensaje enviado al chatbot;
- pedido explicito de recordar algo;
- confirmacion de memoria sugerida;
- guardado de item;
- tagging de item.

## Propuesta De Memoria

`sst-chatbot` puede transformar eventos en `user_memory_proposal`.

Ejemplos:

- de "recordame que quiero estudiar Spring Security" a `user_memory_intention`;
- de "este articulo es importante para Java" a `user_memory_fact`;
- de varios eventos relacionados a `thread_link`.

La propuesta no es memoria durable todavia.

## Validacion Backend

`sst-bend` debe validar:

- scope del usuario;
- permisos;
- idempotencia;
- forma del payload;
- visibilidad inicial;
- relacion con eventos fuente.

Despues puede aceptar, rechazar o marcar para revision.

## Recall Basico

El chatbot puede pedir recuperacion de memoria a partir de una consulta.

El recall inicial debe devolver:

- hechos relevantes;
- intenciones activas;
- eventos fuente;
- resumen corto;
- confidence.

El recall no debe exponer memoria de otro usuario, account o tenant.

## Criterio De Exito Del Slice

El slice es exitoso si permite este recorrido:

```text
usuario pide recordar algo
  -> evento durable
  -> propuesta de intencion
  -> validacion backend
  -> intencion activa guardada
  -> chatbot puede recordarla despues
```
