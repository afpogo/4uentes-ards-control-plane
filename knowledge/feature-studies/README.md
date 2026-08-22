# Estudios de features del Sistema

Este directorio es el espacio de descubrimiento para estudiar posibles features que puedan afectar a una o más soluciones administradas por el Control Plane.

Aquí, **Sistema** significa el portafolio descrito por `solutions/*.yaml` y `catalog/services/*.yaml`, más las capacidades de gobierno que permiten coordinarlo. No designa una aplicación nueva, un monolito, un repositorio runtime ni una solución adicional.

## Qué autoridad tiene este directorio

Los documentos de este directorio son conocimiento de trabajo **no normativo**. Una idea escrita aquí:

- no autoriza cambios en repositorios funcionales;
- no crea por sí sola un compromiso de producto;
- no reemplaza contratos, ADRs, specs, documentación owner ni requests;
- no modifica la identidad o el estado de una solución o servicio catalogado.

Una feature sólo pasa a ejecución cuando tiene alcance verificable, owners, riesgos y dependencias identificados, y se promueve al lifecycle formal mediante una iniciativa o CR aprobado.

## Alcance actual

El punto de partida está en [system-scope.md](system-scope.md). Incluye:

- `4uentes`;
- `sst`;
- `finanzas-personales`;
- capacidades compartidas, infraestructura y gobierno del Control Plane.

El inventario es una fotografía del catálogo. Si el catálogo cambia, el estudio debe actualizar su alcance en vez de inventar servicios o soluciones.

## Estados de un estudio

| Estado | Significado |
| --- | --- |
| `idea` | Problema u oportunidad todavía sin evidencia suficiente. |
| `discovery` | Se están reuniendo usuarios, evidencia, restricciones y alternativas. |
| `assessed` | Impacto, owners, dependencias, riesgos y cortes posibles fueron evaluados. |
| `candidate` | Existe una propuesta suficientemente concreta para decidir promoción. |
| `promoted` | Tiene iniciativa o CR formal; la ejecución se sigue fuera de este directorio. |
| `archived` | No se continuará por ahora; se conserva la razón. |

El estado no avanza por cantidad de texto. Avanza por evidencia y decisiones explícitas.

## Flujo alcanzable

1. Copiar [feature-study.template.md](feature-study.template.md) y registrar el problema, no una solución asumida.
2. Vincular solamente IDs existentes de solución y servicio.
3. Separar hechos, hipótesis, preguntas y decisiones.
4. Identificar la autoridad documental de cada owner afectado.
5. Proponer cortes pequeños que puedan validarse de forma independiente.
6. Evaluar seguridad, privacidad, datos, operación, UX, rollback y costo de coordinación.
7. Recomendar descartar, seguir estudiando o promover.
8. Si se promueve, crear o avanzar el lifecycle formal antes de mutar repositorios hijos.

## Convención de archivos

Usar nombres descriptivos en minúsculas y con guiones, por ejemplo:

```text
knowledge/feature-studies/<dominio>/<feature>.md
```

Los dominios iniciales sugeridos son `shared`, `sst`, `portfolio`, `finanzas-personales` y `control-plane`. Crear sólo los que tengan estudios reales; no se necesitan directorios vacíos.

## Índice inicial

- [Alcance y líneas de exploración del Sistema](system-scope.md)
- [Plantilla para un estudio](feature-study.template.md)
- [Configuración moderna de contraseñas: raw-v2, TLS, TTL y scrypt](shared/password-configuration-raw-v2.md)

