import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Transaction } from "../types";
import { AppContext, type AppContextValue, loadState, reducer, STORAGE_KEY } from "./store";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.body.dataset.theme = state.theme;
  }, [state.theme]);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    dispatch({ type: "addTransaction", transaction: { ...tx, id: crypto.randomUUID() } });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      toggleTheme: () => dispatch({ type: "setTheme", theme: state.theme === "dark" ? "light" : "dark" }),
      setLang: (lang) => dispatch({ type: "setLang", lang }),
      setPlan: (plan) => dispatch({ type: "setPlan", plan }),
      finishOnboarding: () => dispatch({ type: "setOnboarded", onboarded: true }),
      addTransaction,
      addTag: (tag) => dispatch({ type: "addTag", tag }),
      removeTag: (tag) => dispatch({ type: "removeTag", tag }),
    }),
    [state, addTransaction],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
