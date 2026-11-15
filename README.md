# Flip & Grill

Website for Flip & Grill, a smash burger stall at IBA Karachi. It introduces the stall to students and takes catering enquiries for events in Karachi.

Built with React, Vite, TypeScript, three.js (react-three-fiber), GSAP and Lenis. Static site, no backend.

## Run

Requires Node 20+.

```bash
npm install
npm run dev
```

- `npm run build`: type-check and build to `dist/`
- `npm run preview`: serve the production build
- `npm run dev -- --host`: open on a phone on the same Wi-Fi

Add `?lite` or `?full` to the URL to force low or full quality.

## Edit content

- `src/data/contact.ts`: WhatsApp, email, Instagram. Leave a field empty to hide it.
- `src/data/menu.ts`: menu items.
- `public/`: logo and menu board images.

## Structure

- `src/components/`: page sections
- `src/three/`: 3D burger and scenes
- `src/lib/`: helpers (device detection, effects)
- `src/styles.css`: all styles

## Deploy

Run `npm run build` and upload `dist/` to any static host (Vercel, Netlify, Cloudflare Pages).
