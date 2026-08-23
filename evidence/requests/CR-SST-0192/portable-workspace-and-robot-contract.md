# CR-SST-0192 - Workspace Portable Y Vistas De Robots

Fecha: 2026-08-17

## Workspace Portable

El workspace representa memoria aceptada sin convertirse en fuente de verdad.
Debe poder regenerarse desde el estado canÃ³nico y usar Ãºnicamente paths
relativos.

Ãrbol lÃ³gico recomendado:

```text
sst-memory-workspace/
  manifest.yaml
  facts/
  intentions/
  threads/
  provenance/
  tags/
```

`manifest.yaml` declara versiÃ³n de contrato, fecha, referencia opaca al memory
space, versiÃ³n de policy, revisiÃ³n canÃ³nica, entries y hashes. No incluye
tokens, identidad legible innecesaria, chat crudo, secretos, propuestas
rechazadas o contenido borrado.

### Modos

- `logical`: manifest y entries generados en memoria o response.
- `physical`: materializaciÃ³n temporal o administrada en servidor.
- `hybrid`: manifest lÃ³gico con artefacto fÃ­sico de descarga.

Todos son derivados. Una carpeta en desktop o mobile no se convierte en
autoridad. La rÃ©plica offline requiere otra policy para cifrado, claves, sync,
conflictos, cursores, tombstones y revocaciÃ³n.

## Vistas De Robots

Los robots expresan personalidad y funciÃ³n operativa, no roles de account. Los
roles humanos siguen siendo resueltos por auth/membership.

Una vista se construye en `sst-bend` con filtros inmutables:

- tenant, account, user, application y memory space;
- domains, kinds, sources y classifications permitidos;
- entitlements y capabilities del perfil;
- estado `accepted/active` e indexabilidad.

Capabilities iniciales:

- `memory.read`: solicitar recall filtrado.
- `memory.propose`: enviar una propuesta estructurada para validaciÃ³n.
- `memory.handoff`: emitir un intent gobernado por el contrato de handoff.

No se concede inicialmente `memory.accept`, `memory.delete`, `memory.export` ni
acceso directo a Postgres, vector stores o filesystem.

Cada consumo aceptado registra sÃ³lo robot profile, policy version, decision
code y memory IDs. El prompt no puede agregar capabilities.

## Dependencias

- `CR-SST-0193` materializa el estado canÃ³nico y filtros base.
- `CR-SST-0195` implementa manifest, paths y export.
- `CR-SST-0197` formaliza perfiles y capabilities de robots sobre este
  boundary.
