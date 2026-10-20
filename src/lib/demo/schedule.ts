// The two pieces of Sortlog's src/lib/schedule.ts that times.ts needs.
export type Shift = { workerId: string; start: number; end: number }; // minutes after midnight

export function formatTime(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}
