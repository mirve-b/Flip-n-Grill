# Flip & Grill

Website for Flip & Grill, a smash burger stall at IBA Karachi. It introduces the stall to students and takes catering enquiries for events in Karachi.

Built with React, Vite and TypeScript. Plain CSS, no animation libraries. Fonts: Londrina Solid for headings, Konkhmer Sleokchher for body text (both self-hosted in `public/fonts`). Static site, no backend. The splash lives in `index.html`; motion (hero entrance, scroll reveals, hovers) is CSS, with two small scripts: the splash hand-off in `src/main.tsx` and the shy Omars in `Hero.tsx`.

## Run

Requires Node 20+.

```bash
npm install
npm run dev
```

- `npm run build`: type-check and build to `dist/`
- `npm run preview`: serve the production build
- `npm run dev -- --host`: open on a phone on the same Wi-Fi

## Edit content

- `src/data/contact.ts`: WhatsApp, email, Instagram. Leave a field empty to hide it.
- `src/data/menu.ts`: menu items, each with its art in `public/menu/`.
- `public/art/`: hero and section collage pieces. `paper-teal.webp` is the folded paper behind the hero and stall sections.
- `public/mascots/`: the two Omars.

## Structure

- `src/components/`: one file per section. Home page, in order: Nav, Hero, Strip, Story, Investigation, Menu, Strip, Stall, Footer. The booking form (Catering) is its own page at `#contact`; `App.tsx` switches between the two.
- `src/styles.css`: all styles, in the same order. Hero pieces are placed on a fixed-ratio stage, so the collage scales as one; phones get their own arrangement.
- `public/fonts/`: Konkhmer Sleokchher (main) and Space Mono (fallback for Apple Symbols, which is built into Apple devices).

## Deploy

Run `npm run build` and upload `dist/` to any static host (Vercel, Netlify, Cloudflare Pages).
