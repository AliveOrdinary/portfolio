# Portfolio

Navaneeth Krishnan's portfolio. Astro, static, deployed on Netlify.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # into dist/
```

## Layout

- `src/pages/index.astro`: home
- `src/pages/work/*.astro`: case studies (Sortlog, 613 Automotive, Amplifier)
- `src/data/projects.ts`: project summaries, "also built" and tools
- `src/components/demos/`: the live demos
  - `EstimateBuilder`: 613's estimate, using a copy of the shop app's totals module (`src/lib/demo/shop-totals.ts`)
  - `LabelReader`: reads a made-up skid label with zxing-wasm in the browser (`public/zxing_reader.wasm`)
  - `HoursToTimes`: Sortlog's times logic (`src/lib/demo/times.ts`)
- `src/styles/global.css`: colours, type and shared pieces (masthead, glyph divider, bevelled key button, figure panel, SVG inks, footer)
- `src/components/Figure.astro`: the blueprint figure panel (dotted grid, rotated `FIG_00N` and name labels)
- `src/components/figures/`: the isometric line drawings, built from `src/lib/iso.ts`
  - `FigMethod` (home hero), `FigSkid` (Sortlog), `FigDocs` (613), `FigPair` (Amplifier)

## Design

Blueprint ink on a reading-room page. One blue (`--blue: #103dff`) plus its drawing tints; everything else is
paper, ink and gray. Reading text is EB Garamond (`@fontsource-variable/eb-garamond`); labels, buttons and
captions are Departure Mono, self-hosted in `public/fonts/` under the SIL Open Font License (licence alongside).
Screenshots in the case studies are numbered automatically (`FIG_0NN`) by a CSS counter in `src/styles/case.css`.

The files in `src/lib/demo/` are copied from the apps. If the logic changes there, copy it again.

## Sortlog screenshots

Put them in `src/assets/sortlog/` and list them in `src/data/sortlog-shots.ts`. The "The app" section on the
Sortlog page only appears once at least one listed file exists.
