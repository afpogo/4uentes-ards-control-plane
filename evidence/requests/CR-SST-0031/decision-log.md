# CR-SST-0031 - Decision Log

Observado el: 2026-06-05

## Decision 1: Empezar Por Eventos Simples

Se decide empezar con eventos internos simples y conversaciones con chatbot.

Motivo:

- reduce riesgo;
- permite probar privacidad e idempotencia;
- evita bloquearse con PDFs, parsing, chunks o UI avanzada;
- valida el nucleo de memoria antes de expandirlo.

## Decision 2: Backend Como Autoridad

`sst-bend` debe ser la autoridad de persistencia y validacion.

Motivo:

- la memoria es privada y durable;
- necesita scope por usuario/account;
- necesita idempotencia;
- necesita auditoria minima;
- evita que el chatbot escriba memoria fuera de contrato.

## Decision 3: Chatbot Como Productor De Propuestas

`sst-chatbot` debe producir `user_memory_proposal`, no memoria final.

Motivo:

- el agente puede inferir mal;
- las inferencias necesitan confidence;
- backend debe validar payload y scope;
- el usuario debe poder revisar memoria visible en fases futuras.

## Decision 4: UI Avanzada Diferida

`sst-fend` no debe ser el centro del primer corte.

Motivo:

- la UI no prueba por si sola el nucleo de memoria;
- primero hay que probar storage, proposal y recall;
- una pantalla avanzada podria forzar contratos inmaduros.

## Decision 5: Sin Paragraph Derivation En El Primer Slice

CR-SST-0027 queda como contrato futuro para fuentes largas.

Motivo:

- derivacion por parrafos agrega complejidad de chunking, prompts y evidencia;
- el primer slice necesita probar memoria de eventos internos;
- las fuentes largas pueden alimentar memoria despues.

## Decision 6: Recall Basico Antes Que Busqueda Semantica

El primer recall puede ser simple y explicable.

Motivo:

- busqueda vectorial o semantica agrega infraestructura;
- el primer valor es recordar intenciones y hechos explicitamente guardados;
- explicar el evento origen es mas importante que rankear perfecto al inicio.

## Decision 7: No Crear ARDS/SDD Por Usuario

La memoria interna de usuario no se nombra ni se implementa como ARDS/SDD por
usuario.

Motivo:

- el ARDS/SDD es la memoria del proyecto;
- el usuario necesita memoria runtime de producto;
- CR-SST-0030 ya corrigio este boundary.
