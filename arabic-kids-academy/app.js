'use strict';

const LETTERS = [
  {ch:'ا',name:'Алиф',ar:'ألف',sound:'а',shape:'прямую палочку, как свеча',dots:'Точек нет',word:'أسد',trans:'асад',ru:'лев',emoji:'🦁',hint:'Алиф похож на высокую прямую линию. Он не соединяется со следующей буквой слева.'},
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
  {ar:'أسد',ru:'лев',tr:'асад',emoji:'🦁',cat:'animals',idx:0},
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
const OBJECT_ARTS=['lion','duck','apple','fox','camel','horse','sheep','bear','corn','pomegranate','giraffe','fish','sun','eagle','frog','airplane','envelope','eye','cloud','elephant','moon','book','lemon','banana','bee','crescent','rose','hand'];
const EXTRA_WORD_ARTS={'ماء':'water','باب':'door','بيت':'house','قلب':'heart'};
const PHRASE_ARTS=['hand','heart','sun','crescent','eye','lion','cloud','rose'];
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
  {id:'catch',art:'hop-game',title:'Прыжки по буквам',desc:'Услышь слово и прыгни на правильную букву.',reward:'5 прыжков',tint:'lilac'},
  {id:'mail',art:'mail-game',title:'Почта слов',desc:'Отправь в домик буквы только подходящие слова.',reward:'5 посылок',tint:'blue'},
  {id:'memory',art:'memory-game',title:'Секретные пары',desc:'Переворачивай карточки и знакомь букву с её другом.',reward:'4 пары',tint:'peach'},
  {id:'listen',art:'listen-game',title:'Ушки на макушке',desc:'Послушай слово и найди нужную картинку.',reward:'5 звуков',tint:'mint'}
];
const BADGES = [
 {id:'first',art:'sun',title:'Первый шаг',desc:'Закончи свой первый урок',ok:s=>s.learned.length>=1},
 {id:'letters5',art:'book-icon',title:'Любопытный ученик',desc:'Изучи 5 букв',ok:s=>s.learned.length>=5},
 {id:'letters10',art:'map-icon',title:'Исследователь',desc:'Изучи 10 букв',ok:s=>s.learned.length>=10},
 {id:'letters28',art:'starburst',title:'Хозяин алфавита',desc:'Изучи все 28 букв',ok:s=>s.learned.length>=28},
 {id:'word5',art:'pomegranate',title:'Коллекционер слов',desc:'Послушай 5 слов',ok:s=>s.wordsHeard>=5},
 {id:'game',art:'hop-game',title:'Игрок',desc:'Заверши первую игру',ok:s=>s.gamesPlayed>=1},
 {id:'xp100',art:'crescent',title:'Сто звёздных шагов',desc:'Набери 100 XP',ok:s=>s.xp>=100},
 {id:'streak3',art:'sun',title:'Привычка растёт',desc:'Занимайся 3 дня подряд',ok:s=>s.streak>=3}
];
const STORE_KEY = 'ali-academy-progress-v5';
function emptyLessonChecks(){return {heardLetter:false,repeated:false,foundFriend:false,initialTapped:false,heardWord:false,repeatedWord:false};}
function freshState(){return {learned:[],xp:0,stars:0,streak:0,lastVisit:'',view:'home',letter:0,lessonStep:0,wordFilter:'all',search:'',wordsHeard:0,wordsFound:0,gamesPlayed:0,answers:0,missions:{},missionDate:'',game:null,levelOpen:false,writeReady:false,readingIndex:0,readingAnswer:'',readingCompleted:false,lessonChecks:emptyLessonChecks(),revealedWords:[],revealedPhrases:[],phraseTask:0,phraseAnswer:null,phraseFeedback:''};}
function loadState(){
  try{
    const raw=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    if(!raw)return freshState();
    const s=Object.assign(freshState(),raw);
    if(!Array.isArray(s.learned))s.learned=[];
    s.learned=s.learned.filter(n=>Number.isInteger(n)&&n>=0&&n<28);
    s.xp=Math.max(0,Number(s.xp)||0);s.stars=Math.max(0,Number(s.stars)||0);
    if(!s.missions||typeof s.missions!=='object')s.missions={};
    s.lessonChecks=Object.assign(emptyLessonChecks(),s.lessonChecks||{});
    if(!Array.isArray(s.revealedWords))s.revealedWords=[];
    if(!Array.isArray(s.revealedPhrases))s.revealedPhrases=[];
    if(!Number.isInteger(s.phraseTask)||s.phraseTask<0||s.phraseTask>3)s.phraseTask=0;
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
  const xp=document.getElementById('xp-count');
  if(xp)xp.textContent=state.stars;
  document.querySelectorAll('.nav-link').forEach(function(b){b.classList.toggle('active',b.dataset.route===state.view||((state.view==='lesson'||state.view==='celebration')&&b.dataset.route==='letters')||(state.view==='profile'&&b.dataset.route==='profile')||(state.view==='phrases'&&b.dataset.route==='words'||state.view==='reading'&&b.dataset.route==='reading'));});
}
function canVisit(view){
  if(view==='reading'&&state.learned.length<3&&!state.readingCompleted)return false;
  if(view==='phrases'&&state.learned.length<3)return false;
  if(view==='words'&&state.learned.length<1)return false;
  if(view==='games'&&state.learned.length<1)return false;
  return true;
}
function route(view){
  if(!view)view='home';
  if(!canVisit(view)){toast(view==='reading'?'Сначала открой 3 буквы — затем отправимся читать! 🔤':view==='phrases'?'Открой 3 буквы, чтобы встретить друзей! 🔤':'Сначала познакомься с первой буквой вместе с Али! 🐰');view='home';}
  state.view=view;saveState();
  const mobile=document.getElementById('mobile-nav');if(mobile)mobile.classList.remove('open');
  try{history.replaceState(null,'','#'+view);}catch(e){}
  render();
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function toast(msg){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(function(){el.classList.remove('show');},2500);}
let successEffectTimer=null;
function playRewardSound(){if(localStorage.getItem('ali-academy-sound')==='off')return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{const ctx=new AC(),now=ctx.currentTime;[659.25,783.99,987.77].forEach(function(freq,i){const o=ctx.createOscillator(),g=ctx.createGain(),t=now+i*.075;o.type='sine';o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.18);});setTimeout(function(){ctx.close();},420);}catch(e){}}
function showSuccessEffect(message){const root=document.getElementById('success-effects');if(!root)return;root.innerHTML='<div class="success-burst" role="status" aria-live="polite"><span class="success-star success-star-a">'+svgArt('starburst','success-star-svg')+'</span><span class="success-star success-star-b">'+svgArt('sparkle','success-star-svg')+'</span><span class="success-star success-star-c">'+svgArt('starburst','success-star-svg')+'</span><div class="success-rabbit-ring"><img src="./assets/rabbit.svg" alt=""></div><strong>'+esc(message||'Отлично!')+'</strong><small>Ты сделал это сам!</small></div>';root.classList.add('active');playRewardSound();clearTimeout(successEffectTimer);successEffectTimer=setTimeout(function(){root.classList.remove('active');root.innerHTML='';},1400);}
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
function svgArt(id,cls){
  const safe=String(id||'book').replace(/[^a-z0-9-]/gi,'');
  return '<svg class="'+esc(cls||'friend-art')+'" viewBox="0 0 160 160" aria-hidden="true" focusable="false"><use href="./assets/letter-friends.svg#'+safe+'"></use></svg>';
}
function artForWord(w){if(!w)return 'book';return EXTRA_WORD_ARTS[w.ar]||OBJECT_ARTS[Number(w.idx)]||'book';}
function letterWord(l){
  const idx=LETTERS.indexOf(l);
  const found=WORDS.find(function(w){return w.idx===idx;})||{ar:l.word,ru:l.ru,tr:l.trans,idx:idx};
  return Object.assign({},found,{idx:idx,art:OBJECT_ARTS[idx]||'book'});
}
function phraseArt(index){return PHRASE_ARTS[index]||'heart';}
function highlightedArabic(word){const chars=Array.from(String(word||''));const first=chars.shift()||'';return '<span class="arabic-word-initial">'+esc(first)+'</span><span class="arabic-word-rest">'+esc(chars.join(''))+'</span>';}

function headerOf(kicker,title,desc,includeRabbit){return '<div class="page-heading"><div><div class="eyebrow">'+kicker+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(includeRabbit===false?'':rabbit())+'</div>';}
function sectionTitle(kicker,title,desc,link,label){return '<div class="section-head"><div><div class="eyebrow">'+kicker+'</div><h2>'+title+'</h2>'+(desc?'<p>'+desc+'</p>':'')+'</div>'+(link?'<button class="text-link" data-route="'+link+'">'+(label||'Смотреть всё')+' →</button>':'')+'</div>';}
function missionDoneCount(){return ['lesson','game','listen'].filter(function(k){return !!state.missions[k];}).length;}
function render(){
  updateHeader();
  const app=document.getElementById('app');if(!app)return;
  const views={home:renderHome,path:renderPath,letters:renderLetters,lesson:renderLesson,celebration:renderCelebration,words:renderWords,phrases:renderPhrases,games:renderGames,profile:renderProfile,reading:renderReading};
  app.innerHTML='<div class="page-enter">'+(views[state.view]||renderHome)()+'</div>';
  app.focus({preventScroll:true});
  if(state.view==='lesson'&&state.lessonStep===3)wireCanvas();
  if(state.view==='words')wireWordSearch();
}
function renderHome(){
  const learned=state.learned.length,first=learned===0,complete=learned>=28;
  const worlds=[
    {id:'letters',art:'book',className:'island',title:'Остров букв',caption:learned===0?'Начнём с одной буквы':learned+' из 28',open:true},
    {id:'reading',art:'moon',className:'book',title:'Долина чтения',caption:state.readingCompleted?'Ты прошёл!':'Откроем вместе',open:learned>=3||state.readingCompleted},
    {id:'words',art:'rose',className:'garden',title:'Сад слов',caption:'Слова вокруг нас',open:learned>=1},
    {id:'games',art:'hop-game',className:'play',title:'Игровая поляна',caption:'Играй и вспоминай',open:learned>=1}
  ];
  const map=worlds.map(function(w){return '<button class="world-card '+w.className+' '+(w.open?'open':'locked')+'" data-action="home-world" data-world="'+w.id+'"><span class="world-card-art">'+svgArt(w.art,'world-art-svg')+'</span><span class="world-card-copy"><b>'+w.title+'</b><small>'+(w.open?w.caption:'🔒 Скоро откроется')+'</small></span><span class="world-card-arrow">'+(w.open?'→':'🔒')+'</span></button>';}).join('');
  return '<section class="adventure-home"><div class="adventure-copy"><span class="welcome-tag">ПРИВЕТ, ДРУГ!</span><h1>'+(first?'Привет! Я Али. Пойдём исследовать мир!':complete?'Ура! Ты собрал все буквы!':'Снова вместе! Куда пойдём сегодня?')+'</h1><p>'+(first?'Нас ждут приключения, новые слова и весёлые игры. Ты готов?':'Ты уже открыл '+learned+' '+plural(learned,['букву','буквы','букв'])+'. Давай узнаем что-нибудь ещё!')+'</p><button class="btn btn-primary adventure-cta" data-action="continue">'+(first?'Начать приключение':complete?'Выбрать новое приключение':'Продолжить путь')+' <span>→</span></button><div class="collection-chip"><span>⭐</span><span><b>'+state.stars+'</b> звёзд в рюкзаке</span><span class="collection-divider"></span><span><b>'+learned+'/28</b> букв</span></div></div><div class="adventure-stage" aria-label="Али готов к путешествию"><span class="stage-sun"></span><span class="stage-cloud stage-cloud-a">'+svgArt('cloud','stage-cloud-art')+'</span><span class="stage-cloud stage-cloud-b">'+svgArt('cloud','stage-cloud-art')+'</span><div class="stage-hill stage-hill-back"></div><div class="stage-hill stage-hill-front"></div><div class="stage-path"></div><div class="stage-sign"><span>'+svgArt('book','stage-sign-art')+'</span><b>Вперёд!</b></div><div class="stage-treasure">'+svgArt('memory-game','stage-treasure-art')+'<span>✦</span></div><img class="stage-rabbit" src="./assets/rabbit.svg" alt="Али, твой друг и проводник"><span class="stage-flower stage-flower-a">'+svgArt('rose','stage-flower-art')+'</span><span class="stage-flower stage-flower-b">'+svgArt('rose','stage-flower-art')+'</span><div class="stage-dialog"><b>Пойдём со мной!</b><span>Я покажу тебе удивительный мир!</span></div></div></section><section class="world-picker"><div class="world-picker-heading"><span class="eyebrow">КАРТА АЛИ</span><h2>Выбирай своё приключение</h2><p>Новые места открываются по мере игры.</p></div><div class="world-card-grid">'+map+'</div><div class="parent-link-row"><span>Учимся понемногу и радуемся каждому открытию.</span><button data-action="about">Для родителей</button></div></section>';
}
function plural(n,forms){const x=Math.abs(n)%100,y=x%10;if(x>10&&x<20)return forms[2];if(y>1&&y<5)return forms[1];if(y===1)return forms[0];return forms[2];}
const CURRICULUM=[
 {n:'01',title:'Знакомство с буквами',sub:'Форма, имя и первый звук',icon:'🔤',route:'letters',outcomes:['узнать графическую форму буквы','назвать букву по-русски и по-арабски','найти её в начале знакомого слова'],check:'Ученик узнаёт букву среди похожих вариантов.',status:'В работе'},
 {n:'02',title:'Похожие буквы и точки',sub:'Учимся замечать различия',icon:'🔎',route:'letters',outcomes:['сравнить семейства ب ت ث и ج ح خ','заметить положение и число точек','объяснить, чем отличаются похожие формы'],check:'Ученик не путает буквы одного семейства.',status:'Встроено в уроки'},
 {n:'03',title:'Короткие гласные',sub:'Фатха, касра и дамма',icon:'◌َ',route:'reading',outcomes:['узнать три коротких знака','прочитать слоги بَ بِ بُ','соотнести знак со звуком'],check:'Ученик правильно выбирает звук по огласовке.',status:'Практикум'},
 {n:'04',title:'Первый словарик',sub:'Слова из близкого ребёнку мира',icon:'🍎',route:'words',outcomes:['узнать названия животных и предметов','услышать слово и повторить его','заметить знакомую букву в слове'],check:'Ученик узнаёт слово по звучанию и смыслу.',status:'Открыто'},
 {n:'05',title:'Первые фразы',sub:'Приветствие и знакомство',icon:'💬',route:'phrases',outcomes:['поздороваться','поблагодарить','спросить имя и представиться'],check:'Ученик воспроизводит короткий диалог по образцу.',status:'Открыто'},
 {n:'06',title:'Повторение в игре',sub:'Память, выбор и аудирование',icon:'🎮',route:'games',outcomes:['различать знакомые буквы','вспоминать слова без подсказки','учиться на ошибках'],check:'Ученик переносит знания в новую игровую задачу.',status:'Открыто'}
];
function renderPath(){
 const learned=state.learned.length;
 const worlds=[
 {n:'01',art:'book-icon',title:'Остров букв',desc:'Узнай новую букву',route:'letters',open:true,progress:learned+'/28'},
 {n:'02',art:'crescent',title:'Долина чтения',desc:'Играй со звуками',route:'reading',open:learned>=3||state.readingCompleted,progress:state.readingCompleted?'Пройдено':'После 3 букв'},
 {n:'03',art:'rose',title:'Сад слов',desc:'Открывай слова',route:'words',open:learned>=1,progress:WORDS.length+' слов'},
 {n:'04',art:'hop-game',title:'Игровая поляна',desc:'Играй и вспоминай',route:'games',open:learned>=1,progress:'Играть'},
 {n:'05',art:'heart',title:'Площадь друзей',desc:'Разговаривай с Али',route:'phrases',open:learned>=3,progress:PHRASES.length+' фраз'}
 ];
 const cards=worlds.map(function(w){return '<button class="map-world '+(w.open?'open':'locked')+'" data-action="home-world" data-world="'+w.route+'"><span class="map-world-number">'+w.n+'</span><span class="map-world-art">'+svgArt(w.art,'map-world-art-svg')+'</span><strong>'+w.title+'</strong><small>'+w.desc+'</small><span class="map-world-state">'+(w.open?w.progress:'Сначала открой ещё несколько букв')+'</span><span class="map-world-arrow">'+(w.open?'→':svgArt('lock-icon','map-lock-svg'))+'</span></button>';}).join('');
 return '<section class="kid-path-page"><header class="path-kid-header"><button class="back-home" data-route="home">← Главная</button><span class="eyebrow">КАРТА ПРИКЛЮЧЕНИЙ</span><h1>Каждый шаг — открытие!</h1><p>Новые места открываются, когда ты осваиваешь новые умения.</p></header><div class="storybook-map"><div class="map-sky"><span class="map-cloud cloud-left">'+svgArt('cloud','map-cloud-svg')+'</span><span class="map-cloud cloud-right">'+svgArt('cloud','map-cloud-svg')+'</span><span class="map-sun">'+svgArt('sun','map-sun-svg')+'</span><svg class="map-trail" viewBox="0 0 700 600" preserveAspectRatio="none" aria-hidden="true"><path d="M350 35 C120 70 130 175 360 190 S590 295 350 335 S120 460 360 560" fill="none" stroke="#fff6d9" stroke-width="34" stroke-linecap="round"/><path d="M350 35 C120 70 130 175 360 190 S590 295 350 335 S120 460 360 560" fill="none" stroke="#e9c878" stroke-width="5" stroke-linecap="round" stroke-dasharray="3 15"/></svg>'+cards+'<img class="map-rabbit" src="./assets/rabbit.svg" alt="Али ведёт по маршруту"></div></div><div class="map-parent-link"><span>Не спеши — каждый шаг приносит новое умение.</span><button data-action="about">Для родителей</button></div></section>';
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
 const l=currentLetter(),w=letterWord(l),s=state.lessonStep,c=state.lessonChecks||emptyLessonChecks();
 const names=['Сюрприз','Буква','Друг','Слово','Игра','Письмо'];
 const progress='<div class="lesson-progress"><button class="back-home" data-route="home">← Выход</button><div class="lesson-progress-track"><div class="lesson-progress-dots">'+names.map(function(n,i){return '<span class="'+(i<=s?'on':'')+'"></span>';}).join('')+'</div><small>ШАГ '+(s+1)+' ИЗ 6</small></div></div>';
 if(s===0)return '<section class="kid-lesson lesson-journey">'+progress+'<div class="lesson-scene scene-discover"><span class="lesson-sun">'+svgArt('sun','scene-sun-art')+'</span><span class="lesson-cloud">'+svgArt('cloud','scene-cloud-art')+'</span><div class="lesson-bubble" id="lesson-bubble"><strong>Кто там спрятался?</strong>Али нашёл секрет за холмом. Поможешь ему?</div><img class="lesson-character" id="lesson-character" src="./assets/rabbit.svg" alt="Али зовёт в путешествие"><div class="lesson-letter mystery-card" id="lesson-letter"><span class="mystery-icon">'+svgArt('sparkle','mystery-svg')+'</span><small>СЕКРЕТ</small></div><span class="scene-caption">ОДНА МИССИЯ · ОДИН НОВЫЙ ШАГ</span></div><div class="lesson-action-area"><h1>Отправимся искать?</h1><p>Нажми — Али прыгнет к загадке.</p><button class="btn btn-primary kid-main-cta" data-action="meet-letter">Найти секрет <span>→</span></button></div></section>';
 if(s===1)return '<section class="kid-lesson">'+progress+'<div class="letter-only-stage"><div class="lesson-stage-kicker"><span class="stage-number">01</span><span>Знакомство</span><span class="stage-steps">Посмотри · Послушай · Повтори</span></div><div class="solo-letter-orbit"><span class="orbit-ring orbit-ring-a"></span><span class="orbit-ring orbit-ring-b"></span><span class="orbit-spark spark-left">'+svgArt('sparkle','sparkle-svg')+'</span><span class="orbit-spark spark-right">'+svgArt('sparkle','sparkle-svg')+'</span><button class="solo-letter-button '+(c.heardLetter?'letter-heard':'')+'" data-action="speak-letter" aria-label="Послушать букву '+l.name+'" lang="ar" dir="rtl">'+l.ch+'</button></div><div class="solo-letter-copy"><span class="pill">'+(c.heardLetter?'ЗВУК УЖЕ УСЛЫШАН':'НАЖМИ НА БОЛЬШУЮ БУКВУ')+'</span><h1>Привет, '+l.name+'!</h1><p>Сейчас знакомимся только с одной буквой. Нажми на неё, послушай звук и повтори вслух.</p><div class="sound-meter '+(c.heardLetter?'sound-meter-on':'')+'"><span class="sound-meter-icon">'+svgArt('ear-icon','ear-art')+'</span><div><b>'+(c.heardLetter?'Отлично, ты услышал!':'Слушаем внимательно')+'</b><small>Звук «'+l.sound+'» · '+l.dots+'</small></div><span class="sound-meter-check">'+(c.heardLetter?'✓':'1')+'</span></div><button class="btn btn-purple repeat-confirm" data-action="i-repeated" '+(!c.heardLetter||c.repeated?'disabled':'')+'>'+(c.repeated?'Я повторил! ✓':'Я повторил звук')+'</button><div class="lesson-gate-note">'+(c.repeated?'Здорово! Пора найти друга для буквы.':'Сначала послушай букву, затем повтори её.')+'</div><button class="btn btn-primary kid-main-cta" data-action="lesson-next" '+(!(c.heardLetter&&c.repeated)?'disabled':'')+'>Найдём друга! <span>→</span></button></div></div></section>';
 if(s===2)return '<section class="kid-lesson">'+progress+'<div class="friend-hunt-stage"><div class="lesson-stage-kicker"><span class="stage-number">02</span><span>Поиск друга</span><span class="stage-steps">Найди слово по первой букве</span></div><div class="friend-hunt-question"><p>Давай найдём слово, которое начинается с этой буквы!</p><div class="hunt-letter-clue"><span class="arabic" lang="ar" dir="rtl">'+l.ch+'</span><span><b>Звук «'+l.sound+'»</b><small>Кто будет другом буквы?</small></span></div></div><button class="friend-hunt-object '+(c.foundFriend?'friend-found':'')+'" data-action="find-word-friend" aria-label="Оживить картинку"><span class="friend-hunt-ripple"></span>'+svgArt(w.art,'friend-hunt-svg')+'<span class="friend-hunt-label">'+(c.foundFriend?'Друг проснулся! ✓':'Нажми на рисунок, чтобы разбудить друга')+'</span></button><div class="friend-hunt-bottom"><img src="./assets/rabbit.svg" alt="Али"><p>'+(c.foundFriend?'Ура! Теперь узнаем, как зовут нового друга.':'Пока видим только картинку. Нажми на неё — слово откроется позже!')+'</p></div><button class="btn btn-primary kid-main-cta" data-action="lesson-next" '+(!c.foundFriend?'disabled':'')+'>Открыть слово <span>→</span></button></div></section>';
 if(s===3){
  const chars=Array.from(w.ar),first=chars.shift()||'';
  return '<section class="kid-lesson">'+progress+'<div class="word-reveal-stage"><div class="lesson-stage-kicker"><span class="stage-number">03</span><span>Открытие слова</span><span class="stage-steps">Найди букву внутри слова</span></div><div class="word-reveal-heading"><span class="pill">ТЫ НАШЁЛ ДРУГА!</span><h1>Это слово начинается с '+l.name+'!</h1><p>Нажми на выделенную букву. Затем послушай слово целиком и повтори его.</p></div><div class="word-reveal-card"><div class="word-reveal-illustration">'+svgArt(w.art,'word-reveal-svg')+'<span class="reveal-art-glow"></span></div><div class="word-reveal-copy"><span class="word-reveal-label">АРАБСКОЕ СЛОВО</span><div class="word-reveal-arabic arabic" lang="ar" dir="rtl"><button class="word-initial-hit '+(c.initialTapped?'initial-hit-done':'')+'" data-action="word-initial" aria-label="Послушать первую букву">'+esc(first)+'</button><span class="arabic-word-rest">'+esc(chars.join(''))+'</span></div><strong>'+esc(w.ru)+'</strong><small class="word-translit">'+esc(w.trans)+'</small><div class="initial-explain '+(c.initialTapped?'initial-explain-done':'')+'"><span class="initial-explain-letter arabic" lang="ar" dir="rtl">'+l.ch+'</span><span><b>'+(c.initialTapped?'Первая буква найдена!':'Вот первая буква')+'</b><small>'+(c.initialTapped?'Она находится в начале слова.':'Нажми на жёлтую букву в слове.')+'</small></span><span class="initial-explain-check">'+(c.initialTapped?'✓':'1')+'</span></div><button class="btn btn-purple word-hear-button" data-action="speak-word" '+(c.heardWord?'disabled':'')+'><span class="word-play-icon">'+svgArt('ear-icon','ear-art')+'</span><span>'+(c.heardWord?'Ты услышал слово ✓':'Послушать слово целиком')+'</span></button></div></div><div class="word-repeat-control"><div class="word-repeat-status '+(c.repeatedWord?'done':'')+'"><span>'+(c.repeatedWord?'✓':'2')+'</span><div><b>'+(c.repeatedWord?'Отлично сказано!':'Теперь повтори слово вслух')+'</b><small>'+(c.repeatedWord?'Ты заметил букву и повторил слово.':'После прослушивания нажми кнопку подтверждения.')+'</small></div></div><button class="btn btn-purple repeat-confirm" data-action="repeat-word" '+(!(c.initialTapped&&c.heardWord)||c.repeatedWord?'disabled':'')+'>'+(c.repeatedWord?'Получилось ✓':'Я повторил слово')+'</button></div><button class="btn btn-primary kid-main-cta" data-action="lesson-next" '+(!(c.initialTapped&&c.heardWord&&c.repeatedWord)?'disabled':'')+'>Проверим память <span>→</span></button></div></section>';
 }
 if(s===4){
  const opts=shuffle([{idx:state.letter,ch:l.ch,name:l.name}].concat(randomItems(LETTERS.map(function(x,i){return {idx:i,ch:x.ch,name:x.name};}),3,state.letter)));
  state.lessonOptions=opts.map(function(x){return x.idx;});
  return '<section class="kid-lesson">'+progress+'<div class="kid-task-card letter-quiz '+(quizFeedback.indexOf('Верно')===0?'quiz-success':'')+'"><div class="quiz-mascot">'+svgArt(w.art,'quiz-friend-art')+'<img src="./assets/rabbit.svg" alt="Али"></div><span class="eyebrow">МИССИЯ ПАМЯТИ</span><h1>Помоги Али найти '+l.name+'!</h1><p class="quiz-instruction">Какой буквой начинается слово «'+esc(w.ru)+'»?</p><div class="quiz-reference"><span class="arabic" lang="ar" dir="rtl">'+l.ch+'</span><div><b>Вспомни знакомую форму</b><small>Выбери точно такую же букву.</small></div><button class="sound-button" data-action="speak-letter" aria-label="Послушать букву">'+svgArt('ear-icon','ear-art')+'</button></div><div class="kid-answer-grid">'+opts.map(function(x){return '<button class="kid-answer '+(quizFeedback.indexOf('Верно')===0&&x.idx===state.letter?'answer-is-correct':'')+'" data-action="lesson-answer" data-i="'+x.idx+'" '+(quizFeedback.indexOf('Верно')===0?'disabled':'')+'><span class="arabic" lang="ar" dir="rtl">'+x.ch+'</span><small>Выбрать</small></button>';}).join('')+'</div><div id="lesson-feedback" class="kid-feedback '+(quizFeedback.indexOf('Верно')===0?'feedback-correct':'')+'">'+(quizFeedback||'Выбери букву, которую только что изучил!')+'</div></div></section>';
 }
 return '<section class="kid-lesson">'+progress+'<div class="write-task"><div class="write-task-head"><img src="./assets/rabbit.svg" alt="Али"><div><span class="eyebrow">МАСТЕРСКАЯ БУКВ</span><h1>Нарисуй '+l.name+'!</h1><p>Обведи форму пальцем или мышкой. Так ты запомнишь движение руки.</p></div></div><div class="writing-pad kid-writing-pad"><span class="trace-guide arabic" lang="ar" dir="rtl">'+l.ch+'</span><canvas id="trace-canvas" aria-label="Поле для тренировки написания буквы"></canvas></div><div class="write-bottom"><span id="writing-status">'+(state.writeReady?'Получилось! Можно забрать награду.':'Веди пальцем по форме буквы.')+'</span><button class="text-link" data-action="clear-canvas">Попробовать ещё ↻</button></div><button class="btn btn-primary kid-main-cta" data-action="complete-lesson" '+(state.writeReady?'':'disabled')+'>Завершить и получить награду <span>→</span></button></div></section>';
}

function renderCelebration(){
  const completed=LETTERS[Number.isInteger(state.justCompleted)?state.justCompleted:0];
  const all=state.learned.length>=28;
  const next=nextLetter();
  return '<section class="kid-celebration"><div class="celebration-sky"><span class="celebration-cloud cloud-a">'+svgArt('cloud','celebration-cloud-svg')+'</span><span class="celebration-cloud cloud-b">'+svgArt('cloud','celebration-cloud-svg')+'</span><span class="celebration-sun">'+svgArt('starburst','celebration-star-svg')+'</span><div class="celebration-ground"></div><img src="./assets/rabbit.svg" alt="Али радуется вместе с тобой" class="celebration-rabbit"><div class="celebration-sticker">'+svgArt('starburst','reward-star-svg')+'<small>+'+(state.lastLessonStars||1)+'</small></div><span class="celebrate-confetti confetti-one">'+svgArt('starburst','confetti-svg')+'</span><span class="celebrate-confetti confetti-two">'+svgArt('sparkle','confetti-svg')+'</span><span class="celebrate-confetti confetti-three">'+svgArt('starburst','confetti-svg')+'</span></div><div class="kid-celebration-copy"><span class="welcome-tag">УРА! ТЫ СПРАВИЛСЯ!</span><h1>'+(all?'Ты открыл все буквы!':'Ты познакомился с буквой '+completed.name+'!')+'</h1><p>'+(all?'Весь алфавит собран! Али приготовил для тебя новые игры.':'Буква '+completed.ch+' теперь в твоей коллекции. Али гордится тобой!')+'</p><div class="earned-letter-row"><span class="arabic" lang="ar" dir="rtl">'+completed.ch+'</span><span><b>'+completed.name+'</b><small>Новая буква в коллекции</small></span><span class="earned-check">✓</span></div><button class="btn btn-primary kid-main-cta" data-action="next-letter">'+(all?'Посмотреть карту':'Вперёд, к следующей букве!')+' <span>→</span></button><button class="celebration-secondary" data-route="path">Посмотреть карту приключений</button></div></section>';
}
function renderReading(){
 const i=Math.max(0,Math.min(2,Number(state.readingIndex)||0)),v=VOWELS[i];
 const cards=VOWELS.map(function(x,j){return '<button class="vowel-card '+(j===i?'selected':'')+'" data-action="reading-pick" data-i="'+j+'"><span class="vowel-ar arabic" lang="ar" dir="rtl">ب'+x.mark+'</span><strong>'+x.name+'</strong><small>Звук «'+x.sound+'»</small></button>';}).join('');
 const choices=['а','и','у'].map(function(x){return '<button class="answer-option '+(state.readingAnswer===x?(x===v.sound?'correct':'incorrect'):'')+'" data-action="reading-answer" data-answer="'+x+'" '+(state.readingAnswer===v.sound?'disabled':'')+'>«'+x+'»</button>';}).join('');
 return headerOf('МАСТЕРСКАЯ ЧТЕНИЯ','Буква + звук = слог','Теперь посмотрим, как короткие гласные помогают читать простые слоги. Этот этап идёт после знакомства с формой букв.',true)
 +'<section class="reading-intro panel"><div class="reading-step-tag">УРОК '+(i+1)+' ИЗ 3 · КОРОТКИЕ ГЛАСНЫЕ</div><div class="reading-board" style="--vowel-bg:'+v.color+'"><div class="reading-board-copy"><span class="eyebrow">'+v.place.toUpperCase()+'</span><h2>'+v.name+'</h2><p>'+v.desc+'</p><div class="reading-example arabic" lang="ar" dir="rtl">ب'+v.mark+'</div><div class="reading-sound">Звук: <b>«'+v.sound+'»</b></div><button class="btn btn-purple" data-action="reading-speak" data-i="'+i+'">🔊 Послушать слог</button></div><div class="reading-board-art"><div class="vowel-orbit orbit-a">✦</div><div class="vowel-orbit orbit-b">✧</div><img src="./assets/rabbit.svg" alt="Али помогает читать слоги"></div></div><div class="vowel-cards">'+cards+'</div></section><section class="panel reading-quiz"><div class="panel-head"><div><h3>Мини-проверка</h3><small>Узнаём звук по знаку</small></div><span class="pill">+5 XP за правильный ответ</span></div><div class="reading-prompt"><p>Какой короткий звук мы слышим?</p><strong class="arabic" lang="ar" dir="rtl">ب'+v.mark+'</strong></div><div class="reading-answers">'+choices+'</div><div class="feedback">'+(state.readingAnswer?(state.readingAnswer===v.sound?'Верно! Ты заметил знак и выбрал нужный звук.':'Посмотри ещё раз на знак и попробуй другой ответ.'):'Выбери звук. Не спеши!')+'</div><div class="panel-bottom"><p>Учимся читать маленькими шагами.</p><button class="btn btn-primary" data-action="reading-next" '+(state.readingAnswer!==v.sound?'disabled':'')+'>'+(i===2?'Завершить этап ✓':'Следующий знак →')+'</button></div></section>';
}
function answerReading(answer){const i=Math.max(0,Math.min(2,Number(state.readingIndex)||0)),v=VOWELS[i];if(state.readingAnswer===v.sound)return;state.readingAnswer=answer;if(answer===v.sound){addXP(5);state.answers++;saveState();render();showSuccessEffect('Верный звук! +5 XP');}else{toast('Почти! Посмотри на знак ещё раз.');render();}}
function renderWords(){
 const cats=CATEGORIES.map(function(c){return '<button class="filter-btn '+(state.wordFilter===c.id?'active':'')+'" data-action="word-filter" data-filter="'+c.id+'">'+c.label+'</button>';}).join('');
 const matching=WORDS.filter(function(w){const q=(state.search||'').toLowerCase();return (state.wordFilter==='all'||w.cat===state.wordFilter)&&(!q||(w.ru+' '+w.tr+' '+w.ar).toLowerCase().indexOf(q)>=0);});
 const cards=matching.map(function(w){const i=WORDS.indexOf(w),open=state.revealedWords.indexOf(i)>=0;return '<article class="word-card '+(open?'word-revealed':'word-hidden')+'"><button class="word-art-button" data-action="reveal-word" data-word="'+i+'" aria-expanded="'+open+'"><span class="word-art">'+svgArt(artForWord(w),'vocabulary-art')+'</span><span class="word-art-spark">'+svgArt('sparkle','word-spark-svg')+'</span><small>'+(open?'СЛОВО ОТКРЫТО':'КТО ЭТО?')+'</small></button>'+(open?'<div class="word-card-reveal"><span class="arabic" lang="ar" dir="rtl">'+highlightedArabic(w.ar)+'</span><strong>'+esc(w.ru)+'</strong><small>'+esc(w.tr)+'</small><button class="word-sound" data-action="speak-word-index" data-word="'+i+'">'+svgArt('ear-icon','ear-art')+'<span>Слушать</span></button></div>':'<div class="word-card-prompt"><b>Узнай нового друга</b><small>Коснись рисунка, чтобы открыть слово</small></div>')+'</article>';}).join('');
 return headerOf('САД СЛОВ','Открывай по одному','Сначала картинка, затем слово, потом звучание. Все ответы не появляются одновременно.',true)+'<div class="word-garden-guide"><span class="word-guide-art">'+svgArt('rose','word-guide-svg')+'</span><div><b>Миссия: открыть три слова</b><p>Выбери картинки, которые тебе интересны.</p><div class="word-guide-count"><span style="width:'+Math.min(100,state.revealedWords.length/3*100)+'%"></span></div></div><strong>'+state.revealedWords.length+'</strong></div><div class="filter-row"><label class="search-box"><span>⌕</span><input id="word-search" type="search" value="'+esc(state.search||'')+'" placeholder="Найти друга…" aria-label="Поиск по словарю"></label>'+cats+'</div><div class="panel-head"><div><h3>Кто прячется в саду?</h3><small>Нажми на рисунок, чтобы раскрыть слово.</small></div><span class="pill">'+matching.length+' друзей</span></div><div class="word-grid">'+(cards||'<div class="empty-state"><span class="empty-icon">'+svgArt('rose','empty-art')+'</span><strong>Такого друга пока нет</strong><p>Попробуй другое слово.</p></div>')+'</div>';
}

function renderPhrases(){
 const scenes=[{prompt:'Ты встретил Али. Что скажешь?',hint:'Али машет тебе рукой и улыбается.',correct:0,options:[0,1,2],art:'hand'},{prompt:'Али помог тебе. Как его поблагодарить?',hint:'Друг поделился с тобой игрушкой.',correct:1,options:[1,0,3],art:'heart'},{prompt:'Али спрашивает твоё имя. Что ответить?',hint:'Скажи новому другу, как тебя зовут.',correct:5,options:[5,4,0],art:'speech-icon'}];
 const step=state.phraseTask||0,done=step>=scenes.length,scene=scenes[Math.min(step,scenes.length-1)];let challenge='';
 if(done)challenge='<div class="phrase-finish"><div class="phrase-finish-art">'+svgArt('heart','phrase-finish-svg')+'</div><span class="pill">МИССИЯ ВЫПОЛНЕНА</span><h2>Ты начал говорить по-арабски!</h2><p>Ты справился с тремя ситуациями. Открытые фразы останутся в твоей коллекции.</p><button class="btn btn-primary" data-action="phrase-restart">Повторить диалог ↻</button></div>';
 else{
 const choices=scene.options.map(function(idx){const p=PHRASES[idx],picked=state.phraseAnswer===idx,right=picked&&idx===scene.correct,wrong=picked&&idx!==scene.correct;return '<button class="phrase-choice '+(right?'phrase-choice-right ':'')+(wrong?'phrase-choice-wrong':'')+'" data-action="phrase-answer" data-i="'+idx+'" '+(state.phraseAnswer===scene.correct?'disabled':'')+'><span class="phrase-choice-art">'+svgArt(phraseArt(idx),'phrase-choice-svg')+'</span><span class="phrase-choice-copy"><b>'+esc(p.ru)+'</b><small>'+(state.revealedPhrases.indexOf(idx)>=0?esc(p.ar):'Фраза пока спрятана')+'</small></span><span class="phrase-choice-arrow">'+(right?'✓':'→')+'</span></button>';}).join('');
 const chosen=state.phraseAnswer===scene.correct?PHRASES[scene.correct]:null;
 challenge='<div class="phrase-challenge"><div class="phrase-challenge-progress">'+scenes.map(function(x,i){return '<span class="'+(i<step?'done':i===step?'current':'')+'"></span>';}).join('')+'</div><div class="phrase-character-scene"><img src="./assets/rabbit.svg" alt="Али хочет поговорить"><span class="phrase-dialog-bubble"><b>Али говорит…</b>'+esc(scene.hint)+'</span><span class="phrase-scene-art">'+svgArt(scene.art,'phrase-scene-svg')+'</span></div><span class="eyebrow">СИТУАЦИЯ '+(step+1)+' / 3</span><h2>'+scene.prompt+'</h2><p class="phrase-challenge-hint">Выбери ответ по ситуации. Потом послушай, как он звучит по-арабски.</p><div class="phrase-choices">'+choices+'</div>'+(chosen?'<div class="phrase-correct-reveal"><span class="arabic" lang="ar" dir="rtl">'+highlightedArabic(chosen.ar)+'</span><b>'+esc(chosen.tr)+'</b><button class="sound-button" data-action="speak-phrase" data-i="'+scene.correct+'">'+svgArt('ear-icon','ear-art')+' Слушать</button></div><button class="btn btn-primary phrase-next" data-action="phrase-next">'+(step===2?'Завершить разговор':'Следующая ситуация')+' →</button>':(state.phraseAnswer!=null?'<p class="phrase-gentle-retry">Почти! Посмотри на ситуацию и попробуй ещё раз.</p>':''))+'</div>';
 }
 const opened=state.revealedPhrases.map(function(i){const p=PHRASES[i];return '<button class="phrase-shelf-card" data-action="speak-phrase" data-i="'+i+'"><span class="arabic" lang="ar" dir="rtl">'+highlightedArabic(p.ar)+'</span><b>'+esc(p.ru)+'</b><small>'+esc(p.tr)+'</small><span class="phrase-shelf-sound">'+svgArt('ear-icon','ear-art')+'</span></button>';}).join('');
 return headerOf('ПЛОЩАДЬ ФРАЗ','Разговаривай с Али','Выбери реплику в подходящей ситуации, затем послушай её. Это короткий разговор, а не список для пролистывания.',true)+challenge+'<section class="phrase-shelf"><div class="section-head"><div><div class="eyebrow">ТВОЯ КОЛЛЕКЦИЯ</div><h2>Фразы, которые ты открыл</h2><p>Они останутся здесь, чтобы повторить их позже.</p></div><span class="pill">'+state.revealedPhrases.length+' / '+PHRASES.length+'</span></div><div class="phrase-shelf-grid">'+(opened||'<p class="phrase-shelf-empty">Здесь появятся фразы после первого задания.</p>')+'</div></section>';
}

function renderGames(){
  if(state.game&&state.game.kind)return renderGameStage();
  const cards=GAME_DEFS.map(function(g){return '<button class="game-card game-'+g.id+'" data-action="start-game" data-game="'+g.id+'"><span class="game-art">'+svgArt(g.art,'game-icon-svg')+'</span><span class="game-card-copy"><strong>'+g.title+'</strong><small>'+g.desc+'</small><em>'+g.reward+' <b>→</b></em></span></button>';}).join('');
  return '<section class="games-hub"><div class="games-greeting"><div><span class="eyebrow">ВРЕМЯ ИГРАТЬ</span><h1>Маленькие игры.<br><em>Большие открытия!</em></h1><p>Буквы прыгают по камням, слова отправляются в гости, а картинки прячут секреты.</p></div><div class="games-mascot-stage"><img src="./assets/rabbit.svg" alt="Али зовёт играть"><span class="games-star star-a">✦</span><span class="games-star star-b">★</span></div></div><div class="games-progress"><div class="games-progress-badge">'+svgArt('memory-game','games-badge-svg')+'</div><div><b>Собери звёзды за старание</b><small>'+(state.gamesPlayed?'Сыграно игр: '+state.gamesPlayed:'Каждая игра — новый шанс научиться!')+'</small></div><span>⭐ '+state.stars+'</span></div><div class="games-world-grid">'+cards+'</div><div class="games-parent-tip"><img src="./assets/rabbit.svg" alt=""><span><b>Подсказка Али</b><small>Ошибаться можно! Попробуй снова и найди правильный ответ.</small></span></div></section>';
}
function startGame(kind){
  const pool=state.learned.length?state.learned:[0,1,2,3];
  const targets=Array.from({length:5},function(_,i){return pool[i%pool.length];});
  if(kind==='memory'){
    const known=state.learned.length>=4?state.learned:[0,1,2,3];
    const picks=shuffle(known.map(function(i){return LETTERS[i];})).slice(0,4);
    const deck=[];
    picks.forEach(function(l,i){
      const item=letterWord(l);
      deck.push({key:'l'+i,pair:LETTERS.indexOf(l),type:'letter',txt:l.ch,ar:true});
      deck.push({key:'w'+i,pair:LETTERS.indexOf(l),type:'word',txt:item.ru,art:item.art,ar:false});
    });
    state.game={kind:kind,deck:shuffle(deck),flipped:[],matched:[],moves:0,done:false,rewarded:false};
  }else{
    state.game={kind:kind,round:0,score:0,targets:targets,done:false,rewarded:false,answered:false,selectedOption:null,selectedWord:null,mailFeedback:'',correct:false,heard:false};
    state.game.target=targets[0];state.game.options=makeGameOptions(kind,state.game.target);
  }
  render();
}
function makeGameOptions(kind,target){
  const good=WORDS.find(function(w){return w.idx===target;})||WORDS[0];
  if(kind==='listen'){
    const pool=WORDS.filter(function(w){return w.ar!==good.ar;});
    return shuffle([good].concat(randomItems(pool,2)));
  }
  if(kind==='mail'){
    const pool=WORDS.filter(function(w){return w.idx!==target;});
    return shuffle([good].concat(randomItems(pool,2)));
  }
  const goodLetter={idx:target,ch:LETTERS[target].ch,name:LETTERS[target].name};
  const pool=LETTERS.map(function(l,i){return {idx:i,ch:l.ch,name:l.name};}).filter(function(l){return l.idx!==target;});
  return shuffle([goodLetter].concat(randomItems(pool,2)));
}
function gameTarget(){return state.game&&state.game.targets[state.game.round]!==undefined?state.game.targets[state.game.round]:0;}
function renderGameStage(){
  const g=state.game,kind=g.kind,meta=GAME_DEFS.find(function(x){return x.id===kind;});
  const header='<div class="game-stage-top"><button class="back-home" data-action="leave-game">← Игры</button><div class="game-round-count">'+(g.done?'ГОТОВО':(kind==='memory'?'СЕКРЕТНЫЕ ПАРЫ':'РАУНД '+(g.round+1)+' ИЗ 5'))+'</div><span class="game-star-score">⭐ '+(g.score||0)+'</span></div>';
  if(kind==='memory'){
    const board=g.deck.map(function(c,i){
      const shown=g.flipped.indexOf(i)>=0||g.matched.indexOf(i)>=0;
      let face='<span class="card-back-spark">✦</span><span class="card-back-label">ОТКРОЙ</span>';
      if(shown)face=c.ar?'<span class="memory-letter arabic" lang="ar" dir="rtl">'+c.txt+'</span>':'<span class="memory-friend">'+svgArt(c.art,'memory-friend-svg')+'</span><small>'+esc(c.txt)+'</small>';
      return '<button class="memory-card '+(shown?'open ':'')+(g.matched.indexOf(i)>=0?'matched':'')+'" data-action="memory-pick" data-card="'+i+'" aria-label="Карточка '+(shown?esc(c.txt):'закрыта')+'">'+face+'</button>';
    }).join('');
    const done=g.matched.length===g.deck.length;
    if(done&&!g.rewarded){g.rewarded=true;g.done=true;addXP(30);markMission('game');state.gamesPlayed++;saveState();}
    return '<section class="game-stage game-stage-memory">'+header+'<div class="memory-intro"><span class="eyebrow">ПОМНИ И НАХОДИ</span><h1>Найди четырёх друзей!</h1><p>Открой букву и её картинку. Они спрятались в парных карточках.</p><div class="memory-stat"><span>Ходов: <b>'+g.moves+'</b></span><span>Нашли: <b>'+g.matched.length/2+' / 4</b></span></div></div><div class="memory-board">'+board+'</div><div class="game-feedback-line">'+(done?'Ура! Все друзья встретились! +30 XP':'Посмотри на букву, затем найди её друга.')+'</div>'+(done?'<button class="btn btn-primary game-main-action" data-action="leave-game">Играть ещё! ↻</button>':'')+'</section>';
  }
  const target=LETTERS[g.target]||LETTERS[0],word=letterWord(target),complete=g.done;
  let prompt='',visual='',options='',soundButton='';
  if(kind==='catch'){
    prompt='Послушай и выбери букву, с которой начинается слово.';
    visual='<div class="hop-challenge-illustration"><div class="game-challenge-picture">'+svgArt(word.art,'game-target-art')+'<span class="picture-spark">✦</span></div><img class="game-river-rabbit" src="./assets/rabbit.svg" alt="Али готов прыгать"></div><div class="game-target-copy"><strong>'+word.ru+'</strong><small>Послушай слово — затем прыгни на камень с первой буквой.</small></div>';
    soundButton='<button class="game-audio-button" data-action="game-speak"><span>▶</span><b>Послушать слово</b></button>';
    options=g.options.map(function(l){const right=g.answered&&Number(l.idx)===Number(g.target),picked=g.answered&&Number(g.selectedOption)===Number(l.idx);return '<button class="letter-jump '+(right?'is-correct':'')+(picked&&!g.correct?' is-wrong':'')+'" data-action="game-answer" data-i="'+l.idx+'" '+(g.answered||!g.heard?'disabled':'')+'><span class="jump-cloud"></span><span class="arabic" lang="ar" dir="rtl">'+l.ch+'</span><small>'+l.name+'</small></button>';}).join('');
  }else if(kind==='mail'){
    prompt='Отправь в почтовый домик слово, которое начинается с этой буквы.';
    visual='<div class="mail-challenge '+(g.selectedWord!=null?'has-selection':'')+'"><div class="mail-target-letter"><span class="arabic" lang="ar" dir="rtl">'+target.ch+'</span><small>'+target.name+'</small></div><div class="mailbox-dropzone '+(g.selectedWord!=null?'ready':'')+'">'+svgArt('mailbox','mailbox-art')+'<small>'+(g.selectedWord!=null?'Посылка выбрана':'Ждёт письмо')+'</small></div></div><div class="game-target-copy"><strong>Найди друга для '+target.ch+'</strong><small>Выбери картинку, затем отправь её в почтовый ящик.</small></div>';
    options=g.options.map(function(w){const wordIndex=WORDS.indexOf(w),picked=g.selectedWord===wordIndex,right=g.answered&&Number(w.idx)===Number(g.target);return '<button class="picture-choice mail-parcel '+(picked?'is-selected ':'')+(right?'is-correct':'')+'" data-action="mail-select" data-word="'+wordIndex+'" '+(g.answered?'disabled':'')+'><span class="picture-choice-art">'+svgArt(artForWord(w),'choice-art-svg')+'</span><strong>'+esc(w.ru)+'</strong><span class="arabic" lang="ar" dir="rtl">'+w.ar+'</span></button>';}).join('');
  }else{
    prompt='Послушай арабское слово и найди его картинку.';
    visual='<div class="listen-cloud-stage"><div class="listen-wave wave-one"></div><div class="listen-wave wave-two"></div>'+svgArt('listen-game','listen-main-art')+'<span class="listen-pulse">♫</span></div><div class="game-target-copy"><strong>Что сказал Али?</strong><small>Слушай внимательно — слово пока спрятано.</small></div>';
    soundButton='<button class="game-audio-button '+(g.heard?'heard':'')+'" data-action="game-speak"><span>▶</span><b>'+(g.heard?'Послушай ещё раз':'Послушать слово')+'</b></button>';
    options=g.options.map(function(w){const targetWord=WORDS.find(function(x){return x.idx===g.target;});const right=g.answered&&w.ar===targetWord.ar,picked=g.answered&&Number(g.selectedOption)===Number(WORDS.indexOf(w));return '<button class="picture-choice listen-choice '+(right?'is-correct':'')+(picked&&!g.correct?' is-wrong':'')+'" data-action="game-answer-word" data-word="'+WORDS.indexOf(w)+'" '+(g.answered||!g.heard?'disabled':'')+'><span class="picture-choice-art">'+svgArt(artForWord(w),'choice-art-svg')+'</span><strong>'+esc(w.ru)+'</strong></button>';}).join('');
  }
  const feedback=g.answered?'<div class="answer-feedback '+(g.correct?'right':'try-again')+'">'+(g.correct?'Отлично! Ты помог другу!':'Почти! Подсветил правильный ответ — теперь ты его знаешь.')+'</div><button class="btn btn-primary game-main-action" data-action="game-next">'+(g.round===4?'Завершить игру':'Следующий раунд')+' →</button>':(kind==='mail'?'<div class="game-options picture-choice-grid mail-choice-grid">'+options+'</div><div class="mail-delivery-controls"><p class="game-feedback-line">'+esc(g.mailFeedback||(g.selectedWord!=null?'Нажми «Доставить», чтобы отправить посылку.':'Выбери картинку, которая начинается с буквы '+target.ch+'.'))+'</p><button class="btn btn-primary game-main-action mail-deliver" data-action="mail-deliver" '+(g.selectedWord==null?'disabled':'')+'>Доставить посылку →</button></div>':'<div class="game-options '+(kind==='catch'?'letter-jump-grid':'picture-choice-grid')+'">'+options+'</div><div class="game-feedback-line">'+(kind==='catch'?(g.heard?'Выбери камень с нужной буквой.':'Сначала послушай слово — камни пока закрыты.'):'Сначала послушай слово, затем найди подходящую картинку.')+'</div>');
  if(complete)return '<section class="game-stage game-finished">'+header+'<div class="game-finish-art">'+svgArt(meta.art,'finish-game-svg')+'</div><span class="eyebrow">МИССИЯ ВЫПОЛНЕНА</span><h1>Ты отлично справился!</h1><p>Правильных ответов: '+g.score+' из 5</p><div class="finish-stars">⭐ ⭐ ⭐</div><button class="btn btn-primary game-main-action" data-action="finish-game">Забрать награду →</button></section>';
  return '<section class="game-stage game-stage-'+kind+'">'+header+'<div class="game-level-heading"><span class="eyebrow">'+meta.title.toUpperCase()+'</span><h1>'+meta.title+'!</h1><p>'+prompt+'</p><div class="game-level-track">'+Array.from({length:5},function(_,i){return '<span class="'+(i<g.round?'done':i===g.round?'current':'')+'">'+(i<g.round?'✓':i+1)+'</span>';}).join('')+'</div></div><div class="game-challenge-panel"><div class="game-challenge-visual">'+visual+'</div>'+soundButton+'<div class="game-options '+(kind==='catch'?'letter-jump-grid':'picture-choice-grid')+'">'+options+'</div>'+feedback+'</div></section>';
}
function renderProfile(){
 const earned=BADGES.filter(function(b){return b.ok(state);});
 const badgeHtml=BADGES.map(function(b){const ok=b.ok(state);return '<div class="achievement '+(ok?'unlocked':'locked')+'"><span class="badge-art"><svg class="badge-art-svg" viewBox="0 0 160 160" aria-hidden="true"><use href="./assets/letter-friends.svg#'+b.art+'"></use></svg></span><strong>'+b.title+'</strong><small>'+b.desc+'</small></div>';}).join('');
 return headerOf('ТВОИ ДОСТИЖЕНИЯ','Посмотри, как ты вырос!','Каждый завершённый шаг остаётся в твоей коллекции.',false)+'<section class="surface profile-hero"><div class="profile-avatar"><img src="./assets/rabbit.svg" alt="Али, твой помощник"></div><div><div class="eyebrow">ЮНЫЙ ИССЛЕДОВАТЕЛЬ</div><h2>Друг арабского мира</h2><p>Здесь собраны твои открытия, звёзды и новые умения.</p></div><div class="level-stamp"><strong>'+xpLevel()+'</strong><small>ТВОЙ УРОВЕНЬ</small></div></section><div class="profile-stats"><div class="profile-stat"><span><svg class="stat-art" viewBox="0 0 160 160"><use href="./assets/letter-friends.svg#starburst"></use></svg></span><strong>'+state.xp+'</strong><small>XP опыта</small></div><div class="profile-stat"><span><svg class="stat-art" viewBox="0 0 160 160"><use href="./assets/letter-friends.svg#book-icon"></use></svg></span><strong>'+state.learned.length+'/28</strong><small>изучено букв</small></div><div class="profile-stat"><span><svg class="stat-art" viewBox="0 0 160 160"><use href="./assets/letter-friends.svg#sun"></use></svg></span><strong>'+state.streak+'</strong><small>дней подряд</small></div><div class="profile-stat"><span><svg class="stat-art" viewBox="0 0 160 160"><use href="./assets/letter-friends.svg#ear-icon"></use></svg></span><strong>'+state.wordsHeard+'</strong><small>прослушано слов</small></div></div><section class="panel" style="margin-bottom:15px"><div class="panel-head"><div><h3>До следующего уровня</h3><small>Каждый урок приносит XP</small></div><span class="pill">'+xpIntoLevel()+' / 100 XP</span></div><div class="progress-line"><i style="width:'+xpIntoLevel()+'%"></i></div><div class="panel-bottom"><p>Осталось ещё '+(100-xpIntoLevel())+' XP</p><strong class="tiny">Уровень '+xpLevel()+'</strong></div></section><div class="section-head"><div><div class="eyebrow">КОЛЛЕКЦИЯ НАГРАД</div><h2>Мои значки</h2><p>Открыто '+earned.length+' из '+BADGES.length+' достижений.</p></div></div><div class="badge-grid">'+badgeHtml+'</div><div class="panel" style="margin:18px 0 40px"><div class="panel-head"><h3>Настройки приключения</h3></div><p class="tiny muted">Прогресс хранится в этом браузере и может исчезнуть при очистке его данных.</p><div class="panel-bottom"><button class="btn btn-ghost btn-small" data-action="sound-toggle">Настройки звука</button><button class="text-link" data-action="reset-progress">Сбросить прогресс</button></div></div>';
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
  let down=false,last=null,moved=false;
  function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  canvas.addEventListener('pointerdown',function(e){down=true;moved=false;last=pos(e);canvas.setPointerCapture(e.pointerId);e.preventDefault();});
  canvas.addEventListener('pointermove',function(e){
    if(!down)return;const p=pos(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault();
    if(!moved){moved=true;state.writeReady=true;const btn=document.querySelector('[data-action="complete-lesson"]');if(btn)btn.disabled=false;const status=document.getElementById('writing-status');if(status)status.textContent='Получилось! Теперь можно завершить урок.';
    }
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(ev){canvas.addEventListener(ev,function(){down=false;last=null;});});
  canvas.clear=function(){ctx.clearRect(0,0,canvas.width,canvas.height);};
}
function clearCanvas(){
  const c=document.getElementById('trace-canvas');if(c&&c.clear)c.clear();
  state.writeReady=false;
  const btn=document.querySelector('[data-action="complete-lesson"]');if(btn)btn.disabled=true;
  const status=document.getElementById('writing-status');if(status)status.textContent='Обведи форму, чтобы открыть завершение урока.';
}
function showModal(title,body,buttons){
  const root=document.getElementById('modal-root');if(!root)return;
  root.innerHTML='<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal-card"><h2>'+title+'</h2><p>'+body+'</p><div class="modal-actions">'+buttons+'</div></div></div>';
}
function closeModal(){const root=document.getElementById('modal-root');if(root)root.innerHTML='';}
function finishLetter(){
  if(!state.writeReady){toast('Сначала обведи букву — это последний шаг урока!');return;}
  const i=state.letter,starsBefore=state.stars;state.justCompleted=i;
  if(state.learned.indexOf(i)<0){state.learned.push(i);state.learned.sort(function(a,b){return a-b;});addXP(20);}
  else{addXP(5);}
  markMission('lesson');state.lastLessonStars=Math.max(1,state.stars-starsBefore);state.lessonStep=0;state.writeReady=false;quizFeedback='';route('celebration');showSuccessEffect('Буква в твоей коллекции!');
}
function answerLetter(i){
  const target=state.letter,fb=document.getElementById('lesson-feedback');
  document.querySelectorAll('[data-action="lesson-answer"]').forEach(function(b){b.disabled=true;if(Number(b.dataset.i)===target)b.classList.add('correct');});
  if(i===target){quizFeedback='Верно! Ты нашёл '+LETTERS[target].name+'!';if(fb){fb.textContent=quizFeedback;fb.classList.remove('bad');}addXP(3);showSuccessEffect('Верный ответ!');setTimeout(function(){state.lessonStep=5;render();},1050);}
  else{quizFeedback='Почти! Посмотри на форму и точки, затем попробуй ещё раз.';if(fb){fb.textContent=quizFeedback;fb.classList.add('bad');}const b=document.querySelector('[data-action="lesson-answer"][data-i="'+i+'"]');if(b)b.classList.add('incorrect');setTimeout(function(){document.querySelectorAll('[data-action="lesson-answer"]').forEach(function(x){x.disabled=false;x.classList.remove('incorrect');});},650);}
}
function advanceGame(correct,selected){
  const g=state.game;if(!g||g.done||g.answered)return;
  g.answered=true;g.correct=!!correct;g.selectedOption=selected;
  if(correct){g.score++;addXP(2);toast('Правильно! +2 XP');}
  else toast('Хорошая попытка! Подсветил правильный ответ.');
  state.answers++;saveState();render();
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
      if(g.matched.length===g.deck.length){g.done=true;}
      setTimeout(render,320);
    }else{
      if(memoryTimeout)clearTimeout(memoryTimeout);
      memoryTimeout=setTimeout(function(){if(state.game===g){g.flipped=[];render();}},850);
    }
  }
}
function handleAction(action,el){
  const i=Number(el.dataset.i);
  if(action==='continue'){if(state.learned.length>=28){route('path');return;}state.letter=nextLetter();state.lessonStep=0;state.writeReady=false;state.lessonChecks=emptyLessonChecks();quizFeedback='';route('lesson');return;}
  if(action==='home-world'){const world=el.dataset.world;if(!canVisit(world)){route(world);return;}if(world==='letters'){if(state.learned.length>=28){route('letters');return;}state.letter=nextLetter();state.lessonStep=0;state.writeReady=false;route('lesson');return;}route(world);return;}
  if(action==='open-reading'){state.readingIndex=0;route('reading');return;}
  if(action==='reading-pick'){state.readingIndex=Number(el.dataset.i)||0;state.readingAnswer='';render();return;}
  if(action==='reading-speak'){const v=VOWELS[Number(el.dataset.i)];if(v)speak(v.sample);return;}
  if(action==='reading-answer'){answerReading(el.dataset.answer);return;}
  if(action==='reading-next'){if(Number(state.readingIndex)>=2){state.readingIndex=0;state.readingAnswer='';state.readingCompleted=true;addXP(10);toast('Этап чтения завершён! +10 XP ✨');route('path');return;}state.readingIndex=Math.min(2,(state.readingIndex||0)+1);state.readingAnswer='';render();return;}
  if(action==='next-letter'){state.letter=nextLetter();state.lessonStep=0;state.writeReady=false;state.lessonChecks=emptyLessonChecks();quizFeedback='';state.game=null;route(state.learned.length>=28?'letters':'lesson');return;}
  if(action==='open-letter'){
    if(!isUnlocked(i)){toast('Сначала закончи предыдущий урок — и эта буква откроется! 🔒');return;}
    state.letter=i;state.lessonStep=0;state.writeReady=false;state.lessonChecks=emptyLessonChecks();quizFeedback='';route('lesson');return;
  }
  if(action==='meet-letter'){
    if(el.dataset.busy==='1')return;
    el.dataset.busy='1';el.disabled=true;
    state.lessonChecks=emptyLessonChecks();
    const character=document.getElementById('lesson-character'),letter=document.getElementById('lesson-letter'),bubble=document.getElementById('lesson-bubble');
    if(character)character.classList.add('walk');if(letter)letter.classList.add('reveal');
    if(bubble)bubble.innerHTML='<strong>Сюрприз! Сейчас увидим!</strong>Али нашёл нового друга. Давай познакомимся вместе.';
    setTimeout(function(){state.lessonStep=1;state.writeReady=false;quizFeedback='';render();},1150);
    return;
  }
  if(action==='lesson-next'){
    const c=state.lessonChecks||emptyLessonChecks(),ready=state.lessonStep===1?(c.heardLetter&&c.repeated):state.lessonStep===2?c.foundFriend:state.lessonStep===3?(c.initialTapped&&c.heardWord&&c.repeatedWord):false;
    if(!ready){toast(state.lessonStep===1?'Послушай и повтори звук.':state.lessonStep===2?'Нажми на картинку.':'Найди букву, послушай и повтори слово.');return;}
    state.lessonStep=Math.min(4,state.lessonStep+1);quizFeedback='';render();return;
  }
  if(action==='i-repeated'){
    const c=state.lessonChecks||emptyLessonChecks();if(state.lessonStep!==1||!c.heardLetter){toast('Сначала послушай букву.');return;}state.lessonChecks=Object.assign(emptyLessonChecks(),c,{repeated:true});saveState();render();showSuccessEffect('Звук пойман!');return;
  }
  if(action==='find-word-friend'){
    const c=state.lessonChecks||emptyLessonChecks();if(!c.foundFriend){state.lessonChecks=Object.assign(emptyLessonChecks(),c,{foundFriend:true});state.wordsFound=(state.wordsFound||0)+1;addXP(2);saveState();render();showSuccessEffect('Ты разбудил друга!');}return;
  }
  if(action==='word-initial'){
    const c=state.lessonChecks||emptyLessonChecks();if(state.view!=='lesson'||state.lessonStep!==3)return;speak(currentLetter().ch);state.lessonChecks=Object.assign(emptyLessonChecks(),c,{initialTapped:true});saveState();render();showSuccessEffect('Первая буква найдена!');return;
  }
  if(action==='repeat-word'){
    const c=state.lessonChecks||emptyLessonChecks();if(state.lessonStep!==3||!c.initialTapped||!c.heardWord){toast('Сначала нажми на букву и послушай слово.');return;}state.lessonChecks=Object.assign(emptyLessonChecks(),c,{repeatedWord:true});saveState();render();showSuccessEffect('Слово получилось!');return;
  }
  if(action==='reveal-word'){
    const idx=Number(el.dataset.word),open=state.revealedWords.indexOf(idx)>=0;if(open)state.revealedWords=state.revealedWords.filter(function(n){return n!==idx;});else{state.revealedWords.push(idx);addXP(1);}saveState();render();if(!open)showSuccessEffect('Новое слово открыто!');return;
  }
  if(action==='phrase-answer'){
    const idx=Number(el.dataset.i),goal=[0,1,5][state.phraseTask||0];if(state.phraseAnswer===goal)return;
    if(idx===goal){state.phraseAnswer=idx;if(state.revealedPhrases.indexOf(idx)<0)state.revealedPhrases.push(idx);addXP(4);saveState();render();showSuccessEffect('Ты нашёл нужную фразу!');}else{state.phraseAnswer=idx;render();}return;
  }
  if(action==='phrase-next'){
    if(state.phraseAnswer!==[0,1,5][state.phraseTask])return;state.phraseTask=Math.min(3,state.phraseTask+1);state.phraseAnswer=null;saveState();render();if(state.phraseTask===3)showSuccessEffect('Три разговора завершены!');return;
  }
  if(action==='phrase-restart'){state.phraseTask=0;state.phraseAnswer=null;render();return;}
  if(action==='lesson-answer'){answerLetter(i);return;}
  if(action==='skip-to-write'){toast('Сначала попробуй узнать букву — затем перейдём к письму.');return;}
  if(action==='speak-letter'){
    speak(currentLetter().ch);if(state.view==='lesson'&&state.lessonStep===1){const c=state.lessonChecks||emptyLessonChecks();state.lessonChecks=Object.assign(emptyLessonChecks(),c,{heardLetter:true,repeated:false});saveState();render();}return;
  }
  if(action==='speak-word'){
    speak(letterWord(currentLetter()).ar);state.wordsHeard++;markMission('listen');saveState();if(state.view==='lesson'&&state.lessonStep===3){const c=state.lessonChecks||emptyLessonChecks();state.lessonChecks=Object.assign(emptyLessonChecks(),c,{heardWord:true,repeatedWord:false});saveState();render();showSuccessEffect('Ты услышал слово!');}return;
  }
  if(action==='clear-canvas'){clearCanvas();return;}
  if(action==='complete-lesson'){finishLetter();return;}
  if(action==='word-filter'){state.wordFilter=el.dataset.filter;render();return;}
  if(action==='speak-word-index'){const w=WORDS[Number(el.dataset.word)];if(w){speak(w.ar);state.wordsHeard++;markMission('listen');saveState();}return;}
  if(action==='speak-phrase'){const p=PHRASES[Number(el.dataset.i)];if(p)speak(p.ar);markMission('listen');return;}
  if(action==='speak-dialog'){speak(PHRASES[0].ar+' ... '+PHRASES[4].ar+' ... '+PHRASES[5].ar+' ... '+PHRASES[1].ar);markMission('listen');return;}
  if(action==='start-game'){state.game=null;startGame(el.dataset.game);return;}
  if(action==='leave-game'){state.game=null;route('games');return;}
  if(action==='game-speak'){
    const g=state.game;if(g){
      const w=letterWord(LETTERS[g.target]);speak(w.ar);g.heard=true;markMission('listen');render();
    }return;
  }
  if(action==='game-answer'){
    const g=state.game;if(g)advanceGame(Number(el.dataset.i)===g.target,Number(el.dataset.i));return;
  }
  if(action==='mail-select'){
    const g=state.game,pick=Number(el.dataset.word);
    if(!g||g.kind!=='mail'||g.answered||!Number.isInteger(pick)||!WORDS[pick])return;
    g.selectedWord=pick;g.mailFeedback='Посылка выбрана! Проверь букву и отправляй её.';render();return;
  }
  if(action==='mail-deliver'){
    const g=state.game;
    if(!g||g.kind!=='mail'||g.answered||g.selectedWord==null){toast('Сначала выбери посылку!');return;}
    const selected=WORDS[g.selectedWord];
    if(selected&&selected.idx===Number(g.target)){advanceGame(true,g.selectedWord);}
    else{g.selectedWord=null;g.mailFeedback='Эта посылка не подходит. Посмотри на первую букву и попробуй другую.';render();toast('Попробуем другую посылку!');}
    return;
  }
  if(action==='game-answer-word'){
    const g=state.game;if(!g)return;
    const pick=Number(el.dataset.word),selected=WORDS[pick],targetWord=WORDS.find(function(w){return w.idx===g.target;});
    const correct=!!selected&&(g.kind==='listen'?selected.ar===targetWord.ar:selected.idx===g.target);
    advanceGame(correct,pick);return;
  }
  if(action==='game-next'){
    const g=state.game;if(!g||!g.answered)return;
    if(g.round>=4){g.done=true;render();return;}
    g.round++;g.target=g.targets[g.round];g.options=makeGameOptions(g.kind,g.target);g.answered=false;g.selectedOption=null;g.selectedWord=null;g.mailFeedback='';g.correct=false;g.heard=false;render();return;
  }
  if(action==='finish-game'){
    const g=state.game;if(g&&!g.rewarded){g.rewarded=true;addXP(15+g.score*3);markMission('game');state.gamesPlayed++;saveState();}
    state.game=null;route('games');toast('Награда твоя! '+(15+(g?g.score:0)*3)+' XP 🏆');return;
  }
  if(action==='memory-pick'){pickMemory(Number(el.dataset.card));return;}
  if(action==='sound-toggle'){toggleSound();return;}
  if(action==='about'){about();return;}
  if(action==='reset-progress'){showModal('Начать заново?','Все выученные буквы, XP и награды на этом устройстве будут сброшены. Это нельзя отменить.','<button class="btn btn-ghost" data-action="close-modal">Оставить</button><button class="btn btn-primary" data-action="confirm-reset">Сбросить прогресс</button>');return;}
  if(action==='close-modal'){closeModal();return;}
  if(action==='confirm-reset'){const old=state;state=freshState();state.lastVisit=old.lastVisit;state.streak=old.streak;visitToday();state.game=null;closeModal();route('home');toast('Начинаем новое приключение!');return;}
}
function toggleSound(){
  const off=localStorage.getItem('ali-academy-sound')==='off';
  localStorage.setItem('ali-academy-sound',off?'on':'off');
  const b=document.getElementById('sound-toggle');if(b)b.innerHTML='<svg class="header-icon sound-toggle-svg" viewBox="0 0 160 160" aria-hidden="true"><use href="./assets/letter-friends.svg#ear-icon"></use></svg>';
  toast(off?'Звук включён':'Звук выключен');if(off)speak('مرحبا');
}
function about(){
  showModal('Для родителей','Ребёнок идёт небольшими шагами: знакомится с формой буквы, узнаёт её звук, находит такую же букву, пробует писать и получает награду за завершение. После нескольких букв открывается практика коротких гласных, затем словарь, фразы и игры. Это развивающий прототип, а не официально аккредитованный курс: арабские примеры, произношение и возрастную пригодность необходимо проверить с преподавателем арабского для детей. Прогресс хранится только в этом браузере.','<button class="btn btn-primary" data-action="close-modal">Понятно</button>');
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
// Every fresh visit starts at the welcome map, not inside a saved lesson.
// A lesson can be resumed from the home CTA; stale #lesson links never bypass onboarding.
const allowedViews=['home','path','letters','words','phrases','games','profile','reading'];
const requestedView=(location.hash||'').slice(1);
if(allowedViews.indexOf(requestedView)>=0&&canVisit(requestedView))state.view=requestedView;
else{
  state.view='home';
  try{history.replaceState(null,'',location.pathname+location.search+'#home');}catch(e){}
}
render();
