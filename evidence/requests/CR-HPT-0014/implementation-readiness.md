# CR-HPT-0014 - Preparación de perfil financiero y frontera principal

Fecha observada: 2026-08-22. Reconciliación canónica: 2026-08-23.

## Resultado

Phinance puede publicar su identidad propietaria local, pero no activar el
transporte SST a Phinance. El corte seguro crea `finance_profiles`, resuelve un
perfil idempotentemente y mantiene la API financiera cerrada hasta disponer
de una credencial de servicio verificable.

La separación evita aceptar headers como autoridad o reutilizar un bearer de
usuario con audience de SST como identidad del servicio `sst-bend`.

## Diseño acotado

1. `TrustedSstPrincipal` representa hechos externos ya autenticados.
2. El resolver crea o recupera el perfil por `(account_id, stable_subject)`
   sólo después de validar un entitlement financiero.
3. `PrincipalContext` incorpora el `finance_profile_id` local y trazas
   confiables para auditoría.
4. `/ready` exige base de datos y provider confiable; `/health` sólo mide vida
   del proceso.
5. El adapter concreto deberá consumir el futuro contrato físico del provider.

PostgreSQL debe usar `INSERT ... ON CONFLICT DO NOTHING` y luego seleccionar la
fila única. Los identificadores son opacos y no se normalizan destructivamente.
No se guardan tokens, secretos ni entitlements en el perfil.

Si existen recursos o auditorías cuyo UUID de perfil no puede asociarse de
forma demostrable a cuenta y sujeto, la migración debe bloquearse. Crear
propietarios sintéticos ocultaría pérdida de ownership financiero.

## Recuperación

El análisis y la implementación histórica quedaron preservados en `48776c6`,
`df733c5` y `daa66e5`, pero fuera del canon. Esta publicación adopta el plan y
la autorización; todavía no afirma que el owner esté integrado. El cierre
requiere port limpio, validación, PR, merge y readback de Finanzas.
