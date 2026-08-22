# Estudio de feature: <nombre>

## Metadatos

- Estado: `idea | discovery | assessed | candidate | promoted | archived`
- Fecha de apertura: `YYYY-MM-DD`
- Última revisión: `YYYY-MM-DD`
- Proponente: `TODO`
- Soluciones afectadas: `TODO` (IDs existentes en `solutions/*.yaml`)
- Servicios afectados: `TODO` (IDs existentes en `catalog/services/*.yaml`)
- Owners candidatos: `TODO`
- Iniciativa o CR: `TODO | no creado`

## Problema u oportunidad

Describir qué sucede, para quién y en qué contexto. No asumir todavía una implementación.

## Resultado esperado

Definir el cambio observable que permitiría saber que valió la pena. Evitar listas de componentes como sustituto del resultado.

## No objetivos

- TODO

## Evidencia actual

Separar evidencia reproducible de opiniones. Incluir fuentes, fecha y límites de la observación sin copiar secretos ni datos personales.

## Usuarios y escenarios

| Usuario o actor | Necesidad | Escenario verificable |
| --- | --- | --- |
| TODO | TODO | TODO |

## Hipótesis y preguntas abiertas

### Hipótesis

- TODO

### Preguntas

- TODO

## Impacto en el Sistema

| Solución o servicio | Responsabilidad actual | Cambio posible | Autoridad documental |
| --- | --- | --- | --- |
| TODO | TODO | TODO | TODO |

No asignar responsabilidades runtime al Control Plane ni duplicar una capacidad compartida dentro de cada producto.

## Dependencias cross-repo

- Contratos o APIs: `TODO`
- Datos o migraciones: `TODO`
- Identidad y permisos: `TODO`
- Infraestructura y despliegue: `TODO`
- Orden de integración: `TODO`

## Seguridad, privacidad y cumplimiento

Analizar al menos autenticación, autorización, secretos, datos personales, retención, abuso, observabilidad segura y límites legales aplicables. Marcar `no aplica` sólo con una razón.

## Experiencia y operación

- Estados de carga, error, vacío y recuperación: `TODO`
- Accesibilidad e internacionalización: `TODO`
- Métricas y soporte: `TODO`
- Degradación y rollback: `TODO`

## Alternativas consideradas

| Alternativa | Beneficio | Costo o riesgo | Motivo para mantenerla o descartarla |
| --- | --- | --- | --- |
| TODO | TODO | TODO | TODO |

## Cortes alcanzables

1. `TODO`: primer corte pequeño, reversible y validable.
2. `TODO`: siguiente corte condicionado por la evidencia del anterior.

Cada corte debe declarar aceptación, owner y rollback; no debe agrupar cambios independientes sólo por conveniencia.

## Validación propuesta

- Señal de éxito: `TODO`
- Señal de daño o regresión: `TODO`
- Método de QA: `TODO`
- Evidencia que se conservará: `TODO`
- Datos que no deben capturarse: `TODO`

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| TODO | TODO | TODO | TODO |

## Recomendación

Elegir una: descartar, archivar, continuar discovery o promover. Explicar por qué y qué evidencia falta.

## Checklist de promoción

- [ ] El problema y el resultado son verificables.
- [ ] Los IDs de soluciones y servicios existen en el catálogo.
- [ ] Owners y autoridades documentales están identificados.
- [ ] Dependencias y orden cross-repo están explícitos.
- [ ] Seguridad, privacidad, operación y rollback fueron evaluados.
- [ ] El trabajo está atomizado en cortes alcanzables.
- [ ] Se eligió iniciativa o CR y se creó el lifecycle correspondiente.
- [ ] La documentación owner requerida forma parte del plan.

## Decisiones y TODOs

- `YYYY-MM-DD` — `TODO`

