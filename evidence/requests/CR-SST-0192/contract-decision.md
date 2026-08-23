# CR-SST-0192 - DecisiÃ³n Del Contrato V1

Fecha: 2026-08-17

## Resultado

SST adopta `sst-personal-memory-governance-v1` como contrato cross-repo para la
primera memoria personal gobernada. La memoria canÃ³nica vive en `sst-bend` y se
identifica por `tenant_id`, `account_id`, `user_id`, `application_id` y
`memory_space_id`.

`sst-chatbot` puede producir propuestas y solicitar recall, pero no puede
aceptar, corregir, borrar o persistir memoria canÃ³nica. `4uentes-auth` conserva
identidad, sesiÃ³n y membership. `sst-fend` presenta revisiÃ³n y acciones del
usuario sin convertirse en autoridad.

## Decisiones Principales

1. El chat crudo no es memoria aceptada. Un evento sÃ³lo registra evidencia
   mÃ­nima y una propuesta siempre precede al hecho, intenciÃ³n o thread.
2. V1 exige aceptaciÃ³n explÃ­cita registrada antes de que una propuesta sea
   elegible para recall, robots, Ã­ndices o exportaciÃ³n.
3. La autorizaciÃ³n falla cerrada si falta cualquier dimensiÃ³n de scope. La
   memoria personal no hereda el fallback `tenantId=legacy` observado en el
   LearningWorkspace actual.
4. La clasificaciÃ³n inicial es `public`, `internal`, `private`, `restricted` y
   `secret`; la memoria personal nace como `private`.
5. Credenciales y contenido `secret` se rechazan antes de persistencia de
   contenido. `restricted` y `secret` nunca cruzan al proveedor en V1.
6. El backend autoriza antes de ranking o retrieval. El proveedor sÃ³lo recibe
   contexto mÃ­nimo y no recibe identidad, sesiÃ³n, entitlements ni reglas
   internas.
7. Correcciones y borrados son transiciones auditables. No existen ediciones
   silenciosas de significado aceptado.
8. El Ã¡rbol fÃ­sico y el ZIP son proyecciones derivadas y regenerables. Postgres
   seguirÃ¡ siendo autoridad; el dispositivo offline queda fuera de V1.
9. Los roles humanos `owner/member` no se reemplazan. Un robot usa un perfil de
   capabilities y una vista filtrada por el backend.
10. La retenciÃ³n del chat y la retenciÃ³n de memoria aceptada son polÃ­ticas
    separadas.

## RetenciÃ³n V1

- Contenido mÃ­nimo de eventos: 30 dÃ­as.
- Propuestas no aceptadas: 30 dÃ­as.
- Hechos, intenciones y threads aceptados: hasta borrado, cierre de cuenta o
  transiciÃ³n explÃ­cita.
- AuditorÃ­a de recall sin consulta ni respuesta: 90 dÃ­as.
- Artefactos temporales de descarga: mÃ¡ximo 24 horas.
- Tombstones de borrado sin contenido: 30 dÃ­as para propagaciÃ³n e idempotencia.

La polÃ­tica operacional de backups y el tiempo completo de borrado por cierre
de cuenta deben aprobarse antes de una release productiva.

## Precedencia De Policy

```text
sesiÃ³n y membership vigentes
  -> scope completo
  -> consentimiento de captura
  -> clasificaciÃ³n y secretos
  -> lifecycle e indexabilidad
  -> capabilities del robot
  -> retrieval autorizado
  -> minimizaciÃ³n para el proveedor
  -> citas y divulgaciÃ³n
  -> auditorÃ­a sin contenido
```

Cualquier denegaciÃ³n detiene el flujo y produce un cÃ³digo sanitizado. El texto
del usuario, un chunk recuperado o la salida del proveedor nunca amplÃ­an scope.

## Boundary Con ARDS/SDD

La memoria interna de SST usa ideas de evidencia, lifecycle y provenance, pero
no es un ARDS/SDD de proyecto por usuario. El workspace portable estÃ¡ inspirado
en ARDS y es una presentaciÃ³n del producto, no una copia de `requests/`,
`policies/`, `state/` o del control plane.

## Fuente Estructurada

El contrato ejecutable para los prÃ³ximos owner repos es
`evidence/requests/CR-SST-0192/personal-memory-governance-v1.yaml`.
