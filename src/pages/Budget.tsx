import { X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Screen } from "../components/Screen";
import { useApp } from "../context/useApp";
import { categoryMeta } from "../data/categories";
import { daysLeftInMonth } from "../utils/date";
import { formatBaht } from "../utils/money";
import { budgetRows } from "../utils/selectors";

export function Budget() {
  const { transactions, budgets, tags, addTag, removeTag } = useApp();
  const [managing, setManaging] = useState(false);
  const [newTag, setNewTag] = useState<string | null>(null);

  const rows = useMemo(() => budgetRows(transactions, budgets), [transactions, budgets]);
  const totalCap = rows.reduce((a, r) => a + r.cap, 0);
  const totalUsed = rows.reduce((a, r) => a + r.used, 0);
  const totalPct = totalCap > 0 ? Math.min(100, (totalUsed / totalCap) * 100) : 0;

  function commitTag() {
    const value = (newTag ?? "").trim();
    if (value) addTag(value.startsWith("#") ? value : `#${value}`);
    setNewTag(null);
  }

  return (
    <Screen tint="b">
      <div className="h-title">หมวด / งบ</div>

      <div className="glass-card" style={{ padding: 20 }}>
        <div className="glass-sweep" style={{ width: "30%", animationDuration: "11s" }} />
        <div style={{ font: "500 11px/1 var(--ft)", letterSpacing: ".05em", color: "var(--ink3)" }}>ใช้ไปแล้วเดือนนี้</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 9 }}>
          <span className="tabular" style={{ font: "700 38px/1 var(--fd)", letterSpacing: "-.03em", color: "var(--ink)" }}>
            {formatBaht(totalUsed)}
          </span>
          <span style={{ font: "500 14px/1 var(--fd)", color: "var(--ink3)" }}>/ {formatBaht(totalCap)}</span>
        </div>
        <div className="progress-track" style={{ height: 11, marginTop: 16 }}>
          <div
            className="progress-fill"
            style={{
              width: `${totalPct.toFixed(1)}%`,
              background: "linear-gradient(90deg,var(--cy),var(--mg))",
              boxShadow: "0 0 16px rgba(255,69,142,.45)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            font: "500 11.5px/1 var(--ft)",
            color: "var(--ink3)",
          }}
        >
          <span>เหลือ {formatBaht(Math.max(0, totalCap - totalUsed))}</span>
          <span>เหลืออีก {daysLeftInMonth()} วัน</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {rows.map((row) => {
          const meta = categoryMeta(row.category);
          return (
            <div key={row.category} className="glass-card glass-card--sm" style={{ borderRadius: 22, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    flex: "none",
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 18,
                    background: `color-mix(in srgb, ${meta.color} 18%, transparent)`,
                    color: meta.color,
                  }}
                >
                  <meta.icon weight="duotone" />
                </div>
                <span style={{ flex: 1, font: "600 13.5px/1 var(--ft)", color: "var(--ink)" }}>{row.category}</span>
                <span
                  className="tabular"
                  style={{ font: "600 13px/1 var(--fd)", color: row.over ? "var(--mg)" : "var(--ink)" }}
                >
                  {formatBaht(row.used)}
                </span>
                <span className="tabular" style={{ font: "500 12px/1 var(--fd)", color: "var(--ink3)" }}>
                  / {formatBaht(row.cap)}
                </span>
              </div>
              <div className="progress-track progress-track--thin" style={{ marginTop: 12 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${row.pct.toFixed(1)}%`,
                    background: row.over
                      ? "linear-gradient(90deg,var(--mg2),var(--mg))"
                      : "linear-gradient(90deg,rgba(98,197,238,.55),var(--cy))",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card glass-card--sm" style={{ borderRadius: 24, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ font: "700 15px/1 var(--fd)", color: "var(--ink)" }}>แท็ก</span>
          <button
            type="button"
            onClick={() => setManaging((v) => !v)}
            style={{ font: "500 12px/1 var(--ft)", color: "var(--cy)", background: "none", border: "none", cursor: "pointer" }}
          >
            {managing ? "เสร็จสิ้น" : "จัดการ"}
          </button>
        </div>
        <div className="chip-row" style={{ gap: 6, marginTop: 13 }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 13px",
                borderRadius: 999,
                background: "rgba(98,197,238,.13)",
                border: "1px solid rgba(98,197,238,.34)",
                color: "var(--cy)",
                font: "500 12px/1 var(--ft)",
              }}
            >
              {t}
              {managing && (
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  aria-label={`ลบ ${t}`}
                  style={{ background: "none", border: "none", color: "var(--cy)", cursor: "pointer", padding: 0, display: "grid" }}
                >
                  <X weight="bold" size={11} />
                </button>
              )}
            </span>
          ))}
          {newTag === null ? (
            <button
              type="button"
              onClick={() => setNewTag("")}
              style={{
                padding: "8px 13px",
                borderRadius: 999,
                background: "var(--gl2)",
                border: "1px dashed var(--ink3)",
                color: "var(--ink3)",
                font: "500 12px/1 var(--ft)",
                cursor: "pointer",
              }}
            >
              + #แท็กใหม่
            </button>
          ) : (
            <input
              autoFocus
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onBlur={commitTag}
              onKeyDown={(e) => e.key === "Enter" && commitTag()}
              placeholder="#แท็กใหม่"
              style={{
                padding: "8px 13px",
                borderRadius: 999,
                background: "var(--gl2)",
                border: "1px solid var(--cy)",
                color: "var(--ink)",
                font: "500 12px/1 var(--ft)",
                outline: "none",
                width: 120,
              }}
            />
          )}
        </div>
      </div>
    </Screen>
  );
}
