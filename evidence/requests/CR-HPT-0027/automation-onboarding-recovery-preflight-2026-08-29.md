# Preflight de recuperación del onboarding de Automation

Fecha: 2026-08-29. Request coordinador: `CR-HPT-0027`.

## Decisión de secuencia

El siguiente owner candidato es `4uentes-automation`:

- SST Bend ya quedó `validated-local` y publicado.
- Phinance ya publicó el patrón local reutilizable bajo `CR-HPT-0021`.
- El plan de `CR-HPT-0027` exige reconciliar `CR-CP-0021` antes de cualquier
  mutación de Automation.

El resultado de este preflight es `BLOCKED-PENDING-LIFECYCLE-RECOVERY`. No se
autoriza todavía modificar el directorio owner, su Compose ni sus credenciales.

## Estado canónico observado

- Base: `4uentes-orchestor/origin/main@5675ccc`.
- `CR-CP-0021`: ausente de `requests/inbox`, `planned` y `running` canónicos.
- `catalog/services/4uentes-automation.yaml`: ausente.
- La solución canónica no puede tratar Automation como owner incorporado.
- `CR-CP-0022` y `CR-CP-0023` ya fueron publicados; la recuperación debe
  preservar el identificador histórico y explicar explícitamente el orden.

## Worktree legacy preservado

El checkout externo
`n8n-local/.worktrees/cr-cp-0021-control-plane` permanece limpio en la branch
`agent/cr-cp-0021-control-plane-links`:

- HEAD: `fc1896157e2c4eeb5c620099a75660bacc0e3300`;
- divergencia contra el main actual observado: `ahead 7, behind 142`;
- diff agregado: 21 archivos, 1187 inserciones y 2 eliminaciones;
- contiene lifecycle, catálogo, solución, tres feature states, capability
  links y evidencia de ramas owner antiguas.

No se debe hacer merge ni cherry-pick masivo de ese snapshot. Mezcla identidad
estable útil con assertions M2M y revisiones runtime que deben revalidarse
contra owners y políticas actuales.

## Readback de owners referenciados

- Las ramas remotas históricas
  `4uentes-auth:agent/cr-cp-0021-automation-m2m-auth` y
  `sst-bend:agent/cr-cp-0021-automation-m2m-sst` no aparecieron en
  `git ls-remote`.
- Por tanto, la recuperación no puede publicar esos cambios como disponibles,
  merged, desplegados ni recuperables desde el remoto.
- El onboarding mínimo debe excluir inicialmente los states/capability links
  de M2M y conservarlos como hallazgos históricos por revalidar.

## Preflight del owner local

El directorio local `n8n-local`:

- tiene `AGENTS.md`, specs, docs, checks, Compose y datos persistentes;
- no tiene metadata `.git` en su raíz ni remote owner observable;
- no tiene `.github/workflows`, por lo que hoy no existe un efecto automático
  de merge equivalente al detectado en SST Bend;
- declara puertos loopback fijos `5050` y `5678`;
- consume `POSTGRES_PASSWORD`, `PGADMIN_DEFAULT_PASSWORD` y
  `N8N_ENCRYPTION_KEY` desde variables de entorno, no desde secretos por
  archivo;
- contiene un `.env` local, cuyo contenido no fue leído;
- contiene directorios persistentes, que tampoco fueron inspeccionados.

Sin provenance Git no existe una ruta auditable para publicar un playbook
owner. Inicializar, conectar o importar ese directorio a un repositorio requiere
una autorización separada y una decisión explícita de custodia.

## Estrategia de recuperación mínima

1. Recuperar primero sólo la identidad `CR-CP-0021` en un inbox canónico, con
   evidencia de procedencia legacy y sin catalogar todavía el servicio.
2. Fusionar y releer esa reserva desde `origin/main`.
3. Preparar un plan actual desde la nueva base que separe:
   - catálogo/solution/state de onboarding `discovered`;
   - decisión de provenance y repositorio owner;
   - adopción local de secretos y puertos;
   - cualquier M2M futuro.
4. Publicar `running` sólo para el primer slice control-plane aprobado.
5. No tocar Automation hasta que exista owner Git auditable y documentación
   owner publicable.

## Lote recomendado para autorización siguiente

Texto sugerido:

> Autorizo el Lote B1 de CR-HPT-0027: recuperar y publicar únicamente la
> identidad inbox de CR-CP-0021 desde un worktree limpio de origin/main,
> registrar la procedencia del worktree legacy y validar el control plane. No
> autorizo todavía catálogo, solution/state/capabilities, inicializar o conectar
> Git en n8n-local, modificar Automation/Auth/SST, leer .env o datos, generar
> secretos, iniciar contenedores, escribir Jira ni mutar infraestructura.

## Validación de este preflight

- Sólo se realizaron lecturas de Git, lifecycle, AGENTS, nombres de archivos,
  Compose y `.env.example`.
- No se leyó `.env`, secretos, bases, payloads ni directorios persistentes.
- No se ejecutó Docker ni se modificó un owner.
