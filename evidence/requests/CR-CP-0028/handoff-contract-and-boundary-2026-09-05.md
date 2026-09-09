# Contrato Y Boundary Del Handoff A Core

Fecha: 2026-09-05. Request: `CR-CP-0028`.

## Decisión De Diseño

Se crea un capability outbound específico en estado `draft`:

`capability.outbound.knowledge-to-execution-policy-core-promotion`.

No se agregó la promoción al handoff general de agent policies porque ese
capability ya está marcado `implemented` y `adopted-in-core`. Mezclar un
contrato pendiente allí ocultaría dos estados de adopción incompatibles.

## Contrato Entregado

El handoff propone:

- policy ID estable: `knowledge-to-execution-documentation-policy`;
- clase objetivo: `core-profile-scoped`;
- perfil requerido propuesto: `control-plane`;
- perfiles opcionales propuestos: functional, child e Infra;
- relaciones tipadas entre explicación, decisión, autorización, ejecución,
  autoridad técnica y feedback;
- prohibición de interpretar la flecha de navegación como cronología universal
  o precedencia de autoridad;
- adopción de hijos sólo mediante request y manifest de adopción o excepción.

La policy no es un overlay porque representa un contrato durable completo y no
un delta contextual. El futuro modelo de overlays carece todavía de kind,
schema y resolver activos.

## Boundary Preservado

El capability outbound no modifica ni autoriza modificar Core. `AGENTS.md`
prohíbe tocar `4uentes-ards-core` desde este workflow del control plane. La
aceptación e implementación deben ejecutarse desde un workflow situado en el
owner, después de releer sus instrucciones y verificar su baseline.

La policy local conserva clase `origin-repo-policy` y owner control-plane hasta
que exista merge y readback canónico de Core. El handoff sólo cambia el estado
de promoción a plan publicado y propuesta draft.

## Concurrencia Reconciliada

Entre la reserva y la implementación del handoff, `origin/main` avanzó e
integró el cierre de `CR-CP-0027`. La adopción Infra ahora está probada por su
manifest owner y merge `8efb13ed5724cc52aa3e98db114bc07122229f12`.

Ese avance se incorporó mediante fast-forward antes del diff del handoff. No se
sobrescribió ni reabrió `CR-CP-0027`. Infra continúa adoptando la revisión de
origen `4uentes-orchestor@7a8ea96`; su estado no constituye canon Core ni
autoriza una reconciliación retroactiva silenciosa.

## Próximo Gate

Después de publicar y releer este handoff, el control plane debe detenerse en
el boundary. El paso siguiente es un workflow owner de Core que pueda aceptar,
ajustar o rechazar la propuesta, ejecutar sus checks y publicar su propio
readback. Sólo ese resultado habilita la reconciliación y cierre posteriores de
`CR-CP-0028`.
