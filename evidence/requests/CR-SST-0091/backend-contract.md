# CR-SST-0091 - Contrato Backend Inicial

## Servicio

Servicio objetivo futuro: `sst-bend`.

`sst-bend` sigue siendo autoridad de:

- persistencia;
- autorizacion;
- scope filtering;
- consolidacion de previews aceptados;
- idempotencia;
- contexto para chatbot.

## Entidades Runtime Esperadas

Entidades nuevas o equivalentes:

- `LearningWorkspace`
- `LearningSourceRef`
- `LearningDocumentRef`
- `LearningContentBlockRef`
- `LearningAssetRef`
- `LearningLabRef`
- `LearningSpecRef`
- `LearningImportWarning`
- `LearningImportProvenance`

Links con memoria interna:

- `user_memory_event`
- `user_memory_fact`
- `user_memory_intention`

Si `sst-bend` ya tiene modelos equivalentes, la implementacion futura debe
reusar el patron local y documentar el mapeo.

## APIs Minimas

Superficie interna o autenticada esperada:

- `workspace_get_or_create`: devuelve o crea workspace scoped.
- `source_preview`: devuelve salida `preview-only`.
- `source_accept`: consolida preview aprobado en workspace durable.
- `source_reject`: registra rechazo sin entrar al recall durable.
- `workspace_context`: devuelve `LearningWorkspaceContext` para chatbot.

El nombre final de rutas y handlers queda sujeto al patron local de
`sst-bend`, pero debe mapear estos cinco casos.

## Scope Obligatorio

Toda lectura o escritura debe filtrar por:

- `tenant_id`
- `account_id`
- `user_id`

Pruebas negativas minimas:

- mismo tenant, distinta cuenta no lee workspace;
- misma cuenta, distinto usuario no lee workspace;
- distinto tenant no lee workspace;
- preview no aprobado no aparece en `LearningWorkspaceContext`.

## Preview Gate

Reglas:

- `source_preview` no crea contenido durable aceptado.
- `source_accept` es el unico camino para consolidar en workspace.
- `workspace_context` excluye previews no aprobados.
- `TagDefinition` no se crea automaticamente.
- `sst-chatbot` no escribe memoria durable directo.

## Idempotencia

La aceptacion repetida debe usar claves derivadas de:

- `tenant_id`
- `account_id`
- `user_id`
- fingerprint de source;
- fingerprint de preview aceptado.

Resultado esperado:

- no duplicar documentos;
- no duplicar bloques;
- no duplicar warnings;
- no duplicar eventos de memoria;
- devolver resultado deterministico.
