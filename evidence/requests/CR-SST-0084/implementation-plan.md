# CR-SST-0084 - Plan de implementacion

## Clasificacion

- Task weight: `complex-high-risk-task`.
- Perfil primario: `gpt-5.5`.
- Motivo: datos sensibles, auth/account scope, contratos API, persistencia y UI
  de revelacion controlada.

## Secuencia

1. `sst-bend`: agregar persistencia, cifrado, endpoints producer, auditoria y
   tests de seguridad.
2. `4uentes-auth`: agregar BFF autenticado y tests de preservacion de auth,
   account scope y responses metadata-only.
3. `sst-fend`: agregar UI de Diccionario > Secretos con valores masked por
   defecto, copy/reveal temporal, rotacion, revocacion y filtros.
4. `4uentes-orchestor`: registrar evidencia no secreta, changed files y
   resultados de validacion.

## Definition of Done

- Ningun endpoint de lista, busqueda o export devuelve valores secretos.
- `reveal` y `copy` estan separados, autenticados y auditados.
- Valores cifrados at-rest antes de persistir.
- Rotacion crea nueva version y reemplaza la anterior.
- UI no deja valores visibles permanentemente.
- Tests por repo ejecutados o bloqueadores exactos documentados.
- `npm run check` del control-plane pasa.

## Notas de boundary

La mutacion de repos hijos queda gobernada por `CR-SST-0084` y debe respetar
los `AGENTS.md` locales. Esta evidencia no contiene secretos reales.
