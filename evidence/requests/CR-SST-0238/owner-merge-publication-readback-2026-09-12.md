# Readback de merge owner y publicación de CR-SST-0238

Fecha local: 2026-09-12. Estado resultante: `running`.

## Cambio externo observado

Durante el preflight del gate siguiente se observó que el PR owner
[sst-fend#20](https://github.com/afpogo/sst-fend/pull/20) ya había sido
fusionado externamente. El agente no ejecutó ese merge y no intentó repetirlo.

El readback remoto confirmó:

- base original `develop@d1e9ef5e578220ea666d033c05ba2cccb1bb7e8e`;
- head owner `1631dc275aebcde6e394951a67704e6b87ec9aa4`;
- merge UTC `2026-09-13T01:22:44Z`;
- commit resultante `f0b584b61c67f4df7403595a58058ae5b033c102`;
- `origin/develop` apuntando al mismo commit de merge.

Esta evidencia complementa, sin reescribir, el resultado anterior que había
cerrado con el PR abierto. Jira no fue modificado durante este readback.

## Publicación automatizada

El push a `develop` disparó el workflow
[run 34730374750](https://github.com/afpogo/sst-fend/actions/runs/34730374750)
sobre el SHA exacto del merge. El job `build-publish-update` terminó
`success`.

El readback de pasos confirmó que se ejecutaron correctamente:

1. check completo del repositorio y build de frontend;
2. login a GHCR;
3. build y publicación de la imagen;
4. checkout de `sst-4uentes-infra`;
5. actualización del tag de imagen en GitOps.

La imagen publicada para este merge es
`ghcr.io/afpogo/sst-fend:develop-f0b584b61c67`, junto con el tag móvil
`develop` definido por el workflow.

## Readback GitOps

El historial remoto de `sst-4uentes-infra/develop` confirmó el commit
`7cd6f9ff77c0c0834c5f268532d96279927d9c8e`, con el cambio de
`afpogo/sst-fend` al tag inmutable `develop-f0b584b61c67`.

Este resultado demuestra publicación y actualización declarativa. No demuestra
por sí solo que el clúster local o remoto haya adoptado la revisión, que el pod
en ejecución use ese digest ni que la experiencia Landing → Login → Home sea
correcta.

## Controles de falso positivo y próximo gate

- Un workflow verde no sustituye el readback del recurso desplegado.
- Un overlay GitOps actualizado no prueba reconciliación del clúster.
- Un `200` en `localhost:4090` no prueba que esté sirviendo la imagen nueva.
- La consola debe observarse después de ejercer Landing, Login, navegación a
  Home y overlays que antes generaban warnings.
- No se deben usar credenciales reales ni persistir datos sensibles en la
  evidencia.

`CR-SST-0238` permanece `running` y `SST-131` permanece `En curso`. El próximo
gate requiere autorización explícita para un lote acotado de adopción en
desarrollo y QA browser sobre `localhost:4090`. No queda ninguna escritura Jira
autorizada y este readback no habilita cambios funcionales adicionales.
