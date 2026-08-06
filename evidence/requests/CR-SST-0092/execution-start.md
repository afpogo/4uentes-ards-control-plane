# CR-SST-0092 - Inicio De Ejecucion

## Contexto

`CR-SST-0092` ejecuta el primer slice runtime de `LearningWorkspace` en
`sst-bend`.

La request se apoya en:

- `CR-SST-0090`: boundary de `LearningWorkspace`;
- `CR-SST-0091`: readiness, discovery y file plan de `sst-bend`;
- `INIT-SST-0001`: epic Jira `SST-27` en curso.

## Scope

Permitido:

- modificar `sst-bend`;
- agregar migration/modelos/usecases/routes/tests;
- registrar evidencia de ejecucion en el control-plane.

No permitido:

- modificar `sst-chatbot`;
- modificar `sst-fend`;
- modificar `4uentes-auth`;
- crear `TagDefinition` automaticamente;
- permitir recall durable desde preview no aprobado;
- clonar ARDS/SDD por usuario.

## Jira

- Epic: `SST-27`
- Task de ejecucion: `SST-28`

## Nota Sobre Worktree

`sst-bend` ya tenia cambios dirty no relacionados durante el discovery de
`CR-SST-0091`. La implementacion debe trabajar con esos cambios sin revertirlos.
