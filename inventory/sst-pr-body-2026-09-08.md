Un binding con status=active pero expires_at vencido permitía un intake nuevo con 202. El servicio pasa ahora el instante de admisión y la consulta exige expires_at > now, devolviendo 403 sin cambiar el replay idempotente ni agregar endpoints.

Incluye harness HTTP con rutas y middleware reales, JWKS efímero y PostgreSQL desechable: 30 aserciones de binding/intake, scopes, aislamiento, rollback, revocación y vencimiento. El harness de migraciones existente pasó fresh, upgrade, down/up, preservación y paridad.

Validación: npm run check de SST exit 0, pruebas funcionales PASS; el smoke general aún informa cobertura protegida 50% frente a 80%, explícitamente no acredita QA completa de módulos ajenos. Harness de custodia PASS; full check CP PASS. Coordinación CR-CP-0024, owner CR-HPT-0023 / HPT-15.

Gate de merge pendiente: push a develop dispara imagen y actualización del pin Infra. Este PR no autoriza ese despliegue ni transición terminal Jira.
