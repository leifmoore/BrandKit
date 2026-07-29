import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dist = join(root, "validation/tmp/react/dist");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
  try {
    const requestPath = request.url?.split("?")[0] === "/" ? "/index.html" : request.url?.split("?")[0];
    const path = join(dist, requestPath ?? "/index.html");
    response.writeHead(200, { "content-type": contentTypes[extname(path)] ?? "application/octet-stream" });
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
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/?recipes=1`, { waitUntil: "networkidle" });

  const expected = [
    "availability-toggle-list",
    "booking-card",
    "booking-details-dialog",
    "channel-logo-picker",
    "people-popover-content",
    "quick-launch",
  ];
  const rendered = (await page.locator("[data-recipe]").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-recipe")).sort(),
  ));
  if (JSON.stringify(rendered) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${expected.join(", ")}; rendered ${rendered.join(", ")}`);
  }

  await page.locator('[data-recipe="quick-launch"]').getByRole("button", { name: /River desk/ }).click();
  await page.locator('[data-recipe="booking-card"]').getByRole("button", { name: "View" }).click();

  const availability = page.locator('[data-recipe="availability-toggle-list"]');
  await availability.getByRole("button", { name: "Set default" }).click();
  if (await availability.getByText("Default", { exact: true }).count() !== 1) {
    throw new Error("Availability adapter did not update its default item");
  }

  const logo = page.locator('[data-recipe="channel-logo-picker"]').getByRole("button", { name: "Monochrome mark" });
  await logo.click();
  if (await logo.getAttribute("aria-pressed") !== "true") throw new Error("Logo adapter did not update selection");

  const people = page.locator('[data-recipe="people-popover-content"]');
  await people.getByRole("button", { name: "Add adults" }).click();
  await people.getByText("3", { exact: true }).waitFor();

  const details = page.locator('[data-recipe="booking-details-dialog"]');
  await details.getByRole("button", { name: "Preview booking details" }).click();
  await page.getByRole("dialog", { name: "Booking details" }).waitFor();
  await page.keyboard.press("Escape");

  if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
  console.log("Recipe browser validation passed: 6/6 React recipes rendered; fixture interactions passed.");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
