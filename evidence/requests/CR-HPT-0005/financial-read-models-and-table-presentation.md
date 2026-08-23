# Read Models Y Presentación De Valores Financieros

Fecha de observación: 2026-08-21

Estado: propuesta para revisión, no contrato owner aprobado.

## Propósito

Definir cómo Phinance-API puede presentar movimientos, operaciones, tenencias,
efectivo y rentabilidad sin confundir hechos auditados, proyecciones derivadas y
valuaciones externas.

La propuesta reutiliza las familias funcionales observadas en el snapshot de
Alphinance: Tabla de Operaciones, holdings/tenencias, instrumentos con posición,
saldos, performance, exposición, rentabilidad y eficiencia de trades. No copia
sus contratos ni afirma equivalencia de columnas o fórmulas.

El volumen local que contenía el snapshot Alphinance no estaba montado durante
esta revisión final. Las categorías comparadas provienen de la evidencia
capturada en el discovery previo; las columnas siguientes son diseño propuesto
para el mercado personal.

## Principios De Presentación

- La API entrega valores numéricos como strings decimales; `sst-fend` aplica
  locale, separadores, símbolos y redondeo visual.
- Cada monto viaja con moneda ISO 4217.
- Cada cantidad, precio y porcentaje declara precision o conserva el decimal
  canónico sin conversión a `float`.
- `null` significa desconocido o no calculable; `"0"` significa cero conocido.
- Toda proyección declara `asOf` y timezone o usa RFC 3339 UTC.
- Una cifra convertida declara moneda de reporte, tasa FX, fuente y fecha de la
  tasa. Sin ese contrato no se agregan monedas diferentes.
- Los estados se transmiten como códigos estables. La traducción humana
  pertenece al frontend.
- Las referencias de cuentas se muestran enmascaradas.
- Color puede reforzar ganancia/pérdida o estado, pero siempre debe existir
  signo, etiqueta o texto equivalente.
- Un read model puede regenerarse; no reemplaza operaciones, transacciones ni
  audit events como fuentes de verdad.

## Tabla De Movimientos De Cash-Flow

Pregunta: "¿Qué entradas, salidas y ajustes afectaron mi economía personal?".

Fuente: `transaction` en estado `ACTIVE` o `VOIDED`.

| Columna API | Significado | Regla |
| --- | --- | --- |
| `occurredAt` | Fecha económica | RFC 3339; no confundir con `createdAt`. |
| `account` | Cuenta financiera | Alias seguro y tipo; puede ser `null` durante compatibilidad. |
| `type` | `INCOME`, `EXPENSE`, `ADJUSTMENT` | El tipo define dirección; `amount` permanece positivo. |
| `category` | Categoría de cash-flow | No es clase de instrumento. |
| `counterparty` | Comercio/persona opcional | Datos minimizados y bajo policy futura. |
| `description` | Texto del usuario | No se replica en logs ni audit `safe_changes`. |
| `amount` | Monto original positivo | String decimal. |
| `currency` | Moneda original | ISO 4217. |
| `displaySignedAmount` | Proyección opcional | Derivada; nunca reemplaza `type + amount`. |
| `status` | `ACTIVE` o `VOIDED` | Un void conserva historia y sale de resúmenes activos. |
| `source` | `MANUAL`, `DERIVED_OPERATION`, futuro `IMPORTED` | Permite evitar doble conteo. |
| `sourceOperationId` | Operación originante | Presente cuando el movimiento es derivado. |

Orden por defecto: `occurredAt desc, id desc`. Paginación cursor-based.

## Tabla De Operaciones De Inversión

Pregunta: "¿Qué hechos explican mis unidades, efectivo invertido y costo?".

Fuente: `investment_operation` y sus `operation_effects`.

| Columna API | Significado | Regla |
| --- | --- | --- |
| `tradeDate` | Fecha del hecho económico | Obligatoria para compra/venta. |
| `settlementDate` | Fecha de liquidación | Opcional mientras no exista broker settlement. |
| `portfolio` | Cartera | ID y nombre scoped. |
| `account` | Cuenta afectada | Obligatoria; transferencia agrega origen y destino. |
| `type` | Tipo de operación | `BUY`, `SELL`, `INCOME`, `FEE`, `TAX`, `DEPOSIT`, `WITHDRAWAL`, `TRANSFER`, `ADJUSTMENT`. |
| `instrument` | Instrumento opcional | Requerido cuando existen efectos de unidades. |
| `quantity` | Unidades | Decimal; signo derivado del tipo/efecto. |
| `unitPrice` | Precio unitario original | Money con moneda de negociación. |
| `grossAmount` | Cantidad por precio | Debe reconciliar con precision declarada. |
| `fees` | Comisiones | Money separada, no escondida en precio. |
| `taxes` | Impuestos | Money separada. |
| `netCashEffect` | Efecto neto de efectivo | Derivado de patas posteadas. |
| `status` | Lifecycle financiero | `DRAFT`, `POSTED`, `REVERSED` o `CANCELLED`. |
| `provenance` | Procedencia | `USER_REPORTED`, futuro `IMPORTED` o `BROKER_RECONCILED`. |
| `reversalOf` | Operación revertida | Nunca se borra el hecho original. |
| `auditState` | Integridad documental | Indica si tiene actor, evidencia y evento de auditoría completos. |

