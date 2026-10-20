// Copied from Sortlog (src/lib/times.ts) so the demo lays out times exactly as the app does.
// Times per person per part, filled in from the skids.
//
// The rules, on purpose kept simple:
// - A skid's hours are split evenly across the people who sorted it
//   (quarter hours), but nobody's share goes past their end time: someone
//   else on the same skid with time left takes the rest, and anything still
//   left is shown as "not given to anyone yet" so you can add who else
//   sorted it.
// - Each person does their parts one after another in the day's part order,
//   starting at their start time.
// - A time you set yourself ("edited") is never moved. Their next part starts
//   after it.
// - Nothing is ever moved between people or parts. Problems (past the end
//   time, two parts at once, missing hours) are pointed out, not fixed.

import { formatTime, type Shift } from "./schedule";

export type PartWork = {
  jobId: string;
  /** One per skid; a part without skids is one item with its hours and crew. `key` (the skid entry id) ties back leftovers. */
  skids: { key?: string; hours: number | null; crew: string[] }[];
};

export type TimeRow = {
  jobId: string;
  workerId: string;
  /** Minutes after midnight; null when the person has no start time (old hours-only days). */
  start: number | null;
  end: number | null;
  hours: number;
  edited: boolean;
};

export type TimeNote = { tone: "neutral" | "warn" | "bad"; text: string; jobId?: string; workerId?: string; remove?: boolean };

const round2 = (n: number) => Math.round(n * 100) / 100;

export type TimePlan = {
  rows: TimeRow[];
  notes: TimeNote[];
  /** Hours on a skid (by its key) that nobody had time for. */
  leftover: Map<string, number>;
  /** Hours on each part that nobody had time for. */
  partLeftover: Map<string, number>;
};

