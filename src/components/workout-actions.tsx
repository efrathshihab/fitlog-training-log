"use client";

import { Bookmark, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/plan-context";
import type { Workout } from "@/lib/workouts";

export function WorkoutActions({ workout }: { workout: Workout }) {
  const { planIds, savedIds, hydrated, addToPlan, saveForLater } = usePlan();
  const planned = planIds.includes(workout.id);
  const saved = savedIds.includes(workout.id);
  const full = planIds.length >= 5;

  function handlePlan() {
    const result = addToPlan(workout.id);
    if (result === "added") toast.success(`${workout.name} added to today's plan.`);
    else if (result === "full") toast.error("Today's plan is full. Finish or remove a lift first.");
    else toast.info(`${workout.name} is already in today's plan.`);
  }

  function handleSave() {
    const result = saveForLater(workout.id);
    if (result === "saved") toast.success(`${workout.name} saved for later.`);
    else toast.info(`${workout.name} is already saved.`);
  }

  return <div className="mt-8 flex flex-col gap-3 sm:flex-row">
    <Button onClick={handlePlan} disabled={!hydrated || planned || full} size="lg" className="flex-1"><Plus size={18} /> {planned ? "In today's plan" : full ? "Plan is full" : "Add to today's plan"}</Button>
    <Button onClick={handleSave} disabled={!hydrated || saved} variant="outline" size="lg" className="flex-1"><Bookmark size={18} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved for later" : "Save for later"}</Button>
  </div>;
}
