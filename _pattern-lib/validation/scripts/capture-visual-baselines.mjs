import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { chromium } from "playwright";
import { build } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const repository = join(root, "..");
const baselineDirectory = join(root, "validation/baselines/react");
const reportPath = join(root, "validation/reports/visual-baselines.json");
const temporary = await mkdtemp(join(tmpdir(), "scudamores-pattern-visual-"));
const sourceDirectory = join(temporary, "src");
const dist = join(temporary, "dist");
const widths = [360, 768, 1280];
const themes = ["light", "dark"];
const resume = process.env.RESUME_VISUAL_BASELINES === "1";

await mkdir(sourceDirectory, { recursive: true });
await mkdir(baselineDirectory, { recursive: true });
await writeFile(
  join(temporary, "index.html"),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Scudamore’s pattern visual validation</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
);
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
      return <section key={id} data-pattern-preview={id} className="mx-auto max-w-5xl">
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
const server = createServer(async (request, response) => {
  try {
    const requested = request.url?.split("?")[0] === "/"
      ? "/index.html"
      : request.url?.split("?")[0];
    const path = join(dist, requested ?? "/index.html");
    response.writeHead(200, {
      "content-type": contentTypes[extname(path)] ?? "application/octet-stream",
    });
    response.end(await readFile(path));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});

const browser = await chromium.launch({ headless: true });
let context;
try {
  context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    locale: "en-GB",
    timezoneId: "UTC",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`, {
    waitUntil: "networkidle",
  });
  await page.addStyleTag({
    content: "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}",
  });
  await page.evaluate(() => document.fonts.ready.then(() => true));

  const patternIds = await page.locator("[data-pattern-preview]").evaluateAll(
    (elements) => elements.map((element) => element.getAttribute("data-pattern-preview")),
  );
  if (patternIds.length !== 25 || patternIds.some((id) => !id)) {
    throw new Error(`Expected 25 named previews; found ${patternIds.length}.`);
  }

  const records = [];
  for (const id of patternIds) {
    const patternDirectory = join(baselineDirectory, id);
    await mkdir(patternDirectory, { recursive: true });
    for (const theme of themes) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator("html").evaluate((element, nextTheme) => {
          element.classList.toggle("dark", nextTheme === "dark");
          element.style.colorScheme = nextTheme;
        }, theme);
        await page.locator("[data-pattern-preview]").evaluateAll(
          (elements, currentId) => {
            for (const element of elements) {
              element.toggleAttribute(
                "hidden",
                element.getAttribute("data-pattern-preview") !== currentId,
              );
            }
          },
          id,
        );
        const filename = `${theme}-${width}.png`;
        const absolutePath = join(patternDirectory, filename);
        let content = null;
        if (resume) {
          try {
            const existing = await readFile(absolutePath);
            if (
              existing.byteLength > 100
              && existing.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"
            ) content = existing;
          } catch {
            // A missing or incomplete image is captured below.
          }
        }
        if (content === null) {
          await page.screenshot({
            path: absolutePath,
            fullPage: true,
            animations: "disabled",
            caret: "hide",
            scale: "css",
          });
          content = await readFile(absolutePath);
        }
        records.push({
          pattern: id,
          framework: "react",
          theme,
          viewport: { width, height: 900 },
          path: relative(root, absolutePath).split(sep).join("/"),
          bytes: content.byteLength,
          sha256: createHash("sha256").update(content).digest("hex"),
        });
      }
    }
    console.log(`Captured or verified visual baselines for ${id}.`);
  }

  if (consoleErrors.length || pageErrors.length) {
    throw new Error(`Browser errors: ${[...consoleErrors, ...pageErrors].join(" | ")}`);
  }

  const expectedPaths = new Set(records.map((record) => record.path));
  for (const id of patternIds) {
    for (const filename of await readdir(join(baselineDirectory, id))) {
      const path = `validation/baselines/react/${id}/${filename}`;
      if (!expectedPaths.has(path)) {
        throw new Error(`Unexpected stale visual baseline: ${path}`);
      }
    }
  }

  await writeFile(reportPath, `${JSON.stringify({
    schemaVersion: "1.0.0",
    generatedAt: "2026-08-04",
    status: "passed",
    framework: "react",
    sourceCommit: "d1511e224305585680723101a0b76be93eb9f2f0",
    coverage: {
      patterns: patternIds.length,
      themes,
      viewportWidths: widths,
      screenshots: records.length,
    },
    environment: {
      browser: "Chromium via Playwright 1.61.1",
      deviceScaleFactor: 1,
      locale: "en-GB",
      timezone: "UTC",
      reducedMotion: "reduce",
    },
    records,
    limitations: [
      "These images lock the extracted React render for downstream review; they do not claim pixel identity with a separately deployed application shell.",
      "Blade remains code/documentation-only in the external playground. Its source is server-rendered in Laravel and shares the locked tokens, but browser screenshots require the consumer's Alpine, font and asset integration.",
      "Host-provided content, translated strings and non-default scenarios require consumer-level visual regression coverage.",
    ],
  }, null, 2)}\n`);
  console.log(`Visual baseline capture passed: ${records.length} React screenshots.`);
} finally {
  await context?.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
