# Politica De Idioma Para Markdown

## Proposito

Este documento define la politica canonica de idioma para la documentacion en
Markdown de este repo y deja un patron reusable para otros repos 4uentes.

La policy machine-readable correspondiente vive en
`specs/integration/policies.yaml` bajo el id `human-doc-language`, y su
resumen operativo esta publicado en
`docs/policies/human-doc-language-policy.md`.

La regla base es: la documentacion humana se escribe en espanol, mientras que la
capa normativa, agent-facing y los identificadores tecnicos estables conservan
su forma operativa en ingles.

## Clases De Artefactos

### Markdown Humano

Idioma base: espanol.

Incluye:

- `README.md`
- `docs/`, salvo la capa AI indicada abajo
- `inventory/*.md`
- `inventory/evidence/**/*.md`
- `knowledge/**/*.md`
- `evidence/**/*.md`

Estos documentos deben traducir titulos, parrafos, bullets explicativos y
resumenes de decision.

### Markdown Agent-Facing

Idioma base: ingles tecnico o mixto tecnico controlado.

Incluye:

- `AGENTS.md`
- `docs/ai/policy.md`

Estos archivos cumplen una funcion operativa para agentes y deben permanecer
estables para evitar ambiguedad en instrucciones, boundaries y reglas de
ejecucion.

### Specs Normativos Y YAML

Idioma base: ingles.

Incluye:

- `specs/*.yaml`
- `requests/*.yaml`
- `catalog/*.yaml`
- `solutions/*.yaml`

Estos artefactos son contratos para tooling, agentes y referencias cruzadas.
Esta migracion no traduce ni reformula esa capa.

### Nombres Tecnicos Estables

No se traducen.

Incluye:

- filenames y paths
- headings de archivos referenciados cuando el heading sea el nombre del archivo
  o artefacto
- claves YAML
- `service_id`, `capability_id` y otros IDs ARDS/SDD
- nombres de servicios y productos tecnicos
- comandos CLI
- nombres de features
- Kubernetes resources como `Deployment`, `Ingress`, `Service`, `Job`
- Argo CD, GitOps, `selfHeal`, `prune`
- estados del request lifecycle: `inbox`, `planned`, `queued`, `running`,
  `done`, `rejected`
- `request`, `planned`, `capability`, `state` cuando son nombres de artefactos
  o estados operativos

## Convencion Editorial

- Usar espanol como idioma base para nuevos `.md` humanos.
- En la primera mencion de conceptos tecnicos importantes, usar explicacion en
  espanol y conservar el termino original en backticks cuando sea necesario:
  auto-reparacion (`selfHeal`), eliminacion de recursos ausentes (`prune`).
- Despues de la primera mencion, usar el termino tecnico corto si es mas claro.
- No traducir nombres de APIs, Kubernetes resources, GitHub Actions, Argo CD
  options, estados del request lifecycle ni identificadores ARDS/SDD.
- Mantener ejemplos de YAML, JSON, CLI y manifests exactamente como se ejecutan.
- No cambiar filenames ni anchors manuales durante una migracion de idioma.

## Checklist De Migracion Para Otros Repos

1. Inventariar todos los `.md`.
2. Separar Markdown humano de Markdown agent-facing.
3. Confirmar que specs, YAML normativos y contratos no se traducen.
4. Traducir prosa humana sin tocar inline code, rutas, comandos ni IDs.
5. Verificar que el request lifecycle conserva `inbox`, `planned`, `queued`,
   `running`, `done`, `rejected`.
6. Revisar links relativos despues de la traduccion.
7. Ejecutar el check canonico del repo.
8. Registrar excepciones cuando un documento quede en ingles por funcion
   operativa.

## Evidencia Historica Y Arquitectura

La evidencia historica orientada a personas se puede traducir a espanol, pero
debe conservar valores literales observados, comandos, paths, nombres de
artefactos y resultados (`PASS`, `BLOCKED`, `SKIPPED`) cuando funcionen como
evidencia.

Los documentos de arquitectura tambien se traducen si su audiencia principal es
humana. Las referencias normativas internas siguen en ingles para mantener
compatibilidad con modelos IA, tooling y contratos tecnicos.
