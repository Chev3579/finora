import { createContext } from "react";
import { SEED_BUDGETS, SEED_TAGS, SEED_TRANSACTIONS } from "../data/seed";
import type { CategoryBudget, Lang, PlanKey, Theme, Transaction } from "../types";

export const STORAGE_KEY = "finora.state.v1";

export interface AppState {
  theme: Theme;
  lang: Lang;
  plan: PlanKey;
  onboarded: boolean;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  tags: string[];
}

export const initialState: AppState = {
  theme: "dark",
  lang: "TH",
  plan: "gold",
  onboarded: false,
  transactions: SEED_TRANSACTIONS,
  budgets: SEED_BUDGETS,
  tags: SEED_TAGS,
};

export type Action =
  | { type: "setTheme"; theme: Theme }
  | { type: "setLang"; lang: Lang }
  | { type: "setPlan"; plan: PlanKey }
  | { type: "setOnboarded"; onboarded: boolean }
  | { type: "addTransaction"; transaction: Transaction }
  | { type: "addTag"; tag: string }
  | { type: "removeTag"; tag: string };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "setTheme":
      return { ...state, theme: action.theme };
    case "setLang":
      return { ...state, lang: action.lang };
    case "setPlan":
      return { ...state, plan: action.plan };
    case "setOnboarded":
      return { ...state, onboarded: action.onboarded };
    case "addTransaction":
      return { ...state, transactions: [action.transaction, ...state.transactions] };
    case "addTag":
      return state.tags.includes(action.tag) ? state : { ...state, tags: [...state.tags, action.tag] };
    case "removeTag":
      return { ...state, tags: state.tags.filter((t) => t !== action.tag) };
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    return initialState;
  }
}

export interface AppContextValue extends AppState {
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  setPlan: (plan: PlanKey) => void;
  finishOnboarding: () => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
