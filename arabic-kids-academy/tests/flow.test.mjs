import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const store = new Map([["ali-academy-progress-v2", JSON.stringify({learned:[0],xp:35,letter:1,view:"lesson"})],["ali-academy-progress-v3", JSON.stringify({learned:[0,1],xp:85,letter:2,view:"lesson"})]]);
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
assert.match(app.innerHTML,/adventure-home/, "a fresh visitor should see the child's welcome screen");
assert.match(app.innerHTML,/Привет! Я Али\. Пойдём исследовать мир!/, "the homepage should invite a first-time learner");
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
assert.match(app.innerHTML,/discovery-showcase[\s\S]*?letter-friends\.svg#lion/, "Alif should appear next to its custom SVG lion illustration");
assert.match(app.innerHTML,/class="discovery-letter arabic"[\s\S]*?ا/, "the Arabic letter should be large next to the SVG friend");
const examples = JSON.parse(JSON.stringify(vm.runInContext("LETTERS.map((letter,i)=>({letter:letter.ch,example:letterWord(letter)}))",context)));
assert.equal(examples.length,28,"every Arabic letter should have a visual example");
assert.deepEqual(
  examples.slice(0,4).map(x=>[x.letter,x.example.ar,x.example.ru,x.example.art]),
  [["ا","أسد","лев","lion"],["ب","بطة","утка","duck"],["ت","تفاحة","яблоко","apple"],["ث","ثعلب","лиса","fox"]],
  "the first lessons should show the appropriate object, not the mascot as a letter example"
);
assert.ok(examples.every((x,i)=>x.example.idx===i),"each of the 28 letters should map to its own indexed example");

vm.runInContext("handleAction('speak-letter',{dataset:{}})",context);
vm.runInContext("handleAction('speak-word',{dataset:{}})",context);
vm.runInContext("handleAction('i-repeated',{dataset:{}})",context);
assert.equal(vm.runInContext("state.lessonChecks.repeated",context),true,"the child must confirm repeating before moving on");
vm.runInContext("handleAction('lesson-next',{dataset:{}})",context);
assert.equal(vm.runInContext("state.lessonStep",context),2,"the story should move to recognition after listening and repeating");
assert.match(app.innerHTML,/Найди такую же букву!/, "recognition should ask one clear question");
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
vm.runInContext("handleAction('next-letter',{dataset:{}})",context);
assert.equal(vm.runInContext("state.letter",context),1,"after Alif, the next lesson should be Ba");
vm.runInContext("handleAction('meet-letter',{dataset:{}})",context);
assert.match(app.innerHTML,/بطة[\s\S]*утка/, "Ba's reveal should show duck in Arabic and Russian");
assert.match(app.innerHTML,/discovery-showcase[\s\S]*?letter-friends\.svg#duck/, "Ba should feature a custom SVG duck next to the large Arabic letter");


for (const kind of ["catch","mail","listen"]) {
  vm.runInContext("state.game=null;state.view='games';render()",context);
  vm.runInContext("handleAction('start-game',{dataset:{game:'"+kind+"'}})",context);
  assert.equal(vm.runInContext("state.game.kind",context),kind,"game should start: "+kind);
  assert.match(app.innerHTML,/game-challenge-panel/,kind+" should render its own challenge scene");
  assert.match(app.innerHTML,/letter-friends\.svg#/,kind+" should use original SVG illustrations");
  vm.runInContext("handleAction('game-speak',{dataset:{}})",context);
  const pick=vm.runInContext("WORDS.indexOf(WORDS.find(w=>w.idx===state.game.target))",context);
  if(kind==="catch") {
    vm.runInContext("handleAction('game-answer',{dataset:{i:String(state.game.target)}})",context);
  } else if(kind==="mail") {
    vm.runInContext("handleAction('mail-select',{dataset:{word:String("+pick+")}})",context);
    assert.equal(vm.runInContext("state.game.selectedWord",context),pick,"mail should select a parcel before delivering it");
    vm.runInContext("handleAction('mail-deliver',{dataset:{}})",context);
  } else {
    vm.runInContext("handleAction('game-answer-word',{dataset:{word:String("+pick+")}})",context);
  }
  assert.equal(vm.runInContext("state.game.answered",context),true,kind+" should provide explicit feedback after an answer");
  assert.equal(vm.runInContext("state.game.correct",context),true,kind+" should recognise the right answer");
  assert.match(app.innerHTML,/Следующий раунд/,kind+" should wait for the child to advance");
  vm.runInContext("handleAction('game-next',{dataset:{}})",context);
  assert.equal(vm.runInContext("state.game.round",context),1,kind+" should move only after the child presses next");
}
vm.runInContext("state.game=null;handleAction('start-game',{dataset:{game:'mail'}})",context);
const wrongParcel=vm.runInContext("WORDS.indexOf(WORDS.find(w=>w.idx!==state.game.target))",context);
vm.runInContext("handleAction('mail-select',{dataset:{word:String("+wrongParcel+")}})",context);
vm.runInContext("handleAction('mail-deliver',{dataset:{}})",context);
assert.equal(vm.runInContext("state.game.answered",context),false,"a wrong parcel should invite a retry rather than fail the entire round");
assert.equal(vm.runInContext("state.game.selectedWord",context),null,"a wrong parcel should return to the selection shelf");
assert.ok(vm.runInContext("state.game.mailFeedback.length>0",context),"mail should give a child-friendly retry hint");

vm.runInContext("state.game=null;handleAction('start-game',{dataset:{game:'memory'}})",context);
assert.equal(vm.runInContext("state.game.deck.length",context),8,"memory game should create four SVG-letter pairs");
const pair=vm.runInContext("state.game.deck[0].pair",context);
const letterCard=vm.runInContext("state.game.deck.findIndex(c=>c.pair==="+pair+"&&c.type==='letter')",context);
const wordCard=vm.runInContext("state.game.deck.findIndex(c=>c.pair==="+pair+"&&c.type==='word')",context);
vm.runInContext("handleAction('memory-pick',{dataset:{card:String("+letterCard+")}})",context);
vm.runInContext("handleAction('memory-pick',{dataset:{card:String("+wordCard+")}})",context);
assert.equal(vm.runInContext("state.game.matched.length",context),2,"memory should match the letter to the SVG friend");

console.log("PASS: fresh home → SVG letter lessons → handwriting → celebration → four interactive game modes.");