`POSTED` significa que produjo efectos contables internos. No significa que un
broker haya confirmado ejecución o liquidación. Si en el futuro se integran
órdenes reales, `orderStatus` y `settlementStatus` deben ser lifecycles
separados.

## Tabla De Tenencias O Posiciones

Pregunta: "¿Qué tengo a una fecha de corte y cómo se explica?".

Fuente: proyección de operaciones `POSTED` no revertidas.

| Columna API | Significado | Regla |
| --- | --- | --- |
| `asOf` | Fecha de corte | Obligatoria. |
| `portfolio` | Cartera | Scope de agregación. |
| `account` | Cuenta custodio/manual | Permite desglose por broker/banco. |
| `instrument` | Identidad estable | Incluye `origin` y mejor identificador disponible. |
| `quantity` | Unidades netas | Reconstruible desde efectos. |
| `costMethod` | Método de costo | Ejemplo inicial `WEIGHTED_AVERAGE`; lotes quedan diferidos. |
| `costBasis` | Costo remanente | Money en moneda de costo. |
| `averageUnitCost` | Costo promedio | Derivado; `null` si no aplica. |
| `valuationPrice` | Precio de valuación | Incluye fuente y `priceAsOf`. |
| `marketValue` | Cantidad por precio | `null` si falta valuación confiable. |
| `unrealizedPnl` | Resultado no realizado | `marketValue - costBasis` bajo la misma moneda. |
| `unrealizedPnlPercent` | Resultado porcentual | `null` si costo base es cero/no disponible. |
| `valuationStatus` | Calidad de valuación | `UNVALUED`, `STALE`, `CURRENT`, `MANUAL`. |

Una posición cero puede omitirse de la tabla activa y permanecer accesible en
historial. Instrumentos observados sin tenencia pertenecen a `watchlist`.

## Tabla De Saldos De Efectivo

Pregunta: "¿Cuánto efectivo explica el ledger por cuenta y moneda?".

| Columna API | Significado | Regla |
| --- | --- | --- |
| `asOf` | Fecha de corte | Obligatoria. |
| `account` | Cuenta | Alias, tipo e institución segura. |
| `currency` | Moneda | Una fila por moneda. |
| `bookBalance` | Saldo posteado | Fuente de verdad interna derivada. |
| `pendingEffect` | Efectos no posteados | Primera versión puede devolver `null`. |
| `projectedBalance` | Book más pending | Sólo si existe contrato de pending. |
| `externalReportedBalance` | Saldo informado por tercero | Separado; nunca sobreescribe `bookBalance`. |
| `reconciliationDifference` | Diferencia | Sólo cuando ambos saldos y fechas son comparables. |

No usar `availableBalance` hasta definir reservas, operaciones pendientes y
semántica del proveedor externo.

## Resumen De Cartera

Pregunta: "¿Cuál es la composición y valor estimado de mi cartera?".

| Valor | Definición |
| --- | --- |
| `cashValue` | Efectivo de cuentas incluidas, por moneda/reporting currency. |
| `instrumentMarketValue` | Suma de posiciones valuadas compatibles. |
| `unvaluedCostBasis` | Costo de posiciones sin valuación; se presenta separado. |
| `portfolioMarketValue` | Efectivo más market value valuado. |
| `netContributions` | Aportes menos retiros externos. |
| `allocationByInstrumentClass` | Porcentaje sobre market value valuado. |
| `valuationCoveragePercent` | Parte del costo/posiciones con precio utilizable. |
| `asOf` | Fecha de corte y, si aplica, fecha de FX. |

No usar `AUM` en la experiencia personal. `portfolioMarketValue` describe mejor
el valor estimado de activos; `netWorth` sólo corresponde cuando también se
modelan pasivos y su valuación.

