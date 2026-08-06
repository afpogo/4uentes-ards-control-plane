# Warning Remediation - CR-4UENTES-0006

## Scope

Remediate remaining validation noise after the portfolio stabilization baseline:

- control-plane local binding remote warnings;
- portfolio Vite chunk-size warning.

## Findings

- Git remote observation succeeds when the command uses `safe.directory` for the
  observed child worktree.
- Portfolio build emits one JS asset around 532 kB, above the default Vite
  warning threshold.

## Planned Remediation

- Update `scripts/verify-local-bindings.js` to observe remotes with a scoped
  `safe.directory` override for the specific binding path.
- Lazy-load portfolio dashboard route screens to split route code into separate
  chunks.

## Result

Completed.

- `scripts/verify-local-bindings.js` now resolves binding paths with
  `fs.realpathSync()` and passes a normalized `safe.directory` value to Git.
- Portfolio dashboard route screens now load through `React.lazy` and
  `Suspense`.
- The main generated JS asset dropped from about 532 kB to about 464 kB.
- Vite no longer emits the default chunk-size warning in `npm.cmd run check`.
- Control-plane local binding remote warnings dropped to zero.
