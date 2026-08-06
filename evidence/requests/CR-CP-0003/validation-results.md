# CR-CP-0003 - Resultados De Validacion

## Core

Comando:

```powershell
npm.cmd run check
```

Resultado:

```text
Total Errors:   0
Total Warnings: 0
Status:         PASSED
```

Cobertura semantica adicional:

- `validate.ts` ahora ejecuta `checkLivingResources`.
- El check valida clasificacion de `feature-bugfix-state-model`, campos
  requeridos, statuses canonicos, `template_binding` e identidad del template
  de adopcion.
- La salida actual de consola no imprime una seccion separada para living
  resources, pero el check participa en el resumen y en el exit code.

## Control Plane

Comando:

```powershell
npm.cmd run check:state
```

Resultado:

```text
Summary: 47 OK, 0 WARN, 0 FAIL
```

Comando:

```powershell
npm.cmd run check
```

Resultado:

```text
verify-catalog: 5 OK, 0 WARN, 0 FAIL
verify-local-bindings: 39 OK, 0 WARN, 0 FAIL
verify-state-model: 47 OK, 0 WARN, 0 FAIL
verify-initiatives: 12 OK, 0 WARN, 0 FAIL
verify-owner-documentation: 42 OK, 0 WARN, 0 FAIL
```

## Stability

Ver `evidence/requests/CR-CP-0003/validation-stability-assessment.md`.
