# CR-SST-0228: preview de autorización de ejecución

Fecha: 2026-08-28  
Estado: `not-authorized`  
Objetivo: separar preparación owner de acceso a datos y mutación compartida.

## Hallazgos posteriores al plan

- El control-plane Kind contiene `kubectl v1.32.0`; puede usarse desde el
  playbook owner y elimina la dependencia del cliente host v1.29.2.
- No se encontró `age`, `age-keygen` ni `gpg` en el host.
- Existe `openssl`, pero no se adopta implícitamente como formato de custodia.

## Lote A propuesto: preparación owner

Requiere autorización explícita para:

1. crear el lifecycle `running` de `CR-SST-0228` y publicarlo;
2. crear un worktree limpio de `sst-4uentes-infra` desde `develop`;
3. implementar el playbook key-free de backup, migración in-place y rollback;
4. usar `kubectl v1.32.0` dentro del nodo para operaciones Kubernetes;
5. instalar `age` mediante un mecanismo aprobado o registrar otra herramienta
   de cifrado autenticado;
6. validar con datos y claves únicamente sintéticos;
7. publicar owner docs, checks y readback.

Este lote no autoriza leer Secrets, conectarse a PostgreSQL/MongoDB, crear
backups reales, generar claves persistentes, parchar el API server, reescribir
objetos, reiniciar workloads ni escribir Jira.

## Lote B futuro: backup y migración compartida

Solo podrá solicitarse cuando el playbook owner esté publicado y se hayan
resuelto:

- custodio: propuesta `4uentes`;
- camino: propuesta `in-place`;
- pérdida de datos: propuesta `0`;
- ventana de API server: propuesta máxima `15 minutos`;
- retención de `v1` después de promover `v2`: propuesta `7 días`;
- destino primario cifrado fuera de Git: pendiente;
- segunda copia cifrada independiente: pendiente.

El lote B enumerará por separado acceso de lectura, backups, claves, static
pod, rewrite, auditoría de prefijos, readiness, rotación, rollback y cleanup.

## Decisión requerida

Autorizar primero el Lote A y elegir el mecanismo de instalación de `age` o
una alternativa. Los paths de las dos copias cifradas deben definirse antes
del Lote B; no se inferirán desde `.env`, GitHub Secrets ni Kubernetes Secrets.
