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
  readonly missing: boolean;
  constructor(missing = false) {
    super(missing ? "Workout not found" : "Unable to load workouts");
    this.missing = missing;
  }
}

async function request<T>(path: string, validate: (value: unknown) => value is T): Promise<T> {
  let missing = true;
  for (const source of SOURCES) {
    try {
      const response = await fetch(source + path, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (response.status !== 404) missing = false;
      if (!response.ok) continue;
      const result: unknown = await response.json();
      if (validate(result)) return result;
    } catch {
      missing = false;
    }
  }
  throw new WorkoutFetchError(missing);
}

export async function getWorkouts(): Promise<Workout[]> {
  const result = await request("", (value): value is Workout[] | { value: Workout[] } => {
    const list = Array.isArray(value) ? value : (value as { value?: unknown } | null)?.value;
    return Array.isArray(list) && list.every(isWorkout);
  });
  return Array.isArray(result) ? result : result.value;
}

export async function getWorkout(id: number): Promise<Workout> {
  if (!Number.isSafeInteger(id) || id < 1) throw new WorkoutFetchError(true);
  return request(`/${id}`, (value): value is Workout => isWorkout(value) && value.id === id);
}
