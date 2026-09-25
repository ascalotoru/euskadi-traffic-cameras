# Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace unmaintained Create React App with Vite (plus Vitest for `npm test`), then clean up the security `overrides` that only existed to patch CRA's transitive tree.

**Architecture:** Two phases, two commits. Phase A swaps tooling (`react-scripts` → `vite`) without touching application code. Phase B audits each `overrides` entry, removing those whose target dependency left the tree, and verifies with `npm audit` + build.

**Tech Stack:** Vite 7, @vitejs/plugin-react 5, Vitest 3, jsdom, TypeScript 5, React 18 (unchanged).

## Global Constraints

- Node `v24.21.0` (per `.nvmrc`).
- `npm start` must serve the app on port `3000` (same as CRA did).
- `npm run build` must still typecheck (`tsc`) and emit to `build/` is replaced by Vite's default `dist/` — documents must be updated accordingly.
- Application code in `src/` must not change in Phase A (no `process.env.REACT_APP_*`, no `require()` — verified).
- Commit messages: Conventional Commits, English.
- Spec: `docs/superpowers/specs/2026-09-25-vite-migration-design.md`.

---

### Task 1: Vite tooling swap

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `index.html` (project root)
- Delete: `public/index.html`
- Create: `vite.config.ts`
- Modify: `package-lock.json` (via npm install)

**Interfaces:**
- Consumes: existing `src/index.tsx` entrypoint (unchanged).
- Produces: `npm start` → Vite dev server on port 3000; `npm run build` → typechecked bundle in `dist/`; `npm test` → `vitest run` (runner present, zero tests until Task 2).

- [ ] **Step 1: Install Vite tooling**

```bash
npm uninstall react-scripts web-vitals @types/jest @babel/plugin-proposal-private-property-in-object
npm install --save-dev vite @vitejs/plugin-react vitest jsdom typescript@^5
npm uninstall @types/node
```

If `tsc` later complains about missing Node types, re-add `@types/node@^24` (expected: not needed — no Node API usage in `src/` or `vite.config.ts`).

- [ ] **Step 2: Create root `index.html`**

