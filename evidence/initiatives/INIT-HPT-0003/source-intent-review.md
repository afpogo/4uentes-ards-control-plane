# Revisión De Intención De Captura Documental

Fecha: 2026-08-21

## Resultado

Se registra una Initiative independiente para la futura captura de facturas,
tickets y comprobantes mediante foto. La separación evita ampliar
silenciosamente `INIT-HPT-0002`, dedicada a recursos económicos cotidianos,
carteras e instrumentos.

La API de Phinance todavía no fue levantada. Por lo tanto, esta Initiative no
autoriza owner documentation, endpoints, runtime, storage, OCR, IA, colas,
mobile UI ni infraestructura.

## Intención Preservada

- El usuario podrá capturar una imagen desde celular o seleccionar un archivo.
- El sistema intentará clasificar factura, ticket, recibo u otro documento.
- La extracción producirá valores candidatos con confianza y provenance.
- Validaciones determinísticas revisarán estructura, aritmética, fechas,
  moneda y posibles duplicados.
- El usuario revisará y corregirá antes de confirmar.
- Sólo la confirmación podrá materializar un movimiento o propuesta de recurso.
- Todo el flujo conservará account scope, idempotencia y auditoría.

## Regla De Producto

`detected`, `extracted` y `validated` no significan `verified` ni `posted`.
Una verificación externa futura requerirá fuente autorizada y contrato propio.
