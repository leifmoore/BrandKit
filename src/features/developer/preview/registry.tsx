import * as React from "react";

import { RecipeDemo } from "./recipeDemos";
import type { LoadedPreview, PreviewKind } from "./types";

type ModuleImporter = () => Promise<Record<string, unknown>>;
type FixtureImporter = () => Promise<{ default: unknown }>;

const componentModules = import.meta.glob(
  "../../../../_comp-lib/react/examples/*/basic.tsx",
) as Record<string, ModuleImporter>;

const recipeModules = import.meta.glob(
  "../../../../_comp-lib/recipes/*/react/*Recipe.tsx",
) as Record<string, ModuleImporter>;

const recipeFixtures = import.meta.glob(
  "../../../../_comp-lib/recipes/*/fixtures/basic.json",
) as Record<string, FixtureImporter>;

function idFromPath(path: string, segment: "examples" | "recipes"): string {
  const match = path.match(new RegExp(`/${segment}/([^/]+)/`));
  if (!match) {
    throw new Error(`Unable to derive a preview id from ${path}.`);
  }
  return match[1];
}

function indexById<T>(
  records: Record<string, T>,
  segment: "examples" | "recipes",
): Map<string, { path: string; value: T }> {
  return new Map(
    Object.entries(records).map(([path, value]) => [
      idFromPath(path, segment),
      { path, value },
    ]),
  );
}

const componentIndex = indexById(componentModules, "examples");
const recipeIndex = indexById(recipeModules, "recipes");
const fixtureIndex = indexById(recipeFixtures, "recipes");

export const COMPONENT_PREVIEW_IDS = Object.freeze(
  [...componentIndex.keys()].sort(),
);
export const RECIPE_PREVIEW_IDS = Object.freeze(
  [...recipeIndex.keys()].sort(),
);
export const PREVIEW_REGISTRY_COUNTS = Object.freeze({
  components: COMPONENT_PREVIEW_IDS.length,
  recipes: RECIPE_PREVIEW_IDS.length,
});

function findComponent(
  module: Record<string, unknown>,
  suffix: "Example" | "Recipe",
  id: string,
): React.ComponentType<Record<string, unknown>> {
  const entry = Object.entries(module).find(
    ([name, value]) => name.endsWith(suffix) && typeof value === "function",
  );

  if (!entry) {
    throw new Error(`The ${id} module does not export a renderable ${suffix}.`);
  }

  return entry[1] as React.ComponentType<Record<string, unknown>>;
}

export function hasPreview(kind: PreviewKind, id: string): boolean {
  return (kind === "component" ? componentIndex : recipeIndex).has(id);
}

export async function loadPreview(
  kind: PreviewKind,
  id: string,
): Promise<LoadedPreview | null> {
  if (kind === "component") {
    const record = componentIndex.get(id);
    if (!record) return null;

    const module = await record.value();
    const Component = findComponent(module, "Example", id);
    return { Component, sourcePath: record.path };
  }

  const recipeRecord = recipeIndex.get(id);
  const fixtureRecord = fixtureIndex.get(id);
  if (!recipeRecord || !fixtureRecord) return null;

  const [module, fixtureModule] = await Promise.all([
    recipeRecord.value(),
    fixtureRecord.value(),
  ]);
  const Recipe = findComponent(module, "Recipe", id);

  function LoadedRecipeDemo() {
    return (
      <RecipeDemo id={id} component={Recipe} fixture={fixtureModule.default} />
    );
  }

  LoadedRecipeDemo.displayName = `${id}Preview`;
  return { Component: LoadedRecipeDemo, sourcePath: recipeRecord.path };
}
