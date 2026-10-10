'use strict';
const DATA=[
['ا','Алиф','أَرْنَب','кролик','арнаб','🐇','Первая буква арабского алфавита','animals'],
['ب','Ба','بَطَّة','утка','батта','🦆','Одна точка снизу','animals'],
['ت','Та','تُفَّاحَة','яблоко','туффаха','🍎','Две точки сверху','nature'],
['ث','Са','ثَعْلَب','лиса','са‘ляб','🦊','Три точки сверху; звук похож на английское th','animals'],
['ج','Джим','جَمَل','верблюд','джамаль','🐪','Одна точка внутри нижней части','animals'],
['ح','Ха','حِصَان','лошадь','хисан','🐴','Глубокий звук, которого нет в русском','animals'],
['خ','Ха с точкой','خَرُوف','барашек','харуф','🐑','Одна точка сверху','animals'],
['د','Даль','دُبّ','медведь','дубб','🐻','Небольшой изгиб','animals'],
['ذ','Заль','ذُرَّة','кукуруза','зурра','🌽','Одна точка сверху; звук похож на th в this','nature'],
['ر','Ра','رُمَّان','гранат','румман','🍎','Короткий звук р','nature'],
['ز','Зай','زَرَافَة','жираф','зарафа','🦒','Одна точка сверху','animals'],
['س','Син','سَمَكَة','рыба','самака','🐟','Три маленьких зубчика','animals'],
['ش','Шин','شَمْس','солнце','шамс','☀️','Три точки сверху','nature'],
['ص','Сад','صَقْر','сокол','сакр','🦅','Твёрдый звук с','animals'],
['ض','Дад','ضِفْدَع','лягушка','дифда‘','🐸','Особый твёрдый арабский звук','animals'],
['ط','Та твёрдая','طَائِرَة','самолёт','таира','✈️','Твёрдый звук т','things'],
['ظ','За твёрдая','ظَرْف','конверт','зарф','✉️','Твёрдый звук с точкой сверху','things'],
['ع','Айн','عَيْن','глаз','‘айн','👁️','Особый гортанный звук','things'],
['غ','Гайн','غَيْمَة','облако','гайма','☁️','Глубокий звук с точкой сверху','nature'],
['ف','Фа','فِيل','слон','филь','🐘','Одна точка сверху','animals'],
['ق','Каф глубокая','قَمَر','луна','камар','🌙','Две точки сверху; звук глубже русского к','nature'],
['ك','Каф','كِتَاب','книга','китаб','📘','Похожа на уголок','things'],
['ل','Лям','لَيْمُون','лимон','лаймун','🍋','Высокая линия с изгибом','nature'],
['م','Мим','مَوْز','банан','мауз','🍌','Круглая форма','nature'],
['ن','Нун','نَحْلَة','пчела','нахля','🐝','Одна точка сверху','animals'],
['ه','Ха мягкая','هِلال','полумесяц','хилаль','🌙','Лёгкий выдох','nature'],
['و','Вау','وَرْدَة','роза','варда','🌹','Может звучать как в или у','nature'],
['ي','Йа','يَد','рука','яд','✋','Две точки снизу','things']
].map((a,i)=>({ch:a[0],name:a[1],word:a[2],ru:a[3],trans:a[4],emoji:a[5],hint:a[6],cat:a[7],i:i}));
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const KEY='ali-arabic-kids-progress-v1';
let state=readState(), cur=0, filter='all', locale='ru', quiz={round:0,score:0,order:[],done:false};
function readState(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return{learned:Array.isArray(s.learned)?s.learned.filter(n=>Number.isInteger(n)&&n>=0&&n<28):[],stars:Number(s.stars)||0,answered:Number(s.answered)||0};}catch(e){return{learned:[],stars:0,answered:0};}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){};stats();}
function stats(){$('#homeLearned').textContent=state.learned.length;$('#homeStars').textContent=state.stars;$('#totalLearned').textContent=state.learned.length+' / 28';$('#totalStars').textContent=state.stars;$('#totalAnswered').textContent=state.answered;$('#progressBar').style.width=(state.learned.length/28*100)+'%';$('#progressAlphabet').innerHTML=DATA.map(x=>'<span class="'+(state.learned.includes(x.i)?'done':'')+'">'+x.ch+'</span>').join('');}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2300);}
function say(text){if(!('speechSynthesis'in window)){toast(locale==='ar'?'الصوت غير متاح في هذا المتصفح.':'Озвучивание не поддерживается браузером.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ar-SA';u.rate=.78;u.pitch=1.06;speechSynthesis.speak(u);}
function escape(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function show(name){$$('.view').forEach(el=>el.classList.toggle('show',el.id===name));$$('.nav').forEach(el=>el.classList.toggle('active',el.dataset.view===name));if(name==='letters'){renderLetter();drawAlphabet();resizeCanvas();}if(name==='words')renderWords();if(name==='games'&&!quiz.order.length)startQuiz();if(name==='progress')stats();window.scrollTo({top:0,behavior:'smooth'});}
function renderLetter(){const x=DATA[cur];$('#letterNo').textContent='БУКВА '+(cur+1)+' ИЗ 28';$('#glyph').textContent=x.ch;$('#guide').textContent=x.ch;$('#letterName').textContent=x.name;$('#letterHint').textContent=x.hint;$('#arabicWord').textContent=x.word;$('#wordRu').textContent=x.ru;$('#translit').textContent=x.trans;$('#emoji').textContent=x.emoji;$('#learnStatus').textContent=state.learned.includes(cur)?'✓ Уже выучена':'○ Ещё учим';$('#prev').disabled=cur===0;$('#next').disabled=cur===27;$('#mark').textContent=state.learned.includes(cur)?'Буква выучена ✓':'Я запомнил(а)! ★';}
function chooseLetter(i){cur=Math.max(0,Math.min(27,i));renderLetter();drawAlphabet();clearCanvas();}
function drawAlphabet(){$('#alphabet').innerHTML=DATA.map(x=>'<button class=\"alphabet-tile '+(x.i===cur?'active ':'')+(state.learned.includes(x.i)?'learned':'')+'\" data-letter=\"'+x.i+'\"><span lang=\"ar\" dir=\"rtl\">'+x.ch+'</span><small>'+escape(x.name)+'</small></button>').join('');}
function mark(){if(state.learned.includes(cur)){toast('Эта буква уже в твоей коллекции!');return;}state.learned.push(cur);state.learned.sort((a,b)=>a-b);state.stars++;save();renderLetter();drawAlphabet();toast('Буква добавлена в твои успехи!');}
function renderWords(){const q=$('#search').value.trim().toLowerCase();const list=DATA.filter(x=>(filter==='all'||x.cat===filter)&&[x.ru,x.trans,x.name,x.word].join(' ').toLowerCase().includes(q));$('#wordGrid').innerHTML=list.map(x=>'<button class=\"word-card\" data-word=\"'+x.i+'\"><span class=\"emoji\">'+x.emoji+'</span><span class=\"ar\" lang=\"ar\" dir=\"rtl\">'+x.word+'</span><b>'+escape(x.ru)+'</b><small>'+escape(x.trans)+'</small></button>').join('');$$('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startQuiz(){quiz={round:0,score:0,order:shuffle(DATA.map(x=>x.i)).slice(0,8),done:false};$('#score').textContent='0';$('#nextQ').hidden=false;renderQuestion();}
function renderQuestion(){if(quiz.round>=8){finishQuiz();return;}const x=DATA[quiz.order[quiz.round]];const opts=shuffle([x].concat(shuffle(DATA.filter(y=>y.i!==x.i)).slice(0,3)));quiz.answered=false;$('#round').textContent='ВОПРОС '+(quiz.round+1)+' ИЗ 8';$('#bar').style.width=(quiz.round/8*100)+'%';$('#qEmoji').textContent=x.emoji;$('#qWord').textContent=x.word;$('#answers').innerHTML=opts.map(y=>'<button class=\"answer\" data-answer=\"'+y.i+'\">'+escape(y.ru)+'</button>').join('');$('#feedback').textContent='';$('#feedback').className='';$('#nextQ').disabled=true;$('#nextQ').hidden=false;}
function answer(btn){if(quiz.answered)return;quiz.answered=true;const target=quiz.order[quiz.round];const good=Number(btn.dataset.answer)===target;$$('.answer').forEach(b=>{b.disabled=true;if(Number(b.dataset.answer)===target)b.classList.add('correct');});if(good){quiz.score++;state.stars++;$('#score').textContent=quiz.score;$('#feedback').textContent='Ура! Правильно! +1 звезда ⭐';}else{btn.classList.add('wrong');$('#feedback').textContent='Почти! Зелёная карточка — правильный ответ.';$('#feedback').classList.add('error');}state.answered++;save();$('#nextQ').disabled=false;$('#bar').style.width=((quiz.round+1)/8*100)+'%';}
function finishQuiz(){quiz.done=true;$('#round').textContent='РАУНД ЗАВЕРШЁН';$('#qEmoji').textContent=quiz.score>=6?'🏆':'🌟';$('#qWord').textContent=quiz.score+' / 8';$('#answers').innerHTML='';$('#feedback').textContent='Отличная работа! Ты закончил(а) раунд!';$('#nextQ').hidden=true;$('#bar').style.width='100%';}
function resizeCanvas(){const c=$('#canvas'),box=c.parentElement;if(!box||!$('#letters').classList.contains('show'))return;const r=box.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);c.width=r.width*d;c.height=r.height*d;const ctx=c.getContext('2d');ctx.scale(d,d);ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#6440ce';}
let ctx=null,drawing=false,last=null;function point(e){const r=$('#canvas').getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
$('#canvas').addEventListener('pointerdown',e=>{const c=$('#canvas'),d=Math.min(window.devicePixelRatio||1,2);ctx=c.getContext('2d');if(c.width!==Math.round(c.clientWidth*d))resizeCanvas();ctx=c.getContext('2d');ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#6440ce';drawing=true;last=point(e);c.setPointerCapture(e.pointerId);e.preventDefault();});
$('#canvas').addEventListener('pointermove',e=>{if(!drawing||!ctx)return;const p=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault();});
function endDraw(){drawing=false;last=null;}$('#canvas').addEventListener('pointerup',endDraw);$('#canvas').addEventListener('pointercancel',endDraw);$('#canvas').addEventListener('pointerleave',endDraw);
function clearCanvas(){const c=$('#canvas');if(c&&c.getContext){c.getContext('2d').clearRect(0,0,c.width,c.height);}}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.view){show(b.dataset.view);return;}if(b.dataset.letter!==undefined){chooseLetter(Number(b.dataset.letter));return;}if(b.dataset.word!==undefined){say(DATA[Number(b.dataset.word)].word);return;}if(b.dataset.filter){filter=b.dataset.filter;renderWords();return;}if(b.dataset.answer!==undefined){answer(b);return;}});
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
$('#prev').addEventListener('click',()=>chooseLetter(cur-1));$('#next').addEventListener('click',()=>chooseLetter(cur+1));$('#mark').addEventListener('click',mark);$('#listenLetter').addEventListener('click',()=>say(DATA[cur].ch));$('#listenWord').addEventListener('click',()=>say(DATA[cur].word));$('#clear').addEventListener('click',clearCanvas);$('#search').addEventListener('input',renderWords);$('#listenQ').addEventListener('click',()=>{const x=DATA[quiz.order[quiz.round]||0];say(x.word);});$('#nextQ').addEventListener('click',()=>{if(!quiz.answered)return;quiz.round++;renderQuestion();});$('#restart').addEventListener('click',startQuiz);$('#reset').addEventListener('click',()=>{if(confirm('Сбросить выученные буквы и звёзды?')){state={learned:[],stars:0,answered:0};save();renderLetter();drawAlphabet();toast('Прогресс сброшен!');}});$('#lang').addEventListener('click',()=>{locale=locale==='ru'?'ar':'ru';document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.body.classList.toggle('arabic-ui',locale==='ar');$('#lang').textContent=locale==='ar'?'Русский':'عربي';});window.addEventListener('resize',()=>{if($('#letters').classList.contains('show'))resizeCanvas();});
renderLetter();drawAlphabet();renderWords();stats();