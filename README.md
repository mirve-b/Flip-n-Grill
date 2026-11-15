# 🍔 Flip & Grill

**Smash burgers, smashed loud.** A comic / anime-style website for Flip & Grill, the smash burger stall at **IBA Karachi**.

The site has two jobs:

1. **Tell IBA students** about the stall: what's on the menu, where to find it, and why they need to go.
2. **Get catering bookings** from events in Karachi (bazaars, weddings, mehndis, corporate lunches, uni events, parties) via WhatsApp, email or Instagram.

Instagram: [@flipngrill_](https://www.instagram.com/flipngrill_/)

---

## ✨ Highlights

- **3D burger that builds itself as you scroll.** The bun drops, the ball gets smashed, the patty sizzles, the cheese melts and drips, the top bun lands, sides orbit in, and it all gets boxed up in a teal Flip & Grill clamshell.
- **Hand-drawn, cel-shaded look.** Toon shading plus a custom ink-outline shader gives the 3D a cartoon feel instead of a glossy plastic one.
- **Manga energy.** Giant type, comic panels, SFX stickers ("CRUNCH!", "FWOOSH!"), speed rays, starburst click effects, marquees and wavy section edges.
- **Smooth scrolling** with Lenis, plus GSAP ScrollTrigger animations that run in reverse when you scroll back up.
- **Booking form** that writes a ready-to-send message and opens WhatsApp, email or an Instagram DM.
- **Built for weak devices too.** Lite mode, adaptive resolution, paused off-screen 3D, and a flat SVG fallback when WebGL isn't available.
- **Respects "reduce motion"** in the operating system's accessibility settings.

## 🎨 Palette

| Colour | Hex | Used for |
|---|---|---|
| 🟧 Orange | `#FF9400` | Buns, highlights, CTAs |
| 🟦 Teal | `#006267` | Brand colour, box, backgrounds |
| 🟥 Red | `#D44000` | Raw patty, accents, badges |
| 🟨 Cream | `#F1D7B3` | Paper, seeds, text on dark |
| ⬛ Black | `#000000` | Ink lines, outlines, type |

Fonts are **Bangers** (comic headlines), **Fredoka** (body text) and **Permanent Marker** (scribbles), all from Google Fonts.

## 🧰 Tech stack

| Tool | Why |
|---|---|
| [Vite](https://vitejs.dev) | Dev server and production bundler |
| [React 19](https://react.dev) + TypeScript | Components and type safety |
| [three.js](https://threejs.org) + [@react-three/fiber](https://r3f.docs.pmnd.rs) | WebGL 3D, written as React components |
| [GSAP](https://gsap.com) + ScrollTrigger + `@gsap/react` | All animation and scroll-driven motion |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scrolling, driven by GSAP's ticker |

There's no backend, no database and no API keys. It's a fully static site.

---

## 🚀 Getting started

You need **Node.js 20+**.

```bash
npm install
```

```bash
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

### All scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Type-checks (`tsc --noEmit`), then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally to test the production version |

### Test on your phone

With the phone and computer on the same Wi-Fi, run:

```bash
npm run dev -- --host
```

Open the **Network** URL it prints (e.g. `http://192.168.x.x:5173`) on the phone.

> DevTools CPU throttling doesn't slow the GPU, so it can't tell you whether the 3D will lag. Test on a real cheap phone.

### Lite / full mode

The site picks a quality mode automatically, but you can force one with a URL flag:

- `?lite` forces low-end mode and shows a small "LITE" badge.
- `?full` forces full quality, even on a weak device.

---

## ✏️ Editing content (no coding needed)

Most changes happen in two files:

### `src/data/contact.ts`: contact details

```ts
export const CONTACT = {
  whatsapp: "",            // e.g. "923001234567" (digits only, with country code)
  email: "",               // e.g. "bookings@flipandgrill.pk"
  instagram: "flipngrill_",
};
```

Leave a field `""` and its button disappears across the whole site. The event types and Karachi areas in the booking form are listed in the same file.

### `src/data/menu.ts`: the menu

Burgers, extras, sides, meals and drinks. Each item has a `name`, a `blurb`, an `icon`, and an optional `badge` and `sfx` sticker.

### Images (`public/`)

| File | Used for |
|---|---|
| `logo-round.png` | Loader, box stickers in 3D (transparent PNG) |
| `logo-sm.png` | Favicon |
| `menu-board.webp` | The original menu board, opened in the lightbox |

---

## 🗂️ Project structure

```
FLIP-AND-GRILL/
├── index.html              # HTML shell, fonts, meta tags
├── public/                 # Static images (logo, menu board)
├── src/
│   ├── main.tsx            # Entry: registers GSAP plugins, sets lite mode, mounts <App/>
│   ├── App.tsx             # Page layout, Lenis smooth scroll, global scroll reveals
│   ├── styles.css          # All styling: tokens, sections, lite mode, responsive
│   │
│   ├── data/               # ✏️ Content you edit
│   │   ├── menu.ts
│   │   └── contact.ts
│   │
│   ├── components/         # Page sections and UI pieces (HTML + GSAP)
│   │   ├── Loader.tsx      # Intro loading screen
│   │   ├── Cursor.tsx      # Custom comic cursor
│   │   ├── Hero.tsx        # Giant title + floating 3D burger
│   │   ├── Ticker.tsx      # Scrolling text strip
│   │   ├── Paths.tsx       # "Student or event?" split
│   │   ├── Story.tsx       # Manga-panel story
│   │   ├── BuildSection.tsx# Pinned scroll section that drives the 3D build
│   │   ├── BigMarquee.tsx  # Huge scrolling type
│   │   ├── Menu.tsx        # Menu cards + menu-board lightbox
│   │   ├── FindUs.tsx      # IBA stall info, Nav and Footer
│   │   ├── Catering.tsx    # Booking form + contact buttons
│   │   ├── Edge.tsx        # Wavy section edges
│   │   ├── Sparkles.tsx    # Decorative sparkles
│   │   ├── SplitTitle.tsx  # Letter-by-letter title reveals
│   │   └── Icons.tsx       # SVG icon sprite
│   │
│   ├── three/              # Everything 3D
│   │   ├── HeroScene.tsx   # Canvas for the hero burger
│   │   ├── BuildScene.tsx  # Canvas + camera rig for the scroll build
│   │   ├── BuildBurger.tsx # The burger, box and build timeline (BEATS)
│   │   ├── Cheese.tsx      # Melting cheese sheet (custom geometry)
│   │   ├── Sides.tsx       # Curly fries + mozzarella sticks
│   │   ├── Ink.tsx         # Cartoon ink-outline shader
│   │   └── Quality.tsx     # Adaptive resolution, shader precompile, float
│   │
│   └── lib/                # Small helpers
│       ├── device.ts       # Detects weak devices, touch, WebGL, reduced motion
│       ├── burst.ts        # Comic starburst on click
│       └── intro.ts        # Signals when the loader finishes
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧠 How the 3D burger works

**One number drives everything.** The build has a single `progress` value from 0 to 1. `BuildBurger.tsx` splits it into named **BEATS**:

```
bun → ball → smash → sizzle → cheese → melt → top → sides → boxIn → lid
```

On every frame, each part works out where it should be from `progress`. The scroll position (via ScrollTrigger) sets `progress`, so scrolling backwards rewinds the build.

**The cartoon look** comes from three pieces:
- **Toon material**: a 3-step lighting gradient instead of smooth shading.
- **Ink outlines** (`Ink.tsx`): a second, slightly bigger copy of each mesh drawn inside-out in black. The thickness is in screen pixels, so lines stay the same width at any zoom.
- **Flat colour**: tone mapping is turned off so the palette colours show exactly as defined.

**The melting cheese** (`Cheese.tsx`) is one continuous sheet. It starts as a square slice, softens into a round skirt, then grows drips that run down over the patty edge. Its black edge line is painted with vertex colours, so it costs no extra draw call.

---

## ⚡ Performance

- **Lazy-loaded 3D.** The three.js code loads in its own chunk, so the page text appears first.
- **Only visible scenes render.** A 3D canvas stops drawing when it's off screen.
- **Adaptive resolution.** If the frame rate genuinely drops, the render resolution steps down a little. It never goes below a sharp floor and never flips back and forth, because each change causes a small hitch.
- **Shader precompile.** Shaders compile up front to avoid a stutter the first time something appears.
- **Lite mode** turns on automatically for weak GPUs (old Mali / Adreno / PowerVR chips), Data Saver, or non-Apple devices with ≤4 CPU cores or ≤4 GB RAM. iPhones skip the CPU/RAM test because Safari hides those numbers. Lite mode uses a lower resolution and lighter effects.
- **No-WebGL fallback.** If WebGL isn't available, flat SVG burgers replace the 3D.
- **Reduced motion.** Heavy animation is skipped for users who ask their operating system for less motion.

---

## 🌍 Deploying

`npm run build` creates a static `dist/` folder. You can host it free on any static host:

- **Vercel / Netlify:** import the folder or repo. Build command `npm run build`, output directory `dist`.
- **Cloudflare Pages:** same settings.
- **Manual upload:** upload the contents of `dist/` to any web host.

---

## ✅ To-do before launch

- [ ] Add the WhatsApp number (and email, if any) in `src/data/contact.ts`
- [ ] Decide whether to show prices (the menu cards don't have them yet; it would need a `price` field in `src/data/menu.ts`)
- [ ] Test on a real low-end Android phone
- [ ] Pick a domain and deploy

---

Made with way too much cheese. 🧀
