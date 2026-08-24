# Inicio de ejecucion de CR-SST-0207

Fecha: 2026-08-23.

## Autoridad

El usuario indico `avancemos con el procimo paso CR-SST-0207` y luego confirmo
`No olvidemos actualizar jira, doy aprobacion y continuemos`.

La autorizacion inicia exclusivamente la QA integrada de retencion consciente
del chat en development. No autoriza modificar repos hijos, desplegar, cambiar
manifests, activar feature flags ni operar produccion.

## Precondiciones ARDS/SDD

Los cuatro lifecycles declarados como dependencia estan `done`:

- `CR-SST-0204`: Bend, persistencia y cache-aside;
- `CR-SST-0205`: Redis de development;
- `CR-SST-0211`: facade de retencion en `4uentes-auth`;
- `CR-SST-0206`: UX explicita de consentimiento en `sst-fend`.

`SST-117` es solamente el espejo operativo de este lifecycle. ARDS/SDD
conserva la autoridad.

## Perfil operativo

- Provider: `codex`.
- Recursos: `normal/default`.
- Clasificacion: `complex-high-risk-task`.
- Perfil primario: alias `gpt-5.6-sol`, reasoning `max`.
- Fallback: `gpt-5.5` si el perfil primario no esta disponible y conserva la
  seguridad requerida.
- Subagentes: ninguno; la politica del runtime deshabilita delegacion proactiva
  y la matriz se ejecutara secuencialmente con identidades aisladas.

## Alcance de ejecucion

- Entorno: development.
- Superficies: localhost y ruta ngrok reservada.
- Datos: cuentas, conversaciones y mensajes sinteticos.
- Limpieza: solamente mediante acciones del producto.
- Evidencia: no conservar passwords, tokens, cookies, bodies de mensajes,
  credenciales Redis ni URLs privadas.

## Gates

1. Fusionar el lifecycle `running` en el control plane.
2. Consumir el lote exacto `SST-117 -> En curso` y registrar readback.
3. Verificar bindings y disponibilidad de las dos superficies.
4. Ejecutar las ocho filas de la matriz sin modificar codigo ni infraestructura.
5. Ejecutar checks owner relevantes y `npm run check` del control plane.
6. Publicar resultado y solicitar un lote Jira separado para cierre.
