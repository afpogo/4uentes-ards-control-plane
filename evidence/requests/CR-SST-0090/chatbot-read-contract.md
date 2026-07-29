# CR-SST-0090 - Contrato De Lectura Para Chatbot

## Regla Central

`sst-chatbot` no lee ni escribe `LearningWorkspace` directamente.

El chatbot solicita contexto a `sst-bend`. `sst-bend` filtra por
`tenant_id`, `account_id` y `user_id`, arma el payload explicable y devuelve
solo contenido autorizado.

## Read Model

Nombre del payload:

```yaml
LearningWorkspaceContext
```

Contenido permitido:

- resumen del workspace;
- documentos aceptados;
- bloques relevantes aceptados;
- tags sugeridos aprobados o tags gobernados;
- warnings importantes;
- progreso;
- intenciones activas;
- provenance suficiente para explicar de donde sale una respuesta.

Contenido excluido:

- previews no aprobados;
- secretos;
- archivos generados;
- contenido fuera de scope;
- contenido cross-user;
- contenido cross-account;
- contenido cross-tenant;
- `node_modules`, builds, caches y artefactos temporales;
- labs generados como texto ingerido ciegamente.

## Autoridad De Persistencia

`sst-bend` es la unica autoridad de:

- persistencia durable;
- autorizacion;
- scope filtering;
- consolidacion desde preview aceptado;
- idempotencia de imports;
- auditoria de eventos.

`sst-chatbot` puede:

- explicar;
- clasificar;
- resumir;
- sugerir siguientes acciones;
- proponer hechos o intenciones para revision.

`sst-chatbot` no puede:

- escribir memoria durable directo;
- aceptar imports;
- crear `TagDefinition`;
- publicar contenido;
- cerrar Jira.

## Eventos De Memoria

Eventos nuevos o extendidos que el backend futuro puede emitir:

- `learning.workspace_created`
- `learning.source_previewed`
- `learning.source_accepted`
- `learning.document_reviewed`
- `learning.tag_suggested`
- `learning.intention_created`

Estos eventos pertenecen a `SST user internal memory`; no son eventos del
ARDS/SDD canonico de proyecto.
