# CR-CP-0003 - Analisis De Brecha De Enforcement De Policies

## Diagnostico

El problema no es que las policies no existan. Existen y estan enrutadas en el
ARDS/SDD.

El problema es que no todas las policies pasan de declarativas a ejecutables.

Una policy declarativa esta escrita en:

- `specs/integration/policies.yaml`;
- `docs/policies/*.md`;
- `AGENTS.md`;
- manifests de adopcion o excepcion.

Una policy ejecutable, ademas, tiene:

- preflight antes de editar;
- validator automatizado;
- check incluido en `npm.cmd run check`;
- evidencia de cierre;
- comportamiento fail-closed si falla.

Si falta esa segunda parte, el agente puede leer parcialmente, olvidar por
contexto, priorizar otra instruccion o generar documentacion fuera de policy.
Cuando el usuario lo marca, el agente lo acepta porque la policy era correcta,
pero el stack no la estaba forzando.

## Agujero Principal Del Stack

El agujero es la falta de un `policy enforcement runtime` completo.

Hoy el control-plane tiene buenas policies y algunos gates, pero no tiene un
runtime unico que compile todas las policies aplicables y las ejecute antes y
despues de cada cambio.

Ejemplo:

`human-doc-language` dice que `evidence/**/*.md` debe estar en espanol, pero no
hay un validator dedicado que falle si un agente crea evidencia humana en
ingles.

Entonces la policy existe, pero no bloquea el cierre automaticamente.

## Diferencia Entre Routing Y Enforcement

Routing significa:

"La policy esta listada y el agente sabe donde deberia buscarla."

Enforcement significa:

"Si la policy se incumple, el check falla y la CR no puede cerrar."

Ejemplo textual:

- Routing: `AGENTS.md` dice leer `docs/policies/`.
- Enforcement: `npm.cmd run check` falla si `evidence/**/*.md` esta en ingles
  sin excepcion.

Hoy hay routing fuerte, pero enforcement parcial.

## Por Que El Agente La Puede Ignorar

### 1. El agente no ejecuta docs como codigo

Un LLM no ejecuta `docs/policies/*.md`. Los lee como contexto. Si el contexto es
largo, parcial o compite con instrucciones nuevas, puede perder una regla.

### 2. AGENTS.md orienta, pero no compila policies

`AGENTS.md` dice que hay que revisar policies vivas, pero no produce una lista
machine-readable de checks obligatorios por tipo de archivo editado.

Ejemplo faltante:

```yaml
when_editing:
  evidence/**/*.md:
    required_policy: human-doc-language
    validator: npm.cmd run check:human-doc-language
```

### 3. No todas las policies tienen validator

El repo tiene validators para catalogo, bindings, state model, iniciativas y
owner docs.

Pero no todas estas policies tienen enforcement dedicado:

- `human-doc-language`;
- `agent-model-selection-policy`;
- `agent-resource-degradation-policy`;
- `agent-task-atomization-policy`;
- `agent-delegation-policy`;
- `agent-context-management-policy`;
- `agent-architecture-boundary-policy`;
- clasificacion/adopcion de policies.

Algunas son dificiles de validar automaticamente al 100%, pero igual necesitan
checks parciales y evidencia obligatoria.

### 4. El flujo no siempre es fail-closed antes de escribir

Muchas veces el agente edita primero y valida despues. Eso detecta errores, pero
no previene filtraciones intermedias.

Para policies criticas, el stack deberia exigir:

1. preflight de policies aplicables;
2. edicion;
3. validator;
4. evidencia;
5. cierre solo si pasa.

### 5. Cross-repo no hereda contexto automaticamente

Cada repo tiene su propio `AGENTS.md` y su propio ARDS/SDD. Que una policy viva
en core no garantiza que un agente que trabaja en otro repo la tenga cargada en
contexto.

La adopcion debe materializarse localmente o el agente puede operar con una
vista incompleta.

### 6. Algunas salidas no pasan por el mismo gate

Jira comments, evidence JSON, scripts generadores y outputs de herramientas
pueden introducir texto que no pasa por la misma revision semantica que un
markdown humano.

