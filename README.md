# Interactive Portfolio

Personal portfolio home page built with **Vite + React + TypeScript** and plain CSS.

## Highlights

- Massive Archivo wordmarks (`PRODUCT DESIGNER`, `WORK`, email) with a clean neutral weight for nav and body.
- A transparent 3D figurine that acts as a **scroll-driven turntable** — scrolling down rotates it one way, scrolling up the other (alpha WebM/VP9, frame scrubbed from scroll position).
- `FitText` auto-scales the single-line wordmarks so they fill the width without ever causing horizontal scroll.

## Development

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Assets

`public/assets/figurine-animation.webm` is the transparent (alpha) turntable used in the hero. The opaque `.mp4` is a fallback for browsers without WebM-alpha support.
