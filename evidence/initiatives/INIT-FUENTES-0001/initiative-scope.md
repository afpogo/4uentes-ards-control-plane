# INIT-FUENTES-0001 - Alcance

## Decision

Se crea la primera iniciativa 4UENTES no-SST como iniciativa paraguas:

- ID tecnico: `INIT-FUENTES-0001`
- Nombre de negocio/proyecto Jira recomendado: `4UENTES`
- Producto inicial: `Portfolio`
- Repo/producto: `4uentes-portfolio`

## Razonamiento

`4UENTES` debe funcionar como contenedor de negocio y tablero Jira para trabajo
no-SST. `Portfolio` es el primer producto dentro de ese contenedor, pero no
debe ser el nombre del proyecto Jira si en el futuro otras apps 4UENTES, como
Fulbito, van a convivir con su propio scope.

La separacion queda:

| Capa | Nombre | Rol |
| --- | --- | --- |
| Proyecto Jira / negocio | `4UENTES` | Agrupa productos no-SST. |
| Producto | `Portfolio` | Portafolio profesional y CV/publicacion. |
| Repo/servicio | `4uentes-portfolio` | Implementacion frontend del producto. |
| Control plane | `4uentes-orchestor` | Orquesta CRs, evidencia y estado. |

## Relacion Con INIT-PORTFOLIO-0001

`INIT-PORTFOLIO-0001` sigue siendo valida como iniciativa de readiness del
producto Portfolio. `INIT-FUENTES-0001` agrega una capa superior para ordenar:

- proyecto Jira 4UENTES;
- productos no-SST;
- cortes I18N y CV que pueden reutilizarse por el portfolio y futuros productos;
- frontera con SST.

## Cortes I18N Asociados

La iniciativa adopta los cortes:

- `CR-4UENTES-0022`: migrar cards de empresas a I18N.
- `CR-4UENTES-0023`: migrar iniciativas/logros a I18N.
- `CR-4UENTES-0024`: QA bilingue ES/EN.
- `CR-4UENTES-0025`: usar narrativa bilingue como base del CV sanitizado.

Estos cortes deben ejecutarse con request lifecycle antes de mutar el repo hijo.
