# CR-HPT-0003 - Resultados De Validación

Fecha: 2026-08-18

## Resultado

La reconciliación contractual local pasa sus gates. CR-HPT-0003 permanece
`running` porque no existe runtime HPT, no se publicó la branch y Jira HPT-4 no
fue modificado.

## Pruebas Ejecutadas

### Gate Contractual HPT

Comando:

```text
node backend/scripts/check-contracts.js
```

Resultado: PASS.

- identidad canónica `finanzas-personales-backend` enlazada;
- membership y fail-closed requeridos;
- perfil único por `account_id + stable_subject`;
- owner, subject y account scope seleccionados por cliente rechazados.

### Parseo Y Formato

- 24 contratos YAML de HPT/control plane parseados correctamente con PyYAML;
- `git diff --check` en HPT: PASS;
- `git diff --check` en control plane: PASS.

### Regresión Del Binding

Comando:

```text
npm run test:local-bindings
```

Resultado: PASS.

- omitir un servicio activo produce FAIL;
- omitir un servicio `deprecated` es válido.

La prueba necesita ejecución fuera del sandbox porque Node crea un subproceso
Node; dentro del sandbox el sistema devuelve `EPERM` antes de ejecutar el
fixture.

### Control Plane

Comando:

```text
npm run check
```

Resultado: PASS, 0 FAIL.

- catálogo: 5 OK;
- regresión de bindings: 2 OK;
- bindings reales: 41 OK, 4 WARN por diferencia SSH/HTTPS de remotes;
- state: 56 OK;
- initiatives: 20 OK;
- owner documentation: 109 OK;
- visual documentation: 10 mapas, 0 FAIL.

## QA Manual

No corresponde QA HTTP/manual en esta etapa. HPT todavía no contiene runtime,
base de datos, migraciones ni endpoints ejecutables. Declarar un smoke HTTP
sería evidencia falsa. El gate disponible es contractual y reproducible.

Antes de implementar runtime debe resolverse el mecanismo protegido que lleva
PrincipalContext o verifica membership entre SST y Phinance-API.
