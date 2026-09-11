import { ArrowLeft, CheckCircle, MinusCircle, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SegmentedControl } from "../components/SegmentedControl";
import { useApp } from "../context/useApp";
import { PLAN_FEATURES, PLANS, planByKey } from "../data/plans";
import type { PlanKey } from "../types";

export function Pricing() {
  const navigate = useNavigate();
  const { plan: currentPlan, setPlan } = useApp();
  const [viewing, setViewing] = useState<PlanKey>(currentPlan);

  const plan = planByKey(viewing);
  const active = viewing === currentPlan;

  return (
    <div className="app-shell">
      <div className="screen screen--tint-pricing">
        <div className="screen-content" style={{ paddingBottom: 116 }}>
          <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="ย้อนกลับ">
            <ArrowLeft weight="duotone" size={18} />
          </button>

          <div>
            <div className="eyebrow" style={{ color: "var(--yl)" }}>
              อัปพลัง
            </div>
            <div style={{ font: "700 27px/1.2 var(--fd)", letterSpacing: "-.02em", color: "var(--ink)", marginTop: 8 }}>
              พลังของเหมียว
            </div>
          </div>

          <p style={{ font: "400 13px/1.6 var(--ft)", color: "var(--ink2)", margin: 0 }}>
            เลือกแผนที่พอดีกับการจดของคุณ ยกเลิกได้ทุกเมื่อ
          </p>

          <SegmentedControl
            options={PLANS.map((p) => ({ value: p.key, label: p.label }))}
            value={viewing}
            onChange={setViewing}
            style={{ borderRadius: 21 }}
          />

          <div className="glass-card" style={{ padding: "22px 19px", border: `1px solid ${viewing === "free" ? "var(--ge)" : plan.tone}` }}>
            <div className="glass-sweep" style={{ width: "32%", animationDuration: "8s" }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 11px/1 var(--ft)", letterSpacing: ".08em", color: "var(--ink3)", textTransform: "uppercase" }}>
                  {plan.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 11 }}>
                  <span style={{ font: "700 40px/1 var(--fd)", letterSpacing: "-.03em", color: "var(--ink)" }}>{plan.price}</span>
                  <span style={{ font: "400 13px/1 var(--ft)", color: "var(--ink3)" }}>{plan.per}</span>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  display: "grid",
                  placeItems: "center",
                  background: `color-mix(in srgb, ${plan.tone} 20%, transparent)`,
                  color: plan.tone,
                }}
              >
                <plan.icon weight="duotone" size={22} />
              </div>
            </div>

            <div className="hair" style={{ margin: "18px 0 15px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {PLAN_FEATURES.map((f, i) => {
                const included = i < plan.featureCount;
                const FeatureIcon = included ? CheckCircle : MinusCircle;
                return (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <FeatureIcon weight="duotone" size={18} color={included ? "var(--cy)" : "var(--ink3)"} />
                    <span style={{ font: "400 13.5px/1.4 var(--ft)", color: included ? "var(--ink)" : "var(--ink3)" }}>{f}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 15px",
              borderRadius: 19,
              background: "var(--gl)",
              border: "var(--bd)",
            }}
          >
            <ShieldCheck weight="duotone" size={19} color="var(--cy)" />
            <span style={{ font: "400 12px/1.5 var(--ft)", color: "var(--ink2)" }}>
              ทดลองฟรี 14 วัน ยังไม่ตัดเงิน เตือนก่อนหมดอายุ
            </span>
          </div>
        </div>

        <div style={{ position: "fixed", left: 16, right: 16, bottom: 24, maxWidth: 428, margin: "0 auto", zIndex: 9 }}>
          <button
            type="button"
            className="btn-primary"
            disabled={active}
            onClick={() => {
              setPlan(viewing);
              navigate("/settings");
            }}
            style={{
              height: 56,
              background: active ? "var(--gl2)" : "linear-gradient(180deg,var(--mg),var(--mg2))",
              color: active ? "var(--ink3)" : "#fff",
              border: active ? "var(--bd)" : "none",
              boxShadow: active ? "var(--gs2)" : "0 16px 34px rgba(255,69,142,.34), inset 0 1px 0 rgba(255,255,255,.4)",
              cursor: active ? "default" : "pointer",
              backdropFilter: active ? "var(--bf)" : undefined,
            }}
          >
            {active ? "แผนปัจจุบันของคุณ" : "อัปพลังฟรี 14 วัน"}
          </button>
        </div>
      </div>
    </div>
  );
}