## Tabla De Rentabilidad

Pregunta: "¿Qué resultado explica el período y con qué método?".

| Columna API | Significado | Regla |
| --- | --- | --- |
| `periodStart`, `periodEnd` | Ventana | Fechas explícitas. |
| `openingValue`, `closingValue` | Valores de corte | Misma moneda y política de valuación. |
| `contributions`, `withdrawals` | Flujos externos | Transferencias internas excluidas. |
| `realizedPnl` | Resultado de disposiciones | Depende del método de costo declarado. |
| `unrealizedPnl` | Variación no realizada | Requiere valuación comparable. |
| `investmentIncome` | Interés/dividendos | Separado de aportes. |
| `fees`, `taxes` | Costos del período | No ocultarlos dentro del retorno. |
| `totalPnl` | Resultado absoluto | Fórmula versionada y expuesta. |
| `returnPercent` | Retorno porcentual | Incluye `returnMethod`; `null` si denominador no es válido. |
| `returnMethod` | Método | Inicial `SIMPLE`; `TWR`/`MWR` requieren contratos posteriores. |
| `valuationCoveragePercent` | Calidad | Evita presentar falsa exactitud. |

Una primera versión puede publicar resultados absolutos y `SIMPLE_RETURN`.
TWR, MWR/XIRR, anualización, benchmarks y eficiencia de trades quedan
diferidos hasta definir flujos, precios y tests de propiedades financieras.

## Tabla De Estados Y Auditoría

Pregunta: "¿Qué ocurrió, en qué estado está y qué evidencia lo respalda?".

| Recurso | Estados iniciales | Transiciones auditables |
| --- | --- | --- |
| `transaction` | `ACTIVE`, `VOIDED` | create, update, void. |
| `investment_operation` | `DRAFT`, `POSTED`, `REVERSED`, `CANCELLED` | create draft, post, reverse, cancel draft. |
| `instrument_reconciliation` | `PROPOSED`, `CONFIRMED`, `REJECTED` | propose, confirm, reject. |
| `valuation_observation` | `CURRENT`, `STALE`, `REJECTED` | ingest/manual create, supersede, reject. |
| futuro `external_order` | Lifecycle separado | submit, execute, settle, fail/cancel. |

La UI puede presentar una actividad unificada, pero la API conserva
`resourceType`, `resourceId`, `action`, `actor`, `occurredAt`, `requestId`,
`correlationId` y `safeChanges`. La actividad unificada no convierte todos los
recursos en un mismo agregado.

## Endpoints De Lectura Candidatos

Estos paths son hipótesis y requieren owner approval:

```text
GET /transactions
GET /investment-operations
GET /portfolios/{portfolioId}/positions
GET /portfolios/{portfolioId}/cash-balances
GET /portfolios/{portfolioId}/summary
GET /portfolios/{portfolioId}/performance
GET /audit-events
```

Filtros comunes candidatos:

- `from`, `to`, `asOf`;
- `portfolioId`, `accountId`, `instrumentId`;
- `currency`, `status`, `type`, `source`;
- cursor y limit con sort estable.

`portfolioId`, `accountId` e `instrumentId` filtran recursos ya scoped por el
principal resuelto. Nunca seleccionan owner, subject o SST account scope.

## Criterios De Aceptación Para Aprobar El Contrato

- Cada columna identifica su fuente: hecho, derivación o valuación externa.
- Toda fórmula financiera queda versionada y cubierta por ejemplos/tests.
- No se agregan monedas diferentes sin FX y provenance.
- Fees, taxes, income y aportes no se mezclan silenciosamente.
- Transferencias internas no inflan ingresos, egresos ni aportes.
- Operaciones revertidas conservan historia y producen efectos compensatorios.
- Las posiciones se pueden reconstruir desde operaciones.
- El frontend no recalcula reglas financieras normativas; sólo formatea y
  presenta los valores del contrato.
- Estados, fechas de corte, cobertura de valuación y datos faltantes son
  visibles al usuario.

## Decisiones Pendientes

- Método inicial de costo: promedio ponderado versus lotes.
- Precision máxima de cantidades y precios por clase de instrumento.
- Política de precios manuales y expiración/staleness.
- Fórmula exacta y versión de `SIMPLE_RETURN`.
- Tratamiento fiscal de fees e impuestos por jurisdicción.
- Si la primera entrega incluye performance o sólo operaciones, posiciones y
  costo.
- Contrato FX y moneda de reporte.
- Columnas responsivas prioritarias que `sst-fend` mostrará en desktop y mobile.
