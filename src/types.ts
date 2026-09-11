export type TxType = "expense" | "income";

export interface Transaction {
  id: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm (24h)
  name: string;
  category: string;
  type: TxType;
  amount: number; // always positive magnitude
  bank: string;
  note?: string;
}

export type RangeKey = "week" | "month" | "quarter" | "year";

export type Theme = "dark" | "light";

export type Lang = "TH" | "EN";

export type PlanKey = "free" | "silver" | "gold";

export interface CategoryBudget {
  category: string;
  cap: number; // monthly cap
}
