# CR-SST-0193 - Mapas De Arquitectura De Memoria SST

Fecha observada: 2026-08-19.

## Documento Owner

La arquitectura visual derivada vive junto al runtime propietario:

- repo lÃ³gico: `sst-bend`;
- ruta owner: `docs/architecture/user-memory-v1.md`;
- Ã­ndice owner: `docs/architecture/README.md`;
- validaciÃ³n reproducible: `npm run test:user-memory`.

El documento contiene seis mapas Mermaid como cÃ³digo, metadata `visual_map`,
fuentes repository-relative, boundary de autoridad y fallback textual:

1. contexto y dependencias entre servicios;
2. boundary de confianza y resoluciÃ³n de scope;
3. modelo lÃ³gico de datos;
4. lifecycle de propuestas y records;
5. secuencia de captura, review y aceptaciÃ³n;
6. secuencia planificada de recall gobernado hacia `sst-chatbot` y un proveedor
   LLM no autoritativo.

## Autoridad Y Estado

Los mapas son vistas derivadas. La autoridad funcional permanece en:

- `evidence/requests/CR-SST-0192/personal-memory-governance-v1.yaml` para el
  contrato cross-repo;
- `sst-bend/specs/api/user-memory.yaml` para el contrato API owner;
- `sst-bend/specs/capabilities/outbound/user-memory-runtime-v1.yaml` para el
  handoff;
- migration, middleware y servicio de aplicaciÃ³n de `sst-bend` para el estado
  implementado.

El mapa separa explÃ­citamente:

- implementado en CR-SST-0193: persistencia canÃ³nica, scope fail-closed,
  propuestas, review, records, correcciÃ³n, tombstones, recall metadata-only y
  retenciÃ³n;
- planificado mediante requests consumidores posteriores: integraciÃ³n con
  `sst-chatbot`, UX en `sst-fend`, export y proyecciÃ³n de dispositivo;
- no canÃ³nico: raw chat, prompts/respuestas del proveedor, Ã­ndice vectorial,
  exports y filesystem de cliente.

La ambigÃ¼edad observada inicialmente en `needsUserReview=false` quedÃ³ cerrada el
2026-08-20. `validated` representa validaciÃ³n interna de backend, no una opciÃ³n
del consumidor. El payload pÃºblico no puede elegir estados y toda propuesta
HTTP persiste como `needs_user_review` hasta una decisiÃ³n `accept` registrada.

## DocumentaciÃ³n Preexistente Reutilizada

Antes de este cambio existÃ­an fuentes parciales, pero no un set owner completo
de mapas visuales de memoria V1:

- `evidence/requests/CR-SST-0031/runtime-slice-contract.md`;
- `evidence/requests/CR-SST-0031/memory-event-proposal-flow.md`;
- `evidence/requests/CR-SST-0031/implementation-summary.md`;
- `evidence/requests/CR-SST-0192/personal-memory-governance-v1.yaml`;
- `evidence/requests/CR-SST-0178/m2m-security-and-rollout-maps.md`, que sÃ³lo
  mostraba la relaciÃ³n futura de seguridad con CR-SST-0192.

Los documentos de CR-SST-0031 se conservan como evidencia histÃ³rica; el
contrato CR-SST-0192 y el nuevo documento owner son las referencias vigentes.

## ValidaciÃ³n

El test `scripts/test-user-memory-architecture.js` verifica de forma
determinista:

- cantidad, IDs Ãºnicos y tipos de los seis mapas;
- markers, metadata, fecha observada, boundary y fallback;
- existencia de cada source ref;
- declaraciÃ³n Mermaid compatible con el tipo;
- edges, relaciones y mensajes etiquetados;
- ausencia de material con forma de credencial;
- visibilidad de los lÃ­mites implementado/planificado/no canÃ³nico.
