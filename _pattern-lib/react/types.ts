export type PatternViewport = "360" | "768" | "1280" | "fluid";

export interface BaseLibraryRequirement {
  schemaVersion: "1.0.0";
  name: "scudamores-ui";
  directory: "_comp-lib";
  version: "0.1.0";
  release: { archive: string; sha256: string };
  tree: { scope: string; sha256: string };
  catalog: string;
  reactImportAlias: "@scudamores/ui/*";
  bladeComponentPrefix: "ui";
}

export interface PatternScenario {
  id: string;
  title: string;
  description?: string;
  fixture: string;
  states?: string[];
  defaultViewport?: PatternViewport;
}

export interface PatternContractMember {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface PatternManifest {
  schemaVersion: "1.0.0";
  id: string;
  title: string;
  description: string;
  category: string;
  maturity: "beta";
  kind: "recipe";
  searchTerms: string[];
  fixture: string;
  documentation: string;
  scenarios: PatternScenario[];
  react: { files: string[]; entry: string; export: string; exampleData: string };
  blade: { files: string[]; exampleData: string; events?: string[] };
  contract: {
    support: "composition-recipe";
    standaloneApi: false;
    fixturePolicy: "neutral DTOs only";
    hostResponsibilities: string[];
    inputs?: PatternContractMember[];
    callbacks?: PatternContractMember[];
  };
  dependencies: { internal: string[]; npm: string[]; bladeRuntime: string[] };
  responsiveBehavior: string[];
  accessibility: { status: "pending" | "passed" | "passed-with-findings"; findings: string[] };
  parity: { classification: "framework-equivalent" | "intentional-difference"; differences: string[] };
  source: {
    commit: "d1511e224305585680723101a0b76be93eb9f2f0";
    verifiedAt: string;
    files: Array<{ path: string; sha256: string }>;
    decisionReferences: string[];
  };
}

export interface PatternCatalogEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  maturity: "beta";
  kind: "recipe";
  manifest: string;
  frameworks: ["react", "blade"];
  searchTerms: string[];
}

export interface PatternCatalog {
  schemaVersion: "1.0.0";
  version: "0.1.0";
  name: "Scudamore's Pattern Library";
  baseLibrary: "catalog/base-library.json";
  patterns: PatternCatalogEntry[];
  counts: { patterns: 25; react: 25; blade: 25 };
}
