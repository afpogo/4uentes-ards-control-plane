# CR-SST-0221: baseline y decisión de adopción

Fecha de observación: 2026-08-27  
Alcance: clúster compartido de desarrollo `kind-sst-cluster-dev`  
Naturaleza: evidencia sanitizada y plan; no contiene valores de Secrets ni material criptográfico.

## Resultado

El clúster usa objetos Kubernetes `Secret`, RBAC y TLS de transporte, pero el
API server no tiene configurado `--encryption-provider-config`. Por lo tanto no
hay evidencia de cifrado de Secrets en etcd. Tampoco se observaron operadores
de External Secrets o Sealed Secrets. El mecanismo declarado por infraestructura
continúa siendo `manual-local-k8s-secrets`.

La adopción se separa en tres controles:

1. cifrado de los objetos `Secret` almacenados por el API server;
2. custodia y transporte del valor fuente hasta el clúster;
3. consumo del Secret por cada workload con RBAC y permisos mínimos.

Resolver uno no sustituye a los otros. En particular, SOPS, Sealed Secrets o
External Secrets pueden proteger o administrar el material fuente, pero un
`Secret` finalmente persistido por Kubernetes todavía necesita cifrado del API
server para protegerse en etcd.

## Baseline observado

- Contexto: `kind-sst-cluster-dev`.
- Kubernetes: `v1.32.0`.
- Nodos: un control plane y un worker.
- API server: sin argumento `--encryption-provider-config`.
- Operadores/CRDs de secretos externos o sellados: no observados.
- Secrets con impacto, inventariados sólo por nombre:
  `ghcr-pull-secret`, `node-auth-secret`,
  `sst-bend-dictionary-secrets-secret`, `sst-bend-postgres-secret`,
  `sst-chat-m2m-secret` y `sst-chat-redis-secret`.
- Phinance aún no está desplegado en este clúster.

No se leyeron, imprimieron ni persistieron valores, payloads de etcd, tokens,
claves privadas o credenciales durante el relevamiento.

## Decisión inicial

Para el clúster Kind local se propone cifrar solamente el recurso `secrets`
con `secretbox`. Es una opción autenticada y apropiada para un bootstrap local
sin KMS externo. Su límite es explícito: la clave queda accesible para el host
del control plane, por lo que protege frente a exposición de etcd, no frente al
compromiso completo del host.

No se usará `aescbc`. `aesgcm` requeriría rotación automática antes de alcanzar
su límite operativo de escrituras; no es la primera opción para este bootstrap.
KMS v2 será el objetivo preferido cuando exista un backend KMS y plugin reales.

Durante la migración, la configuración de lectura será:

```text
secretbox / sst-dev-secrets-v1
identity / compatibilidad temporal de lectura
```

Después de reescribir todos los Secrets mediante el API, comprobar el prefijo
cifrado directamente en etcd y probar recuperación, `identity` debe eliminarse.
El estado estable conserva sólo la clave activa y las claves de rollback que
sigan dentro del período aprobado.

## Función y ciclo de las credenciales

Las credenciales de aplicación —incluidas las cuatro requeridas por Phinance—
autentican consumidores o protegen recursos concretos; no son claves de cifrado
de etcd. Sus valores fuente pueden estar temporalmente en un `.env` local para
Compose, pero el clúster debe recibirlos mediante su canal de custodia aprobado.
GitHub Actions sólo debe custodiar un valor cuando el pipeline necesite usarlo;
no es automáticamente el almacén de runtime del clúster. Ngrok tampoco recibe
los Secrets del clúster: únicamente recibe sus propias credenciales si el túnel
las necesita.

El ciclo esperado para una credencial es:

```text
generar -> custodiar -> entregar -> consumir -> rotar -> revocar -> eliminar
```

Cada paso necesita propietario, alcance y evidencia sanitizada. El cifrado de
etcd agrega una capa alrededor del estado almacenado, pero no cambia la función
ni reemplaza la rotación de la credencial.

## Custodia de la clave de cifrado

- La clave se genera fuera de Git y sin capturar su salida en evidencia.
- El repositorio de infraestructura contiene sólo una plantilla sin material.
- La copia primaria se monta con permisos restringidos en el control plane.
- Antes de activarla existe una copia de recuperación independiente y cifrada.
- La custodia pertenece a un operador humano autorizado del clúster.
- No se copia a Jira, documentación, logs, `.env` de aplicaciones o secretos de
  GitHub Actions salvo que exista una necesidad CI separada y aprobada.

## Ruta de adopción

1. Publicar y leer este plan desde `main`.
2. Clasificar si MongoDB/PostgreSQL contienen datos que deben preservarse.
3. Aprobar custodio, backup, ventana y criterio de recuperación.
4. Prototipar el bootstrap en un Kind descartable y aislado.
5. Probar creación, reescritura, rotación, rollback y pérdida controlada de
   clave usando únicamente Secrets sintéticos.
6. Elegir explícitamente migración in-place o recreación controlada del clúster
   compartido.
7. Activar el proveedor con `identity` como fallback temporal.
8. Reescribir todos los Secrets por el API y verificar almacenamiento crudo sin
   mostrar payloads.
9. Reiniciar consumidores por ondas acotadas y comprobar readiness/Argo.
10. Retirar `identity` y, después del período de rollback, la clave anterior.
11. Evaluar SOPS+age, Sealed Secrets y External Secrets en una solicitud aparte.

## Gates obligatorios

- Snapshot de etcd y backup/restauración de datos persistentes definidos.
- Plantilla reproducible sin clave en Git.
- Clave activa y copia de recuperación bajo custodios definidos.
- Prueba descartable completa antes de tocar el clúster compartido.
- Lectura normal por API y prefijo cifrado en etcd comprobados.
- Ningún valor o payload sensible en comandos, logs o evidencia.
- Todos los deployments listos y Argo saludable después de cada onda.
- Aprobación separada para migrar o recrear el clúster.

## Fuentes normativas consultadas

- Kubernetes, [Encrypting Confidential Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).
- Kubernetes, [Good practices for Kubernetes Secrets](https://kubernetes.io/docs/concepts/security/secrets-good-practices/).

## Autorización vigente

La autorización se limita a publicar este plan en el control plane. No autoriza
crear claves, modificar `sst-4uentes-infra`, recrear Kind, reescribir Secrets,
reiniciar workloads ni escribir en Jira.
