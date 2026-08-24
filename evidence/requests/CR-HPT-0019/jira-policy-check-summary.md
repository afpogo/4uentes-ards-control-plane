# Policy check Jira de CR-HPT-0019

Fecha: 2026-08-23.

## Resultado

- Resultado estructural: PASS.
- Project allowlist: sólo `HPT`.
- Issues existentes allowlist: sólo `HPT-5`.
- Create allowlist: una `Tarea` bajo `HPT-5` para `CR-HPT-0018`.
- Transición allowlist: id `41`, destino `Listo`, sólo dentro del create.
- Duplicados exactos observados: 0.
- Secret scan del payload: PASS.
- `blocked`: 1.
- Motivo: autorización exacta pendiente.

## Operaciones permitidas después de aprobación

1. `editJiraIssue` sobre la descripción de `HPT-5` con el cuerpo exacto del
   correction plan.
2. `createJiraIssue` de una `Tarea` con parent `HPT-5`, summary, descripción,
   labels y transición `41` exactos del correction plan.
3. Readback de HPT-5 y de la key creada.

No se permiten comentarios, links, borrados, reparenting, cambios de summary o
status de HPT-5 ni escrituras sobre HPT-6 u otro issue.

El PASS estructural no abre el writer: `blocked` debe cambiar a `0` mediante
evidencia de autorización explícita antes de cualquier write.
