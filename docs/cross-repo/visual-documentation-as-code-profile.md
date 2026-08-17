# Perfil De Documentación Visual Como Código

## Propósito

Este perfil define cómo incorporar mapas Mermaid a ARDS/SDD sin convertir una
vista visual en una nueva fuente de verdad. Aplica inicialmente al
control-plane y nace del lifecycle `CR-CP-0018`.

El contrato machine-readable vive en
`specs/integration/visual-documentation-as-code-profile.yaml`.

## Regla Central

Cada mapa gobernado es un bloque autocontenido compuesto, en este orden, por:

1. metadata YAML `visual_map`;
2. un diagrama Mermaid;
3. un fallback textual adyacente.

El bloque responde una sola pregunta y usa un solo nivel de abstracción. Los
paths declarados en `source_refs` conservan autoridad. Si existe una
contradicción, prevalece la fuente ARDS/SDD referenciada.

## Anatomía Del Bloque

```text
visual-map start marker
metadata visual_map
diagrama Mermaid
Fallback textual
visual-map end marker
```

La metadata mínima declara:

- `id` estable;
- `type`: `dependency`, `lifecycle`, `sequence` o `data`;
- pregunta respondida;
- nivel de abstracción;
- fuentes repo-relative existentes;
- fecha observada;
- boundary de autoridad;
- fallback textual obligatorio.

## Tipos De Mapa

| Tipo | Pregunta principal | Ejemplo |
| --- | --- | --- |
| `dependency` | ¿Qué depende de qué y en qué dirección? | CRs, servicios o repositorios |
| `lifecycle` | ¿Qué estado o gate gobernado sigue? | adopción, request lifecycle |
| `sequence` | ¿En qué orden interactúan participantes acotados? | handoff o ejecución |
| `data` | ¿Cómo se relacionan entidades lógicas? | registros o grupos de campos |

Un mapa no debe mezclar, por ejemplo, dependencias entre CRs con endpoints,
clases y tablas físicas. Si hacen falta ambos niveles, se crean mapas separados.

## Semántica Accesible

El color es sólo una mejora visual. La semántica también debe aparecer como
texto:

- las aristas con significado de gobierno llevan label;
- los nodos indican `planned`, `running`, `blocked`, `validated` u otro estado;
- la dirección se conserva en el fallback;
- los bloqueos y bifurcaciones se expresan con palabras, no sólo con estilos.

La paleta recomendada distingue autoridad, trabajo en curso, trabajo
planificado, validación y bloqueo. Un lector monocromático debe poder obtener la
misma decisión desde labels y fallback.

## Seguridad Y Mínimo Privilegio

Un mapa no incluye secretos, credenciales, tokens, cookies, headers, datos
personales, valores productivos ni URLs privadas. Tampoco expone topología
interna que no sea necesaria para responder la pregunta declarada.

Cuando falte información se escribe `TODO`. No se inventan componentes,
relaciones, owners ni estados.

## Uso Con RAG Y Agentes

La metadata, el Mermaid y el fallback permanecen juntos para que un fragmento
recuperado conserve pregunta, evidencia y autoridad. Los encabezados deben
nombrar el sujeto del mapa; expresiones como “diagrama siguiente” o “flujo
anterior” no son suficientes.

Los agentes pueden proponer o actualizar el código Mermaid, pero las decisiones
de arquitectura, seguridad, ownership y dependencias cross-repo conservan
revisión humana obligatoria.

## Adopción

1. Confirmar que existe un request aprobado para el cambio documental.
2. Elegir una plantilla en `templates/visual-documentation/`.
3. Completar metadata y sustituir todos los `TODO` verificables.
4. Construir el mapa sólo desde `source_refs`.
5. Escribir el fallback con las mismas direcciones y condiciones.
6. Revisar lenguaje, seguridad, nivel de abstracción y autoridad.
7. Ejecutar `npm.cmd run check`, `git diff --check` y el escaneo secret-safe.

## Quality Gate Local

`CR-CP-0019` implementa el validator en
`scripts/verify-visual-documentation.js`.

Comandos:

- `npm.cmd run check:visual-docs`: metadata, markers, fuentes, identidades,
  dependencias, fallback y señales accesibles;
- `npm.cmd run check:visual-docs:self-test`: un caso positivo y abortos
  negativos reproducibles;
- `npm.cmd run check`: incorpora el gate estructural y semántico al cierre
  canónico del control-plane;
- `node scripts/verify-visual-documentation.js --renderer-root <absolute-path>`:
  ejecuta parse y render SVG con un module root aislado que contenga exactamente
  `mermaid@11.12.0` y `jsdom@26.1.0`.

El check canónico no descarga paquetes ni depende de red. El modo render falla
si el toolchain no existe, si las versiones difieren o si cualquier mapa no
produce SVG.

## Templates

- [Dependency map](../../templates/visual-documentation/dependency-map.template.md)
- [Lifecycle map](../../templates/visual-documentation/lifecycle-map.template.md)
- [Sequence map](../../templates/visual-documentation/sequence-map.template.md)
- [Data map](../../templates/visual-documentation/data-map.template.md)

## Piloto

El primer mapa adoptante está en
`evidence/requests/CR-CP-0006/implementation-plan.md`. Representa únicamente
dependencias de lifecycle entre CRs; no representa endpoints ni runtime.
