# Implementación owner del relay Learning

Owner: `4uentes-auth`. Rol: evidencia de ejecución. Request: CR-SST-0235.
Autorización: «listo pr fusionado. continuemos», después del running PR #281,
merge `75cab7844fc5bb0518b8f384d596efeaeb9b55c1` verificado en GitHub.

## Alcance realizado

Se creó un checkout aislado desde develop `ff5605c`. La evolución conserva el
relay existente y adopta capability Learning 1.2.0. No resuelve fuentes ni
persiste snapshots en Auth. Sanitiza errores HTTP mediante mensajes públicos
según status; no copia body/stack ni headers upstream. Redirects no se siguen;
red y redirects se reportan como 502, timeouts como 504. Requests siguen sujetos
al límite JSON existente (default 1mb).

Rutas owner modificadas:

- `src/infrastructure/datasources/learning-workspaces.datasource.impl.ts`;
- `scripts/test-learning-source-relay.js` y `package.json` (postcheck);
- `specs/integrations-api.yaml`;
- capabilities inbound/outbound `learning-workspace-context` y guías derivadas;
- `docs/bf/06-integrations-api.md`;
- `docs/bf/learning-source-relay-runbook.md`, incluyendo mapa Mermaid y fallback.

## Validación

`npm run check` owner completo pasó, incluido postcheck Learning. La prueba
ejercita rutas/controllers/repositorio/adapter reales con autenticación y
transporte simulados, puerto local efímero y datos en memoria. Cubre tres tipos
de descriptor, snapshot sin transformación, compatibilidad de texto, remoción
de auxiliares del middleware, contexto de cuenta, cinco rutas, 204, errores
HTTP y transporte, timeout y rechazo 413 antes del upstream.

No prueba JWT real ni autorización de fuentes de Bend; esas responsabilidades
siguen en sus owners. No hubo llamadas a SST compartido, Mongo o PostgreSQL,
seeders, cambios de datos ni despliegues. El check completo del control plane
también pasó durante la ejecución; se repite antes de publicar evidencia final.

## Publicación y límites

Commit owner local: `25f4abc`, rama `agent/cr-sst-0235-learning-source-relay`.
La revisión automática rechazó su push a `afpogo/4uentes-auth` por considerar
no explícitos el destino y payload autorizados. No se reintentó por otro
transporte. La publicación quedó pendiente de confirmación en ese punto.

### Publicación autorizada y realizada

El usuario respondió «ok autorizo siguiente paso» a la propuesta explícita de
publicar `25f4abc` en `afpogo/4uentes-auth`, rama
`agent/cr-sst-0235-learning-source-relay`, y abrir PR contra develop sin merge.
El push pasó y se abrió PR #16: https://github.com/afpogo/4uentes-auth/pull/16.
GitHub confirmó HEAD `25f4abc7466c0c08c90ce84841ef624391bd96c5`, estado OPEN
y MERGEABLE. El check build-publish-update estaba en ejecución al primer readback.

El PR owner apunta a develop. Su workflow de PR valida y construye la
imagen; el push a develop después de un futuro merge publica imagen y actualiza
Infra automáticamente. Por ese efecto, este gate no fusiona el PR owner.
La QA de persistencia y E2E continúa pendiente; tampoco cambia Jira.
