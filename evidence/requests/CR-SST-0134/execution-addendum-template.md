# Addendum De Ejecución CR-SST-0134

Estado: no aprobado.

Antes de cualquier mutación se debe completar:

1. Manifest de artículos con identificador, cuenta, kind propuesto y evidencia
   autoritativa por fila.
2. Export/backup verificable de `articulos`, `article_payloads`,
   `filter_articulos` y documentos relacionados.
3. SQL de dry-run que demuestre el conjunto exacto y rechace filas cambiadas
   desde el inventario.
4. Inserción idempotente de payloads; nunca derivar desde URL, filtro,
   transporte, preview o node.
5. Rollback que elimine exclusivamente los payloads insertados por el manifest.
6. Aprobación humana explícita y ventana de ejecución.

Sin esos seis puntos, `CR-SST-0134` permanece abierto y Jira no puede pasar a
`Listo`.
