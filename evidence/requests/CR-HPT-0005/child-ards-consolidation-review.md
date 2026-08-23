# Consolidación Del ARDS/SDD Owner De Phinance-API

Fecha de observación: 2026-08-21

## Resultado

El ARDS/SDD actual del repo hijo contiene una base correcta para el control de
finanzas personales: aislamiento por cuenta SST, ledger de ingresos/egresos,
resúmenes derivados, idempotencia y audit trail. La idea original de negocio
era más amplia e incluía cuentas, capacidad de ahorro, metas e instrumentos.

La consolidación propuesta no reemplaza el MVP vigente. Lo convierte en la
primera capa de un producto auditable y agrega una segunda capa de patrimonio e
inversión mediante cuentas, carteras, instrumentos y operaciones.

Este documento es evidencia del control plane. No modifica ni sustituye los
contratos owner del backend.

## Fuentes Owner Revisadas

- `ARDS_Phinance_API.md`.
- `07-06_Lluvia_de_ideas_Plataforma_de_finanzas_personales_con_IA-Resumen.md`.
- `backend/AGENTS.md`.
- `backend/specs/00-index.yaml`.
- `backend/specs/api/personal-finance.yaml`.
- `backend/specs/api/sst-integration.yaml`.
- `backend/specs/features/00-index.yaml`.
- `backend/specs/capabilities/outbound/00-index.yaml`.
- `backend/docs/architecture/README.md`.
- `backend/docs/api/README.md`.
- `backend/docs/capabilities/00-overview.md`.
- `backend/docs/org/README.md`.
- `backend/specs/source-map.yaml`.

## Idea De Negocio Consolidada

La propuesta de valor puede expresarse como un ciclo verificable:

1. Registrar de dónde entra y hacia dónde sale el dinero.
2. Explicar esos movimientos mediante cuentas, categorías y contrapartes.
3. Calcular capacidad de ahorro con reglas transparentes.
4. Registrar qué parte del ahorro se transforma en activos.
5. Auditar las operaciones que explican la composición de cada cartera.
6. Medir patrimonio, asignación y evolución sin confundir estimaciones con
   hechos financieros.
7. Incorporar captura asistida, proyecciones o colaboración solamente mediante
   capabilities y requests posteriores.

La auditoría del módulo significa trazabilidad de datos declarados por el
usuario, importados o conciliados. No equivale a una auditoría contable
certificada, verificación bancaria ni confirmación de custodia por un broker.

## Matriz De Conservación Y Evolución

| ARDS owner actual | Decisión | Evolución propuesta |
| --- | --- | --- |
| `finance_profile` | Conservar | Corregir el modelo conceptual para incluir siempre la clave `account_id + stable_subject`. |
| `category` | Conservar | Aplicar a cash-flow; no usarla como clasificación del instrumento. |
| `transaction` | Conservar | Sigue siendo ingreso, egreso o ajuste presupuestario. |
| `summary/cash-flow` | Conservar | Alimenta capacidad de ahorro y aportes disponibles. |
| `audit_event` | Ampliar | Agregar acciones de cuenta, cartera, instrumento, posteo, reversa y reconciliación. |
| `idempotency_key` | Ampliar | Incluir altas y posteos de operaciones bajo el mismo owner scope. |
| `financial_account` | Agregar | Cuenta comitente, corriente, ahorro, efectivo o wallet. |
| `financial_institution` | Agregar | Broker, banco o proveedor; nunca se modela como cuenta o instrumento. |
| `portfolio` | Agregar | Agrupador de cuentas bajo un `finance_profile`. |
| `instrument` | Agregar | Referencia `USER_DEFINED` o proveniente de catálogo de mercado. |
| `instrument_identifier` | Agregar | ISIN, ticker, CUSIP, SEDOL, código local u `OTHER` con namespace. |
| `investment_operation` | Agregar | Compra, venta, renta, comisión, impuesto, aporte, retiro, transferencia o ajuste. |
| `operation_effect` | Agregar | Patas verificables de efectivo y unidades generadas al postear. |
| `position` | Agregar como read model | Se reconstruye por cartera, cuenta e instrumento. |
| `valuation_observation` | Agregar después | Precio `as_of` con moneda y procedencia; no altera operaciones. |

## Separación Entre Ledger Personal Y Patrimonial

El ledger actual responde: "¿En qué gané o gasté dinero?".

El ledger de operaciones responde: "¿Qué hecho explica que tenga estas
unidades, este efectivo invertido y este costo?".

No deben fusionarse en una tabla polimórfica única. La relación se registra de
forma explícita:

- una operación puede producir un movimiento de cash-flow derivado;
- ese movimiento referencia `source_operation_id`;
- el movimiento derivado no puede editar la operación fuente;
- reversar la operación genera efectos compensatorios y actualiza la proyección;
- los resúmenes evitan contar dos veces el mismo hecho.

## Cartera, Broker Y Cuentas

`financial_institution` representa al broker o banco. `financial_account`
representa una cuenta concreta del usuario en esa institución. `portfolio`
agrupa cuentas según el criterio personal del usuario.

Ejemplos:

| Institución | Cuenta | Cartera posible |
| --- | --- | --- |
| Broker local | `BROKERAGE` / cuenta comitente | Inversiones de largo plazo |
| Banco | `SAVINGS` / caja de ahorro | Liquidez y fondo de emergencia |
| Banco | `CHECKING` / cuenta corriente | Flujo operativo personal |
| Sin institución | `CASH` | Efectivo manual |
| Billetera | `WALLET` | Gastos cotidianos |

