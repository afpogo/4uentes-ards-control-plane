# CR-SST-0110 - Resumen De Archivos Modificados

## Control-Plane

- `requests/inbox/CR-SST-0110-sst-fend-learning-workspace-text-article-adoption.yaml`
- `requests/planned/CR-SST-0110-sst-fend-learning-workspace-text-article-adoption.yaml`
- `evidence/requests/CR-SST-0110/implementation-plan.md`
- `evidence/requests/CR-SST-0110/changed-files-summary.md`
- `evidence/requests/CR-SST-0110/validation-results.md`
- `initiatives/INIT-SST-0001-tags-governance-continuity.yaml`
- `state/features/learning-content-tags.current.yaml`

## sst-fend

- `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`
- `src/pages/LearningWorkspace/index.tsx`
- `src/pages/LearningWorkspace/styles.module.scss`
- `src/pages/LearningWorkspace/styles.module.scss.d.ts`
- `src/pages/Articles/components/ArticleCreateFlow/ArticleCreateFlow.tsx`
- `src/pages/Articles/components/ArticleCreateFlow/styles.module.scss`
- `src/pages/Articles/components/ArticleCreateFlow/styles.module.scss.d.ts`
- `src/pages/Articles/components/ArticleCreateFlow/__tests__/ArticleCreateFlow.test.tsx`
- `src/pages/Articles/components/ArticleForm/index.tsx`
- `src/pages/Articles/components/ArticleForm/schema.ts`
- `src/pages/Articles/components/ArticleModal/ArticleModal.tsx`
- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`

## Resumen

- `/learning` queda como superficie de laboratorio/QA respaldada por el
  componente reusable `LearningWorkspaceSheet`.
- La creacion de articulo `Texto` renderiza un formulario real y un panel
  embebido de `LearningWorkspace`.
- El panel embebido usa el borrador del articulo como fuente: titulo,
  referencia y cuerpo.
- La validacion de `url` queda condicionada: web/transcript requieren URL
  valida; texto manual requiere una referencia no vacia.
- Crear articulo y aceptar preview siguen siendo acciones separadas.
