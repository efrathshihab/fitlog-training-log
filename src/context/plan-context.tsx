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

function persist(planIds: number[], savedIds: number[], doneIds: number[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ planIds, savedIds, doneIds })); } catch { /* Storage may be disabled. */ }
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
    persist(planIds, savedIds, doneIds);
  }, [hydrated, planIds, savedIds, doneIds]);

  const addToPlan = useCallback((id: number) => {
    if (planIds.includes(id)) return "already" as const;
    if (planIds.length >= 5) return "full" as const;
    const next = [...planIds, id];
    setPlanIds(next);
    persist(next, savedIds, doneIds);
    return "added" as const;
  }, [planIds, savedIds, doneIds]);

  const saveForLater = useCallback((id: number) => {
    if (savedIds.includes(id)) return "already" as const;
    const next = [...savedIds, id];
    setSavedIds(next);
    persist(planIds, next, doneIds);
    return "saved" as const;
  }, [planIds, savedIds, doneIds]);

  const removeFromPlan = useCallback((id: number) => { const next = planIds.filter((item) => item !== id); setPlanIds(next); persist(next, savedIds, doneIds); }, [planIds, savedIds, doneIds]);
  const removeSaved = useCallback((id: number) => { const next = savedIds.filter((item) => item !== id); setSavedIds(next); persist(planIds, next, doneIds); }, [planIds, savedIds, doneIds]);
  const markDone = useCallback((id: number) => {
    const nextDone = doneIds.includes(id) ? doneIds : [...doneIds, id];
    const nextPlan = planIds.filter((item) => item !== id);
    setDoneIds(nextDone);
    setPlanIds(nextPlan);
    persist(nextPlan, savedIds, nextDone);
  }, [planIds, savedIds, doneIds]);

  const value = useMemo(() => ({ planIds, savedIds, doneIds, hydrated, addToPlan, saveForLater, removeFromPlan, removeSaved, markDone }),
    [planIds, savedIds, doneIds, hydrated, addToPlan, saveForLater, removeFromPlan, removeSaved, markDone]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside PlanProvider");
  return context;
}
