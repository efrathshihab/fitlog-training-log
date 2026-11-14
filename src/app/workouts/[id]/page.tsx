import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { WorkoutActions } from "@/components/workout-actions";
import { WorkoutFetchError, getWorkout } from "@/lib/workouts";

export const dynamic = "force-dynamic";

export default async function WorkoutDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let workout;
  try {
    workout = await getWorkout(Number(id));
  } catch (error) {
    if (error instanceof WorkoutFetchError && error.missing) notFound();
    return <section className="container-page flex min-h-[65vh] flex-col items-center justify-center text-center"><h1 className="display text-5xl">Unable to load workout</h1><p className="muted mt-4">Both workout services are unavailable. Please try again shortly.</p><a href={`/workouts/${id}`} className="mt-6 rounded-xl bg-[#ccff00] px-5 py-3 text-sm font-semibold text-black">Try again</a></section>;
  }

  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", String(workout.sets)],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", workout.rating.toFixed(1)],
  ];

  return <section className="container-page pb-16 pt-12 lg:pb-[109px]">
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="image-panel relative h-[360px] self-start rounded-2xl border border-[#232834] sm:h-[560px] lg:h-[735px]">
        <Image src={workout.image} alt={`${workout.name} exercise`} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="min-w-0">
        <h1 className="display text-4xl leading-10">{workout.name}</h1>
        <p className="mt-3 text-base leading-6 text-[#9ca3af]">{workout.description}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">{workout.muscleGroups.map((group) => <Badge variant="default" className="h-6 px-3.5 text-xs font-semibold normal-case" key={group}>{group}</Badge>)}</div>
        <div className="mt-7 overflow-hidden rounded-2xl border border-[#232834] bg-[#151922]">
          <dl className="grid h-[344px] grid-rows-7">{specs.map(([label, value]) => <div className="flex items-center justify-between gap-5 border-b border-[#1e2330] px-6 last:border-0" key={label}><dt className="text-xs font-bold uppercase leading-4 text-[#9ca3af]">{label}</dt><dd className="text-right text-sm font-medium leading-5 text-[#e5e7eb]">{value}</dd></div>)}</dl>
        </div>
        <div className="mt-8">
          <h2 className="text-base font-extrabold uppercase leading-6 text-white">Instructions</h2>
          <ol className="mt-4 space-y-3">{workout.instructions.map((instruction, index) => <li key={index} className="flex gap-2 text-sm leading-[23px] text-[#d1d5db]"><span className="shrink-0 text-[#9ca3af]">{index + 1}.</span><span>{instruction}</span></li>)}</ol>
        </div>
        <WorkoutActions workout={workout} />
      </div>
    </div>
  </section>;
}
