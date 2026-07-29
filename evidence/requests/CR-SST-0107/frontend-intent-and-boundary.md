# CR-SST-0107 - Frontend Intent And Boundary

## Status

- Date: 2026-07-03
- Request: `CR-SST-0107`
- Jira parent/track: `SST-6`
- Initiative: `INIT-SST-0001`
- Mode: planning / lifecycle opening
- Child repo mutation executed: no

## User Intent

The next SST-6 slice should create a real frontend adoption of
LearningWorkspace, centered on a useful learning authoring surface.

The intended surface is a Learning Sheet:

- users can write text directly;
- users can paste or import text;
- the editing flow should be more dynamic and engaging than a plain textarea;
- the structure should remain logical and explainable;
- the UI should help the user assign relevance/tag intent to content at
  different granularities before accepting it into LearningWorkspace.

Granularities explicitly in scope for the frontend model:

- line;
- paragraph;
- line plus paragraph;
- line ranges;
- paragraph ranges;
- whole document;
- document header;
- document footer;
- semantic blocks;
- arbitrary selection where the UI can model it reliably.

Learning block types to handle in the first UX:

- `clase`
- `nota`
- `recordar`
- `ejemplo`
- `definicion`
- `image`
- `docs`
- `code`

## Boundary

This CR is frontend adoption first.

In scope:

- `sst-fend` service/types for LearningWorkspace endpoints;
- a Learning Sheet UI for draft text, preview, warnings, relevance intent and
  explicit accept/reject;
- owner ARDS/SDD docs/specs in `sst-fend`;
- control-plane evidence and validation;
- Jira mirror update for `SST-6` after implementation evidence exists.

Out of scope:

- modifying `sst-bend`;
- implementing backend parser/import selector expansion;
- generated-lab exclusion enforcement in backend parser/import;
- automatic `TagDefinition` creation;
- automatic `SST-6` closure;
- durable accepted content before explicit accept.

## Immediate Follow-Up

The backend parser/import completion should be taken immediately after this
frontend adoption slice as a separate request, likely `CR-SST-0108`.

That follow-up should focus on:

- CourseSource manifest processing;
- `documentSelectors` expansion;
- `assetSelectors` expansion;
- generated lab artifact exclusion;
- richer warnings and parser/import validation in `sst-bend`.

## First Implementation Shape

Preferred UX direction:

- a sheet-like editor, not only a form field;
- source mode controls for writing vs paste/import;
- document structure rail or outline;
- inline or side-panel relevance controls;
- preview result area with content blocks, tag suggestions and warnings;
- accepted context view separated from draft/preview state;
- clear accept/reject actions.

The implementation must reuse existing frontend conventions from Articles and
Dictionary where appropriate, but should not force the Learning Sheet into an
Article-specific mental model.
