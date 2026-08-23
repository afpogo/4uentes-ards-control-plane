# Resultados De Validación De CR-HPT-0005

Fecha: 2026-08-21

## Alcance Validado

- Initiative `INIT-HPT-0002` e indexación local.
- Request inbox y response planned `CR-HPT-0005`.
- Evidencia de fuente/path y análisis de dominio/boundary.
- Ausencia de mutaciones en Alphinance, `finanzas-personales` y repos SST por
  parte de este corte.

## Control Plane

Comando:

```powershell
npm run check
```

Resultado: PASS.

- catálogo y soluciones: `5 OK`, `0 FAIL`;
- bindings locales: `41 OK`, `4 WARN`, `0 FAIL`;
- state model y capability links: `56 OK`, `0 FAIL`;
- Initiatives: `21 OK`, `0 FAIL`, incluida `INIT-HPT-0002`;
- owner documentation gate: `109 OK`, `0 FAIL`;
- documentación visual: `10` mapas, `0 FAIL`.

Los cuatro warnings de bindings corresponden a remotes HTTPS observados frente
a remotes SSH catalogados en servicios preexistentes. No fueron introducidos
por CR-HPT-0005.

## Integridad Del Diff

Comando:

```powershell
git diff --check
```

Resultado: PASS.

## Contrato Documental Del Repo Hijo

Comandos ejecutados en el checkout owner, en modo solo lectura:

```powershell
node backend/scripts/check-contracts.js
git diff --check
```

Resultado: PASS.

El gate confirmó la identidad canónica HPT, membership SST fail-closed, clave
`account_id + stable_subject` y rechazo de owner/account scope seleccionados por
el cliente. La consolidación se registró en
`evidence/requests/CR-HPT-0005/child-ards-consolidation-review.md` sin modificar
el worktree hijo.

## Límite

No se ejecutaron checks de runtime de Phinance-API porque CR-HPT-0005 no muta
el repo hijo y el backend observado todavía no contiene runtime. El comando
actual es un gate textual de contratos y no reemplaza schemas, tests de dominio,
migraciones ni el futuro harness HTTP.
