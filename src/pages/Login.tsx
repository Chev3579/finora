import { ArrowRight, Envelope, Lock } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

const fieldStyle: React.CSSProperties = {
  borderRadius: 17,
  padding: "13px 15px",
  background: "var(--gl)",
  border: "var(--bd)",
  font: "400 14px/1.3 var(--ft)",
  color: "var(--ink)",
  width: "100%",
  outline: "none",
};

type Mode = "signin" | "signup";

export function Login() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const credentials = { email: email.trim(), password };
    const { data, error: authError } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

    if (authError) setError(authError.message);
    else if (mode === "signup" && !data.session) setNotice("ส่งลิงก์ยืนยันไปที่อีเมลแล้ว กดยืนยันก่อนเข้าใช้งาน");

    setBusy(false);
  }

  return (
    <div className="app-shell">
      <div className="screen screen--tint-onboarding">
        <div style={{ position: "absolute", inset: 0, padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="eyebrow">Finora</div>
          <h1 style={{ font: "700 30px/1.36 var(--fd)", letterSpacing: "-.02em", color: "var(--ink)", margin: "13px 0 0" }}>
            {mode === "signin" ? "ยินดีต้อนรับกลับ" : "สร้างบัญชีใหม่"}
          </h1>
          <p style={{ font: "400 14.5px/1.65 var(--ft)", color: "var(--ink2)", margin: "12px 0 30px", textWrap: "pretty" }}>
            {mode === "signin"
              ? "เข้าสู่ระบบเพื่อดูรายรับรายจ่ายของคุณจากทุกเครื่อง"
              : "สมัครครั้งเดียว ใช้ได้ทั้งมือถือและคอมพิวเตอร์"}
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <div className="field-label">อีเมล</div>
              <div style={{ ...fieldStyle, display: "flex", alignItems: "center", gap: 11 }}>
                <Envelope weight="duotone" size={19} color="var(--cy)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", font: "400 14px/1.3 var(--ft)", color: "var(--ink)" }}
                />
              </div>
            </div>

            <div>
              <div className="field-label">รหัสผ่าน</div>
              <div style={{ ...fieldStyle, display: "flex", alignItems: "center", gap: 11 }}>
                <Lock weight="duotone" size={19} color="var(--cy)" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", font: "400 14px/1.3 var(--ft)", color: "var(--ink)" }}
                />
              </div>
            </div>

            {error && (
              <div style={{ font: "500 12.5px/1.5 var(--ft)", color: "var(--mg)", padding: "0 4px" }}>{error}</div>
            )}
            {notice && (
              <div style={{ font: "500 12.5px/1.5 var(--ft)", color: "var(--cy)", padding: "0 4px" }}>{notice}</div>
            )}

            <button type="submit" className="btn-cta" disabled={busy} style={{ marginTop: 8, opacity: busy ? 0.6 : 1 }}>
              {busy ? "กำลังดำเนินการ…" : mode === "signin" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
              <ArrowRight weight="duotone" size={18} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            style={{
              marginTop: 20,
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "500 13px/1.5 var(--ft)",
              color: "var(--ink3)",
            }}
          >
            {mode === "signin" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
