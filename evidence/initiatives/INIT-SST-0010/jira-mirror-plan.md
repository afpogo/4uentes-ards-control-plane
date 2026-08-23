# INIT-SST-0010 - Plan De Mirror Jira

Fecha: 2026-08-17

## JerarquÃ­a Planeada

```text
Epic: INIT-SST-0010 Personal Knowledge and Memory Workspace V1
  â”œâ”€â”€ CR-SST-0192 contrato y arquitectura
  â”œâ”€â”€ CR-SST-0193 memoria canÃ³nica en sst-bend
  â”œâ”€â”€ CR-SST-0194 propuestas y recall en sst-chatbot
  â”œâ”€â”€ CR-SST-0195 proyecciÃ³n portable
  â”œâ”€â”€ CR-SST-0196 revisiÃ³n y exportaciÃ³n UX
  â”œâ”€â”€ CR-SST-0197 vistas de memoria para robots
  â””â”€â”€ CR-SST-0198 validaciÃ³n E2E y cierre
```

## Reglas

- Proyecto Jira: `SST`.
- La Initiative se refleja en una Epic.
- Cada CR se refleja en una Tarea directamente bajo la Epic porque cada uno
  representa una unidad independiente o cross-repo.
- Los summaries deben incluir Initiative y CR.
- Cada descripciÃ³n debe declarar intenciÃ³n, alcance, dependencias, resultado y
  que Jira es mirror.
- La creaciÃ³n no autoriza implementaciÃ³n, transiciÃ³n, comentario ni cierre.

## Preflight Requerido

- Buscar duplicados por `INIT-SST-0010` y por cada ID `CR-SST-0192` a
  `CR-SST-0198`.
- Verificar tipos Epic y Tarea del proyecto SST.
- Crear primero la Epic y usar su key como parent de las siete tareas.
- Leer nuevamente summary, type, status y parent despuÃ©s de cada creaciÃ³n.
