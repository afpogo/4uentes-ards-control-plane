# Vista Por Proyecto

## Proposito

Esta seccion organiza la documentacion por negocio, producto o proyecto para
facilitar busqueda y lectura operativa.

No reemplaza las ubicaciones canonicas actuales de `apps/`, `cross-repo/`,
`requests/`, `platform/` y `policies/`. Es una vista de navegacion por scope.

La prosa humana en esta seccion debe seguir la policy
[human-doc-language](../policies/human-doc-language-policy.md): espanol para
Markdown humano, conservando IDs, comandos, paths y nombres tecnicos estables.

## Contenedores

- [4uentes/](4uentes/): activos publicos y portfolio bajo la solucion
  `4uentes`.
- [sst/](sst/): producto SST y sus repos, runtime, extension, tags,
  dictionary, learning workspace e infraestructura.
- [control-plane/](control-plane/): gobierno ARDS/SDD, lifecycle,
  validators, iniciativas, Jira mirror y politicas locales del orchestrator.
- [shared/](shared/): servicios o reglas compartidas que pueden ser consumidas
  por mas de una solucion.

## Regla De Uso

Cuando un documento pertenezca claramente a un negocio/proyecto, agregarlo al
contenedor correspondiente.

Si el documento es canonico en otra seccion, primero enlazarlo desde esta vista.
Mover archivos canonicos debe hacerse en un request separado, actualizando
referencias y validando con `npm.cmd run check`.
