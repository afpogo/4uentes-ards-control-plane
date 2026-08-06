# CR-SST-0084 - Decision de cierre local

Fecha: 2026-06-25

## Decision

CR-SST-0084 queda apto para cierre local como `done`.

El estado de la funcionalidad queda en `validated-local`, no `validated-live`,
porque la validacion fue ejecutada en entorno local Docker y Chrome DevTools MCP.

## Evidencia que soporta el cierre

- Implementacion backend, BFF y frontend completada para v1.
- `sst-bend` con pruebas focalizadas de secretos y Stage 3 Dictionary en PASS.
- `4uentes-auth` build/check en PASS.
- `sst-fend` build y lint focalizado en PASS.
- QA manual Chrome DevTools MCP cubrio create, list masked, reveal, auto-hide,
  copy, rotate y revoke.
- `4uentes-orchestor: npm.cmd run check` en PASS.
- Evidencia visual guardada solo en estado masked.

## Gaps aceptados

- `SST_DICTIONARY_SECRETS_MASTER_KEY` es una precondicion obligatoria por
  ambiente. Sin esa variable, create falla con 500 porque el backend no puede
  cifrar valores. Debe tratarse antes de cualquier despliegue live.
- Smoke HTTP autenticado con `SMOKE_JWT` o `SMOKE_JWT_OWNER` queda pendiente
  por falta de credenciales locales.
- `sst-extension` queda fuera de v1.
- `seed_phrase`, recovery phrase, mnemonic y equivalentes siguen bloqueados o
  no soportados en v1.
- Warning frontend de DOM nesting en `DictionarySecretsPanel`: hay un item
  clickeable que contiene botones de accion. Debe corregirse como deuda UX/a11y
  antes de endurecer accesibilidad.
- Issues a11y de labels/id/name/autocomplete quedan como follow-up.

## Jira / MCP

La prueba de conexion MCP/Jira respondio con 403:

```text
The app is not installed on this instance
```

Por esa razon no se transiciona Jira desde este cierre local. Cualquier
transicion externa requiere issue key reconciliado y aprobacion explicita.
