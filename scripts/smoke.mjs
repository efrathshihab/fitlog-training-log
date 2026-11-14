import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const origin = process.env.FITLOG_URL || "http://localhost:3000";
const executablePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const failures = [];
page.on("pageerror", (error) => failures.push(error.message));

async function open(path) {
  const response = await page.goto(origin + path, { waitUntil: "domcontentloaded" });
  assert(response, `No response for ${path}`);
  return response;
}

async function cardNames() {
  return (await page.locator("article h3").allTextContents()).map((name) => name.trim());
}

async function metric(label, expected) {
  const value = page.getByText(label, { exact: true }).locator("..").locator("p").last();
  await page.waitForFunction(({ label, expected }) => {
    const heading = [...document.querySelectorAll("p")].find((element) => element.textContent?.trim() === label);
    return heading?.parentElement?.lastElementChild?.textContent?.trim() === String(expected);
  }, { label, expected });
  assert.equal((await value.textContent())?.trim(), String(expected), `${label} summary`);
}

try {
  await open("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "The Library" }).waitFor();
  await page.getByRole("link", { name: /View Kettlebell Swing details/ }).waitFor();
  assert.equal(await page.locator('a[aria-label^="View "][aria-label$=" details"]').count(), 12, "library count");
  const api = await context.request.get(origin + "/api/workouts");
  assert.equal(api.status(), 200);
  assert.equal((await api.json()).length, 12);

  await mkdir("test-artifacts", { recursive: true });
  for (const [width, columns, name] of [[390, 1, "mobile"], [768, 2, "tablet"], [1280, 3, "desktop"]]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, columns: getComputedStyle(document.querySelector("#library .grid")).gridTemplateColumns.split(" ").length }));
    assert(layout.overflow <= 1, `${name} horizontal overflow: ${layout.overflow}`);
    assert.equal(layout.columns, columns, `${name} grid columns`);
    await page.screenshot({ path: `test-artifacts/home-${name}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole("link", { name: /Browse Workouts/i }).click();
  assert.equal(new URL(page.url()).hash, "#library");

  await open("/my-plan");
  await page.getByRole("heading", { name: "Nothing here yet" }).waitFor();
  await metric("Exercises", 0);
  await open("/workouts/1");
  await page.getByRole("heading", { name: "Barbell Bench Press" }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll("main ol li").length === 4);
  assert.equal(await page.locator("ol li").count(), 4, "four instructions");
  assert.equal(await page.locator("dl dt").count(), 7, "seven specs");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Barbell Bench Press" }).waitFor();

  for (const id of [11, 2]) {
    await open(`/workouts/${id}`);
    await page.getByRole("button", { name: /Add to today's plan/i }).click();
    await page.getByText(/added to today's plan/i).waitFor();
    await page.getByRole("button", { name: /Save for later/i }).click();
    await page.getByText(/saved for later/i).last().waitFor();
  }
  await page.getByRole("link", { name: "Plan, 2 workouts" }).waitFor();
  await page.getByRole("link", { name: "Saved, 2 workouts" }).waitFor();
  await open("/my-plan");
  await page.getByRole("heading", { name: "Russian Twist" }).waitFor();
  await metric("Exercises", 2);
  await metric("Minutes", 23);
  await metric("Calories", 190);
  for (const [width, name] of [[390, "mobile"], [768, "tablet"], [1280, "desktop"]]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert(overflow <= 1, `${name} plan horizontal overflow: ${overflow}`);
    await page.screenshot({ path: `test-artifacts/plan-${name}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.deepEqual(await cardNames(), ["Russian Twist", "Pull-Up"], "default duration order");
  await page.reload({ waitUntil: "domcontentloaded" });
  await metric("Exercises", 2);
  await metric("Minutes", 23);
  await metric("Calories", 190);
  await page.getByLabel("Sort workouts by").selectOption("rating");
  assert.deepEqual(await cardNames(), ["Pull-Up", "Russian Twist"], "rating order");
  await page.getByLabel("Sort workouts by").selectOption("calories");
  assert.deepEqual(await cardNames(), ["Russian Twist", "Pull-Up"], "calorie order");
  await page.getByRole("tab", { name: /Saved/ }).click();
  assert.equal((await cardNames()).length, 2, "saved tab count");
  await page.getByRole("link", { name: "View Details" }).first().click();
  await page.getByRole("heading", { name: "Russian Twist" }).waitFor();
  await open("/my-plan?tab=saved");
  await page.getByRole("tab", { name: /Saved/ }).waitFor();
  await page.getByRole("tab", { name: /Saved/ }).click();
  await page.getByRole("button", { name: /Remove Russian Twist from saved workouts/ }).click();
  assert.equal((await cardNames()).length, 1, "saved removal");
  await page.getByRole("tab", { name: /Today's Plan/ }).click();
  await page.getByRole("button", { name: /Mark as Done/ }).first().click();
  await page.getByText(/marked as done/i).waitFor();
  await metric("Exercises", 1);
  await page.getByRole("button", { name: /Remove Pull-Up from today's plan/ }).click();
  await page.getByRole("heading", { name: "Nothing here yet" }).waitFor();
  await metric("Exercises", 0);

  for (const id of [1, 3, 4, 5, 6]) {
    await open(`/workouts/${id}`);
    await page.getByRole("button", { name: /Add to today's plan/i }).click();
  }
  await open("/workouts/7");
  assert(await page.getByRole("button", { name: "Plan is full" }).isDisabled(), "five-workout cap");
  for (const [width, name] of [[390, "mobile"], [768, "tablet"], [1280, "desktop"]]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert(overflow <= 1, `${name} details horizontal overflow: ${overflow}`);
    await page.screenshot({ path: `test-artifacts/details-${name}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  assert.equal((await open("/does-not-exist")).status(), 404, "unknown route status");
  await page.getByRole("heading", { name: "Lost your way?" }).waitFor();
  assert.equal((await open("/workouts/9999")).status(), 404, "invalid workout status");
  await page.getByRole("heading", { name: "Lost your way?" }).waitFor();
  await open("/");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: /View Kettlebell Swing details/ }).waitFor();
  await open("/my-plan");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Back Squat" }).waitFor();
  assert.deepEqual(failures, [], "uncaught browser errors");
  console.log("PASS: API, direct loads and refreshes, 12 cards, three viewport widths on all views, hero anchor, details, plan totals and persistence, saved tab, sorting, view, done, remove, empty state, five-workout cap, and 404s.");
} finally {
  await browser.close();
}
