# Worktree Request Lifecycle Policy

## Propósito

Definir cómo se crean, usan, recuperan, integran y retiran los worktrees Git
que participan en un lifecycle ARDS/SDD. La policy evita que una carpeta local,
una branch o un mirror Jira se confundan con la identidad canónica del request.

Su identificador normativo local es `worktree-request-lifecycle-policy`.
`4uentes-orchestor` es el origin repo de esta primera adopción. Convertirla en
una policy compartida de `4uentes-ards-core` requiere un request y un handoff
separados.

## Aplicabilidad

Aplica al control plane cuando una ejecución usa Git branches o worktrees para
planificar, implementar, validar, recuperar o publicar requests. No autoriza
por sí sola modificaciones de repositorios hijos, despliegues, escrituras Jira
ni eliminación de branches.

## Modelo de autoridad

| Elemento | Función | Autoridad |
| --- | --- | --- |
| Request `CR-...` | Identidad global de una intención | Lifecycle ARDS/SDD publicado |
| Branch | Historia de commits de esa ejecución | Git, mientras no contradiga el request canónico |
| Worktree | Checkout local de una branch | Ninguna autoridad de identidad propia |
| Jira | Mirror operativo | No reserva ni reasigna IDs locales |
| Ref remota canónica | Baseline publicada | Primera fuente para abrir trabajo nuevo |

Un path de worktree o un nombre de branch nunca reserva un request ID. Dos
worktrees pueden contener filenames iguales sin conflicto físico, pero dos
intenciones distintas con el mismo `CR-...` constituyen una colisión global.

## Ciclo obligatorio

```text
preflight global de identidad
        ↓
request inbox mínimo
        ↓
PR y merge de la reserva
        ↓
refresh de la ref remota canónica
        ↓
branch + worktree limpio
        ↓
implementación y evidencia
        ↓
checks + PR + merge
        ↓
readback de integración
        ↓
retiro controlado del worktree
```

Reglas obligatorias:

1. Antes de asignar un ID se inspeccionan el árbol canónico, refs relevantes,
   worktrees activos y mirrors externos aplicables.
2. La reserva comienza con un request `inbox` mínimo fusionado en la ref
   canónica. Crear solamente una branch o carpeta no es una reserva.
3. El worktree de ejecución se crea desde una ref remota refrescada después de
   la reserva.
4. Por defecto existe como máximo un worktree activo por combinación de request
   y repositorio físico. Una excepción debe declarar el motivo y el ownership
   de cada árbol.
5. Una conversación, agente, subagente, prueba o commit adicional no crea otro
   dominio de identidad ni justifica por sí solo un worktree nuevo.
6. Un worktree no mezcla requests no relacionados. Si el checkout ya contiene
   cambios ajenos, se preserva y se crea uno limpio.
7. Los checks del owner y del control plane se ejecutan antes de publicar o
   cerrar el lifecycle.
8. El retiro ocurre sólo después del readback de integración y nunca como
   mecanismo para resolver una colisión.

## Convención de nombres

La convención recomendada es:

```text
branch:   agent/cr-sst-0210-memory-identity-scope
worktree: worktrees/CR-SST-0210-memory-identity-scope
request:  requests/inbox/CR-SST-0210-memory-identity-scope.yaml
```

El nombre permite correlación humana, pero el campo `id` del request continúa
siendo la identidad normativa. No se crean jerarquías de carpetas por chat,
agente o sesión.

## Contrato de recuperación

Antes de mover, integrar o retirar un worktree se clasifica:

| Estado | Recuperación permitida | Retiro |
| --- | --- | --- |
| Limpio y fusionado | Ninguna extracción; Git remoto ya conserva el contenido | Permitido después de probar que HEAD es alcanzable desde la ref canónica y que ningún proceso lo usa |
| Limpio con commits no fusionados | Merge, rebase no destructivo o cherry-pick/port selectivo según el request | Prohibido hasta integrar, superseder o preservar explícitamente la branch |
| Cambios sin commit | Portar archivos válidos a un worktree limpio, corregir IDs, commitear y validar | Prohibido mientras exista información única sólo en disco |
| Cambios mezclados o autoridad ambigua | Cuarentena; inventario y extracción por unidades auditables | Prohibido hasta resolver cada unidad |

Recuperar no significa fusionar el worktree completo. Se puede portar un
request, evidencia o commit específico preservando la procedencia. Un estado
`done` no se adopta cuando coexiste con `running` o carece de evidencia válida.

## Integración y precedencia

Cuando aparecen representaciones incompatibles se usa esta precedencia:

1. árbol publicado en la ref remota canónica;
2. lifecycle y evidencia commiteados en una branch;
3. artefactos no trackeados en un worktree;
4. mirror externo como Jira.

La cronología es evidencia auxiliar y no reemplaza la autoridad. Una colisión
compatible puede consolidarse en un slug canónico sin reescribir historia. Una
colisión incompatible requiere renumeración documentada y, si existe mirror,
un lote externo separado y autorizado.

## Retiro controlado

Antes de retirar un worktree debe existir evidencia de:

- path y branch exactos;
- `git status` limpio;
- estado de commits frente a la ref canónica;
- contenido integrado, supersedido o preservado en una branch;
- ausencia de procesos, mounts o servicios que dependan de ese path;
- autorización para cualquier borrado de branch, que es independiente del
  retiro del worktree.

`git worktree remove` no debe ejecutarse sobre un árbol dirty, ambiguo o usado
por runtime. La limpieza automática masiva está prohibida.

## Enforcement

- `scripts/verify-request-identities.js` bloquea colisiones dentro del árbol de
  merge y se ejecuta al inicio de `npm run check`.
- `scripts/verify-worktree-request-lifecycle-policy.js` comprueba que esta
  policy, su registro, discovery y wiring permanezcan vigentes.
- El preflight sobre refs, worktrees y mirrors externos es una revisión
  operacional con evidencia; no se ejecuta destructivamente desde CI.
- La protección de branch debe tratar el full check como required check antes
  de aceptar una segunda reserva concurrente.

## Failure behavior

- ID ya observado: bloquear la reserva y reconciliar.
- Worktree dirty con cambios ajenos: preservar y abrir uno limpio.
- Información sólo sin commit: bloquear retiro.
- Commits no integrados: bloquear retiro salvo preservación o supersesión
  explícita.
- `running` y `done` simultáneos: bloquear adopción del cierre.
- Jira sin lifecycle local: intake read-only.
- Base remota no refrescada: bloquear inicio de ejecución.
- Incertidumbre sobre un proceso que usa el path: no retirar el worktree.

## Relación con otras policies

- `work-tracker-control-plane-authority-policy`: Jira sigue siendo mirror.
- `agent-context-management-policy`: reutiliza inventarios vigentes y evita
  reabrir todo el repositorio.
- `agent-architecture-boundary-policy`: recuperar contenido no amplía la
  autorización sobre repositorios hijos.
- `owner-documentation-authority-policy`: la integración debe conservar la
  documentación del owner cuando hubo mutación funcional.

## Definition of Done

- El request fue reservado antes de abrir ejecución paralela.
- Branch, worktree, request e iniciativa pueden correlacionarse sin ambigüedad.
- No existe una segunda intención bajo el mismo ID.
- Toda información única fue commiteada, integrada o preservada antes del
  retiro.
- Los checks requeridos y el readback de integración están registrados.
- El worktree retirado estaba limpio y no era dependencia de un proceso.
- Los mirrors externos reflejan el lifecycle o quedan registrados como
  reconciliación pendiente sin modificar autoridad local.
