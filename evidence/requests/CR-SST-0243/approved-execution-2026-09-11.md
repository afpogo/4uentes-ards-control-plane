# Ejecución aprobada de CR-SST-0243

Fecha: 2026-09-11. El usuario autorizó expresamente «ok autorizo el lote y la
ventana» después de recibir el alcance y la mecánica de una ventana de 60
minutos. Esta decisión autoriza el lote exacto de
`execution-gate-2026-09-10.md`; no amplía el contrato funcional.

La ventana comienza sólo después de fusionar y leer desde `main` este lifecycle
running y el ledger Jira. Desde T0 permite: máximo cuatro escrituras Jira;
crear un worktree limpio de `4uentes-auth`; implementar el relay, metadata de
intento, owner docs y pruebas; ejecutar checks; publicar branch y abrir el PR.

La autorización se vuelve de un solo uso con la primera escritura externa. Un
resultado parcial, fallido o incierto consume el lote: se detienen nuevas
escrituras, se reconcilia en lectura y se requiere una aprobación nueva. La
ventana también expira al completar los readbacks, perder credenciales o llegar
a T0 + 60 minutos.

No autoriza fusionar el PR Auth, publicar imagen, actualizar Infra/GitOps,
ejecutar runtime, migraciones, flags o datos reales, ni modificar Bend o Fend.
La apertura del PR no publica imagen: el workflow owner construye con
`push=false` para eventos pull request.

El conector Atlassian integrado falló antes de T0 con refresh token inválido.
El preflight se completó sin escrituras mediante el endpoint MCP oficial
alternativo ya configurado. Ese cambio de transporte no cambia sitio, proyecto,
scope, cantidad de operaciones ni reglas de consumo y debe quedar registrado en
el readback final.
