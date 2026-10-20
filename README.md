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
- `src/styles/global.css`: colours, type and shared pieces

The files in `src/lib/demo/` are copied from the apps. If the logic changes there, copy it again.

## Sortlog screenshots

Put them in `src/assets/sortlog/` and list them in `src/data/sortlog-shots.ts`. The "The app" section on the
Sortlog page only appears once at least one listed file exists.
