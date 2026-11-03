// Isometric projection for the blueprint figures.
// World axes: +x runs down-right on screen, +y runs down-left, +z is up.
// Everything returns SVG-ready strings so the figures stay declarative.

export type P3 = [number, number, number];

const C = Math.cos(Math.PI / 6);
const S = 0.5;
const f = (n: number) => Math.round(n * 10) / 10;

export function iso([x, y, z]: P3): [number, number] {
  return [f((x - y) * C), f((x + y) * S - z)];
}

/** Polygon/polyline `points` attribute from world points. */
export function pts(...p: P3[]): string {
  return p.map((q) => iso(q).join(',')).join(' ');
}

/** Line endpoints as an object to spread onto <line>. */
export function seg(a: P3, b: P3) {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return { x1, y1, x2, y2 };
}

/** The three visible faces of a box whose min corner is (x, y, z). */
export function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]),
    // faces +y: reads as the lower-left face
    left: pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]),
    // faces +x: reads as the lower-right face
    right: pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]),
  };
}

/** A flat rectangle lying on the plane z. */
export function flat(x: number, y: number, z: number, w: number, d: number): string {
  return pts([x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]);
}

/** A rectangle standing on the plane x = x0, spanning y and z. Faces +x (lower right). */
export function wallX(x0: number, y: number, z: number, d: number, h: number): string {
  return pts([x0, y, z], [x0, y + d, z], [x0, y + d, z + h], [x0, y, z + h]);
}

/** A rectangle standing on the plane y = y0, spanning x and z. Faces +y (lower left). */
export function wallY(y0: number, x: number, z: number, w: number, h: number): string {
  return pts([x, y0, z], [x + w, y0, z], [x + w, y0, z + h], [x, y0, z + h]);
}

/** Path `d` for an SVG arrow head at (x, y) pointing in direction (dx, dy). */
export function arrowHead(x: number, y: number, dx: number, dy: number, size = 6): string {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * size;
  const by = y - uy * size;
  const px = -uy * size * 0.5;
  const py = ux * size * 0.5;
  return `M${f(x)},${f(y)} L${f(bx + px)},${f(by + py)} L${f(bx - px)},${f(by - py)} Z`;
}
