# CR-SST-0103 - preflight para reanudar el QA interactivo

Fecha: 2026-08-02  
Estado: bloqueado por configuración del harness Chrome DevTools MCP

## Alcance

Se reanudó la preparación del QA integrado de captura de páginas autenticadas
con datos ficticios o locales. Jira continúa como mirror operativo y ARDS/SDD
como fuente de verdad.

## Validaciones completadas

- El check completo del control plane terminó correctamente.
- `sst-extension`: check completo PASS, con 27 suites y 123 pruebas; build WXT
  Chrome MV3 PASS.
- `node-auth`: check completo PASS.
- `sst-bend`: check completo PASS. La cobertura protegida quedó declarada como
  parcial porque no se inyectó un JWT en consola.
- `sst-fend`: tipos de módulos CSS PASS, lint sin errores, 30 suites y 201
  pruebas PASS; el servidor de desarrollo compiló correctamente.
- El check agregado de `sst-fend` excedió cinco minutos. Al finalizar el timeout
  se detuvieron solamente los dos procesos huérfanos iniciados por esa ejecución;
  los servidores levantados por la persona permanecieron activos.

## Smokes del stack local

- frontend: HTTP `200`;
- JWKS del BFF: HTTP `200`;
- creación de sesión sin autenticación mediante BFF: HTTP `401` esperado;
- creación de sesión sin autenticación contra backend: HTTP `401` esperado.

No se copiaron credenciales, cookies, tokens ni contenido privado para estas
comprobaciones.

## Estado de Chrome

La conexión MCP de Chrome DevTools está operativa para páginas web y permitió
navegar a la configuración de extensiones, pero no pudo abrir ni cargar la
extensión. Se confirmó que el modo desarrollador está activo. La salida que la
persona debe cargar es `.output/chrome-mv3` del repositorio owner de la
extensión.

El intento manual posterior tampoco cargó la extensión. La inspección de
`chrome://version` confirmó que el Chrome administrado por el MCP fue iniciado
con `--disable-extensions`. Por eso no existe evidencia de que la extensión
haya sido abierta o inspeccionada. La causa, remediación y trazabilidad quedaron
registradas en
`evidence/requests/CR-SST-0103/chrome-mcp-extension-blocker-2026-08-02.md`.

## Trazabilidad Jira

- SST-35: comentario de reanudación `10300`.
- SST-50: comentario de preparación `10301`.
- SST-35: comentario de bloqueo del harness `10302`.
- SST-50: comentario de bloqueo del harness `10303`.
- No se ejecutaron transiciones de los tickets de QA.

Los comentarios omiten rutas locales, URLs privadas completas, credenciales,
cookies, JWT, texto de páginas, imágenes capturadas y datos de usuario.
