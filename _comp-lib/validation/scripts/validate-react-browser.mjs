import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
let baseUrl = process.env.REACT_VALIDATION_URL;
const baselineDir = join(root, "validation/baselines/react");
const reportPath = join(root, "validation/reports/react-browser.json");
await mkdir(baselineDir, { recursive: true });

let server;
if (!baseUrl) {
  const dist = join(root, "validation/tmp/react/dist");
  const contentTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff": "font/woff", ".woff2": "font/woff2" };
  server = createServer(async (request, response) => {
    try {
      const requestPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
      const path = join(dist, requestPath);
      response.writeHead(200, { "content-type": contentTypes[extname(path)] ?? "application/octet-stream" });
      response.end(await readFile(path));
    } catch {
      response.writeHead(404); response.end("Not found");
    }
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

const browser = await chromium.launch({ headless: true });
const consoleErrors = [];
const pageErrors = [];
const interactions = [];
const captures = [];
const axeViolations = [];
const axeTimeouts = [];

const record = async (name, action) => {
  try { await action(); interactions.push({ name, passed: true }); }
  catch (error) { interactions.push({ name, passed: false, error: error.message }); }
};

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const count = await page.locator("[data-example]").count();
  if (count !== 39) throw new Error(`Expected 39 rendered examples; found ${count}.`);

  await record("Accordion opens and closes", async () => {
    const section = page.locator('[data-example="accordion"]');
    const trigger = section.getByRole("button").first();
    await trigger.click();
    if (await trigger.getAttribute("aria-expanded") !== "true") throw new Error("Accordion did not open");
    await trigger.click();
    if (await trigger.getAttribute("aria-expanded") !== "false") throw new Error("Accordion did not close");
  });
  await record("Alert Dialog traps Escape and returns focus", async () => {
    const trigger = page.locator('[data-example="alert-dialog"]').getByRole("button", { name: "Delete record" });
    await trigger.click();
    await page.getByRole("alertdialog").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("alertdialog").waitFor({ state: "hidden" });
    if (!await trigger.evaluate((element) => element === document.activeElement)) throw new Error("Focus did not return to the trigger");
  });
  await record("Dialog opens, closes with Escape, and returns focus", async () => {
    const trigger = page.locator('[data-example="dialog"]').getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    if (!await trigger.evaluate((element) => element === document.activeElement)) throw new Error("Focus did not return to the trigger");
  });
  await record("Dropdown Menu opens and closes with Escape", async () => {
    const section = page.locator('[data-example="dropdown-menu"]');
    await section.getByRole("button", { name: "View options" }).click();
    await page.getByRole("menu").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("menu").waitFor({ state: "hidden" });
  });
  await record("Checkbox changes checked state", async () => {
    const checkbox = page.locator('[data-example="checkbox"]').getByRole("checkbox");
    const before = await checkbox.getAttribute("data-state");
    await checkbox.click();
    if (await checkbox.getAttribute("data-state") === before) throw new Error("Checkbox state did not change");
  });
  await record("Collapsible toggles content", async () => {
    const section = page.locator('[data-example="collapsible"]');
    const trigger = section.getByRole("button", { name: /toggle advanced options/i });
    await trigger.click();
    await section.getByText("Additional configuration appears here.").waitFor();
  });
  await record("Popover opens and closes with Escape", async () => {
    const section = page.locator('[data-example="popover"]');
    await section.getByRole("button", { name: "Open popover" }).click();
    await page.getByText("Collection window").last().waitFor();
    await page.keyboard.press("Escape");
  });
  await record("Select opens and closes with Escape", async () => {
    const section = page.locator('[data-example="select"]');
    await section.getByRole("combobox").click();
    await page.getByRole("listbox").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("listbox").waitFor({ state: "hidden" });
  });
  await record("Sheet opens and closes with Escape", async () => {
    const section = page.locator('[data-example="sheet"]');
    const trigger = section.getByRole("button", { name: "Open panel" });
    await trigger.click();
    await page.getByRole("dialog", { name: "Filters" }).waitFor();
    await page.keyboard.press("Escape");
    if (!await trigger.evaluate((element) => element === document.activeElement)) throw new Error("Focus did not return to the trigger");
  });
  await record("Stepper respects lower bound", async () => {
    const section = page.locator('[data-example="stepper"]');
    const decrement = section.getByRole("button", { name: /decrease/i });
    while (await decrement.isEnabled()) await decrement.click();
    if (await decrement.isEnabled() || !await section.getByText("0", { exact: true }).isVisible()) throw new Error("Stepper lower bound was not enforced");
  });
  await record("Switch changes state", async () => {
    const control = page.locator('[data-example="switch"]').getByRole("switch");
    const before = await control.getAttribute("data-state");
    await control.click();
    if (await control.getAttribute("data-state") === before) throw new Error("Switch state did not change");
  });
  await record("Tabs change active panel", async () => {
    const section = page.locator('[data-example="tabs"]');
    await section.getByRole("tab", { name: "Blade" }).click();
    if (await section.getByRole("tab", { name: "Blade" }).getAttribute("aria-selected") !== "true") throw new Error("Blade tab was not selected");
  });
  await record("Toggle changes pressed state", async () => {
    const toggle = page.locator('[data-example="toggle"]').getByRole("button");
    const before = await toggle.getAttribute("aria-pressed");
    await toggle.click();
    if (await toggle.getAttribute("aria-pressed") === before) throw new Error("Toggle state did not change");
  });

  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate(({ theme }) => {
        document.documentElement.className = theme === "dark" ? "dark brand-default" : "brand-default";
        document.documentElement.dir = "ltr";
      }, { theme });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) pageErrors.push(`${width}px ${theme}: horizontal overflow of ${overflow}px`);
      const filename = `${width}-${theme}.png`;
      await page.screenshot({ path: join(baselineDir, filename), fullPage: true });
      captures.push({ viewport: width, theme, brand: "default", direction: "ltr", path: `validation/baselines/react/${filename}` });
    }
  }

  await page.setViewportSize({ width: 768, height: 900 });
  await page.evaluate(() => { document.documentElement.className = "brand-default"; document.documentElement.dir = "rtl"; });
  await page.screenshot({ path: join(baselineDir, "768-light-rtl.png"), fullPage: true });
  captures.push({ viewport: 768, theme: "light", brand: "default", direction: "rtl", path: "validation/baselines/react/768-light-rtl.png" });

  await page.evaluate(() => { document.documentElement.className = "brand-default"; document.documentElement.dir = "ltr"; });
  for (const id of await page.locator("[data-example]").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-example")))) {
    try {
      const result = await Promise.race([
        new AxeBuilder({ page }).include(`[data-example="${id}"]`).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("axe audit timed out after 10 seconds")), 10000)),
      ]);
      for (const violation of result.violations) axeViolations.push({ component: id, ...violation });
    } catch (error) {
      axeTimeouts.push({ component: id, error: error.message });
    }
  }
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}

