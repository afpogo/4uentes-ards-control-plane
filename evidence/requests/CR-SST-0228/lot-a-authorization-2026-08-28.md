# CR-SST-0228: autorización exacta del Lote A

Fecha: 2026-08-28  
Autorizante: `4uentes`  
Estado: `approved-pending-publication-readback`

## Texto recibido

> Autorizo el Lote A de CR-SST-0228: crear y publicar el lifecycle running,
> crear un worktree limpio de sst-4uentes-infra, instalar age 1.3.1 mediante
> Winget e implementar y validar el playbook key-free con datos sintéticos. No
> autorizo todavía leer Secrets o bases, crear backups reales, generar claves
> persistentes ni mutar el clúster compartido.

## Operaciones autorizadas

1. Crear, validar, publicar y releer el lifecycle `running` de `CR-SST-0228`.
2. Instalar `age 1.3.1` mediante Winget y verificar su versión.
3. Crear un worktree limpio de `sst-4uentes-infra` desde `develop`.
4. Implementar el playbook key-free de preparación, backup, migración in-place
   y rollback.
5. Usar solamente claves, recipients, payloads y directorios sintéticos
   efímeros durante la validación.
6. Actualizar specs, estados, runbooks y evidencia owner.
7. Ejecutar checks locales, publicar el PR owner y hacer readback remoto.

## Exclusiones obligatorias

- No consultar objetos Kubernetes Secret, ni siquiera para inventario.
- No conectarse a PostgreSQL, MongoDB o etcd compartidos.
- No crear snapshots o backups reales.
- No generar o custodiar claves persistentes.
- No modificar static pods, API server, nodos, workloads, PVC o configuración
  del clúster `sst-cluster-dev`.
- No reiniciar workloads o contenedores compartidos.
- No escribir en Jira.

## Gate

Esta autorización debe estar fusionada y leída desde `main` antes de instalar
software, crear el worktree owner o modificar `sst-4uentes-infra`.
