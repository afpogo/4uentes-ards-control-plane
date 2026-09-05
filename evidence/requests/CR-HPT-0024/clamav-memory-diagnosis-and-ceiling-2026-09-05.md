# Diagnóstico de memoria y techo de ClamAV

Fecha: 2026-09-05

## Rol y alcance

Este documento es evidencia de diagnóstico del control plane. Registra una
decisión de dimensionamiento para el owner Infra; no autoriza una mutación de
Git, Kubernetes, DNS, Secrets, licencia ni Jira. La autoridad técnica futura
sigue siendo `sst-4uentes-infra`, en su manifest y documentación owner.

## Hallazgos observados

| Señal | Valor observado |
| --- | --- |
| Contenedor | `receipt-clamav` en `4uentes-sst/sst-bend-58498cc978-rxdlq` |
| Request / límite actual | `768Mi` / `1536Mi` |
| Última terminación | `OOMKilled`, exit `137` |
| Reinicios observados | `23` |
| Fase del fallo | `Testing database` de `daily.cld`, versión `28102` a `28114` |
| Cgroup después del reinicio | actual `1079119872` bytes; peak `1182822400` bytes |
| Worker asignable | `12248696Ki` |
| Requests / límites ya declarados | `2322Mi` / `6642Mi` |

El socket de `clamd` responde y el pod está `Ready`, pero la base diaria tiene
más de siete días y `freshclam` no puede resolver `database.clamav.net`. Por
eso la readiness actual no demuestra firmas vigentes ni cierra el blocker de
custodia.

## Decisión seleccionada

El próximo PR owner deberá proponer exactamente:

| Recurso | Actual | Seleccionado |
| --- | --- | --- |
| Request de memoria | `768Mi` | `3Gi` |
| Límite de memoria | `1536Mi` | `4Gi` |

ClamAV recomienda 3 GiB como mínimo y 3–4 GiB para Docker/Kubernetes
restringido. El límite anterior fue superado durante la validación de firmas;
el techo de 4 GiB conserva margen de recarga. Con esos valores, el worker
proyecta `4626Mi` de requests (aprox. 38%) y `9202Mi` de límites (aprox. 75%),
dentro de `12248696Ki` asignables. Esto selecciona un techo inicial prudente;
no afirma que la corrección esté validada hasta completar una actualización de
firmas real sin OOM.

Las referencias upstream son [requisitos de ClamAV](https://docs.clamav.net/Introduction.html)
y su [guía de troubleshooting](https://docs.clamav.net/faq/faq-troubleshoot.html),
que identifica la recarga de bases como un problema frecuente de memoria en
Docker/Kubernetes.

## PR owner futuro y stop conditions

El cambio autorizado en un gate posterior se limitará a:

- `k8s-manifests/overlays/development/sst-bend/receipt-malware-scanner.patch.yml`;
- `docs/playbooks/receipt-custody-adoption.md`;
- `docs/runbooks/receipt-custody-development.md`.

El PR debe conservar `/init-unprivileged`, UID/GID `1000`, `drop: [ALL]`,
staging en memoria, socket Unix y límites de escaneo de 10 MiB. Debe pasar los
checks owner y demostrar una actualización y recarga de firmas sin `OOMKilled`.
Debe detenerse si la resolución DNS sigue fallando, el contenedor vuelve a OOM,
la seguridad del sidecar se debilita o el presupuesto de scheduling deja de ser
válido.

El merge, el autosync GitOps que pudiera resultar, una corrección DNS, cambios
de Secrets, licencia y Jira requieren autorizaciones separadas.
