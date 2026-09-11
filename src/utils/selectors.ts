import { categoryMeta } from "../data/categories";
import type { CategoryBudget, RangeKey, Transaction } from "../types";
import { type Bucket, parseISO, periodRange, RANGE_BUDGET_MULTIPLIER, seriesBuckets } from "./date";

export function inBucket(tx: Transaction, bucket: Bucket): boolean {
  const d = parseISO(tx.date);
  return d >= bucket.start && d < bucket.end;
}

export function sumByType(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

export interface RangeSummary {
  income: number;
  expense: number;
  balance: number;
  budget: number;
  pct: number;
  bucket: Bucket;
}

export function summaryForRange(
  transactions: Transaction[],
  budgets: CategoryBudget[],
  range: RangeKey,
  ref: Date = new Date(),
): RangeSummary {
  const bucket = periodRange(range, ref);
  const totals = sumByType(transactions.filter((t) => inBucket(t, bucket)));
  const monthlyBudget = budgets.reduce((a, b) => a + b.cap, 0);
  const budget = Math.round(monthlyBudget * RANGE_BUDGET_MULTIPLIER[range]);
  const pct = budget > 0 ? Math.min(100, (totals.expense / budget) * 100) : 0;
  return { ...totals, budget, pct, bucket };
}

export interface SeriesPoint {
  label: string;
  income: number;
  expense: number;
}

export function seriesForRange(transactions: Transaction[], range: RangeKey, ref: Date = new Date()): SeriesPoint[] {
  return seriesBuckets(range, ref).map((bucket) => {
    const totals = sumByType(transactions.filter((t) => inBucket(t, bucket)));
    return { label: bucket.label, income: totals.income, expense: totals.expense };
  });
}

export interface CategorySlice {
  category: string;
  amount: number;
  pct: number;
  color: string;
}

export function categoryBreakdown(transactions: Transaction[], bucket: Bucket): CategorySlice[] {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense" || !inBucket(t, bucket)) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0);
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      pct: sum > 0 ? (amount / sum) * 100 : 0,
      color: categoryMeta(category).color,
    }));
}

export interface BudgetRow {
  category: string;
  used: number;
  cap: number;
  pct: number;
  over: boolean;
}

export function budgetRows(
  transactions: Transaction[],
  budgets: CategoryBudget[],
  ref: Date = new Date(),
): BudgetRow[] {
  const bucket = periodRange("month", ref);
  return budgets.map((b) => {
    const used = transactions
      .filter((t) => t.type === "expense" && t.category === b.category && inBucket(t, bucket))
      .reduce((a, t) => a + t.amount, 0);
    return {
      category: b.category,
      used,
      cap: b.cap,
      pct: b.cap > 0 ? Math.min(100, (used / b.cap) * 100) : 0,
      over: used > b.cap,
    };
  });
}

export interface DayGroup {
  date: string;
  total: number;
  items: Transaction[];
}

export function groupByDay(transactions: Transaction[]): DayGroup[] {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const list = groups.get(t.date);
    if (list) list.push(t);
    else groups.set(t.date, [t]);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({
      date,
      items: [...items].sort((a, b) => b.time.localeCompare(a.time)),
      total: items.reduce((a, t) => a + (t.type === "expense" ? -t.amount : t.amount), 0),
    }));
}

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
