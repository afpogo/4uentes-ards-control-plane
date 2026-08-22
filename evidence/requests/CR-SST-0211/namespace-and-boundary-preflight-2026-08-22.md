# CR-SST-0211 - Preflight de namespace y boundary BFF

Fecha observada: 2026-08-22.

## Resultado

`CR-SST-0211` es un candidato libre para reservar la adopción del contrato de
retención de chat en `4uentes-auth`. La reserva todavía no es canónica: según
`worktree-request-lifecycle-policy`, comienza únicamente cuando el request
`inbox` mínimo se fusiona en la ref remota canónica.

## Preflight de identidad

Se realizaron comprobaciones de sólo lectura sobre:

- el árbol `origin/main` en `8c37223`;
- el historial y las refs Git disponibles;
- los worktrees registrados del control plane;
- Jira `SST` mediante JQL por summary, description y label.

No se observó `CR-SST-0211` en esas superficies. `CR-SST-0210` no se reutiliza:
la reconciliación canónica de `CR-SST-0208` lo conserva como asignación
conceptual para identidad y scope de memoria bajo `INIT-SST-0010`.

## Gap de arquitectura observado

El contrato cerrado `CR-SST-0202` atomiza actualmente:

- `CR-SST-0204`: autoridad de retención, PostgreSQL y cache en `sst-bend`;
- `CR-SST-0205`: Redis de development en `sst-4uentes-infra`;
- `CR-SST-0206`: consentimiento visible en `sst-fend`;
- `CR-SST-0207`: QA integrado.

Sin embargo, `sst-fend` declara a `4uentes-auth` como BFF y no debe consumir la
API HTTP de `sst-bend` directamente. El facade observado publica create,
message history y delete, mientras el contrato nuevo requiere además list,
estado temporary/saved, promotion, finish temporal y delete durable con
semántica no ambigua.

Absorber esas rutas dentro de `CR-SST-0204` o `CR-SST-0206` cruzaría ownership.
El lifecycle separado propuesto conserva:

```text
sst-bend / CR-SST-0204
  -> capability outbound de retención
  -> 4uentes-auth / CR-SST-0211
  -> facade HTTP autenticado
  -> sst-fend / CR-SST-0206
```

## Policies aplicadas

- `agent-architecture-boundary-policy`: el BFF conserva su contrato owner.
- `owner-documentation-authority-policy`: Auth deberá publicar su adopción y
  documentación owner dentro de su propio lifecycle.
- `worktree-request-lifecycle-policy`: no se abre worktree de ejecución antes
  del merge de esta reserva mínima.
- `work-tracker-control-plane-authority-policy`: Jira permanece read-only y no
  reserva la identidad local.
- `jira-cr-mirror-hierarchy-policy`: cualquier mirror futuro necesitará un
  issue primario y un lote enumerado separados.

## Límites de esta pasada

- No se modificó `4uentes-auth`, `sst-bend`, `sst-fend` ni infraestructura.
- No se creó branch o worktree de ejecución para `CR-SST-0211`.
- No se creó, editó, comentó, enlazó ni transicionó ningún issue Jira.
- No se aprobó todavía la ejecución de `CR-SST-0204` ni `CR-SST-0211`.

## Siguiente gate

Fusionar el inbox mínimo en la ref canónica, refrescar `origin/main` y recién
entonces crear el worktree limpio de planificación `CR-SST-0211`. La fase
planned deberá corregir las dependencias de `CR-SST-0206` y `CR-SST-0207`,
enumerar superficies owner de Auth y definir la validación BFF sin ampliar
scope de producción.
