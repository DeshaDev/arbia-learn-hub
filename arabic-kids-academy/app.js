'use strict';

const LETTERS = [
  {ch:'ا',name:'Алиф',ar:'ألف',sound:'а',shape:'прямую палочку, как свеча',dots:'Точек нет',word:'أرنب',trans:'арнаб',ru:'кролик',emoji:'🐰',hint:'Алиф похож на высокую прямую линию. Он не соединяется со следующей буквой слева.'},
  {ch:'ب',name:'Ба',ar:'باء',sound:'б',shape:'маленькую лодочку',dots:'Одна точка снизу',word:'بطة',trans:'батта',ru:'утка',emoji:'🦆',hint:'У буквы Ба одна точка под линией — как маленькая пуговка под лодочкой.'},
  {ch:'ت',name:'Та',ar:'تاء',sound:'т',shape:'лодочку с двумя точками',dots:'Две точки сверху',word:'تفاحة',trans:'туффаха',ru:'яблоко',emoji:'🍎',hint:'Та похожа на Ба, но у неё две точки сверху. Смотри не только на форму, но и на точки!'},
  {ch:'ث',name:'Са',ar:'ثاء',sound:'th',shape:'лодочку с тремя точками',dots:'Три точки сверху',word:'ثعلب',trans:'са‘ляб',ru:'лиса',emoji:'🦊',hint:'У этой буквы три точки наверху. Её звук не имеет точного аналога в русском языке.'},
  {ch:'ج',name:'Джим',ar:'جيم',sound:'дж',shape:'изогнутый крючок',dots:'Одна точка внутри',word:'جمل',trans:'джамаль',ru:'верблюд',emoji:'🐪',hint:'У Джим одна точка находится внутри нижней части формы.'},
  {ch:'ح',name:'Ха',ar:'حاء',sound:'ḥ',shape:'открытый крючок',dots:'Точек нет',word:'حصان',trans:'хисан',ru:'лошадь',emoji:'🐴',hint:'Форма похожа на Джим, но у Ха нет точки. Звук произносится глубже русского «х».'},
  {ch:'خ',name:'Хо',ar:'خاء',sound:'х',shape:'крючок с точкой',dots:'Одна точка сверху',word:'خروف',trans:'харуф',ru:'барашек',emoji:'🐑',hint:'Хо похожа на Ха, но у неё есть одна точка сверху.'},
  {ch:'د',name:'Даль',ar:'دال',sound:'д',shape:'небольшую дугу',dots:'Точек нет',word:'دب',trans:'дубб',ru:'медведь',emoji:'🐻',hint:'Даль — короткая округлая буква. Она не соединяется со следующей буквой слева.'},
  {ch:'ذ',name:'Заль',ar:'ذال',sound:'dh',shape:'дугу с точкой',dots:'Одна точка сверху',word:'ذرة',trans:'зурра',ru:'кукуруза',emoji:'🌽',hint:'Заль отличается от Даль одной точкой сверху. Её звук непривычен для русского языка.'},
  {ch:'ر',name:'Ра',ar:'راء',sound:'р',shape:'короткую запятую',dots:'Точек нет',word:'رمان',trans:'румман',ru:'гранат',emoji:'🍎',hint:'Ра — плавная короткая линия с хвостиком. Она не соединяется со следующей буквой слева.'},
  {ch:'ز',name:'Зай',ar:'زاي',sound:'з',shape:'запятую с точкой',dots:'Одна точка сверху',word:'زرافة',trans:'зарафа',ru:'жираф',emoji:'🦒',hint:'Зай похожа на Ра, но над ней стоит одна точка.'},
  {ch:'س',name:'Син',ar:'سين',sound:'с',shape:'три маленьких зубчика',dots:'Точек нет',word:'سمكة',trans:'самака',ru:'рыба',emoji:'🐟',hint:'Син напоминает ряд маленьких зубчиков. Проведи глазами по волнистой линии.'},
  {ch:'ش',name:'Шин',ar:'شين',sound:'ш',shape:'три зубчика с точками',dots:'Три точки сверху',word:'شمس',trans:'шамс',ru:'солнце',emoji:'☀️',hint:'Шин похожа на Син, но над зубчиками три точки.'},
  {ch:'ص',name:'Сад',ar:'صاد',sound:'ṣ',shape:'округлую петлю с хвостиком',dots:'Точек нет',word:'صقر',trans:'сакр',ru:'сокол',emoji:'🦅',hint:'Сад похожа на округлую чашку. Это твёрдый арабский звук «с».'},
  {ch:'ض',name:'Дад',ar:'ضاد',sound:'ḍ',shape:'петлю с точкой',dots:'Одна точка сверху',word:'ضفدع',trans:'дифда‘',ru:'лягушка',emoji:'🐸',hint:'Дад похожа на Сад, но над ней одна точка. У звука нет точного русского аналога.'},
  {ch:'ط',name:'То',ar:'طاء',sound:'ṭ',shape:'петлю с высокой палочкой',dots:'Точек нет',word:'طائرة',trans:'таира',ru:'самолёт',emoji:'✈️',hint:'У То высокая палочка над округлой частью. Звук произносится твёрдо.'},
  {ch:'ظ',name:'Зо',ar:'ظاء',sound:'ẓ',shape:'петлю с палочкой и точкой',dots:'Одна точка сверху',word:'ظرف',trans:'зарф',ru:'конверт',emoji:'✉️',hint:'Зо похожа на То, но над ней есть точка.'},
  {ch:'ع',name:'Айн',ar:'عين',sound:'‘',shape:'форму с открытым изгибом',dots:'Точек нет',word:'عين',trans:'‘айн',ru:'глаз',emoji:'👁️',hint:'Айн — особый гортанный звук. Его лучше учить на слух вместе с преподавателем.'},
  {ch:'غ',name:'Гайн',ar:'غين',sound:'gh',shape:'изгиб с точкой сверху',dots:'Одна точка сверху',word:'غيمة',trans:'гайма',ru:'облако',emoji:'☁️',hint:'Гайн похожа на Айн, но сверху у него одна точка.'},
  {ch:'ف',name:'Фа',ar:'فاء',sound:'ф',shape:'круг с коротким хвостиком',dots:'Одна точка сверху',word:'فيل',trans:'филь',ru:'слон',emoji:'🐘',hint:'У Фа круглая часть и одна точка сверху.'},
  {ch:'ق',name:'Каф',ar:'قاف',sound:'q',shape:'круг с хвостиком',dots:'Две точки сверху',word:'قمر',trans:'камар',ru:'луна',emoji:'🌙',hint:'Каф имеет две точки сверху. Его звук глубже русского «к».'},
  {ch:'ك',name:'Каф',ar:'كاف',sound:'к',shape:'уголок с маленькой линией',dots:'Точек нет',word:'كتاب',trans:'китаб',ru:'книга',emoji:'📘',hint:'Каф можно узнать по характерному маленькому уголку внутри верхней части.'},
  {ch:'ل',name:'Лям',ar:'لام',sound:'л',shape:'высокую палочку с изгибом',dots:'Точек нет',word:'ليمون',trans:'лаймун',ru:'лимон',emoji:'🍋',hint:'Лям вытягивается вверх и затем плавно изгибается.'},
  {ch:'م',name:'Мим',ar:'ميم',sound:'м',shape:'маленький округлый завиток',dots:'Точек нет',word:'موز',trans:'мауз',ru:'банан',emoji:'🍌',hint:'Мим легко узнать по компактной округлой форме.'},
  {ch:'ن',name:'Нун',ar:'نون',sound:'н',shape:'чашечку с точкой',dots:'Одна точка сверху',word:'نحلة',trans:'нахля',ru:'пчела',emoji:'🐝',hint:'У Нун одна точка над округлой формой.'},
  {ch:'ه',name:'Ха',ar:'هاء',sound:'h',shape:'маленькое колечко',dots:'Точек нет',word:'هلال',trans:'хилаль',ru:'полумесяц',emoji:'🌙',hint:'Ха имеет мягкий выдох. Не путай её с Хо, у которой есть точка.'},
  {ch:'و',name:'Вав',ar:'واو',sound:'в / у',shape:'колечко с хвостиком',dots:'Точек нет',word:'وردة',trans:'варда',ru:'роза',emoji:'🌹',hint:'Вав может обозначать согласный звук «в» или долгий гласный «у».'},
  {ch:'ي',name:'Йа',ar:'ياء',sound:'й / и',shape:'лодочку с хвостиком',dots:'Две точки снизу',word:'يد',trans:'яд',ru:'рука',emoji:'✋',hint:'У Йа две точки снизу. В зависимости от слова буква может звучать как «й» или долгий «и».'}
];

