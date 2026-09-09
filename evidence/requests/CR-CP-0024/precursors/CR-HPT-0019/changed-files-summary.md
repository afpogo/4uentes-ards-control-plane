# Resumen de archivos modificados en SST

Fecha: 2026-08-27

El delta local del worktree aislado contiene:

- dominio y aplicación de recepción, política de validación, errores e
  idempotencia;
- middleware de autenticación M2M, controller y ruta de Automation;
- repositorio Sequelize con serialización por advisory lock;
- migración reversible y modelos de binding, objeto y candidato;
- suite contractual `scripts/test-receipt-intake.js` e integración en
  `npm run check`;
- registro explícito del endpoint en la cobertura protegida y diferimiento del
  smoke vivo;
- especificación API y capability YAML en inglés;
- documentación owner de API, capability y task en español, junto con sus
  índices y gates ARDS.

El delta no incorpora dependencias, secretos, configuración de despliegue,
infraestructura, llamadas a Phinance ni activación de n8n.
