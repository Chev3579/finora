import { CaretRight } from "@phosphor-icons/react";
import { categoryMeta } from "../data/categories";
import type { Transaction } from "../types";
import { formatSigned } from "../utils/money";

interface TransactionRowProps {
  tx: Transaction;
  showCaret?: boolean;
}

export function TransactionRow({ tx, showCaret = false }: TransactionRowProps) {
  const meta = categoryMeta(tx.category);
  return (
    <div className="tx-row">
      <div
        className="tx-row__icon"
        style={{ background: `color-mix(in srgb, ${meta.color} 18%, transparent)`, color: meta.color }}
      >
        <meta.icon weight="duotone" />
      </div>
      <div className="tx-row__body">
        <div className="tx-row__name">{tx.name}</div>
        <div className="tx-row__meta">
          {tx.time} น. · {tx.category}
        </div>
      </div>
      <div className="tx-row__amt" style={{ color: tx.type === "expense" ? "var(--mg)" : "var(--cy)" }}>
        {formatSigned(tx.amount, tx.type)}
      </div>
      {showCaret && <CaretRight weight="duotone" size={14} color="var(--ink3)" />}
    </div>
  );
}
