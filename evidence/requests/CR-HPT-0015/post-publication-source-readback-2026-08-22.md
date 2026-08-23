# CR-HPT-0015 - Readback posterior a publicación

Fecha: 2026-08-22.

## Publicación

El PR #48 integró la recuperación selectiva en
`origin/main@c6448e7`. La comparación posterior de los 80 paths modificados por
los ocho commits fuente confirma la disposición publicada:

- 69 paths son idénticos entre el snapshot fuente y `origin/main`;
- 4 paths difieren por reconciliación canónica documentada;
- 7 paths permanecen ausentes por exclusión deliberada.

Los cuatro paths reconciliados son:

- `initiatives/00-index.yaml`: conserva las iniciativas SST posteriores y
  agrega HPT 0002/0003;
- `requests/planned/CR-HPT-0004-...`: conserva el scope backend y actualiza el
  blocker de predecesores;
- `scripts/verify-local-bindings.js`: conserva el validador canónico actual;
- `docs/apps/service-catalog.md`: no adopta documentación derivada del
  self-test antiguo no demostrado.

Los siete paths ausentes son los seis lifecycle `running` que tenían un
`done` correspondiente y `scripts/test-verify-local-bindings.js`.

## Actividad posterior al snapshot

El readback de la raíz dirty detectó cambios HPT que no formaban parte de los
ocho commits inventariados al iniciar `CR-HPT-0015`:

- `requests/planned/CR-HPT-0013-define-trusted-principal-context-v1.yaml`
  está modificado;
- `requests/running/CR-HPT-0013-define-trusted-principal-context-v1.yaml` es
  un archivo nuevo sin commit;
- `INIT-HPT-0002` referencia ese avance y también el plan SST-Phinance local;
- el lifecycle local colisionado `CR-SST-0207` ahora contiene inbox, planned y
  running sin publicar.

Esta actividad es posterior o externa al snapshot recuperado. No se adopta,
descarta ni reinterpreta dentro de `CR-HPT-0015`. `CR-HPT-0013` debe continuar
bajo su propia autoridad y el plan SST-Phinance debe recibir una identidad SST
libre antes de cualquier publicación.

## Disposición final

La intención HPT contenida en los ocho commits fuente quedó recuperada. La
raíz dirty y su branch permanecen en cuarentena porque conservan trabajo
posterior sin commit y numerosos bloques no HPT. Este cierre no autoriza
retirar el worktree, borrar la branch ni modificar repositorios owner.
