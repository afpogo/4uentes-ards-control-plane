# Recursos Económicos Cotidianos Y Costo De Demora

Fecha de observación: 2026-08-21

Estado: hipótesis de dominio para revisión, no contrato owner aprobado.

## Resultado

Phinance puede introducir conceptos financieros antes de exponer acciones,
bonos o cripto mediante objetos cotidianos que el usuario ya comprende. Comprar
leche, mantener un auto o reparar un electrodoméstico son decisiones económicas
porque combinan efectivo, utilidad, tiempo, desperdicio, condición y riesgo de
costos futuros.

En la experiencia de producto pueden llamarse `instrumentos cotidianos`. En el
contrato técnico se modelan como `household_economic_resource`, nunca como
`financial_instrument`. Esto evita confusión contable, regulatoria y analítica.

## Idea Educativa

El objetivo no es convencer al usuario de que todo gasto es una inversión. El
objetivo es mostrar que un gasto puede tener efectos económicos distintos:

- satisfacer una necesidad;
- conservar una capacidad útil;
- prevenir una pérdida mayor;
- desperdiciarse por vencimiento o falta de uso;
- desplazar efectivo que podría destinarse a otra finalidad.

El beneficio positivo no se presenta automáticamente como ganancia monetaria.
Puede ser utilidad realizada, continuidad, seguridad, tiempo ahorrado o una
estimación explícita de costo evitado.

## Modelo Conceptual

### Household Economic Resource

Bien personal cuya cantidad o condición cambia a través de eventos.

Clases iniciales:

- `CONSUMABLE`: alimento, producto de limpieza, medicamento u otro bien que se
  consume, vence o desperdicia;
- `DURABLE_ASSET`: auto, bicicleta, electrodoméstico, herramienta o equipo del
  hogar que presta servicio durante un período.

No se modela el servicio de taller como recurso. El auto es el recurso; la
reparación es una operación/evento sobre él.

Campos candidatos:

| Campo | Uso |
| --- | --- |
| `id` | Identidad opaca scoped por `finance_profile`. |
| `class` | `CONSUMABLE` o `DURABLE_ASSET`. |
| `name` | Nombre definido por el usuario. |
| `economicCategory` | `FOOD`, `TRANSPORT`, `HEALTH`, `HOME`, `EDUCATION`, `OTHER`. |
| `quantity`, `unit` | Cantidad física cuando sea relevante. |
| `acquiredAt` | Fecha de adquisición. |
| `expiresAt` | Fecha de vencimiento, opcional. |
| `condition` | Estado de un durable, con vocabulario controlado. |
| `replacementCost` | Estimación fechada; no valor contable obligatorio. |
| `sourceTransactionId` | Gasto que originó la adquisición o reparación. |
| `status` | `ACTIVE`, `CONSUMED`, `EXPIRED`, `DISPOSED`. |

### Household Resource Event

Evento auditable que explica el cambio del recurso:

- `ACQUIRE`;
- `CONSUME`;
- `EXPIRE`;
- `WASTE`;
- `MAINTAIN`;
- `REPAIR`;
- `DEFER`;
- `DISPOSE`.

El evento referencia una `transaction` cuando existe un movimiento de dinero.
Los eventos sin efectivo, como consumir o registrar vencimiento, no inventan una
nueva transacción.

### Economic Effect

Consecuencia tipada y separada del evento:

- `CASH_OUTFLOW` o `CASH_INFLOW`: hecho monetario enlazado al ledger;
- `QUANTITY_CHANGE`: unidades adquiridas, consumidas o desperdiciadas;
- `CONDITION_CHANGE`: mejora o deterioro de un durable;
- `UTILITY_REALIZED`: necesidad o uso satisfecho, preferentemente no monetario;
- `WASTE_LOSS`: costo atribuible a cantidad vencida/no utilizada;
- `COST_AVOIDANCE_ESTIMATE`: escenario de costo futuro potencialmente evitado.

Los efectos estimados nunca se contabilizan como saldo, ingreso, profit o
rentabilidad. Se presentan con etiqueta de estimación.

## Caso Leche

Flujo propuesto:

1. `transaction(EXPENSE)` registra el pago.
2. `ACQUIRE` incorpora cantidad al recurso `CONSUMABLE`.
3. `CONSUME` reduce cantidad y registra utilidad realizada.
4. `EXPIRE` o `WASTE` reduce cantidad no utilizada.
5. La vista educativa compara cantidad consumida y desperdiciada.

Valores posibles:

| Valor | Naturaleza |
| --- | --- |
| Precio pagado | Hecho monetario. |
| Cantidad adquirida | Hecho declarado. |
| Cantidad consumida | Hecho declarado. |
| Cantidad vencida | Hecho declarado o estimado, identificado como tal. |
| Costo desperdiciado | Derivación del costo unitario por cantidad desperdiciada. |
| Utilidad alimentaria | Beneficio cualitativo; no retorno financiero. |

La depreciación temporal puede representarse como vida útil remanente o
probabilidad de uso antes del vencimiento. No es necesario asignar un precio de
mercado diario a la leche.

## Caso Auto Y Taller

El auto es `DURABLE_ASSET`. La visita al taller es `MAINTAIN` o `REPAIR` y su
pago se vincula a una `transaction(EXPENSE)`.

La operación puede producir:

- cash outflow conocido;
- condition change declarado;
- continuidad de movilidad;
- próxima fecha o kilometraje de mantenimiento;
- escenario de costo de demora.

No llevar el auto al mecánico no crea inmediatamente una deuda ni una pérdida
contable. Crea una `cost_exposure` estimada:

