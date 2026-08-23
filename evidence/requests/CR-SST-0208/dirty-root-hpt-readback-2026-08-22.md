# CR-SST-0208 - Readback HPT de la raíz dirty

Fecha: 2026-08-22.

## Resultado

La branch física `agent/cr-sst-0152-sst-fend-evidence` de la raíz del control
plane conserva ocho commits HPT no publicados. `git cherry origin/main HEAD`
marca los ocho con `+`: ninguno tiene un patch equivalente integrado. La
branch está ocho commits adelante y 85 detrás de `origin/main`.

No se hizo cherry-pick, merge, rebase ni push. El nombre heredado de la branch
no representa el contenido HPT y no debe convertirse en identidad canónica.

## Secuencia observada

| Commit | Intención |
| --- | --- |
| `5e6e19d` | Gobernar el baseline de la API Python Phinance; introduce `INIT-HPT-0002`, `INIT-HPT-0003` y lifecycles HPT adicionales. |
| `049c0d3` | Registrar cierre de los baselines owner `CR-HPT-0003` y `CR-HPT-0011`. |
| `22ca50f` | Registrar el scaffold FastAPI bajo `CR-HPT-0012`. |
| `8800a3c` | Aprobar el contrato de recursos cotidianos de `CR-HPT-0005`. |
| `7ad8d9a` | Registrar cierre de adopción de gobernanza `CR-HPT-0002`. |
| `27c2ffe` | Planificar el slice de API `CR-HPT-0008`. |
| `83bc374` | Registrar cierre del slice `CR-HPT-0008`. |
| `08af86a` | Planificar trusted principal context v1 como `CR-HPT-0013`. |

Los commits usan `CR-HPT-0005`, `0006`, `0008`, `0011`, `0012`, `0013` e
`INIT-HPT-0002`/`0003`. La búsqueda all-refs no encontró otra publicación de
esas identidades fuera de esta secuencia; esto es un preflight, no una reserva
definitiva ni una validación contra el canon actual.

## Dependencia sin commit

La iniciativa `INIT-HPT-0002` tiene un cambio adicional sin commit. Ese cambio
vincula el plan local `CR-SST-0207` para una fachada SST-Phinance. El ID
`CR-SST-0207` ya está reservado canónicamente por el QA integrado de retención
de chat, por lo que el hunk local es incompatible y no se puede portar.

Los archivos inbox/planned locales de la fachada también deben permanecer
fuera de cualquier recuperación HPT hasta recibir una identidad libre y un
lifecycle separado. No se infiere ni reserva un reemplazo en este readback.

## Por qué no se reproducen los commits completos

La primera revisión también modifica catálogo, solution map, local binding
example, estado y el validador de bindings. El check de la raíz antigua falla
en el self-test de `verify-local-bindings`, mientras que `origin/main` contiene
85 commits posteriores y nuevas reglas de identidad, worktrees, owner docs y
políticas. Reproducir la secuencia completa podría reintroducir un validador
obsoleto o sobrescribir decisiones canónicas.

## Disposición

El bloque HPT es recuperable, pero sólo mediante port selectivo sobre una base
limpia y bajo un lifecycle HPT/control-plane propio:

1. reservar las identidades HPT contra `origin/main` actualizado;
2. portar lifecycles, iniciativas y evidencia por request, no por commit
   histórico completo;
3. reconciliar catálogo, solution y state contra sus versiones actuales;
4. excluir `.pnpm-store/`, `.sst7-local-deploy/`, `worktrees/` y todo el plan
   colisionado `CR-SST-0207`;
5. ejecutar el gate completo y el owner-documentation validator;
6. conservar la raíz dirty hasta que el readback de publicación confirme que
   no queda intención HPT única.

Este movimiento no autoriza nuevas mutaciones de los repositorios Phinance ni
SST. Los cierres owner descritos son hechos históricos a reconciliar, no una
nueva autorización de ejecución.
