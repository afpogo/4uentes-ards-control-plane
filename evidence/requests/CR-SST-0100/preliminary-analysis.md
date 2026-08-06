# CR-SST-0100 - Preliminary analysis

Fecha: 2026-07-04

Contexto:

- `CR-SST-0098` estabilizo la captura visual PDF tab-by-tab.
- `CR-SST-0099` agrego metadata local por snapshot:
  - `outcome`
  - `captureMode`
  - `warnings`
- `CR-SST-0100` debe hacer esa metadata visible en UI de extension sin ampliar
  contratos backend ni exponer contenido privado.

Hipotesis de implementacion:

- El cambio principal debe vivir en `sst-extension`, probablemente en
  `src/ui/quick-save/QuickSaveSurface.tsx` y helpers de presentacion.
- Conviene crear helpers puros para contar:
  - tabs con `outcome: visual-pdf`
  - tabs con `outcome: text-pdf-fallback`
  - tabs con warnings
- La UI debe mostrar metadata y estados, no texto de pagina ni artifact PDF.
- Los warnings deben mapearse a labels humanos sanitizados.

Riesgos:

- `PRIVATE_CONTENT_UI_EXPOSURE`: alto. Mitigacion: usar solo metadata cerrada y
  titulos/URLs ya existentes en la cola; no mostrar body text ni PDF payload.
- `UI_LAYOUT_REGRESSION`: medio. Mitigacion: helpers + tests + build; mantener
  componentes compactos.

Boundary:

- No `node-auth`.
- No `sst-bend`.
- No contrato API nuevo.
- Owner docs de `sst-extension` obligatorios antes del cierre.
