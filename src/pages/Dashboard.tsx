import { useMemo, useState } from "react";
import { BarChart } from "../components/BarChart";
import { Donut } from "../components/Donut";
import { Screen } from "../components/Screen";
import { SegmentedControl } from "../components/SegmentedControl";
import { useApp } from "../context/useApp";
import type { RangeKey } from "../types";
import { periodRange, RANGE_KEYS, RANGE_LABELS } from "../utils/date";
import { formatBaht } from "../utils/money";
import { categoryBreakdown, seriesForRange } from "../utils/selectors";

// Monthly budget scaled to the width of a single chart bucket.
const BUCKET_BUDGET_MULTIPLIER: Record<RangeKey, number> = {
  week: 12 / 365,
  month: 1,
  quarter: 3,
  year: 12,
};

export function Dashboard() {
  const { transactions, budgets } = useApp();
  const [range, setRange] = useState<RangeKey>("month");
  const [slice, setSlice] = useState<string | null>(null);

  const points = useMemo(() => seriesForRange(transactions, range), [transactions, range]);
  const slices = useMemo(() => categoryBreakdown(transactions, periodRange(range)), [transactions, range]);

  const monthlyBudget = budgets.reduce((a, b) => a + b.cap, 0);
  const bucketBudget = Math.round(monthlyBudget * BUCKET_BUDGET_MULTIPLIER[range]);

  const avgExpense = points.reduce((a, p) => a + p.expense, 0) / points.length;
  const avgIncome = points.reduce((a, p) => a + p.income, 0) / points.length;

  const selected = slice && slices.some((s) => s.category === slice) ? slice : (slices[0]?.category ?? null);

  return (
    <Screen tint="b">
      <div className="h-title">วิเคราะห์</div>

      <SegmentedControl
        options={RANGE_KEYS.map((k) => ({ value: k, label: RANGE_LABELS[k] }))}
        value={range}
        onChange={setRange}
      />

      <div className="glass-card" style={{ padding: "19px 17px 15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ font: "700 16px/1 var(--fd)", color: "var(--ink)" }}>ประวัติรายรับรายจ่าย</span>
          <span style={{ font: "500 11.5px/1 var(--ft)", color: "var(--ink3)" }}>
            {points[0]?.label} – {points[points.length - 1]?.label}
          </span>
        </div>

        <BarChart points={points} budget={bucketBudget} />

        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 11.5px/1 var(--ft)", color: "var(--ink2)" }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--cy)" }} />
            รายรับ
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "500 11.5px/1 var(--ft)", color: "var(--ink2)" }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--mg)" }} />
            รายจ่าย
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <div className="stat-box">
            <div className="stat-box__label">รายจ่ายเฉลี่ย</div>
            <div className="stat-box__value text-mg" style={{ fontSize: 17 }}>
              {formatBaht(Math.round(avgExpense))}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-box__label">รายรับเฉลี่ย</div>
            <div className="stat-box__value text-cy" style={{ fontSize: 17 }}>
              {formatBaht(Math.round(avgIncome))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: "19px 17px" }}>
        <div style={{ font: "700 16px/1 var(--fd)", color: "var(--ink)" }}>รายจ่ายตามหมวด</div>

        <Donut slices={slices} selected={selected} />

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
          {slices.length ? (
            slices.map((s) => {
              const active = s.category === selected;
              return (
                <button
                  key={s.category}
                  type="button"
                  onClick={() => setSlice(s.category)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 15,
                    cursor: "pointer",
                    background: active ? "var(--gl)" : "transparent",
                    border: `1px solid ${active ? "var(--ge)" : "transparent"}`,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: 999, flex: "none", background: s.color }} />
                  <span style={{ flex: 1, font: "500 13px/1 var(--ft)", color: "var(--ink)", textAlign: "left" }}>
                    {s.category}
                  </span>
                  <span className="tabular" style={{ font: "600 13px/1 var(--fd)", color: "var(--ink2)" }}>
                    {formatBaht(s.amount)}
                  </span>
                  <span className="tabular" style={{ font: "500 11.5px/1 var(--fd)", color: "var(--ink3)", width: 42, textAlign: "right" }}>
                    {s.pct.toFixed(1)}%
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ textAlign: "center", color: "var(--ink3)", font: "400 13px/1.6 var(--ft)", padding: "10px 0" }}>
              ยังไม่มีรายจ่ายในช่วงนี้
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
