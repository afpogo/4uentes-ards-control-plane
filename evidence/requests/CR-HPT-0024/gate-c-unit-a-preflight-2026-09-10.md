# Preflight de Gate C — licencia AIStor y custodia previa

Fecha local: 2026-09-10. Request: `CR-HPT-0024`. Coordinación:
`CR-CP-0024`.

## Resultado

El preflight técnico de Gate C pasó y la Unidad A queda esperando una acción
exclusiva del operador: aceptar el acuerdo vigente de AIStor Free y guardar
`minio.license` en custodia cifrada fuera de Git. No se generó material HSM,
no se crearon credenciales o Secrets y no se desplegó AIStor/KMS.

El mapa de decisión, su leyenda y fallback están publicados por el owner en
`docs/playbooks/aistor-kms-prerequisites.md`. El procedimiento ejecutable está
en `docs/runbooks/aistor-kms-prerequisites.md`.

## Estado owner

| Check | Resultado |
| --- | --- |
| Worktree owner | limpio en `226443397d07ac8e59f83b408dbcf34b25364d79` |
| Infra PR #33 | integrado; playbook y runbook presentes |
| `develop` remoto | `5fc609f064032f553b4a33933bc75ac48a3b77b6` |
| Relación | el worktree está un commit detrás; el único avance es un pin de imagen de `sst-chatbot` |
| Docker | servidor `20.10.23` accesible |
| Imagen KMS fijada | disponible localmente por el digest owner |

Antes de cualquier mutación owner, el worktree debe avanzar por fast-forward al
`develop` remoto observado y repetir `npm run check`. Este preflight no autoriza
esa mutación ni un nuevo PR Infra.

## Estado runtime de sólo lectura

- contexto Kubernetes: `kind-sst-cluster-dev`;
- Argo CD `sst-app`: `Synced/Healthy` sobre
  `5fc609f064032f553b4a33933bc75ac48a3b77b6`;
- namespace `receipt-custody`: ausente;
- namespace `aistor-system`: ausente;
- Secrets `receipt-kms-hsm`, `receipt-objectstore-root` y
  `sst-receipt-object-store`: ausentes.

Las consultas se limitaron a nombres y estados; no solicitaron ni mostraron
valores de Secrets.

## Verificación de fuentes oficiales

La documentación oficial vigente confirma que:

- AIStor Free está disponible para versiones AIStor
  `RELEASE.2025-12-20T04-58-37Z` o posteriores y para despliegues single-node
  sin alta disponibilidad ni determinadas funciones enterprise;
- la licencia se obtiene desde SUBNET y el archivo descargable es
  `minio.license`; MinIO recomienda almacenarlo según las reglas de seguridad,
  por ejemplo en un vault seguro;
- el chart MinIO KMS exige al menos una fuente HSM y permite una clave soft-HSM
  inyectada mediante un Secret existente;
- perder o cambiar la clave HSM impide recuperar el estado KMS y puede hacer
  irrecuperables los objetos cifrados;
- un snapshot `minkms backup` no contiene la configuración del cluster y la
  recuperación total también necesita las claves HSM originales.

Fuentes:

- https://docs.min.io/aistor/operations/licenses/
- https://docs.min.io/kms/reference/minkms-operator/minkms-helm-chart/
- https://docs.min.io/kms/operations/backup-and-recovery/

## Acción exclusiva del operador

1. Ingresar a SUBNET y seleccionar el deployment aplicable.
2. Leer y aceptar personalmente el acuerdo de AIStor Free.
3. Descargar `minio.license` directamente a un almacén cifrado controlado por
   el custodio.
4. Restringir acceso y comprobar localmente que el archivo existe, es legible y
   no está vacío, sin copiar su ruta, hash, ACL o contenido a Git, Jira o chat.
5. Comunicar únicamente: `Gate C licencia: PASS`.

La presencia del archivo no prueba todavía que sea válido para el deployment.
La validez se comprobará después del bootstrap con `mc license info`, dentro de
un gate de runtime autorizado.

## Stop conditions

- el acuerdo no es aceptable o no corresponde a AIStor Free;
- la licencia no corresponde a la versión/topología fijada;
- no existe custodia cifrada con acceso restringido;
- se intenta compartir la licencia, ruta sensible, hash o ACL;
- se intenta generar el HSM antes de cerrar la Unidad A;
- se intenta crear namespaces, Secrets o workloads sin autorización separada.

## Siguiente estado permitido

Después de la confirmación sanitizada del operador, se puede solicitar una
autorización separada para la Unidad B: generar el soft-HSM con el digest
fijado, escribirlo directamente en dos almacenes cifrados independientes y
probar formato, igualdad y lectura de recuperación sin imprimir valores.
