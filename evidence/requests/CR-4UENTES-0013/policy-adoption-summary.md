# Adopcion De Policies En Repo Hijo - CR-4UENTES-0013

## Decision

`4uentes-portfolio` adopta localmente las policies operativas del
control-plane antes de continuar con cambios visibles de experiencia, contacto
o evidencia GitHub.

El repo hijo no redefine canon ARDS/SDD. Consume las policies desde
`4uentes-orchestor` y mantiene sus propios owner docs/specs como autoridad para
su frontend static portfolio.

## Policies Adoptadas

- `owner-documentation-authority-policy`
- `agent-context-management-policy`
- `agent-task-atomization-policy`
- `agent-resource-degradation-policy`
- `agent-delegation-policy`
- `agent-model-selection-policy`
- `agent-architecture-boundary-policy`
- `http-qa-harness-policy`

## Excepcion Registrada

`human-doc-language` se adopta con excepcion temporal porque existen documentos
humanos heredados en ingles. La regla queda activa para documentacion nueva o
modificada; la remediacion de legacy docs queda como follow-up trazable.

## Guardrails

- No se modifico UI ni runtime.
- No se modifico contacto publico.
- No se agrego fetching runtime GitHub.
- Las futuras mutaciones del portfolio deben actualizar owner docs o registrar
  excepcion antes de cierre local.
