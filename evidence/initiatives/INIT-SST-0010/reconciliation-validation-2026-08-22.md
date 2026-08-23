# INIT-SST-0010 - ValidaciÃ³n De La ReconciliaciÃ³n

Fecha: 2026-08-22.

## Resultado

Los archivos pasan los validadores estructurales, pero la identidad local
`CR-SST-0202` no es adoptable: colisiona con el mirror Jira `SST-113` de otra
intenciÃ³n. Los artefactos y su preview quedan en cuarentena. No se modificaron
repos hijos ni Jira.

## Checks Focalizados

- `node scripts/verify-initiatives.js`: PASS, `22 OK / 0 WARN / 0 FAIL`.
- `node scripts/verify-state-model.js`: PASS, `56 OK / 0 WARN / 0 FAIL`.
- `node scripts/verify-owner-documentation.js`: PASS,
  `113 OK / 0 WARN / 0 FAIL`.
- `node scripts/verify-visual-documentation.js`: PASS, diez mapas vÃ¡lidos y
  cero fallas.

## Gate Completo

La ejecuciÃ³n inicial dentro del sandbox fallÃ³ antes de evaluar el fixture:

```text
spawnSync C:\Program Files\nodejs\node.exe EPERM
```

La repeticiÃ³n autorizada fuera del sandbox ejecutÃ³:

```powershell
npm.cmd run check
```

Resultado: PASS.

- catÃ¡logo: `5 OK / 0 WARN / 0 FAIL`;
- test de cobertura de bindings: PASS;
- bindings locales: `41 OK / 4 WARN / 0 FAIL`;
- state model: `56 OK / 0 WARN / 0 FAIL`;
- initiatives: `22 OK / 0 WARN / 0 FAIL`;
- owner documentation: `113 OK / 0 WARN / 0 FAIL`;
- visual documentation: diez mapas, `0 FAIL`.

Los cuatro warnings corresponden a remotes locales expresados como HTTPS
frente a remotes SSH en catÃ¡logo para `4uentes-auth`, `sst-fend`, `sst-bend` y
`sst-chatbot`. No son fallas funcionales de memoria; la colisiÃ³n de identidad
de `CR-SST-0202` es un blocker de governance separado.

## Estado De Cierre

Los artefactos locales `CR-SST-0202` permanecen fÃ­sicamente en su lifecycle
para no reescribir historia, pero su decisiÃ³n estÃ¡ bloqueada por colisiÃ³n y el
lote Jira estÃ¡ prohibido. `CR-SST-0193` permanece `running` por un gap de
autoridad y modelo de identidad/scope, no por el gate del control plane.
