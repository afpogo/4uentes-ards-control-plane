# CR-HPT-0012 — autorización y alcance

Fecha: 2026-08-22

El usuario autorizó continuar con el siguiente CR luego del commit de la
adopción Python/FastAPI. Esta autorización habilita la primera mutación runtime
en `finanzas-personales/backend`, limitada al scaffold ejecutable.

Incluye:

- proceso FastAPI mínimo;
- endpoints operativos de salud y readiness;
- OpenAPI generado por el framework;
- tests automatizados;
- harness HTTP reproducible y su adopción de policy;
- documentación ARDS/SDD del owner;
- QA manual parcial con Chrome DevTools.

No incluye persistencia, migraciones, autenticación SST, rutas financieras,
OCR, IA, colas, almacenamiento documental, contenedores ni despliegue.
