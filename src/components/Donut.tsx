import type { CategorySlice } from "../utils/selectors";
import { formatBaht } from "../utils/money";

interface DonutProps {
  slices: CategorySlice[];
  selected: string | null;
}

export function Donut({ slices, selected }: DonutProps) {
  let acc = 0;
  const stops = slices
    .map((s) => {
      const from = acc;
      acc += s.pct;
      const color = s.category === selected ? s.color : `color-mix(in srgb, ${s.color} 32%, transparent)`;
      return `${color} ${from.toFixed(2)}% ${acc.toFixed(2)}%`;
    })
    .join(",");

  const active = slices.find((s) => s.category === selected) ?? slices[0];

  return (
    <div style={{ position: "relative", width: 196, height: 196, margin: "20px auto 6px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          background: slices.length ? `conic-gradient(from -90deg,${stops})` : "var(--gl2)",
          boxShadow: "0 16px 36px rgba(0,0,0,.35)",
          transition: "background .3s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 38,
          borderRadius: 999,
          background: "var(--hole)",
          border: "var(--bd)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.25)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <span style={{ font: "500 11px/1 var(--ft)", color: "var(--ink3)" }}>{active ? active.category : "ยังไม่มีข้อมูล"}</span>
        <span style={{ font: "700 24px/1 var(--fd)", color: "var(--ink)" }} className="tabular">
          {formatBaht(active?.amount ?? 0)}
        </span>
        <span style={{ font: "600 11.5px/1 var(--fd)", color: "var(--mg)" }}>{(active?.pct ?? 0).toFixed(1)}%</span>
      </div>
    </div>
  );
}
