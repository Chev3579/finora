import {
  Briefcase,
  ChartBar,
  ChartPieSlice,
  Coffee,
  DotsThreeCircle,
  ForkKnife,
  GasPump,
  GearSix,
  House,
  ListBullets,
  Robot,
  ShoppingBag,
  Storefront,
  SuitcaseSimple,
  YoutubeLogo,
  type Icon,
} from "@phosphor-icons/react";

export interface CategoryMeta {
  icon: Icon;
  color: string;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  กาแฟ: { icon: Coffee, color: "#ff90b1" },
  AI: { icon: Robot, color: "#62c5ee" },
  Shopping: { icon: ShoppingBag, color: "#edbb00" },
  อื่นๆ: { icon: DotsThreeCircle, color: "#a9a4a3" },
  เงินเดือน: { icon: Briefcase, color: "#62c5ee" },
  อาหาร: { icon: ForkKnife, color: "#ff458e" },
  Youtube: { icon: YoutubeLogo, color: "#ff458e" },
  น้ำมันรถ: { icon: GasPump, color: "#62c5ee" },
  ธุรกิจส่วนตัว: { icon: Storefront, color: "#62c5ee" },
  งานพิเศษ: { icon: SuitcaseSimple, color: "#62c5ee" },
};

export const FALLBACK_CATEGORY = "อื่นๆ";

export function categoryMeta(key: string): CategoryMeta {
  return CATEGORIES[key] ?? CATEGORIES[FALLBACK_CATEGORY];
}

export const EXPENSE_CATEGORIES = ["กาแฟ", "อาหาร", "Shopping", "AI", "น้ำมันรถ", "Youtube", "อื่นๆ"];
export const INCOME_CATEGORIES = ["เงินเดือน", "ธุรกิจส่วนตัว", "งานพิเศษ", "อื่นๆ"];
export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

export const BANKS = ["ทั้งหมด", "กสิกร", "ไทยพาณิชย์", "กรุงเทพ"];

export const NAV_ITEMS = [
  { path: "/", icon: House, label: "สรุป" },
  { path: "/dashboard", icon: ChartBar, label: "วิเคราะห์" },
  { path: "/budget", icon: ChartPieSlice, label: "หมวด/งบ" },
  { path: "/list", icon: ListBullets, label: "รายการ" },
  { path: "/settings", icon: GearSix, label: "ตั้งค่า" },
];
