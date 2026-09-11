import { CaretRight, Moon, PresentationChart, SignOut, Sun, User } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { useApp } from "../context/useApp";
import { planByKey } from "../data/plans";

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 15px",
  borderRadius: 19,
  background: "var(--gl)",
  border: "var(--bd)",
  boxShadow: "var(--gs2)",
  backdropFilter: "var(--bf)",
  WebkitBackdropFilter: "var(--bf)",
  width: "100%",
  cursor: "pointer",
};

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme, plan, email, signOut } = useApp();
  const current = planByKey(plan);
  const dark = theme === "dark";

  return (
    <Screen tint="a">
      <div className="h-title">ตั้งค่า</div>

      <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: 13, padding: 18 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: "var(--gl2)",
            border: "var(--bd)",
            color: "var(--ink2)",
          }}
        >
          <User weight="duotone" size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 15px/1.2 var(--ft)", color: "var(--ink)", wordBreak: "break-all" }}>{email}</div>
          <div style={{ font: "400 12px/1.3 var(--ft)", color: "var(--ink3)", marginTop: 4 }}>แผน{current.label}</div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: `color-mix(in srgb, ${current.tone} 20%, transparent)`,
            color: current.tone,
          }}
        >
          <current.icon weight="duotone" size={20} />
        </div>
      </div>

      <button type="button" style={rowStyle} onClick={toggleTheme}>
        {dark ? <Moon weight="duotone" size={20} color="var(--cy)" /> : <Sun weight="duotone" size={20} color="var(--cy)" />}
        <span style={{ flex: 1, font: "500 13.5px/1 var(--ft)", color: "var(--ink)", textAlign: "left" }}>
          โหมด{dark ? "มืด" : "สว่าง"}
        </span>
        <span style={{ font: "500 12px/1 var(--ft)", color: "var(--ink3)" }}>แตะเพื่อสลับ</span>
      </button>

      <button type="button" style={rowStyle} onClick={() => navigate("/pricing")}>
        <current.icon weight="duotone" size={20} color="var(--yl)" />
        <span style={{ flex: 1, font: "500 13.5px/1 var(--ft)", color: "var(--ink)", textAlign: "left" }}>แพ็กเกจและการอัปพลัง</span>
        <CaretRight weight="duotone" size={15} color="var(--ink3)" />
      </button>

      <button type="button" style={rowStyle} onClick={() => navigate("/onboarding")}>
        <PresentationChart weight="duotone" size={20} color="var(--cy)" />
        <span style={{ flex: 1, font: "500 13.5px/1 var(--ft)", color: "var(--ink)", textAlign: "left" }}>ดูแนะนำแอปอีกครั้ง</span>
        <CaretRight weight="duotone" size={15} color="var(--ink3)" />
      </button>

      <button type="button" style={rowStyle} onClick={signOut}>
        <SignOut weight="duotone" size={20} color="var(--mg)" />
        <span style={{ flex: 1, font: "500 13.5px/1 var(--ft)", color: "var(--ink)", textAlign: "left" }}>ออกจากระบบ</span>
      </button>
    </Screen>
  );
}
