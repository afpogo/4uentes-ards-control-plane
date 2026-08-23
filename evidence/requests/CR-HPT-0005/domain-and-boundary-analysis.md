# Análisis De Instrumentos, Operaciones Y Boundary SST

Fecha de observación: 2026-08-21

## Resultado Ejecutivo

La propuesta más estable es modelar el instrumento como referencia, la
operación registrada como hecho auditable y la posición como proyección
reconstruible. Esto evita que el saldo actual borre la historia que explica
cómo se llegó a él.

El modelo no debe reutilizar sin más el `transaction` actual de ingresos y
egresos. Ese agregado representa cash-flow personal. Una operación de mercado
puede generar un efecto de efectivo enlazado, pero compra, venta, cantidad,
precio, comisiones, impuestos y liquidación tienen semántica propia.

## Hechos Observados En El Backend Owner

El backend actual es ARDS/SDD `product-draft`; no existe runtime, framework,
migraciones, OpenAPI ni tests de producto. Sus contratos conceptuales ya fijan:

- scope por `account_id` validado más `stable_subject`;
- dinero decimal exacto serializado como string;
- moneda ISO 4217 y fechas RFC 3339 UTC;
- idempotencia para altas;
- concurrencia optimista;
- anulación lógica y auditoría append-only;
- resúmenes derivados de movimientos activos.

Los instrumentos financieros están fuera del MVP vigente. Por lo tanto, este
documento es una propuesta y no describe una capability implementada.

## Aprendizaje Reutilizable De Alphinance

Alphinance usa una separación `operation -> transaction/effects -> position`:

- `instrument` mantiene identidad y metadata relativamente estable;
- `operation` gobierna el evento de negocio y su trazabilidad;
- detalles especializados viven junto al tipo de instrumento u operación;
- efectivo, holdings, costo y performance son efectos o vistas derivadas.

Este patrón es útil, pero el snapshot también registra drift de estados,
anulaciones, permisos, schedules y contratos no verificables. No debe adoptarse
como esquema listo para implementar.

## Modelo Propuesto

### Instrument

Referencia estable y reutilizable. Debe contener identidad, clase, moneda base,
identificadores de mercado opcionales, nombre y estado de lifecycle. La metadata
específica se extiende por tipo; no se crea una tabla ancha con columnas
opcionales para todos los activos.

Un instrumento no contiene cantidad poseída, costo actual ni resultado.

#### Instrumentos Domésticos O `Home Instrument`

Conviene conservar `home instrument` como nombre visible de producto, pero no
como tipo técnico rígido. El contrato puede representarlo con:

- `origin: USER_DEFINED`;
- `catalog_scope: FINANCE_PROFILE`;
- nombre y clase elegidos por el usuario;
- moneda base;
- uno o más identificadores opcionales.

Los identificadores deben vivir en una colección extensible y no en una sola
columna `isin`:

| Scheme | Uso |
| --- | --- |
| `ISIN` | Identidad internacional cuando exista y haya sido verificada. |
| `TICKER` | Símbolo dependiente de mercado; no es globalmente único. |
| `CUSIP` / `SEDOL` | Identificadores de mercados que los utilicen. |
| `LOCAL` | Código de una bolsa, broker, banco o catálogo local. |
| `OTHER` | Código manual con `issuer` o namespace obligatorio. |

La unicidad correcta es `scheme + value + market/issuer`, no solamente
`value`. Un mismo ticker puede existir en varios mercados.

Si posteriormente el usuario compra el instrumento real, el sistema debe
reconciliar el `USER_DEFINED` con un `MARKET_CATALOG` mediante una relación
auditable. No debe cambiar IDs ni reescribir operaciones históricas. Una
reconciliación puede quedar `PROPOSED`, `CONFIRMED` o `REJECTED` y registrar
quién la aprobó.

### Financial Institution

Representa al proveedor o custodio: broker, banco, billetera u otra institución.
No es la cuenta ni la cartera. Guarda identidad visible y metadata segura; no
credenciales, tokens ni números completos sensibles.

### Financial Account

Representa dónde está custodiado el efectivo o el instrumento. Tipos iniciales:

- `BROKERAGE`: cuenta comitente o cuenta de inversión;
- `CHECKING`: cuenta corriente bancaria;
- `SAVINGS`: caja/cuenta de ahorro;
- `CASH`: efectivo manual;
- `WALLET`: billetera digital;
- `OTHER`: cuenta manual no clasificada.

La distinción concreta es:

```text
broker/banco = financial_institution
cuenta comitente/corriente/ahorro = financial_account
cartera = agrupación personal de cuentas
```

Una cuenta tiene alias, moneda operativa, institución opcional y referencia
externa enmascarada. No mantiene `current_balance` como verdad mutable: efectivo
y holdings se reconstruyen desde efectos posteados.

### Portfolio

Contenedor personal dentro de un `finance_profile`. Agrupa una o más
`financial_account`. La primera rebanada crea una cartera por defecto y permite
cuentas manuales; la sincronización con bancos o brokers queda postergada.

Una cartera no contiene una lista mutable de instrumentos. Se considera que
posee un instrumento cuando sus operaciones posteadas producen una posición no
cero en alguna de sus cuentas. Si se necesita seguir instrumentos sin poseerlos,
eso pertenece a una `watchlist`, no a `position`.

### Investment Operation

Hecho de negocio scoped por `finance_profile` y `portfolio`. Tipos iniciales:

- `BUY`, `SELL`;
- `INCOME` para interés o dividendo con subtipo explícito;
- `FEE`, `TAX`;
- `DEPOSIT`, `WITHDRAWAL`, `TRANSFER`;
- `ADJUSTMENT` bajo permiso y motivo reforzados.

