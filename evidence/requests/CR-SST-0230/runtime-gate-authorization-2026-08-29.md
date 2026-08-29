# Autorización del gate runtime localhost de CR-SST-0230

Fecha: 2026-08-29  
Estado: `approved-pending-publication-readback`

## Autorización exacta

> Autorizo el gate runtime localhost de CR-SST-0230 con datos sintéticos y
> cleanup por contratos de producto. No autorizo Redis directo, Jira adicional,
> deployment, cluster ni producción.

## Alcance ejecutable

Después del merge y readback de este subgate, una única ejecución puede:

1. registrar una identidad sintética `@example.invalid` y autenticarse contra
   el facade localhost;
2. crear una conversación temporal y guardarla por el contrato de producto;
3. verificar `miss` y luego `hit` sin leer keys ni ejecutar comandos Redis;
4. enviar un único turno sintético normal por Socket.IO protegido;
5. verificar nuevamente `miss` y luego `hit`;
6. eliminar la conversación guardada mediante `DELETE /api/chat` y verificar
   que el historial responda `404` sin el header de cache.

El harness `scripts/qa-cr-sst-0230-cache.js` rechaza destinos que no sean
loopback HTTP. Su salida permite únicamente outcomes, statuses, conteos y
resultados de cleanup; nunca imprime identidad, password, token, cookie,
conversation ID, contenido, URL privada, key Redis ni payload del modelo.

## Límites y cleanup

- no se ejecutan comandos Redis ni se consulta su backing store;
- no se escribe Jira, no se publica imagen y no se modifica Infra;
- no se ejecutan comandos de deployment, GitOps, cluster o producción;
- la conversación se elimina por API incluso ante fallo posterior a la
  promoción, mediante un bloque `finally` best-effort;
- Auth no ofrece contrato de producto para eliminar la identidad sintética;
  ese residuo conocido se registra sin conservar su email o credenciales.

## Atomización y validación

- clasificación: `complex-high-risk-task` por autenticación, datos sintéticos
  y runtime compartido;
- ejecución: secuencial en el agente principal; la delegación proactiva está
  deshabilitada por el runtime actual;
- prepublicación: `node --check`, revisión estática de sanitización,
  `git diff --check` y `npm run check`;
- ejecución: exactamente una corrida localhost después del readback canónico;
- cierre del gate: evidencia sanitizada, full control-plane check y PR/readback
  separados. El cierre Jira requiere otra autorización exacta.
