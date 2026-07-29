# CR-SST-0109 - Implementation Plan

## Status

- Date: 2026-07-04
- Request: `CR-SST-0109`
- Parent frontend slice: `CR-SST-0107`
- Initiative: `INIT-SST-0001`
- Jira mirror: `SST-6`

## Purpose

Connect Learning Sheet to the existing SST LearningWorkspace API through
`node-auth` as the protected BFF. This removes the `upstream_ref: TODO` gap left
by CR-SST-0107 before browser E2E validation.

## Scope

In scope:

- `node-auth` BFF routes under `/api/learning-workspaces`;
- auth/account-context forwarding to SST;
- node-auth inbound capability from `sst-bend`;
- node-auth outbound capability to `sst-fend`;
- `sst-fend` inbound capability update from draft/TODO to implemented;
- control-plane evidence and owner enforcement.

Out of scope:

- modifying `sst-bend` parser/import behavior;
- direct frontend calls to `sst-bend`;
- `TagDefinition` CRUD or automatic creation;
- final closure of `SST-6`.

## Runtime Shape

Expected BFF routes:

- `GET /api/learning-workspaces/me`
- `GET /api/learning-workspaces/context`
- `POST /api/learning-workspaces/sources/preview`
- `POST /api/learning-workspaces/sources/:previewId/accept`
- `POST /api/learning-workspaces/sources/:previewId/reject`

All routes must require `AuthMiddleware.validateJwt`, forward `Authorization`,
forward account context headers, and preserve upstream status/body semantics.

## Endpoint Intent

- `GET /api/learning-workspaces/me`
  loads the authenticated user's current LearningWorkspace state through the
  BFF. It initializes the Learning Sheet without allowing direct frontend access
  to `sst-bend`.
- `GET /api/learning-workspaces/context`
  loads accepted/stable LearningWorkspace context. The frontend must keep this
  separate from draft text and preview-only material.
- `POST /api/learning-workspaces/sources/preview`
  sends draft source text and accepted relevance intent to SST for review. The
  result is preview-only and must not be treated as accepted context.
- `POST /api/learning-workspaces/sources/:previewId/accept`
  promotes an SST-generated preview after an explicit user decision. SST remains
  the authority for state transitions, permissions and persistence.
- `POST /api/learning-workspaces/sources/:previewId/reject`
  discards an SST-generated preview after an explicit user decision. Rejected
  material must not appear as accepted context.

The flow is: load workspace/context, generate preview, then explicitly accept
or reject. `node-auth` is only the authenticated BFF facade; parser, import,
relevance, tag governance and persistence ownership remain in SST.
