# Resumen de adopción en la documentación owner

## Decisión adoptada

El ARDS/SDD propietario ahora define a Phinance-API como un microservicio API
independiente con un único runtime Python/FastAPI. Se conserva
`finanzas-personales-backend` como identidad lógica estable y `Phinance-API`
como nombre de producto/runtime.

El dominio financiero debe permanecer independiente de FastAPI, los formatos
de token SST y los clientes de persistencia. PostgreSQL continúa como
persistencia preferida bajo ownership de Phinance, con topología pendiente.

## Separación de responsabilidades

- SST conserva identidad, sesión, cuenta activa, membership, frontend y
  routing compartido.
- Phinance conserva el dominio, ledger, reglas, auditoría y persistencia
  financiera.
- No existe un split Node/Python ni un servicio auxiliar de cálculo en el MVP.
- OCR, documentos, colas, analítica separada e IA continúan diferidos.

## Decisiones que permanecen pendientes

- Versiones de Python y FastAPI.
- Package manager.
- ORM y herramienta de migraciones.
- Topología PostgreSQL.
- Transporte del principal SST confiable.
- Prefijo de gateway, contenedor, CI/CD y despliegue.

Estas decisiones y el scaffold corresponden a `CR-HPT-0012`.