Una cartera puede agrupar varias cuentas. Una cuenta pertenece a un
`finance_profile` y puede asociarse inicialmente a una cartera. Si en el futuro
se necesita que una misma cuenta contribuya a varias vistas, eso debe resolverse
como proyección o asignación, no duplicando operaciones.

Los aliases y referencias externas deben estar enmascarados. Credenciales,
tokens, claves de broker y números completos sensibles quedan fuera del modelo.

## `Home Instrument` Y Evolución A Mercado Real

El primer instrumento puede ser creado manualmente:

```yaml
origin: USER_DEFINED
catalog_scope: FINANCE_PROFILE
name: "Bono personal TODO"
class: BOND
base_currency: ARS
identifiers:
  - scheme: OTHER
    value: "TODO"
    namespace: "user"
```

Ese instrumento puede recibir operaciones manuales reales informadas por el
usuario. `USER_DEFINED` describe la procedencia del maestro, no que la operación
sea ficticia.

Cuando aparezca una identidad verificable de mercado, la API crea una
reconciliación hacia `MARKET_CATALOG`. El instrumento y sus operaciones
históricas conservan sus IDs. La reconciliación registra estado, evidencia,
actor y fecha.

Un instrumento que el usuario sólo quiere observar pertenece a una `watchlist`.
Una simulación pertenece a un `scenario`. Ninguno crea una posición real ni se
mezcla con operaciones posteadas.

## Capacidad De Ahorro

La idea histórica de capacidad de ahorro puede implementarse sin IA en una
primera versión:

- ingresos activos del período;
- egresos activos del período;
- compromisos o reservas explícitas, cuando exista su contrato;
- transferencias internas excluidas del ingreso/egreso económico;
- aportes a inversión identificados como reasignación patrimonial, no gasto.

Una fórmula inicial puede ser una métrica derivada y explicable. Las
recomendaciones, score de riesgo o asignación sugerida continúan fuera del MVP y
requieren una nueva decisión de producto, seguridad y cumplimiento.

## Roadmap ARDS/SDD Consolidado

### Capa 0: foundation SST

- identidad y membership confiables;
- `account_id + stable_subject`;
- scopes, routing, observabilidad y ownership operativo;
- common policy runtime y harness HTTP.

### Capa 1: cash-flow auditable

- perfil, categorías y `transaction`;
- resúmenes y capacidad de ahorro explicable;
- idempotencia, concurrencia y audit trail.

### Capa 2: patrimonio manual

- instituciones y cuentas financieras manuales;
- cartera por defecto;
- transferencias internas sin doble conteo;
- saldo por cuenta y patrimonio base.

### Capa 3: instrumentos y operaciones

- instrumentos `USER_DEFINED`;
- compra, venta, renta, comisión, impuesto, aporte, retiro y reversa;
- efectos de efectivo/unidades;
- posiciones reconstruibles.

### Capa 4: reconciliación y valuación

- catálogos reales e identificadores verificados;
- reconciliación del instrumento manual;
- observaciones de precio con provenance;
- asignación, costo y performance con contratos explícitos.

### Capas posteriores

- importación de extractos y comprobantes;
- OCR y validación asistida;
- metas y escenarios;
- grupos y sharing;
- insights o IA con consentimiento, minimización y guardrails.

## Cambios Owner Requeridos En Un Futuro CR

Cuando exista aprobación de mutación del repo hijo, el owner debe actualizar
como mínimo:

- `ARDS_Phinance_API.md`: alcance, modelo conceptual, roadmap y criterio de
  éxito;
- `backend/specs/api/personal-finance.yaml`: nuevos recursos e invariantes;
- nuevas specs separadas para portfolio e instrument operations si el contrato
  supera una unidad revisable;
- `backend/specs/features/00-index.yaml`: capas y dependencias;
- `backend/specs/capabilities/`: capability outbound hacia SST;
- `backend/docs/architecture/README.md`: agregados, consistencia y proyecciones;
- `backend/docs/api/README.md`: recursos y semántica de API;
- `backend/specs/source-map.yaml`: referencia al request y evidencia del
  control plane;
- `backend/scripts/check-contracts.js`: validaciones estructurales temporales;
- harness `.http` versionado conforme a `http-qa-harness-policy`.

No se debe actualizar sólo el control plane: la documentación contractual final
pertenece al backend owner.

## Gaps Y Contradicciones Detectados

- `ARDS_Phinance_API.md` enumera `sst_subject` en `finance_profiles`, pero omite
  `account_id`; las specs vigentes exigen ambos.
- El product ARDS declara consumo lógico directo desde `sst-fend`, mientras el
  canon ARDS recomienda revisar un adapter/BFF antes del frontend.
- `primary_consumer: sst-fend` está aceptado localmente, pero el mecanismo de
  PrincipalContext, routing y membership permanece pendiente.
- La idea histórica menciona cuentas, contrapartes e instrumentos, pero el ARDS
  vigente no les asigna recursos, invariantes ni fases propias.
- La denominación local `phinance-api` todavía debe mapearse explícitamente al
  `service_id` canónico `finanzas-personales-backend`.
- `specs/source-map.yaml` aún marca los contratos SST como missing pese a que el
  control plane ya contiene identidad, solución y relaciones draft.
- Los owners de producto, técnica, seguridad, migraciones, operación e
  integración siguen `TODO`.

## Estado Del Repo Hijo

El worktree owner contiene cambios locales extensos y no publicados: retiro del
frontend histórico, redefinición API-only y nuevos contratos backend. Estos
cambios pertenecen al usuario y no fueron modificados por CR-HPT-0005.

La consolidación debe implementarse en una rama o worktree controlado sólo
después de reconciliar esa baseline y aprobar un CR con
`child_repo_mutation_allowed: true`.
