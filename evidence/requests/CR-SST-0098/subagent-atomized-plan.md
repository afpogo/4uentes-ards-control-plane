# CR-SST-0098 - Plan atomizado y uso de subagentes

## Politicas aplicadas

- `agent-delegation-policy`
- `agent-task-atomization-policy`
- `owner-documentation-authority-policy`

La delegacion se uso solo para discovery acotado. El agente principal conserva
decision de arquitectura, seguridad, scope, integracion y cierre.

## Subagentes usados

### Discovery tecnico de captura

- Objetivo: identificar flujo actual, riesgos y tests relevantes de captura
  PDF tab-by-tab.
- Input minimo: `CR-SST-0098`, repo `sst-extension`, rutas de captura/sesiones.
- Output: archivos clave, funciones, riesgos y gaps de cobertura.
- Riesgo: medio; lectura de codigo con datos no sensibles.
- Perfil: explorer.
- Resultado: integrado en `preliminary-analysis.md`.

### Discovery documental owner

- Objetivo: ubicar specs/docs owner afectadas por el cambio.
- Input minimo: `CR-SST-0098`, repo `sst-extension`, politica owner docs.
- Output: rutas candidatas, brecha documental y evidencia esperada.
- Riesgo: bajo/medio; no redefine contratos.
- Perfil: explorer.
- Resultado: integrado en `preliminary-analysis.md`.

## Plan de subtareas para SST-30

### 1. Alinear owner specs/docs

- Objetivo: declarar comportamiento esperado antes de mutar runtime.
- Inputs: `specs/features/sessions.yaml`, docs de ingestion/session capture.
- Output esperado: spec/documentacion owner con foco original, ready/settle,
  timeout, scroll, fallback y evidencia QA sanitizada.
- Riesgo: medio.
- DoD: rutas owner listadas en evidencia central.

### 2. Estabilizar foco y restauracion de tab original

- Objetivo: que el lote de captura no deje al usuario en la ultima tab
  procesada.
- Inputs: `capture-active-window-sessions.ts`,
  `capture-session-tab-fullpage-pdf.ts`.
- Output esperado: captura conoce/restaura la tab activa original cuando sea
  posible.
- Riesgo: medio por browser APIs.
- DoD: test unitario y caso manual documentado.

### 3. Implementar wait strategy por tab

- Objetivo: evitar capturas prematuras.
- Inputs: `tabs.onUpdated`, `document.readyState`, settle local y timeout.
- Output esperado: wait gobernado por tab antes de medir/capturar.
- Riesgo: medio.
- DoD: tests de ready/timeout y documentacion de degradacion.

### 4. Preservar scroll inicial y manejar segmentos

- Objetivo: reducir impacto visible del full-page capture.
- Inputs: capturador visual y scripting API.
- Output esperado: restauracion best-effort del scroll inicial por tab.
- Riesgo: bajo/medio.
- DoD: test o QA manual sanitizada.

### 5. Mantener degradacion parcial observable

- Objetivo: no abortar todo el lote por una tab fallida cuando exista resultado
  parcial seguro.
- Inputs: `create-session-capture-service.ts`, tipos compartidos si aplican.
- Output esperado: warning/degradacion local sin exponer contenido privado.
- Riesgo: medio; puede tocar shape de resultado si se amplifica.
- DoD: no romper contrato actual; cambios de contrato requieren spec owner.

### 6. Validacion

- Objetivo: cerrar con evidencia reproducible.
- Inputs: repo hijo y control-plane.
- Output esperado:
  - `pnpm test`
  - `pnpm build`
  - `pnpm check`
  - `npm.cmd run check`
- Riesgo: bajo.
- DoD: resultados registrados en `validation-results.md`.

## Fallbacks

- Si el browser runtime no permite una senal fiable de carga, usar estrategia
  combinada con timeout y warning documentado.
- Si fallos parciales requieren cambiar contrato compartido, separar follow-up y
  no ampliar silenciosamente `CR-SST-0098`.
- Si no se puede actualizar documentacion owner en el mismo lifecycle, registrar
  excepcion owner docs con follow-up antes de cualquier cierre.
