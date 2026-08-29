# CR-SST-0223 — Persistencia gobernada de procesamiento de artículos

## Objetivo

Adoptar en `sst-bend` la persistencia y autorización de
`sst-article-agent-processing-v1@1.0.0` sin mover la ejecución del modelo fuera
de `sst-chatbot` ni aceptar memoria automáticamente.

## Alcance owner

- evolucionar el job existente como run compatible, sin crear un agregado paralelo;
- materializar snapshots inmutables de fuente y prompt;
- persistir una cadena de contexto versionada y derivaciones ordenadas por párrafo;
- separar derivación final, resultado técnico, resumen revisable y propuesta de memoria;
- aplicar scope reconstruido por Bend, idempotencia, procedencia y fallos cerrados;
- mantener endpoints legacy mediante adaptación explícita;
- publicar ARDS/SDD owner, capability y mapas aplicables.

## Resultado de implementación

- Owner: `sst-bend`.
- Pull request: `#30`.
- Head validado: `dc23c45caae7f533412c7a8943e6e3f52bf677f6`.
- Merge en `develop`: `dc67203c77bb91804db888ad57c4f2a174b3d6b8`.
- Estado: implementación, contrato y documentación owner fusionados y leídos nuevamente.
- Validación: `npm run check`, `npm run build`, Node 18, Node 20 y build del pull request en `PASS`.
- Publicación: el merge usó `[skip ci]`; no se ejecutó workflow de publicación ni deployment asociado al merge.
- Datos: no se ejecutaron migraciones sobre entornos compartidos o productivos.

## Fuera de alcance y continuidad

No incluye ejecución real del modelo, integración durable Bend–chatbot, UX
Fend, aceptación automática de memoria, deployment ni QA E2E. Esos trabajos
pertenecen a `CR-SST-0224` a `CR-SST-0227`. El QA de usuario se realizará en el
gate correspondiente exclusivamente mediante Chrome DevTools MCP, sin scripts
de base de datos ni seeders.
