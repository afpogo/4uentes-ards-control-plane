# Payload propuesto para JIRA-SEC-PREPROD-03

Estado: `APPROVED` el 2026-08-23 para una única ejecución del batch enumerado.

## Allowlist

| Issue | Operación 1 | Operación 2 |
| --- | --- | --- |
| `SST-86` | reemplazar línea de sincronización en descripción | agregar comentario |
| `SST-89` | reemplazar línea de sincronización en descripción | agregar comentario |
| `SST-92` | reemplazar línea de sincronización en descripción | agregar comentario |

En las tres descripciones se aplica exactamente:

```text
Antes:  Proceso de sincronización: `CR-SST-0204`.
Después: Proceso de sincronización: `CR-SST-0213`.
```

El resto de cada descripción se conserva byte a byte según el readback previo
a la escritura.

## Comentario exacto para SST-86

```text
Corrección de identidad mediante `CR-SST-0213` / `JIRA-SEC-PREPROD-03`.

`JIRA-SEC-PREPROD-02` corrigió correctamente los hechos posteriores a PR #35, pero utilizó `CR-SST-0204` como label de sincronización. Ese ID pertenece canónicamente a Bend chat retention and cache semantics; `CR-SST-0213` gobierna la reconciliación de identidad.

Esta operación reemplaza únicamente la línea `Proceso de sincronización` de la descripción y agrega este comentario. No modifica estado, prioridad, labels, parent, summary ni comentarios históricos. Jira continúa como mirror y no se publican valores sensibles.
```

## Comentario exacto para SST-89

```text
Corrección de identidad mediante `CR-SST-0213` / `JIRA-SEC-PREPROD-03`.

`JIRA-SEC-PREPROD-02` corrigió correctamente los hechos posteriores a PR #35, pero utilizó `CR-SST-0204` como label de sincronización. Ese ID pertenece canónicamente a Bend chat retention and cache semantics; `CR-SST-0213` gobierna la reconciliación de identidad.

Esta operación reemplaza únicamente la línea `Proceso de sincronización` de la descripción y agrega este comentario. No modifica estado, prioridad, labels, parent, summary ni comentarios históricos. Jira continúa como mirror y no se publican valores sensibles.
```

## Comentario exacto para SST-92

```text
Corrección de identidad mediante `CR-SST-0213` / `JIRA-SEC-PREPROD-03`.

`JIRA-SEC-PREPROD-02` corrigió correctamente los hechos posteriores a PR #35, pero utilizó `CR-SST-0204` como label de sincronización. Ese ID pertenece canónicamente a Bend chat retention and cache semantics; `CR-SST-0213` gobierna la reconciliación de identidad.

Esta operación reemplaza únicamente la línea `Proceso de sincronización` de la descripción y agrega este comentario. No modifica estado, prioridad, labels, parent, summary ni comentarios históricos. Jira continúa como mirror y no se publican valores sensibles.
```

## Operaciones prohibidas

- crear o borrar issues;
- transicionar estados;
- cambiar prioridad, labels, parent, summary o assignee;
- editar o borrar comentarios históricos;
- modificar cualquier otro issue;
- publicar secretos, credenciales, tokens, cookies o datos privados.
