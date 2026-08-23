# Autorización y alcance

## Decisión humana

El 22 de agosto de 2026, el owner decidió que Phinance gobierne todo el bounded
context financiero como una API Python y autorizó avanzar con la adopción
documental mediante la expresión: `Perfecto avancemos`.

## Alcance autorizado

- Mantener `finanzas-personales-backend` como identidad lógica estable.
- Adoptar `Phinance-API` como microservicio `backend-api` independiente.
- Elegir Python y FastAPI como baseline de runtime planificado.
- Actualizar el catálogo y el ARDS/SDD propietario.
- Reservar la implementación para `CR-HPT-0012`.

## Fuera de alcance

- Código fuente Python y dependencias.
- Migraciones o tablas.
- Docker, CI/CD o despliegue.
- Cambios en `sst-fend`, `sst-bend`, auth o infraestructura.
- Selección definitiva de versiones, ORM, package manager o transporte de
  identidad confiable.
- Facturas, OCR, almacenamiento de documentos, colas o IA.

## Corrección de identidad del request

`CR-HPT-0007` ya estaba reservado para contratos de ingreso documental;
`CR-HPT-0008`, `0009` y `0010` también tenían uso candidato. La adopción del
runtime se registra como `CR-HPT-0011` y el scaffold futuro como `CR-HPT-0012`
para evitar colisiones y conservar trazabilidad.
