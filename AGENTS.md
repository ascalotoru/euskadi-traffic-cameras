# Repository Instructions

## Commands

- Use Node `v22.12.0` from `.nvmrc`.
- Start development server with `npm start`.
- Run the CRA test runner with `npm test`.
- Create production build with `npm run build`.
- `package.json` defines no separate lint or typecheck scripts.

## Architecture

- This is one private Create React App package using React 18, TypeScript 4.9, and `react-scripts` 5.
- `src/index.tsx` is browser entrypoint. It renders `App` in `React.StrictMode`.
- `src/App.tsx` owns menu selection and loads cameras through `src/utils/httpClient.ts`. Bilbao uses source `5`; other menu selections use source `2`.
- `src/components/Menu.tsx` presents menu choices. `src/components/CamerasGrid.tsx` owns favorites state and decides whether to show loaded cameras or favorites. `src/components/CameraCard.tsx` renders cards and toggles favorites.
- Keep API access in `src/utils/httpClient.ts`; keep presentation and styles in `src/components/` and `src/assets/`.
- `build/` and `node_modules/` are generated or installed artifacts. Do not edit them.

## Data and API

- `src/utils/httpClient.ts` calls `https://api.euskadi.eus/traffic/v1.0/cameras/bySource/{source}?_page={page}` with an `Accept: application/json` header.
- `getAllCameras` requests page `1` only to read `totalPages`, then fetches pages `2` through `totalPages` in parallel. Returned cameras are assembled from those parallel responses, so page-1 cameras are omitted by the current implementation.
- Only cameras whose `urlImage` is not `undefined` are kept. Camera names are normalized by removing leading `DOMO` or `CCTV` prefixes with the existing regex.
- Fetch status is not checked. Errors are caught and logged, and `getAllCameras` returns an empty array.
- `src/components/CamerasGrid.tsx` initializes favorites from browser `localStorage` key `favorites` and persists the JSON-encoded favorites array under that key.

## Workflow

- Group changes by functionality; avoid mixing unrelated changes.
- Whenever a piece of functionality changes, review `AGENTS.md` and `README.md` and update them if they no longer describe the code accurately.

## Dependencies

- `package.json` pins vulnerable transitive dependencies via npm `overrides` (CRA's `react-scripts` is unmaintained). Bump override versions when Dependabot or `npm audit` flag them, then verify with `npm run build` because overriding may break tooling (e.g. `svgo`).

## Commits

- Write all commit messages as Conventional Commits in English.

## Verification

- Run `npm test` for tests and `npm run build` for production compilation.
- Before finishing, run `git diff --check`. Once `AGENTS.md` is tracked, inspect it with `git diff -- AGENTS.md`; while it is untracked, inspect it with `git diff --no-index /dev/null AGENTS.md` or an equivalent command.
