# CR-4UENTES-0035 - Visual QA Results

Fecha: 2026-07-07

## Herramienta

Chrome DevTools MCP.

## Ruta

```text
http://127.0.0.1:4197/afpogo/projects/all
```

## Evidencia

- `chrome-projects-mobile-390.png`: captura inicial mobile.
- `chrome-projects-desktop-1366.png`: captura desktop inicial.
- `chrome-projects-mobile-390-after-fix.png`: captura luego del primer ajuste.
- `chrome-projects-mobile-390-footer-fixed.png`: captura mobile final.
- `chrome-projects-desktop-1366-final.png`: captura desktop final.

## Resultado

PASS con observacion.

Validado:

- Las cards muestran badge de evidencia.
- Se muestra disponibilidad de repositorio publico.
- Se muestra resumen de rol/contribucion.
- Se muestra resumen de evidencia y limite editorial de claim.
- Los botones de repositorio quedan visibles y accionables cuando
  `publicRepoAllowed` es true.
- No se observaron errores de aplicacion en consola.
- Se corrigio solapamiento mobile del footer sobre las cards.

Observacion:

- La consola mantiene un warning futuro de React Router v7. No fue introducido
  por este CR y no bloquea la validacion funcional.
- El filtro horizontal de proyectos puede requerir una mejora visual posterior
  para que la ultima opcion no quede parcialmente fuera de viewport en mobile.
