# Inicio De QA Manual De Captura Privada

## Estado

- Fecha: `2026-07-19`.
- Request: `CR-SST-0103`.
- Jira mirror: `SST-35`.
- Disposicion: ejecucion iniciada por solicitud explicita del usuario.
- QA manual ejecutada al crear esta evidencia: no; comienza despues del
  preflight automatizado y de preparar Chrome.

## Limites Aplicados

- Usar un usuario y una pagina autenticada ficticios o locales.
- El usuario ingresa sus credenciales directamente en Chrome.
- No registrar credenciales, cookies, tokens, HTML, PDF, URLs privadas
  completas ni contenido privado en evidencia.
- No probar inicio de sesion autonomo, captura sin accion del usuario ni
  revelado de secretos.
- Separar resultados de producto, infraestructura y control del navegador.

## Prerrequisitos Observados

- `CR-SST-0137` a `CR-SST-0140` conservan estado `in-progress`, pero sus
  artefactos locales declaran implementados los contratos de backend, BFF,
  productor de extension y consumidor frontend.
- Sus cierres dependen precisamente de la validacion integrada que comienza en
  este CR; por lo tanto no forman un bloqueo circular para iniciar la QA.
- `CR-SST-0103` cuenta con plan aprobado y permite mutacion acotada de
  `sst-extension` si la validacion descubre un defecto. El inicio es
  validation-first y no presupone cambios de runtime.

## Secuencia

1. Ejecutar `pnpm test`, `pnpm build` y `pnpm check` en `sst-extension`.
2. Verificar servicios locales requeridos y preparar fixture ficticio.
3. Cargar la salida WXT vigente en un Chrome visible de QA.
4. Entregar control al usuario para autenticacion.
5. Ejecutar la matriz manual y registrar evidencia sanitizada.

## Preflight Ejecutado

- `pnpm test`: PASS, 26 archivos y 106 tests.
- `pnpm build`: PASS, salida vigente en `.output/chrome-mv3`.
- `pnpm check`: PASS, baseline, tests y build completos.
- Cluster local: pods de `node-auth`, `sst-bend`, `sst-fend`, bases de datos e
  ingress observados `Running`.
- Endpoint unico `http://localhost:8088/`: `200`.
- JWKS publico: `200` sin registrar su contenido.

## Superficie De Navegador

- El navegador integrado de Codex volvio a fallar antes de abrir Chrome por
  ausencia de la configuracion interna `sandboxPolicy`, incluso despues de
  reiniciar su conexion.
- Disposicion: limitacion de herramienta, no fallo de `sst-extension`.
- Se inicio Chrome local visible con un perfil temporal aislado y la salida
  `.output/chrome-mv3` cargada como extension desempaquetada.
- La ejecucion queda en pausa segura para que el usuario ingrese localmente sus
  credenciales ficticias. Ninguna credencial se envia al agente o a evidencia.