Create `/index.html` with exactly this content (same head tags as CRA's, `%PUBLIC_URL%` replaced by `/`, CRA comments dropped, Vite module script added):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Cámaras de tráfico del País Vasco en tiempo real"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Patua+One&display=swap" rel="stylesheet">
    <title>Cámaras tráfico</title>
  </head>
  <body style="background-color: #24384a; font-family: 'Patua One', cursive;">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

Delete `public/index.html`.

- [ ] **Step 3: Create `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
  },
})
```

- [ ] **Step 4: Update `package.json` scripts and remove `eslintConfig`**

Replace the `scripts` block with:

```json
"scripts": {
  "start": "vite",
  "build": "tsc && vite build",
  "test": "vitest run",
  "preview": "vite preview"
}
```

Delete the entire `eslintConfig` block (CRA-specific, no standalone ESLint config replaces it — none existed before).

- [ ] **Step 5: Update `tsconfig.json`**

Replace `tsconfig.json` contents with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

If `npm run build` reports TS errors surfaced by the 4.9→5.x upgrade, fix them minimally in `src/` (fixes belong to this task).

- [ ] **Step 6: Verify production build**

Run: `npm run build`
Expected: `tsc` passes, `vite build` completes, output lands in `dist/`.

- [ ] **Step 7: Verify dev server**

Run: `timeout 30 npm run start 2>&1 | head -20` (from another shell or with timeout)
Expected: `VITE ready` / `Local: http://localhost:3000/`, then `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` returns `200`.

- [ ] **Step 8: Commit Phase A**

```bash
git add -A
git commit -m "build: migrate from CRA to Vite"
```

---

### Task 2: Vitest smoke test

**Files:**
- Create: `src/components/CameraCard.test.tsx`

**Interfaces:**
- Consumes: `CameraCard` and `Camera` exported from `src/components/CameraCard.tsx` (props: `camera`, `favorites`, `setFavorites`, `favoriteMenu`).
- Produces: first working `npm test` run.

- [ ] **Step 1: Write the test**

Create `src/components/CameraCard.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CameraCard, Camera } from './CameraCard'

const camera: Camera = {
  address: 'Bilbao',
  cameraId: '1',
  cameraName: 'AP-8 km 10',
  kilometer: '',
  latitude: '',
  longitude: '',
  road: '',
  sourceId: '',
  urlImage: 'https://example.com/img.jpg',
}

describe('CameraCard', () => {
  it('renders camera name and image', () => {
    render(
      <CameraCard
        camera={camera}
        favorites={[]}
        setFavorites={() => {}}
        favoriteMenu={false}
      />
    )
    expect(screen.getByText('AP-8 km 10')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('toggles favorite on click', () => {
    const setFavorites = (updater: (prev: Camera[]) => Camera[]) => {
      const next = updater([])
      expect(next).toHaveLength(1)
      expect(next[0].cameraId).toBe('1')
    }
    render(
      <CameraCard
        camera={camera}
        favorites={[]}
        setFavorites={setFavorites}
        favoriteMenu={false}
      />
    )
    fireEvent.click(screen.getByRole('listitem'))
  })
})
```

- [ ] **Step 2: Run the test**

Run: `npm test`
Expected: PASS (both tests). Vitest picks up `*.test.tsx` under `src/` automatically; jsdom environment comes from `vite.config.ts`.

- [ ] **Step 3: Verify typecheck still passes**

Run: `npm run build`
Expected: PASS — `tsc` compiles the new test file without errors (vitest and testing-library types resolve).

- [ ] **Step 4: Commit**

```bash
git add src/components/CameraCard.test.tsx
git commit -m "test: add CameraCard smoke tests with Vitest"
```

---

### Task 3: Overrides cleanup and docs

**Files:**
- Modify: `package.json` (`overrides` block)
- Modify: `package-lock.json` (via npm install)
- Modify: `AGENTS.md`, `README.md`

**Interfaces:**
- Consumes: dependency tree from Tasks 1–2 (react-scripts gone).
- Produces: minimal `overrides` block; final verified state.

- [ ] **Step 1: Remove CRA-tree overrides**

Edit `overrides` in `package.json` to keep only:

```json
"overrides": {
  "@babel/core": "7.29.6",
  "nanoid": "3.3.18",
  "ws": "8.21.0"
}
```

Rationale: `@babel/core` protects `@vitejs/plugin-react` (which uses Babel); `nanoid` and `ws` may be needed by Vite/Vitest — confirmed or dropped in Step 2. All other overrides (node-forge, shell-quote, path-to-regexp, picomatch, lodash, js-yaml, yaml, postcss, uuid, form-data, serialize-javascript, follow-redirects, http-proxy-middleware, webpack-dev-server, brace-expansion, @babel/plugin-transform-modules-systemjs, @tootallnate/once, launch-editor, nth-check, underscore, browserslist, fast-uri, colord, qs, body-parser, baseline-browser-mapping, svgo) targeted CRA's tree and are removed.

- [ ] **Step 2: Verify tree and audit**

```bash
rm -rf node_modules package-lock.json
npm install
npm audit
npm run build
npm test
timeout 30 npm run start 2>&1 | head -20
```

Expected: install succeeds; `npm audit` reports 0 vulnerabilities; build, test, and dev server all pass.

If any advisory returns, re-add a targeted override for the affected package (keep its override and pin the patched version), re-install, re-audit. Remove the `ws`/`nanoid` overrides individually if the audit is clean without them — prefer zero overrides. Then delete the abandoned `browserslist` block from `package.json` (CRA concept).

- [ ] **Step 3: Update docs**

`README.md` — replace the Commands/scripts references:
- Change any `react-scripts`/CRA mentions to Vite (keep "Getting Started" and script names `npm start` / `npm test` / `npm run build` — they are unchanged).
- Update build output references from `build/` to `dist/`.

`AGENTS.md` — update:
- "CRA test runner" wording → Vitest.
- `react-scripts` 5 / CRA architecture paragraph → Vite + Vitest stack.
- Dependencies section: drop the CRA `overrides`/Dependabot pin paragraph; replace with a short note that remaining `overrides` pin patched versions of deps flagged by `npm audit`, verified with `npm run build` (and that CRA is gone).
- Commands section: build output is `dist/`.

Keep every other AGENTS.md line unchanged.

- [ ] **Step 4: Final verification**

```bash
git diff --check
npm run build
npm test
```

Expected: no whitespace errors; build and tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(deps): drop CRA overrides and update docs for Vite"
```

---

## Self-Review

- Spec coverage: Phase A (deps, layout, scripts, config, tsconfig, overrides untouched) → Task 1; Vitest for `npm test` → Task 2; Phase B cleanup, verification per phase, docs update per AGENTS.md workflow → Task 3. Verification commands after each phase present.
- Placeholder scan: no TBD/TODO; all steps have exact content or exact commands.
- Type consistency: `Camera` fields match `CameraCard.tsx:4-14` exactly (`urlImage?` optional, included in test camera object).
