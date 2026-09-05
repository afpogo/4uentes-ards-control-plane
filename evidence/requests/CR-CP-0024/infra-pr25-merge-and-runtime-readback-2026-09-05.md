# Merge y readback de Infra PR #25

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Promoción exacta

El agente fusionó exclusivamente
[sst-4uentes-infra PR #25](https://github.com/afpogo/sst-4uentes-infra/pull/25)
con protección de head exacto
`2105e775f11de068fbcfaae0eb36a0e52db446ea`.

El merge fue confirmado como
`a4d120061d0d4d53352b1de766858602ff759750` en `develop`. La rama owner no
fue eliminada y el worktree no fue retirado. Los cuatro workflows del PR y los
cuatro workflows post-merge concluyeron `SUCCESS`.

El merge incluye el plan owner como código, con mapas Mermaid, en
`docs/infra/receipt-custody-delivery-plan.md`.

## Readback del autosync

Argo CD concilió `sst-app` exactamente en el merge
`a4d120061d0d4d53352b1de766858602ff759750`. El sync quedó `Synced`, la
operación `Succeeded` y la salud permaneció `Progressing` durante el readback.

El Deployment `sst-bend` conservó una de dos réplicas Ready. El contenedor
Backend del pod nuevo quedó Ready y el sidecar `receipt-clamav` eliminó la falla
anterior de `chown`/traversal.

## Nuevo blocker observado

Durante `freshclam`, la imagen descargó una versión más nueva de la base diaria
y comenzó a probarla antes de crear el socket de `clamd`. El proceso superó el
límite de memoria de `1536Mi` y Kubernetes registró repetidamente:

- razón `OOMKilled`;
- exit code `137`;
- tres reinicios observados;
- scanner no Ready;
- una de dos réplicas del Deployment no disponible.

El nodo reporta memoria allocatable suficiente; el límite observado pertenece
al contenedor, pero este readback no autoriza concluir todavía si la remediación
correcta es aumentar recursos, cambiar la estrategia de actualización o separar
la preparación de firmas. Esa decisión necesita un subgate owner y pruebas de
paridad.

## Contención

No se ejecutó `kubectl apply`, restart, rollback, cambio de recursos, cambio de
Secret ni eliminación. El pod anterior continúa preservando disponibilidad.

La autorización de merge quedó consumida. Una remediación del nuevo OOM requiere
otro gate explícito. Jira continúa pendiente porque el refresh OAuth de
Atlassian devuelve `unauthorized_client`.
