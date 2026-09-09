# Recuperación y validación de los primeros gates de custodia

## Autoridad y ventanas

El usuario autorizó ejecutar el plan de recuperación en esta sesión. Se reutiliza
`CR-CP-0024` como coordinador y `CR-HPT-0024` como owner Infra. No se promueven
Auth ni SST a ramas estables. Los roots sucios se preservan. No se habilitan
Telegram, Phinance, upload ni AIStor/KMS. No se eliminan worktrees.

La recuperación es retroactiva: Auth PR #15 y SST PR #32 se integraron antes de
publicar los lifecycles recuperados `CR-HPT-0022` y `CR-HPT-0023`. Los estados de
las fuentes son históricos y no acreditan validación actual. Los hashes de los
archivos de origen están en `inventory/custody-recovered-sources-2026-09-08.json`.

| Ventana | Fuentes y archivos permitidos | Salida y criterio |
| --- | --- | --- |
| Recuperación | Worktrees registrados; metadatos globales; requests 0022/0023/0025/0026; evidencia CP de custodia | Inventario, procedencia, dependencias corregidas y disposición sin borrado |
| Documentación Infra | Worktree existente CR-HPT-0024; guía Learning ClamAV, índice, snapshots del playbook/runbook y evidencia owner | Check Infra y CP completos; PR documental a develop; readback |
| Validación Auth/SST | Checkouts de develop en los worktrees de preflight existentes; harnesses owner; sólo fixtures efímeros | Matrices, HTTP y PostgreSQL desechable; registrar fallas y límites |
| Continuación runtime | Scanner; arranque desde cero, firmas, EICAR, limpio e indisponibilidad | Sólo después de gates técnicos; no confundir recarga continua con arranque |

La autorización de documentación permite editar, commitear y publicar el PR
documental pedido. Las transiciones terminales Jira requieren el lote exacto
y autorización explícita posterior. Los comentarios se preparan para revisión.

## Aplicación de políticas

Proveedor Codex; recursos normal/default; tarea complex-high-risk-task.
Perfil efectivo: modelo principal configurado por la sesión, razonamiento alto;
la sesión no permite cambiar el modelo principal a la preferencia local Sol/max.
Se conserva el trabajo sensible secuencial y se registra esta diferencia, sin
reducir matrices ni checks. Sin subagentes; revisión contractual en el principal.
Las fuentes normativas siguen en Core y cada owner conserva su contrato.

## Equivalencias de procedencia

| Gate | Owner / Jira | Procedencia preservada | Integración / destino |
| --- | --- | --- | --- |
| Grants separados | Auth / HPT-14 | f9fe6b5; etiquetas históricas CR-CP-0021, CR-HPT-0016 y CR-HPT-0022 | Auth PR #15, ff5605c; coordinador CR-CP-0024; lifecycle recuperado CR-HPT-0022 |
| Intake y bindings | SST / HPT-15 | 2a0de56; etiquetas históricas CR-HPT-0019 y CR-HPT-0023 | SST PR #32, 5db4dd8; coordinador CR-CP-0024; lifecycle recuperado CR-HPT-0023 |
| Scanner y plataforma | Infra / HPT-16 | a01c28d guía ClamAV; precursor histórico CR-HPT-0020 | CR-HPT-0024; PR #29, a3522df para memoria; guía documental pendiente |
| Upload y retención | SST / HPT-17 | Plan local CR-HPT-0025 | CR-HPT-0025, bloqueado hasta validar plataforma y gates previos |
| QA Automation | Automation / HPT-18 | Plan local CR-HPT-0026; etiqueta histórica CR-HPT-0017 | CR-HPT-0026, bloqueado por upload y plataforma |

CR-HPT-0016, 0017, 0019 y 0020 son etiquetas históricas de esta cadena, no
referencias a los requests canónicos actuales del mismo número. Se preservan
sus fuentes bajo el paquete de CR-CP-0024; no se sobrescriben esas identidades.

## Verificación pendiente

### Corrección mínima autorizada de SST

La matriz HTTP sintética sobre `sst-bend@fdc753f` reprodujo admisión `202` de
un binding con `expires_at` pasado y `status=active`; el contrato exige rechazo.
Se activa la corrección prevista en el plan del usuario bajo CR-HPT-0023,
coordinada por CR-CP-0024, antes de mutar el owner. Archivos permitidos:
`accept-receipt-intake.service.js`, `sequelize-receipt-intake.repository.js`,
documentación de intake/bindings y regresión HTTP sintética. La consulta debe
usar el reloj de admisión y exigir `expires_at > now`. Se preservan endpoints,
RBAC, migraciones y los cambios posteriores. Se permite publicar el PR de
corrección hacia develop después de los checks. No se promueve a stable ni
se autoriza despliegue automático de SST por esta recuperación.

TODO: completar resultados owner, HTTP, persistencia, readback documental,
reconciliación Jira y disposición detallada. Ningún gate se declara cerrado
por estar integrado en Git. El full check inicial de CP pasó antes de recuperar
archivos; se repetirá sobre el resultado final.
