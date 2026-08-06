# CR-4UENTES-0024 - Validation Results

Fecha: 2026-07-05

## Repo Hijo

Comando:

```powershell
npm.cmd run check
```

Resultado: PASS.

Notas:

- `tsc --noEmit` y `vite build` finalizaron sin errores.
- El fix del toggle de idioma compila correctamente.

## Source QA

Resultado: PASS.

Checks:

- `PortFolioLayout` conecta `handleTranslateClick` al boton de idioma.
- `PortFolioLayout` no conserva `btn--disabled` en el control de idioma.
- No quedan labels activos hardcodeados de `Logros`, `Tecnologias`,
  `ver mas` o `ver menos` en los componentes migrados.
- Strings restantes de experiencia estan en `Experience.i18n.ts` o en
  fallbacks legacy de datos.

## Preview Smoke

Comandos:

```powershell
curl.exe -s -I http://127.0.0.1:4194/
curl.exe -s -I http://127.0.0.1:4194/afpogo/experience
curl.exe -s -I http://127.0.0.1:4194/afpogo/experience/company/giresa
```

Resultado: PASS, `HTTP/1.1 200 OK` para home, experiencia y detalle de Gire.

Instancia temporal:

- Preview local en `127.0.0.1:4194`.
- PID padre usado: `40464`.
- PID listener residual apagado: `34136`.
- Resultado operativo: instancia apagada al finalizar la prueba; el puerto
  `4194` dejo de responder.

## Control Plane

Pendiente de ejecutar despues de esta actualizacion de evidencia.
