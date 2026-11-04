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
- `src/components/Journey.astro`, `Stats.astro`: the clickable journey and the big-number row used in the case studies
- `src/layouts/Case.astro`: case-study layout; each page passes its `chapters` for the sticky chapter index
- `src/scripts/motion.ts`: drawings plotting in and exploding on scroll, name decode, reveals, ruler, chapter index, journeys

Chapters marked with a `draft-note` ("Draft: rewrite before publishing") in the case studies are placeholders to rewrite.

## Design

Blueprint ink on a reading-room page. One blue (`--blue: #103dff`) plus its drawing tints; everything else is
paper, ink and gray. Reading text is EB Garamond (`@fontsource-variable/eb-garamond`); labels, buttons and
captions are Departure Mono, self-hosted in `public/fonts/` under the SIL Open Font License (licence alongside).
Screenshots in the case studies are numbered automatically (`FIG_0NN`) by a CSS counter in `src/styles/case.css`.

The files in `src/lib/demo/` are copied from the apps. If the logic changes there, copy it again.

## Screenshots still to add

`src/components/ShotSlot.astro` holds a place for a screenshot that doesn't exist yet. Save the file at the path below
and it appears on the page with the alt text shown (check the alt text matches what's in the picture). Until then,
production shows nothing there, or the older screenshot it replaces, and `npm run dev` shows a dashed box naming
the file.

- `src/assets/613/desktop/01-check-in.png`: Check-in on one screen: search by plate, name or phone, the customer and car picked together, odometer in and the customer’s concern, and a Create estimate button.
- `src/assets/613/desktop/02-saved-items.png`: An estimate with a row of saved-item buttons above the lines, and a Copy from last job option.
- `src/assets/613/desktop/14-quick-sale.png`: Quick sale form: name, phone, plate, make and model, saved-item buttons for the work, payment methods including Pay later, and one save button.
- `src/assets/613/desktop/15-jobs-owed.png`: Jobs list grouped by day, quick sales tagged Quick, and the Owed filter with its count and total.
- `src/assets/613/desktop/16-saved-items-settings.png`: Settings, Saved items: each item with its lines and rough total, with up and down buttons, Edit, Duplicate and Remove.
- `src/assets/613/phone/08-action-bar.png`: A job on a phone with the bottom bar showing the total and the next step’s button.
- `src/assets/amplifier/v2/studio/09-prep-asking-for.png`: Prep page for a test brief opening with What they’re asking for: a summary, notes on the project and a named reference, and questions for the meeting.
- `src/assets/amplifier/v2/studio/10-prep-profile.png`: Taste profile: each dimension marked as agree, differ, or differs in a way their story explains, with Early hint on ones resting on few pairs.
- `src/assets/amplifier/v2/studio/11-scoring-progress.png`: Library Review screen showing Scoring 38 of 144 with a progress bar and about how long is left.
- `src/assets/amplifier/v2/site/01-home-desk.png`: The studio site’s home page: featured projects as channels on a mixing desk, with four taste faders.
- `src/assets/amplifier/v2/site/02-start-a-brief.png`: Start a brief on the studio site: name, email and project type, then straight into the visual brief.

## Sortlog screenshots

Put them in `src/assets/sortlog/` and list them in `src/data/sortlog-shots.ts`. The "The app" section on the
Sortlog page only appears once at least one listed file exists.
