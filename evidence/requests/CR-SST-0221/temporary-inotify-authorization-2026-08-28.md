# CR-SST-0221: autorización temporal de capacidad inotify

Fecha: 2026-08-28  
Autorizante: `4uentes`  
Estado: `approved`

## Autorización recibida

> autorizo y necesito que se evidencie la corrida, se realice un playbook unido a un runbook para poder replicarlo

La autorización aplica exclusivamente al desbloqueo del prototipo descartable de
cifrado de Secrets de `CR-SST-0221` y habilita:

1. comprobar que `fs.inotify.max_user_instances` conserva el valor observado
   `128`;
2. elevarlo temporalmente a `1024` en el host Linux de Docker/WSL;
3. ejecutar el playbook reproducible contra un clúster Kind nuevo, aislado y
   descartable;
4. restaurar `128` dentro de un bloque `finally`, tanto ante éxito como ante
   error;
5. verificar la eliminación del clúster y directorio temporal, la restauración
   del contexto original y que los dos nodos del clúster compartido continúan
   `Ready`;
6. publicar evidencia saneada de la corrida y enlazar el playbook con el
   runbook owner.

## Límites

- No se autoriza persistir el sysctl en archivos de configuración del host.
- No se autoriza detener, reiniciar o modificar contenedores y workloads
  existentes para liberar recursos.
- No se autoriza mutar el clúster compartido `sst-cluster-dev` ni sus Secrets.
- No se autoriza exponer claves, valores de Secret o payloads crudos de etcd.
- No se autoriza migrar el clúster compartido ni escribir en Jira.

## Gatas de ejecución

- Esta autorización debe estar publicada y leída desde `main` antes del cambio
  temporal.
- El playbook debe negarse a continuar si el valor inicial no es exactamente
  `128`.
- La restauración a `128` y su readback son obligatorios antes de cerrar la
  corrida.
- Un fallo de restauración es un incidente operativo y bloquea cualquier nuevo
  intento.
