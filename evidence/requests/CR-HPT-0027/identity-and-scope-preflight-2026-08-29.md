# Preflight de identidad y alcance de CR-HPT-0027

Fecha: 2026-08-29.

## Identidad

- `CR-HPT-0027` no apareció en los archivos observados, worktrees activos ni
  historia Git local antes de crear esta reserva.
- La búsqueda estructurada en Jira HPT no devolvió coincidencias para
  `CR-HPT-0027`.
- `CR-HPT-0021` ya gobierna la instancia privada de desarrollo de Phinance.
- `CR-HPT-0022` a `CR-HPT-0026` ya pertenecen a la secuencia de custodia de
  comprobantes y no pueden reutilizarse.
- La reserva se preparó en el worktree limpio
  `worktrees/CR-HPT-0027-local-dev-governance`, sin tocar el checkout principal
  contaminado.

## Hechos observados

| Owner | Superficie local | Gestión de secretos | Puerto relevante |
| --- | --- | --- | --- |
| Phinance | PostgreSQL, migraciones y API | Generador CSPRNG y Docker Secret ignorado | API `127.0.0.1:8766`; PostgreSQL interno |
| SST Bend | API, scrapper, PostgreSQL y pgAdmin | Credenciales de desarrollo embebidas en Compose | pgAdmin `5050`; PostgreSQL `5432` |
| 4uentes Automation | n8n, PostgreSQL y pgAdmin | Variables `.env`; generador parcial para una credencial secundaria | n8n `127.0.0.1:5678`; pgAdmin `127.0.0.1:5050` |
| SST Infra | Phinance Kubernetes development | Secret contractual todavía no aprovisionado | Servicios internos del clúster |

La colisión reproducible de diseño es el host port `5050`, solicitado por los
dos pgAdmin. PostgreSQL de Automation no publica puerto al host y no colisiona
con el `5432` de SST Bend. Los contenedores estaban detenidos durante la
observación; no se inició ningún runtime para probar la colisión.

## Boundary propuesto para planificación

1. Un runbook humano común describirá orden, ownership, preflight, rotación y
   recuperación.
2. Cada repo owner conservará su propio playbook ejecutable y sus secretos.
3. El control plane no almacenará ni transportará valores secretos.
4. Los puertos de host serán configurables mediante variables prefijadas por
   owner y las superficies locales se limitarán a loopback.
5. Los stacks conservarán redes y proyectos Compose independientes.
6. La provisión de `phinance-postgres-secret` será una operación de
   infraestructura separada y no reutilizará la contraseña de Compose.
7. La rotación de PostgreSQL deberá coordinar archivo, rol inicializado,
   consumidores, rollback y persistencia; sobrescribir un archivo no basta.

## Dependencias y bloqueos

- `CR-HPT-0021` aporta el patrón owner existente de Phinance y permanece como
  predecessor funcional.
- `CR-SST-0228` gobierna el cifrado del clúster compartido; no se infiere de
  esta reserva autorización para crear Secrets Kubernetes.
- El onboarding `CR-CP-0021` de `4uentes-automation` fue observado sólo en
  trabajo local no canónico sobre la base utilizada. No se puede mutar ese
  owner hasta publicar y releer su lifecycle.
- Cualquier modificación de `finanzas-personales`, `sst-bend`,
  `4uentes-automation` o `sst-4uentes-infra` requerirá el plan fusionado, un
  worktree owner limpio y autorización explícita del slice correspondiente.

## Operaciones no realizadas

- No se leyeron valores de `.env`, Docker Secrets ni Kubernetes Secrets.
- No se modificaron repositorios hijos, Compose, puertos, redes o volúmenes.
- No se iniciaron ni detuvieron contenedores.
- No se mutó el clúster ni se aprovisionaron credenciales.
- No se creó ni modificó un issue Jira durante este preflight.

## Próxima compuerta

Fusionar y releer la reserva mínima. Sólo desde esa referencia canónica se
puede crear el plan de impacto y preparar el lote exacto para el mirror Jira.
