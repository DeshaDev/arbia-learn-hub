import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dataMatch = app.match(/const DATA=(\[[\s\S]*?\])\.map/);
assert.ok(dataMatch, "the app should define the lesson word data");
const rows = JSON.parse(dataMatch[1].replace(/'/g, '"'));
assert.equal(rows.length, 28, "Arabic alphabet data should include 28 letters");
assert.equal(new Set(rows.map(row => row[0])).size, 28, "Arabic letters should be unique");
for (const [index, row] of rows.entries()) {
  assert.equal(row.length, 8, `entry ${index + 1} should contain all eight fields`);
  assert.ok(/[\u0600-\u06FF]/u.test(row[0]), `entry ${index + 1} should be an Arabic character`);
  for (const field of row.slice(1, 7)) assert.ok(String(field).trim(), `entry ${index + 1} has an empty learning field`);
  assert.ok(["animals", "nature", "things"].includes(row[7]), `entry ${index + 1} has an invalid category`);
}
for (const id of ["home", "letters", "words", "games", "progress"]) {
  assert.ok(html.includes(`id="${id}"`), `page view "${id}" should exist`);
}
assert.ok(html.includes("./assets/mascot.svg"), "the app should include the local SVG mascot");
assert.ok(html.includes('id="soundToggle"'), "the UI should expose a sound control");
console.log("PASS: 28 unique Arabic letters, complete learning entries, all five views, local mascot, and sound control.");
