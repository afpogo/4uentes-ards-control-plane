# INIT-SST-0010 - RevisiÃ³n De La IntenciÃ³n Original

Fecha: 2026-08-17

## Fuentes Revisadas

Se revisaron dos resÃºmenes locales de planificaciÃ³n de producto:

- `04-17 PlanificaciÃ³n del Producto: Modelo de usuarios, cuentas y roles de robots en SST`.
- `06-18 ReuniÃ³n de PlanificaciÃ³n: Studio StoreTag, ARDS, Tags y Enriquecimiento con IA`.

No se persisten rutas absolutas del host en la Initiative ni en los contratos
estables.

## Intenciones Preservadas

- SST como base de conocimiento personal.
- Tags estructurados como mecanismo central de clasificaciÃ³n y recuperaciÃ³n.
- PersonalizaciÃ³n inicial para perfiles como ingenierÃ­a de software.
- Robots o agentes con personalidad, capacidades y vistas limitadas.
- Enriquecimiento y recall mediante RAG.
- ImportaciÃ³n, exportaciÃ³n y futura instalaciÃ³n o rÃ©plica en dispositivos.

## CorrecciÃ³n ARDS/SDD Aplicada

`CR-SST-0030` corrigiÃ³ la equivalencia entre memoria de usuario y ARDS/SDD de
proyecto. La iniciativa recupera la intenciÃ³n de portabilidad y Ã¡rbol fÃ­sico
como una proyecciÃ³n derivada, sin convertirla en un control plane por usuario.

## Activos Existentes Para Reutilizar

- `CR-SST-0031`: eventos, propuestas, hechos, intenciones y recall.
- `CR-SST-0092`: LearningWorkspace y contexto aceptado en `sst-bend`.
- `CR-SST-0155`: kernel RAG gobernado y read-only.
- `sst-chatbot`: generador POC con modos `logical`, `physical` e `hybrid`.
- `INIT-SST-0007`: identidad, conversaciÃ³n durable y runtime de chat.

## Gap Integrador

No existe todavÃ­a un contrato y runtime que conecte esos activos en una sola
vertical de memoria personal durable, revisable, portable y consumible por un
agente SST.
