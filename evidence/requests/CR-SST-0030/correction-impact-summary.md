# CR-SST-0030 - Impacto De Correccion

Observado el: 2026-06-05

## CR-SST-0026

CR-SST-0026 queda como evidencia historica de una primera aproximacion, pero su
terminologia `user ARDS/SDD` queda corregida.

Lectura correcta:

- donde dice `user ARDS/SDD`, leer `SST user internal memory`;
- donde dice `user_ards_workspace`, leer `user_memory_space`;
- donde dice `knowledge_entry`, leer `user_memory_fact` o memoria derivada;
- donde dice `ards_proposal`, leer `user_memory_proposal`.

## CR-SST-0027

CR-SST-0027 queda como contrato futuro para fuentes largas y derivacion por
parrafos, pero no debe ser el primer slice de memoria interna de usuario.

Lectura correcta:

- puede alimentar memoria interna de usuario en una fase posterior;
- no define la memoria principal;
- no debe bloquear el modelo de eventos internos;
- no debe llamarse mutacion del ARDS/SDD del usuario.

## CR-SST-0028

CR-SST-0028 no debe ejecutarse en su forma actual.

Debe ser reemplazado o corregido para apuntar a:

- UI de memoria interna de usuario;
- persistencia de eventos, hechos e intenciones;
- chatbot recall;
- revision del usuario;
- backend-first validation.

## Nueva Secuencia Recomendada

```text
CR-SST-0030
  -> separar conceptos y corregir terminologia

next request
  -> disenar primer slice runtime de memoria interna de usuario

later request
  -> integrar fuentes largas y paragraph derivation como alimentador de memoria

later request
  -> UI de memoria, revision y recall
```

## Boundary

No se reescribe historia. Los artifacts anteriores quedan auditables, pero la
terminologia final para implementacion debe seguir CR-SST-0030.