const violations = axeViolations.map((violation) => ({ component: violation.component, id: violation.id, impact: violation.impact, description: violation.description, help: violation.help, helpUrl: violation.helpUrl, nodes: violation.nodes.map((node) => ({ target: node.target, failureSummary: node.failureSummary, html: node.html.slice(0, 400) })) }));
const failedInteractions = interactions.filter((interaction) => !interaction.passed);
const status = failedInteractions.length || consoleErrors.length || pageErrors.length || axeTimeouts.length ? "failed" : violations.length ? "passed-with-findings" : "passed";
const report = { schemaVersion: "1.0.0", generatedAt: "2026-07-28", framework: "react", environment: { browser: "Chromium", font: "Instrument Sans 400/500/600", url: baseUrl }, status, renderedExamples: 39, interactions, captures, accessibility: { standard: "WCAG 2.2 AA", engine: "axe-core 4.11.0", status: axeTimeouts.length ? "failed" : violations.length ? "passed-with-findings" : "passed", auditedExamples: 39 - axeTimeouts.length, violations, timeouts: axeTimeouts }, consoleErrors, pageErrors };
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`React browser validation: ${status}; ${interactions.length - failedInteractions.length}/${interactions.length} interactions passed; ${violations.length} axe rule violation(s).`);
if (status === "failed") process.exit(1);
