import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const store = new Map([["ali-academy-progress-v2", JSON.stringify({learned:[0],xp:35,letter:1,view:"lesson"})]]);
const ctx2d = { scale(){}, clearRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){} };
const elements = new Map();
function makeElement(id) {
  const el = {
    id, innerHTML:"", textContent:"", value:"", disabled:false, hidden:false, width:0, height:0,
    dataset:{}, className:"", listeners:{},
    classList:{ add(){}, remove(){}, toggle(){}, contains(){return false;} },
    addEventListener(name,fn){this.listeners[name]=fn;}, focus(){}, setPointerCapture(){},
    getBoundingClientRect(){return {width:500,height:210,left:0,top:0};},
    getContext(){return ctx2d;}
  };
  elements.set(id,el); return el;
}
const document = {
  getElementById(id){return elements.get(id)||makeElement(id);},
  querySelectorAll(){return [];},
  querySelector(){return null;},
  addEventListener(){},
  createElement(){return makeElement("created");}
};
const window = {
  matchMedia(){return {matches:true};},
  scrollTo(){},
  speechSynthesis:{cancel(){},speak(){},getVoices(){return [];}}
};
class SpeechSynthesisUtterance { constructor(text){this.text=text;this.lang="";this.rate=1;this.pitch=1;this.voice=null;} }
const context = {
  document,window,localStorage:{
    getItem(k){return store.has(k)?store.get(k):null;},
    setItem(k,v){store.set(k,String(v));},
    removeItem(k){store.delete(k);}
  },
  history:{replaceState(){}},
  location:{hash:"#lesson",pathname:"/",search:""},
  SpeechSynthesisUtterance,
  setTimeout(fn){fn();return 1;},clearTimeout(){},
  confirm(){return true;},
  console,Math,Date,JSON,Array,Object,String,Number,Boolean,RegExp,Map,Set,
  encodeURIComponent,decodeURIComponent
};
vm.createContext(context);
vm.runInContext(appSource,context,{timeout:3000});
const app = document.getElementById("app");
assert.match(app.innerHTML,/kid-welcome/, "a fresh visitor should see the child's welcome screen");
assert.match(app.innerHTML,/Я Али! Давай найдём первую букву!/, "the homepage should invite a first-time learner");
assert.equal(vm.runInContext("state.learned.length",context),0,"legacy progress from the prototype should not skip the redesigned onboarding");
assert.doesNotMatch(app.innerHTML,/hero-letter|\bا\b/, "the homepage should not expose a lesson letter before the child starts");
assert.equal(vm.runInContext("state.view",context),"home");
vm.runInContext("handleAction('continue',{dataset:{}})",context);
assert.equal(vm.runInContext("state.view",context),"lesson");
assert.equal(vm.runInContext("state.letter",context),0,"the first lesson should be Alif");
assert.match(app.innerHTML,/scene-discover/, "the lesson should begin in the story scene");
vm.runInContext("handleAction('meet-letter',{dataset:{}})",context);
assert.equal(vm.runInContext("state.lessonStep",context),1,"rabbit's arrival should advance the story");
assert.match(app.innerHTML,/Алиф!/, "the reveal should name the first letter");
assert.match(app.innerHTML,/أسد[\s\S]*лев/, "Alif should be taught with a lion example, not the rabbit mascot");
assert.match(app.innerHTML,/discovery-object[\s\S]*?🦁/, "the example object should be the main visual during reveal");
vm.runInContext("handleAction('lesson-next',{dataset:{}})",context);
assert.equal(vm.runInContext("state.lessonStep",context),2,"the story should move to recognition practice");
assert.match(app.innerHTML,/Найди букву Алиф!/, "recognition should ask one clear question");
vm.runInContext("answerLetter(0)",context);
assert.equal(vm.runInContext("state.lessonStep",context),3,"correct recognition should lead to handwriting");
assert.match(app.innerHTML,/Нарисуй Алиф!/, "the final lesson step should be writing practice");
const canvas = elements.get("trace-canvas");
assert.ok(canvas && canvas.listeners.pointerdown && canvas.listeners.pointermove, "the writing canvas should register pointer input");
canvas.listeners.pointerdown({clientX:15,clientY:20,pointerId:1,preventDefault(){}});
canvas.listeners.pointermove({clientX:35,clientY:42,pointerId:1,preventDefault(){}});
assert.equal(vm.runInContext("state.writeReady",context),true,"actually tracing the letter should unlock lesson completion");
vm.runInContext("finishLetter()",context);
assert.equal(vm.runInContext("state.view",context),"celebration","completing a lesson should show a celebration");
assert.ok(vm.runInContext("state.learned.includes(0)",context),"Alif should be recorded as learned");
assert.match(app.innerHTML,/kid-celebration/, "the child should see the reward moment");
console.log("PASS: fresh home → Alif discovery → rabbit reveal → recognition → writing → celebration.");
