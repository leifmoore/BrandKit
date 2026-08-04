import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { chromium } from "playwright";
import { build } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const repository = join(root, "..");
const temporary = await mkdtemp(join(tmpdir(), "scudamores-pattern-interactions-"));
const sourceDirectory = join(temporary, "src");
const dist = join(temporary, "dist");

await mkdir(sourceDirectory, { recursive: true });
await writeFile(
  join(temporary, "index.html"),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Scudamore’s pattern interaction validation</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
);
await writeFile(join(sourceDirectory, "main.tsx"), `
import React from "react";
import { createRoot } from "react-dom/client";
import "@scudamores/patterns/react/styles/index.css";
import { patternPreviewRegistry } from "@scudamores/patterns/react/preview-registry";

const preferredScenarios: Record<string, string> = {
  "mobile-bottom-navigation": "with-overflow",
};

function App() {
  return <main className="min-h-screen bg-background p-6 text-foreground">
    {Object.entries(patternPreviewRegistry).map(([id, registration]) => {
      const preferred = preferredScenarios[id];
      const scenario = (preferred ? registration.scenarios[preferred] : undefined)
        ?? Object.values(registration.scenarios)[0];
      const Component = registration.Component;
      return <section key={id} data-pattern-preview={id} className="mx-auto mb-8 max-w-5xl">
        <h1 className="sr-only">{id}</h1>
        <Component {...(scenario.fixture as any)} />
      </section>;
    })}
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
`);

