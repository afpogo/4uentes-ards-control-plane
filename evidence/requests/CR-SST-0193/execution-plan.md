# CR-SST-0193 - Plan De EjecuciÃ³n

Fecha: 2026-08-18

## Objetivo

Implementar en `sst-bend` la primera autoridad canÃ³nica de memoria personal sin
conectar todavÃ­a LLM, RAG, frontend, exportaciÃ³n o sync de dispositivo.

## Base Y Aislamiento

- Base observada: `origin/develop` en `a73aced`.
- Branch: `feat/SST-107/CR-SST-0193/canonical-user-memory`.
- Worktree relativo al control plane: `worktrees/CR-SST-0193-bend`.
- El worktree principal de `sst-bend` tiene cambios ajenos y no serÃ¡ modificado.

## DiseÃ±o De Persistencia

Se usarÃ¡n cinco superficies fÃ­sicas:

- memory spaces por tenant/account/user/application;
- eventos minimizados e idempotentes;
- propuestas con review explÃ­cito;
- records aceptados de kind fact/intention/thread;
- auditorÃ­a de recall sin query, prompt o respuesta.

El borrado convierte el record en tombstone sin contenido y lo excluye de
lecturas antes de su purge. La correcciÃ³n crea una nueva revisiÃ³n y marca la
anterior como superseded.

## HTTP

La superficie se montarÃ¡ bajo `/4uentes/v1/user-memory` y permanecerÃ¡ detrÃ¡s
de `USER_MEMORY_ENABLED=false` por defecto. Toda ruta usa JWT, account context y
un scope de memoria que exige tenant y application desde claims confiables.

El harness HTTP serÃ¡ reproducible y no contendrÃ¡ credenciales reales.

## Owner Documentation

El contrato normativo vivirÃ¡ en `specs/api/user-memory.yaml`; la guÃ­a humana en
`docs/api/27-user-memory.md`. La capability outbound se publicarÃ¡ inicialmente
como `draft`, porque BFF, chatbot y frontend todavÃ­a no adoptaron el contrato.

## QA

Primero se ejecutarÃ¡n tests deterministas sin infraestructura, luego el check
del repo. Migraciones y QA manual autenticado sÃ³lo se ejecutarÃ¡n si Postgres,
el runtime y un token con `tenant_id` y `azp/application_id` estÃ¡n disponibles.
Si no lo estÃ¡n, se registrarÃ¡ readiness y no se declararÃ¡ un PASS manual falso.