Cada operación registra, según aplique, cuenta financiera, instrumento,
cantidad, precio unitario,
importe bruto, comisiones, impuestos, efecto neto de efectivo, moneda, fecha de
negociación, fecha de liquidación, referencia externa segura e idempotency key.

Una transferencia identifica cuenta origen y destino. Una compra en cuenta
comitente reduce la pata de efectivo y aumenta unidades del instrumento dentro
de esa misma cuenta. Un depósito bancario o interés de caja de ahorro puede
existir sin instrumento de mercado, pero siempre afecta una cuenta.

Una operación posteada no se edita destructivamente. Una corrección crea una
reversa enlazada y, si corresponde, una operación reemplazante.

### Operation Effects

Al postear, la API genera patas explícitas de unidades y efectivo. Esas patas
eliminan ambigüedad de signos y permiten reconstruir posiciones y saldos. La
primera implementación debe decidir si materializa un ledger balanceado o una
representación equivalente con invariantes comprobables.

### Position Y Valuation

`position` es un read model por profile, portfolio e instrumento. Puede
reconstruirse desde operaciones posteadas no revertidas. Costo fiscal por lotes,
P&L realizado y corporative actions quedan para una rebanada posterior.

Una `valuation_observation` registra precio, moneda, `as_of` y procedencia. La
valuación cambia vistas, nunca los hechos originales de una operación.

## Relación Con Cash-Flow Personal

Se mantienen agregados separados:

- `transaction`: ingreso, egreso o ajuste presupuestario;
- `investment_operation`: hecho sobre efectivo y, opcionalmente, instrumento.

Cuando una operación genera un movimiento visible en cash-flow, la API crea un
enlace derivado `source_operation_id`. No se exige que el usuario cargue dos
veces el mismo hecho ni se permite que editar el movimiento derivado reescriba
la operación.

## Auditoría E Invariantes

- Scope obligatorio resuelto en servidor: `[account_id, stable_subject]`.
- Ningún owner o account scope llega desde body o query.
- Idempotencia, operación, efectos, posición y audit event comparten scope.
- Posteo, reversa y reemplazo son atómicos con su evento de auditoría.
- `safe_changes` excluye tokens, descripciones libres, importes y payloads
  completos salvo decisión explícita de clasificación.
- Las categorías de sistema y los instrumentos globales requieren reglas de
  visibilidad y mutabilidad que impidan fuga entre cuentas.
- Importaciones quedan en staging hasta validar owner, moneda, duplicados y
  taxonomía; un archivo importado no es autoridad por sí mismo.

## Boundary SST

La capability pertenece a la solución independiente `finanzas-personales`.
SST es consumidor relacionado.

Ruta recomendada para revisión arquitectónica:

```text
sst-fend -> sst-bend adapter/facade -> finanzas-personales-backend
```

Esta ruta conserva en SST la traducción de sesión, cuenta activa y membership,
y entrega al productor un principal context interno verificable. También sigue
el handoff canónico `backend-api -> backend-bff -> frontend-web` leído desde
`4uentes-ards-core`.

La alternativa directa `sst-fend -> finanzas-personales-backend` necesita una
excepción de arquitectura explícita y no puede basarse en headers elegidos por
el cliente.

## Rebanada Inicial Recomendada

- portfolio por defecto;
- cuentas manuales `BROKERAGE`, `CHECKING`, `SAVINGS`, `CASH` y `WALLET`;
- institución opcional con datos seguros y referencia de cuenta enmascarada;
- instrumentos `CASH`, `TERM_DEPOSIT`, `BOND`, `FUND`, `EQUITY` y
  `USER_DEFINED`;
- identificadores extensibles `ISIN`, `TICKER`, `LOCAL` y `OTHER`;
- operaciones `BUY`, `SELL`, `INCOME`, `FEE`, `TAX`, `DEPOSIT`, `WITHDRAWAL`,
  `TRANSFER`, `ADJUSTMENT`;
- alta idempotente, consulta paginada, posteo y reversa;
- posiciones reconstruibles y saldo de efectivo;
- auditoría append-only;
- harness HTTP versionado con casos de aislamiento y reversa.

Opciones, derivados, lotes fiscales, splits, ejercicio, vencimientos automáticos,
market data online, OCR, IA, importación masiva y ejecución en brokers quedan
fuera de la primera rebanada.

## Decisiones Pendientes

- Aprobar la taxonomía inicial de operaciones.
- Decidir ledger balanceado versus efectos equivalentes verificables.
- Definir la semántica exacta del enlace con `transaction`.
- Decidir si la primera rebanada permite varias carteras o solamente una
  cartera por defecto con varias cuentas.
- Definir el workflow de reconciliación entre `USER_DEFINED` y catálogos reales.
- Aprobar el adapter en `sst-bend` o registrar la excepción directa.
- Definir owners técnico, seguridad, migraciones y operación.
- Cerrar retención, exportación, eliminación, break-glass y trazabilidad
  resistente a manipulación antes de producción.

## Contribución De Subagentes

- `alphinance-source-discovery`: verificó la naturaleza de snapshot, extrajo el
  patrón operations-centered y separó hechos de inferencias.
- `phinance-owner-discovery`: verificó contratos, ausencia de runtime, gaps de
  account scope, auditoría y validación local.
- `control-plane-lifecycle-discovery`: detectó identidades existentes, conflicto
  con CR-HPT-0004, límites de CR-HPT-0003 y el ID libre CR-HPT-0005.

La decisión final y la integración de hallazgos permanecieron en el agente
principal, conforme a la policy de delegación.
