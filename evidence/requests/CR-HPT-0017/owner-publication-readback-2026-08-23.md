# CR-HPT-0017 - Readback De Publicación Owner

Fecha: 2026-08-23.

El PR owner [mena28/finanzas-personales#3](https://github.com/mena28/finanzas-personales/pull/3)
fue fusionado a `main` el 2026-08-23. El readback remoto devolvió
`c81e11467de0901b90a88a41e1759fbc034b9ca7` para `refs/heads/main`.

El merge tiene como padres el baseline owner `9f781e7` y el commit publicado
`9f50d13`. El listado remoto confirma los ocho archivos esperados: contrato,
documentación, dependencia, verificador, adapter, checks y tests. No contiene
archivos fuera del alcance aprobado.

El PR no tenía checks remotos configurados. La integración se realizó después
de verificar localmente 36 tests, el check contractual, `pip check` y el diff.
El proxy SST continúa deshabilitado y requiere otro lifecycle con QA integrada.
