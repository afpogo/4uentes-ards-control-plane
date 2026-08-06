# CR-SST-0095 - Candidatos De CR / Jira Tasks Para `SST-29`

## Regla De Organizacion

Cada CR debe mapear a un ticket Jira bajo la Epic `SST-29`.

Formato recomendado de summary:

```text
[SST][INIT-SST-0003][CR-SST-####] <accion concreta>
```

Las subtareas pueden vivir como subtareas Jira o como checklist en comentario,
pero la evidencia y cierre quedan en el CR local.

## Orden Recomendado

1. `CR-SST-0098`: bugfix de captura PDF visual tab-by-tab.
2. `CR-SST-0099`: taxonomy de outcome/warnings por tab.
3. `CR-SST-0100`: UI de progreso/degradaciones de session capture.
4. `CR-SST-0101`: contrato productor `CredentialedWebSource` en extension.
5. `CR-SST-0102`: handoff preview hacia `LearningWorkspace`.
6. `CR-SST-0103`: QA harness de extension para paginas privadas.

Nota: `CR-SST-0096` ya esta asignado a
`owner-documentation-authority-policy` y `CR-SST-0097` ya esta asignado a la
remediacion owner-doc de `sst-bend`; ninguno debe reutilizarse para extension.

## CR-SST-0098 - Fix Session Tab-by-tab Visual PDF Capture

Jira summary:

```text
[SST][INIT-SST-0003][CR-SST-0098] Fix sst-extension session tab-by-tab visual PDF capture
```

Objetivo:

Corregir el bug operativo de captura por sesion: cada tab debe activarse,
esperar carga/settle, capturarse como PDF visual cuando sea posible, y restaurar
la tab activa original al finalizar.

Subtareas Jira sugeridas:

- Actualizar spec `sessions` con carga/settle/restauracion de foco.
- Actualizar docs owner de `sst-extension` afectadas por el cambio.
- Capturar y restaurar tab activa original.
- Agregar wait strategy por tab: `tabs.onUpdated`, `document.readyState`,
  settle y timeout.
- Preservar scroll inicial por tab cuando sea posible.
- Mantener fallo parcial sin abortar todo el lote.
- Agregar unit tests de tab activation, timeout y restore original.
- Ejecutar `pnpm test`, `pnpm build`, `pnpm check`.

Definition of Done:

- La tab original queda activa al terminar.
- Tabs lentas no se capturan antes de ready/settle o producen warning.
- Una tab fallida no invalida necesariamente toda la sesion.
- No se introducen content scripts persistentes.
- Evidencia no incluye contenido privado real.
- La evidencia central lista rutas owner actualizadas en `sst-extension`.

## CR-SST-0099 - Session Snapshot Outcome Taxonomy

Jira summary:

```text
[SST][INIT-SST-0003][CR-SST-0099] Add session snapshot outcomes and warnings
```

Objetivo:

Distinguir captura visual PDF, fallback textual, URL no soportada, permiso
denegado, pagina demasiado larga, timeout y fallo de captura.

Subtareas Jira sugeridas:

- Definir `snapshot.captureMode` o `snapshot.outcome`.
- Definir `warnings[]` por tab.
- Actualizar specs/docs owner de `sst-extension`.
- Actualizar normalizadores de storage.
- Actualizar payload hacia `node-auth` sin romper compatibilidad.
- Agregar tests de migracion/normalizacion.

Definition of Done:

- PDF visual y PDF textual fallback son distinguibles.
- Los consumers pueden mostrar degradaciones.
- Payload antiguo sigue normalizando de forma compatible.
- La evidencia central lista rutas owner actualizadas o excepcion aprobada.

## CR-SST-0100 - Session Capture UI Progress And Degradation States

Jira summary:

```text
[SST][INIT-SST-0003][CR-SST-0100] Show session capture progress and per-tab degradations
```

Objetivo:

Hacer visible para el usuario que pestañas fueron capturadas como PDF visual,
cuales tuvieron fallback textual y cuales fallaron o fueron omitidas.

Subtareas Jira sugeridas:

- Mostrar conteo visual/textual/fallidas.
- Mostrar warnings por tab sin exponer contenido.
- Actualizar docs/specs owner si cambia comportamiento observable.
- Mantener acciones retry/restore/delete.
- Agregar tests de helpers de presentacion.
- QA manual en popup y sidepanel.

Definition of Done:

- El usuario entiende el resultado de cada tab.
- No hay layout shift severo ni texto superpuesto.
- No se muestra contenido privado real en evidencia.
- Owner docs quedan actualizados o excepcion documentada.

## CR-SST-0101 - Extension CredentialedWebSource Producer Contract

Jira summary:

```text
[SST][INIT-SST-0003][CR-SST-0101] Define sst-extension CredentialedWebSource producer contract
```

Objetivo:

Formalizar que `sst-extension` puede producir `CredentialedWebSource` en modo
`browser-session`, sin usar plaintext secrets del Diccionario.

Subtareas Jira sugeridas:

- Definir `sourceType: credentialed-web`.
- Definir `captureMode: browser-session`.
- Crear/actualizar specs/docs owner en `sst-extension`.
- Mapear artifacts: `visualPdf`, `readableText`, futuro `rawHtml`.
- Declarar que `DictionarySecret SecretRef` queda fuera del cliente.
- Definir provenance y preview-only gate.

Definition of Done:

- Contrato documentado sin implementar crawler.
- No hay flujo que entregue plaintext secret al frontend.
- Queda claro como entra luego a `LearningWorkspace`.
- `sst-extension` conserva autoridad documental del producer contract.

## CR-SST-0102 - LearningWorkspace Preview Handoff For Extension Artifacts

Jira summary:

```text
[SST][INIT-SST-0003][CR-SST-0102] Prepare LearningWorkspace preview handoff for extension session artifacts
```

Objetivo:

Definir y/o implementar el puente para que artifacts de session capture entren
como preview revisable, no como persistencia durable automatica.

Subtareas Jira sugeridas:

- Confirmar endpoint productor/consumer.
- Actualizar owner docs en cada repo hijo mutado o registrar excepcion.
- Definir payload preview-only.
- No crear `TagDefinition`.
- No enviar contenido a agente IA antes de aceptacion.
- Registrar warnings y provenance.

Definition of Done:

- Preview-only gate preservado.
- Scope cuenta/usuario definido.
- No hay persistencia durable sin aceptacion.
- Productor, consumidor y rol del control-plane quedan identificados.

## CR-SST-0103 - Extension Private Page Capture QA Harness

Jira summary:

```text
[SST][INIT-SST-0003][CR-SST-0103] Add QA harness for private authenticated page capture
```

Objetivo:

Crear un set reproducible de QA manual/automatizada para extension capture sin
guardar contenido privado real.

Subtareas Jira sugeridas:

- Fixture local de pagina autenticada ficticia.
- Documentar QA owner en `sst-extension`.
- Caso pagina lenta.
- Caso scroll largo.
- Caso permiso denegado.
- Caso URL no soportada.
- Caso fallo parcial multi-tab.
- Evidencia sanitizada.

Definition of Done:

- QA reproducible sin credenciales reales.
- Evidencia sanitizada.
- Casos cubren tabs privadas, lentas y fallidas.
- QA owner queda referenciada desde evidencia central.

## Recomendacion De Primer Ticket

Crear primero `CR-SST-0098` y su Jira task bajo `SST-29`.

Razon:

El bug actual bloquea confianza en session capture. Sin captura robusta por tab,
los contratos posteriores (`CredentialedWebSource`, `LearningWorkspace`,
Dictionary adjacency) quedan sobre una base inestable.
