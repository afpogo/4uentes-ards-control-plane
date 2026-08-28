# INIT-SST-0009 - Decision de iniciativa

Fecha: 2026-08-28

## Decision

Se materializa `INIT-SST-0009` como el programa canonico de calidad integrada
de SST. `CR-SST-0222` es su request coordinador inicial porque el label
historico `CR-SST-0177` nunca llego al arbol canonico, aunque fue utilizado por
el mirror Jira `SST-102`.

La iniciativa no autoriza cambios funcionales. Agrupa resultados y exige que
cada cambio futuro avance por un request owner-scoped.

## Alcance

- lineas base de tests por owner;
- journeys criticos de integracion y E2E;
- QA visual manual liderado por Brenda;
- intake, triage y retest de defectos;
- prevencion de falsos positivos entre Docker, Kubernetes, HTTP, UI y tests.

## Recuperacion historica

La rama no canonica preservada contiene cuatro labels que no pueden promoverse:

| Label historico | Disposicion |
| --- | --- |
| `CR-SST-0177` | Reemplazado como coordinador por `CR-SST-0222`. |
| `CR-SST-0210` | Nueva reserva retroactiva para infraestructura, sin repetir runtime. |
| `CR-SST-0211` | Nueva reserva retroactiva para contraste de `sst-fend`. |
| `CR-SST-0212` | Nueva reserva retroactiva para readiness de `sst-fend`. |

Los futuros IDs no se predicen ni reservan desde este documento. Cada slice
debe repetir el preflight global y publicar primero su intake minimo.

## Exclusiones

`robots.txt` y `llms.txt` no son requisitos de SST. Los hallazgos genericos de
Lighthouse relacionados con esos paths no amplian el producto ni forman parte
del ciclo de calidad.

## Autoridad

- ARDS/SDD local es source of truth para la iniciativa y sus CR.
- Jira es mirror operativo.
- Los repos hijos son autoridad de sus contratos, docs y tests.
- Un bug observado no autoriza implementacion.
