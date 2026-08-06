# CR-SST-0134 - aceptación de cierre con residual gobernado

Fecha: 2026-08-02  
Decisor: 4uentes  
Estado: cierre local aprobado

## Evidencia aceptada

La persona completó el QA manual autenticado sobre los artículos visibles en
su sesión y confirmó que pudo clasificarlos. La revalidación agregada posterior
observó cinco decisiones persistidas, cero mismatches entre `kind` y
`payload_kind`, y 18 artículos históricos sin payload que la cuenta de QA no
expuso.

Los 18 pendientes están distribuidos en cuatro buckets anónimos de owner. La
evidencia permite afirmar que pertenecen a otras cuentas o scopes de acceso;
no permite identificar personas ni autoriza acceder a sus datos.

## Decisión de governance

Se acepta como concluida la validación funcional de la ruta manual. Los 18
artículos no visibles se registran como residual histórico gobernado y no como
falla de la funcionalidad validada.

Este cierre:

- no reclasifica registros automáticamente;
- no deriva el kind desde URL, filtro, transporte o preview;
- no accede a contenido ni identificadores de otras cuentas;
- no declara que el inventario histórico global sea cero;
- no declara publicación ni estado `released`.

La reapertura futura sólo corresponde si existe autoridad humana sobre un
artículo residual concreto o si aparece una inconsistencia nueva en el
contrato semántico.

## Lote Jira autorizado

- SST-64: comentario sanitizado y transición de `En curso` a `Listo`.
- SST-58: comentario agregado de cierre; ya se encuentra en `Listo`.
- SST-57: comentario sanitizado y transición de `En curso` a `Listo`.
- SST-67 queda explícitamente fuera del lote.

## Resultado Jira

- SST-64: comentario `10304`; transición `41`; estado observado
  `Finalizada` / `Listo`.
- SST-58: comentario agregado `10305`; permaneció `Finalizada` / `Listo`.
- SST-57: comentario `10306`; transición `41`; estado observado
  `Finalizada` / `Listo`.
- La consulta posterior a SST-64 observó cero Subtasks abiertas bajo SST-58.
- SST-67 no fue comentado ni transicionado.
