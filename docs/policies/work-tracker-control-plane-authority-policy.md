# Work Tracker Control Plane Authority Policy

## Proposito

Definir la autoridad, los limites de escritura y la reconciliacion aplicables
cuando un control-plane integra un work tracker externo. La policy es generica;
Jira es su primer perfil concreto y no define por si solo el contrato completo.

El identificador normativo es
`work-tracker-control-plane-authority-policy`. Su adopcion inicial pertenece a
`4uentes-orchestor`; una promocion posterior a `4uentes-ards-core` requiere un
request y handoff separados.

## Aplicabilidad

Aplica a control planes que declaran una integracion con un work tracker
externo. No es obligatoria para repos funcionales, child repos ni perfiles sin
tracker. Un repo hijo no puede ejecutar operaciones Jira en nombre del
control-plane.

## Principio De Autoridad

El tracker es espejo operativo y superficie de coordinacion. ARDS/SDD conserva
la autoridad del proceso.

| Dato | Autoridad |
| --- | --- |
| Request, lifecycle y estados ARDS/SDD | Control-plane |
| Definition of Done y evidencia de ejecucion | Control-plane |
| Issue key, assignee y comentarios | Work tracker |
| Estado observado del issue | Work tracker |
| Decision de adoptar una señal del tracker | Intake controlado del control-plane |

Un cambio observado en el tracker es una señal de intake. Nunca muta
automaticamente requests, estados, DoD ni evidencia local.

## Operaciones

- La lectura se permite dentro del scope del request y debe producir evidencia
  sanitizada cuando soporte una decision.
- La escritura exige una autorizacion de lote explicita y vigente.
- La publicacion hacia el tracker replica identidad, alcance y estado aprobado;
  no transfiere autoridad.
- La reconciliacion desde el tracker es read-only hasta que un lifecycle local
  acepte expresamente la señal.
- Se prohiben borrados y escrituras wildcard, masivas o sin limites enumerados.

## Contrato De Autorizacion Por Lote

Cada aprobacion de escritura debe declarar:

- request ID;
- provider y proyecto;
- issue keys enumerados o candidatos de creacion enumerados;
- operaciones permitidas;
- parent, issue type y status esperado;
- ventana de ejecucion.

La autorizacion se consume al completar el lote o vence al terminar su ventana.
No autoriza comentarios, ediciones, transiciones, borrados ni creaciones que no
esten enumerados. Cualquier ampliacion requiere una aprobacion nueva.

## Identidad Y Duplicados

Antes de crear se debe ejecutar una busqueda estructurada de duplicados y
comparar, cuando corresponda:

- request ID;
- state o initiative ID;
- summary;
- parent;
- labels;
- issue key ya registrado localmente.

Una coincidencia compatible bloquea la creacion y deriva a reconciliacion. El
routing de proyecto, parent e issue type se deriva del request y su iniciativa;
`ARDS`, `SST` o cualquier otro proyecto son valores de routing, no defaults
globales.

## Perfil Jira

- Jira Work read/write es la capacidad operativa para issues.
- JQL es la busqueda estructurada requerida para identidad y duplicados.
- Rovo es opcional. Un `403` o su ausencia degrada solamente la busqueda
  semantica y no bloquea Jira Work ni JQL.
- Proyecto, parent e issue type deben resolverse desde el request aprobado.

### Contrato De Jerarquia Jira

El perfil Jira adopta obligatoriamente
`jira-cr-mirror-hierarchy-policy` como contrato complementario. La
correspondencia normal es:

```text
Initiative ARDS/SDD <-> Epic Jira
CR independiente, cross-repo o contenedor <-> Task Jira bajo la Epic
CR ejecutable acotado <-> Task Jira o Subtask de una Task bajo la misma Epic
```

Cuando una iniciativa usa Jira, debe tener exactamente una Epic primaria. Cada
CR seleccionado para ejecucion debe tener exactamente un issue Jira primario.
La eleccion entre Task y Subtask se registra en el request antes de escribir:

- usar Task cuando el CR sea independiente, cross-repo o contenedor de trabajo;
- usar Subtask cuando el CR sea una unidad ejecutable acotada y exista una Task
  padre que represente el programa;
- toda Subtask debe tener una Task padre perteneciente a la Epic de la misma
  iniciativa;
- una Task puede depender directamente de la Epic cuando no exista un
  contenedor intermedio util.

El preflight debe resolver y verificar `initiative_id`, Epic primaria,
`request_id`, issue primario, project, issue type y parent. Una relacion
ausente, ambigua, duplicada o fuera de la Epic esperada bloquea la creacion o
transicion y deriva a reconciliacion. Jira no crea ni aprueba iniciativas o
CRs: los artefactos locales deben existir antes de publicar su mirror.

## Proteccion De Datos

No se pueden enviar al tracker ni conservar en evidencia publicada secretos,
tokens, cookies, credenciales, headers de autenticacion, JWT, identificadores
privados de conexion, URLs privadas ni contenido privado no requerido. Un
hallazgo de este tipo bloquea la publicacion hasta que el artefacto sea
sanitizado.

## Failure Behavior

- Duplicado compatible: rechazar creacion y reconciliar.
- Escritura fuera del lote o lote vencido/consumido: rechazar.
- Intento de ejecucion desde un repo hijo: rechazar.
- Evidencia con datos protegidos: rechazar hasta sanitizar.
- Jira Work disponible y Rovo bloqueado: continuar con JQL y registrar la
  degradacion semantica.
- Señal del tracker sin lifecycle local: registrar intake read-only, sin
  mutacion local.
- Jerarquia Jira ausente, duplicada o inconsistente: bloquear escritura y
  reconciliar Initiative, Epic, CR, issue primario, type y parent.

## Enforcement Y Runtime

La adopcion inicial usa `operational-review`: estas reglas y su failure behavior
son normativos, pero CR-CP-0007 no incorpora runners, probes, gates, scripts,
validators ni automatizacion. El enforcement ejecutable queda exclusivamente
como trabajo futuro de `INIT-CP-0003 / ARDS-13`, que consumira esta policy sin
redefinirla.

## Definition Of Done

- La autoridad por dato es explicita.
- Toda escritura corresponde a un lote vigente y enumerado.
- Identidad y duplicados se revisan antes de crear.
- Routing y perfil se derivan del request.
- Initiative, Epic, CR e issue primario conservan correlacion uno-a-uno donde
  aplica; toda Subtask pertenece a una Task bajo la Epic de la iniciativa.
- La evidencia queda sanitizada.
- Las señales externas no mutan automaticamente el control-plane.
