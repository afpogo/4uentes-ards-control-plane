# Decision De Cierre - Acciones Icon-Only En Secretos

## Decision

El slice UI `Dictionary > Secretos` para acciones icon-only queda cerrado como
`validated-local` dentro de `CR-SST-0086`.

Este cierre no promueve `dictionary-secret-management` a `validated-live` ni
cierra por completo `CR-SST-0086`, porque siguen abiertos gaps de
release-readiness fuera del alcance de este ajuste UI.

## Alcance Cerrado

- Reemplazo de botones de texto `Reveal`, `Copy` y `Revoke` por acciones
  icon-only con Heroicons.
- Tooltips y `aria-label` para accesibilidad.
- Toggle local de visibilidad:
  - `Ver secreto` llama al endpoint `reveal` solo cuando el valor esta oculto.
  - `Ocultar secreto` borra el valor desde estado React local y no llama al
    backend.
- `Copiar secreto` conserva endpoint `copy` y escritura a clipboard.
- `Revocar secreto` conserva `Popconfirm`, estado danger y bloqueo para
  secretos no activos.
- Estilos compactos y estables para evitar crecimiento de filas o layout shift.

## Evidencia De Validacion

- `evidence/requests/CR-SST-0086/frontend-secret-icon-actions-2026-06-29.md`
- `evidence/requests/CR-SST-0086/validation-results.md`
- `evidence/requests/CR-SST-0086/secret-safe-review.md`

Validaciones ejecutadas:

- `sst-fend`: `npx.cmd eslint src/pages/Dictionary/components/DictionarySecretsPanel.tsx`
- `sst-fend`: `npm.cmd run css:types:check`
- `sst-fend`: `npm.cmd run build`
- `sst-fend`: `npm.cmd run check`
- `4uentes-orchestor`: `npm.cmd run check`

## Resultado

- Validacion estatica frontend: PASS.
- Build frontend: PASS con warnings existentes de tamano de bundle.
- Check frontend completo: PASS.
- Check control-plane: PASS.
- Evidencia secret-safe: PASS.
- QA manual browser de esta pasada: no ejecutado porque Chrome DevTools MCP
  solo tenia `about:blank`, sin app SST ni sesion autenticada reutilizable.

## Gaps Que Permanecen Fuera De Este Slice

- Automatizacion GitHub Actions para reprovisionar Kubernetes Secrets bajo la
  policy vigente de secretos local/kind.
- Lectura independiente de clipboard desde MCP en Chrome, bloqueada por
  timeout/permisos en evidencia previa.
- Integracion `sst-extension`, diferida fuera de v1.
- Material `seed_phrase` o equivalente sigue no soportado.
- Escrituras Jira siguen bloqueadas hasta aprobacion explicita y reconciliacion
  de issue key.

## Nota Secret-Safe

No se documentaron valores secretos, JWTs, cookies, master keys ni plaintext.
La evidencia describe comportamiento y comandos, no payloads sensibles.
