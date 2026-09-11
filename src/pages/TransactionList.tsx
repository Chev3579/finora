import { CalendarBlank, CaretDown, DownloadSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { Chip } from "../components/Chip";
import { Screen } from "../components/Screen";
import { SegmentedControl } from "../components/SegmentedControl";
import { TransactionRow } from "../components/TransactionRow";
import { useApp } from "../context/useApp";
import { ALL_CATEGORIES } from "../data/categories";
import type { Transaction, TxType } from "../types";
import { formatFullDate, parseISO, toISO } from "../utils/date";
import { formatSignedTotal } from "../utils/money";
import { groupByDay, sortTransactions } from "../utils/selectors";

type TypeFilter = "all" | TxType;

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "expense", label: "รายจ่าย" },
  { value: "income", label: "รายรับ" },
];

function toCsv(rows: Transaction[]): string {
  const head = "date,time,name,category,type,amount,bank";
  const body = rows.map((t) =>
    [t.date, t.time, `"${t.name.replace(/"/g, '""')}"`, t.category, t.type, t.amount, t.bank].join(","),
  );
  return [head, ...body].join("\n");
}

export function TransactionList() {
  const { transactions } = useApp();
  const [month, setMonth] = useState(() => toISO(new Date()).slice(0, 7));
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [category, setCategory] = useState("ทั้งหมด");

  const [year, mon] = month.split("-").map(Number);
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 0);

  const filtered = sortTransactions(
    transactions.filter((t) => {
      if (!t.date.startsWith(month)) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (category !== "ทั้งหมด" && t.category !== category) return false;
      return true;
    }),
  );

  const groups = groupByDay(filtered);

  function exportCsv() {
    const url = URL.createObjectURL(new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `finora-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Screen tint="a">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="h-title" style={{ flex: 1 }}>
          รายการ
        </div>
        <button type="button" className="icon-btn" onClick={exportCsv} aria-label="ส่งออก .csv">
          <DownloadSimple weight="duotone" size={19} />
        </button>
      </div>

      <label
        className="glass-card glass-card--sm"
        style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 15px", cursor: "pointer" }}
      >
        <CalendarBlank weight="duotone" size={19} color="var(--cy)" />
        <span className="tabular" style={{ flex: 1, font: "500 13.5px/1 var(--ft)", color: "var(--ink)" }}>
          {formatFullDate(start)} — {formatFullDate(end)}
        </span>
        <CaretDown weight="duotone" size={14} color="var(--ink3)" />
        <input
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
      </label>

      <SegmentedControl options={TYPE_OPTIONS} value={typeFilter} onChange={setTypeFilter} />

      <div className="glass-card glass-card--sm" style={{ borderRadius: 22, padding: 14 }}>
        <div className="field-label" style={{ marginBottom: 11 }}>
          หมวด
        </div>
        <div className="chip-row" style={{ gap: 6 }}>
          {["ทั้งหมด", ...ALL_CATEGORIES].map((c) => (
            <Chip
              key={c}
              label={c}
              tone="mg"
              active={category === c}
              onClick={() => setCategory(c)}
              style={{ padding: "8px 13px", font: "500 12px/1 var(--ft)" }}
            />
          ))}
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.date} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px" }}>
            <span style={{ font: "600 12.5px/1 var(--ft)", color: "var(--ink2)" }}>{formatFullDate(parseISO(g.date))}</span>
            <span
              className="tabular"
              style={{ font: "600 12.5px/1 var(--fd)", color: g.total < 0 ? "var(--mg)" : "var(--cy)" }}
            >
              รวม {formatSignedTotal(g.total)}
            </span>
          </div>
          {g.items.map((t) => (
            <TransactionRow key={t.id} tx={t} showCaret />
          ))}
        </div>
      ))}

      {groups.length === 0 && (
        <div style={{ marginTop: 26, textAlign: "center", color: "var(--ink3)", font: "400 13px/1.6 var(--ft)" }}>
          ไม่มีรายการในตัวกรองนี้
        </div>
      )}
    </Screen>
  );
}
