# Bloqueo de proveedor de CR-HPT-0024

Fecha: 2026-08-28

## Resultado

El gate se detuvo antes de crear un worktree o modificar
`sst-4uentes-infra`. La combinación pedida no puede materializarse de forma
responsable con los artefactos oficiales disponibles y la autorización actual.

La documentación oficial recomienda MinIO KMS para despliegues nuevos de
AIStor y publica las imágenes requeridas en el registry de AIStor. Sin embargo,
el repositorio comunitario oficial declara que MinIO Community se distribuye
ahora sólo como código fuente y que los binarios históricos ya no se mantienen.
Además, KES aparece como camino legacy y su repositorio público está archivado.
No existe en el alcance una licencia AIStor aceptada ni acceso al registry que
permita fijar por digest MinIO Server y MinIO KMS compatibles.

ClamAV sí mantiene imágenes oficiales, pero ese dato no resuelve el bloqueo de
storage/KMS. Conforme al plan aprobado, no se sustituyó silenciosamente MinIO
KMS por KES, una static key u otro backend.

## Fuentes oficiales

- https://docs.min.io/aistor/installation/kubernetes/server-side-encryption/
- https://docs.min.io/aistor/installation/kubernetes/install/
- https://github.com/minio/minio/blob/master/README.md
- https://github.com/minio/kes
- https://docs.clamav.net/manual/Installing/Docker.html

## Condición para reanudar

Se necesita una licencia/entitlement AIStor y acceso al registry para resolver
digests compatibles, o una nueva decisión gobernada que autorice otro proveedor
y su análisis de licencia, migración y operación. Ninguna credencial o secreto
fue solicitado ni registrado.
