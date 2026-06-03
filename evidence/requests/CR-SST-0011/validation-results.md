# CR-SST-0011 - Resultados De Validacion

Observado el: 2026-05-24

## Comandos Requeridos

```powershell
npm.cmd run check:state
npm.cmd run check
```

## Resultado

| Comando | Resultado | Resumen |
|---|---|---|
| `npm.cmd run check:state` | PASS | `14 OK, 5 WARN, 0 FAIL`; `state/capability-links.yaml` valido 7 capability links |
| `npm.cmd run check` | PASS | Catalog OK, local bindings warning aceptado, state validator OK |

Los warnings aceptados corresponden a deuda previa del `state read-model`:
bugfixes sin request/evidencia formal, `document-agent` sin evidencia formal y
`bindings.local.yaml` opcional ausente.
