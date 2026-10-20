// Code 128 bars for the made-up skid label, worked out at build time.
// JsBarcode's encoder gives a string of 1s (bar) and 0s (space), one per module.
import * as mod from 'jsbarcode/bin/barcodes';

type Encoder = new (v: string, o: object) => { encode(): { data: string } };
// The CommonJS build nests its exports under `default` depending on how it's loaded.
const m = mod as unknown as { CODE128?: Encoder; default?: { CODE128?: Encoder; default?: { CODE128?: Encoder } } };
const CODE128 = (m.CODE128 ?? m.default?.CODE128 ?? m.default?.default?.CODE128) as Encoder;

export type Bar = { x: number; w: number };

/** Bars in module units, merged into runs. */
export function code128(value: string): { bars: Bar[]; modules: number } {
  const data = new CODE128(value, {}).encode().data;
  const bars: Bar[] = [];
  let i = 0;
  while (i < data.length) {
    if (data[i] === '1') {
      const start = i;
      while (data[i] === '1') i++;
      bars.push({ x: start, w: i - start });
    } else i++;
  }
  return { bars, modules: data.length };
}
