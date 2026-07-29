# CR-4UENTES-0027 - Validation Results

Fecha: 2026-07-04

## Repo Hijo

Comando:

```powershell
npm.cmd run check
```

Resultado: PASS.

Notas:

- La ejecucion escalada paso correctamente despues del rework visual de QA y
  del ajuste de espaciado/acciones del home.
- El CTA de CV fue restituido como accion visible de portada, pero la descarga
  queda deshabilitada hasta reemplazo sanitizado aprobado.
- `tsc --noEmit` y `vite build` finalizaron sin errores.

## Preview Smoke

Comando:

```powershell
curl.exe -s -I http://127.0.0.1:4193/
curl.exe -s -I http://127.0.0.1:4193/afpogo/me
```

Resultado: PASS, `HTTP/1.1 200 OK` para home y ruta interna.

Instancia temporal:

- Preview local en `127.0.0.1:4193`.
- PID padre usado: `36236`.
- PID listener residual apagado: `38888`.
- Resultado operativo: instancia apagada al finalizar la prueba; el puerto
  `4193` dejo de responder.

## Bundle Check

Resultado: PASS para el blocker desktop-only y para el rework visual.

Notas:

- La frase `solamente para la version Desktop` ya no aparece en `src` ni
  `dist`.
- La frase `Lo sentimos` todavia aparece en otro flujo legitimo de certificados
  faltantes y no pertenece al blocker mobile.
- El CSS generado contiene las clases del nuevo hero profesional y del header
  interno (`section_hero`, `headerIdentity`).

## Chrome DevTools MCP

Resultado: BLOCKED.

Motivo:

- Chrome DevTools MCP reporto un perfil Chrome ya abierto y no permitio listar
  paginas ni abrir una nueva pagina.
- No se detuvo el proceso ambiguo porque la policy de OAuth/browser indica no
  cerrar procesos no identificados sin aprobacion especifica.

## Control Plane

Comando:

```powershell
npm.cmd run check
```

Resultado: PASS.

Resumen:

- Catalog: 5 OK, 0 WARN, 0 FAIL.
- Local bindings: 39 OK, 0 WARN, 0 FAIL.
- State model: 42 OK, 0 WARN, 0 FAIL.
- Initiatives: 9 OK, 0 WARN, 0 FAIL.
- Owner documentation gate: 33 OK, 0 WARN, 0 FAIL.
