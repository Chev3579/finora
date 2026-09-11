import { Cat, CrownSimple, Sparkle, type Icon } from "@phosphor-icons/react";
import type { PlanKey } from "../types";

export interface Plan {
  key: PlanKey;
  label: string;
  price: string;
  per: string;
  icon: Icon;
  tone: string;
  featureCount: number;
}

export const PLANS: Plan[] = [
  { key: "free", label: "ฟรี", price: "฿0", per: "ตลอดไป", icon: Cat, tone: "var(--ink2)", featureCount: 5 },
  { key: "silver", label: "ซิลเวอร์", price: "฿49", per: "ต่อเดือน", icon: Sparkle, tone: "var(--cy)", featureCount: 8 },
  { key: "gold", label: "โกลด์", price: "฿99", per: "ต่อเดือน", icon: CrownSimple, tone: "var(--yl)", featureCount: 10 },
];

export const PLAN_FEATURES = [
  "จดรายการไม่จำกัด",
  "สรุปรายเดือน",
  "ตัวกรองธนาคาร",
  "งบประมาณ 1 หมวด",
  "ส่งออก .csv",
  "อ่านสลิปอัตโนมัติ 100 ใบ/เดือน",
  "งบประมาณไม่จำกัด",
  "กราฟเทียบข้ามเดือน",
  "จดบัตรเครดิต + รายการจดประจำ",
  "ธีมและไอคอนพิเศษ",
];

export function planByKey(key: PlanKey): Plan {
  return PLANS.find((p) => p.key === key) ?? PLANS[0];
}
