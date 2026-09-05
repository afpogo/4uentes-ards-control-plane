# Reconciliación de salud runtime de Backend e Infra

## Rol, alcance y autoridad

- Rol primario: evidencia de estado observado.
- Owner: `4uentes-ards-control-plane` para la reconciliación del lifecycle.
- Alcance: lectura sanitizada de Kubernetes, Argo CD y la ref remota de Infra.
- Autoridad técnica: los manifests de `sst-4uentes-infra` y el runtime observado
  conservan su autoridad; este documento no los redefine.
- Efecto de autorización: ninguno. No autoriza mutaciones, despliegues,
  promociones estables ni escrituras Jira.

Esta evidencia actualiza una observación anterior sin reescribirla. El
`OOMKilled` de `receipt-clamav` continúa como antecedente histórico, pero ya no
describe el estado runtime vigente al momento de este readback.

## Resultado observado

La observación se realizó el `2026-09-05T21:49:37Z` y produjo el siguiente
resultado sanitizado:

| Superficie | Resultado |
| --- | --- |
| Argo CD `sst-app` | `Synced` y `Healthy` |
| Revisión Argo CD | `8efb13ed5724cc52aa3e98db114bc07122229f12` |
| Fase de la última operación | `Succeeded` |
| Ref remota Infra `develop` | `8efb13ed5724cc52aa3e98db114bc07122229f12` |
| Deployment `sst-bend` | 1 deseada, 1 actualizada, 1 ready y 1 disponible |
| Rollout `sst-bend` | completado correctamente |
| Pod observado | `sst-bend-58498cc978-rxdlq`, `2/2 Running` |
| Imagen Backend | `develop-5db4dd868f33`, digest `sha256:9da19da8150152ae9b4616cfa9754386cfa9922d785da08f4f1428a7adb8ac10` |
| Imagen ClamAV | digest `sha256:967334b92d1782e4d1314ddf903ae537d26792d21c9a39adecb8ac9757980514` |

Ambos contenedores estaban `ready=true` y habían permanecido en ejecución
desde `2026-09-05T18:35:48Z`, más de tres horas antes del readback. El historial
del contenedor `receipt-clamav` conserva 23 reinicios y un último estado
terminado `OOMKilled` con exit code 137 a las `2026-09-05T18:31:52Z`. Estos
datos impiden interpretar el readback como prueba de ausencia histórica de la
falla, pero no contradicen la salud actual reportada por Deployment y Argo CD.

## Disposición gobernada

La coincidencia entre la revisión `develop` de Infra y la revisión reconciliada
por Argo CD, junto con el rollout completo y ambos contenedores listos, satisface
los checkpoints actuales `backend-rollout-healthy` e `infra-rollout-healthy`.
Por ello, `backend-clamav-rollout-health` deja de bloquear esos checkpoints en
esta observación.

El gate global de `CR-CP-0024` permanece cerrado por otros checkpoints. Esta
reconciliación tampoco cierra `CR-SST-0233`: continúan pendientes el preflight
y la disposición del mirror Jira, además de la clasificación del worktree
legacy.

## Reproducibilidad y límites

Se usaron consultas de solo lectura equivalentes a:

```powershell
kubectl -n 4uentes-sst get deployment sst-bend
kubectl -n 4uentes-sst rollout status deployment/sst-bend --timeout=10s
kubectl -n 4uentes-sst get pod sst-bend-58498cc978-rxdlq
kubectl -n argocd get application sst-app
git ls-remote https://github.com/afpogo/sst-4uentes-infra.git refs/heads/develop
```

No se conservaron variables de entorno, Secrets, credenciales, headers,
identificadores de conexión ni manifests completos. Un mapa adicional no es
aplicable: la relación de lifecycle y sus autoridades no cambió; el mapa del
scoreboard existente se actualiza junto con su fallback textual.
