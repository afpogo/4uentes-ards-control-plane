# CR-SST-0193 - ResoluciÃ³n VÃ¡lida Del Preflight

Fecha: 2026-08-18

## ResoluciÃ³n

El binding local continÃºa apuntando al worktree real de Finanzas Personales.
No se usÃ³ snapshot, worktree alternativo ni excepciÃ³n para pasar el gate.

La topologÃ­a local fue reconciliada: el frontend standalone de HPT quedÃ³ como
identidad histÃ³rica `deprecated`, mientras el backend activo conserva su binding
y sus owner artifacts. El verificador fue reforzado para fallar si cualquier
servicio no deprecado desaparece del archivo de bindings.

## RegresiÃ³n

`npm run test:local-bindings`: PASS.

- omitir un servicio activo produce FAIL;
- omitir una identidad deprecada estÃ¡ permitido.

## Gate Completo

`npm run check`: PASS, 0 FAIL.

- catÃ¡logo: 5 OK;
- bindings: 41 OK, 4 WARN por diferencias SSH/HTTPS de remotes;
- state: 56 OK;
- initiatives: 20 OK;
- owner documentation: 109 OK;
- visual documentation: 10 mapas, 0 FAIL.

CR-SST-0193 puede retomar la creaciÃ³n de un worktree limpio de `sst-bend`.
El frente HPT queda pausado por indicaciÃ³n del usuario y no recibirÃ¡ mÃ¡s
cambios ni promociÃ³n durante esta ejecuciÃ³n SST.
