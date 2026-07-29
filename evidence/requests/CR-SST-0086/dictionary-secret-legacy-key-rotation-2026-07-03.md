# Dictionary Secret Legacy Key Rotation Finding

Date: 2026-07-03

## Context

The local development endpoint failed when revealing a DictionarySecret:

```text
Unsupported state or unable to authenticate data
```

The failing endpoint was:

```text
GET /api/diccionario/secrets/0b3d0387-f762-4cb1-ba3b-9e9482c17e68/reveal
```

## Findings

- `localhost:8088` routes to the development kind cluster through ingress.
- The current `sst-bend` pod has `SST_DICTIONARY_SECRETS_MASTER_KEY` configured.
- The current crypto service can encrypt, persist, read, and decrypt new values
  with the active master key.
- Existing records created before the key rotation fail to decrypt with the
  active key.
- The record `0b3d0387-f762-4cb1-ba3b-9e9482c17e68` is the Argo CD admin
  credential entry:
  - name: `admin`;
  - category: `CI/CD`;
  - platform: `ARGO CD`;
  - status: `active`.

## Cause

The affected records were encrypted with a previous DictionarySecret master key.
After the key rotation, AES-GCM authentication fails for those ciphertexts.

This is expected cryptographic behavior: without the exact original key, the old
plaintext is not recoverable by `reveal` or `copy`.

## Operational Resolution

For records where the plaintext is known from an authoritative runtime source,
use manual rotation instead of reveal:

- obtain the current secret value from the authoritative runtime source;
- use SST DictionarySecret `rotate`;
- verify `reveal` or `copy` only after rotation.

For Argo CD development credentials, the authoritative source for the admin
password is:

```text
argocd/argocd-initial-admin-secret
```

The password must be retrieved locally by the operator and must not be printed
or stored in evidence.

## Secret Handling

No Argo password, DictionarySecret plaintext, master key, ciphertext, auth tag,
nonce, token, cookie, or authorization header was written to evidence.

The agent did not automatically copy the Argo admin password into SST because
that would move a live admin credential from one secret store to another. The
operator performs that rotation manually.

## Owner Documentation

Runtime implementation ownership remains in `sst-bend`.

Current control-plane action documents the operational finding and the safe
manual recovery path. A future runtime enhancement could add a safer admin-only
repair workflow, but that would require a new approved request and owner
documentation in `sst-bend`.
