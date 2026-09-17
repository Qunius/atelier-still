# Atelier Still

Independent React architecture experience. All images and the film are stored in this repository. No Higgsfield account, service, SDK, tracking bridge or API is needed at runtime.

## Run
Use Node 22.12 or newer.
- npm ci
- npm run dev
- npm run build
- npm run preview

The production website is written to dist/. Host that folder on a static host. The relative base works under a GitHub Pages project path; BASE_PATH can override it at build time.

## Privacy
Keep this GitHub repository private. Publishing the dist folder creates a separate website and does not inherit repository privacy. No website deployment workflow is enabled.
robots.txt and noindex request that search engines avoid the website; they are not access controls.

## Content
Five fictional projects and generated architectural media. No real studio contact address is configured. The contact control explains that limitation. Media was generated for this project through Higgsfield. Source migration retains the existing scroll-scrub controller and moves all runtime functionality into a standalone React/Vite build.

## Checks
npm run build includes TypeScript validation. The original build was checked at desktop and mobile sizes, for reduced motion, interactive controls, and forward/reverse video seeking. Recheck after hosting.
