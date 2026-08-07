# Enmienda Del Tren SST Minimo

## Decision

`CR-SST-0152` queda reducido al tren estable
`sst-bend -> 4uentes-auth -> sst-fend`. `sst-extension` y toda la cohorte
preview quedan diferidos a un release coordinado futuro. `CR-SST-0149` conserva
su draft separado despues del merge del frontend principal.

## Desviacion De Orden

El PR #3 fue fusionado antes de registrar esta decision y todavia describia
extension y preview. La historia no se modifica. Esta enmienda reemplaza ese
alcance para ejecucion futura y exige un nuevo merge humano antes de cualquier
mutacion de repos hijos. No se observo mutacion de repos hijos causada por esta
enmienda.

## Lifecycles Nuevos

- `CR-SST-0153`: separacion frontend entre preview y accepted context.
- `CR-SST-0154`: clasificacion frontend de `manual_text`, `article_draft` y
  `article`.

Ambos pertenecen a `INIT-SST-0001`, usan `SST-6` como parent Jira previsto y
se publican como commits separados dentro del candidato principal de
`sst-fend`. Ninguno cambia DTOs, endpoints, migraciones ni persistencia.

## Preservacion Y Exclusiones

- El worktree parcial de `sst-extension` no se commitea, publica, borra ni
  limpia.
- Se excluyen `CR-SST-0120`, `CR-SST-0137`, `CR-SST-0138`, `CR-SST-0139` y
  `CR-SST-0140`.
- Se excluyen migraciones, DTOs, capabilities y UI preview.
- `CR-SST-0125` continua como lifecycle separado.
- No se crea PR infra manual ni se habilitan mutaciones runtime directas.

## Gates

La enmienda requiere `npm run check`, parse de YAML, `git diff --check` y
escaneo de secretos/datos protegidos antes de publicarse. El merge de la
enmienda habilita solamente la recomposicion; cada merge hijo y cada lote Jira
conservan su aprobacion humana independiente.
