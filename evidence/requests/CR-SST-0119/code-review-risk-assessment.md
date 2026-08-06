# CR-SST-0119 - Code Review Risk Assessment

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0119`
- Jira: `SST-49`
- Tipo: revision tecnica posterior a QA manual positiva.
- Decision: no cerrar todavia sin registrar riesgos y follow-ups.

## Politicas Aplicadas

- `agent-model-selection-policy`
- `agent-delegation-policy`
- `agent-task-atomization-policy`
- `owner-documentation-authority-policy`
- `agent-architecture-boundary-policy`

## Clasificacion

- `task_weight.classification`: `complex-high-risk-task`
- Drivers:
  - captura de paginas privadas;
  - extension Manifest V3 background lifecycle;
  - storage local con artifacts PDF/base64;
  - posible contenido sensible;
  - contrato BFF que no debe cambiar en SST-49;
  - boundary con `CR-SST-0120` para preview image.

## Subagentes

Se usaron subagentes en modo revision estatica, sin edicion de archivos.

- `runtime-capture-reviewer`
  - foco: servicio de captura, PDF materialization, escalado runtime.
- `ui-storage-reviewer`
  - foco: UI, storage, messaging, compatibilidad legacy.
- `ards-sdd-validator`
  - foco: request/evidencia/policies/boundaries.

El agente principal conserva la decision final y verifico los hallazgos contra
codigo y documentacion local.

## Hallazgos Priorizados

### Alta - Lifecycle MV3 De Captura Larga

Archivos referenciados:

- `sst-extension/src/platform/runtime/bootstrap-background.ts`
- `sst-extension/src/platform/messaging/extension-messaging.ts`

Riesgo:

La captura real queda desacoplada del handler que responde al popup con
`capturing`. En MV3 el service worker puede suspenderse durante lotes largos,
dejando `lastResult` en estado intermedio o sin cola persistida.

Recomendacion:

Crear follow-up para keepalive explicito o job durable:

- mantener el handler vivo hasta persistencia final; o
- usar `Port`, offscreen document, alarm/job durable; y
- persistir progreso intermedio para recuperacion.

### Alta - Tamano De Lote, Storage Y Payload

Archivos referenciados:

- `sst-extension/src/features/sessions/create-session-capture-service.ts`
- `sst-extension/src/platform/tabs/capture-session-tab-fullpage-pdf.ts`
- `sst-extension/src/platform/storage/extension-storage.ts`
- `sst-extension/src/platform/api/node-auth-browser-extension-session.ts`

Riesgo:

Los snapshots PDF/base64 de todas las pestanias se acumulan en memoria, se
guardan completos en `browser.storage.local` y se envian al BFF en un unico
request. Con capturas visuales grandes esto presiona memoria, cuota local,
serializacion y limites HTTP.

Recomendacion:

Crear follow-up para limites explicitos:

- maximo por tab;
- maximo por sesion;
- reason tipado `oversize`;
- tests que simulen fallo de `area.set` y submit por tamano.

### Alta - Retencion Local De Contenido Sin Minimizar

Archivos referenciados:

- `sst-extension/src/platform/storage/extension-storage.ts`
- `sst-extension/src/ui/quick-save/QuickSaveSurface.tsx`

Riesgo:

Las sesiones sincronizadas conservan URLs, titulos y `snapshot.dataBase64` en
storage local. Esto aumenta exposicion local de contenido privado y presion de
cuota, aun despues de submit exitoso.

Recomendacion:

Definir policy de retencion:

- purgar item sincronizado; o
- conservar metadata minima sin `dataBase64`; o
- TTL/limpieza explicita;
- separar restore metadata de snapshot artifact.

### Media - Fallo Parcial Aborta Toda La Sesion

Archivo referenciado:

- `sst-extension/src/features/sessions/create-session-capture-service.ts`

Riesgo:

Si una pestania falla inesperadamente despues de capturas exitosas previas, la
sesion completa puede fallar antes de persistirse. Esto reduce resiliencia en
ventanas grandes.

Recomendacion:

Crear follow-up para aislar fallo por pestania o persistir progreso incremental.
Como minimo, agregar test de regresion con primera pestania OK y segunda fallida.

### Media - Normalizacion Fragil Para Sesiones Parciales O Minimizadas

Archivo referenciado:

- `sst-extension/src/platform/storage/extension-storage.ts`

Riesgo:

La normalizacion puede descartar una sesion completa si una tab no tiene snapshot
completo, aunque `restoreTabs` sea valido. Esto bloquea futuras optimizaciones
de privacidad que quieran minimizar `dataBase64` luego de sync.

Recomendacion:

Separar validez de restore metadata y validez de snapshot. Aceptar sesiones
restore-only o parcialmente minimizadas.

### Media - Controles UI Durante Captura En Background

Archivo referenciado:

- `sst-extension/src/ui/quick-save/QuickSaveSurface.tsx`

Riesgo:

`sessionCapturePending` vuelve a `false` tras el ack inicial, no cuando termina
la captura real. El usuario puede cambiar modo durante una captura en curso sin
que la UI explique que aplica a la siguiente ejecucion.

Recomendacion:

Deshabilitar selector/accion cuando `lastResult.status === 'capturing'` o
persistir un flag in-flight gobernado por background.

### Media - PDF Textual Con Tokens Largos

Archivo referenciado:

- `sst-extension/src/platform/pdf/materialize-session-pdf.ts`

Riesgo:

Tokens largos sin espacios, como URLs firmadas o cadenas compactas, pueden
dibujarse fuera de pagina y degradar legibilidad del PDF textual/diagnostico.

Recomendacion:

Partir tokens sobredimensionados o aplicar ancho maximo al body/metadata; sumar
test con URL larga.

### Media - Governance De Subagentes

Archivo referenciado:

- `requests/planned/CR-SST-0119-sst-extension-configurable-session-capture-mode.yaml`

Riesgo:

El request planificado no registraba `task_weight`, `model_selection` ni
`subagent_deployment_plan` aunque la tarea ya habia pasado a revision de riesgo
alto.

Recomendacion:

Actualizar el request con trazabilidad de modelo/subagentes y esta evidencia.

### Baja - Boundary SST-49 vs SST-50 En Owner Docs

Archivos referenciados:

- `sst-extension/specs/features/sessions.yaml`
- `sst-extension/docs/00-overview.md`
- `sst-extension/docs/qa/session-capture-validation.md`

Riesgo:

La separacion existe en control-plane, pero conviene reforzar en owner docs que
preview/thumbnail/preview-unavailable pertenece a `CR-SST-0120 / SST-50`, no a
SST-49.

Recomendacion:

Actualizar owner docs antes de cierre de SST-49 o como parte del siguiente
follow-up de SST-50.

## Decision Propuesta

SST-49 puede considerarse funcionalmente exitoso para selector de modo, pero no
deberia cerrarse sin decidir si estos hallazgos se convierten en:

- subtareas de `SST-49` antes de cierre; o
- follow-up CRs separados bajo `INIT-SST-0003`.

La recomendacion pragmatica es separar:

- `SST-49`: cerrar solo despues de QA manual + pequenos ajustes documentales.
- Nuevo CR: hardening MV3/retencion/limites de sesiones.
- `SST-50`: preview image contract, ya separado.