export function planTimes(
  parts: PartWork[],
  shifts: Map<string, Shift>,
  edited: TimeRow[] = [],
  names: (workerId: string) => string = (id) => id,
  partName: (jobId: string) => string = (id) => id,
): TimePlan {
  const notes: TimeNote[] = [];
  const fixed = new Map(edited.map((r) => [`${r.jobId}|${r.workerId}`, r]));
  const leftover = new Map<string, number>();
  const partLeftover = new Map<string, number>();
  const onCrew = new Set(parts.flatMap((p) => p.skids.flatMap((s) => s.crew.map((w) => `${p.jobId}|${w}`))));

  // Missing pieces on the skids
  for (const part of parts) {
    const noHours = part.skids.filter((s) => !s.hours || s.hours <= 0).length;
    const noCrew = part.skids.filter((s) => s.crew.length === 0).length;
    const label = (n: number) => (part.skids.length === 1 ? "" : n === 1 ? "1 skid: " : `${n} skids: `);
    if (noHours) notes.push({ tone: "warn", jobId: part.jobId, text: `${partName(part.jobId)}: ${label(noHours)}enter the hours.` });
    if (noCrew) notes.push({ tone: "warn", jobId: part.jobId, text: `${partName(part.jobId)}: ${label(noCrew)}pick who sorted it.` });
  }

  const order = parts.map((p) => p.jobId);
  const cursor = new Map<string, number>();
  const dayTotal = new Map<string, number>(); // quarter hours given so far today
  const rows: TimeRow[] = [];
  const noShift = new Set<string>();
  // Time someone has already been given by hand on parts later in the day
  const laterEdited = (w: string, fromIndex: number) =>
    edited
      .filter((r) => r.workerId === w && r.start !== null && r.end !== null && order.indexOf(r.jobId) > fromIndex)
      .reduce((a, r) => a + (r.end! - r.start!), 0);

  parts.forEach((part, index) => {
    // Times set by hand on this part stay as they are.
    for (const r of edited.filter((x) => x.jobId === part.jobId)) {
      rows.push(r);
      const shift = shifts.get(r.workerId);
      if (r.end !== null && shift) cursor.set(r.workerId, Math.max(cursor.get(r.workerId) ?? shift.start, r.end));
    }
    const given = new Map<string, number>(); // quarter hours on this part
    const room = (w: string) => {
      const shift = shifts.get(w);
      if (!shift) return Infinity; // no start time: can't place it, noted below
      const at = cursor.get(w) ?? shift.start;
      return Math.floor((shift.end - at - laterEdited(w, index)) / 15) - (given.get(w) ?? 0);
    };
    const short: string[] = [];
    for (const skid of part.skids) {
      if (!skid.hours || skid.hours <= 0 || skid.crew.length === 0) continue;
      const crew = skid.crew.filter((w) => !fixed.has(`${part.jobId}|${w}`));
      if (!crew.length) continue;
      // People with a time set by hand already cover their share of the skid.
      let units = Math.round(((skid.hours * 60) / 15) * (crew.length / skid.crew.length));
      const onSkid = new Map<string, number>();
      while (units > 0) {
        const next = crew
          .filter((w) => room(w) > 0)
          .sort((a, b) => (onSkid.get(a) ?? 0) - (onSkid.get(b) ?? 0) || (dayTotal.get(a) ?? 0) - (dayTotal.get(b) ?? 0))[0];
        if (!next) break;
        onSkid.set(next, (onSkid.get(next) ?? 0) + 1);
        given.set(next, (given.get(next) ?? 0) + 1);
        dayTotal.set(next, (dayTotal.get(next) ?? 0) + 1);
        units--;
      }
      if (units > 0) {
        const h = (units * 15) / 60;
        if (skid.key) leftover.set(skid.key, (leftover.get(skid.key) ?? 0) + h);
        partLeftover.set(part.jobId, (partLeftover.get(part.jobId) ?? 0) + h);
        for (const w of crew) if (!short.includes(w)) short.push(w);
      }
    }
    for (const [w, q] of given) {
      if (q <= 0) continue;
      const m = q * 15;
      const shift = shifts.get(w);
      if (!shift) {
        noShift.add(w);
        rows.push({ jobId: part.jobId, workerId: w, start: null, end: null, hours: round2(m / 60), edited: false });
        continue;
      }
      const at = cursor.get(w) ?? shift.start;
      rows.push({ jobId: part.jobId, workerId: w, start: at, end: at + m, hours: round2(m / 60), edited: false });
      cursor.set(w, at + m);
    }
    const left = partLeftover.get(part.jobId);
    if (left) {
      const who = short.map((w) => `${names(w)} (until ${formatTime(shifts.get(w)?.end ?? 0)})`).join(", ");
      notes.push({
        tone: "warn",
        jobId: part.jobId,
        text: `${partName(part.jobId)}: ${round2(left)} h not given to anyone yet. ${who} ${short.length > 1 ? "have" : "has"} no more time. Pick who else sorted it.`,
      });
    }
  });
  // Times set by hand on parts not in today's list
  for (const r of edited) if (!order.includes(r.jobId)) rows.push(r);
  for (const w of noShift) notes.push({ tone: "bad", workerId: w, text: `${names(w)} isn't under "Who worked", so there's no start time for their parts.` });

  const people = [...new Set(rows.map((r) => r.workerId))];

  // Times you set for someone who's no longer picked on any of that part's skids
  for (const r of edited) {
    if (!onCrew.has(`${r.jobId}|${r.workerId}`) && parts.some((p) => p.jobId === r.jobId)) {
      notes.push({
        tone: "warn",
        jobId: r.jobId,
        workerId: r.workerId,
        remove: true,
        text: `${names(r.workerId)} has times on ${partName(r.jobId)} but isn't picked on any of its skids.`,
      });
    }
  }

  // Past the end time, and two parts at once
  for (const w of people) {
    const shift = shifts.get(w);
    const mine = rows.filter((r) => r.workerId === w && r.start !== null && r.end !== null).sort((a, b) => a.start! - b.start!);
    const last = mine.reduce((a, r) => Math.max(a, r.end!), -1);
    if (shift && last > shift.end) {
      notes.push({ tone: "warn", workerId: w, text: `${names(w)}'s times run to ${formatTime(last)}, past their end time (${formatTime(shift.end)}).` });
    }
    for (let i = 1; i < mine.length; i++) {
      const a = mine[i - 1];
      const b = mine[i];
      if (b.start! < a.end!) {
        notes.push({
          tone: "warn",
          workerId: w,
          text: `${names(w)} is on ${partName(a.jobId)} and ${partName(b.jobId)} at the same time (${formatTime(b.start!)} – ${formatTime(Math.min(a.end!, b.end!))}).`,
        });
      }
    }
  }

  // Times set by hand that don't add up to the skid hours
  for (const part of parts) {
    if (!rows.some((r) => r.jobId === part.jobId && r.edited)) continue;
    const skidHours = round2(part.skids.reduce((a, s) => a + (s.hours && s.hours > 0 ? s.hours : 0), 0));
    const times = round2(rows.filter((r) => r.jobId === part.jobId).reduce((a, r) => a + r.hours, 0));
    if (skidHours > 0 && times !== skidHours) {
      notes.push({ tone: "neutral", jobId: part.jobId, text: `${partName(part.jobId)}: times add up to ${times} h, the skids say ${skidHours} h.` });
    }
  }

  return { rows, notes, leftover, partLeftover };
}

