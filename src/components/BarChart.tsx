import type { SeriesPoint } from "../utils/selectors";
import { formatBaht } from "../utils/money";

const BAR_MAX = 126;

interface BarChartProps {
  points: SeriesPoint[];
  budget: number;
}

export function BarChart({ points, budget }: BarChartProps) {
  // Scale on the data, so a budget far above actual spending doesn't flatten the bars.
  const max = Math.max(...points.flatMap((p) => [p.income, p.expense]), 1);
  const budgetY = Math.round((budget / max) * BAR_MAX);
  const showBudget = budgetY <= BAR_MAX;

  return (
    <div style={{ position: "relative", height: 148, marginTop: 22 }}>
      {showBudget && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: budgetY,
              height: 0,
              borderTop: "1px dashed var(--mg)",
              opacity: 0.75,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: budgetY + 4,
              padding: "4px 9px",
              borderRadius: 999,
              background: "var(--mg)",
              color: "#fff",
              font: "600 10px/1 var(--fd)",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(255,69,142,.4)",
            }}
          >
            งบ {formatBaht(budget)}
          </div>
        </>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {points.map((p) => (
          <div key={p.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 130 }}>
              <div
                style={{
                  width: 11,
                  borderRadius: 6,
                  background: "linear-gradient(180deg,var(--cy),rgba(98,197,238,.35))",
                  boxShadow: "0 0 12px rgba(98,197,238,.3)",
                  height: Math.round((p.income / max) * BAR_MAX),
                  transition: "height .3s ease",
                }}
              />
              <div
                style={{
                  width: 11,
                  borderRadius: 6,
                  background: "linear-gradient(180deg,var(--mg),rgba(255,69,142,.35))",
                  boxShadow: "0 0 12px rgba(255,69,142,.3)",
                  height: Math.round((p.expense / max) * BAR_MAX),
                  transition: "height .3s ease",
                }}
              />
            </div>
            <span style={{ font: "500 10px/1 var(--ft)", color: "var(--ink3)" }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
