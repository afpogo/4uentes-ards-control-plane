# INIT-SST-0003 - Payload Local Para Tickets Jira

## Epic

- Epic: `SST-29`
- Initiative: `INIT-SST-0003`

## Tickets Propuestos

### CR-SST-0098

Summary:

```text
[SST][INIT-SST-0003][CR-SST-0098] Fix sst-extension session tab-by-tab visual PDF capture
```

Subtareas:

- Actualizar spec `sessions` con carga, settle y restauracion de foco.
- Actualizar docs owner de `sst-extension` afectadas por el cambio.
- Capturar y restaurar tab activa original.
- Agregar wait strategy por tab: `tabs.onUpdated`, `document.readyState`,
  settle y timeout.
- Preservar scroll inicial por tab cuando sea posible.
- Mantener fallo parcial sin abortar todo el lote.
- Agregar unit tests de tab activation, timeout y restore original.
- Ejecutar `pnpm test`, `pnpm build` y `pnpm check`.

### CR-SST-0099

Summary:

```text
[SST][INIT-SST-0003][CR-SST-0099] Add session snapshot outcomes and warnings
```

Subtareas:

- Definir `snapshot.captureMode` o `snapshot.outcome`.
- Definir `warnings[]` por tab.
- Actualizar specs/docs owner de `sst-extension`.
- Actualizar normalizadores de storage.
- Actualizar payload hacia `node-auth` sin romper compatibilidad.
- Agregar tests de migracion/normalizacion.

### CR-SST-0100

Summary:

```text
[SST][INIT-SST-0003][CR-SST-0100] Show session capture progress and per-tab degradations
```

Subtareas:

- Mostrar conteo visual/textual/fallidas.
- Mostrar warnings por tab sin exponer contenido.
- Actualizar docs/specs owner si cambia comportamiento observable.
- Mantener acciones retry/restore/delete.
- Agregar tests de helpers de presentacion.
- Ejecutar QA manual en popup y sidepanel.

### CR-SST-0101

Summary:

```text
[SST][INIT-SST-0003][CR-SST-0101] Define sst-extension CredentialedWebSource producer contract
```

Subtareas:

- Definir `sourceType: credentialed-web`.
- Definir `captureMode: browser-session`.
- Crear o actualizar specs/docs owner en `sst-extension`.
- Mapear artifacts: `visualPdf`, `readableText` y futuro `rawHtml`.
- Declarar que `DictionarySecret SecretRef` queda fuera del cliente.
- Definir provenance y preview-only gate.

### CR-SST-0102

Summary:

```text
[SST][INIT-SST-0003][CR-SST-0102] Prepare LearningWorkspace preview handoff for extension session artifacts
```

Subtareas:

- Confirmar endpoint productor/consumer.
- Actualizar owner docs en cada repo hijo mutado o registrar excepcion.
- Definir payload preview-only.
- No crear `TagDefinition`.
- No enviar contenido a agente IA antes de aceptacion.
- Registrar warnings y provenance.

### CR-SST-0103

Summary:

```text
[SST][INIT-SST-0003][CR-SST-0103] Add QA harness for private authenticated page capture
```

Subtareas:

- Fixture local de pagina autenticada ficticia.
- Documentar QA owner en `sst-extension`.
- Caso pagina lenta.
- Caso scroll largo.
- Caso permiso denegado.
- Caso URL no soportada.
- Caso fallo parcial multi-tab.
- Evidencia sanitizada.

## Gate Comun

Cada ticket debe incluir:

- Jira es mirror; ARDS/SDD local es source of truth.
- Cualquier mutacion de `sst-extension` debe actualizar owner specs/docs o
  registrar excepcion antes del cierre.
- No guardar contenido privado real, cookies, JWTs o plaintext secrets en Jira
  ni en evidencia.
