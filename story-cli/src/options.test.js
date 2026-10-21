import test from "node:test";
import assert from "node:assert";
import { suggestion } from "./options.js";

test("suggestion provides correct suggestions", () => {
  assert.strictEqual(suggestion("colou", ["color", "colour", "colon"]), "; did you mean color or colour or colon?");
  assert.strictEqual(suggestion("aple", ["apple", "banana"]), "; did you mean apple?");
  assert.strictEqual(suggestion("x", ["apple", "banana"]), "");
  assert.strictEqual(suggestion("aple", ["apple", "banana"], "--"), "; did you mean --apple?");
});
