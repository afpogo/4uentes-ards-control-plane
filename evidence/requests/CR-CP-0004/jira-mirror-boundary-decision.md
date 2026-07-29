# CR-CP-0004 / ARDS-5 - Decision De Frontera Jira Mirror

## Decision

Jira es mirror operativo. ARDS/SDD mantiene la fuente de verdad.

El modelo reusable de Initiative puede declarar tracking Jira, pero debe
mantener `source_of_truth: false`.

## Regla De Jerarquia

```text
Initiative -> Jira Epic
CR         -> Jira Task / Story / Subtask bajo la Epic de la Initiative
```

Una Epic relacionada o paraguas puede existir, pero no reemplaza la Epic propia
de la Initiative.

## Implicacion Para Core

El core debe definir campos genericos para tracking Jira sin importar keys
concretas:

- `role`;
- `source_of_truth`;
- `project_key`;
- `issue_type`;
- `issue_key`;
- `related_epic_key`;
- `associated_issue_keys`;
- refs de sync/evidence.

El core no debe incluir issue keys locales como canon.

## Enforcement Futuro

El runtime de enforcement deberia poder auditar:

- toda `Initiative` con Jira mirror usa issue type `Epic`;
- todo CR bajo esa Initiative referencia la `epic_key` correcta;
- Jira no queda declarado como source of truth;
- las correcciones de jerarquia quedan en evidencia.
