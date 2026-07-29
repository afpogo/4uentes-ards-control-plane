# CR-SST-0078 implementation notes

Status: work in progress

Implemented in `sst-extension`:
- Added an explicit public-origin OAuth callout in `Options`.
- Added a public-origin OAuth callout in the popup session panel.
- Added a helper to open the configured node-auth origin in a browser tab.
- Added ephemeral `browser.storage.session` storage for pending OAuth login recovery.
- Added a mount-time retry path that replays the pending login once the browser profile returns from ngrok OAuth.
- Cleared pending OAuth recovery on successful login, logout, and config changes.

Not validated yet:
- `pnpm run check` in `sst-extension`
- Manual smoke against the public ngrok origin
