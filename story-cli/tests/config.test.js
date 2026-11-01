import { describe, it } from "node:test";
import assert from "node:assert";
import { applySeverity } from "../src/config.js";

describe("applySeverity", () => {
  it("pushes off-level warnings to dismissed", () => {
    const result = {
      ok: true,
      errors: [],
      warnings: [{ code: "todo-markers", message: "A warning" }],
      dismissed: []
    };

    const overrides = {
      severity: [["todo-markers", "off"]],
      exemptions: []
    };

    const processed = applySeverity(result, overrides);

    assert.deepEqual(processed.warnings, []);
    assert.deepEqual(processed.errors, []);
    assert.deepEqual(processed.dismissed, [{ code: "todo-markers", message: "A warning" }]);
  });

  it("pushes error-level warnings to errors", () => {
    const result = {
      ok: true,
      errors: [],
      warnings: [{ code: "todo-markers", message: "A warning" }],
      dismissed: []
    };

    const overrides = {
      severity: [["todo-markers", "error"]],
      exemptions: []
    };

    const processed = applySeverity(result, overrides);

    assert.deepEqual(processed.warnings, []);
    assert.deepEqual(processed.errors, [{ code: "todo-markers", message: "A warning" }]);
    assert.deepEqual(processed.dismissed, []);
  });
});
