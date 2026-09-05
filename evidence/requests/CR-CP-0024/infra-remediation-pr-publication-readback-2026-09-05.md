# Publicación de la remediación Infra y readback

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Resultado

La remediación mínima del fallo de inicialización de `receipt-clamav` quedó
publicada en [sst-4uentes-infra PR #24](https://github.com/afpogo/sst-4uentes-infra/pull/24).
El readback inmediato a la publicación mostró el PR abierto contra `develop`,
sin merge automático y sin despliegue iniciado por el agente.

Readback exacto:

- base: `develop@7e488e542f0242fffcf9d1e71672e72c79bd3b39`;
- head: `fix/CR-HPT-0024/clamav-volume-permissions@3526a1d336f635a48220048e0837e8e1efcce19a`;
- un commit y ocho archivos owner;
- GitHub: `OPEN`, `MERGEABLE`, `CLEAN`;
- cuatro checks `SUCCESS`: repository, desired state y los validadores de
  manifests SST Bend y SST Fend.

## Merge posterior al gate

Después de ese readback y del comentario Jira `10424`, GitHub registró una
transición externa al gate del agente:

- estado actual: `MERGED`;
- `mergedAt`: `2026-09-05T03:21:42Z`;
- cuenta registrada por GitHub: `afpogo`;
- merge commit: `55097809b069703af2049ab7769db6b83a95d021`;
- `develop` remoto apunta a ese mismo commit;
- no había auto-merge configurado en el PR;
- los cuatro workflows disparados por el push terminaron `SUCCESS`.

El agente no ejecutó el merge. No se revirtió ni se repitió la operación:
se preservó la cronología y se pasó a contención de lectura.

## Alcance de la corrección

El manifiesto mantuvo `drop: [ALL]` y recuperó exclusivamente `CHOWN` para el
entrypoint oficial de ClamAV. Se conservaron
`allowPrivilegeEscalation: false`, seccomp `RuntimeDefault`, la imagen fijada
por digest, el socket privado y el staging en memoria. La regresión owner
rechaza modo privilegiado y pérdida de esta configuración.

La hipótesis de suficiencia resultó falsa en runtime. El entrypoint oficial
ejecuta `chown -R clamav:clamav /var/lib/clamav`; `CAP_CHOWN` habilita el cambio
de ownership, pero no permite por sí sola recorrer un directorio cuyo modo no
concede acceso al proceso tras `drop: [ALL]`. El entrypoint oficial
`/init-unprivileged` evita ese `chown`, pero también omite el procesamiento de
las variables `CLAMD_CONF_*`; sustituirlo directamente rompería la
configuración reproducible del socket compartido.

## Autosync y readback de runtime

Argo CD tenía habilitados `automated.prune` y `automated.selfHeal`. Sin una
acción manual del agente, sincronizó `sst-app` a la revisión
`55097809b069703af2049ab7769db6b83a95d021` y terminó la operación a
`2026-09-05T03:22:27Z`.

Estado observado:

- aplicación: `Synced` / `Progressing`;
- deployment `sst-bend`: dos réplicas, una ready y una unavailable;
- pod nuevo: `1/2`, con `receipt-clamav` en `CrashLoopBackOff`;
- error repetido: `chown: cannot read directory '/var/lib/clamav': Permission denied`;
- el pod anterior sigue ready y conserva la disponibilidad del servicio.

No se ejecutó `argocd app sync`, `kubectl apply`, restart, rollback ni cambio
de Secrets.

## Mirror Jira

`HPT-16` fue leído antes de escribir: ya tenía objetivo, parent `HPT-8`, estado
`En curso`, comentario de inicio e historial previo. Se agregó el comentario
de publicación `10424`. Tras observar el merge y el autosync se agregó el
comentario cronológico `10425`, sin editar el anterior. La tarea permanece
`En curso`.

## Límites vigentes

- El agente no modificó `develop` ni ejecutó el merge observado.
- El autosync fue una consecuencia de la configuración GitOps preexistente.
- No se ejecutó apply, restart, rollback ni cambio de Secrets manual.
- No se expusieron licencias, credenciales, JWT, headers, documentos ni datos
  reales.
- La primera remediación queda clasificada como insuficiente, no como cerrada.
- El siguiente gate requiere una segunda remediación owner acotada y una
  prueba de paridad del entrypoint/configuración antes de publicar otro PR.
- Los cambios manuales al cluster y una transición terminal en Jira siguen
  prohibidos sin autorización separada.
