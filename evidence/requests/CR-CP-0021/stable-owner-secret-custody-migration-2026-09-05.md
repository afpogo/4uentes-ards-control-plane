# Gate de migración a custodia estable del owner

Fecha: 2026-09-05. Request: `CR-CP-0021`. Rol primario: runbook de una
decisión humana autorizada. Owner técnico: `afpogo/4uentes-automation`.

## Decisión y autoridad

El operador aprobó la corrección recomendada completa. La policy
`worktree-request-lifecycle-policy` exige integración, readback y retiro
controlado; no convierte el worktree en ubicación operativa permanente. El
owner usa `main` como default branch y no publica `develop`.

La rama `docs/1-trunk-based-agent-flow` queda preservada remotamente por el PR
owner `#2`; esta migración no decide ni fusiona ese PR.

## Precondiciones

- checkout raíz owner limpio;
- source worktree limpio salvo `.secrets` ignorado;
- `origin/main` contiene el PR owner `#3`;
- target raíz `.secrets` ausente e ignorado por Git;
- cuatro source files presentes con los nombres esperados;
- ningún contenedor, proceso o mount depende del source worktree.

## Ejecución

1. Cambiar el checkout raíz limpio a `main` y aplicarle fast-forward exclusivo
   desde `origin/main`.
2. Crear `.secrets` en la raíz con ACL privada.
3. Copiar exactamente los cuatro archivos sin abrirlos ni mostrar contenido.
4. Aplicar ACL privada y comparar sólo nombres y longitudes.
5. Confirmar exclusión Git y Compose canónico presente.
6. Eliminar sólo las cuatro copias source y el directorio source vacío.
7. Confirmar worktree limpio, commit integrado y ausencia de dependencias.
8. Retirar el worktree preservando la branch.

## Stop conditions y rollback

Ante target existente, root dirty, fast-forward imposible, divergencia de
metadata o dependencia runtime, detener sin copiar ni borrar. Si falla antes de
borrar source, retirar solamente targets creados por esta corrida tras verificar
el path absoluto. Después de borrar source, el target raíz pasa a ser la única
custodia y no puede eliminarse automáticamente.

## Evidencia esperada

Registrar SHAs, nombres, longitudes, ignore status, estado Git y retiro del
worktree. No registrar valores, hashes o fingerprints. `.env`, runtime, datos,
workflows, Jira, Kubernetes e infraestructura quedan fuera de alcance.

## Resultado observado

El gate fue publicado por el PR control-plane `#235` y releído en
`93c168057d99a024fcded745d14e76918fdb1750`.

- el checkout raíz owner quedó en `main@9c1e75d`;
- el PR documental owner `#2` permaneció abierto y su branch preservada;
- `.secrets` raíz contiene exactamente cuatro archivos de 64 bytes, con ACL
  privada y exclusión Git;
- no se leyó contenido ni se registraron hashes o fingerprints;
- las cuatro copias source y el directorio source vacío fueron retirados;
- no había procesos ni mounts de contenedores dependientes;
- el worktree `cr-cp-0021-local-secrets-ports` fue retirado limpio;
- sus branches local y remota permanecen preservadas.

El `.env` owner fue preservado sin lectura ni modificación. Su reconciliación y
la validación Compose sin runtime constituyen el siguiente gate.
