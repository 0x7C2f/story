import { escapeInkControlLines } from "./story-cli/src/ink.js";
import assert from "assert";

assert.equal(escapeInkControlLines("TODO something"), "\\TODO something");
assert.equal(escapeInkControlLines("todo something"), "todo something");
assert.equal(escapeInkControlLines("INCLUDE something"), "\\INCLUDE something");
assert.equal(escapeInkControlLines("VAR something"), "\\VAR something");
assert.equal(escapeInkControlLines("CONST something"), "\\CONST something");
assert.equal(escapeInkControlLines("LIST something"), "\\LIST something");
assert.equal(escapeInkControlLines("EXTERNAL something"), "\\EXTERNAL something");
assert.equal(escapeInkControlLines("* something"), "\\* something");
assert.equal(escapeInkControlLines("+ something"), "\\+ something");
assert.equal(escapeInkControlLines("- something"), "\\- something");
assert.equal(escapeInkControlLines("= something"), "\\= something");
assert.equal(escapeInkControlLines("nothing"), "nothing");
console.log("All pass");