```yaml
kind: MAINTENANCE_DELAY
horizon: "P90D"
current_action_cost: "100.00"
future_cost_range:
  min: "150.00"
  max: "500.00"
currency: "USD"
confidence: LOW
assumptions:
  - "continued use"
  - "fault may worsen"
source: USER_ESTIMATE
as_of: "TODO"
```

La UI debe decir "costo futuro estimado" o "riesgo de demora", no "vas a
perder" ni "ahorraste". Cuando exista una reparación real, la estimación se
conserva para comparar escenario y resultado, pero no se reescribe.

## Dinámica Temporal

Cada recurso puede declarar un `valueDynamics`:

| Tipo | Ejemplo | Efecto temporal |
| --- | --- | --- |
| `PERISHABLE` | Leche | Riesgo de expiración y desperdicio. |
| `CONSUMPTIVE` | Alimentos/combustible | Valor útil realizado al consumirse. |
| `DEPRECIATING` | Auto/electrodoméstico | Condición y valor de reposición cambian. |
| `MAINTENANCE_SENSITIVE` | Auto/caldera | El costo de demora puede crecer. |
| `STABLE_UNTIL_EVENT` | Repuesto almacenado | Cambia por uso, daño o descarte. |

Un recurso puede combinar dinámicas. Las curvas determinísticas quedan fuera
del primer corte: la API comienza con fechas, eventos y escenarios explícitos.

## Tablas Para SST

### Recursos Cotidianos

| Columna | Presentación |
| --- | --- |
| Recurso | Nombre y categoría económica. |
| Clase | Consumible o durable. |
| Cantidad/condición | Hecho actual declarado. |
| Fecha relevante | Vencimiento o próximo mantenimiento. |
| Costo registrado | Gasto histórico enlazado. |
| Dinámica | Perecedero, consumible, depreciable o sensible a mantenimiento. |
| Estado | Activo, consumido, vencido o descartado. |

### Efectos De Gastos

| Columna | Presentación |
| --- | --- |
| Gasto | Transacción fuente. |
| Recurso afectado | Leche, auto u otro recurso. |
| Efecto | Adquisición, consumo, reparación, desperdicio. |
| Beneficio | Etiqueta cualitativa o score declarado. |
| Costo evitado | Rango estimado, si existe. |
| Evidencia | Usuario, comprobante futuro o fuente externa. |
| Confianza | `LOW`, `MEDIUM`, `HIGH` con criterio documentado. |

### Alertas De Tiempo

| Alerta | Regla |
| --- | --- |
| Vencimiento próximo | Fecha observada, no predicción. |
| Mantenimiento pendiente | Fecha/kilometraje configurado. |
| Riesgo de desperdicio | Cantidad remanente y tiempo al vencimiento. |
| Costo de demora | Escenario con rango, horizonte y assumptions. |

## Introducción Progresiva A Finanzas

La experiencia puede enseñar conceptos sin usar asesoramiento financiero:

1. Gasto: salida de efectivo.
2. Recurso: qué se obtuvo o preservó con ese gasto.
3. Utilidad: qué necesidad o capacidad produjo.
4. Desperdicio: valor adquirido que no llegó a utilizarse.
5. Costo de demora: posible costo adicional por postergar una acción.
6. Ahorro: efectivo no consumido ni comprometido.
7. Inversión: asignación posterior a instrumentos de mercado con riesgo y
   retorno separados.

Esto permite que acciones, bonos y cripto aparezcan después como otra familia
de recursos económicos, pero bajo contratos específicos de instrumento,
valuación y riesgo.

## Primera Rebanada Recomendada

- Categorías `FOOD`, `TRANSPORT`, `HEALTH`, `HOME`, `EDUCATION`, `OTHER`.
- Recursos manuales `CONSUMABLE` y `DURABLE_ASSET`.
- Eventos `ACQUIRE`, `CONSUME`, `WASTE`, `MAINTAIN`, `REPAIR`, `DISPOSE`.
- Enlace opcional a la transacción fuente.
- Fecha de vencimiento o próximo mantenimiento.
- Tabla de recursos y tabla de efectos.
- Resumen de gasto útil versus desperdicio con valores claramente derivados.

Se difieren:

- reconocimiento automático por OCR;
- modelos predictivos de deterioro;
- recomendaciones automáticas;
- monetización obligatoria de utilidad personal;
- integración con talleres, supermercados o IoT;
- instrumentos tradicionales y cripto;
- gamificación que pueda incentivar gasto o riesgo.

## Invariantes De Seguridad Y Honestidad

- No presentar utilidad subjetiva como profit.
- No presentar costo evitado como ahorro realizado.
- No crear saldos contables a partir de estimaciones.
- No afirmar que un mantenimiento elimina un riesgo.
- No usar lenguaje de asesoramiento financiero personalizado.
- Mostrar assumptions, horizonte, moneda, fuente y confianza en estimaciones.
- Permitir corregir hechos declarados conservando auditoría.
- Mantener datos de salud, ubicación o hábitos fuera del modelo salvo nuevo
  contrato de privacidad.

## Decisiones Pendientes Antes De Aprobar

- Nombre de producto: `instrumento cotidiano`, `recurso económico` u otro.
- Si el primer corte registra cantidades o solamente eventos y fechas.
- Vocabulario de condición para bienes durables.
- Criterio para beneficio cualitativo y si se permite un score subjetivo.
- Regla de costo unitario para desperdicio parcial.
- Quién puede crear escenarios de costo de demora y con qué evidencia.
- Cómo evitar que alertas educativas se conviertan en diagnósticos de salud,
  seguridad mecánica o asesoramiento profesional.
