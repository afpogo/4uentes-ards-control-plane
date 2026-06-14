# Agent Architecture Boundary Policy

## Proposito

Definir limites de accion para agentes, subagentes y modelos rapidos cuando una
tarea toca arquitectura, ownership o contratos sensibles.

## Alcance

Aplica a cualquier trabajo agentico dentro del control-plane o repos que adopten
estas policies.

## Cuando aplica

- Al tocar estructura top-level, ownership, contratos cross-repo o baseline
  ARDS/SDD.
- Al tratar seguridad, autenticacion, autorizacion, RBAC o datos sensibles.
- Al cambiar runtime control plane o reglas de governance.
- Al delegar trabajo que podria cruzar limites arquitectonicos.

## Cuando no aplica

- No bloquea cambios documentales acotados que solo registran policy o evidencia.
- No bloquea correcciones mecanicas sin impacto contractual.
- No reemplaza decisiones humanas o requests ya aprobados.

## Reglas obligatorias

Ningun agente debe redefinir por su cuenta:

- estructura top-level;
- ownership;
- contratos cross-repo;
- baseline ARDS/SDD;
- arquitectura;
- seguridad;
- RBAC;
- datos sensibles;
- runtime control plane.

## Reglas recomendadas

- Registrar propuestas como drafts o follow-ups cuando el cambio excede scope.
- Separar documentacion de governance de contratos funcionales.
- Escalar a perfil de mayor razonamiento cuando haya impacto sensible.
- Mantener cambios pequenos y reversibles.

## Relacion con ARDS/SDD

Esta policy protege el modelo ARDS/SDD existente. Las policies operativas
complementan el stack, no redefinen su autoridad.

## Relacion con otras policies

- Restringe `agent-delegation-policy`.
- Puede elevar clasificacion en `agent-model-selection-policy`.
- Define bloqueo para `agent-resource-degradation-policy`.
- Informa subtareas en `agent-task-atomization-policy`.

## Ejemplos genericos

- Permitido: registrar una policy operativa provider-agnostic.
- No permitido: cambiar ownership cross-repo sin request aprobado.
- No permitido: redefinir reglas de auth o RBAC desde una subtarea rapida.

## Anti-patrones

- Usar governance agentica para cambiar contratos funcionales.
- Introducir nuevas carpetas top-level sin acuerdo del repo.
- Tratar un alias local como identidad canonica.
- Delegar decisiones de seguridad a perfiles rapidos.

## Criterios de fallback

- Si el cambio cruza boundary, registrar gap o request futuro.
- Si no hay aprobacion, no modificar repos hijos.
- Si el riesgo no puede evaluarse, declarar bloqueo o pedir decision humana.

## Definition of Done

- Los boundaries fueron respetados.
- Las propuestas fuera de scope quedaron como follow-up.
- No se modificaron contratos funcionales ni ownership sensible.
