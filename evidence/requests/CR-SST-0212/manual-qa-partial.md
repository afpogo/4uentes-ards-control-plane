# CR-SST-0212 — QA manual histórica parcial

Fecha de ejecución reportada: 2026-08-22.

Se observó `http://127.0.0.1:3005/4uentes/v1/phinance/docs/` con título
`SST Phinance API`, contrato OAS 3.1, servidor relativo
`/4uentes/v1/phinance`, seis paths owner, Swagger y OpenAPI con HTTP 200 y sin
la URL interna `:8766` en la proyección.

Una llamada sin credencial a
`/4uentes/v1/phinance/api/v1/household-resources` devolvió `401` con
`AUTH_UNAUTHORIZED`, por lo que no alcanzó el placeholder ni Phinance sin
atravesar autenticación SST.

La captura gráfica no completó. El snapshot de accesibilidad, la inspección de
red y las evaluaciones read-only sí finalizaron. Esta evidencia histórica se
recuperó de `a0665bf`; no se repitió QA runtime durante la reconciliación.
