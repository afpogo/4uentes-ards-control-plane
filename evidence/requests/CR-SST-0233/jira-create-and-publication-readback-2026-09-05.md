# Readback de publicación y creación Jira de CR-SST-0233

## Rol, alcance y autoridad

- Rol primario: evidencia de ejecución y readback.
- Owner: `4uentes-ards-control-plane`.
- Fuente de verdad: lifecycle ARDS/SDD de `CR-SST-0233`.
- Mirror operativo: Jira `SST-125`.
- Efecto de autorización: registra un lote ya consumido; no autoriza nuevas
  escrituras Git, Jira, owner o runtime.

## Publicación canónica previa

El PR de control-plane fue releído antes de escribir en Jira:

| Campo | Readback |
| --- | --- |
| PR | `afpogo/4uentes-ards-control-plane#251` |
| Estado | `MERGED` |
| Head autorizado | `407a0858cbbad7ccf576d6ce5b0220fd1ae1f932` |
| Merge commit | `371ef18ec358b306f69a431730bc014a61396205` |
| Fecha de merge | `2026-09-05T21:58:42Z` |
| Ref canónica | `origin/main@371ef18ec358b306f69a431730bc014a61396205` |

El merge publica el readback de salud runtime, el scoreboard de 49 puntos y el
preflight Jira. No autoriza por sí mismo la escritura en el tracker.

## Autorización exacta consumida

El usuario autorizó explícitamente el lote con el texto `autorizo a ejecutar
el lote jira`. La autorización se aplicó exclusivamente al lote enumerado y a
una única ventana de herramienta:

```yaml
provider: jira
project: SST
request_id: CR-SST-0233
operations:
  - action: create
    count: 1
    issue_type: Subtask
    parent: SST-122
    epic_ancestry: SST-105
    summary: "[SST][CR-SST-0233] Reconcile fresh-database migration baseline"
    expected_initial_status: "Tareas por hacer"
  - action: read-back
    target: created_issue
forbidden_operations:
  - comment
  - transition
  - link
  - post-create edit
  - write any other issue
```

## Resultado Jira

El readback posterior confirmó:

| Campo | Resultado |
| --- | --- |
| Issue creado | `SST-125` |
| Proyecto | `SST` |
| Tipo | `Subtask` |
| Parent | `SST-122` |
| Tipo del parent | `Tarea` |
| Estado del parent | `En curso` |
| Ancestro Epic verificado por preflight | `SST-105` |
| Summary | `[SST][CR-SST-0233] Reconcile fresh-database migration baseline` |
| Estado inicial | `Tareas por hacer` |
| Descripción | coincide con el payload autorizado |

No se ejecutaron comentarios, transiciones, links, ediciones posteriores ni
escrituras sobre otros issues. La autorización quedó consumida.

## Disposición y siguiente gate

`SST-125` pasa a ser el único issue primario de `CR-SST-0233`. Jira conserva el
rol de mirror y el control-plane conserva la autoridad del lifecycle. El estado
inicial `Tareas por hacer` coincide con el lote publicado; llevar el issue a
`En curso` o a un estado terminal requiere otro lote exacto.

El próximo gate es clasificar la información única del worktree legacy y
evaluar la preparación del lifecycle `done`. La transición terminal de Jira
sólo puede plantearse después de publicar y releer el cierre local.

Un mapa nuevo no es aplicable: la jerarquía ya validada
`INIT-SST-0010 / SST-105 → CR-SST-0220 / SST-122 → CR-SST-0233 / SST-125` no
cambia ninguna relación normativa; este readback materializa el nodo ya
planificado.
