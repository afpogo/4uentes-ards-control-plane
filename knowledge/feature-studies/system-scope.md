# Alcance del Sistema y líneas de exploración

## Definición operativa

Para estudiar features, el **Sistema** es el conjunto de soluciones lógicas y servicios catalogados que coordina este Control Plane. La frontera se deriva del catálogo; no crea una nueva arquitectura runtime.

Esta definición permite analizar capacidades transversales sin borrar la propiedad de cada repositorio. Una feature común puede necesitar coordinación central, pero su implementación y su contrato siguen perteneciendo a los owners funcionales correspondientes.

## Fotografía del alcance

| Solución o capa | Estado | Servicios incluidos | Lectura para discovery |
| --- | --- | --- | --- |
| `4uentes` | activa | `4uentes-portfolio` | Experiencia pública y presentación verificable del portafolio. |
| `sst` | activa | Core: `sst-fend`, `sst-bend`; shared: `4uentes-auth`; optional: `sst-extension`, `sst-chatbot`; infra: `sst-4uentes-infra` | Producto multi-superficie con identidad compartida, frontend, backend, agente opcional y operación GitOps. |
| `finanzas-personales` | planificada | `finanzas-personales-frontend`, `finanzas-personales-backend` | Discovery temprano; cualquier excepción de consumo directo debe seguir tratándose como draft. |
| Gobierno y estándar | habilitadora | `4uentes-ards-control-plane` y el estándar externo `4uentes-ards-core` | Lifecycle, catálogo, evidencia, políticas y validación; no es dueño del runtime de producto. |

La tabla resume nueve identidades de servicio catalogadas. `4uentes-ards-control-plane` y `4uentes-ards-core` son componentes de gobierno, no nuevas identidades de producto dentro de ese conteo.

No se deben inferir soluciones sólo porque exista un nombre histórico o un servicio compartido. En particular, este estudio no crea `fulbito-solution` ni cambia el alcance normativo del catálogo.

## Lentes comunes de análisis

Toda idea debería observarse desde varias lentes antes de convertirse en feature:

- valor para el usuario y problema demostrado;
- responsabilidad de producto frente a capacidad compartida;
- identidad, autorización, privacidad y prevención de abuso;
- contratos, datos, compatibilidad y migración;
- experiencia web, extensión, mobile u otras superficies realmente catalogadas;
- observabilidad, soporte, costo operativo y recuperación;
- accesibilidad, lenguaje y límites legales;
- rollout, degradación, rollback y evidencia de aceptación.

## Líneas iniciales de estudio

Las siguientes son preguntas de exploración, no backlog aprobado ni promesas de entrega.

### Capacidades compartidas

- ¿Qué partes de identidad, sesiones, seguridad y preferencias deben ser comunes sin acoplar los productos a detalles internos de Auth?
- ¿Cómo ofrecer exportación, portabilidad, retención y borrado comprensible de datos por solución?
- ¿Qué eventos de auditoría y notificaciones son realmente útiles al usuario y cuáles sólo agregan ruido o riesgo de privacidad?
- ¿Qué señales mínimas de salud y calidad permiten operar el portafolio sin recopilar contenido sensible?

### SST

- ¿Cómo mejorar captura, organización, búsqueda y recuperación de conocimiento personal?
- ¿Qué continuidad debe existir entre frontend, extensión y chat sin duplicar fuentes de verdad?
- ¿Qué acciones asistidas por IA requieren confirmación humana, procedencia visible y límites de datos?
- ¿Cómo evolucionar diccionarios, tags y conversaciones manteniendo recuperación y compatibilidad?

### Portfolio 4uentes

- ¿Cómo publicar experiencia y evidencia con un lifecycle verificable y fácil de mantener?
- ¿Qué analítica mínima aporta decisiones sin seguimiento invasivo?
- ¿Qué partes de contenido necesitan versionado, revisión o procedencia?

### Finanzas personales

- ¿Cuál es el modelo mínimo de cuentas, instrumentos y movimientos que entregue valor antes de automatizar?
- ¿Cómo ingresar documentos o movimientos con revisión humana y sin confiar ciegamente en OCR o IA?
- ¿Qué conciliación, explicabilidad y recuperación requiere una operación financiera asistida?
- ¿Qué datos deben permanecer locales, cifrados, exportables o sujetos a retención limitada?

### Control Plane

- ¿Cómo hacer trazable el paso de una idea a discovery, iniciativa, CR, evidencia y cierre?
- ¿Cómo visualizar dependencias y owners sin convertir al Control Plane en dueño de los contratos runtime?
- ¿Qué criterios de readiness permiten comparar propuestas sin imponer una falsa puntuación objetiva?
- ¿Cómo detectar documentación y evidencia desactualizadas con bajo costo operativo?

## Criterios para priorizar el estudio

Una línea merece profundización cuando combina evidencia de un problema, un usuario identificable y un primer corte reversible. Conviene posponerla cuando depende de identidades aún no catalogadas, requiere una expansión legal no evaluada, carece de owner o mezcla múltiples resultados independientes.

Una secuencia razonable de decisión es:

1. confirmar el problema con evidencia segura;
2. ubicarlo en una solución y owner existentes;
3. comprobar si ya existe una capacidad compartida;
4. diseñar el corte más pequeño que reduzca incertidumbre;
5. evaluar riesgos y rollback;
6. promoverlo al lifecycle sólo si la relación valor/costo sigue siendo defendible.

