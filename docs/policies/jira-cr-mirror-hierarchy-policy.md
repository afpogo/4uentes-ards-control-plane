# Politica De Jerarquia Jira Para Change Requests

## Proposito

Hacer obligatoria y verificable la correlacion entre el lifecycle ARDS/SDD y
su espejo operativo en Jira. Esta politica formaliza una practica ya usada por
el control-plane sin convertir Jira en fuente de verdad.

## Autoridad

El control-plane es autoridad para iniciativas, CRs, decisiones, dependencias,
scope y evidencia. Jira refleja esa informacion para coordinacion humana. Una
edicion en Jira nunca crea, aprueba, amplia ni cierra por si sola un CR.

## Jerarquia Obligatoria

La correspondencia normal es:

```text
Initiative ARDS/SDD <-> Epic Jira
CR de programa o feature <-> Tarea Jira bajo la Epic
CR ejecutable acotado <-> Tarea o Subtask Jira
```

Una Subtask debe tener una Tarea padre que pertenezca a la Epic de la
iniciativa. Una Tarea puede colgar directamente de la Epic cuando no existe un
contenedor de programa util. La eleccion debe registrarse en el request.

## Reglas Obligatorias

- Antes de crear un issue debe existir el CR en `requests/inbox/` y
  `requests/planned/`.
- Cada CR seleccionado para ejecucion tiene exactamente un issue Jira primario.
- Cada issue primario incluye el ID del CR en el summary y declara que Jira es
  mirror y el control-plane es source of truth.
- Cada iniciativa activa con trabajo Jira tiene exactamente una Epic primaria.
- Los repos owner, riesgos, checks, dependencias y estado nacen en el CR; Jira
  los resume, no los redefine.
- La metadata, tipos, duplicados, parent y transiciones se leen antes de escribir.
- Toda escritura requiere aprobacion humana vigente y evidencia sanitizada.
- Los cambios de estado se hacen primero en el lifecycle local y luego se
  sincronizan al mirror, salvo la transicion operacional a `En curso` que puede
  acompañar el inicio ya aprobado.
- `Listo` requiere cierre local validado. `released` requiere evidencia de
  publicacion; cerrar un CR no implica publicar.
- No se duplican issues existentes. Un CR historico en otra jerarquia se enlaza
  con `Relates` o se reparenta solo con decision y evidencia explicitas.
- Las dependencias entre CRs se reflejan con links Jira despues de estar
  declaradas localmente.
- Evidencia y comentarios no deben contener tokens, URLs privadas, cloud IDs,
  account IDs, correos ni datos de usuario.

## Tareas Y Subtasks

Usar `Tarea` cuando el CR sea una unidad independiente, cross-repo o un
contenedor de programa. Usar `Subtask` cuando el CR sea una unidad ejecutable
acotada y su Task padre represente el programa bajo la misma Epic. Una Subtask
no reemplaza la atomizacion ARDS/SDD: sigue necesitando su propio CR.

## Compatibilidad Con Issues Existentes

Un issue previo conserva su identidad. No se crea otro para acomodar una nueva
iniciativa. El control-plane registra la relacion y Jira usa links. Reparentar
es una mutacion independiente que requiere justificar impacto sobre la
trazabilidad anterior.

## Definition Of Done

- Initiative, Epic, CR e issue primario tienen correlacion uno-a-uno donde aplica.
- El request contiene las keys Jira observadas y `jira_source_of_truth: false`.
- La evidencia registra preflight, resultado de escritura y estado observado.
- Las dependencias locales importantes tienen mirror Jira sin invertir su sentido.
- `npm.cmd run check` pasa antes del cierre local.
