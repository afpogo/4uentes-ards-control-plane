# CR-SST-0099 - Preliminary analysis

## Contexto

`CR-SST-0098` dejo estable el primer flujo end-to-end de session capture:

- captura local desde `sst-extension`;
- materializacion PDF por pestana;
- submit a `node-auth`;
- ingestion en SST con status `201`;
- generacion de PDFs.

Durante ese ciclo aparecieron degradaciones que hoy quedan implicitas o se
expresan como errores genericos: permisos host, paginas internas, tabs no
HTTP(S), timeouts, fallback textual y fallas de materializacion. `CR-SST-0099`
debe hacer esos resultados explicitos y persistibles en la cola local de la
extension.

## Decision De Alcance

Este CR debe limitarse a `sst-extension` y al control-plane:

- definir una taxonomia local de outcome/warnings por tab;
- mantener compatibilidad con items existentes de la cola local;
- no cambiar `sst-bend`, `node-auth`, contratos backend ni persistencia SST;
- no registrar contenido privado ni PDFs reales en evidencia.

## Taxonomia Inicial Propuesta

Campos candidatos:

- `snapshot.outcome`: `visual-pdf`, `text-pdf-fallback`, `skipped`,
  `failed`.
- `snapshot.captureMode`: `visual-pdf`, `textual-pdf`, `none`.
- `warnings[]`: lista sanitizada de codigos por tab.

Codigos iniciales sugeridos:

- `unsupported-url`
- `host-permission-denied`
- `tab-load-timeout`
- `capture-timeout`
- `pdf-materialization-failed`
- `internal-browser-page`
- `non-http-url`
- `storage-warning`

La decision final debe ajustarse al shape existente en `src/shared/sessions.ts`
y normalizadores de storage.

## Riesgos

- Compatibilidad: items ya guardados en storage deben normalizar sin perderse.
- Payload: el outbound hacia `node-auth` no debe romper el contrato ya validado.
- Privacidad: warnings no deben incluir texto de pagina, cookies, JWTs, URLs
  sensibles completas ni PDFs.
- UI futura: `CR-SST-0100` consumira esta taxonomia; este CR no debe resolver
  toda la presentacion visual.

## Definition Of Done

- Outcome/warnings quedan tipados y normalizados.
- Items antiguos siguen cargando correctamente.
- Payload hacia `node-auth` conserva compatibilidad.
- Owner docs de `sst-extension` quedan actualizados.
- Tests focales y `pnpm check` pasan.
- Control-plane `npm.cmd run check` pasa.
