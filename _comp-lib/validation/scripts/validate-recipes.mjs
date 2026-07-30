import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const recipesRoot = join(root, "recipes");

const recipes = [
  {
    slug: "quick-launch",
    reactFile: "QuickLaunchRecipe.tsx",
    reactExport: "QuickLaunchRecipe",
    fixtureKeys: ["items"],
  },
  {
    slug: "availability-toggle-list",
    reactFile: "AvailabilityToggleListRecipe.tsx",
    reactExport: "AvailabilityToggleListRecipe",
    fixtureKeys: ["items", "defaultId"],
  },
  {
    slug: "channel-logo-picker",
    reactFile: "ChannelLogoPickerRecipe.tsx",
    reactExport: "ChannelLogoPickerRecipe",
    fixtureKeys: ["logos", "selectedLogoId", "showLogo"],
  },
  {
    slug: "booking-card",
    reactFile: "BookingCardRecipe.tsx",
    reactExport: "BookingCardRecipe",
    fixtureKeys: ["id", "customerName", "customerEmail", "status"],
  },
  {
    slug: "booking-details-dialog",
    reactFile: "BookingDetailsDialogRecipe.tsx",
    reactExport: "BookingDetailsDialogRecipe",
    fixtureKeys: ["id", "customerName", "customerEmail", "status", "date", "time", "items", "total"],
  },
  {
    slug: "people-popover-content",
    reactFile: "PeoplePopoverContentRecipe.tsx",
    reactExport: "PeoplePopoverContentRecipe",
    fixtureKeys: ["adults", "children", "infants", "pets", "accessibilityAccess"],
  },
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const recipeDirectories = (await readdir(recipesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
check(
  JSON.stringify(recipeDirectories) === JSON.stringify(recipes.map(({ slug }) => slug).sort()),
  `Expected exactly six recipe directories; found ${recipeDirectories.join(", ")}`,
);

for (const recipe of recipes) {
  const directory = join(recipesRoot, recipe.slug);
  const reactPath = join(directory, "react", recipe.reactFile);
  const bladePath = join(directory, "blade", `${recipe.slug}.blade.php`);
  const fixturePath = join(directory, "fixtures", "basic.json");
  const [reactSource, bladeSource, fixtureSource] = await Promise.all([
    readFile(reactPath, "utf8"),
    readFile(bladePath, "utf8"),
    readFile(fixturePath, "utf8"),
  ]);
  const fixture = JSON.parse(fixtureSource);

  check(
    reactSource.includes(`export function ${recipe.reactExport}`),
    `${recipe.slug}: missing named React export ${recipe.reactExport}`,
  );
  check(bladeSource.includes("@props("), `${recipe.slug}: Blade recipe must declare props`);
  check(bladeSource.includes("<x-ui."), `${recipe.slug}: Blade recipe must compose canonical UI components`);
  for (const key of recipe.fixtureKeys) {
    check(Object.hasOwn(fixture, key), `${recipe.slug}: fixture is missing ${key}`);
  }
}

const [reactCss, bladeCss] = await Promise.all([
  readFile(join(root, "react/styles/tailwind.css"), "utf8"),
  readFile(join(root, "blade/library/resources/css/tailwind.css"), "utf8"),
]);
check(
  reactCss.includes('@source "../../recipes/*/react/**/*.{js,ts,jsx,tsx}";'),
  "React Tailwind entrypoint does not scan recipe modules",
);
check(
  bladeCss.includes('@source "../../../../recipes/*/blade/**/*.blade.php";'),
  "Blade Tailwind entrypoint does not scan recipe views",
);

const temporaryReactHarness = join(root, "validation/tmp/react/src/recipes.tsx");
try {
  await access(temporaryReactHarness);
  const source = await readFile(temporaryReactHarness, "utf8");
  for (const recipe of recipes) {
    check(source.includes(`data-recipe={id}`), "React fixture must expose deterministic recipe markers");
    check(source.includes(recipe.reactFile.replace(".tsx", "")), `${recipe.slug}: temporary React harness does not import its recipe`);
  }
} catch {
  // Clean releases intentionally omit disposable validation fixtures.
}

if (failures.length) {
  console.error(`Recipe validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Recipe validation passed: ${recipes.length} paired recipes and neutral fixtures.`);
