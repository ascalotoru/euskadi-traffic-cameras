# Vite Migration Design

Date: 2026-09-25
Status: approved

## Problem

The app uses Create React App (`react-scripts` 5.0.1), which is unmaintained. Security
overrides on its transitive dependency tree conflict with each other: forcing
`webpack-dev-server` to the patched 5.x line breaks `npm start` because CRA 5.0.1 still
uses the webpack-dev-server v4 API (`onAfterSetupMiddleware`), while staying on the
compatible v4 line leaves six moderate advisories open. CRA itself is the root cause;
patching around it is not sustainable.

## Goal

Replace `react-scripts` with Vite, keeping the application code and behaviour identical,
and then clean up the `overrides` block so it only covers dependencies that remain.

## Scope

Two phases, each with its own commit and its own verification pass:

- **Phase A — Vite migration.** Swap the tooling. No changes to application code,
  components, or styles.
- **Phase B — dependency cleanup.** Remove overrides that no longer apply once the CRA
  dependency tree is gone; re-run `npm audit` and keep only overrides protecting
  remaining dependencies.

Out of scope: new features, styling changes, refactoring of components.

## Phase A — Vite Migration

### Dependencies

Removed: `react-scripts`, `web-vitals`, `@types/jest`, `eslintConfig` block from
package.json.

Added: `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`.

Updated: TypeScript to ^5.x (Vite's tooling expects TS 5; CRA pinned 4.9).

Removed: `react-scripts`, `web-vitals`, `@types/jest`, and the devDependency
`@babel/plugin-proposal-private-property-in-object` (it only silenced a CRA console
warning).

Kept: `@testing-library/jest-dom`, `@testing-library/react`,
`@testing-library/user-event`, React 18.

### File layout

- `public/index.html` moves to project root as `index.html` (Vite requirement).
- `%PUBLIC_URL%` placeholders removed from the HTML.
- Static assets (`favicon.ico`, `logo192.png`, `logo512.png`, `manifest.json`,
  `robots.txt`) stay in `public/`.
- Application code (`src/`) unchanged. There are no `process.env.REACT_APP_*` usages and
  no `require()` calls, so no source rewrites are needed.

### Scripts

- `start` → `vite`
- `build` → `tsc && vite build` (preserves the typecheck CRA performed during build)
- `test` → `vitest run`
- `preview` → `vite preview`

### Configuration

- `vite.config.ts`: `@vitejs/plugin-react`, `server.port = 3000`, `test` block with
  `environment: 'jsdom'`.
- `tsconfig.json`: updated for Vite (`module: ESNext`, `moduleResolution: 'bundler'`,
  types including `vite/client`).

### Overrides

Phase A leaves the `overrides` block untouched.

## Phase B — Dependency Cleanup

- Audit each override individually. Overrides that targeted CRA's transitive tree
  (svgo, nth-check, browserslist, postcss, serialize-javascript, etc.) are removed once
  react-scripts is gone.
- Overrides protecting dependencies that remain are kept.
- Final state: `npm audit` shows zero vulnerabilities, or any remaining advisory is
  explicitly documented and accepted.

## Verification

After each phase commit:

- `npm run build` succeeds
- `npm start` serves HTTP 200 on port 3000
- `npm test` runs (Vitest) after Phase A
- `git diff --check` clean

## Risks

- The `svgo` override previously broke CRA tooling (documented in AGENTS.md). With
  react-scripts removed that risk disappears, but Phase B must re-verify the build after
  every override removal.
- TypeScript 4.9 → 5.x upgrade may surface new type errors; they are fixed in Phase A as
  part of the migration.

## Alternatives Considered

- **webpack 5 manual config**: keeps a self-maintained webpack; rejected — more
  configuration burden for the same result.
- **Rspack/SWC**: faster but less mainstream; rejected — Vite's ecosystem fits this
  project better.
- **Keep CRA and patch `webpack-dev-server` incompatibility**: rejected — CRA is
  unmaintained; the patching treadmill is the problem being solved.
