# Implementación CR-SST-0131

Fecha: 2026-07-12.

- Contrato: `tabs[].articleKind?: web|text` y
  `snapshot.captureMode?: visual-pdf|textual-pdf`.
- La extensión marca captura visual como Web y textual como Text desde la
  decisión de captura, nunca desde `artifactType`.
- `node-auth` valida y preserva ambos campos sin inferencia.
- `sst-bend` prioriza `articleKind`; luego usa `captureMode`. Sólo clientes
  legacy sin ambas metadata conservan fallback MHTML→Web y PDF→Text.
- `artifactType` continúa seleccionando el adaptador/documento, no la semántica
  de sesiones nuevas.

No se modificaron quick-save, históricos ni contenido privado de snapshots.

