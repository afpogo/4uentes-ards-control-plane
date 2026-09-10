# Merge y promoción de la adopción BFF

Owner documental: control plane. Rol: evidencia de ejecución CR-SST-0235.
El usuario autorizó «ok autorizo fusionar y continuar», informado de que el
merge dispara publicación de imagen y actualización automática de Infra.

## Merge comprobado

- Repo owner: `afpogo/4uentes-auth`.
- PR: https://github.com/afpogo/4uentes-auth/pull/16.
- Head aprobado: `25f4abc7466c0c08c90ce84841ef624391bd96c5`.
- Preflight: MERGEABLE, check build-publish-update SUCCESS.
- Merge: `d9263d1801963047eb01a1956b2a5ee54244a12f`.
- Fecha GitHub: `2026-09-09T04:35:03Z`.
- Pipeline push: `34311533508`.
- Imagen esperada: `ghcr.io/afpogo/4uentes-auth:develop-d9263d180196`.

El merge se ejecutó condicionado al head aprobado. Se refrescó develop owner y
se integró main del control plane sin conflictos, conservando trabajo ajeno.

## Límites y siguiente gate

La publicación del BFF no prueba la UX de importación. Esa adopción corresponde
a CR-SST-0236; la prueba integrada corresponde a CR-SST-0237. No hubo seeders,
consultas de contenido de negocio, escrituras directas de DB ni cambios Jira.
No se ejecutaron preview/accept/reject en el entorno compartido.

El pipeline Auth terminó SUCCESS y publicó la imagen esperada. Infra recibió
commit `aff832fc82c2ca32c20d34855d73c2ffb194ed0c`; sus cuatro validaciones
GitOps/ARDS terminaron SUCCESS. En el primer readback el cluster aún ejecutaba
la imagen anterior y Argo conservaba la revisión e050fd0: promoción de artefactos
confirmada, convergencia live pendiente. El check completo del control plane
pasó con 0 fallos después de integrar main.

Readback posterior: Argo reconcilió a las `2026-09-09T04:38:41Z`, detectó
la revisión Infra `35891be72a37bbfdf7615f9632289df3161f0f77` y pasó a
`OutOfSync/Healthy`, operación `Running`, esperando el hook automático
`batch/Job/sst-bend-migrations` (1 activo). El agente no ejecutó ni reintentó
migraciones. Esta observación no demuestra ausencia de escrituras realizadas
por automatismos del entorno; el límite comprobable es que no hubo escrituras
directas de DB ni ejecución manual de migraciones por este agente.

El readback final del `2026-09-10` confirmó Argo `Synced/Healthy`, operación
`Succeeded`, en revisión `755c6eb9b91c1055b1189487e34bff211a857fee`.
`node-auth` quedó disponible `1/1` con la imagen
`develop-d9263d180196` y digest
`sha256:f6228d826b9fec04e7df39fd56515c9d281b371be726404103456b2aa38fbf5e`.
Mediante un port-forward efímero, los GET sin credenciales a `/me` y
`/context` devolvieron `401`; no se enviaron tokens ni se invocaron operaciones
de preview, accept o reject. Esto comprueba despliegue y boundary negativo, no
reemplaza la QA positiva autenticada ni la validación E2E de CR-SST-0237.

## Preparación del siguiente gate

CR-SST-0236 conserva su plan publicado; no se inicia código Fend en este gate.
Sus entregables son la bandeja de fuentes (texto, artículo, documento y salida
de agente), revisión de identidad/procedencia/frescura del snapshot y estados
de error accionables. Tags, preparación de artículo y propuesta de memoria
deben permanecer como decisiones independientes. Los valores secretos quedan
fuera de V1 y del estado del navegador.

Antes de modificar Fend corresponde publicar su lifecycle running con el
readback del predecesor, alcance owner, playbook UX, mapa Mermaid con fallback
textual y runbook QA. La QA manual será mediante Chrome DevTools MCP
independiente, sin seeders ni escrituras de DB; cualquier prueba que persista
contenido requiere resolver explícitamente esa restricción. La QA positiva
integrada de CR-SST-0237 no queda aprobada por el merge del BFF.
