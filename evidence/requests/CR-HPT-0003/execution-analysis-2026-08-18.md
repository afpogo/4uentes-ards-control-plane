# CR-HPT-0003 - Análisis De Reconciliación

Fecha: 2026-08-18

## Hallazgo De Topología

El worktree de HPT contiene un rediseño previo y no publicado que retira el
frontend standalone. Su README define a `sst-fend` como consumidor y a
Phinance-API como único runtime propio de la solución HPT.

El control plane todavía exige artefactos bajo `frontend/**`. Esa exigencia ya
no describe la arquitectura propuesta y genera cuatro fallas reales en el
validador de bindings. Validar contra un snapshot limpio no resuelve el drift.

## Hallazgo De Multicuenta

El contrato HPT actual define exactamente un `finance_profile` por subject SST.
Ese modelo no respeta usuarios con membresía en varias cuentas SST: el mismo
subject podría operar en scopes diferentes y quedar ligado al mismo perfil.

El contrato objetivo usa una identidad compuesta derivada de contexto confiable:

```text
SST authenticated user + validated active account
                    |
                    v
PrincipalContext { subject, account_id, scopes, correlation_id }
                    |
                    v
Phinance finance_profile unique(account_id, subject)
```

`account_id` no puede provenir del body o query de HPT. SST debe resolver la
cuenta activa, validar membership y entregar un contexto interno protegido. Si
el contexto falta o no es confiable, Phinance-API falla cerrado.

## Decisión De Alcance

CR-HPT-0003 reconciliará contratos y topología; no implementará runtime ni
creará todavía cuentas bancarias, hogares o grupos compartidos. Los cambios
preexistentes del worktree HPT se preservan y se distinguen de las correcciones
acotadas realizadas por este CR.

Jira permanece sin mutaciones.
