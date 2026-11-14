import assert from "node:assert/strict";
import { getWorkout, getWorkouts, WorkoutFetchError } from "../src/lib/workouts.ts";

const realFetch = globalThis.fetch;
const calls = [];

try {
  globalThis.fetch = (input, options) => {
    const url = String(input);
    calls.push(url);
    if (url.startsWith("https://api.abcz.workers.dev")) throw new Error("Simulated primary outage");
    return realFetch(input, options);
  };
  const workouts = await getWorkouts();
  assert.equal(workouts.length, 12);
  assert.equal(workouts.find((item) => item.id === 11)?.name, "Russian Twist");
  assert.equal((await getWorkout(2)).name, "Pull-Up");
  assert(calls.some((url) => url.startsWith("https://api.api-store.workers.dev")), "alternate API used");

  globalThis.fetch = () => { throw new Error("Simulated total outage"); };
  await assert.rejects(getWorkouts(), (error) => error instanceof WorkoutFetchError && !error.missing);
  await assert.rejects(getWorkout(-1), (error) => error instanceof WorkoutFetchError && error.missing);
  console.log("PASS: alternative API handles primary outage; both-service error and invalid ID are distinct.");
} finally {
  globalThis.fetch = realFetch;
}
