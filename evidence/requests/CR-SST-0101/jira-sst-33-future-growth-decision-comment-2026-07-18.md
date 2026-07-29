Decision funcional posterior a SST-33; no reabre ni amplia el CR cerrado.

SST-33 queda como captura manual desde una sesion de navegador ya abierta, sin
secretos en el cliente y sin importacion automatica a LearningWorkspace o IA.

Siguientes limites de producto:

- LearningWorkspace: solo preview y aceptacion explicita por usuario; CR-SST-0102.
- IA: solo contexto previamente aceptado, acotado por cuenta/usuario y auditable.
- Inicio de sesion autonomo: requiere un CR separado con SecretRef, destinos
  permitidos, auditoria y aislamiento; nunca plaintext en extension o IA.
- Guardar/revelar contrasenas: sigue siendo responsabilidad auditada de
  DictionarySecret; no se convierte en contenido de captura.
- HTML completo: requiere contrato separado de sanitizacion, limites y retencion.
- Procesar una pagina privada sin accion del usuario: no esta aprobado; requiere
  consentimiento, programacion, permisos, revocacion y controles antiabuso.

El QA manual de extension queda en CR-SST-0103 / SST-35 con fixtures ficticios.
La indisponibilidad del puente DevTools de Codex es una limitacion de herramienta,
no un resultado funcional de sst-extension.

ARDS/SDD mantiene el detalle en:
- evidence/requests/CR-SST-0101/future-growth-functional-decision-2026-07-18.md
- evidence/requests/CR-SST-0103/manual-qa-execution-strategy-2026-07-18.md
