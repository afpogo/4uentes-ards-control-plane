# CR-HPT-0002 — autorización y alcance reconciliado

Fecha: 2026-08-22

El usuario autorizó continuar. La revisión de prerequisitos para CR-HPT-0008
detectó que CR-HPT-0002 permanecía en `planned`, aunque CR-HPT-0011/0012 ya
habían satisfecho parte de su alcance.

Este corte queda limitado a:

- adoptar `control_plane_link` en el backend owner;
- reconciliar binding, source map, policy manifests e índices;
- agregar el archivo `.http` exigido por `http-qa-harness-policy`;
- conservar el smoke Python como automatización complementaria;
- actualizar catálogo y state del control plane con evidencia real;
- validar y commitear sólo los archivos permitidos.

No autoriza endpoints financieros, cambios de dependencias, persistencia,
migraciones, auth SST, infraestructura, OCR ni IA.
