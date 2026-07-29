# CR-4UENTES-0036 - Visual QA Results

## Entorno

- Dev server: `npm.cmd run dev -- --host 127.0.0.1 --port 5176`
- Navegador: Chrome DevTools MCP

## Rutas Revisadas

### `/afpogo/experience`

Viewport desktop observado:

- `1536x674`
- Sin overflow horizontal de documento.
- Overflow horizontal esperado en el carrusel de experiencia.
- La introduccion profesional, senales de evidencia y cards de compania se
  renderizan.

Viewport mobile observado:

- `390x844`
- Sin overflow horizontal de documento.
- Overflow horizontal esperado en el carrusel de experiencia.
- Texto principal renderiza en el snapshot sin solapamiento observado.

Evidencia:

- `evidence/requests/CR-4UENTES-0036/chrome-experience-desktop-qa.png`
- `evidence/requests/CR-4UENTES-0036/chrome-experience-mobile-390-qa.png`

### `/afpogo/experience/company/giresa`

Primer hallazgo mobile:

- La grilla de iniciativas mantenia tres columnas en `390px`.
- Se observo overflow horizontal real.

Fix aplicado:

- La grilla de iniciativas pasa a una columna en viewport mobile.
- Header, bloque de informacion e imagen se apilan.

Resultado posterior:

- `390x844`
- Sin overflow horizontal de documento.
- Overflow vertical restante corresponde a bloques colapsados de logros.

Evidencia:

- `evidence/requests/CR-4UENTES-0036/chrome-experience-giresa-mobile-390-qa.png`
- `evidence/requests/CR-4UENTES-0036/chrome-experience-giresa-mobile-390-after-fix.png`

## Consola

Se observo un warning no bloqueante de React Router future flags. No se
observaron errores de consola en la ruta principal durante la revision.
