CR-SST-0119 / SST-49 - inicio de trabajo

Se inicia el analisis/implementacion del modo configurable de captura de sesion en `sst-extension`.

Alcance:

- `auto`: mantener comportamiento actual visual-first con fallback textual.
- `visual-only`: no generar PDF textual silencioso si falla la captura visual.
- `text-only`: omitir captura visual y generar PDF textual.
- `prefer-text`: priorizar texto para paginas privadas/largas.

Boundary:

- Mutacion prevista: `sst-extension` + evidencia control-plane.
- Sin cambios en `node-auth`, `sst-fend` o `sst-bend`.
- Sin cambios de payload BFF salvo contrato futuro.
- Owner docs requeridas en `sst-extension`.

Evidencia inicial:

- `evidence/requests/CR-SST-0119/preliminary-analysis.md`

Jira es mirror operativo; ARDS/SDD permanece como fuente de verdad.
