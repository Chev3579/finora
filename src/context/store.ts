import { createContext } from "react";
import type { CategoryBudget, Lang, PlanKey, Theme, Transaction } from "../types";

export interface AppState {
  theme: Theme;
  lang: Lang;
  plan: PlanKey;
  onboarded: boolean;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  tags: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: AppState = {
  theme: "dark",
  lang: "TH",
  plan: "free",
  onboarded: false,
  transactions: [],
  budgets: [],
  tags: [],
  loading: true,
  error: null,
};

export interface HydratePayload {
  theme: Theme;
  lang: Lang;
  plan: PlanKey;
  onboarded: boolean;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  tags: string[];
}

export type Action =
  | { type: "hydrate"; data: HydratePayload }
  | { type: "loading" }
  | { type: "error"; message: string | null }
  | { type: "reset" }
  | { type: "setTheme"; theme: Theme }
  | { type: "setLang"; lang: Lang }
  | { type: "setPlan"; plan: PlanKey }
  | { type: "setOnboarded"; onboarded: boolean }
  | { type: "addTransaction"; transaction: Transaction }
  | { type: "addTag"; tag: string }
  | { type: "removeTag"; tag: string };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.data, loading: false, error: null };
    case "loading":
      return { ...state, loading: true };
    case "error":
      return { ...state, error: action.message, loading: false };
    case "reset":
      return { ...initialState, loading: false };
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

export interface AppContextValue extends AppState {
  authenticated: boolean;
  email: string | null;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  setPlan: (plan: PlanKey) => void;
  finishOnboarding: () => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  signOut: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
