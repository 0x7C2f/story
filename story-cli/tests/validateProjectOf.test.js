import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { validateProjectOf } from "../src/validate.js";
import { REQUIRED_PATHS } from "../src/scan.js";
import { err } from "../src/findings.js";

describe("validateProjectOf", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-test-"));
    for (const p of REQUIRED_PATHS) {
      fs.mkdirSync(path.dirname(path.join(tempDir, p)), { recursive: true });
      fs.writeFileSync(path.join(tempDir, p), "");
    }
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  function createMockProject() {
    return {
      root: tempDir,
      fileErrors: [],
      characters: [],
      locations: [],
      systems: [],
      factions: [],
      artifacts: [],
      arcs: [],
      chapters: [],
      scenes: [],
      continuityState: [],
      questions: [],
      promises: [],
      clues: [],
      exemptions: [],
      glossaryTerms: [],
      matter: [],
      research: [],
      sessions: [],
      styleSheet: { data: {} },
      unit: { name: "words" },
      story: { data: { cover: "cover.jpg", status: "draft" }, unreadable: false },
      progressLog: { data: {} },
      formRangeSettings: []
    };
  }

  test("adds missing-required-path error when a required path is missing", () => {
    fs.unlinkSync(path.join(tempDir, REQUIRED_PATHS[0]));
    const project = createMockProject();
    const result = validateProjectOf(project);
    const missingPathErrors = result.errors.filter(e => e.code === "missing-required-path");
    assert.strictEqual(missingPathErrors.length, 1);
    assert.ok(missingPathErrors[0].message.includes(REQUIRED_PATHS[0]));
  });

  test("adds multiple missing-required-path errors when multiple are missing", () => {
    fs.unlinkSync(path.join(tempDir, REQUIRED_PATHS[0]));
    fs.unlinkSync(path.join(tempDir, REQUIRED_PATHS[1]));

    const project = createMockProject();
    const result = validateProjectOf(project);
    const missingPathErrors = result.errors.filter(e => e.code === "missing-required-path");

    assert.strictEqual(missingPathErrors.length, 2);
    assert.ok(missingPathErrors[0].message.includes(REQUIRED_PATHS[0]));
    assert.ok(missingPathErrors[1].message.includes(REQUIRED_PATHS[1]));
  });

  test("includes fileErrors from the project", () => {
    const project = createMockProject();
    const customError = err("custom-error", "A custom error message", "some/file.md");
    project.fileErrors.push(customError);

    const result = validateProjectOf(project);

    const hasCustomError = result.errors.some(e => e.code === "custom-error" && e.message === "A custom error message");
    assert.ok(hasCustomError);
  });

  test("handles missing project.fileErrors appropriately", () => {
    const project = createMockProject();
    delete project.fileErrors; // set it to undefined to check the `project.fileErrors ?? []` logic

    const result = validateProjectOf(project);
    const hasMissingPathError = result.errors.some(e => e.code === "missing-required-path");
    assert.strictEqual(hasMissingPathError, false); // no paths are missing initially
  });

  test("evaluates result ok flag based on errors", () => {
    const project = createMockProject();
    fs.unlinkSync(path.join(tempDir, REQUIRED_PATHS[0]));
    const resultErr = validateProjectOf(project);

    assert.strictEqual(resultErr.ok, false, "Should not be ok when there are errors");

    // We can't easily mock an error-free project with all sub-validations running.
    // Instead we can just check that ok is strictly based on errors.length === 0
    assert.strictEqual(resultErr.ok, resultErr.errors.length === 0);
  });
});
