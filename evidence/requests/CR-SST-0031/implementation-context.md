# CR-SST-0031 - Contexto De Implementacion

Observado el: 2026-06-05

## Objetivo De Producto

El objetivo es que SST empiece a construir memoria interna por usuario a partir
de acciones reales y conversaciones con chatbot.

La memoria no reemplaza el ARDS/SDD del proyecto. Es un recurso runtime privado
del usuario para recordar hechos, intenciones y contexto util.

## Corte Inicial Recomendado

El primer corte debe probar una historia simple:

```text
usuario: "recordame que quiero estudiar Spring Security"
  -> evento de memoria
  -> propuesta de intencion por chatbot
  -> validacion backend
  -> intencion activa guardada
  -> usuario pregunta despues
  -> chatbot recupera la intencion
```

Este corte prueba los puntos dificiles sin depender de UI nueva, embeddings,
PDFs, documentos largos o pipelines por parrafos.

## Implementacion Por Servicio

### `sst-bend`

Responsabilidad principal del primer corte.

Debe implementar o preparar:

- storage durable para `user_memory_event`;
- storage durable para `user_memory_fact`;
- storage durable para `user_memory_intention`;
- validacion de `tenant_id`, `account_id`, `user_id`;
- idempotencia por `idempotency_key`;
- API o puerto interno para crear eventos;
- API o puerto interno para aceptar/rechazar propuestas;
- API o puerto interno para recall basico.

El backend debe poder responder: "esta memoria pertenece a este usuario y fue
creada por estos eventos".

### `sst-chatbot`

Responsabilidad principal agentica.

Debe implementar o preparar:

- detector de eventos de memoria desde conversacion;
- generador de `user_memory_proposal`;
- propuesta de `fact` e `intention`;
- llamada al backend para persistencia validada;
- recall basico consultando backend;
- respuesta al usuario con memoria recuperada y confidence.

El chatbot no debe guardar memoria durable por fuera del backend.

### `4uentes-auth`

Debe proveer o permitir consumir el scope necesario:

- usuario autenticado;
- account o tenant;
- permisos basicos.

Si algun scope falta, el primer request funcional debe documentarlo como gap en
vez de inventar identidad local.

### `sst-fend`

Puede quedar fuera del primer corte funcional.

Si se incluye, debe limitarse a:

- disparar una accion explicita "recordar";
- mostrar una respuesta simple del chatbot;
- no administrar todavia una pantalla completa de memoria.

## Contrato Runtime Minimo

El flujo funcional necesita como minimo:

```text
POST create_memory_event
POST propose_memory
POST accept_or_reject_memory_proposal
GET recall_memory
```

Los nombres exactos pueden adaptarse al estilo de cada repo, pero esas cuatro
capacidades deben existir.

## Criterios De Aceptacion

- Un evento de memoria se persiste con scope de usuario.
- Una propuesta duplicada con la misma idempotency key no duplica memoria.
- El chatbot puede proponer una intencion.
- El backend puede validar y persistir esa intencion.
- El chatbot puede recuperar esa intencion despues.
- No hay recall cross-user.
- La respuesta de recall puede explicar que evento origino la memoria.

## Riesgos

- Guardar recuerdos inferidos como hechos sin confidence.
- Exponer memoria entre usuarios por scope incompleto.
- Dejar que chatbot escriba directo sin backend.
- Empezar por UI o documentos largos y no probar el nucleo.
- Mezclar memoria interna de usuario con ARDS/SDD del proyecto.
