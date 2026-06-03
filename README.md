# 4uentes-ards-control-plane

Control-plane ARDS/SDD para catalogar servicios, soluciones logicas, evidencia
local y readiness de repos 4uentes.

## Fase 0

Inventario inicial disponible en:

- `inventory/phase-0.md`
- `catalog/services/`
- `solutions/sst.yaml`

Los paths locales guardados en este repo son evidencia observada, no identidad
canonica ni configuracion estable.

## Documentacion

La documentacion humana vive en `docs/` y usa espanol como idioma base:

- [docs/README.md](docs/README.md)
- [docs/idioma-markdown.md](docs/idioma-markdown.md)

La capa agent-facing (`AGENTS.md`, `docs/ai/policy.md`) y los YAML normativos se
mantienen en ingles tecnico por compatibilidad con agentes, tooling y contratos.

## Fase 1B

Validacion del control-plane:

```bash
npm run check
```
