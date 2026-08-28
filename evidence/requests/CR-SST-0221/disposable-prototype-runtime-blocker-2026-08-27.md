# CR-SST-0221: blocker runtime del prototipo descartable

Fecha: 2026-08-27  
Owner: `sst-4uentes-infra`  
Estado de la CR: `running`

## Resultado

El prototipo key-free, su harness, specs y runbooks owner quedaron preservados
en una rama aislada de `sst-4uentes-infra`. El check estático y el
`npm run check` completo del owner pasaron.

La prueba runtime no alcanzó el bootstrap de Kubernetes. Kind falló durante
`Preparing nodes` porque systemd no pudo crear nuevos objetos inotify y reportó
`Too many open files`.

## Aislamiento de causa

Se ejecutaron dos comprobaciones descartables:

1. el clúster del prototipo con el mount y flags de cifrado;
2. un clúster Kind mínimo con la misma imagen pero sin mount, configuración de
   cifrado ni Secrets.

Ambos fallaron en el mismo punto. Una tercera corrida mínima retenida sólo para
diagnóstico confirmó en el log de systemd el agotamiento inotify y fue eliminada
inmediatamente. Esto demuestra que el template de cifrado no es el disparador.

Observaciones sanitizadas:

- `fs.inotify.max_user_instances=128`;
- `fs.inotify.max_user_watches=524288`;
- Docker y el clúster compartido continuaron accesibles;
- `kind-sst-cluster-dev` conservó sus dos nodos `Ready`;
- no quedó ningún clúster o contenedor cuyo nombre empiece con
  `sst-secret-encryption-prototype`;
- los directorios temporales con claves sintéticas fueron eliminados;
- no se crearon Secrets porque el API server nunca inició;
- no se observaron ni persistieron valores o material criptográfico.

## Owner local

- Base: `origin/develop@e7f6ada7a4f906856816aaa54907a232fd5d3451`.
- Rama: `feat/CR-SST-0221/disposable-secret-encryption-prototype`.
- Commit local: `ec3bf1c`.
- Publicación remota: pendiente de prueba runtime.

## Decisión requerida

El siguiente intento necesita elevar temporalmente
`fs.inotify.max_user_instances` en el host Linux de Docker/WSL y restaurar el
valor observado `128` después del cleanup. Ese sysctl es global para el runtime
Docker y no está incluido en la autorización vigente, aunque no modifica
objetos del clúster compartido.

No se detendrán contenedores ni workloads para liberar recursos. La ejecución
queda a la espera de una autorización exacta para el cambio temporal del
sysctl, o de una recuperación externa equivalente realizada por el operador.
