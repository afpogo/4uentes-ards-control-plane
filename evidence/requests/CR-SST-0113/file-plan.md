# CR-SST-0113 - Plan De Archivos

## Objetivo

Implementar la primera hoja editable real en la tab `Texto` de creacion de
articulo, manteniendo el scope limitado a `sst-fend`.

## Archivos Owner A Tocar En `sst-fend`

### Runtime UI

- `src/pages/Articles/components/ArticleCreateFlow/ArticleCreateFlow.tsx`
  - Reemplazar la experiencia de texto por una hoja editable central.
  - Mantener `ArticleTag` separado de futuras anotaciones.
  - No implementar tagging contextual.

- `src/pages/Articles/components/ArticleCreateFlow/styles.module.scss`
  - Estilos de hoja editable, estructura de texto y paneles separados.
  - Debe evitar UI dominada por formulario.

### Tests

- `src/pages/Articles/components/ArticleCreateFlow/__tests__/ArticleCreateFlow.test.tsx`
  - Verificar que la tab `Texto` renderiza la hoja editable.
  - Verificar que se puede escribir/pegar texto.
  - Verificar que los tags del articulo siguen separados.

### Owner Docs/Specs

- `docs/38-learning-workspace-frontend.md`
  - Registrar `CR-SST-0113` y el alcance de hoja editable base.

- `specs/38-learning-workspace-frontend.yml`
  - Actualizar orquestacion/estado observable para `CR-SST-0113`.

- `docs/tasks/2026-07-04-cr-sst-0113-editable-text-sheet.md`
  - Evidencia local del repo hijo para esta implementacion.

### Posibles, Solo Si El Diff Lo Exige

- `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`
- `src/pages/LearningWorkspace/styles.module.scss`
- `src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`

## Fuera De Alcance

- `node-auth`
- `sst-bend`
- Persistencia backend nueva
- Parser/import avanzado
- DTOs granulares de seleccion
- Render Markdown/template final
- Tagging contextual sobre seleccion

## Validacion Planeada

En `sst-fend`:

```powershell
npm.cmd run check
```

En `4uentes-orchestor`:

```powershell
npm.cmd run check
```

## Owner Enforcement

El cierre local de `CR-SST-0113` queda bloqueado si no se actualizan owner docs
en `sst-fend` o si el control-plane check no valida owner documentation.
