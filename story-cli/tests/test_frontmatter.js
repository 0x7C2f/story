import assert from "node:assert";
import test from "node:test";
import { parseFrontmatter } from "../src/frontmatter.js";

test("handles unquoted [TODO: author to supply]", () => {
  const content = `---\nsummary: [TODO: author to supply]\ntitle: test\n---\nbody`;
  const data = parseFrontmatter(content);
  assert.equal(data.data.summary, "[TODO: author to supply]");
});

test("throws array not closed error for [ when not [TODO]", () => {
  const content = `---\nsummary: [\ntitle: test\n---\nbody`;
  assert.throws(() => {
    parseFrontmatter(content);
  }, /array not closed/);
});
