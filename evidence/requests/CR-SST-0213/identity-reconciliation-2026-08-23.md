# CR-SST-0213 — reconciliación de identidad del lote Jira histórico

Fecha observada: 2026-08-23.

## Hallazgo

El PR #39 ejecutó y verificó `JIRA-SEC-PREPROD-02` desde una base anterior al
namespace canónico incorporado luego a `main`. El lote corrigió los hechos de
`SST-86`, `SST-89` y `SST-92`, pero utilizó `CR-SST-0204` como identificador de
la corrección.

`main` asigna de forma canónica `CR-SST-0204` a **Bend chat retention and cache
semantics**, con `SST-114` como mirror primario. Por lo tanto, los dos usos no
pueden coexistir como lifecycles ARDS/SDD.

## Decisión

- Se preserva el lifecycle canónico de `CR-SST-0204` sin cambios de identidad.
- La reconciliación del PR #39 adopta `CR-SST-0213`.
- Los antiguos archivos `inbox`, `planned` y `done` del label colisionado se
  retiran de `requests/` y se conservan como snapshots históricos en este
  directorio.
- No se fabrica una fase `running` histórica: el policy check original la
  afirmó, pero esa superficie nunca fue publicada en la rama.
- Los payloads, autorización, resultado y readback conservan literalmente el
  label utilizado en la escritura original.
- Esta resolución no ejecuta ni autoriza una nueva escritura Jira.

## Estado externo

Las narrativas Jira contienen los hechos canónicos posteriores a PR #35, pero
todavía referencian el label colisionado `CR-SST-0204`. Corregir únicamente ese
enlace requiere otro lote enumerado, con autorización humana nueva, preflight,
resultado y readback sanitizado.

## Límite de cierre

El PR puede quedar libre de conflictos y publicar esta reconciliación local.
`CR-SST-0213` permanece `running` hasta que exista una decisión explícita sobre
la corrección del mirror Jira o una excepción owner que cierre el gap.
