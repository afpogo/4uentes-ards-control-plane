# Prepublicación de la segunda remediación ClamAV

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Reserva y worktree

Se reutilizó el único worktree activo de `CR-HPT-0024` para
`sst-4uentes-infra`. Antes de cambiar de rama se comprobó que estaba limpio,
que el commit anterior `3526a1d` era alcanzable desde el nuevo
`origin/develop@55097809b069703af2049ab7769db6b83a95d021` y que la rama nueva
no existía local ni remotamente.

No se creó un segundo worktree. La rama
`fix/CR-HPT-0024/clamav-directory-traversal` partió exactamente de la ref
remota refrescada y contiene un único commit owner: `80eaf39`.

## Diagnóstico reproducido

La imagen fijada por digest se ejecutó en contenedores efímeros, sin Secrets y
sin modificar Kubernetes. La prueba reprodujo dos fallas del entrypoint root:

1. con `drop: [ALL]` y sólo `CHOWN`, no puede recorrer
   `/var/lib/clamav`, cuyo modo observado es `0700`;
2. al superar esa lectura, `CLAMD_CONF_TemporaryDirectory=/receipt-staging`
   falla porque el `sed` del entrypoint no escapa `/`.

## Corrección owner

La corrección evita ampliar capabilities:

- usa el entrypoint oficial `/init-unprivileged` como UID/GID `1000`;
- elimina todas las capabilities;
- conserva `allowPrivilegeEscalation: false` y seccomp `RuntimeDefault`;
- monta un `clamd.conf` mínimo, generado por Kustomize y read-only;
- conserva socket y staging en `emptyDir` con `medium: Memory`;
- elimina el puerto TCP de ClamAV;
- ejecuta probes reales con `clamdscan --ping` sobre el socket Unix.

La documentación, contrato de deployment, state scenario, fuentes, runbook y
regresión owner quedaron actualizados en el mismo commit.

## QA local

El harness efímero con el digest exacto demostró:

- `PONG` sobre Unix;
- usuario efectivo configurado como `1000:1000`;
- `CapDrop=[ALL]` y `no-new-privileges`;
- límites efectivos de 10 MiB;
- stream limpio con exit `0`;
- EICAR sintético con `FOUND` y exit `1`;
- retiro del contenedor al finalizar.

Aprobaron además `npm run check:receipt-custody`, `npm run check` del owner,
render Kustomize, dry-run server, `git diff --check` y scan de secretos.

## Tracker y límites

El último readback exitoso conserva `HPT-16` en `En curso`. El intento de
registrar el inicio de este subgate falló porque Atlassian no pudo refrescar el
OAuth y devolvió `unauthorized_client`; el comentario queda pendiente de
reconciliación y Jira continúa siendo mirror, no autoridad.

La autorización vigente permite publicar sólo la rama y abrir un PR. No permite
merge, autosync intencional, `kubectl apply`, restart, rollback, cambios de
Secrets ni transición terminal en Jira.
