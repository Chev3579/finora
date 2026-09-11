import type { RangeKey } from "../types";

export const MONTHS_SHORT_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export const MONTHS_FULL_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

// Monday-first, matching the prototype's week chart.
export const WEEKDAYS_SHORT_TH = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

export const RANGE_LABELS: Record<RangeKey, string> = {
  week: "สัปดาห์",
  month: "เดือน",
  quarter: "ไตรมาส",
  year: "ปี",
};

export const RANGE_KEYS: RangeKey[] = ["week", "month", "quarter", "year"];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function beYear(date: Date): number {
  return date.getFullYear() + 543;
}

export function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${MONTHS_SHORT_TH[date.getMonth()]}`;
}

export function formatFullDate(date: Date): string {
  return `${formatDayMonth(date)} ${beYear(date)}`;
}

export function formatMonthYear(date: Date): string {
  return `${MONTHS_FULL_TH[date.getMonth()]} ${beYear(date)}`;
}

export function formatDateTime(iso: string, time: string): string {
  return `${formatFullDate(parseISO(iso))} · ${time}`;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const shift = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - shift);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export interface Bucket {
  label: string;
  start: Date;
  end: Date; // exclusive
}

/** The single period the range selector currently points at. */
export function periodRange(range: RangeKey, ref: Date = new Date()): Bucket {
  const y = ref.getFullYear();
  switch (range) {
    case "week": {
      const start = startOfWeek(ref);
      return { label: `${formatDayMonth(start)} – ${formatDayMonth(addDays(start, 6))}`, start, end: addDays(start, 7) };
    }
    case "month":
      return {
        label: formatMonthYear(ref),
        start: new Date(y, ref.getMonth(), 1),
        end: new Date(y, ref.getMonth() + 1, 1),
      };
    case "quarter": {
      const q = Math.floor(ref.getMonth() / 3);
      return { label: `Q${q + 1} ${beYear(ref)}`, start: new Date(y, q * 3, 1), end: new Date(y, q * 3 + 3, 1) };
    }
    case "year":
      return { label: String(beYear(ref)), start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1) };
  }
}

/** The buckets the trend chart plots for a given range. */
export function seriesBuckets(range: RangeKey, ref: Date = new Date()): Bucket[] {
  const y = ref.getFullYear();
  switch (range) {
    case "week": {
      const start = startOfWeek(ref);
      return WEEKDAYS_SHORT_TH.map((label, i) => ({
        label,
        start: addDays(start, i),
        end: addDays(start, i + 1),
      }));
    }
    case "month":
      return Array.from({ length: 6 }, (_, i) => {
        const start = new Date(y, ref.getMonth() - 5 + i, 1);
        return { label: MONTHS_SHORT_TH[start.getMonth()], start, end: new Date(y, ref.getMonth() - 4 + i, 1) };
      });
    case "quarter":
      return Array.from({ length: 4 }, (_, q) => ({
        label: `Q${q + 1}`,
        start: new Date(y, q * 3, 1),
        end: new Date(y, q * 3 + 3, 1),
      }));
    case "year":
      return Array.from({ length: 5 }, (_, i) => {
        const year = y - 4 + i;
        return { label: String(year + 543), start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) };
      });
  }
}

export function daysLeftInMonth(ref: Date = new Date()): number {
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
  return Math.max(0, Math.round((end.getTime() - ref.getTime()) / 86400000));
}

/** Monthly budgets scaled to the selected range. */
export const RANGE_BUDGET_MULTIPLIER: Record<RangeKey, number> = {
  week: 12 / 52,
  month: 1,
  quarter: 3,
  year: 12,
};
