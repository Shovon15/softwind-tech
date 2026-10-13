# Softwind Tech

Next.js (App Router) + React + Tailwind CSS starter for the Softwind Tech website.

## Getting started

```bash
npm install
npm run dev     # http://localhost:4004
```

Copy the variables in `.env` and fill them in. `NEXT_PUBLIC_BACKEND_URL` and
`NEXT_PUBLIC_MEDIA_URL` are also used to allow remote images in `next.config.ts`.

## Scripts

| Script          | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Dev server (Turbopack)         |
| `npm run build` | Production build               |
| `npm run start` | Serve the production build     |
| `npm run lint`  | ESLint                         |
| `npm test`      | Unit tests (Vitest)            |

## Structure

```
src/
  app/          routes, layout, fonts, global styles
  assets/       icons
  components/   common UI + layout (header, footer, containers)
  config/       API endpoints, routes, SEO
  hooks/        reusable React hooks
  lib/          ACL block schemas, metadata + JSON-LD helpers
  store/        Redux Toolkit store and slices
  types/        global type declarations
  utils/        helpers
```
