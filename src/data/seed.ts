import type { CategoryBudget, Transaction } from "../types";

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: "t1", date: "2026-09-07", time: "16:49", name: "Grab", category: "อื่นๆ", type: "income", amount: 1000, bank: "กสิกร" },
  {
    id: "t2",
    date: "2026-09-05",
    time: "17:04",
    name: "วิตามินบำรุงสายตา, เม็ดฟู่",
    category: "Shopping",
    type: "expense",
    amount: 696.96,
    bank: "ไทยพาณิชย์",
  },
  { id: "t3", date: "2026-09-03", time: "12:11", name: "Gemini", category: "AI", type: "expense", amount: 279, bank: "กรุงเทพ" },
  { id: "t4", date: "2026-09-03", time: "09:14", name: "ชาเขียวพรีเมี่ยม", category: "กาแฟ", type: "expense", amount: 65, bank: "กสิกร" },
  { id: "t5", date: "2026-09-02", time: "16:02", name: "ชาเขียว Starbucks", category: "กาแฟ", type: "expense", amount: 150, bank: "กสิกร" },
  { id: "t6", date: "2026-09-01", time: "00:00", name: "เงินเดือน 1/2", category: "เงินเดือน", type: "income", amount: 2000, bank: "ไทยพาณิชย์" },
];

export const SEED_BUDGETS: CategoryBudget[] = [
  { category: "อาหาร", cap: 4000 },
  { category: "กาแฟ", cap: 1200 },
  { category: "Shopping", cap: 3000 },
  { category: "AI", cap: 1000 },
  { category: "น้ำมันรถ", cap: 2500 },
  { category: "อื่นๆ", cap: 1500 },
];

export const SEED_TAGS = ["#กาแฟเช้า", "#ทำงาน", "#ของขวัญ", "#สุขภาพ", "#เดินทาง"];
