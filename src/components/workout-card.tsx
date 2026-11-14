import Image from "next/image";
import Link from "next/link";
import { Clock3, Flame, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Workout } from "@/lib/workouts";

export function WorkoutStats({ workout, compact = false }: { workout: Workout; compact?: boolean }) {
  return <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-normal text-[#d1d5db] ${compact ? "sm:gap-x-3" : ""}`}>
    <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-[#9ca3af]" />{workout.duration} min</span>
    <span className="inline-flex items-center gap-1.5"><Flame size={14} className="text-[#9ca3af]" />{workout.caloriesBurned} kcal</span>
    <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-[#9ca3af]" />{workout.rating.toFixed(1)}</span>
  </div>;
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  return <Link href={`/workouts/${workout.id}`} className="group flex h-[368px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#222630] bg-[#15171d] hover:border-[#4b5733] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2f800]" aria-label={`View ${workout.name} details`}>
    <div className="image-panel relative h-[192px] shrink-0">
      <Image src={workout.image} alt={`${workout.name} exercise`} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap gap-2">{workout.muscleGroups.map((group) => <Badge key={group} variant="default" className="h-[21px]">{group}</Badge>)}</div>
      <h3 className="font-display mt-2 text-lg font-bold uppercase leading-7">{workout.name}</h3>
      <p className="mt-1 text-xs leading-4 text-[#9ca3af]">{workout.equipment}</p>
      <div className="mt-auto border-t border-[#20242e] pt-3"><WorkoutStats workout={workout} /></div>
    </div>
  </Link>;
}
