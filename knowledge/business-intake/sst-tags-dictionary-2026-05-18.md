# SST Tags and Dictionary — Business Intake

Date: 2026-05-18  
Source: User mental dump / brainstorming  
Status: intake  
Related request: CR-SST-0002  
Solution: SST  

## Purpose

Este documento captura una descarga mental inicial sobre Study Store Tag, tags,
diccionario, dictionary entries, dictionary sheets, translations, aliases,
seguridad y relación con account.

## Raw Intake

Aquí tienes un resumen de tu descarga mental, organizado en categorías con una visión general de los temas tratados.
## Resumen de la Descarga Mental
### Reflexiones
- El propósito de SST (Study Store Tag) es permitir a los usuarios aprovechar la plataforma para gestionar todo tipo de información (sensible, importante, banal) de forma segura.
- Al hacer de los "tags" una funcionalidad principal, la información etiquetada se convierte en un "recurso vivo" que la plataforma y el usuario pueden gestionar activamente.
- Se busca dar la máxima seguridad al usuario, explorando opciones como servidores offline y cifrado para que la información no se filtre y pueda ser usada en aplicaciones externas (como llaves o puentes) con confianza.
### Ideas
- **Propósito de los Tags:** Convertir la información del usuario en recursos vivos y gestionables. El usuario podrá visualizar y consumir su información etiquetada en diferentes paneles (información sensible, segura, general).
- **Gramática de los Tags:** Se imagina un sistema de `keys`. Cada `key` existirá dentro de un "scope" o ámbito específico. Por ejemplo, las `keys` del recurso "diccionario" serán distintas a las de "artículos" o "bitácora". Para empezar, las `keys` de diccionario vivirán únicamente en el ámbito del diccionario.
- **Diferencia entre `Dictionary Entry` y `Dictionary Sheet`:**
  - **`Dictionary Entry`:** Es una entrada individual que se guarda en la aplicación.
  - **`Dictionary Sheet`:** Es un conjunto de `Dictionary Entries` agrupadas que definen un concepto mayor. Esta "hoja" contendrá las entradas junto con comentarios, indicaciones, etc.
- **Manejo de Traducciones:** Para campos que requieren múltiples idiomas (como en el diccionario de conceptos con inglés y español), se propone crear una tabla separada llamada "traducciones" (o similar) que luego sea referenciada desde la tabla principal del diccionario.
### Tareas
- Definir la entrada de información para SST en el contexto de la construcción de un diccionario.
- Definir el propósito de "Study Store Tag" (SST).
- Establecer la gramática mínima de los tags.
- Definir qué es una `Dictionary Sheet`.
- Definir qué es una `Dictionary Entry`.
- Definir el manejo de traducciones y alias.
- (Pospuesto) Definir reglas de seguridad y tamaño.
- (Pospuesto) Definir la relación con `account` y el `endpoint` previsto.
### Preguntas
- ¿Cómo va a funcionar el sistema de tags en su totalidad? (Aunque hay una buena idea inicial, aún no está completamente claro).
### Bloqueos
- El funcionamiento detallado y completo del sistema de tags aún no está definido, por lo que esta sesión es un primer brainstorming.
- Los siguientes puntos quedan pendientes para una futura sesión:
  - Reglas de seguridad y tamaño.
  - Relación con la cuenta (`account`).
  - Endpoint previsto.
## Visión General de los Temas
El tema principal de tu monólogo del 22 de abril de 2026 es la **conceptualización inicial del sistema "Study Store Tag" (SST)**, con un enfoque específico en su aplicación para construir un **diccionario**.
Los puntos clave que abordaste son:
1. **El Propósito y la Filosofía de SST:** Buscas crear un sistema donde los datos del usuario, organizados mediante "tags", se conviertan en recursos dinámicos y seguros dentro de la plataforma. La seguridad y la portabilidad de la información son fundamentales.
2. **Estructura de Datos del Diccionario:** Estás definiendo la jerarquía y las entidades clave. Diferenciaste claramente entre una entrada individual (`Dictionary Entry`) y una colección de ellas con contexto (`Dictionary Sheet`), y propusiste una solución para gestionar las traducciones de manera escalable.
3. **Arquitectura de los Tags:** Has comenzado a esbozar la "gramática" de los tags, introduciendo el concepto de `keys` que operan dentro de "scopes" específicos (diccionario, artículos, etc.), lo que previene colisiones de nombres entre diferentes tipos de recursos.
En resumen, estás sentando las bases de la arquitectura y la lógica de negocio de una funcionalidad central de tu plataforma, usando el caso de uso del diccionario como primer campo de pruebas.