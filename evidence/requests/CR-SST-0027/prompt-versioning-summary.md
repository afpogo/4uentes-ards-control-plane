# CR-SST-0027 - Prompt Versioning Y Provenance

Observado el: 2026-06-04

## Decision

Toda derivacion secuencial debe registrar prompt, version, modelo, provider
adapter y hashes de contexto. Sin esa metadata, el ARDS/SDD de usuario no puede
auditar por que un hecho, intencion o resumen fue propuesto.

## Campos Requeridos

Cada `paragraph_derivation_run` debe registrar:

- `prompt_id`;
- `prompt_version`;
- `model_profile`;
- `provider_adapter`;
- `run_id`;
- `correlation_id`;
- `idempotency_key`.

Cada `paragraph_derivation` debe registrar:

- `input_context_hash`;
- `output_context_hash`;
- `paragraph_index`;
- `chunk_index`;
- `evidence_refs`;
- `confidence`;
- `validation_flags`.

## Versionado

El prompt de derivacion debe versionarse como contrato de producto, no como
texto suelto. Cambiar instrucciones, schema de salida o criterios de extraccion
debe crear una nueva version.

Versiones futuras pueden diferenciar:

- derivacion de articulo;
- derivacion de PDF;
- derivacion de libro;
- derivacion de notas manuales;
- derivacion de transcripciones.

## Provenance

La provenance debe permitir responder:

- que fuente origino la propuesta;
- que parrafo o chunk la justifico;
- que prompt y modelo participaron;
- que contexto acumulado se uso;
- que validaciones fallaron o pasaron;
- si la salida fue inferida o textual.

## Boundary

El prompt puede sugerir conocimiento, pero no puede otorgar autoridad final.
La validacion backend y, cuando corresponda, la revision del usuario deciden que
entra al ARDS/SDD final.
