# QA UI De Acciones Icon-Only En Secretos

## Alcance

Se actualizo `sst-fend` para que `Dictionary > Secretos` use acciones
icon-only con `Tooltip` en lugar de botones de texto para `Reveal`, `Copy` y
`Revoke`.

## Cambios Verificados

- `Reveal` ahora usa `EyeIcon` cuando el secreto esta oculto.
- Cuando el valor esta revelado, la misma accion muestra `EyeSlashIcon` y
  oculta el valor limpiando estado local efimero sin llamar al backend.
- `Copy` usa `ClipboardDocumentIcon` y conserva el flujo actual: endpoint
  `copy`, escritura a clipboard y sin render persistente fuera del valor
  revelado explicitamente.
- `Revoke` usa `NoSymbolIcon` con `Popconfirm` y mantiene estado danger.
- Cada accion conserva `aria-label`, `event.stopPropagation()`,
  `loading/disabled` y tooltip:
  - `Ver secreto`
  - `Ocultar secreto`
  - `Copiar secreto`
  - `Revocar secreto`
- Los secretos no activos siguen con acciones deshabilitadas y mensaje
  `Secreto no activo`.
- El ajuste SCSS deja botones de 36px, wrappers estables y hover/focus visible
  para evitar layout shift en filas.

## Seguridad Y Datos Sensibles

- No se cambio `sst-bend`, `4uentes-auth`, contratos API ni persistencia.
- No se agrego Redux, localStorage, sessionStorage, logs ni evidencia con
  valores secretos.
- El valor revelado sigue viviendo solo en estado React local.
- La accion manual de ocultar limpia el valor local y cancela el timer de
  auto-hide asociado.
- Auto-hide de reveal conserva `SECRET_REVEAL_TTL_MS = 60000`.

## Validacion Estatica

Ejecutado en `sst-fend`:

```bash
npx.cmd eslint src/pages/Dictionary/components/DictionarySecretsPanel.tsx
npm.cmd run css:types:check
npm.cmd run build
npm.cmd run check
```

Resultado:

- `eslint` focalizado: OK.
- `css:types:check`: OK despues de regenerar
  `src/pages/Dictionary/styles.module.scss.d.ts`.
- `npm run build`: OK, con warnings existentes de tamano de bundle.
- `npm run check`: OK.
- Jest: 25 suites passed, 147 tests passed.
- ARDS CHECK: OK.

Warnings observados durante `npm run check`:

- 22 warnings existentes de `react-hooks/exhaustive-deps` en archivos no
  relacionados.
- Warnings existentes de Ant Design deprecations y `findDOMNode` en tests.
- Warnings existentes de tamano de bundle.

## QA Manual Chrome

Chrome DevTools MCP fue consultado el 2026-06-29. Solo habia una pagina
`about:blank` y no habia app SST ni sesion autenticada reutilizable.

Por ese motivo no se ejecuto el flujo manual create/reveal/hide/copy/revoke en
browser en esta pasada. No se generaron capturas ni datos dummy.

## Archivos Tocados En `sst-fend`

- `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`
- `src/pages/Dictionary/styles.module.scss`
- `src/pages/Dictionary/styles.module.scss.d.ts`
