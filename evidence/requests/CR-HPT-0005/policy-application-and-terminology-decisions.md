# Aplicación De Policies Y Decisiones De Terminología

Fecha: 2026-08-21

Estado: registro de gobernanza para `CR-HPT-0005`.

## Propósito

Mantener trazabilidad de las policies aplicadas mientras se diseña la evolución
de Phinance-API. Este documento no aprueba runtime ni sustituye las specs owner
del backend.

## Autoridades

| Superficie | Autoridad |
| --- | --- |
| Canon ARDS/SDD, kinds, profiles y templates | `4uentes-ards-core` |
| Lifecycle, Initiative, catalogación y evidencia cross-repo | `4uentes-orchestor` |
| Dominio, API, persistencia y capability productora | `finanzas-personales-backend` |
| Principal context, membership, facade y comportamiento SST | Owner SST correspondiente |
| Experiencia y presentación web | `sst-fend` |

El control plane conserva la propuesta y el plan. No se convierte en autoridad
del comportamiento que debe vivir en el repo hijo.

## Policies Aplicadas

### `human-doc-language`

- La documentación humana nueva se escribe en español.
- YAML normativo, keys, enums, IDs, paths y contratos API permanecen en inglés
  técnico.
- No se traducen estados ARDS/SDD ni identificadores estables.

### `agent-architecture-boundary-policy`

- No se redefine auth, RBAC, membership, retención ni arquitectura SST.
- No se presenta una estimación como hecho financiero.
- No se clasifica un bien cotidiano como instrumento financiero regulado.
- No se adopta el esquema Alphinance como canon del producto personal.
- Las decisiones pendientes quedan como propuesta o `TODO`.

### `owner-documentation-authority-policy`

- `CR-HPT-0005` no modifica el repo hijo.
- La documentación final de recursos, operaciones, endpoints y read models debe
  vivir en `finanzas-personales/backend`.
- Una futura mutación debe listar rutas owner, validaciones y evidencia.
- El cierre de esa futura CR requerirá `npm run check` en el control plane.

### `agent-task-atomization-policy`

El trabajo queda separado en unidades auditables:

1. `CR-HPT-0005`: terminología, dominio y presentación; control-plane only.
2. `CR-HPT-0008`: primera capability de recursos cotidianos; child mutation.
3. `CR-HPT-TODO-MARKET-INSTRUMENTS`: instrumentos tradicionales y cripto.
4. `CR-SST-TODO`: adopción de la capability desde SST.
5. `CR-HPT-TODO-ECONOMIC-VALIDATION`: validación integrada.

Cada unidad debe declarar inputs, output, riesgo, owner docs y Definition of
Done. Ninguna unidad amplía silenciosamente el alcance de otra.

### `agent-delegation-policy`

- Discovery documental acotado puede delegarse.
- Arquitectura, financial semantics, auth, datos sensibles y ownership no se
  transfieren a un subagente.
- El agente principal verifica y consolida cualquier evidencia delegada.

### `agent-context-management-policy`

- Se leyeron AGENTS, registries, índices y specs relevantes antes de archivos
  amplios.
- Se separan hechos observados de propuestas.
- El snapshot Alphinance se referencia como evidencia histórica, no se copia.
- El volumen Alphinance no disponible en la revisión posterior queda declarado
  como limitación.

### `agent-model-selection-policy`

La tarea se mantiene clasificada como `complex-high-risk-task` por datos
financieros, auditoría, estimaciones y boundaries cross-repo. No se permite una
degradación silenciosa para decisiones sensibles.

### `visual-documentation-as-code-policy`

La evidencia actual usa tablas textuales, no mapas normativos. Si se crea un
mapa de dependencias, lifecycle, secuencia o datos, debe declarar source refs,
fecha, autoridad, fallback textual y pasar el validator local.

### `http-qa-harness-policy`

Phinance-API es owner de HTTP. La implementación futura debe publicar un harness
`.http` reproducible o una excepción aprobada. El gate textual actual
`backend/scripts/check-contracts.js` no reemplaza ese harness.

## Vocabulario Controlado

| Término de producto | Identificador técnico | Significado |
| --- | --- | --- |
| Instrumento cotidiano | `household_economic_resource` | Bien consumible o durable de la economía personal. |
| Instrumento de mercado | `market_instrument` | Activo tradicional o cripto bajo contrato posterior. |
| Movimiento | `transaction` | Ingreso, egreso o ajuste de cash-flow. |
| Evento cotidiano | `household_resource_event` | Adquirir, consumir, vencer, mantener, reparar o disponer. |
| Operación de inversión | `investment_operation` | Hecho que cambia efectivo o unidades de un instrumento. |
| Efecto | `economic_effect` / `operation_effect` | Consecuencia tipada y derivable. |
| Cartera | `portfolio` | Agrupador de cuentas financieras. |
| Cuenta financiera | `financial_account` | Cuenta comitente, corriente, ahorro, efectivo o wallet. |
| Institución | `financial_institution` | Broker, banco o proveedor de custodia. |
| Tenencia | `position` | Read model reconstruible desde operaciones posteadas. |
| Costo de demora | `cost_exposure` | Escenario futuro estimado, no deuda ni pérdida realizada. |
| Costo evitado | `cost_avoidance_estimate` | Estimación, no ahorro contabilizado. |
| Utilidad realizada | `utility_realized` | Beneficio de uso, no profit financiero. |
| Desperdicio | `waste_loss` | Parte adquirida que expiró o no se utilizó. |

## Reglas De Honestidad Financiera

- `financial_instrument` queda reservado para activos que cumplan el contrato
  de instrumento de mercado aplicable.
- `household_economic_resource` nunca se incluye en rentabilidad de inversiones.
- `utility_realized` no se suma a ingresos, patrimonio ni P&L.
- `cost_avoidance_estimate` no aumenta ahorro ni saldo disponible.
- `cost_exposure` declara rango, horizonte, assumptions, fuente y confianza.
- Un gasto de mantenimiento puede preservar capacidad útil sin producir una
  ganancia monetaria.
- La expiración registra evento y desperdicio sin alterar el gasto original.
- Los read models se reconstruyen desde hechos; no corrigen silenciosamente su
  fuente.

## Regla De Paths E Identidades

- No se agregan paths locales absolutos a catalog, solutions, Initiatives o
  request YAML.
- Alphinance permanece como snapshot de evidencia.
- `finanzas-personales-backend` continúa como única identidad productora.
- `phinance-api` debe tratarse como nombre de producto/runtime y mapearse al
  service ID canónico, no competir con él.

## Gate Para Avanzar A Owner Documentation

Antes de crear una CR con mutación del backend deben resolverse o declararse
como `TODO` controlados:

- nombre de producto final para instrumentos cotidianos;
- recursos y eventos de la primera rebanada;
- separación entre hechos y estimaciones;
- reglas de privacidad;
- owners técnico, seguridad, migraciones y operación;
- dependency y estado de CR-HPT-0002/0003;
- rutas owner exactas y validaciones requeridas.
