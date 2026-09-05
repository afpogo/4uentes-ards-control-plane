# Readback del PR documental del owner

Fecha: 2026-09-05

## Resultado

Docker Desktop estaba abierto, pero el engine Linux no había publicado los
pipes `docker_engine` ni `dockerDesktopLinuxEngine`. La distribución WSL
`docker-desktop` sólo ejecutaba `init`, mientras el backend repetía que faltaban
`dockerProcd` y `dockerMemlogdq`. El primer cierre no removió procesos antiguos:
una instancia nueva abortó por no poder adquirir el lock.

Con autorización operativa se terminaron exclusivamente los procesos instalados
bajo `C:\Program Files\Docker\Docker`, se terminó la distribución WSL
`docker-desktop` y se inició nuevamente Docker Desktop. No se ejecutó un reset
de datos, no se eliminaron imágenes o volúmenes y no se aplicaron manifiestos.

Después de la recuperación:

- Docker Engine respondió con versión `20.10.23`;
- `/readyz?verbose` informó `readyz check passed`;
- los nodos `sst-cluster-dev-control-plane` y `sst-cluster-dev-worker` quedaron
  `Ready`;
- el worktree owner permaneció limpio en
  `67c4874b2404235d70dc56ce143343954f5c707e` sobre
  `origin/develop@a4d120061d0d4d53352b1de766858602ff759750`;
- `npm run check` finalizó con exit code `0`, incluidos los dry-runs de
  Kubernetes y `check:receipt-custody`.

## Readback remoto

Durante el control de colisiones se detectó que el PR Infra
[`#26`](https://github.com/afpogo/sst-4uentes-infra/pull/26) ya había sido
creado. No se repitió el push ni la creación. El readback primario y una
auditoría independiente confirmaron:

| Campo | Valor |
| --- | --- |
| Estado | `OPEN`, no draft, no fusionado |
| Merge state | `CLEAN` |
| Base | `develop@a4d120061d0d4d53352b1de766858602ff759750` |
| Head | `67c4874b2404235d70dc56ce143343954f5c707e` |
| Commits | `1` |
| Paths | `12` |
| Check remoto | `validate-repository: SUCCESS` |

No se observaron archivos, commits ni cambios de base fuera del allowlist.

## Desviación y disposición

El PR existía antes de que se recuperara el check local completo. Su SHA,
alcance y CI son correctos, pero este readback no convierte retroactivamente el
orden de publicación en cumplimiento. La desviación queda explícita y
contenida.

El subgate de publicación está consumido. El PR permanece abierto: su merge no
está autorizado. Tampoco están autorizados cambios de memoria de ClamAV,
mutaciones runtime, aceptación de licencias, secretos ni escrituras en Jira.
