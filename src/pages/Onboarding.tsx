import { ArrowLeft, ArrowRight, ImageSquare } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import { SLIDE_LABELS, SLIDES } from "../data/slides";
import type { Lang } from "../types";

export function Onboarding() {
  const navigate = useNavigate();
  const { lang, setLang, finishOnboarding } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = SLIDES[lang];
  const current = slides[slide];
  const last = slide === slides.length - 1;

  function next() {
    if (last) {
      finishOnboarding();
      navigate("/");
    } else {
      setSlide((s) => s + 1);
    }
  }

  return (
    <div className="app-shell">
      <div className="screen screen--tint-onboarding">
        <div
          className="glass"
          style={{
            position: "absolute",
            top: 24,
            right: 16,
            zIndex: 7,
            display: "flex",
            gap: 4,
            padding: 4,
            borderRadius: 999,
            boxShadow: "var(--gs2)",
          }}
        >
          {(["TH", "EN"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              style={{
                padding: "7px 13px",
                borderRadius: 999,
                font: "600 11.5px/1 var(--fd)",
                cursor: "pointer",
                border: "none",
                background: lang === l ? "rgba(255,255,255,.18)" : "transparent",
                color: lang === l ? "var(--ink)" : "var(--ink3)",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div style={{ position: "absolute", inset: 0, padding: "84px 24px 132px", display: "flex", flexDirection: "column" }}>
          <div
            className="glass"
            style={{
              height: 300,
              borderRadius: 32,
              background: "repeating-linear-gradient(45deg,var(--gl) 0 11px,transparent 11px 22px)",
              boxShadow: "var(--gs)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 11,
            }}
          >
            <ImageSquare weight="duotone" size={34} color="var(--ink3)" />
            <span
              style={{
                font: "400 11px/1.5 ui-monospace,Menlo,monospace",
                color: "var(--ink3)",
                letterSpacing: ".03em",
                textAlign: "center",
              }}
            >
              ภาพประกอบ {slide + 1}/{slides.length}
              <br />
              illustration — 1080×1080
            </span>
          </div>

          <div style={{ marginTop: 38 }}>
            <div className="eyebrow" style={{ font: "600 10px/1 var(--fd)", letterSpacing: ".18em" }}>
              {current.kicker}
            </div>
            <div
              style={{
                font: "700 30px/1.36 var(--fd)",
                letterSpacing: "-.02em",
                color: "var(--ink)",
                marginTop: 13,
                textWrap: "pretty",
              }}
            >
              {current.title}
            </div>
            <p style={{ font: "400 14.5px/1.65 var(--ft)", color: "var(--ink2)", margin: "13px 0 0", textWrap: "pretty" }}>
              {current.body}
            </p>
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: 8, justifyContent: "center" }}>
            {slides.map((s, i) => (
              <button
                key={s.kicker}
                type="button"
                aria-label={`สไลด์ ${i + 1}`}
                onClick={() => setSlide(i)}
                style={{
                  height: 8,
                  border: "none",
                  padding: 0,
                  borderRadius: 999,
                  cursor: "pointer",
                  width: i === slide ? 30 : 8,
                  background: i === slide ? "var(--cy)" : "var(--ink3)",
                  boxShadow: i === slide ? "0 0 12px rgba(98,197,238,.6)" : "none",
                  transition: "width .2s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", left: 24, right: 24, bottom: 34, zIndex: 8, display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            aria-label="ย้อนกลับ"
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            disabled={slide === 0}
            className="glass"
            style={{
              width: 54,
              height: 54,
              flex: "none",
              borderRadius: 19,
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--gs2)",
              color: slide === 0 ? "var(--ink3)" : "var(--ink)",
              cursor: slide === 0 ? "default" : "pointer",
            }}
          >
            <ArrowLeft weight="duotone" size={20} />
          </button>
          <button type="button" onClick={next} className="btn-cta" style={{ flex: 1, height: 54, borderRadius: 19, fontSize: 15.5 }}>
            {last ? SLIDE_LABELS[lang].start : SLIDE_LABELS[lang].next}
            <ArrowRight weight="duotone" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
