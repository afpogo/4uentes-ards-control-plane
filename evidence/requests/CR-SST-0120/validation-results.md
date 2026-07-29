# CR-SST-0120 - Validation results

## Validacion Tecnica

### sst-fend

- `npm.cmd test -- articles.mappers.test.ts ArticlesList.test.tsx --runInBand`
  - Resultado: PASS
  - Suites: 2
  - Tests: 14
- `npm.cmd run build`
  - Resultado: PASS
  - Observacion: webpack reporta 3 warnings de performance por bundle size.
- `npx.cmd eslint <sst-50 touched files>`
  - Resultado: PASS

### Check Completo sst-fend

- `npm.cmd run check`
  - Resultado: BLOCKED
  - Motivo: errores Prettier CRLF en archivos `LearningWorkspace` no
    relacionados con este CR:
    - `src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx`
    - `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`
  - Decision: no corregir en CR-SST-0120 para evitar mezclar cambios ajenos.

## Validacion Funcional Cubierta

- Un articulo text-only con URL fuente resuelve estado gobernado
  `unavailable` con razon `textual-pdf-no-thumbnail`.
- Un contrato `ArticlePreviewResult` con imagen disponible gana sobre el
  fallback local.
- Si el contrato indica `unavailable`, el frontend no dispara el request legacy
  de preview blob.
- `ArticlesList` muestra placeholder gobernado y razon funcional sin renderizar
  imagen inexistente.

## Control Plane

- `npm.cmd run check`
  - Repo: `4uentes-orchestor`
  - Resultado: PASS (revalidado 2026-07-11 despues del cierre y la reserva de CRs owner-scoped)
  - Owner documentation gate: `CR-SST-0120 owner_documentation gate is valid`

## Disposicion De Cierre

- QA visual: waiver explicito. Este workspace no dispone de un target
  autenticado ni de una fixture privada sanitizada reproducible. Los estados
  renderizados quedan cubiertos por tests deterministas; la QA privada final
  permanece en `CR-SST-0103 / SST-35`.
- Check completo de `sst-fend`: se acepta como blocker externo al slice. Los
  unicos errores observados son CRLF/Prettier preexistentes de
  `LearningWorkspace`; no se modifican para evitar mezclar alcance.
- Los slices productor, backend, BFF y adopcion final deben usar CRs separados
  por owner antes de mutar esos repos.
