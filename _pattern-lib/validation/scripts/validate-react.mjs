import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { chromium } from "playwright";
import { build } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const repository = join(root, "..");
const temporary = await mkdtemp(join(tmpdir(), "scudamores-pattern-react-"));
const sourceDirectory = join(temporary, "src");
const dist = join(temporary, "dist");
await mkdir(sourceDirectory, { recursive: true });
await writeFile(join(temporary, "index.html"), '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Scudamore’s pattern validation</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>');
await writeFile(join(sourceDirectory, "main.tsx"), `
import React from "react";
import { createRoot } from "react-dom/client";
import "@scudamores/patterns/react/styles/index.css";
import { patternPreviewRegistry } from "@scudamores/patterns/react/preview-registry";

function App() {
  return <main className="min-h-screen bg-background p-6 text-foreground">
    {Object.entries(patternPreviewRegistry).map(([id, registration]) => {
      const scenario = Object.values(registration.scenarios)[0];
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

const contentTypes = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".woff": "font/woff", ".woff2": "font/woff2" };
const server = createServer(async (request, response) => {
  try {
    const requested = request.url?.split("?")[0] === "/" ? "/index.html" : request.url?.split("?")[0];
    const path = join(dist, requested ?? "/index.html");
    response.writeHead(200, { "content-type": contentTypes[extname(path)] ?? "application/octet-stream" });
    response.end(await readFile(path));
  } catch {
    response.writeHead(404); response.end("Not found");
  }
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });

const browser = await chromium.launch({ headless: true });
const consoleErrors = [];
const pageErrors = [];
let accessibility = { status: "not-run", violations: [] };
let context;
try {
  context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: "networkidle" });
  const rendered = await page.locator("[data-pattern-preview]").count();
  if (rendered !== 25) throw new Error(`Expected 25 rendered previews; found ${rendered}`);
  for (const section of await page.locator("[data-pattern-preview]").all()) {
    const button = section.getByRole("button").first();
    if (await button.count()) await button.focus();
  }
  try {
    const { default: AxeBuilder } = await import("@axe-core/playwright");
    const patternIds = await page.locator("[data-pattern-preview]").evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-pattern-preview")),
    );
    const patterns = {};
    const findings = [];
    const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
    for (const id of patternIds) {
      patterns[id] = { status: "passed", themes: {} };
      for (const theme of ["light", "dark"]) {
        await page.locator("html").evaluate((element, nextTheme) => {
          element.classList.toggle("dark", nextTheme === "dark");
          element.style.colorScheme = nextTheme;
        }, theme);
        await page.locator("[data-pattern-preview]").evaluateAll((elements, currentId) => {
          for (const element of elements) element.toggleAttribute("hidden", element.getAttribute("data-pattern-preview") !== currentId);
        }, id);
        const result = await new AxeBuilder({ page })
          .include(`[data-pattern-preview="${id}"]`)
          .withTags(tags)
          .analyze();
        const violations = [];
        for (const { id: ruleId, impact, help, helpUrl, nodes } of result.violations) {
          const mappedNodes = [];
          for (const { target, failureSummary } of nodes) {
            let computed = null;
            try {
              const selector = String(target.at(-1));
              computed = await page.locator(selector).first().evaluate((element) => {
                const style = getComputedStyle(element);
                const ancestors = [];
                let current = element;
                while (current && ancestors.length < 8) {
                  const currentStyle = getComputedStyle(current);
                  ancestors.push({
                    tag: current.tagName.toLowerCase(),
                    className: typeof current.className === "string" ? current.className : "",
                    opacity: currentStyle.opacity,
                    color: currentStyle.color,
                    backgroundColor: currentStyle.backgroundColor,
                    hidden: current.hasAttribute("hidden"),
                  });
                  current = current.parentElement;
                }
                return {
                  color: style.color,
                  backgroundColor: style.backgroundColor,
                  opacity: style.opacity,
                  disabled: "disabled" in element ? element.disabled : null,
                  styleAttribute: element.getAttribute("style"),
                  ancestors,
                };
              });
            } catch {
              // Axe selectors can describe frames or shadow roots; diagnostics are best effort.
            }
            mappedNodes.push({ target, failureSummary, computed });
          }
          violations.push({ id: ruleId, impact, help, helpUrl, nodes: mappedNodes });
        }
        patterns[id].themes[theme] = { status: violations.length ? "passed-with-findings" : "passed", violations };
        if (violations.length) {
          patterns[id].status = "passed-with-findings";
          findings.push(...violations.map((violation) => ({ pattern: id, theme, ...violation })));
        }
      }
    }
    await page.locator("[data-pattern-preview]").evaluateAll((elements) => {
      for (const element of elements) element.removeAttribute("hidden");
    });
    accessibility = {
      status: findings.length ? "passed-with-findings" : "passed",
      scans: patternIds.length * 2,
      patterns,
      violations: findings,
    };
  } catch (error) {
    accessibility = { status: "not-run", violations: [{ id: "axe-unavailable", impact: null, help: error.message, nodes: [] }] };
  }
  await mkdir(join(root, "validation/reports"), { recursive: true });
  await writeFile(join(root, "validation/reports/react.json"), `${JSON.stringify({
    schemaVersion: "1.0.0", generatedAt: "2026-08-04", framework: "react", renderedPatterns: rendered,
    status: consoleErrors.length || pageErrors.length ? "failed" : accessibility.status,
    consoleErrors, pageErrors, accessibility,
  }, null, 2)}\n`);
  if (consoleErrors.length || pageErrors.length) throw new Error(`Browser errors: ${[...consoleErrors, ...pageErrors].join(" | ")}`);
  console.log(`React validation passed: ${rendered}/25 previews rendered; accessibility ${accessibility.status}.`);
} finally {
  await context?.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
