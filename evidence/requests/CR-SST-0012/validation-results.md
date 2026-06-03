# CR-SST-0012 - Resultados De Validacion

Observado el: 2026-05-24

## Comandos

```powershell
npm.cmd run check
```

## Resultado

| Comando | Resultado | Resumen |
|---|---|---|
| `npm.cmd run check` | PASS | Catalog OK, local bindings warning aceptado, state validator OK |

## Observacion

El catalog validator ahora exige `orchestrator_link_contract` en cada
`catalog/services/*.yaml`. El state validator confirmo `10` state files y `8`
capability links.
