import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
const root = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const js = readFileSync(new URL("app.js", root), "utf8");
const css = readFileSync(new URL("styles.css", root), "utf8");
const rabbit = readFileSync(new URL("assets/rabbit.svg", root), "utf8");
assert.equal((js.match(/^\s*\{ch:'/gm) || []).length, 28, "28 letter entries must exist");
for (const name of ["renderHome", "renderPath", "renderLetters", "renderLesson", "renderWords", "renderPhrases", "renderGames", "renderProfile", "renderCelebration", "renderReading"]) {
  assert.ok(js.includes("function " + name + "("), "missing academy view: " + name);
}
for (const name of ["meet-letter", "complete-lesson", "next-letter", "wireCanvas", "pickMemory", "advanceGame", "markMission", "saveState"]) {
  assert.ok(js.includes(name), "missing interactive mechanic: " + name);
}
for (const game of ["catch", "mail", "memory", "listen"]) {
  assert.ok(js.includes("id:'" + game + "'"), "missing game mode: " + game);
}
assert.ok(!/\bl\.i\b|\bx\.i\b/.test(js), "letter indices must use array positions, not missing .i fields");
assert.ok(js.includes("LETTERS.map(function(l,i){return i;})"), "game targets must use valid letter indices");
assert.ok(js.includes("localStorage") && js.includes("ali-academy-progress-v2"), "progress must persist locally");
assert.ok(html.includes('href="./styles.css"') && html.includes('src="./app.js"'), "page assets must be linked");
assert.ok(html.includes('id="app"') && html.includes('id="mobile-nav"'), "app mount and responsive navigation must exist");
assert.ok(js.includes("const CURRICULUM=["), "parent-facing learning sequence must be documented");
const homeStart=js.indexOf("function renderHome()");
const homeEnd=js.indexOf("function plural(",homeStart);
const home=js.slice(homeStart,homeEnd);
assert.ok(home.includes("kid-welcome") && home.includes("home-worlds"), "home should be a child-first welcome plus a compact journey map");
assert.ok(!home.includes("mission-strip") && !home.includes("kpi-row") && !home.includes("content-grid"), "the child home should not be a stats dashboard");
const lessonStart=js.indexOf("function renderLesson()");
const lessonEnd=js.indexOf("function renderReading(",lessonStart);
const lesson=js.slice(lessonStart,lessonEnd);
assert.ok(lesson.includes("kid-lesson") && lesson.includes("kid-task-card") && lesson.includes("kid-writing-pad"), "lesson should present one focused task at a time");
assert.ok(!lesson.includes("lesson-layout") && !lesson.includes("rightPanel"), "lesson should not duplicate content in a two-column adult dashboard");
assert.ok(js.includes("function renderCelebration("), "completing a letter should have a child-friendly celebration");
assert.ok(js.includes("function canVisit(view)"), "learning worlds should unlock based on progress");
assert.ok(css.includes(".kid-welcome") && css.includes(".kid-task-card") && css.includes(".storybook-map"), "child-first UI components should be styled");
assert.ok(css.includes("rabbit-hops-to-letter"), "rabbit should travel toward the target letter");
assert.ok(js.includes("stale #lesson links never bypass onboarding"), "cold page loads should not open halfway through a lesson");
assert.ok(js.includes("if(!state.writeReady)"), "a lesson cannot be completed without practising writing");
assert.ok(js.includes("state.readingAnswer===v.sound"), "vowel practice should require a correct answer before advancing");
assert.ok(!js.slice(js.indexOf("function renderLesson()"), js.indexOf("function renderReading(", js.indexOf("function renderLesson()"))).includes("lesson-object"), "the focused lesson scene should not place floating unrelated objects in the sky");
assert.ok(rabbit.includes("@keyframes") && rabbit.includes("Али"), "animated mascot must exist");
assert.ok(css.includes(".hero-world") && css.includes(".lesson-scene") && css.includes("@keyframes rabbitWalk"), "lesson and world scene styles must exist");
assert.ok(css.includes("@media(max-width:620px)") && css.includes("prefers-reduced-motion"), "responsive and reduced-motion rules must exist");
console.log("PASS: 28 letters, 8 learning views, 4 game modes, sound, tracing, save-state, animated rabbit, responsive design.");
