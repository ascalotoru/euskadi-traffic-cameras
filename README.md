# Euskadi Traffic Cameras

Featured web app built with [Vite](https://vite.dev/) that shows live traffic cameras from the Basque Country (Euskadi).

- Browse cameras by location (Bilbao and other areas) via the menu.
- Mark cameras as favorites; favorites are stored in the browser `localStorage`.
- Data source: [Euskadi.eus Traffic API](https://api.euskadi.eus/traffic/v1.0/cameras/bySource/{source}?_page={page}).

## Getting Started

Requires Node `v24.21.0` (see `.nvmrc`).

1. `npm install`
2. `npm start`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### `npm test`

Runs the test suite once with [Vitest](https://vitest.dev/).

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
