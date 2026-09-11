import type { Lang } from "../types";

export interface Slide {
  kicker: string;
  title: string;
  body: string;
}

export const SLIDES: Record<Lang, Slide[]> = {
  TH: [
    {
      kicker: "ขั้นที่ 1",
      title: "จดทุกบาท โดยไม่ต้องจำ",
      body: "ถ่ายสลิปหรือพิมพ์เอง เหมียวจัดหมวดให้อัตโนมัติภายในไม่กี่วินาที",
    },
    {
      kicker: "ขั้นที่ 2",
      title: "เห็นภาพรวมใน 3 วินาที",
      body: "กราฟรายรับรายจ่ายและสัดส่วนตามหมวด เทียบข้ามเดือนได้ทันที",
    },
    {
      kicker: "ขั้นที่ 3",
      title: "ตั้งงบ แล้วให้เราเตือน",
      body: "กำหนดงบรายหมวด แล้วรับแจ้งเตือนก่อนใช้เกิน ไม่ต้องมาไล่นับเอง",
    },
  ],
  EN: [
    {
      kicker: "Step 1",
      title: "Log every baht, remember none",
      body: "Snap a slip or type it in. The cat files it into the right category in seconds.",
    },
    {
      kicker: "Step 2",
      title: "The whole month in three seconds",
      body: "Income against spending, split by category, compared across months.",
    },
    {
      kicker: "Step 3",
      title: "Set a budget, let us watch it",
      body: "Per-category budgets with a nudge before you go over. No counting required.",
    },
  ],
};

export const SLIDE_LABELS: Record<Lang, { next: string; start: string }> = {
  TH: { next: "ต่อไป", start: "เริ่มใช้งาน" },
  EN: { next: "Next", start: "Get started" },
};