const WORDS = [
  {ar:'أرنب',ru:'кролик',tr:'арнаб',emoji:'🐰',cat:'animals',idx:0},
  {ar:'بطة',ru:'утка',tr:'батта',emoji:'🦆',cat:'animals',idx:1},
  {ar:'تفاحة',ru:'яблоко',tr:'туффаха',emoji:'🍎',cat:'food',idx:2},
  {ar:'ثعلب',ru:'лиса',tr:'са‘ляб',emoji:'🦊',cat:'animals',idx:3},
  {ar:'جمل',ru:'верблюд',tr:'джамаль',emoji:'🐪',cat:'animals',idx:4},
  {ar:'حصان',ru:'лошадь',tr:'хисан',emoji:'🐴',cat:'animals',idx:5},
  {ar:'خروف',ru:'барашек',tr:'харуф',emoji:'🐑',cat:'animals',idx:6},
  {ar:'دب',ru:'медведь',tr:'дубб',emoji:'🐻',cat:'animals',idx:7},
  {ar:'ذرة',ru:'кукуруза',tr:'зурра',emoji:'🌽',cat:'food',idx:8},
  {ar:'رمان',ru:'гранат',tr:'румман',emoji:'🍎',cat:'food',idx:9},
  {ar:'زرافة',ru:'жираф',tr:'зарафа',emoji:'🦒',cat:'animals',idx:10},
  {ar:'سمكة',ru:'рыба',tr:'самака',emoji:'🐟',cat:'animals',idx:11},
  {ar:'شمس',ru:'солнце',tr:'шамс',emoji:'☀️',cat:'nature',idx:12},
  {ar:'صقر',ru:'сокол',tr:'сакр',emoji:'🦅',cat:'animals',idx:13},
  {ar:'ضفدع',ru:'лягушка',tr:'дифда‘',emoji:'🐸',cat:'animals',idx:14},
  {ar:'طائرة',ru:'самолёт',tr:'таира',emoji:'✈️',cat:'things',idx:15},
  {ar:'ظرف',ru:'конверт',tr:'зарф',emoji:'✉️',cat:'things',idx:16},
  {ar:'عين',ru:'глаз',tr:'‘айн',emoji:'👁️',cat:'body',idx:17},
  {ar:'غيمة',ru:'облако',tr:'гайма',emoji:'☁️',cat:'nature',idx:18},
  {ar:'فيل',ru:'слон',tr:'филь',emoji:'🐘',cat:'animals',idx:19},
  {ar:'قمر',ru:'луна',tr:'камар',emoji:'🌙',cat:'nature',idx:20},
  {ar:'كتاب',ru:'книга',tr:'китаб',emoji:'📘',cat:'things',idx:21},
  {ar:'ليمون',ru:'лимон',tr:'лаймун',emoji:'🍋',cat:'food',idx:22},
  {ar:'موز',ru:'банан',tr:'мауз',emoji:'🍌',cat:'food',idx:23},
  {ar:'نحلة',ru:'пчела',tr:'нахля',emoji:'🐝',cat:'animals',idx:24},
  {ar:'هلال',ru:'полумесяц',tr:'хилаль',emoji:'🌙',cat:'nature',idx:25},
  {ar:'وردة',ru:'роза',tr:'варда',emoji:'🌹',cat:'nature',idx:26},
  {ar:'يد',ru:'рука',tr:'яд',emoji:'✋',cat:'body',idx:27},
  {ar:'ماء',ru:'вода',tr:'маа',emoji:'💧',cat:'nature',idx:23},
  {ar:'باب',ru:'дверь',tr:'бааб',emoji:'🚪',cat:'things',idx:1},
  {ar:'بيت',ru:'дом',tr:'байт',emoji:'🏠',cat:'things',idx:1},
  {ar:'قلب',ru:'сердце',tr:'кальб',emoji:'💗',cat:'body',idx:20}
];
const PHRASES = [
  {ar:'مَرْحَبًا',tr:'мархабан',ru:'Привет!',note:'Скажи это, когда встречаешь друга.',emoji:'👋'},
  {ar:'شُكْرًا',tr:'шукран',ru:'Спасибо!',note:'Волшебное слово, которое приятно слышать.',emoji:'💛'},
  {ar:'نَعَمْ',tr:'на‘ам',ru:'Да',note:'Короткое слово для согласия.',emoji:'✅'},
  {ar:'لَا',tr:'ля',ru:'Нет',note:'Короткое слово, чтобы отказаться.',emoji:'🙅'},
  {ar:'مَا اسْمُكَ؟',tr:'ма-смука?',ru:'Как тебя зовут?',note:'Можно спросить нового друга.',emoji:'💬'},
  {ar:'اسْمِي عَلِيّ',tr:'исми Али',ru:'Меня зовут Али',note:'Представься и назови своё имя.',emoji:'🙂'},
  {ar:'كَيْفَ حَالُكَ؟',tr:'кайфа халюка?',ru:'Как дела?',note:'Вежливый вопрос другу.',emoji:'🌈'},
  {ar:'أَنَا سَعِيد',tr:'ана са‘ид',ru:'Я рад!',note:'Скажи это, когда у тебя хорошее настроение.',emoji:'✨'}
];
const CATEGORIES = [{id:'all',label:'Все слова'},{id:'animals',label:'Животные'},{id:'food',label:'Еда'},{id:'nature',label:'Природа'},{id:'things',label:'Предметы'},{id:'body',label:'Части тела'}];
const GAME_DEFS = [
  {id:'catch',icon:'🦋',title:'Поймай букву',desc:'Али услышит слово и попросит найти его первую букву.',reward:'До 25 XP',tint:'lilac'},
  {id:'mail',icon:'📮',title:'Почта для букв',desc:'Найди слово, которое начинается с нужной буквы, и доставь письмо.',reward:'До 25 XP',tint:'blue'},
  {id:'memory',icon:'🧩',title:'Пары и совпадения',desc:'Открывай карточки и соединяй арабскую букву со словом.',reward:'До 30 XP',tint:'peach'},
  {id:'listen',icon:'🎧',title:'Услышь и выбери',desc:'Слушай арабское слово и выбери его значение по-русски.',reward:'До 25 XP',tint:'mint'}
];
const BADGES = [
 {id:'first',icon:'🌱',title:'Первый шаг',desc:'Закончи свой первый урок',ok:s=>s.learned.length>=1},
 {id:'letters5',icon:'🔤',title:'Любопытный ученик',desc:'Изучи 5 букв',ok:s=>s.learned.length>=5},
 {id:'letters10',icon:'🧭',title:'Исследователь',desc:'Изучи 10 букв',ok:s=>s.learned.length>=10},
 {id:'letters28',icon:'🏆',title:'Хозяин алфавита',desc:'Изучи все 28 букв',ok:s=>s.learned.length>=28},
 {id:'word5',icon:'🍎',title:'Коллекционер слов',desc:'Послушай 5 слов',ok:s=>s.wordsHeard>=5},
 {id:'game',icon:'🎮',title:'Игрок',desc:'Заверши первую игру',ok:s=>s.gamesPlayed>=1},
 {id:'xp100',icon:'⭐',title:'Сто звёздных шагов',desc:'Набери 100 XP',ok:s=>s.xp>=100},
 {id:'streak3',icon:'🔥',title:'Привычка растёт',desc:'Занимайся 3 дня подряд',ok:s=>s.streak>=3}
];
const STORE_KEY = 'ali-academy-progress-v1';
function freshState(){return {learned:[],xp:0,stars:0,streak:0,lastVisit:'',view:'home',letter:0,lessonStep:0,wordFilter:'all',search:'',wordsHeard:0,gamesPlayed:0,answers:0,missions:{},missionDate:'',game:null,levelOpen:false};}
function loadState(){
  try{
    const raw=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    if(!raw)return freshState();
    const s=Object.assign(freshState(),raw);
    if(!Array.isArray(s.learned))s.learned=[];
    s.learned=s.learned.filter(n=>Number.isInteger(n)&&n>=0&&n<28);
    s.xp=Math.max(0,Number(s.xp)||0);s.stars=Math.max(0,Number(s.stars)||0);
    if(!s.missions||typeof s.missions!=='object')s.missions={};
    return s;
  }catch(e){return freshState();}
}
let state=loadState();
let quizFeedback='';
let canvasWired=false;
let memoryTimeout=null;
function todayKey(d){const dt=d||new Date();return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');}
function visitToday(){
  const today=todayKey(),yesterday=todayKey(new Date(Date.now()-86400000));
  if(state.lastVisit!==today){state.streak=state.lastVisit===yesterday?Math.max(1,state.streak+1):1;state.lastVisit=today;}
  if(state.missionDate!==today){state.missionDate=today;state.missions={lesson:false,game:false,listen:false};}
  saveState();
}
function saveState(){try{localStorage.setItem(STORE_KEY,JSON.stringify(state));}catch(e){}updateHeader();}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function xpLevel(){return Math.floor(state.xp/100)+1;}
function xpIntoLevel(){return state.xp%100;}
function nextLetter(){for(let i=0;i<28;i++)if(state.learned.indexOf(i)<0)return i;return 0;}
function isUnlocked(i){return i===0||state.learned.indexOf(i-1)>=0||state.learned.indexOf(i)>=0||state.levelOpen;}
function randomItems(arr,n,exclude){const pool=arr.filter(x=>exclude===undefined||x.idx!==exclude);const out=[];while(pool.length&&out.length<n){const i=Math.floor(Math.random()*pool.length);out.push(pool.splice(i,1)[0]);}return out;}
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function rabbit(){return '<img class="heading-mascot" src="./assets/rabbit.svg" alt="Али, зайчик-путешественник">';}
function updateHeader(){
  const xp=document.getElementById('xp-count'),st=document.getElementById('streak-count');
  if(xp)xp.textContent=state.xp;
  if(st)st.textContent=state.streak||1;
  document.querySelectorAll('.nav-link').forEach(function(b){b.classList.toggle('active',b.dataset.route===state.view||((state.view==='lesson'||state.view==='celebration')&&b.dataset.route==='letters')||(state.view==='profile'&&b.dataset.route==='profile')||(state.view==='phrases'&&b.dataset.route==='words'));});
}
function route(view){
  if(!view)view='home';
  state.view=view;saveState();
  const mobile=document.getElementById('mobile-nav');if(mobile)mobile.classList.remove('open');
  try{history.replaceState(null,'','#'+view);}catch(e){}
  render();
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function toast(msg){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(function(){el.classList.remove('show');},2500);}
function speak(text){
  if(localStorage.getItem('ali-academy-sound')==='off'){toast('Звук выключен. Включи его кнопкой 🔊 вверху.');return;}
  if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){toast('На этом устройстве не найден голос для озвучивания.');return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='ar-SA';u.rate=.77;u.pitch=1.02;
  const voices=window.speechSynthesis.getVoices();
  const arabicVoice=voices.find(function(v){return /^ar([-_]|$)/i.test(v.lang);});
  if(arabicVoice)u.voice=arabicVoice;
  window.speechSynthesis.speak(u);
}
function markMission(id){
  if(state.missionDate!==todayKey()){state.missionDate=todayKey();state.missions={lesson:false,game:false,listen:false};}
  if(!state.missions[id]){state.missions[id]=true;const bonus={lesson:15,game:10,listen:5}[id]||0;state.xp+=bonus;state.stars+=1;saveState();toast('Миссия выполнена! +'+bonus+' XP ✨');}
}
function addXP(n){state.xp+=n;state.stars+=Math.max(1,Math.round(n/10));saveState();}
function currentLetter(){return LETTERS[state.letter]||LETTERS[0];}
function letterWord(l){const idx=LETTERS.indexOf(l);return WORDS.find(function(w){return w.idx===idx;})||{ar:l.word,ru:l.ru,tr:l.trans,emoji:l.emoji,idx:idx};}
function headerOf(kicker,title,desc,includeRabbit){return '<div class="page-heading"><div><div class="eyebrow">'+kicker+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(includeRabbit===false?'':rabbit())+'</div>';}
function sectionTitle(kicker,title,desc,link,label){return '<div class="section-head"><div><div class="eyebrow">'+kicker+'</div><h2>'+title+'</h2>'+(desc?'<p>'+desc+'</p>':'')+'</div>'+(link?'<button class="text-link" data-route="'+link+'">'+(label||'Смотреть всё')+' →</button>':'')+'</div>';}
function missionDoneCount(){return ['lesson','game','listen'].filter(function(k){return !!state.missions[k];}).length;}
function render(){
  updateHeader();
  const app=document.getElementById('app');if(!app)return;
  const views={home:renderHome,path:renderPath,letters:renderLetters,lesson:renderLesson,celebration:renderCelebration,words:renderWords,phrases:renderPhrases,games:renderGames,profile:renderProfile};
  app.innerHTML='<div class="page-enter">'+(views[state.view]||renderHome)()+'</div>';
  app.focus({preventScroll:true});
  if(state.view==='lesson'&&state.lessonStep===3)wireCanvas();
  if(state.view==='words')wireWordSearch();
}
function renderHome(){
  const learnedCount=state.learned.length,nx=nextLetter(),pct=Math.round(learnedCount/28*100),level=xpLevel();
  const done=missionDoneCount();
  let cards='';
  const pathCards=[
    {icon:'🔤',no:'МИР 01 · СТАРТ',title:'Остров букв',desc:'Знакомься с формой, точками и звучанием 28 букв.',route:'letters',count:learnedCount+' / 28 букв'},
    {icon:'🍎',no:'МИР 02 · СЛОВА',title:'Сад слов',desc:'Открывай названия животных, предметов и природы.',route:'words',count:WORDS.length+' слов'},
    {icon:'💬',no:'МИР 03 · РАЗГОВОР',title:'Площадь фраз',desc:'Приветствия, вежливые слова и первые диалоги.',route:'phrases',count:PHRASES.length+' фраз'},
    {icon:'🎮',no:'МИР 04 · ИГРЫ',title:'Игровая долина',desc:'Лови буквы, доставляй письма и собирай пары.',route:'games',count:GAME_DEFS.length+' игр'}
  ];
  pathCards.forEach(function(c){cards+='<button class="path-card" data-route="'+c.route+'"><span class="step-icon">'+c.icon+'</span><span class="step-no">'+c.no+'</span><strong>'+c.title+'</strong><p>'+c.desc+'</p><span class="muted tiny">'+c.count+'</span><span class="card-arrow">↗</span></button>';});
  const mini=LETTERS.slice(0,7).map(function(l,i){return '<button class="map-step '+(state.learned.indexOf(i)>=0?'done':i===nx?'current':i>nx?'locked':'')+'" data-action="open-letter" data-i="'+i+'"><strong>'+l.ch+'</strong><small>'+(state.learned.indexOf(i)>=0?'✓':String(i+1).padStart(2,'0'))+'</small></button>';}).join('');
  const missions=[
    {id:'lesson',icon:'📖',title:'Пройди один урок',desc:'Познакомься с новой буквой',reward:'+15 XP'},
    {id:'game',icon:'🎯',title:'Сыграй один раунд',desc:'Потренируй память в игре',reward:'+10 XP'},
    {id:'listen',icon:'🔊',title:'Послушай слово',desc:'Открой словарную карточку и включи звук',reward:'+5 XP'}
  ];
  const missionHTML=missions.map(function(m){return '<div class="quest '+(state.missions[m.id]?'done':'')+'"><span class="quest-check">'+(state.missions[m.id]?'✓':m.icon)+'</span><div><b>'+m.title+'</b><small>'+m.desc+'</small></div><span class="reward">'+(state.missions[m.id]?'ГОТОВО':m.reward)+'</span></div>';}).join('');
  return '<section class="hero"><div class="hero-copy"><span class="pill">✨ ТВОЁ ЯЗЫКОВОЕ ПРИКЛЮЧЕНИЕ</span><h1>Арабский мир<br>начинается с <em>буквы.</em></h1><p>Путешествуй вместе с Али: узнавай буквы, собирай слова, слушай арабскую речь и открывай новые миры. Здесь можно учиться играя — в своём темпе.</p><div class="hero-actions"><button class="btn btn-primary" data-action="continue">Продолжить путь <span>→</span></button><button class="btn btn-ghost" data-route="path">Посмотреть карту</button></div><div class="hero-trust"><span><i>✓</i> Короткие уроки</span><span><i>✓</i> Игры и награды</span><span><i>✓</i> Прогресс сохраняется</span></div></div><div class="hero-world" id="hero-world"><span class="sun"></span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span><span class="world-hill hill-one"></span><span class="world-hill hill-two"></span><span class="pathway"></span><span class="speech-bubble" id="hero-bubble"><strong>Привет! Я Али 🐰</strong>Давай найдём первую букву и узнаем, как она звучит!</span><div class="hero-letter" id="hero-letter"><span class="arabic" lang="ar" dir="rtl">'+LETTERS[nx].ch+'</span><small>'+(nx===0?'Алиф · первая буква':LETTERS[nx].name+' · твой следующий шаг')+'</small></div><span class="letter-spark">✦</span><span class="floating-star star-one">✦</span><span class="floating-star star-two">✧</span><img class="rabbit-hero" id="hero-rabbit" src="./assets/rabbit.svg" alt="Али, зайчик-проводник"><span class="world-flower flower-one">🌼</span><span class="world-flower flower-two">🌷</span><span class="world-label">СТАРТ ПУТЕШЕСТВИЯ</span></div></section><section class="kpi-row"><div class="kpi"><span class="kpi-icon">🔤</span><div><strong>'+learnedCount+' / 28</strong><small>букв уже знакомы</small></div></div><div class="kpi"><span class="kpi-icon">⭐</span><div><strong>'+state.xp+' XP</strong><small>твой опыт</small></div></div><div class="kpi"><span class="kpi-icon">🔥</span><div><strong>'+state.streak+' '+plural(state.streak,['день','дня','дней'])+'</strong><small>серия занятий</small></div></div><div class="kpi"><span class="kpi-icon">🏅</span><div><strong>Уровень '+level+'</strong><small>'+(100-xpIntoLevel())+' XP до следующего</small></div></div></section><section class="mission-strip"><span class="mission-icon">🧭</span><div><b>Твоё задание на сегодня</b><p>Выполни три маленьких миссии — и день станет ещё ярче.</p><div class="progress-line" style="margin-top:9px"><i style="width:'+(done/3*100)+'%"></i></div></div><span class="mission-reward">'+done+' / 3 выполнено</span></section>'+sectionTitle('ТВОЯ КАРТА ПРИКЛЮЧЕНИЙ','Куда отправимся сегодня?','Каждый мир помогает освоить новый навык.','path','Весь путь')+'<div class="path-preview">'+cards+'</div><div class="content-grid"><section class="panel"><div class="panel-head"><div><h3>Остров букв</h3><small>Первые шаги к алфавиту</small></div><button class="text-link" data-route="letters">Все буквы →</button></div><div class="progress-line"><i style="width:'+pct+'%"></i></div><div class="panel-bottom"><p>'+pct+'% пути пройдено<br><b style="color:var(--ink)">'+(learnedCount===28?'Ты освоил весь алфавит!':'Следующая буква — '+LETTERS[nx].name)+'</b></p><button class="btn btn-purple btn-small" data-action="continue">'+(learnedCount?'Продолжить':'Начать')+' →</button></div><div class="map-steps">'+mini+'</div></section><section class="panel"><div class="panel-head"><div><h3>Маленькие миссии</h3><small>У тебя всё получится</small></div><span class="pill">'+done+'/3</span></div><div class="quest-list">'+missionHTML+'</div></section></div>';
}
function plural(n,forms){const x=Math.abs(n)%100,y=x%10;if(x>10&&x<20)return forms[2];if(y>1&&y<5)return forms[1];if(y===1)return forms[0];return forms[2];}
function renderPath(){
  const next=nextLetter();
  const sections=[
   {title:'01 · ОСТРОВ БУКВ',desc:'Учимся видеть форму, замечать точки и узнавать звук.',icon:'🔤',from:0,to:7,route:'letters'},
   {title:'02 · САД СЛОВ',desc:'Встречаем животных, предметы, еду и природу.',icon:'🍎',from:8,to:15,route:'words'},
   {title:'03 · ЛЕС ЗВУКОВ',desc:'Слушаем слова, повторяем и замечаем знакомые буквы.',icon:'🎧',from:16,to:21,route:'games'},
   {title:'04 · ПЛОЩАДЬ ФРАЗ',desc:'Приветствуем друзей и говорим первые фразы.',icon:'💬',from:22,to:27,route:'phrases'}
  ];
  let html='';
  sections.forEach(function(s,si){
    let nodes='';
    for(let i=s.from;i<=s.to;i++){
      const l=LETTERS[i],done=state.learned.indexOf(i)>=0,current=i===next,locked=!isUnlocked(i);
      nodes+='<button class="map-step '+(done?'done':current?'current':locked?'locked':'')+'" data-action="open-letter" data-i="'+i+'" '+(locked?'aria-label="Буква '+l.name+', пока закрыта"':'')+'><strong>'+l.ch+'</strong><small>'+(done?'✓':String(i+1).padStart(2,'0'))+'</small></button>';
    }
    const progress=LETTERS.slice(s.from,s.to+1).filter(function(l){return state.learned.indexOf(LETTERS.indexOf(l))>=0;}).length;
    html+='<section class="panel" style="margin-bottom:15px"><div class="panel-head"><div><span class="pill">'+s.icon+' '+s.title+'</span><h3 style="margin-top:10px">'+['Остров букв','Сад слов','Лес звуков','Площадь фраз'][si]+'</h3><small>'+s.desc+'</small></div><div class="tiny muted">'+progress+' / '+(s.to-s.from+1)+'</div></div><div class="map-steps">'+nodes+'</div><div class="panel-bottom"><p>За каждое занятие ты собираешь XP и открываешь новые достижения.</p><button class="btn btn-ghost btn-small" data-route="'+s.route+'">Исследовать →</button></div></section>';
  });
  const feats=[
   {icon:'✍️',title:'Мастерская письма',desc:'Обводи буквы в уроках, запоминай направление и форму.',route:'letters'},
   {icon:'🎮',title:'Игровая долина',desc:'Четыре мини-игры помогают повторять без скучной зубрёжки.',route:'games'},
   {icon:'🗣️',title:'Разговорная площадь',desc:'Первые фразы для встречи, знакомства и благодарности.',route:'phrases'}
  ];
  return headerOf('КАРТА ПРИКЛЮЧЕНИЯ','Твой путь в арабский мир','Каждый шаг открывает новое умение. Пройди остров букв, загляни в сад слов, потренируй слух и начни разговаривать.',true)+'<div class="content-grid"><div>'+html+'</div><aside><div class="surface panel"><div class="panel-head"><h3>Твой уровень</h3><span class="pill">Ур. '+xpLevel()+'</span></div><h2 style="font-size:27px;margin:8px 0">'+state.xp+' XP</h2><p class="muted tiny">Ещё '+(100-xpIntoLevel())+' XP — и ты поднимешься выше!</p><div class="progress-line"><i style="width:'+xpIntoLevel()+'%"></i></div><div class="panel-bottom"><p>'+state.learned.length+' знакомых букв из 28</p><span>⭐ '+state.stars+'</span></div></div>'+feats.map(function(f){return '<button class="module-card" style="width:100%;margin-top:11px" data-route="'+f.route+'"><span class="module-icon">'+f.icon+'</span><strong>'+f.title+'</strong><p>'+f.desc+'</p><span class="module-meta">Открыть →</span></button>';}).join('')+'</aside></div>';
}
function renderLetters(){
  const nx=nextLetter();
  const cards=LETTERS.map(function(l,i){
    const done=state.learned.indexOf(i)>=0,locked=!isUnlocked(i),current=i===nx;
    return '<button class="letter-card '+(done?'complete ':current?'current ':'')+(locked?'locked':'')+'" data-action="open-letter" data-i="'+i+'"><span class="glyph">'+l.ch+'</span><span class="letter-ru">'+l.name+'</span><span class="letter-ar-name" lang="ar" dir="rtl">'+l.ar+'</span>'+(done?'<span class="mini-check">✓</span>':'')+'</button>';
  }).join('');
  return headerOf('ОСТРОВ БУКВ','Знакомимся с алфавитом','28 букв, каждая со своей формой, точками и историей. Начинай с первой и двигайся дальше шаг за шагом.',true)+'<section class="panel"><div class="panel-head"><div><h3>Твоя коллекция</h3><small>Выбери открытую букву, чтобы отправиться на урок</small></div><span class="pill">'+state.learned.length+' / 28</span></div><div class="progress-line"><i style="width:'+(state.learned.length/28*100)+'%"></i></div><p class="tiny muted" style="text-align:left;margin:12px 0 0">Следующий шаг: <b style="color:var(--purple)">'+LETTERS[nx].name+'</b>. Новые буквы открываются по мере обучения.</p></section><div class="section-head"><div><div class="eyebrow">АЛФАВИТ</div><h2>Выбери букву</h2></div><button class="text-link" data-action="open-letter" data-i="'+nx+'">Продолжить →</button></div><div class="letters-grid">'+cards+'</div>';
}
function renderLesson(){
  const l=currentLetter(),word=letterWord(l),step=state.lessonStep;
  const steps=['Встреча','Узнаём форму','Найди букву','Пишем вместе'];
  let bubble='',sceneExtra='',bottomButton='',rightPanel='';
  if(step===0){
    bubble='<strong>Привет! Я Али 🐰</strong>Сегодня мы познакомимся с буквой '+l.name+'. Давай подойдём к ней поближе!';
    bottomButton='<button class="btn btn-primary" data-action="meet-letter">Али, вперёд! <span>→</span></button>';
    rightPanel='<div class="eyebrow">НАШ НОВЫЙ ДРУГ</div><h2>Это буква '+l.name+'!</h2><div class="large-glyph arabic" lang="ar" dir="rtl">'+l.ch+'</div><div class="letter-name-line"><strong>'+l.name+'</strong><button class="sound-button" data-action="speak-letter" aria-label="Послушать букву">🔊</button></div><p>Посмотри на большую букву. Али поможет заметить её форму, узнать звук и запомнить слово.</p><div class="example-box"><span class="example-emoji">'+word.emoji+'</span><div class="example-word"><small>СЛОВО-ПРИМЕР</small><span class="arabic" lang="ar" dir="rtl">'+word.ar+'</span><strong>'+word.ru+'</strong><small>'+word.tr+'</small></div><button class="sound-button" data-action="speak-word">🔊</button></div>';
  }else if(step===1){
    bubble='<strong>Смотри внимательно!</strong>'+l.hint+' Теперь послушаем букву и слово.';
    bottomButton='<button class="btn btn-purple" data-action="lesson-next">Я готов потренироваться →</button>';
    rightPanel='<div class="eyebrow">ЗАПОМНИ ФОРМУ</div><h2>Буква '+l.name+'</h2><div class="large-glyph arabic">'+l.ch+'</div><div class="example-box"><span class="example-emoji">👀</span><div class="example-word"><strong>На что похожа?</strong><small>'+l.shape+'</small><small>'+l.dots+'</small></div></div><div class="tip-box">💡 '+l.hint+'</div><div class="actions-row" style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" data-action="speak-letter">🔊 Буква</button><button class="btn btn-ghost" data-action="speak-word">🔊 Слово</button></div>';
  }else if(step===2){
    const opts=shuffle([{idx:state.letter,ch:l.ch,name:l.name}].concat(randomItems(LETTERS.map(function(x,i){return {idx:i,ch:x.ch,name:x.name};}),3,state.letter).map(function(x){return {idx:x.idx,ch:x.ch,name:x.name};})));
    state.lessonOptions=opts.map(function(x){return x.idx;});
    bubble='<strong>Мини-задание</strong>Найди букву '+l.name+'. Выбери её среди четырёх вариантов!';
    bottomButton='<button class="btn btn-primary" data-action="skip-to-write">Потренировать письмо →</button>';
    rightPanel='<div class="eyebrow">ПРОВЕРЬ СЕБЯ</div><h2>Где буква '+l.name+'?</h2><p>Вспомни форму и точки, а затем нажми на правильную букву.</p><div class="answer-grid">'+opts.map(function(x){return '<button class="answer-option" data-action="lesson-answer" data-i="'+x.idx+'"><span class="arabic" style="font-size:34px">'+x.ch+'</span><br><small>'+x.name+'</small></button>';}).join('')+'</div><div id="lesson-feedback" class="feedback">'+(quizFeedback||'Ты справишься!')+'</div>';
  }else{
    bubble='<strong>Почти готово!</strong>Обведи букву на карточке. Можно рисовать пальцем, мышью или стилусом.';
    bottomButton='<button class="btn btn-primary" data-action="complete-lesson">Завершить урок <span>+20 XP</span></button>';
    rightPanel='<div class="eyebrow">МАСТЕРСКАЯ ПИСЬМА</div><h2>Попробуй обвести</h2><p>Веди пальцем по пунктирной линии и почувствуй форму буквы.</p><div class="writing-pad"><span class="trace-guide arabic" lang="ar" dir="rtl">'+l.ch+'</span><canvas id="trace-canvas" aria-label="Поле для тренировки написания арабской буквы"></canvas></div><div class="panel-bottom"><p>Ничего страшного, если с первого раза не получится.</p><button class="text-link" data-action="clear-canvas">Очистить ↻</button></div>';
  }
  const dots=steps.map(function(s,i){return '<span class="'+(i===step?'active':'')+'"></span>';}).join('');
  const walking=step===1?'walk':'';
  return '<div class="page-heading"><div><div class="eyebrow">УРОК '+String(state.letter+1).padStart(2,'0')+' · ОСТРОВ БУКВ</div><h1>Знакомимся: '+l.name+'</h1><p>Учимся через историю, слух, игру и движение — маленькими шагами.</p></div><button class="btn btn-ghost btn-small" data-route="letters">← К буквам</button></div><div class="lesson-layout"><section class="panel lesson-main"><div class="lesson-topline"><span>'+steps[step].toUpperCase()+'</span><span>Шаг '+(step+1)+' из 4</span></div><div class="progress-line"><i style="width:'+((step+1)/4*100)+'%"></i></div><div class="lesson-scene"><span class="lesson-sun"></span><span class="lesson-cloud">☁</span><div class="lesson-bubble" id="lesson-bubble">'+bubble+'</div><span class="lesson-object">'+word.emoji+'</span><img class="lesson-character '+walking+'" id="lesson-character" src="./assets/rabbit.svg" alt="Али идёт знакомиться с буквой"><div class="lesson-letter '+(step===1?'reveal':'')+'" id="lesson-letter"><span class="arabic" lang="ar" dir="rtl">'+l.ch+'</span><small>'+l.name+'</small></div><span class="scene-caption">ТРОПИНКА НОВЫХ ОТКРЫТИЙ</span></div><div class="lesson-bottom"><p>★ За урок ты получишь 20 XP</p>'+bottomButton+'</div><div class="step-dots">'+dots+'</div></section><aside class="panel lesson-info">'+rightPanel+'</aside></div>';
}
function renderCelebration(){
  const completed=LETTERS[state.justCompleted==null?0:state.justCompleted],next=nextLetter(),all=state.learned.length>=28;
  const nextL=LETTERS[next];
  const title=all?'Ты прошёл весь алфавит!':'Буква '+completed.name+' теперь в твоей коллекции!';
  const sub=all?'Все 28 букв знакомы тебе. Это большая победа — впереди слова, фразы и новые игры.':'Каждый урок делает тебя увереннее. Отдохни мгновение, а потом отправляйся знакомиться со следующей буквой.';
  return '<section class="celebration-wrap page-enter"><div class="celebration-top"><span class="celebration-confetti">✦</span><span class="celebration-confetti">✧</span><span class="celebration-confetti">✦</span><span class="celebration-confetti">★</span><span class="celebration-confetti">✧</span></div><div class="surface celebration-card"><div class="celebration-ribbon">🏆 УРОК ЗАВЕРШЁН</div><div class="celebration-main"><div class="celebration-character"><span class="celebration-orbit orbit-one">✦</span><span class="celebration-orbit orbit-two">⭐</span><span class="celebration-orbit orbit-three">✧</span><img src="./assets/rabbit.svg" alt="Али радуется твоей победе"></div><div class="celebration-copy"><span class="pill">✨ МАЛЕНЬКАЯ ПОБЕДА</span><h1>'+title+'</h1><p>'+sub+'</p><div class="celebration-rewards"><div><span>⭐</span><strong>+20 XP</strong><small>за урок</small></div><div><span>🔤</span><strong>'+state.learned.length+' / 28</strong><small>букв знакомы</small></div><div><span>🔥</span><strong>'+state.streak+'</strong><small>дней подряд</small></div></div><div class="celebration-progress"><div class="progress-line"><i style="width:'+(state.learned.length/28*100)+'%"></i></div><small>'+Math.round(state.learned.length/28*100)+'% алфавита открыто</small></div><div class="hero-actions"><button class="btn btn-primary" data-action="next-letter">'+(all?'Повторить буквы':'Встречаем '+nextL.name)+' <span>→</span></button><button class="btn btn-ghost" data-route="path">На карту приключений</button></div></div></div></div><div class="celebration-footer">🌷 Ты старался — и это главное. Али тобой гордится! 🌷</div></section>';
}
function renderWords(){
  const cats=CATEGORIES.map(function(c){return '<button class="filter-btn '+(state.wordFilter===c.id?'active':'')+'" data-action="word-filter" data-filter="'+c.id+'">'+c.label+'</button>';}).join('');
  const matching=WORDS.filter(function(w){const q=(state.search||'').toLowerCase();return (state.wordFilter==='all'||w.cat===state.wordFilter)&&(!q||(w.ru+' '+w.tr+' '+w.ar).toLowerCase().indexOf(q)>=0);});
  const cards=matching.map(function(w){return '<article class="word-card"><button class="word-sound" data-action="speak-word-index" data-word="'+WORDS.indexOf(w)+'" aria-label="Послушать слово '+w.ru+'">🔊</button><span class="word-art">'+w.emoji+'</span><span class="arabic" lang="ar" dir="rtl">'+w.ar+'</span><strong>'+w.ru+'</strong><small>'+w.tr+'</small></article>';}).join('');
  return headerOf('САД СЛОВ','Собираем словарик','Каждая карточка — новое слово. Слушай, повторяй и замечай знакомую букву в начале.',true)+'<div class="filter-row"><label class="search-box"><span>⌕</span><input id="word-search" type="search" value="'+esc(state.search||'')+'" placeholder="Найти слово по-русски или по-арабски" aria-label="Поиск по словарю"></label>'+cats+'</div><div class="panel-head"><div><h3>Слова в твоём саду</h3><small>Нажми на 🔊, чтобы услышать арабское произношение</small></div><span class="pill">'+matching.length+' слов</span></div><div class="word-grid">'+(cards||'<div class="empty-state"><span class="empty-icon">🌱</span><strong>Такого слова пока нет</strong><p>Попробуй другой запрос.</p></div>')+'</div>';
}
function renderPhrases(){
  const cards=PHRASES.map(function(p,i){return '<article class="phrase-card"><span class="phrase-icon">'+p.emoji+'</span><div><span class="arabic" lang="ar" dir="rtl">'+p.ar+'</span><strong>'+p.ru+'</strong><small>'+p.tr+'</small><small>'+p.note+'</small></div><button class="sound-button" data-action="speak-phrase" data-i="'+i+'" aria-label="Послушать фразу">🔊</button></article>';}).join('');
  return headerOf('ПЛОЩАДЬ ФРАЗ','Первые разговоры','Не обязательно знать все буквы, чтобы начать говорить. Начни с простых слов и приветствий.',true)+'<div class="mission-strip"><span class="mission-icon">💬</span><div><b>Миссия: поздоровайся с Али</b><p>Послушай «مَرْحَبًا» и повтори вслух. Улыбка тоже часть общения!</p></div><button class="btn btn-primary btn-small" data-action="speak-phrase" data-i="0">Послушать 🔊</button></div><div class="phrase-list">'+cards+'</div><section class="panel"><div class="panel-head"><h3>Собери свой первый диалог</h3><span class="pill">3 реплики</span></div><p style="font-size:11px;line-height:1.8;color:var(--ink-soft)">Али: <span class="arabic">مَرْحَبًا!</span> — Привет!<br>Ты: <span class="arabic">مَرْحَبًا!</span> — Привет!<br>Али: <span class="arabic">مَا اسْمُكَ؟</span> — Как тебя зовут?</p><button class="btn btn-purple" data-action="speak-dialog">Послушать диалог целиком ↗</button></section>';
}
function renderGames(){
  if(state.game&&state.game.kind)return renderGameStage();
  const cards=GAME_DEFS.map(function(g){return '<button class="game-card" data-action="start-game" data-game="'+g.id+'"><span class="game-big-icon">'+g.icon+'</span><strong>'+g.title+'</strong><p>'+g.desc+'</p><span class="game-foot"><span>'+g.reward+'</span><span>→</span></span></button>';}).join('');
  return headerOf('ИГРОВАЯ ДОЛИНА','Проверим, что ты запомнил?','Играй, пробуй ещё раз и зарабатывай XP. Ошибка — не проигрыш, а подсказка для нового шага.',true)+'<div class="daily-card"><div class="daily-top"><strong>🎯 Игровая миссия дня</strong><span>'+(state.missions.game?'✓ Выполнено':'+10 XP')+'</span></div><p class="tiny muted">Заверши один игровой раунд. Али будет болеть за тебя!</p><div class="daily-dots"><i class="'+(state.missions.game?'done':'')+'"></i><i class="'+(state.missions.game?'done':'')+'"></i><i class="'+(state.missions.game?'done':'')+'"></i></div></div><div class="section-head"><div><div class="eyebrow">ВЫБЕРИ ПРИКЛЮЧЕНИЕ</div><h2>Во что сыграем?</h2><p>В каждом режиме — короткие раунды и награда за старание.</p></div></div><div class="game-grid">'+cards+'</div>';
}
function startGame(kind){
  const targetIds=shuffle(LETTERS.map(function(l,i){return i;})).slice(0,5);
  if(kind==='memory'){
    const picks=shuffle(LETTERS.slice(0,12)).slice(0,4);
    const deck=[];
    picks.forEach(function(l,i){deck.push({key:'l'+i,pair:LETTERS.indexOf(l),type:'letter',txt:l.ch,ar:true});deck.push({key:'w'+i,pair:LETTERS.indexOf(l),type:'word',txt:letterWord(l).emoji+' '+letterWord(l).ru,ar:false});});
    state.game={kind:kind,deck:shuffle(deck),flipped:[],matched:[],moves:0,done:false,rewarded:false};
  }else{
    state.game={kind:kind,round:0,score:0,targets:targetIds,done:false,rewarded:false,answered:false};
    state.game.target=targetIds[0];
    state.game.options=makeGameOptions(kind,state.game.target);
  }
  render();
}
function makeGameOptions(kind,target){
  if(kind==='listen'){
    const good=WORDS.find(function(w){return w.idx===target;})||WORDS[0];
    return shuffle([good].concat(randomItems(WORDS,2,target)));
  }
  if(kind==='mail'){
    const good=WORDS.find(function(w){return w.idx===target;})||WORDS[target];
    return shuffle([good].concat(randomItems(WORDS.filter(function(w){return w.idx!==target;}),2)));
  }
  const good={idx:target,ch:LETTERS[target].ch,name:LETTERS[target].name};
  return shuffle([good].concat(LETTERS.map(function(l,i){return {idx:i,ch:l.ch,name:l.name};}).filter(function(l){return l.idx!==target;}).sort(function(){return Math.random()-.5;}).slice(0,2)));
}
function gameTarget(){return state.game&&state.game.targets[state.game.round]!==undefined?state.game.targets[state.game.round]:0;}
function renderGameStage(){
  const g=state.game,kind=g.kind;
  const meta=GAME_DEFS.find(function(x){return x.id===kind;});
  if(kind==='memory'){
    const board=g.deck.map(function(c,i){const shown=g.flipped.indexOf(i)>=0||g.matched.indexOf(i)>=0;let face='?';if(shown)face=c.ar?'<span class="arabic">'+c.txt+'</span>':esc(c.txt);return '<button class="memory-card '+(shown?'open ':'')+(g.matched.indexOf(i)>=0?'matched':'')+'" data-action="memory-pick" data-card="'+i+'">'+face+'</button>';}).join('');
    const done=g.matched.length===g.deck.length;
    if(done&&!g.rewarded){g.rewarded=true;g.done=true;addXP(30);markMission('game');state.gamesPlayed++;saveState();}
    return '<div class="game-stage"><div class="game-stage-top"><div><div class="eyebrow">ИГРА · ПАМЯТЬ</div><h2>Найди пары</h2><p class="tiny muted">Соедини букву с карточкой слова, которое начинается с неё.</p></div><button class="btn btn-ghost btn-small" data-action="leave-game">Выйти ✕</button></div><div class="panel" style="margin-top:15px"><div class="panel-head"><span class="pill">Ходов: '+g.moves+'</span><span class="pill">'+g.matched.length/2+' / 4 пары</span></div><div class="game-play-area"><div class="memory-grid">'+board+'</div><div class="game-status">'+(done?'Ура! Все пары найдены. +30 XP!':'Открывай две карточки и ищи совпадение.')+'</div>'+(done?'<button class="btn btn-primary" data-action="leave-game">Забрать награду ✓</button>':'')+'</div></div></div>';
  }
  const target=LETTERS[g.target]||LETTERS[0];
  const word=letterWord(target);
  let prompt='',options='',soundButton='';
  if(kind==='catch'){
    prompt='Какой буквой начинается это слово?';
    soundButton='<button class="btn btn-ghost btn-small" data-action="game-speak">🔊 Послушать слово</button>';
    options=g.options.map(function(l){return '<button data-action="game-answer" data-i="'+l.idx+'"><span class="arabic">'+l.ch+'</span><small>'+l.name+'</small></button>';}).join('');
  }else if(kind==='mail'){
    prompt='Какое письмо отправим? Найди слово, которое начинается с этой буквы.';
    options=g.options.map(function(w){return '<button data-action="game-answer-word" data-word="'+WORDS.indexOf(w)+'">'+w.emoji+'<small>'+w.ru+'</small><span class="arabic" style="font-size:23px">'+w.ar+'</span></button>';}).join('');
  }else{
    prompt='Как переводится услышанное слово?';
    soundButton='<button class="btn btn-ghost btn-small" data-action="game-speak">🔊 Послушать слово</button>';
    options=g.options.map(function(w){return '<button data-action="game-answer-word" data-word="'+WORDS.indexOf(w)+'">'+w.emoji+'<small>'+w.ru+'</small></button>';}).join('');
  }
  const complete=g.done;
  return '<div class="game-stage"><div class="game-stage-top"><div><div class="eyebrow">ИГРА · '+(meta?meta.title.toUpperCase():'ПРИКЛЮЧЕНИЕ')+'</div><h2>'+(complete?'Раунд пройден!':meta.title)+'</h2><p class="tiny muted">'+(complete?'Ты справился — забери свою награду.':'Раунд '+(g.round+1)+' из 5 · правильных ответов: '+g.score)+'</p></div><button class="btn btn-ghost btn-small" data-action="leave-game">Выйти ✕</button></div><div class="panel" style="margin-top:15px"><div class="progress-line"><i style="width:'+(complete?100:(g.round/5*100))+'%"></i></div><div class="game-play-area"><div class="game-target">'+(kind==='listen'?word.emoji:kind==='mail'?'📮':word.emoji)+'</div><h3>'+(kind==='listen'?'<span class="arabic">'+word.ar+'</span>':kind==='mail'?'<span class="arabic">'+target.ch+'</span>':'<span class="arabic">'+word.ar+'</span>')+'</h3><p class="tiny muted">'+prompt+'</p>'+soundButton+(complete?'<div class="game-status">Ты набрал '+g.score+' из 5! Награда: '+(15+g.score*3)+' XP ⭐</div><button class="btn btn-primary" data-action="finish-game">Забрать награду →</button>':'<div class="game-options">'+options+'</div><div class="game-status" id="game-status">'+(g.answered?'Хорошая попытка! Переходим дальше…':'')+'</div>')+'</div></div></div>';
}
function renderProfile(){
  const earned=BADGES.filter(function(b){return b.ok(state);});
  const badgeHtml=BADGES.map(function(b){const ok=b.ok(state);return '<div class="achievement '+(ok?'unlocked':'locked')+'"><span class="badge-art">'+b.icon+'</span><strong>'+b.title+'</strong><small>'+b.desc+'</small></div>';}).join('');
  return headerOf('ТВОИ ДОСТИЖЕНИЯ','Посмотри, как ты вырос!','Каждый урок оставляет след на твоём пути. Здесь живут твои звёзды, знакомые буквы и маленькие победы.',false)+'<section class="surface profile-hero"><div class="profile-avatar"><img src="./assets/rabbit.svg" alt="Али, твой помощник"></div><div><div class="eyebrow">ЮНЫЙ ИССЛЕДОВАТЕЛЬ</div><h2>Друг арабского мира</h2><p>Продолжай учиться понемногу каждый день. Всё, что ты уже изучил, останется в твоей коллекции на этом устройстве.</p></div><div class="level-stamp"><strong>'+xpLevel()+'</strong><small>ТВОЙ УРОВЕНЬ</small></div></section><div class="profile-stats"><div class="profile-stat"><span>⭐</span><strong>'+state.xp+'</strong><small>XP опыта</small></div><div class="profile-stat"><span>🔤</span><strong>'+state.learned.length+'/28</strong><small>изучено букв</small></div><div class="profile-stat"><span>🔥</span><strong>'+state.streak+'</strong><small>дней подряд</small></div><div class="profile-stat"><span>🎧</span><strong>'+state.wordsHeard+'</strong><small>прослушано слов</small></div></div><section class="panel" style="margin-bottom:15px"><div class="panel-head"><div><h3>До следующего уровня</h3><small>Каждый урок приносит XP</small></div><span class="pill">'+xpIntoLevel()+' / 100 XP</span></div><div class="progress-line"><i style="width:'+xpIntoLevel()+'%"></i></div><div class="panel-bottom"><p>Осталось ещё '+(100-xpIntoLevel())+' XP</p><strong class="tiny">Уровень '+xpLevel()+'</strong></div></section><div class="section-head"><div><div class="eyebrow">КОЛЛЕКЦИЯ НАГРАД</div><h2>Мои значки</h2><p>Открыто '+earned.length+' из '+BADGES.length+' достижений.</p></div></div><div class="badge-grid">'+badgeHtml+'</div><div class="panel" style="margin:18px 0 40px"><div class="panel-head"><h3>Настройки приключения</h3></div><p class="tiny muted">Прогресс хранится только в этом браузере. При очистке данных браузера он может исчезнуть.</p><div class="panel-bottom"><button class="btn btn-ghost btn-small" data-action="sound-toggle">🔊 Настройки звука</button><button class="text-link" data-action="reset-progress">Сбросить весь прогресс</button></div></div>';
}
function wireWordSearch(){
  const input=document.getElementById('word-search');if(!input)return;
  input.addEventListener('input',function(){state.search=input.value;const pos=input.selectionStart;render();const next=document.getElementById('word-search');if(next){next.focus();next.setSelectionRange(pos,pos);}});
}
function wireCanvas(){
  const canvas=document.getElementById('trace-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2);
  const rect=canvas.getBoundingClientRect();canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.scale(dpr,dpr);
  ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#6544d9';
  let down=false,last=null;
  function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  canvas.addEventListener('pointerdown',function(e){down=true;last=pos(e);canvas.setPointerCapture(e.pointerId);e.preventDefault();});
  canvas.addEventListener('pointermove',function(e){if(!down)return;const p=pos(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault();});
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){canvas.addEventListener(ev,function(){down=false;last=null;});});
  canvas.clear=function(){ctx.clearRect(0,0,canvas.width,canvas.height);};
}
function clearCanvas(){const c=document.getElementById('trace-canvas');if(c&&c.clear)c.clear();}
function showModal(title,body,buttons){
  const root=document.getElementById('modal-root');if(!root)return;
  root.innerHTML='<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal-card"><h2>'+title+'</h2><p>'+body+'</p><div class="modal-actions">'+buttons+'</div></div></div>';
}
function closeModal(){const root=document.getElementById('modal-root');if(root)root.innerHTML='';}
function finishLetter(){
  const i=state.letter;state.justCompleted=i;
  if(state.learned.indexOf(i)<0){state.learned.push(i);state.learned.sort(function(a,b){return a-b;});addXP(20);}
  else{addXP(5);}
  markMission('lesson');state.lessonStep=0;quizFeedback='';route('celebration');
}
function answerLetter(i){
  const target=state.letter,fb=document.getElementById('lesson-feedback');
  document.querySelectorAll('[data-action="lesson-answer"]').forEach(function(b){b.disabled=true;if(Number(b.dataset.i)===target)b.classList.add('correct');});
  if(i===target){quizFeedback='Именно так! Ты нашёл '+LETTERS[target].name+'!';if(fb){fb.textContent=quizFeedback;fb.classList.remove('bad');}addXP(3);setTimeout(function(){state.lessonStep=3;render();},650);}
  else{quizFeedback='Почти! Посмотри на форму и точки, затем попробуй ещё раз.';if(fb){fb.textContent=quizFeedback;fb.classList.add('bad');}const b=document.querySelector('[data-action="lesson-answer"][data-i="'+i+'"]');if(b)b.classList.add('incorrect');setTimeout(function(){document.querySelectorAll('[data-action="lesson-answer"]').forEach(function(x){x.disabled=false;x.classList.remove('incorrect');});},650);}
}
function advanceGame(correct){
  const g=state.game;if(!g||g.done||g.answered)return;
  g.answered=true;
  if(correct){g.score++;addXP(2);toast('Правильно! +2 XP ⭐');}
  else toast('Хорошая попытка! Давай запомним это слово.');
  state.answers++;saveState();
  const status=document.getElementById('game-status');if(status)status.textContent=correct?'Верно! Отличная работа!':'Не страшно — правильный ответ уже подсвечен.';
  document.querySelectorAll('.game-options button').forEach(function(b){b.disabled=true;});
  const target=g.target;
  if(g.kind==='catch'){
    document.querySelectorAll('.game-options button').forEach(function(b){if(Number(b.dataset.i)===target)b.classList.add('correct');});
  }else{
    const answerWord=WORDS.find(function(w){return WORDS.indexOf(w)===Number(document.querySelector('.game-options button:focus')?.dataset.word);});
    document.querySelectorAll('.game-options button').forEach(function(b){if(Number(b.dataset.word)===WORDS.findIndex(function(w){return w.idx===target;}))b.classList.add('correct');});
  }
  setTimeout(function(){
    if(!state.game||state.game!==g)return;
    if(g.round>=4){g.done=true;g.answered=false;render();return;}
    g.round++;g.target=g.targets[g.round];g.options=makeGameOptions(g.kind,g.target);g.answered=false;render();
  },850);
}
function pickMemory(i){
  const g=state.game;if(!g||g.kind!=='memory'||g.done)return;
  if(g.flipped.indexOf(i)>=0||g.matched.indexOf(i)>=0||g.flipped.length>=2)return;
  g.flipped.push(i);render();
  if(g.flipped.length===2){
    g.moves++;
    const a=g.deck[g.flipped[0]],b=g.deck[g.flipped[1]];
    if(a.pair===b.pair&&a.type!==b.type){
      g.matched=g.matched.concat(g.flipped);g.flipped=[];addXP(3);
      if(g.matched.length===g.deck.length){g.done=true;if(!g.rewarded){g.rewarded=true;addXP(20);markMission('game');state.gamesPlayed++;saveState();}}
      setTimeout(render,320);
    }else{
      if(memoryTimeout)clearTimeout(memoryTimeout);
      memoryTimeout=setTimeout(function(){if(state.game===g){g.flipped=[];render();}},850);
    }
  }
}
function handleAction(action,el){
  const i=Number(el.dataset.i);
  if(action==='continue'){state.letter=nextLetter();state.lessonStep=0;quizFeedback='';route('lesson');return;}
  if(action==='next-letter'){state.letter=nextLetter();state.lessonStep=0;quizFeedback='';state.game=null;route(state.learned.length>=28?'letters':'lesson');return;}
  if(action==='open-letter'){
    if(!isUnlocked(i)){toast('Сначала закончи предыдущий урок — и эта буква откроется! 🔒');return;}
    state.letter=i;state.lessonStep=0;quizFeedback='';route('lesson');return;
  }
  if(action==='meet-letter'){
    const character=document.getElementById('lesson-character'),letter=document.getElementById('lesson-letter'),bubble=document.getElementById('lesson-bubble');
    if(character)character.classList.add('walk');if(letter)letter.classList.add('reveal');
    if(bubble)bubble.innerHTML='<strong>Вот она! Это '+currentLetter().name+'!</strong>Буква улыбается тебе. Послушай её и посмотри, чем она отличается от других.';
    speak(currentLetter().ch);el.textContent='Познакомились — дальше →';el.dataset.action='lesson-next';return;
  }
  if(action==='lesson-next'){
    state.lessonStep=Math.min(2,state.lessonStep+1);quizFeedback='';render();return;
  }
  if(action==='lesson-answer'){answerLetter(i);return;}
  if(action==='skip-to-write'){state.lessonStep=3;render();return;}
  if(action==='speak-letter'){speak(currentLetter().ch);return;}
  if(action==='speak-word'){speak(letterWord(currentLetter()).ar);state.wordsHeard++;markMission('listen');return;}
  if(action==='clear-canvas'){clearCanvas();return;}
  if(action==='complete-lesson'){finishLetter();return;}
  if(action==='word-filter'){state.wordFilter=el.dataset.filter;render();return;}
  if(action==='speak-word-index'){const w=WORDS[Number(el.dataset.word)];if(w){speak(w.ar);state.wordsHeard++;markMission('listen');saveState();}return;}
  if(action==='speak-phrase'){const p=PHRASES[Number(el.dataset.i)];if(p)speak(p.ar);markMission('listen');return;}
  if(action==='speak-dialog'){speak(PHRASES[0].ar+' ... '+PHRASES[4].ar+' ... '+PHRASES[5].ar+' ... '+PHRASES[1].ar);markMission('listen');return;}
  if(action==='start-game'){state.game=null;startGame(el.dataset.game);return;}
  if(action==='leave-game'){state.game=null;route('games');return;}
  if(action==='game-speak'){const g=state.game;if(g){const l=LETTERS[g.target];const w=WORDS.find(function(x){return x.idx===g.target;});speak(w?w.ar:l.ch);markMission('listen');}return;}
  if(action==='game-answer'){const g=state.game;if(g)advanceGame(Number(el.dataset.i)===g.target);return;}
  if(action==='game-answer-word'){
    const g=state.game;if(!g)return;const selected=WORDS[Number(el.dataset.word)];advanceGame(!!selected&&(g.kind==='listen'?selected.idx===g.target:selected.idx===g.target));return;
  }
  if(action==='finish-game'){
    const g=state.game;if(g&&!g.rewarded){g.rewarded=true;addXP(15+g.score*3);markMission('game');state.gamesPlayed++;saveState();}
    state.game=null;route('games');toast('Награда твоя! '+(15+(g?g.score:0)*3)+' XP 🏆');return;
  }
  if(action==='memory-pick'){pickMemory(Number(el.dataset.card));return;}
  if(action==='sound-toggle'){toggleSound();return;}
  if(action==='reset-progress'){showModal('Начать заново?','Все выученные буквы, XP и награды на этом устройстве будут сброшены. Это нельзя отменить.','<button class="btn btn-ghost" data-action="close-modal">Оставить</button><button class="btn btn-primary" data-action="confirm-reset">Сбросить прогресс</button>');return;}
  if(action==='close-modal'){closeModal();return;}
  if(action==='confirm-reset'){const old=state;state=freshState();state.lastVisit=old.lastVisit;state.streak=old.streak;visitToday();state.game=null;closeModal();route('home');toast('Начинаем новое приключение!');return;}
}
function toggleSound(){
  const off=localStorage.getItem('ali-academy-sound')==='off';
  localStorage.setItem('ali-academy-sound',off?'on':'off');
  const b=document.getElementById('sound-toggle');if(b)b.textContent=off?'🔊':'🔇';
  toast(off?'Звук включён':'Звук выключен');if(off)speak('مرحبا');
}
function about(){
  showModal('Для родителей','Это игровое знакомство с арабским алфавитом для русскоязычных детей. Задания короткие, прогресс сохраняется только в этом браузере. Нажатие на 🔊 использует голос, доступный на устройстве. Русская транскрипция является только приблизительной подсказкой. Для точного произношения полезно заниматься с преподавателем арабского языка.','<button class="btn btn-primary" data-action="close-modal">Понятно</button>');
}
document.addEventListener('click',function(e){
  const routeEl=e.target.closest('[data-route]');if(routeEl){e.preventDefault();route(routeEl.dataset.route);return;}
  const actionEl=e.target.closest('[data-action]');if(actionEl){handleAction(actionEl.dataset.action,actionEl);return;}
});
document.getElementById('sound-toggle').addEventListener('click',toggleSound);
document.getElementById('mobile-menu').addEventListener('click',function(){document.getElementById('mobile-nav').classList.toggle('open');});
document.getElementById('about-button').addEventListener('click',about);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();document.getElementById('mobile-nav').classList.remove('open');}});
visitToday();
if(location.hash&&['home','path','letters','words','phrases','games','profile'].indexOf(location.hash.slice(1))>=0)state.view=location.hash.slice(1);
render();
