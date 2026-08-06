# CR-4UENTES-0027 - Mobile Layout Implementation Summary

Fecha: 2026-07-04

## Objetivo

Reemplazar el bloqueo mobile desktop-only por un shell mobile lineal y navegable
sin cambiar las rutas internas ni el contenido de cada pantalla.

## Implementacion

- Se removio el nodo visible que mostraba el mensaje desktop-only en mobile.
- El dashboard real queda disponible tambien en viewports mobile.
- El layout desktop conserva el grid lateral existente.
- En mobile, el dashboard pasa a un flujo vertical con navegacion superior
  sticky, foto compacta, botones de accion y grilla de rutas.
- El contenido usa el mismo `<Outlet />` que desktop; no se duplican pantallas ni
  se monta dos veces la ruta activa.
- El scroll mobile usa scroll vertical nativo del documento.
- Se corrigio feedback de QA manual sobre la primera vista:
  - El home pasa de saludo personal amplio a portada profesional centrada.
  - La portada expone rol, propuesta de valor y acciones principales.
  - Se removieron controles informativos innecesarios para que solo queden
    acciones reales.
  - Se restituyo el CTA visible de CV por ser critico para flujo de
    reclutadores, manteniendo la descarga bloqueada por el gate de PDF
    sanitizado aprobado.
  - El header interno agrega identidad, rol y contexto para evitar una entrada
    visualmente vacia.

## Owner Docs

Documentos owner actualizados en `4uentes-portfolio`:

- `docs/architecture/README.md`
- `docs/qa/visual-checklist.md`
- `specs/features/00-index.yaml`

## Limites

Este corte no implementa I18N, no rediseña pantallas internas, no altera la
politica de contacto, no reactiva la descarga de CV y no cambia la taxonomia de
evidencia.

Nota de alcance: el hero usa nuevas claves existentes dentro del namespace
`home`, pero no ejecuta la migracion I18N de tarjetas de experiencia ni
contenido profundo; eso queda en `CR-4UENTES-0022` y siguientes.

## QA

- Build del repo hijo: PASS.
- Smoke HTTP de preview para `/afpogo/me`: PASS.
- Verificacion de bundle: el mensaje desktop-only ya no aparece.
- Chrome DevTools MCP visual QA: bloqueado por perfil Chrome ya abierto fuera
  de este proceso; queda como follow-up operativo.
