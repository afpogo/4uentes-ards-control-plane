# Resultados De Validacion

## Check Completo

Comando ejecutado el 2026-07-11:

```powershell
npm.cmd run check
```

Resultado: exit code `0`.

- catalog: `5 OK, 0 WARN, 0 FAIL`
- local bindings: `39 OK, 0 WARN, 0 FAIL`
- state model: `51 OK, 0 WARN, 0 FAIL`
- initiatives: `14 OK, 0 WARN, 0 FAIL`
- owner documentation: `59 OK, 0 WARN, 0 FAIL`

## Consistencia De Policy

La busqueda focalizada confirmo el mismo ID, clase, applicability y adoption
mode entre registry y state link. El indice referencia el documento humano y el
handoff figura como `pending-separate-core-promotion-request`.

## Revision Estatica

La busqueda de `runner`, `probe`, `gate`, `script`, `validator` y `automation`
en los artefactos de CR-CP-0007 encontro solamente declaraciones normativas que
prohiben incorporarlos o documentan su separacion. CR-CP-0007 no creo ni
modifico implementaciones ejecutables. El working tree contenia previamente
otros cambios no relacionados, que se preservaron.

## Casos Normativos

Se revisaron los siete casos de `normative-case-review.md`: degradacion de Rovo,
duplicado, señal Jira read-only, escritura fuera de lote, ejecucion desde child
repo, evidencia protegida y routing ARDS/SST derivado del request. Todos tienen
failure behavior explicito.

## Jira

La verificacion posterior confirmo un unico `ARDS-14`, tipo `Tarea`, proyecto
`ARDS`, parent `ARDS-1`, summary esperado, labels esperadas y estado `En curso`.
El lote quedo consumido sin comentarios, creaciones, cierre ni operaciones
adicionales.

## Correccion De Jerarquia Jira — 2026-07-12

Se incorporo `jira-cr-mirror-hierarchy-policy` como dependencia normativa
obligatoria del perfil Jira. Registry, state link, documento humano y plan
declaran:

- una Epic primaria por iniciativa activa que usa Jira;
- un Task o Subtask primario por CR seleccionado;
- Subtask solamente bajo una Task de la misma Epic;
- preflight de initiative, Epic, request, issue, project, type y parent;
- bloqueo y reconciliacion ante ausencia, ambiguedad, duplicado o parent
  inconsistente.

Se ejecuto nuevamente `npm.cmd run check`: exit code `0`, con `0 WARN` y
`0 FAIL` en todos los validadores. No se ejecuto ninguna operacion Jira porque
el lote externo de CR-CP-0007 ya estaba consumido.
