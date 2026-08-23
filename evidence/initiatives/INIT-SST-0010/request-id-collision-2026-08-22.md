# INIT-SST-0010 - ColisiÃ³n Del Namespace De Change Requests

Fecha observada: 2026-08-22.

## Resultado

El preflight global detectÃ³ una colisiÃ³n real: los artefactos locales de
reconciliaciÃ³n de memoria usan `CR-SST-0202`, mientras Jira ya refleja esa
identidad en `SST-113` para una intenciÃ³n de retenciÃ³n de chat bajo
`INIT-SST-0007` / `SST-86`.

## Evidencia Read-Only

| Superficie | Identidad observada | Resultado |
| --- | --- | --- |
| Jira `SST-113` | `CR-SST-0202` | Colisiona con el request local de reconciliaciÃ³n de memoria. |
| Jira `SST-114` | `CR-SST-0203` | Ocupado. |
| Jira `SST-115` | `CR-SST-0204` | Ocupado. |
| Jira `SST-116` | `CR-SST-0205` | Ocupado. |
| Jira `SST-117` | `CR-SST-0206` | Ocupado. |
| DescripciÃ³n de `SST-86` | `CR-SST-0199` a `CR-SST-0201` | Referenciados externamente; lifecycle local no visible en este checkout. |

La observaciÃ³n fue de sÃ³lo lectura. Esta evidencia no conserva cloud IDs,
account IDs, URLs privadas, tokens, claims ni datos de usuario.

## Policy Aplicada

`work-tracker-control-plane-authority-policy` establece que una coincidencia de
identidad bloquea creaciÃ³n o escritura y deriva a reconciliaciÃ³n.
`jira-cr-mirror-hierarchy-policy` prohÃ­be duplicar el issue primario de un CR y
mantiene al control plane como fuente de verdad del lifecycle.

## DecisiÃ³n

- No renombrar ni renumerar automÃ¡ticamente los artefactos locales existentes.
- Retirar `CR-SST-0202` de la lista de requests canÃ³nicos de `INIT-SST-0010` y
  conservarlo explÃ­citamente como artefacto en cuarentena.
- No ejecutar ni autorizar por reutilizaciÃ³n el preview Jira preparado bajo ese
  identificador.
- No reservar `CR-SST-0203` ni otro nÃºmero del rango observado.
- Mantener la correcciÃ³n de identidad/scope como
  `CR-SST-TODO-IDENTITY-SCOPE` hasta reconciliar el namespace global.
- Generar un lifecycle y un lote Jira nuevos sÃ³lo despuÃ©s de una decisiÃ³n
  humana de reconciliaciÃ³n con un ID verificado como libre.

## Impacto En La Secuencia De Memoria

La colisiÃ³n no revierte la implementaciÃ³n ya validada de CR-SST-0193, pero
impide usar el request local de reconciliaciÃ³n como autoridad de publicaciÃ³n.
AdemÃ¡s, la fundaciÃ³n de identidad/scope debe resolverse en una request separada
antes de cerrar CR-SST-0193 e iniciar CR-SST-0194. Esto evita ampliar el scope
de CR-SST-0193 y evita una dependencia circular dentro de CR-SST-0194.
