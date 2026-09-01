# Readback de merge, imagen, pin Infra y salud de Backend

## Resultado de promoción

| Superficie | Readback |
|---|---|
| PR owner | `afpogo/sst-bend#32`, `MERGED` |
| Merge commit | `5db4dd868f3348f95d6376519be1534be1710d75` |
| Merge observado | `2026-09-01T01:19:36Z` |
| Workflow push | `33458294010`, `success` |
| Tag inmutable | `develop-5db4dd868f33` |
| Digest | `sha256:9da19da8150152ae9b4616cfa9754386cfa9922d785da08f4f1428a7adb8ac10` |
| Infra antes | `60589676f4dc2f74e0ec6b9dd3b20a324b4eb7cc` |
| Infra después | `7e488e542f0242fffcf9d1e71672e72c79bd3b39` |

El diff Infra contiene sólo
`k8s-manifests/overlays/development/kustomization.yml`, con una inserción y una
eliminación: `afpogo/sst-bend` cambió de `develop-3751d383451b` a
`develop-5db4dd868f33`. No cambió ningún otro pin ni manifest.

## Orden observado

Cuando el ejecutor alcanzó el paso de merge, GitHub ya informaba PR #32 como
fusionado. Su `mergedAt` precede al merge del gate documental #210. No se
repitió el merge. La autorización owner se consumió para aceptar y verificar el
rollout acotado; esta desviación de orden queda explícita.

## Salud GitOps

Argo CD leyó Infra revision `7e488e5` y reportó:

- sync: `Synced`;
- health: `Progressing`;
- Backend deployment: 2 réplicas observadas, 1 ready, 1 available y 1
  unavailable;
- endpoint `http://localhost:8088/4uentes/v1/public/gallery`: `200`;
- endpoint `http://localhost:8088/.well-known/jwks.json`: `200`;
- `scrapper`: imagen nueva, 1 ready y 1 available.

El pod nuevo de Backend usa el tag y digest publicados. Su contenedor
`sst-bend` está ready sin reinicios, pero el sidecar `receipt-clamav` está en
`CrashLoopBackOff` y termina con exit code 1:

```text
chown: cannot read directory '/var/lib/clamav': Permission denied
```

Kubernetes conserva el pod anterior `develop-3751d383451b` como endpoint ready,
por lo que el servicio sigue disponible, pero el rollout nuevo no está sano.

## Disposición

La causa está en el patch preexistente
`k8s-manifests/overlays/development/sst-bend/receipt-malware-scanner.patch.yml`
introducido por `CR-HPT-0024@09b46f5` y ya integrado en el baseline Infra. El
sidecar elimina todas las capabilities mientras el entrypoint de la imagen
intenta ejecutar `chown` sobre `/var/lib/clamav`.

No se ejecutó sync, restart, rollback ni modificación del cluster. La ola queda
detenida hasta que el owner autorice una de estas acciones bajo gate separado:

1. corrección mínima de CR-HPT-0024 y rollout por PR Infra; o
2. rollback normal del pin Backend mediante flujo GitOps.

No se habilita otro owner, `master`, deploy manual ni Jira.
