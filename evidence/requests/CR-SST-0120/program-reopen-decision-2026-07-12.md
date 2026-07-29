# CR-SST-0120 - Decision De Reapertura Como Programa

## Decision

Con aprobacion explicita del usuario el 2026-07-12, `CR-SST-0120 / SST-50`
vuelve a `in-progress` como Tarea contenedora del programa de previews.

El slice consumidor inicial de `sst-fend` permanece terminado y conserva toda
su evidencia. La reapertura no invalida ese trabajo; corrige la jerarquia para
que la entrega cross-repo cierre como una unidad.

## Subtareas Deseadas

- `CR-SST-0137`: `sst-bend`, estado canonico y persistencia.
- `CR-SST-0138`: `node-auth`, adopcion y passthrough.
- `CR-SST-0139`: `sst-extension`, productor consentido.
- `CR-SST-0140`: `sst-fend`, adopcion final.

`CR-SST-0101 / SST-33` y `CR-SST-0103 / SST-35` conservan sus identidades y se
enlazan como dependencias. `CR-SST-0121` conserva alcance propio de hardening y
no se convierte en subtarea de `SST-50`. `CR-SST-0102 / SST-34` queda fuera.
