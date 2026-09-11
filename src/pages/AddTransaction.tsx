import { CalendarBlank, CaretRight, CreditCard, UploadSimple, X } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "../components/Chip";
import { useApp } from "../context/useApp";
import { categoryMeta, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../data/categories";
import type { TxType } from "../types";
import { formatFullDate, parseISO, toISO } from "../utils/date";

const overlayInputStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
};

const fieldStyle: React.CSSProperties = {
  borderRadius: 17,
  padding: "13px 15px",
  background: "var(--gl)",
  border: "var(--bd)",
  font: "400 14px/1.3 var(--ft)",
  color: "var(--ink)",
  width: "100%",
};

export function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction, tags, addTag } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);

  const now = new Date();
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("150");
  const [category, setCategory] = useState("กาแฟ");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(toISO(now));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string | null>(null);
  const [onCredit, setOnCredit] = useState(false);
  const [slip, setSlip] = useState<string | null>(null);

  const isExpense = type === "expense";
  const tone = isExpense ? "var(--mg)" : "var(--cy)";
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const numericAmount = Number(amount.replace(/,/g, "")) || 0;

  function switchType(next: TxType) {
    setType(next);
    const list = next === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!list.includes(category)) setCategory(list[0]);
  }

  function bump(step: number) {
    setAmount(String(Math.max(0, numericAmount + step)));
  }

  function commitTag() {
    const value = (newTag ?? "").trim();
    if (value) {
      const tag = value.startsWith("#") ? value : `#${value}`;
      addTag(tag);
      setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    }
    setNewTag(null);
  }

  function save() {
    if (numericAmount <= 0) return;
    addTransaction({
      date,
      time,
      name: note.trim() || category,
      category,
      type,
      amount: numericAmount,
      bank: onCredit ? "บัตรเครดิต" : "กสิกร",
      note: selectedTags.join(" ") || undefined,
    });
    navigate("/");
  }

  const background = isExpense
    ? "radial-gradient(130% 55% at 20% -5%, var(--pink), transparent 62%), radial-gradient(110% 48% at 95% 104%, var(--pink), transparent 60%), var(--bg)"
    : "radial-gradient(130% 55% at 20% -5%, var(--blue), transparent 62%), radial-gradient(110% 48% at 95% 104%, var(--blue), transparent 60%), var(--bg)";

  return (
    <div className="app-shell">
      <div className="screen" style={{ background, display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,7,7,.42)", backdropFilter: "blur(4px)" }} />

        <div
          style={{
            position: "relative",
            marginTop: 76,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "36px 36px 0 0",
            background: "var(--gl2)",
            borderTop: "var(--bd)",
            boxShadow: "0 -22px 54px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.28)",
            backdropFilter: "blur(34px) saturate(1.7)",
            WebkitBackdropFilter: "blur(34px) saturate(1.7)",
          }}
        >
          <div style={{ padding: "12px 18px 6px" }}>
            <div className="sheet__handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ font: "700 20px/1 var(--fd)", color: "var(--ink)" }}>เพิ่มรายการ</span>
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="ปิด"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--gl)",
                  border: "var(--bd)",
                  color: "var(--ink2)",
                  cursor: "pointer",
                }}
              >
                <X weight="duotone" size={16} />
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 18px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                padding: 5,
                borderRadius: 21,
                background: "var(--gl)",
                border: "var(--bd)",
              }}
            >
              {(["expense", "income"] as TxType[]).map((t) => {
                const active = type === t;
                const activeTone = t === "expense" ? "var(--mg)" : "var(--cy)";
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => switchType(t)}
                    style={{
                      textAlign: "center",
                      padding: "12px 0",
                      borderRadius: 16,
                      font: "600 14px/1 var(--ft)",
                      cursor: "pointer",
                      border: "none",
                      background: active ? (t === "expense" ? "rgba(255,69,142,.2)" : "rgba(98,197,238,.2)") : "transparent",
                      color: active ? activeTone : "var(--ink3)",
                      boxShadow: active ? "var(--gs2)" : "none",
                    }}
                  >
                    {t === "expense" ? "รายจ่าย" : "รายรับ"}
                  </button>
                );
              })}
            </div>

            <div>
              <div className="field-label">จำนวนเงิน</div>
              <div style={{ borderRadius: 22, padding: "16px 18px", background: "var(--gl)", border: "var(--bd)", boxShadow: "var(--gs2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ font: "400 22px/1 var(--fd)", color: "var(--ink3)" }}>฿</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                    inputMode="decimal"
                    aria-label="จำนวนเงิน"
                    className="tabular"
                    style={{
                      font: "700 44px/1.1 var(--fd)",
                      letterSpacing: "-.03em",
                      color: tone,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      width: "100%",
                      padding: 0,
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 7, marginTop: 14 }}>
                  {[20, 50, 100].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => bump(s)}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 13,
                        background: "var(--gl2)",
                        border: "var(--bd)",
                        color: "var(--ink2)",
                        font: "600 12.5px/1 var(--fd)",
                        cursor: "pointer",
                      }}
                    >
                      +{s}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount("0")}
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      borderRadius: 13,
                      background: "var(--gl2)",
                      border: "var(--bd)",
                      color: "var(--ink2)",
                      font: "600 12.5px/1 var(--fd)",
                      cursor: "pointer",
                    }}
                  >
                    ล้าง
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="field-label">หมวด</div>
              <div className="chip-row">
                {categories.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    icon={categoryMeta(c).icon}
                    tone={isExpense ? "mg" : "cy"}
                    active={category === c}
                    onClick={() => setCategory(c)}
                    style={{ padding: "10px 14px", font: "500 13px/1 var(--ft)" }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="field-label">รายละเอียด</div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isExpense ? "ชาเขียว Starbucks" : "โอนจาก Grab"}
                style={{ ...fieldStyle, outline: "none" }}
              />
            </div>

            <div>
              <div className="field-label">วันที่และเวลา</div>
              <div style={{ ...fieldStyle, display: "flex", alignItems: "center", gap: 11 }}>
                <CalendarBlank weight="duotone" size={19} color="var(--cy)" />
                <label style={{ position: "relative", flex: 1, cursor: "pointer" }}>
                  <span className="tabular" style={{ font: "400 14px/1 var(--ft)", color: "var(--ink)" }}>
                    {formatFullDate(parseISO(date))}
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => e.target.value && setDate(e.target.value)}
                    aria-label="วันที่"
                    style={overlayInputStyle}
                  />
                </label>
                <label style={{ position: "relative", cursor: "pointer" }}>
                  <span className="tabular" style={{ font: "400 14px/1 var(--ft)", color: "var(--ink)" }}>
                    {time} น.
                  </span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => e.target.value && setTime(e.target.value)}
                    aria-label="เวลา"
                    style={overlayInputStyle}
                  />
                </label>
              </div>
            </div>

            <div>
              <div className="field-label">แท็ก</div>
              <div className="chip-row">
                {tags.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    active={selectedTags.includes(t)}
                    onClick={() =>
                      setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
                    }
                    style={{ padding: "8px 13px", font: "500 12.5px/1 var(--ft)" }}
                  />
                ))}
                {newTag === null ? (
                  <button
                    type="button"
                    className="chip"
                    style={{ color: "var(--ink3)", padding: "8px 13px", font: "500 12.5px/1 var(--ft)" }}
                    onClick={() => setNewTag("")}
                  >
                    + เพิ่มแท็ก
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
                      background: "var(--gl)",
                      border: "1px solid var(--cy)",
                      color: "var(--ink)",
                      font: "500 12.5px/1 var(--ft)",
                      outline: "none",
                      width: 120,
                    }}
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOnCredit((v) => !v)}
              style={{
                borderRadius: 17,
                padding: "14px 15px",
                background: "var(--gl)",
                border: onCredit ? "1px solid var(--cy)" : "var(--bd)",
                display: "flex",
                alignItems: "center",
                gap: 11,
                cursor: "pointer",
                width: "100%",
              }}
            >
              <CreditCard weight="duotone" size={19} color={onCredit ? "var(--cy)" : "var(--ink2)"} />
              <span style={{ flex: 1, font: "500 13.5px/1 var(--ft)", color: "var(--ink)", textAlign: "left" }}>
                จดเป็นรายการบัตรเครดิต
              </span>
              <CaretRight weight="duotone" size={15} color="var(--ink3)" />
            </button>

            <div>
              <div className="field-label">หลักฐาน</div>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                style={{
                  height: 96,
                  width: "100%",
                  borderRadius: 20,
                  border: "1px dashed var(--ink3)",
                  background: "repeating-linear-gradient(45deg,var(--gl) 0 9px,transparent 9px 18px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  cursor: "pointer",
                }}
              >
                <UploadSimple weight="duotone" size={21} color="var(--ink2)" />
                <span style={{ font: "400 11px/1 ui-monospace,Menlo,monospace", color: "var(--ink3)", letterSpacing: ".04em" }}>
                  {slip ?? "แนบสลิป / slip.jpg"}
                </span>
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setSlip(e.target.files?.[0]?.name ?? null)}
              />
            </div>
          </div>

          <div style={{ padding: "12px 18px 26px", borderTop: "1px solid var(--hair)" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={save}
              style={{
                background: isExpense
                  ? "linear-gradient(180deg,var(--mg),var(--mg2))"
                  : "linear-gradient(180deg,var(--cy),var(--cyd))",
                boxShadow:
                  (isExpense ? "0 14px 30px rgba(255,69,142,.34)" : "0 14px 30px rgba(98,197,238,.3)") +
                  ", inset 0 1px 0 rgba(255,255,255,.4)",
              }}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
