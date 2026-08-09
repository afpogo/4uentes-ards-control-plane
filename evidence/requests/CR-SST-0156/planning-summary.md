# Plan de adopción RAG para métricas de stakeholder

## Decisión

`CR-SST-0156` conserva una capability independiente:
`sst-stakeholder-metrics-rag`. `MetricSnapshot` es la única fuente autorizada
de valores. El ARDS/SDD del sistema se usa solamente como corpus seguro y
allowlisted para definiciones y metodología.

El RAG no calcula KPIs, no sustituye snapshots, no acepta SQL ni filtros libres
y no habilita drill-down por tenant. La supresión de cohortes y la provenance
analítica se validan antes del provider.

## Límite del capability link

El enlace al control-plane publica solamente estado y evidencia técnica. Tiene
`execution_authority: none` y `contains_business_data: false`; no transporta
consultas, respuestas, valores de métricas ni identificadores.

## Separación

Esta capability puede consumir contratos comunes de recuperación y citas que
se estabilicen en `CR-SST-0155`, pero mantiene un lifecycle, feature state,
policy de fuentes, evidencia y validaciones propios para `sst_stakeholder`.
