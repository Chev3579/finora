import { Bank, PlusCircle, User, Wallet } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "../components/Chip";
import { Screen } from "../components/Screen";
import { SegmentedControl } from "../components/SegmentedControl";
import { Sheet } from "../components/Sheet";
import { TransactionRow } from "../components/TransactionRow";
import { BANKS, categoryMeta } from "../data/categories";
import { useApp } from "../context/useApp";
import type { RangeKey } from "../types";
import { RANGE_KEYS, RANGE_LABELS, toISO } from "../utils/date";
import { formatBaht } from "../utils/money";
import { sortTransactions, summaryForRange } from "../utils/selectors";

const RANGE_TITLE: Record<RangeKey, string> = {
  week: "สรุปสัปดาห์นี้",
  month: "สรุปเดือนนี้",
  quarter: "สรุปไตรมาสนี้",
  year: "สรุปปีนี้",
};

const QUICK_CATEGORIES = ["กาแฟ", "อาหาร", "Shopping"];

export function Home() {
  const navigate = useNavigate();
  const { transactions, budgets, addTransaction } = useApp();
  const [range, setRange] = useState<RangeKey>("month");
  const [bank, setBank] = useState("ทั้งหมด");
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickAmount, setQuickAmount] = useState(120);
  const [quickCategory, setQuickCategory] = useState("กาแฟ");

  const summary = useMemo(() => summaryForRange(transactions, budgets, range), [transactions, budgets, range]);

  const recent = useMemo(
    () => sortTransactions(transactions.filter((t) => bank === "ทั้งหมด" || t.bank === bank)).slice(0, 4),
    [transactions, bank],
  );

  function saveQuick() {
    if (quickAmount > 0) {
      const now = new Date();
      addTransaction({
        date: toISO(now),
        time: now.toTimeString().slice(0, 5),
        name: quickCategory,
        category: quickCategory,
        type: "expense",
        amount: quickAmount,
        bank: bank === "ทั้งหมด" ? "กสิกร" : bank,
      });
    }
    setQuickOpen(false);
    setQuickAmount(120);
  }

  return (
    <Screen tint="a">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 10px/1 var(--fd)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink3)" }}>
            {summary.bucket.label}
          </div>
          <div className="h-title" style={{ marginTop: 7 }}>
            {RANGE_TITLE[range]}
          </div>
        </div>
        <button type="button" className="icon-btn" onClick={() => navigate("/settings")} aria-label="ตั้งค่า">
          <User weight="duotone" />
        </button>
      </div>

      <div className="glass-card">
        <div className="glass-sweep" />
        <div style={{ font: "500 11px/1 var(--ft)", letterSpacing: ".05em", color: "var(--ink3)" }}>คงเหลือ</div>
        <div
          className="tabular"
          style={{ font: "700 42px/1.1 var(--fd)", letterSpacing: "-.03em", color: "var(--ink)", marginTop: 8 }}
        >
          {formatBaht(summary.balance)}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <div className="stat-box">
            <div className="stat-box__label">รายรับ</div>
            <div className="stat-box__value text-cy">+{formatBaht(summary.income)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-box__label">รายจ่าย</div>
            <div className="stat-box__value text-mg">-{formatBaht(summary.expense)}</div>
          </div>
        </div>
        <div className="hair" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ font: "500 12px/1 var(--ft)", color: "var(--ink2)" }}>งบรายจ่าย {formatBaht(summary.budget)}</span>
          <span className="tabular text-mg" style={{ font: "600 12px/1 var(--fd)" }}>
            {Math.round(summary.pct)}%
          </span>
        </div>
        <div className="progress-track" style={{ marginTop: 9 }}>
          <div
            className="progress-fill"
            style={{
              width: `${summary.pct.toFixed(1)}%`,
              background: "linear-gradient(90deg,var(--mg2),var(--mg))",
              boxShadow: "0 0 14px rgba(255,69,142,.5)",
            }}
          />
        </div>
      </div>

      <button type="button" className="btn-cta" onClick={() => setQuickOpen(true)}>
        <PlusCircle weight="duotone" size={20} />
        จดเพิ่ม
      </button>

      <SegmentedControl
        options={RANGE_KEYS.map((k) => ({ value: k, label: RANGE_LABELS[k] }))}
        value={range}
        onChange={setRange}
      />

      <div className="chip-row chip-row--scroll">
        {BANKS.map((b) => (
          <Chip
            key={b}
            label={b}
            icon={b === "ทั้งหมด" ? Wallet : Bank}
            active={bank === b}
            onClick={() => setBank(b)}
            style={{ flex: "none", padding: "8px 14px", font: "500 12px/1 var(--ft)" }}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 2 }}>
        <span style={{ font: "700 16px/1 var(--fd)", color: "var(--ink)" }}>รายการล่าสุด</span>
        <button
          type="button"
          onClick={() => navigate("/list")}
          style={{ font: "500 12px/1 var(--ft)", color: "var(--cy)", background: "none", border: "none", cursor: "pointer" }}
        >
          ดูทั้งหมด
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {recent.length ? (
          recent.map((t) => <TransactionRow key={t.id} tx={t} />)
        ) : (
          <div style={{ textAlign: "center", color: "var(--ink3)", font: "400 13px/1.6 var(--ft)", padding: "18px 0" }}>
            ยังไม่มีรายการของธนาคารนี้
          </div>
        )}
      </div>

      <Sheet open={quickOpen} onClose={() => setQuickOpen(false)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ font: "700 18px/1 var(--fd)", color: "var(--ink)" }}>จดเร็ว</span>
          <button
            type="button"
            onClick={() => {
              setQuickOpen(false);
              navigate("/add");
            }}
            style={{ font: "500 12px/1 var(--ft)", color: "var(--ink3)", background: "none", border: "none", cursor: "pointer" }}
          >
            ฟอร์มเต็ม ↗
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "18px 0 4px" }}>
          <span style={{ font: "400 26px/1 var(--fd)", color: "var(--ink3)" }}>฿</span>
          <span
            className="tabular text-mg"
            style={{ font: "700 52px/1 var(--fd)", letterSpacing: "-.03em" }}
          >
            {quickAmount.toLocaleString("en-US")}
          </span>
        </div>

        <div style={{ display: "flex", gap: 7, marginTop: 14 }}>
          {[20, 50, 100].map((step) => (
            <button
              key={step}
              type="button"
              className="glass"
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 14,
                color: "var(--ink2)",
                font: "600 13px/1 var(--fd)",
                cursor: "pointer",
              }}
              onClick={() => setQuickAmount((a) => a + step)}
            >
              +{step}
            </button>
          ))}
          <button
            type="button"
            className="glass"
            style={{ flex: 1, padding: "10px 0", borderRadius: 14, color: "var(--ink2)", font: "600 13px/1 var(--fd)", cursor: "pointer" }}
            onClick={() => setQuickAmount(0)}
          >
            ล้าง
          </button>
        </div>

        <div className="chip-row" style={{ marginTop: 14 }}>
          {QUICK_CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              tone="mg"
              icon={categoryMeta(c).icon}
              active={quickCategory === c}
              onClick={() => setQuickCategory(c)}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{
            marginTop: 18,
            height: 52,
            borderRadius: 19,
            background: "linear-gradient(180deg,var(--mg),var(--mg2))",
            boxShadow: "0 12px 28px rgba(255,69,142,.34), inset 0 1px 0 rgba(255,255,255,.4)",
          }}
          onClick={saveQuick}
        >
          บันทึก
        </button>
      </Sheet>
    </Screen>
  );
}
