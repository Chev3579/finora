import { SEED_BUDGETS, SEED_TAGS } from "../data/seed";
import type { CategoryBudget, Lang, PlanKey, Theme, Transaction } from "../types";
import type { HydratePayload } from "../context/store";
import { supabase } from "./supabase";

interface TransactionRow {
  id: string;
  date: string;
  time: string;
  name: string;
  category: string;
  type: string;
  amount: number | string;
  bank: string;
  note: string | null;
}

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    name: row.name,
    category: row.category,
    type: row.type === "income" ? "income" : "expense",
    amount: Number(row.amount),
    bank: row.bank,
    note: row.note ?? undefined,
  };
}

export async function loadAll(userId: string): Promise<HydratePayload> {
  const [profile, transactions, budgets, tags] = await Promise.all([
    supabase.from("profiles").select("theme, lang, plan, onboarded").eq("id", userId).maybeSingle(),
    supabase
      .from("transactions")
      .select("id, date, time, name, category, type, amount, bank, note")
      .order("date", { ascending: false })
      .order("time", { ascending: false }),
    supabase.from("budgets").select("category, cap"),
    supabase.from("tags").select("name"),
  ]);

  const failed = [profile, transactions, budgets, tags].find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  return {
    theme: (profile.data?.theme as Theme) ?? "dark",
    lang: (profile.data?.lang as Lang) ?? "TH",
    plan: (profile.data?.plan as PlanKey) ?? "free",
    onboarded: profile.data?.onboarded ?? false,
    transactions: (transactions.data ?? []).map(toTransaction),
    budgets: (budgets.data ?? []).map((b) => ({ category: b.category, cap: Number(b.cap) }) as CategoryBudget),
    tags: (tags.data ?? []).map((t) => t.name as string),
  };
}

export async function insertTransaction(userId: string, tx: Omit<Transaction, "id">): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...tx, note: tx.note ?? null, user_id: userId })
    .select("id, date, time, name, category, type, amount, bank, note")
    .single();

  if (error) throw new Error(error.message);
  return toTransaction(data);
}

export async function updateProfile(
  userId: string,
  patch: Partial<{ theme: Theme; lang: Lang; plan: PlanKey; onboarded: boolean }>,
): Promise<void> {
  const { error } = await supabase.from("profiles").upsert({ id: userId, ...patch });
  if (error) throw new Error(error.message);
}

export async function insertTag(userId: string, name: string): Promise<void> {
  const { error } = await supabase.from("tags").insert({ user_id: userId, name });
  if (error) throw new Error(error.message);
}

export async function deleteTag(userId: string, name: string): Promise<void> {
  const { error } = await supabase.from("tags").delete().eq("user_id", userId).eq("name", name);
  if (error) throw new Error(error.message);
}

// A fresh account has no budgets or tags, which leaves the Budget screen blank
// with nothing to act on. Transactions stay empty — those are the user's real data.
export async function seedDefaults(userId: string): Promise<void> {
  await Promise.all([
    supabase.from("budgets").insert(SEED_BUDGETS.map((b) => ({ ...b, user_id: userId }))),
    supabase.from("tags").insert(SEED_TAGS.map((name) => ({ name, user_id: userId }))),
  ]);
}
