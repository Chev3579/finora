import type { TxType } from "../types";

export function formatBaht(value: number): string {
  return "฿" + Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatSigned(value: number, type: TxType): string {
  return (type === "expense" ? "-" : "+") + formatBaht(value);
}

export function formatSignedTotal(value: number): string {
  return (value < 0 ? "-" : "+") + formatBaht(value);
}

export function signedAmount(amount: number, type: TxType): number {
  return type === "expense" ? -amount : amount;
}
