# Analisis De Flujo De Eventos Y Propuestas De Transicion

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0041
- Escritura Jira ejecutada: no
- Feature states modificados: no
- Repos funcionales modificados: no

## Contexto

CR-SST-0040 dejo una politica base y un observador read-only de status Jira.
Ese observador registra senales como `JIRA_WORK_PENDING`,
`JIRA_WORK_STARTED`, `JIRA_WORK_BLOCKED` y
`JIRA_WORK_CLOSED_OBSERVED`.

CR-SST-0041 define el siguiente contrato: convertir esas senales en propuestas
auditables, no en mutaciones automaticas.

## Decision De Diseno

El control-plane debe separar tres momentos:

1. Observacion: se lee Jira por MCP y se registra evidencia.
2. Propuesta: se interpreta la senal y se genera una accion candidata.
3. Decision: una persona o un request aprobado decide si se muta estado local o
   se escribe Jira.

## Flujo Recomendado

```text
jira-status-observation-results.json
  -> event intake
  -> guard evaluation
  -> transition proposal
  -> approval gate
  -> future local transition or Jira writer action
```

## Resultado Esperado De CR-SST-0041

- Contrato documental agregado en `docs/requests`.
- Request `planned` creado para la etapa.
- Evidencia inicial creada.
- Sin ejecucion de writes externos.
- Sin cambios en `state/features`.

## Siguiente Implementacion Recomendada

El siguiente CR-SST deberia implementar un comando dry-run:

```powershell
npm.cmd run jira:mcp:status-proposals -- --request-id CR-SST-0042 --input-dir evidence/requests/CR-SST-0040 --output-dir evidence/requests/CR-SST-0042
```

Ese comando deberia leer las observaciones y producir propuestas sin mutar
estado local ni Jira.

