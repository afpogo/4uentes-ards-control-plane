# Resumen de auditoria del stack ARDS/SDD

- Ejecucion: 20260628-190113
- Output root: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\stack\20260628-190113
- Escritura en repos auditados: no; los informes se materializaron dentro del control-plane.
- Core: C:\Users\andre\Desktop\4uentes\apps\4uentes-core
- Control Plane: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor
- Repos hijos auditados: 6

| Auditoria | Target | Ruta | Informe |
| --- | --- | --- | --- |


## Nota de boundary

Los targets externos fueron usados como contexto de lectura por el runner. Para respetar el workflow del control-plane, -OutputRoot apunto a este directorio del orchestrator y no a los repos hijos.
