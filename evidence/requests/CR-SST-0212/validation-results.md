# CR-SST-0212 — validación owner histórica recuperada

Fecha de ejecución reportada: 2026-08-22.

- Commit owner local: `efa955b` (`feat(sst): add phinance swagger facade shell`).
- `npm run test:phinance-facade-shell`: OK.
- `npm run build`: OK.
- `npm run check`: OK con cobertura protegida parcial por ausencia de
  `SMOKE_JWT`.
- `git diff --check`: OK antes del commit.

El test reportado cubre OpenAPI proyectado, reemplazo de `servers`, Swagger UI,
ausencia de URL interna, `401` sin JWT y `503` seguro cuando el contrato owner
no está disponible. No existe forwarding financiero.

`npm install` reportó 46 vulnerabilidades en el árbol completo (10 low, 14
moderate, 19 high y 3 critical). No se ejecutó `npm audit fix`; esa deuda queda
fuera de este lifecycle y requiere un request de seguridad separado.

Estos resultados se preservan como evidencia histórica del commit local. No
prueban publicación remota: `efa955b` no apareció en las refs devueltas por
`git ls-remote origin` el 2026-08-22.
