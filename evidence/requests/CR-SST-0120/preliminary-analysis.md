# CR-SST-0120 - Preliminary analysis

## Estado

- Fecha: 2026-07-04
- Request: `CR-SST-0120`
- Jira: `SST-50`
- Epic: `SST-29`
- Decision: iniciar como contrato cross-repo; no implementar en todos los repos
  hasta cerrar owner boundary.

## Intencion

Definir un contrato reutilizable para preview visual de articulos SST creados
desde:

- URL fuente;
- imagen/foto provista;
- captura de `sst-extension`;
- PDF textual o articulo de texto derivado de una web.

## Observaciones

- `sst-extension` ya produce:
  - URL fuente.
  - PDF visual o PDF textual.
  - metadata local `outcome`, `captureMode`, `warnings`.
- `sst-fend` ya tiene dominio `articles` y documentacion de preview/listado en
  `specs/33-articles-frontend.yml` y `docs/33-articles-frontend.md`.
- El contrato no debe vivir solo en control-plane:
  - productor: `sst-extension` si genera thumbnail o metadata outbound.
  - BFF: `node-auth` si ingiere/persiste preview metadata.
  - consumidor: `sst-fend` si renderiza `available/pending/unavailable`.

## Patron Base

Referencia: `evidence/requests/CR-SST-0120/preview-image-design-pattern.md`.

Contrato propuesto:

- `ArticlePreviewRequest`
- `ArticlePreviewResult`
- `status`: `available | unavailable | pending | rejected`
- `source`: `provided-image | producer-thumbnail | url-og-image | url-favicon | generated-screenshot | generated-placeholder | none`
- `reason`: razon gobernada cuando no existe preview segura.

## Boundary Inicial

- Este CR puede empezar sin mutar repos hijos hasta seleccionar owner boundary.
- Cualquier mutacion posterior en `sst-extension`, `node-auth` o `sst-fend`
  requiere owner docs en ese repo.
- No se deben persistir screenshots privadas sin politica explicita.
- No se debe resolver URL privada server-side usando secretos hasta tener
  contrato de autenticacion/consentimiento.

## Plan De Arranque

1. Formalizar el contrato en ARDS/SDD y Jira.
2. Decidir owner boundary:
   - productor local en `sst-extension`;
   - ingestion/persistencia en `node-auth`;
   - render/degradacion en `sst-fend`.
3. Dividir implementacion si el contrato toca varios repos:
   - productor preview metadata;
   - BFF/adaptacion de payload;
   - frontend render y fallback.
4. Mantener `SST-49` separado: modo de captura no implica preview resuelta.

## Riesgos

- Guardar preview privada sin consentimiento.
- Duplicar algoritmos entre extension y frontend.
- Forzar `sst-fend` a inferir preview desde campos no gobernados.
- Mezclar metadata publica de URL con captura privada sin provenance.

## Recomendacion

Arrancar `SST-50` como contrato y design gate. Implementar primero una interfaz
comun y un resultado `preview_unavailable_reason`; luego agregar productores de
imagen en slices separados.
