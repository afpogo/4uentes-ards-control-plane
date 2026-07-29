# CR-CP-0002 Resultados De Validacion

## Validacion Core

Comando:

```powershell
npm.cmd run check
```

Working directory:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-core
```

Resultado:

```text
Total Errors:   0
Total Warnings: 0
Status:         PASSED
```

Notas:

- El validator de core reviso required files, internal links, YAML syntax, tone
  y scope.
- Node emitio warnings experimentales/deprecation no relacionados con este CR.
- En esta ejecucion se valido core, pero no se modifico `4uentes-ards-core`
  desde el workflow del control-plane.
- La clasificacion viva local queda registrada en el control-plane; la
  sincronizacion canonica de esos campos en core queda como handoff de
  `CR-CP-0002` si aun no fue aplicada en la rama core correspondiente.

## Validacion Control-Plane

Comando:

```powershell
npm.cmd run check
```

Working directory:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor
```

Resultado:

```text
verify-catalog: 5 OK, 0 WARN, 0 FAIL
verify-local-bindings: 39 OK, 0 WARN, 0 FAIL
verify-state-model: 47 OK, 0 WARN, 0 FAIL
verify-initiatives: 12 OK, 0 WARN, 0 FAIL
verify-owner-documentation: 42 OK, 0 WARN, 0 FAIL
```

Notas:

- El check completo incluye catalog, local bindings, state model, initiatives y
  owner documentation gate.
- No se mutaron repos hijos.
- `npm run check` fallo por `npm.ps1` bloqueado por ExecutionPolicy de
  PowerShell; se ejecuto el equivalente documentado `npm.cmd run check`.