Eso no siempre es incorrecto, pero necesita clasificacion:

- texto humano propio: policy de idioma aplica;
- payload externo capturado: puede conservar idioma original;
- JSON de evidencia de herramienta: no se traduce, pero debe quedar separado.

## Bug Real

El bug real es asumir que "definido en ARDS/SDD" equivale a "obedecido por el
runtime del agente".

No equivale.

ARDS/SDD define el contrato. El enforcement runtime tiene que hacerlo
observable y bloqueante.

## Modelo Correcto

Cada policy deberia tener cinco capas:

1. Canon: definicion reusable en core.
2. Adopcion: manifest local en cada repo aplicable.
3. Routing: referencia desde `AGENTS.md` y docs.
4. Enforcement: validator o checklist fail-closed.
5. Evidencia: resultado de aplicacion en cada CR.

Si falta una capa, la policy no esta completa.

## Ejemplo Con Human Doc Language

Estado actual:

- Canon/adopcion: existe.
- Routing: existe.
- Enforcement: parcial o ausente.
- Evidencia: manual, cuando alguien lo detecta.

Estado esperado:

- `npm.cmd run check:human-doc-language`;
- incluido en `npm.cmd run check`;
- falla si markdown humano nuevo esta en ingles sin excepcion;
- permite IDs, paths, comandos y payloads tecnicos;
- registra excepciones explicitas.

## Ejemplo Con Owner Documentation

Esta policy esta mas cerca del modelo correcto.

Ya tiene:

- policy documentada;
- referencia en `AGENTS.md`;
- validator `scripts/verify-owner-documentation.js`;
- `check:owner-docs`;
- inclusion en `npm.cmd run check`;
- fail cuando una CR con `child_repo_mutation_allowed: true` no declara owner
  docs o excepcion.

Por eso se respeta mejor.

La diferencia no es que el agente "quiera" respetar mas esa policy. La
diferencia es que el stack la hace fallar.

## Remediacion Recomendada

### Paso 1: Crear policy enforcement registry

Un archivo machine-readable que diga que policy aplica a que paths y con que
validator.

Ejemplo conceptual:

```yaml
policy_enforcement:
  - policy_id: "human-doc-language"
    applies_to:
      - "docs/**/*.md"
      - "evidence/**/*.md"
      - "knowledge/**/*.md"
    validator: "npm.cmd run check:human-doc-language"
    mode: "fail-closed"
  - policy_id: "owner-documentation-authority-policy"
    applies_to:
      - "requests/**/*.yaml"
    validator: "npm.cmd run check:owner-docs"
    mode: "fail-closed"
```

### Paso 2: Crear preflight

Antes de editar, el agente deberia poder ejecutar:

```powershell
npm.cmd run policy:preflight -- --request-id CR-CP-0003
```

Ese comando deberia listar:

- policies aplicables;
- archivos sensibles;
- validators requeridos;
- evidencias esperadas.

### Paso 3: Crear validators faltantes

Prioridad sugerida:

1. `check:human-doc-language`;
2. `check:policy-adoption`;
3. `check:agent-policy-evidence`;
4. `check:living-resources`;
5. `check:cross-repo-boundary`.

### Paso 4: Cierre fail-closed

Una CR no deberia poder cerrar si:

- se tocaron paths humanos y no paso `check:human-doc-language`;
- se tocaron repos hijos y no paso owner docs;
- se adopto una policy sin manifest;
- se creo recurso vivo sin validator o gap documentado;
- se genero evidencia sin policy application.

## Conclusion

El stack no falla por falta de policies. Falla porque algunas policies todavia
son documentacion normativa, no enforcement runtime.

Para llegar a mayor cumplimiento, hay que convertir cada policy importante en:

- manifest aplicable;
- preflight;
- validator;
- check de cierre;
- evidencia obligatoria.

Hasta que eso exista, el agente puede incumplir por contexto o por generacion, y
el sistema solo lo corrige cuando una persona o un validator especifico lo
detecta.
