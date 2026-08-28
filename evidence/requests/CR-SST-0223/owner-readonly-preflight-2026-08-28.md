# Preflight read-only del owner sst-bend

## Baseline observado

- La integración funcional reciente usa `develop`; los últimos PRs owner, incluido CR-SST-0218, fueron fusionados contra esa rama.
- El checkout local existente está dirty y mezcla cambios ajenos de secrets y Phinance. No se reutilizará ni modificará.
- Si se autoriza ejecución, deberá crearse un worktree owner limpio desde `origin/develop` refrescado y una branch exclusiva de `CR-SST-0223`.
- `npm run check` es el gate owner obligatorio y no levanta servicios ni ejecuta migraciones automáticamente.

## Runtime que debe reconciliarse

El owner ya contiene:

- `document_agent_jobs`, con scope por cuenta, idempotencia, estado, snapshot JSON y endpoints `/articulos/:id/agent-jobs`;
- un `DocumentAgentService` determinístico que produce `article_documents.type=agent_summary`;
- `ArticleDocumentService` y un port de AI, aunque `processing.ai` sigue rechazado por el contrato HTTP activo;
- autorización JWT, resolución de cuenta activa y membership en Bend;
- `article_documents.summary`, que no implementa por sí mismo revisión editorial ni separación de memoria.

## Decisión de preparación

No se propone duplicar el agregado existente. El plan owner debe evolucionar `document_agent_jobs` como representación física compatible de `DERIVATION_RUN`, preservar los endpoints legacy mediante adaptación y agregar las entidades normalizadas que faltan. `agent_summary` permanece como proyección de compatibilidad; no será la autoridad de `ARTICLE_SUMMARY`.

## Límites

Esta inspección fue exclusivamente de lectura. No se alteraron branches, worktrees, archivos, dependencias, base de datos, servicios ni datos del owner.
