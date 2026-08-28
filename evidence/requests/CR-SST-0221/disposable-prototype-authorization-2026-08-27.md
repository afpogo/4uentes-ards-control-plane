# CR-SST-0221: autorización del prototipo descartable

Fecha: 2026-08-27  
Autorizador: `4uentes`  
Texto de autorización: `ok avancemos al siguiente paso`

## Alcance autorizado

- Publicar este gate y leerlo desde `main` antes de modificar el owner.
- Crear un worktree limpio de `sst-4uentes-infra` desde su referencia remota
  canónica actual.
- Actualizar bootstrap, especificaciones y runbooks owner para un clúster Kind
  descartable y separado.
- Usar únicamente claves y Secrets sintéticos, efímeros y no reutilizables.
- Probar cifrado en reposo, reescritura, rotación, rollback y recuperación en
  ese clúster descartable.
- Conservar en Git sólo plantillas sin material criptográfico.

## Exclusiones

- No modificar, reiniciar, recrear o aplicar recursos en
  `kind-sst-cluster-dev`.
- No leer, copiar, rotar o reescribir Secrets existentes del clúster
  compartido.
- No usar credenciales de Phinance, SST, GitHub Actions o ngrok.
- No modificar repositorios runtime.
- No desplegar a un ambiente persistente o productivo.
- No escribir en Jira.

## Gate de publicación

La mutación del owner comienza sólo después de que esta autorización sea
fusionada y leída desde `origin/main`. La publicación del prototipo owner y
cualquier ejecución sobre el clúster compartido son gates posteriores y
separados.