await build({
  root: temporary,
  configFile: false,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@scudamores/ui": join(repository, "_comp-lib/react"),
      "@scudamores/patterns": root,
      "react-dom": join(root, "validation/node_modules/react-dom"),
      "react": join(root, "validation/node_modules/react"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: { outDir: dist, emptyOutDir: true },
  logLevel: "warn",
});

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const consoleErrors = [];
const pageErrors = [];
const checks = [];
let browser;
let context;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function record(name, pattern, callback) {
  try {
    await callback();
    checks.push({ name, pattern, status: "passed" });
  } catch (error) {
    checks.push({ name, pattern, status: "failed", message: error instanceof Error ? error.message : String(error) });
  }
}

try {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.route("http://pattern-validation.test/**", async (route) => {
    try {
      const url = new URL(route.request().url());
      const requested = url.pathname === "/" ? "/index.html" : url.pathname;
      const path = join(dist, requested);
      await route.fulfill({
        status: 200,
        contentType: contentTypes[extname(path)] ?? "application/octet-stream",
        body: await readFile(path),
      });
    } catch {
      await route.fulfill({ status: 404, body: "Not found" });
    }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("http://pattern-validation.test/", { waitUntil: "networkidle" });

  const mountedPatterns = await page.locator("[data-pattern-preview]").count();
  assert(mountedPatterns === 25, `Expected 25 mounted previews; found ${mountedPatterns}`);

  const isolate = async (id) => {
    await page.locator("[data-pattern-preview]").evaluateAll((elements, currentId) => {
      for (const element of elements) {
        element.toggleAttribute("hidden", element.getAttribute("data-pattern-preview") !== currentId);
      }
    }, id);
  };

  await record("progress indicator returns to the prior step", "booking-progress-indicator", async () => {
    await isolate("booking-progress-indicator");
    const section = page.locator('[data-pattern-preview="booking-progress-indicator"]');
    await section.getByRole("button", { name: "Go back one step" }).click();
    const current = section.locator('[aria-current="step"]');
    assert(await current.getAttribute("aria-label") === "Select Products, current", "The first booking step did not become current.");
    assert(await section.getByRole("button", { name: "Go back one step" }).count() === 0, "The back control remained at the first step.");
  });

  await record("EPOS journey advances and returns without losing progress semantics", "epos-booking-journey", async () => {
    await isolate("epos-booking-journey");
    const section = page.locator('[data-pattern-preview="epos-booking-journey"]');
    await section.getByRole("button", { name: "Find availability" }).click();
    assert(
      await section.locator('[aria-current="step"]').getAttribute("aria-label") === "Choose a time, current",
      "The EPOS journey did not advance to availability.",
    );
    await section.getByRole("button", { name: "Back", exact: true }).click();
    assert(
      await section.locator('[aria-current="step"]').getAttribute("aria-label") === "Booking criteria, current",
      "The EPOS journey did not return to booking criteria.",
    );
  });

  await record("mobile More sheet closes on Escape and restores trigger focus", "mobile-bottom-navigation", async () => {
    await isolate("mobile-bottom-navigation");
    const section = page.locator('[data-pattern-preview="mobile-bottom-navigation"]');
    // Radix correctly hides the background navigation from the accessibility
    // tree while the modal Sheet is open, so keep a DOM-stable trigger locator
    // for the post-open state assertions.
    const trigger = section.locator('[data-slot="sheet-trigger"]');
    assert((await trigger.textContent())?.trim() === "More", "The More trigger is not labelled as expected.");
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "More" });
    await dialog.waitFor({ state: "visible" });
    assert(await trigger.getAttribute("aria-expanded") === "true", "The More trigger did not expose its open state.");
    assert(await dialog.evaluate((element) => element.contains(document.activeElement)), "Focus did not move into the More sheet.");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert(await trigger.getAttribute("aria-expanded") === "false", "The More trigger did not expose its closed state.");
    assert(await trigger.evaluate((element) => element === document.activeElement), "Focus did not return to the More trigger.");
  });

  await record("configuration workbench selects the requested tab and panel", "configuration-workbench", async () => {
    await isolate("configuration-workbench");
    const section = page.locator('[data-pattern-preview="configuration-workbench"]');
    const trigger = section.getByRole("tab", { name: "Preview", exact: true });
    await trigger.click();
    assert(await trigger.getAttribute("aria-selected") === "true", "The Preview tab was not selected.");
    assert(await section.locator('[role="tabpanel"]:visible').count() === 1, "The workbench did not expose one active panel.");
  });

  await record("report workspace selects a report view and its panel", "report-workspace-tabs", async () => {
    await isolate("report-workspace-tabs");
    const section = page.locator('[data-pattern-preview="report-workspace-tabs"]');
    const trigger = section.getByRole("tab", { name: "Transactions", exact: true });
    await trigger.click();
    assert(await trigger.getAttribute("aria-selected") === "true", "The Transactions tab was not selected.");
    await section.getByRole("region", { name: "Transactions preview" }).waitFor({ state: "visible" });
  });

  await record("discount dialog closes on Escape and restores trigger focus", "discount-builder", async () => {
    await isolate("discount-builder");
    const section = page.locator('[data-pattern-preview="discount-builder"]');
    const trigger = section.getByRole("button", { name: "Amend price" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Apply discount" });
    await dialog.waitFor({ state: "visible" });
    assert(await dialog.evaluate((element) => element.contains(document.activeElement)), "Focus did not move into the discount dialog.");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert(await trigger.evaluate((element) => element === document.activeElement), "Focus did not return to the discount trigger.");
  });

  await record("multi-query selection updates pressed state and arrow-key focus", "multi-query-manager", async () => {
    await isolate("multi-query-manager");
    const section = page.locator('[data-pattern-preview="multi-query-manager"]');
    const first = section.getByRole("button", { name: "3 people · Aug 15, 2026" });
    const second = section.getByRole("button", { name: "2 people · Aug 16, 2026" });
    await first.click();
    assert(await first.getAttribute("aria-pressed") === "true", "Clicking the first query did not select it.");
    assert(await second.getAttribute("aria-pressed") === "false", "The prior query remained selected.");
    await first.press("ArrowRight");
    assert(await second.getAttribute("aria-pressed") === "true", "ArrowRight did not select the next query.");
    assert(await second.evaluate((element) => element === document.activeElement), "ArrowRight did not move focus to the next query.");
  });

  const failedChecks = checks.filter((check) => check.status === "failed");
  const status = failedChecks.length || consoleErrors.length || pageErrors.length ? "failed" : "passed";
  await mkdir(join(root, "validation/reports"), { recursive: true });
  await writeFile(join(root, "validation/reports/interactions.json"), `${JSON.stringify({
    schemaVersion: "1.0.0",
    generatedAt: "2026-08-04",
    framework: "react",
    status,
    mountedPatterns,
    checks,
    consoleErrors,
    pageErrors,
  }, null, 2)}\n`);

  if (status === "failed") {
    const messages = [
      ...failedChecks.map((check) => `${check.name}: ${check.message}`),
      ...consoleErrors.map((message) => `console: ${message}`),
      ...pageErrors.map((message) => `page: ${message}`),
    ];
    throw new Error(`Interaction validation failed: ${messages.join(" | ")}`);
  }
  console.log(`Interaction validation passed: ${checks.length} targeted checks across ${mountedPatterns} mounted previews.`);
} finally {
  await context?.close();
  await browser?.close();
  await rm(temporary, { recursive: true, force: true });
}
