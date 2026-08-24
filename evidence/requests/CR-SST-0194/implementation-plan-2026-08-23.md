# CR-SST-0194 - Plan De Implementacion

Fecha: 2026-08-23.

## Resultado Del Readback

Los tres owners ya contienen la mayor parte de la fundacion:

- `4uentes-auth@origin/develop@0be811f3` emite tokens M2M RS256, exige una
  tuple exacta caller/audience/scope y ya comparte el secreto del cliente
  `sst-chatbot`.
- `sst-bend@origin/develop@8e2eeb3` posee conversaciones durablemente
  scopeadas, memoria canonica, review humano e introspeccion de sesiones.
- `sst-chatbot@origin/develop@976837a` posee runtime HTTP M2M, un
  `GovernedMemorySourcePort`, retrieval fail-closed, contexto acotado y
  validacion de citas, pero aun no los compone con el runtime de chat.

No se necesita una migracion ni un secreto nuevo. Se reutiliza
`M2M_SST_CHATBOT_CLIENT_SECRET`; Auth solo amplifica su allowlist mediante dos
grants exactos y separables:

- audience `sst-api`, scope `user-memory:recall`;
- audience `sst-api`, scope `user-memory:propose`.

El grant historico `agent-handoff:submit` permanece sin cambios y no autoriza
memoria por implicacion.

## Mapa De Autoridad Y Flujo

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "cr-sst-0194-memory-proposal-recall-flow"
  type: "sequence"
  question: "Como integra el chatbot proposal y recall sin adquirir autoridad sobre memoria o identidad?"
  abstraction_level: "cross-repo runtime contract"
  source_refs:
    - "requests/done/CR-SST-0194-integrate-chatbot-memory-proposals-and-recall.yaml"
    - "requests/done/CR-SST-0193-implement-canonical-user-memory-runtime.yaml"
    - "requests/done/CR-SST-0210-memory-identity-scope.yaml"
    - "evidence/requests/CR-SST-0210/identity-scope-contract-v1.yaml"
    - "catalog/services/4uentes-auth.yaml"
    - "catalog/services/sst-bend.yaml"
    - "catalog/services/sst-chatbot.yaml"
  observed_at: "2026-08-23"
  authority_boundary: "Vista derivada; Auth emite identidad de servicio, Bend reconstruye scope y conserva memoria, y chatbot solo consume contexto autorizado y produce candidatos."
  textual_fallback_required: true
  request_ids: []
  initiative_ids: []
  status_vocabulary: ["authoritative", "validated", "proposal-only"]
```

```mermaid
sequenceDiagram
    participant U as Usuario
    participant B as sst-bend authoritative
    participant A as 4uentes-auth authoritative
    participant C as sst-chatbot proposal-only
    participant P as Provider bounded

    U->>B: turno autenticado
    B->>A: valida sesion
    A-->>B: sujeto y sesion activos
    B->>C: turn + referencia + scope minimo
    C->>A: solicita token user-memory:recall
    A-->>C: token M2M exacto
    C->>B: recall con conversation_ref + correlation_id
    B->>B: reconstruye scope desde estado durable
    B-->>C: records activos y provider-eligible
    C->>P: pregunta + contexto acotado sin PrincipalContext
    P-->>C: claims estructurados con citas
    C->>B: audit de recall y candidato opcional
    B->>B: valida y deja propuesta needs_user_review
    C-->>B: respuesta y referencias opacas
    B-->>U: respuesta; memoria no adoptada automaticamente
```

## Fallback Textual

```text
Usuario -> Bend: inicia un turno bajo sesion y membership validados.
Bend -> Chatbot: envia la referencia de conversacion y el minimo contexto operativo.
Chatbot -> Auth: obtiene un token de recall o proposal con scope exacto.
Chatbot -> Bend: usa conversation_ref y correlation_id; no afirma tenant/account/user.
Bend -> Bend: resuelve la conversacion y reconstruye el scope desde su estado.
Bend -> Chatbot: entrega solo records activos, indexables y provider-eligible.
Chatbot -> Provider: envia contenido acotado sin identidad ni autorizacion.
Chatbot -> Bend: registra citas y puede entregar un candidato estructurado.
Bend -> Usuario: la propuesta queda needs_user_review; nunca se acepta sola.
```

<!-- visual-map:end -->

## Contrato Interno En Bend

Las rutas internas quedan separadas de `/user-memory/*`, que continua exigiendo
access token de usuario y sesion activa:

- `POST /4uentes/v1/internal/user-memory/recall-candidates` requiere scope
  `user-memory:recall`; devuelve records activos, indexables y
  `providerEligible=true` del memory space reconstruido.
- `POST /4uentes/v1/internal/user-memory/recalls` requiere el mismo scope;
  valida IDs y citas y guarda solamente audit metadata.
- `POST /4uentes/v1/internal/user-memory/proposals` requiere scope
  `user-memory:propose`; captura un evento neutral y crea una propuesta
  `needs_user_review` de forma idempotente.

Cada request lleva `conversationRef` y `correlationId`. Bend debe confirmar que
la conversacion existe y pertenece a un tenant/account/user vigente, y que la
correlacion identifica un mensaje humano de esa conversacion. El chatbot no
puede enviar campos autoritativos de tenant, account, user, application,
memory-space, requester o producer.

## Unidades Atomicas

### 1. Auth - grants exactos

Archivos esperados: allowlist de service credentials, specs/docs M2M, capability
outbound y tests de matriz negativa. DoD: cada token tiene un unico scope; una
tuple cruzada o el scope historico no habilitan memoria.

### 2. Bend - puertos internos

Archivos esperados: guard M2M, resolver de conversacion, DTOs, controller/routes,
servicio/repository y capability outbound. DoD: reconstruccion durable,
idempotencia, aislamiento y consentimiento pasan con fakes y Postgres cuando
este disponible.

### 3. Chatbot - adapters y composicion

Archivos esperados: cliente Auth M2M reutilizado, cliente Bend, proposal port,
adapter de `GovernedMemorySourcePort`, runtime compuesto, specs/docs y tests.
DoD: fake provider produce citas validas, el contexto respeta presupuesto, una
propuesta queda pendiente y fallas/cancelacion no filtran datos ni credenciales.

### 4. Integracion

Primero se fusionan/publican los owners de contrato necesarios. Luego un smoke
local/dev sintetico prueba login, conversacion, recall citado, propuesta
pendiente, logout/rechazo y limpieza. No se despliega ni cambia GitOps bajo este
request; si el runtime publicado no aparece automaticamente, se registra el
blocker o se pide una autorizacion de deploy separada.

## Orden De Publicacion

1. `4uentes-auth`: grants y capability.
2. `sst-bend`: rutas internas y capability.
3. `sst-chatbot`: adapters, composicion y adopcion inbound.
4. QA integrado y evidencia del control plane.

Cada owner usa un worktree limpio desde `origin/develop`. Los checkouts sucios
existentes de Bend y Auth no se modifican ni se limpian.
