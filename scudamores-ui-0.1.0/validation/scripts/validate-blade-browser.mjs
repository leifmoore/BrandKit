import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = join(root, "validation/tmp/blade");
const baselineDir = join(root, "validation/baselines/blade");
const reportPath = join(root, "validation/reports/blade-browser.json");
const port = 4191;
const baseUrl = `http://127.0.0.1:${port}`;
await mkdir(baselineDir, { recursive: true });

const php = spawn("php", ["-S", `127.0.0.1:${port}`, "-t", "public"], { cwd: fixture, env: { ...process.env, XDEBUG_MODE: "off" }, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
php.stdout.on("data", (chunk) => { serverLog += chunk; });
php.stderr.on("data", (chunk) => { serverLog += chunk; });

for (let attempt = 0; attempt < 50; attempt += 1) {
  try { const response = await fetch(baseUrl); if (response.ok) break; } catch {}
  if (attempt === 49) throw new Error(`Laravel fixture did not start. ${serverLog}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
}

const browser = await chromium.launch({ headless: true });
const consoleErrors = [];
const pageErrors = [];
const interactions = [];
const captures = [];
const axeViolations = [];
const axeTimeouts = [];
let validationPage = null;
const record = async (name, action) => {
  process.stdout.write(`Interaction: ${name} ... `);
  try {
    await validationPage.reload({ waitUntil: "networkidle" });
    await action();
    interactions.push({ name, passed: true });
    console.log("passed");
  } catch (error) {
    interactions.push({ name, passed: false, error: error.message });
    console.log(`failed (${error.message})`);
  }
};

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  validationPage = page;
  page.setDefaultTimeout(5000);
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  if (await page.locator("[data-example]").count() !== 39) throw new Error("Blade fixture did not render all 39 examples");

  await record("Accordion opens and closes", async () => {
    const trigger = page.locator('[data-example="accordion"]').getByRole("button").first();
    const initial = await trigger.getAttribute("aria-expanded");
    await trigger.click(); if (await trigger.getAttribute("aria-expanded") === initial) throw new Error("Accordion state did not change");
    await trigger.click(); if (await trigger.getAttribute("aria-expanded") !== initial) throw new Error("Accordion did not return to its initial state");
  });
  await record("Alert Dialog closes with Escape and returns focus", async () => {
    const trigger = page.locator('[data-example="alert-dialog"]').getByRole("button", { name: "Delete project" });
    await trigger.click(); await page.getByRole("alertdialog").waitFor(); await page.keyboard.press("Escape"); await page.getByRole("alertdialog").waitFor({ state: "hidden" });
    if (!await trigger.evaluate((element) => element === document.activeElement)) throw new Error("Focus did not return");
  });
  await record("Checkbox changes native checked state", async () => {
    const control = page.locator('[data-example="checkbox"]').getByRole("checkbox"); const before = await control.isChecked(); await control.click(); if (await control.isChecked() === before) throw new Error("Checkbox did not change");
  });
  await record("Collapsible toggles content", async () => {
    const section = page.locator('[data-example="collapsible"]'); const trigger = section.getByRole("button", { name: "Show details" }); await trigger.click(); await section.getByText("Additional details are revealed here.").waitFor();
  });
  await record("Dialog closes with Escape and returns focus", async () => {
    const trigger = page.locator('[data-example="dialog"]').getByRole("button", { name: "Edit profile" });
    await trigger.click(); await page.getByRole("dialog", { name: "Edit profile" }).waitFor(); await page.keyboard.press("Escape"); await page.getByRole("dialog", { name: "Edit profile" }).waitFor({ state: "hidden" });
    await page.waitForFunction(() => document.activeElement?.matches('[data-example="dialog"] [data-slot="dialog-trigger"]'));
  });
  await record("Dropdown Menu opens and closes with Escape", async () => {
    const section = page.locator('[data-example="dropdown-menu"]'); await section.getByRole("button", { name: "Open menu" }).click(); await page.getByRole("menu").waitFor(); await page.keyboard.press("Escape"); await page.getByRole("menu").waitFor({ state: "hidden" });
  });
  await record("Input OTP accepts sequential input", async () => {
    const fields = page.locator('[data-example="input-otp"] input[data-slot="input-otp-slot"]'); await fields.first().fill("1"); if (await fields.nth(1).evaluate((element) => element !== document.activeElement)) throw new Error("OTP focus did not advance");
  });
  await record("Popover opens and closes with Escape", async () => {
    const section = page.locator('[data-example="popover"]'); await section.getByRole("button", { name: "Open popover" }).click(); await section.getByText("Dimensions").waitFor(); await page.keyboard.press("Escape");
    await section.getByText("Dimensions").waitFor({ state: "hidden" });
  });
  await record("Native Select submits selected value", async () => {
    const control = page.locator('[data-example="select"]').getByRole("combobox"); await control.selectOption("norwich"); if (await control.inputValue() !== "norwich") throw new Error("Select value did not change");
  });
  await record("Sheet closes with Escape and returns focus", async () => {
    const trigger = page.locator('[data-example="sheet"]').getByRole("button", { name: "Open menu" }); await trigger.click(); await page.getByRole("dialog", { name: "Navigation" }).waitFor(); await page.keyboard.press("Escape"); await page.getByRole("dialog", { name: "Navigation" }).waitFor({ state: "hidden" }); await page.waitForFunction(() => document.activeElement?.matches('[data-example="sheet"] [data-slot="sheet-trigger"]'));
  });
  await record("Stepper enforces its lower bound", async () => {
    const section = page.locator('[data-example="stepper"]');
    const decrement = section.getByRole("button", { name: /decrease/i });
    for (let attempt = 0; attempt < 10 && await decrement.isEnabled(); attempt += 1) await decrement.click();
    if (await decrement.isEnabled()) throw new Error(`Stepper decrement never disabled at its lower bound (value=${await section.locator('input[type="hidden"]').inputValue()}, disabled=${await decrement.getAttribute("disabled")}, binding=${await decrement.getAttribute("x-bind:disabled")})`);
    if (await section.locator('input[type="hidden"]').inputValue() !== "1") throw new Error("Stepper minimum was not enforced");
  });
  await record("Switch changes checked state", async () => {
    const section = page.locator('[data-example="switch"]'); const control = section.getByRole("switch"); const before = await control.isChecked(); await section.locator("label").click(); if (await control.isChecked() === before) throw new Error("Switch did not change");
  });
  await record("Tabs change active panel", async () => {
    const section = page.locator('[data-example="tabs"]'); await section.getByRole("tab", { name: "Security" }).click(); if (await section.getByRole("tab", { name: "Security" }).getAttribute("aria-selected") !== "true") throw new Error("Tab did not change");
  });
  await record("Toggle changes pressed state", async () => {
    const control = page.locator('[data-example="toggle"] [data-slot="toggle"]'); const before = await control.getAttribute("aria-pressed"); await control.click(); if (await control.getAttribute("aria-pressed") === before) throw new Error("Toggle did not change");
  });
  await record("Tooltip is available on keyboard focus", async () => {
    const trigger = page.locator('[data-example="tooltip"] [data-slot="tooltip-trigger"]'); await trigger.focus(); await page.getByRole("tooltip").waitFor();
  });

  await page.reload({ waitUntil: "networkidle" });
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate(({ theme }) => { document.documentElement.className = theme === "dark" ? "dark brand-default" : "brand-default"; document.documentElement.dir = "ltr"; }, { theme });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) pageErrors.push(`${width}px ${theme}: horizontal overflow of ${overflow}px`);
      const filename = `${width}-${theme}.png`; await page.screenshot({ path: join(baselineDir, filename), fullPage: true, animations: "disabled" }); captures.push({ viewport: width, theme, brand: "default", direction: "ltr", path: `validation/baselines/blade/${filename}` });
    }
  }
  await page.setViewportSize({ width: 768, height: 900 }); await page.evaluate(() => { document.documentElement.className = "brand-default"; document.documentElement.dir = "rtl"; }); await page.screenshot({ path: join(baselineDir, "768-light-rtl.png"), fullPage: true, animations: "disabled" }); captures.push({ viewport: 768, theme: "light", brand: "default", direction: "rtl", path: "validation/baselines/blade/768-light-rtl.png" });
  await page.evaluate(() => { document.documentElement.className = "brand-default"; document.documentElement.dir = "ltr"; });

  for (const id of await page.locator("[data-example]").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-example")))) {
    process.stdout.write(`Accessibility: ${id} ... `);
    try {
      const result = await Promise.race([new AxeBuilder({ page }).include(`[data-example="${id}"]`).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze(), new Promise((_, reject) => setTimeout(() => reject(new Error("axe audit timed out after 10 seconds")), 10000))]);
      for (const violation of result.violations) axeViolations.push({ component: id, ...violation });
      console.log(`${result.violations.length} finding(s)`);
    } catch (error) {
      axeTimeouts.push({ component: id, error: error.message });
      console.log(`failed (${error.message})`);
    }
  }
} finally {
  await browser.close();
  php.kill("SIGTERM");
}

const violations = axeViolations.map((violation) => ({ component: violation.component, id: violation.id, impact: violation.impact, description: violation.description, help: violation.help, helpUrl: violation.helpUrl, nodes: violation.nodes.map((node) => ({ target: node.target, failureSummary: node.failureSummary, html: node.html.slice(0, 400) })) }));
const failedInteractions = interactions.filter((interaction) => !interaction.passed);
const status = failedInteractions.length || consoleErrors.length || pageErrors.length || axeTimeouts.length ? "failed" : violations.length ? "passed-with-findings" : "passed";
const report = { schemaVersion: "1.0.0", generatedAt: "2026-07-28", framework: "blade", environment: { framework: "Laravel 12.64.0", php: "8.4.15", browser: "Chromium", font: "Instrument Sans 400/500/600", url: baseUrl }, status, renderedExamples: 39, interactions, captures, accessibility: { standard: "WCAG 2.2 AA", engine: "axe-core 4.11.0", status: axeTimeouts.length ? "failed" : violations.length ? "passed-with-findings" : "passed", auditedExamples: 39 - axeTimeouts.length, violations, timeouts: axeTimeouts }, consoleErrors, pageErrors };
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Blade browser validation: ${status}; ${interactions.length - failedInteractions.length}/${interactions.length} interactions passed; ${violations.length} axe rule violation(s).`);
if (status === "failed") process.exit(1);
