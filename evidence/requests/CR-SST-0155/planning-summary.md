# Plan de adopción RAG para el ARDS gobernado del usuario

## Decisión

`CR-SST-0155` conserva una capability independiente:
`sst-user-ards-rag`. Su fuente de conocimiento es la proyección gobernada de la
memoria interna del usuario SST junto con artefactos curados e indexables de su
workspace. No representa un checkout de ARDS/SDD de proyecto.

El orden obligatorio es autorización, proyección, recuperación, composición,
provider y validación de divulgación. Los filtros de tenant, usuario,
aplicación, entitlements, clasificación y fuente se aplican antes del ranking.

## Límite del capability link

El enlace al control-plane publica solamente estado y evidencia técnica. Tiene
`execution_authority: none` y `contains_business_data: false`; no transporta
preguntas, fragmentos recuperados, respuestas ni identificadores.

## Separación

Esta capability no comparte estado ni evidencia con la experiencia de
stakeholder. Puede producir contratos reutilizables de recuperación y citas,
pero su policy, fuentes y pruebas de divulgación son exclusivas de `sst_user`.
