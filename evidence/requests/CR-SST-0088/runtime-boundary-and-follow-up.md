# CR-SST-0088 - Limite Runtime Y Seguimiento

## Alcance De Este CR

`CR-SST-0088` es un CR de diseno y limite local del control-plane para
`INIT-SST-0001` y `SST-6`.

No implementa runtime, no toca repos hijos, no escribe Jira y no persiste
contenido.

## Estado Local Preservado

`state/features/learning-content-tags.current.yaml` conserva
`status: implemented-local`.

Este CR no promueve `learning-content-tags` a `validated-live`, no modifica su
lista de servicios afectados y no agrega evidencia runtime al artefacto de
estado de feature.

## Primer Runtime Posterior

El primer runtime posterior debe abrirse como `CR-SST-0089`.

Limite propuesto para `CR-SST-0089`:

- repo objetivo: `sst-bend`;
- entrada: course manifest o web article payload;
- salida: `KnowledgeDocument`, `ContentBlock[]`, `TagSuggestion[]`,
  `warnings[]`;
- persistencia: `preview-only` por defecto;
- requisito: plan aprobado antes de mutar repos hijos.

## Reglas De No Promocion

Este CR no autoriza:

- scraping masivo;
- import persisted por defecto;
- publicacion automatica;
- creacion automatica de `TagDefinition`;
- cierre Jira;
- cambios en `sst-bend`, `sst-fend`, `sst-extension`, `4uentes-auth` o repos
  de infraestructura.

## Jira

Jira se trata como mirror, no como source of truth. La evidencia local previa
de `CR-SST-0087` registra bloqueo MCP `403` por app no instalada. En este CR no
se ejecutan reads ni writes contra Jira.
