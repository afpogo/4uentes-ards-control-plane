# CR-SST-0139 - Implementacion Y Validacion

Repo owner: `sst-extension`.

- Reutiliza el primer frame de la captura visual; no realiza otra captura.
- Toggle visible por sesion; `includePrivatePreviews` permanece `false` por defecto.
- Candidata opcional `browser-session`, consentimiento `per-session`.
- Limite individual 96 KiB y global 1 MiB; exceso conserva la sesion y agrega
  `session-preview-budget-exceeded`.
- Queues antiguas omiten el campo y siguen compatibles.
- Owner spec/doc y adopcion inbound registradas.

Validacion: `pnpm.cmd run check` PASS; 26 suites, 106 tests y build MV3 PASS.

Pendiente: ejecutar `CR-SST-0103` con una fixture privada ficticia. No se
incluyo contenido privado en evidencia.
