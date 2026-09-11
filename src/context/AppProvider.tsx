import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { deleteTag, insertTag, insertTransaction, loadAll, seedDefaults, updateProfile } from "../lib/api";
import { supabase } from "../lib/supabase";
import type { Transaction } from "../types";
import { AppContext, type AppContextValue, initialState, reducer } from "./store";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  const refresh = useCallback(async () => {
    if (!userId) return;
    dispatch({ type: "hydrate", data: await loadAll(userId) });
  }, [userId]);

  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      dispatch({ type: "reset" });
      return;
    }

    let cancelled = false;
    dispatch({ type: "loading" });

    (async () => {
      let data = await loadAll(userId);
      if (!data.onboarded && data.budgets.length === 0 && data.tags.length === 0) {
        await seedDefaults(userId);
        data = await loadAll(userId);
      }
      if (!cancelled) dispatch({ type: "hydrate", data });
    })().catch((e: Error) => {
      if (!cancelled) dispatch({ type: "error", message: e.message });
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, userId]);

  useEffect(() => {
    document.body.dataset.theme = state.theme;
  }, [state.theme]);

  // Every mutation paints locally first so the UI stays responsive; a rejected
  // write reloads from the server, which discards the optimistic row.
  const write = useCallback(
    (task: Promise<unknown>) => {
      task.catch((e: Error) => {
        dispatch({ type: "error", message: e.message });
        void refresh();
      });
    },
    [refresh],
  );

  const addTransaction = useCallback(
    (tx: Omit<Transaction, "id">) => {
      if (!userId) return;
      const optimistic: Transaction = { ...tx, id: crypto.randomUUID() };
      dispatch({ type: "addTransaction", transaction: optimistic });
      write(insertTransaction(userId, tx));
    },
    [userId, write],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      authenticated: userId !== null,
      email: session?.user.email ?? null,
      toggleTheme: () => {
        const theme = state.theme === "dark" ? "light" : "dark";
        dispatch({ type: "setTheme", theme });
        if (userId) write(updateProfile(userId, { theme }));
      },
      setLang: (lang) => {
        dispatch({ type: "setLang", lang });
        if (userId) write(updateProfile(userId, { lang }));
      },
      setPlan: (plan) => {
        dispatch({ type: "setPlan", plan });
        if (userId) write(updateProfile(userId, { plan }));
      },
      finishOnboarding: () => {
        dispatch({ type: "setOnboarded", onboarded: true });
        if (userId) write(updateProfile(userId, { onboarded: true }));
      },
      addTransaction,
      addTag: (tag) => {
        if (!userId || state.tags.includes(tag)) return;
        dispatch({ type: "addTag", tag });
        write(insertTag(userId, tag));
      },
      removeTag: (tag) => {
        if (!userId) return;
        dispatch({ type: "removeTag", tag });
        write(deleteTag(userId, tag));
      },
      signOut: () => {
        void supabase.auth.signOut();
      },
    }),
    [state, session, userId, addTransaction, write],
  );

  if (!authReady) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
