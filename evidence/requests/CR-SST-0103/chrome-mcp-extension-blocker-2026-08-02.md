# CR-SST-0103 - bloqueo de extensiones en Chrome DevTools MCP

Fecha: 2026-08-02  
Estado: bloqueo del harness confirmado

## Hallazgo

El intento manual de cargar la salida unpacked no produjo una tarjeta de la
extensión ni un target inspeccionable. La página `chrome://version` de la misma
instancia confirmó que Chrome fue iniciado con `--disable-extensions`.

La salida Chrome MV3 existe, contiene el manifest y los entrypoints esperados,
y su build automatizado ya había terminado correctamente. Por lo tanto, este
resultado no constituye una falla funcional de `sst-extension`: la instancia
administrada por el harness impide cargar extensiones.

## Configuración observada

- versión fijada del servidor MCP: `chrome-devtools-mcp@0.15.1`;
- transporte: pipe administrado por el servidor MCP;
- Chrome observado: versión 150;
- categoría de herramientas para extensiones: no configurada;
- argumento efectivo de Chrome: `--disable-extensions`.

## Remediación soportada

La documentación oficial actual incorpora una categoría opcional de
herramientas para extensiones. Al habilitarla, el MCP expone operaciones para
instalar, listar, recargar y disparar la acción de una extensión unpacked.

La remediación propuesta es:

1. actualizar la versión fijada del servidor MCP a una versión actual y
   reproducible;
2. iniciar el servidor con `--categoryExtensions=true`;
3. reiniciar el cliente/MCP para aplicar la nueva configuración;
4. instalar la salida unpacked mediante la herramienta dedicada;
5. ejecutar la matriz QA con fixtures locales y evidencia sanitizada.

Con autorización explícita de la persona, la configuración local del cliente
se actualizó para fijar `chrome-devtools-mcp@1.6.0` y habilitar
`--categoryExtensions=true`. El cambio quedó verificado en disco y requiere
reiniciar Codex para reemplazar el servidor MCP que continúa activo con la
configuración anterior.

## Jira

- SST-35: comentario de bloqueo `10302`;
- SST-50: comentario de bloqueo `10303`;
- no se ejecutaron transiciones.

Los comentarios y esta evidencia no contienen credenciales, cookies, JWT,
contenido de páginas privadas ni capturas de usuario.
