export type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

const SOURCES = [
  "https://api.abcz.workers.dev/api/fitlog",
  "https://api.api-store.workers.dev/api/fitlog",
];

function isWorkout(value: unknown): value is Workout {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "number" && typeof item.name === "string" &&
    typeof item.image === "string" && Array.isArray(item.muscleGroups) &&
    typeof item.equipment === "string" && typeof item.duration === "number" &&
    typeof item.caloriesBurned === "number" && typeof item.rating === "number" &&
    typeof item.description === "string" && Array.isArray(item.instructions);
}

export class WorkoutFetchError extends Error {
  constructor(public readonly missing = false) {
    super(missing ? "Workout not found" : "Unable to load workouts");
  }
}

async function request(path = ""): Promise<unknown> {
  let missing = true;
  for (const source of SOURCES) {
    try {
      const response = await fetch(source + path, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (response.status !== 404) missing = false;
      if (!response.ok) continue;
      return await response.json();
    } catch {
      missing = false;
    }
  }
  throw new WorkoutFetchError(missing);
}

export async function getWorkouts(): Promise<Workout[]> {
  const result = await request();
  const list = (result as { value?: unknown })?.value;
  if (!Array.isArray(list) || !list.every(isWorkout)) throw new WorkoutFetchError();
  return list;
}

export async function getWorkout(id: number): Promise<Workout> {
  if (!Number.isSafeInteger(id) || id < 1) throw new WorkoutFetchError(true);
  const result = await request(`/${id}`);
  if (!isWorkout(result) || result.id !== id) throw new WorkoutFetchError(true);
  return result;
}
