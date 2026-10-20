// Copied from Sortlog (src/lib/labels.ts).
// Turns the barcodes found on a skid label into named fields.
//
// Supplier labels carry separate Code 128 barcodes for part number,
// supplier code, serial and quantity. On the labels seen so far the barcodes
// hold the bare value (no AIAG "P"/"S"/"Q"/"V" prefix), so fields are told
// apart by shape. Prefixed values are accepted too in case a supplier adds them.

export type LabelData = {
  partNumber?: string;
  serial?: string;
  qty?: number;
  supplierCode?: string;
  /** Every decoded barcode value, for display and debugging. */
  raw: string[];
};

// Part numbers: two letters, three digits, then letters/digits/dashes.
const PART_RE = /^[A-Z]{2}\d{3}[A-Z0-9][A-Z0-9-]*$/;

export function normalizePart(value: string): string {
  return value.toUpperCase().replace(/\s+/g, "").trim();
}

export function classifyBarcodes(values: string[]): LabelData {
  const raw = [...new Set(values.map((v) => v.trim()).filter(Boolean))];
  const out: LabelData = { raw };
  const otherAlnum: string[] = [];

  for (const original of raw) {
    const v = original.toUpperCase().replace(/\s+/g, "");

    // Explicit AIAG-style prefixes on numeric fields.
    const prefixed = /^([SQV])(\d+)$/.exec(v);
    if (prefixed) {
      const [, id, digits] = prefixed;
      if (id === "S" && !out.serial) out.serial = digits;
      else if (id === "Q" && out.qty === undefined) out.qty = Number(digits);
      else if (id === "V" && !out.supplierCode) out.supplierCode = digits;
      continue;
    }

    if (/^\d+$/.test(v)) {
      if (v.startsWith("000") && v.length >= 8) {
        if (!out.supplierCode) out.supplierCode = v;
      } else if (v.length <= 6) {
        if (out.qty === undefined) out.qty = Number(v);
      } else if (!out.serial) {
        out.serial = v;
      }
      continue;
    }

    if (PART_RE.test(v)) {
      if (!out.partNumber) out.partNumber = v;
      continue;
    }
    if (v.startsWith("P") && PART_RE.test(v.slice(1))) {
      if (!out.partNumber) out.partNumber = v.slice(1);
      continue;
    }
    otherAlnum.push(v);
  }

  if (!out.partNumber && otherAlnum.length > 0) out.partNumber = otherAlnum[0];
  return out;
}

export function isComplete(label: LabelData): boolean {
  return Boolean(label.partNumber && label.serial && label.qty !== undefined);
}

/** Finds active jobs whose part number matches the label (exact, then either one extending the other, then by label prefix). */
export function matchJobs<T extends { part_number: string; status: string; label_prefix?: string | null }>(
  partNumber: string | undefined,
  jobs: T[],
): T[] {
  if (!partNumber) return [];
  const p = normalizePart(partNumber);
  const active = jobs.filter((j) => j.status === "active");
  const exact = active.filter((j) => normalizePart(j.part_number) === p);
  if (exact.length > 0) return exact;
  const loose = active.filter((j) => {
    const jp = normalizePart(j.part_number);
    return jp.startsWith(p) || p.startsWith(jp);
  });
  if (loose.length > 0) return loose;
  return active.filter((j) => {
    const pre = j.label_prefix ? normalizePart(j.label_prefix) : "";
    return pre.length > 0 && p.startsWith(pre);
  });
}
