"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type PlanContextValue = {
  planIds: number[];
  savedIds: number[];
  doneIds: number[];
  hydrated: boolean;
  addToPlan: (id: number) => "added" | "already" | "full";
  saveForLater: (id: number) => "saved" | "already";
  removeFromPlan: (id: number) => void;
  removeSaved: (id: number) => void;
  markDone: (id: number) => void;
};

const STORAGE_KEY = "fitlog-plan-v1";
const PlanContext = createContext<PlanContextValue | null>(null);

function cleanIds(value: unknown): number[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is number => Number.isSafeInteger(id) && id > 0))] : [];
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        setPlanIds(cleanIds(stored.planIds).slice(0, 5));
        setSavedIds(cleanIds(stored.savedIds));
        setDoneIds(cleanIds(stored.doneIds));
      } catch {
        // A corrupt or unavailable local store starts with an empty plan.
      }
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ planIds, savedIds, doneIds })); } catch { /* Storage may be disabled. */ }
  }, [hydrated, planIds, savedIds, doneIds]);

  const addToPlan = useCallback((id: number) => {
    if (planIds.includes(id)) return "already" as const;
    if (planIds.length >= 5) return "full" as const;
    setPlanIds((current) => [...current, id]);
    return "added" as const;
  }, [planIds]);

  const saveForLater = useCallback((id: number) => {
    if (savedIds.includes(id)) return "already" as const;
    setSavedIds((current) => [...current, id]);
    return "saved" as const;
  }, [savedIds]);

  const removeFromPlan = useCallback((id: number) => setPlanIds((current) => current.filter((item) => item !== id)), []);
  const removeSaved = useCallback((id: number) => setSavedIds((current) => current.filter((item) => item !== id)), []);
  const markDone = useCallback((id: number) => {
    setDoneIds((current) => current.includes(id) ? current : [...current, id]);
    setPlanIds((current) => current.filter((item) => item !== id));
  }, []);

  const value = useMemo(() => ({ planIds, savedIds, doneIds, hydrated, addToPlan, saveForLater, removeFromPlan, removeSaved, markDone }),
    [planIds, savedIds, doneIds, hydrated, addToPlan, saveForLater, removeFromPlan, removeSaved, markDone]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside PlanProvider");
  return context;
}
