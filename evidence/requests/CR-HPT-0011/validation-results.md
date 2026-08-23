# Resultados de validación

## Repo propietario de Phinance

Se ejecutaron desde la raíz de `finanzas-personales`:

```powershell
node backend/scripts/check-contracts.js
git diff --check
```

Resultado: aprobado. El contract checker confirmó:

- identidad HPT canónica enlazada;
- membership SST y ownership fail-closed requeridos;
- unicidad del perfil por `account_id + stable_subject`;
- rechazo del owner o account scope seleccionado por el cliente.

El barrido de contradicciones no encontró la anterior API Node.js, la exclusión
de Python ni el servicio de cálculo Python diferido. Tampoco encontró archivos
de runtime Python, `pyproject.toml`, requirements o Dockerfile dentro de
`backend`.

El QA manual de Chrome DevTools detectó y permitió corregir una inconsistencia
conceptual del ARDS raíz: `finance_profiles` ahora declara `account_id`,
`stable_subject` y su restricción única compuesta. La evidencia está en
`evidence/requests/CR-HPT-0011/manual-qa-partial.md`.

## Control plane

El preflight previo a la mutación owner y la corrida posterior pasaron con:

```powershell
npm run check
git diff --check
```

Resultado: cero fallas. El owner-documentation gate validó `CR-HPT-0011`; el
catálogo, iniciativas, estados y mapas visuales también pasaron. Persisten
cuatro advertencias preexistentes por diferencias entre URLs remotas y catálogo
en bindings locales, sin relación con este cambio.

## Estado de cierre local

La adopción documental está completa y fue promovida localmente:

- owner Phinance: `55e7a78`;
- control plane HPT: `5e6e19d`.

Ambos commits fueron validados nuevamente desde worktrees temporales aislados y
pasaron sus gates. No se hizo push ni se abrió pull request. El runtime continúa
sin implementar y corresponde a `CR-HPT-0012`.
