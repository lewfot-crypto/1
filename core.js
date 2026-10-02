/* ===== 화면 훅 등록소 (LQ) =====
   여러 기능이 화면 이동·트레저 그리기에 끼어들 때, 함수를 덮어쓰지 않고 여기에 등록해요.
   LQ.on('screen:before', fn(화면))  화면을 바꾸기 직전
   LQ.on('screen:after',  fn(화면))  화면을 바꾼 직후
   LQ.on('screen:done',   fn(화면))  오류가 나도 반드시 실행 (마무리용)
   LQ.on('treasure:rendered', fn())   트레저 탭을 다 그린 직후
   LQ.on('master:after', fn())        설정 화면(QUEST MASTER)을 다 그린 직후
   LQ.err(e)                          조용히 넘긴 오류를 남겨요. 콘솔에서 localStorage.setItem('lq_debug','1') 하면 보여요 */
window.LQ=(function(){ var H={};
  return { err:function(e){ try{ if(localStorage.getItem('lq_debug')) console.warn('[LQ]',e); }catch(x){} },
           on:function(ev,fn){ (H[ev]=H[ev]||[]).push(fn); },
           fire:function(ev,a){ (H[ev]||[]).forEach(function(f){ try{ f(a); }catch(e){ console.error('[LQ:'+ev+']',e); } }); } };
})();
/* 웰라의 웃음소리: 대사에는 "하하"로 적어 두고, 보여 줄 때 상황에 맞게 하하 / 하핫 / 캬핫으로 바꿔요.
   자신만만하거나 신나는 말 뒤엔 캬핫, 실수하거나 놀란 말 뒤엔 하핫, 나머지는 주로 하하 */
/* 마법냥이 말투: 문장 끝의 '~다'를 '~다냥'으로 (이미 다냥이면 그대로) */
window.lqNya=function(t){ if(!t||typeof t!=='string') return t; return t.replace(/([가-힣])다(?=[.!?…~]|\n|\s*[✨👏🌙⭐💜]|$)/g,'$1다냥'); };
window.lqLaugh=function(t){ if(!t||typeof t!=='string'||t.indexOf('하하')<0) return t;
  return t.replace(/하하(?!하)/g,function(m,off){ var c=t.slice(Math.max(0,off-45),off);
    if(/성공|완벽|합격|신기록|최고|자신|해냈|출발|슝|도전|짜잔|짠|반짝|대박|멋져|우승/.test(c)&&Math.random()<.7) return '캬핫';
    if(/앗|어라|어\?|어어|헉|떨어|부딪|깨졌|깨뜨|찌그러|실수|미끄|엉뚱|놀랐|놀라|에이|폭발|넘어/.test(c)&&Math.random()<.6) return '하핫';
    var r=Math.random(); return r<.72?'하하':r<.88?'하핫':'캬핫'; }); };
/* ===== 대사 창고 (LQD) =====
   모든 캐릭터 대사를 여기서 고르게 해요. 같은 대사가 연달아 나오지 않게 기억하고,
   시간대·계절·요일 태그와 희귀도(r:'u'/'r')를 지원하며, 마법스승 카메오를 소량 섞어요.
   LQD.pick(키, 기본대사배열, {who:'화자', vars:{n:..}})   대사 하나 고르기
   LQD.add(키, [대사...])          같은 키에 대사 더하기 (lines.js 같은 확장 파일에서)
   LQD.cameo(화자, [대사...])      그 화자가 마법스승 얘기를 하는 대사 (가끔만 나와요)
   대사 한 줄은 문자열이거나 {t:'내용', when:{tod:'morn',season:'au',dow:[1,2],month:10}, r:'u'} 형태예요.
   tod: morn(5~11시)·day(11~17)·eve(17~22)·night / season: sp·su·au·wi / 희귀도 r: 'u' 가끔, 'r' 드물게 */
window.LQD=(function(){
  var P={}, CAM={}, RW={u:4,r:1}, ARCS=[], NOTES={};
  function st(){ var d=S.dlg; if(!d||typeof d!=='object') d=S.dlg={}; d.recent=d.recent||{}; d.seen=d.seen||{}; return d; }
  function h(s){ var x=5381; s=String(s); for(var i=0;i<s.length;i++) x=((x<<5)+x+s.charCodeAt(i))>>>0; return x.toString(36); }
  function isO(e){ return e&&typeof e==='object'&&!Array.isArray(e); }
  function txt(e){ return typeof e==='string'?e:Array.isArray(e)?e.slice(0,3).join('|'):(isO(e)&&e.t!=null?String(e.t):JSON.stringify(e)); }
  function ctx(){ var hr=12,mo=1,dow=0; try{ hr=kstNow().getUTCHours(); var d=todayStr(); mo=+d.slice(5,7); dow=new Date(d+'T00:00:00Z').getUTCDay(); }catch(e){ LQ.err(e); }
    var a=arcNow();
    return {tod:(hr>=22||hr<5)?'night':hr<11?'morn':hr<17?'day':'eve', season:(mo>=3&&mo<=5)?'sp':(mo>=6&&mo<=8)?'su':(mo>=9&&mo<=11)?'au':'wi', month:mo, dow:dow, arc:a.id, beat:a.beat}; }
  /* 이번 주 이야기: 월요일에 시작해 한 주 동안 이어져요. beat a(월·화) b(수·목) c(금·토) d(일) */
  function arcNow(){ try{ if(!ARCS.length) return {id:'',beat:''};
      var td=todayStr(), days=Math.floor((Date.parse(td)-Date.parse('2026-01-05'))/864e5), wk=Math.max(0,Math.floor(days/7)), di=((new Date(td+'T00:00:00Z').getUTCDay())+6)%7;
      return {id:ARCS[wk%ARCS.length], beat:['a','a','b','b','c','c','d'][di], week:wk}; }catch(e){ return {id:'',beat:''}; } }
  function has(v,x){ return v==null||(Array.isArray(v)?v.indexOf(x)>=0:v===x); }
  function ok(e,c){ var w=isO(e)?e.when:null; return !w||(has(w.tod,c.tod)&&has(w.season,c.season)&&has(w.month,c.month)&&has(w.dow,c.dow)&&has(w.arc,c.arc)&&has(w.beat,c.beat)); }
  function wt(e){ return (isO(e)&&(e.wgt||RW[e.r]))||10; }
  function fill(t,v){ if(v&&typeof t==='string') Object.keys(v).forEach(function(k){ t=t.split('{'+k+'}').join(v[k]==null?'':v[k]); }); return t; }
  function weighted(l){ var tot=0; l.forEach(function(e){ tot+=wt(e); }); var r=Math.random()*tot; for(var i=0;i<l.length;i++){ r-=wt(l[i]); if(r<0) return l[i]; } return l[l.length-1]; }
  function out(e,v){ return isO(e)&&e.t!=null?fill(e.t,v):fill(e,v); }
  function choose(key,list,s){ var rec=s.recent[key]||(s.recent[key]=[]), k=Math.max(1,Math.min(4,Math.floor((list.length-1)/2)));
    var fresh=list.filter(function(e){ return rec.indexOf(h(txt(e)))<0; }), e=weighted(fresh.length?fresh:list), id=h(txt(e));
    rec.push(id); while(rec.length>k) rec.shift();
    if(isO(e)&&(e.r==='u'||e.r==='r')) s.seen[id]=(s.seen[id]||0)+1;
    return e; }
  function pick(key,arr,opt){ opt=opt||{};
    try{
      var c=ctx(), base=(arr||[]).concat(P[key]||[]), list=base.filter(function(e){ return ok(e,c); });
      if(!list.length) list=base;
      if(!list.length) return '';
      var s=st(); key=key||('a'+h(txt(list[0])));
      var cp=CAM[opt.who];
      if(cp&&cp.length&&opt.cameo!==false&&(Date.now()-(s.cam||0))>6*36e5&&Math.random()<(opt.cameoP!=null?opt.cameoP:.04)){
        var cl=cp.filter(function(e){ return ok(e,c); });
        if(cl.length){ s.cam=Date.now(); return out(choose('cam.'+opt.who,cl,s),opt.vars); } }
      return out(choose(key,list,s),opt.vars);
    }catch(e){ var a=arr||[]; return out(a[Math.floor(Math.random()*a.length)],opt.vars); } }
  return {
    pick:pick,
    add:function(key,lines){ P[key]=(P[key]||[]).concat(lines); },
    get:function(key){ var c=ctx(); return (P[key]||[]).filter(function(e){ return ok(e,c); }).map(function(e){ return out(e); }); },
    cameo:function(who,lines){ CAM[who]=(CAM[who]||[]).concat(lines); },
    setArcs:function(ids){ ARCS=ids.slice(); },
    arcNote:function(id,beat,text){ NOTES[id+'.'+beat]=text; },
    arcNow:function(){ var a=arcNow(); return {id:a.id,beat:a.beat,week:a.week,note:NOTES[a.id+'.'+a.beat]||''}; },
    stats:function(){ var o={pools:{},cameo:{}}; Object.keys(P).forEach(function(k){ o.pools[k]=P[k].length; }); Object.keys(CAM).forEach(function(k){ o.cameo[k]=CAM[k].length; }); return o; }
  };
})();
const KEY='life_quest_save_v1';
// 보상 절반 규칙: 홀수면 1을 깎아 짝수로 만든 뒤 절반 (예: 5→2, 20→10).
// 업적/이벤트 골드는 저장 데이터에 원래 값이 들어 있어서, 지급·표시 시점에 이 함수로 절반을 계산함
const halfG=n=>{ n=Math.floor(+n)||0; return (n-(n%2))/2; };
function kstNow(){ return new Date(Date.now()+9*36e5); }
function dayStartH(){ try{ return (S&&S.settings&&S.settings.dayStart!=null)?S.settings.dayStart:6; }catch(e){ return 6; } }
function todayStr(){ return new Date(Date.now()+9*36e5-dayStartH()*36e5).toISOString().slice(0,10); }
function dispDate(o){ return new Date(todayStr()+'T12:00:00Z').toLocaleDateString('ko-KR',Object.assign({timeZone:'UTC'},o)); }
function defaultData(){
  return {
    settings:{clearPercent:75,dayStart:6},
    dailyQuests:[
      {id:'d1',name:'걷기 5,000보',active:true},
      {id:'d2',name:'근력 운동 × 10',active:true},
      {id:'d3',name:'운동 × 1',active:true},
      {id:'d4',name:'저녁 18시경',active:true},
      {id:'d5',name:'취침 23시경',active:true},
      {id:'d6',name:'스트레칭',active:true},
      {id:'d7',name:'물 충분히 마시기',active:true},
      {id:'d8',name:'디저트 규칙',active:true},
    ],
    history:{}, // date -> {done:{id:bool}, percent, cleared}
    mainQuests:[
      {id:'debt',name:'DEBT',desc:'약 5,000,000원의 빚을 청산한다',type:'debt',original:5000000,current:5000000,notes:'',relatedAch:['a4'],relatedReward:''},
      {id:'ytA',name:'YOUTUBE · CHANNEL A',desc:'음악 × 비주얼 × 소설',type:'youtube',videos:0,need:3,notes:'',relatedAch:[],relatedReward:''},
      {id:'ytB',name:'YOUTUBE · CHANNEL B',desc:'플레이리스트 채널',type:'youtube',videos:0,need:3,notes:'',relatedAch:[],relatedReward:'',
        themes:[
          {id:'th1',name:'Night',archived:false,playlists:[{id:'pl1',name:'기본 플레이리스트',videos:[]}]},
        ]},
      {id:'cafe',name:'404 DRINK BAR',desc:'나만의 카페를 여는 여정',type:'stages',
        stages:['컨셉 기획','메뉴 리서치','레시피 개발','원가 계산','브랜드 개발','자금 조달','장소 선정','오픈 준비'],doneStages:0,notes:'',relatedAch:['a5'],relatedReward:''},
    ],
    subQuests:[
      {id:'body',name:'BODY',desc:'6개월 몸관리 프로젝트',progress:0,total:180,notes:'',relatedAch:[],relatedReward:''},
      {id:'cafelab',name:'CAFÉ LAB',desc:'레시피 연구소',recipes:[],notes:'',relatedAch:[],relatedReward:''},
    ],
    achievements:[
      {id:'a1',name:'첫걸음',desc:'데일리 퀘스트를 처음으로 클리어했어요',cond:{type:'totalClear',value:1},unlocked:false},
      {id:'a2',name:'사흘 연속',desc:'데일리 퀘스트 3일 연속 클리어',cond:{type:'streak',value:3},unlocked:false},
      {id:'a3',name:'일주일의 생존자',desc:'데일리 퀘스트 7일 연속 클리어',cond:{type:'streak',value:7},unlocked:false},
      {id:'a4',name:'빚 제로',desc:'모든 빚을 청산했어요',cond:{type:'debtZero'},unlocked:false},
      {id:'a5',name:'404 오픈',desc:'404 DRINK BAR 오픈',cond:{type:'cafeOpen'},unlocked:false},
      {id:'a6',name:'첫 한 잔',desc:'카페 랩에 첫 레시피 만들기',cond:{type:'recipes',value:1},unlocked:false},
      {id:'a7',name:'레시피 연구가',desc:'레시피 10개 만들기',cond:{type:'recipes',value:10},unlocked:false},
      {id:'a8',name:'첫 창작',desc:'첫 유튜브 영상 완성',cond:{type:'videos',value:1},unlocked:false},
      {id:'a9',name:'세 개의 씨앗',desc:'유튜브 영상 3개 완성',cond:{type:'videos',value:3},unlocked:false},
    ],
    rewards:[
      {id:'r1',name:'☕ 카페 방문',redeemed:false},
      {id:'r2',name:'📖 책 구매',redeemed:false},
      {id:'r3',name:'🎮 게임 시간',redeemed:false},
      {id:'r4',name:'🍰 디저트',redeemed:false},
      {id:'r5',name:'🌿 완전 휴식일',redeemed:false},
    ],
  };
}
let S;
try{ S = JSON.parse(localStorage.getItem(KEY)) || defaultData(); }catch(e){ S = defaultData(); }
let _saveWarned=false;
try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist(); }catch(e){ LQ.err(e); }
ensureAchievements();
ensureMisc();
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); _saveWarned=false; }catch(e){ if(!_saveWarned){ _saveWarned=true; try{ toast('⚠ 저장 실패! 백업 코드를 만들어 두세요'); }catch(_){ LQ.err(_); } } } }
let calOffset=0;
let lastDay=todayStr();
function dayChanged(){ return todayStr()!==lastDay; }
function rolloverDay(){
  lastDay=todayStr(); calOffset=0;
  try{ ensureMisc(); computeToday(); save(); }catch(e){ LQ.err(e); }
  setTimeout(()=>{ try{ monthlyAutoCheck(); }catch(e){ LQ.err(e); } },300);
  const a=document.querySelector('.screen.active'); showScreen(a?a.id.replace('screen-',''):'home');
}
function checkRollover(){ if(dayChanged()) rolloverDay(); }
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) checkRollover(); });
window.addEventListener('pageshow',checkRollover);
window.addEventListener('focus',checkRollover);
setInterval(checkRollover,60000);
const GIRL_AVATAR = 'assets/928c79d167.jpg';
const LIB_BG = 'assets/f2a4f35c1e.jpg';
const BG_TEXTURE = 'assets/6b35947715.jpg';
const LIB_FULL='assets/af3ed85fe2.jpg';
/* ===== 로웨나 표정 (홈 큰 사진): 상황별 얼굴 + 창밖 하늘 마스크 ===== */
const LW_FACES={"greet": {"s": "assets/e724548e87.webp", "b": [25.667, 11.775, 5.375, 16.462], "m": "assets/7795500a3b.png"}, "proud": {"s": "assets/bf3317aa84.webp", "b": [25.083, 11.551, 5.583, 16.406], "m": "assets/8bcbe9a168.png"}, "sad": {"s": "assets/8be5330d0e.webp", "b": [29.583, 11.551, 4.125, 16.518], "m": "assets/d289feb41e.png"}, "worry": {"s": "assets/8dddc5d945.webp", "b": [30.542, 13.504, 1.917, 13.281], "m": "assets/a29207bce1.png"}, "worry2": {"s": "assets/6498fb8a56.webp", "b": [24.542, 11.384, 5.542, 16.574], "m": "assets/5ac816bd4a.png"}, "smile": {"s": "assets/4fc4bf44b4.webp", "b": [24.417, 11.496, 5.583, 16.518], "m": "assets/aab86df5ae.png"}, "angry": {"s": "assets/9fa9032086.webp", "b": [24.417, 11.384, 5.667, 16.629], "m": "assets/1e7b9b46d6.png"}, "proud2": {"s": "assets/4c4d44c56e.webp", "b": [24.167, 11.551, 5.667, 16.406], "m": "assets/c92f767ca0.png"}, "give": {"s": "assets/905635ebea.webp", "b": [26.833, 11.384, 5.125, 16.183], "m": "assets/8c06876a17.png"}, "laugh": {"s": "assets/ac2461cbb5.webp", "b": [24.875, 11.998, 5.208, 15.792], "m": "assets/02ebbe5854.png"}, "listen": {"s": "assets/7a49172e25.webp", "b": [26.333, 12.054, 4.792, 16.071], "m": "assets/fd34b573c7.png"}};
const LW_CROP={"greet": "assets/0af67408b9.webp", "proud": "assets/96a2619e58.webp", "sad": "assets/a56c365233.webp", "worry": "assets/f107692672.webp", "worry2": "assets/bddd02f381.webp", "smile": "assets/d20b0d763c.webp", "angry": "assets/ffbc5a5424.webp", "proud2": "assets/9e5a381076.webp", "give": "assets/4ac91d5140.webp", "laugh": "assets/d064da8e16.webp", "listen": "assets/a8d70bbb34.webp"};
var LW_MOOD_FACE={idle:'greet','':'greet',cheer:'proud',clear:'smile',sleepy:'proud',happy:'smile',okay:'proud',meh:'worry',sad:'sad',angry:'angry',anxious:'worry2'};
var LW_KIND_FACE={comeback:'greet',first:'greet',early:'greet',clear:'smile',streak:'proud2',debt:'proud2',video:'proud2',stage:'proud2',event:'give',reward:'give',recipe:'give'};
var _lwFace='',_lwBase='greet',_lwTmpT=null;
function lwSceneFace(k){ const F=LW_FACES[k]||LW_FACES.greet; if(_lwFace===k) return; const im=document.getElementById('lowenaSceneImg'), box=document.getElementById('homeLowena'); if(!im||!box) return; _lwFace=k; im.src=F.s; const st=box.style; st.setProperty('--wl',F.b[0]+'%'); st.setProperty('--wt',F.b[1]+'%'); st.setProperty('--ww',F.b[2]+'%'); st.setProperty('--wh',F.b[3]+'%'); st.setProperty('--wm','url("'+F.m+'")'); }
function lwFaceBase(k){ _lwBase=k; if(!_lwTmpT) lwSceneFace(k); }
function lwFaceTemp(k,ms){ lwSceneFace(k); clearTimeout(_lwTmpT); _lwTmpT=setTimeout(function(){ _lwTmpT=null; lwSceneFace(_lwBase); },ms||60000); }
function mascotImg(size,mood){
  const fx={clear:'<i class="mfx">✨</i>',sleepy:'<i class="mfx zz">z<b>Z</b></i>'}[mood]||'';
  return `<span class="mascot ${mood?'m-'+mood:''}" style="width:${size}px;height:${size}px"><img src="${GIRL_AVATAR}" alt="" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);display:block;box-shadow:0 3px 6px rgba(0,0,0,.4)">${fx}</span>`;
}

function bgNames(){ return {castle:'밤의 성',sky:'별이 총총한 하늘',candles:'떠다니는 촛불',circle:'큰 마법진'}; }
function bgScene(k){
  bgScene.c=bgScene.c||{}; if(bgScene.c[k]) return bgScene.c[k];
  let x=({castle:7,sky:19,candles:31,circle:43})[k]>>>0; const r=()=>(x=(x*1664525+1013904223)>>>0)/4294967296, W=600, H=1000, G='#e9c977'; let o='';
  const stars=(n,ym,op)=>{ for(let i=0;i<n;i++){ const big=r()<.08; o+=`<circle cx='${(r()*W).toFixed(1)}' cy='${(r()*ym).toFixed(1)}' r='${big?1.7:(.5+r()*.9).toFixed(2)}' fill='${G}' fill-opacity='${(op*(.4+r()*.6)).toFixed(2)}'/>`; } };
  const spark=(cx,cy,q,op)=>{ o+=`<path d='M${cx} ${cy-q}Q${cx} ${cy} ${cx+q} ${cy}Q${cx} ${cy} ${cx} ${cy+q}Q${cx} ${cy} ${cx-q} ${cy}Q${cx} ${cy} ${cx} ${cy-q}Z' fill='${G}' fill-opacity='${op}'/>`; };
  const glow=(cx,cy,rr,op)=>{ o+=`<circle cx='${cx}' cy='${cy}' r='${rr}' fill='url(#g)' opacity='${op}'/>`; };
  if(k==='castle'){
    stars(75,700,.42); glow(470,150,95,.55); o+=`<circle cx='470' cy='150' r='24' fill='#f4e6b8' fill-opacity='.14'/>`; spark(120,120,6,.35); spark(300,260,5,.3); spark(80,380,4,.28);
    const T=[[6,34,140,44],[44,22,100,30],[72,42,190,60],[120,20,130,0],[146,64,105,0],[214,30,170,50],[250,92,120,0],[288,46,250,72],[344,88,110,0],[438,26,160,44],[468,44,205,64],[518,22,120,26],[544,52,150,0],[570,30,110,36]];
    let tw='', win='';
    T.forEach(([tx,w,h,rh])=>{ tw+=`<rect x='${tx}' y='${H-h}' width='${w}' height='${h}'/>`;
      if(rh) tw+=`<path d='M${tx-3} ${H-h}L${tx+w/2} ${H-h-rh}L${tx+w+3} ${H-h}Z'/>`; else for(let c=tx;c<tx+w-4;c+=9) tw+=`<rect x='${c}' y='${H-h-6}' width='5' height='6'/>`;
      for(let i=0;i<Math.floor(h/45);i++) win+=`<rect x='${(tx+4+r()*(w-10)).toFixed(1)}' y='${(H-h+14+r()*(h-30)).toFixed(1)}' width='2.4' height='4' fill='${G}' fill-opacity='${(.35+r()*.4).toFixed(2)}'/>`; });
    o+=`<g fill='#090503' fill-opacity='.82'>${tw}<rect x='0' y='${H-22}' width='${W}' height='22'/></g>${win}`;
  } else if(k==='sky'){
    stars(150,H,.5); [[90,150],[430,300],[250,610],[520,760],[60,820]].forEach(q=>spark(q[0],q[1],5+r()*3,.32));
    o+=`<g fill='none' stroke='${G}' stroke-opacity='.13' stroke-width='1'><path d='M90 210L130 250L182 228L232 290L210 350'/><path d='M380 560L432 520L490 575L458 640'/></g>`;
    [[90,210],[130,250],[182,228],[232,290],[210,350],[380,560],[432,520],[490,575],[458,640]].forEach(q=>o+=`<circle cx='${q[0]}' cy='${q[1]}' r='2' fill='${G}' fill-opacity='.3'/>`);
    o+=`<path transform='translate(430 70) scale(2.2)' d='M28 8a12 12 0 1 0 6 20a9 9 0 0 1 -6 -20z' fill='#f4e6b8' fill-opacity='.2'/>`;
  } else if(k==='candles'){
    stars(45,H*.8,.3);
    for(let i=0;i<24;i++){ const cx=30+r()*540, cy=70+r()*860, s=.6+r()*.9, d=.5+s*.3;
      glow(cx.toFixed(1),(cy-8*s).toFixed(1),(20*s).toFixed(1),d.toFixed(2));
      o+=`<rect x='${(cx-2*s).toFixed(1)}' y='${cy.toFixed(1)}' width='${(4*s).toFixed(1)}' height='${(14*s).toFixed(1)}' fill='#efe1bd' fill-opacity='${(.14+s*.08).toFixed(2)}'/><ellipse cx='${cx.toFixed(1)}' cy='${(cy-3*s).toFixed(1)}' rx='${(1.6*s).toFixed(1)}' ry='${(3.4*s).toFixed(1)}' fill='#f6d98a' fill-opacity='.55'/>`; }
  } else {
    stars(60,H,.32); const cx=300, cy=500; let g='';
    g+=`<circle cx='${cx}' cy='${cy}' r='250' stroke-opacity='.11'/><circle cx='${cx}' cy='${cy}' r='236' stroke-opacity='.07' stroke-dasharray='3 7'/><circle cx='${cx}' cy='${cy}' r='150' stroke-opacity='.09'/><circle cx='${cx}' cy='${cy}' r='118' stroke-opacity='.07' stroke-dasharray='2 5'/>`;
    const pt=(a,rr)=>[(cx+Math.cos(a)*rr).toFixed(1),(cy+Math.sin(a)*rr).toFixed(1)];
    [-90,90].forEach(a0=>{ const P=[0,1,2].map(i=>pt((a0+i*120)*Math.PI/180,190)); g+=`<path d='M${P[0].join(' ')}L${P[1].join(' ')}L${P[2].join(' ')}Z' stroke-opacity='.1'/>`; });
    for(let i=0;i<24;i++){ const a=i*Math.PI/12, A=pt(a,250), B=pt(a,262), C=pt(a,203), D=pt(a+.05,215); g+=`<path d='M${A.join(' ')}L${B.join(' ')}M${C.join(' ')}L${D.join(' ')}' stroke-opacity='.12'/>`; }
    o+=`<g fill='none' stroke='${G}' stroke-width='1' stroke-linecap='round'>${g}</g>`;
  }
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='xMidYMid slice'><defs><radialGradient id='g'><stop offset='0' stop-color='${G}' stop-opacity='.4'/><stop offset='1' stop-color='${G}' stop-opacity='0'/></radialGradient></defs>${o}</svg>`;
  return bgScene.c[k]=svg;
}
function bgLayer(){ let d=document.getElementById('bgBase'); if(!d){ d=document.createElement('div'); d.id='bgBase'; document.body.insertBefore(d,document.body.firstChild); } return d; }
function applyBg(){
  let k=S.settings.bgPattern==null?'castle':S.settings.bgPattern; const b=bgLayer().style;
  if(k!=='none'&&!bgNames()[k]){ k='castle'; S.settings.bgPattern=k; }
  const base=`linear-gradient(rgba(23,14,8,.90),rgba(20,12,7,.94)), url(${BG_TEXTURE})`;
  b.backgroundImage=k==='none'?base:`url("data:image/svg+xml,${encodeURIComponent(bgScene(k))}"), ${base}`;
  b.backgroundSize=k==='none'?'cover, cover':'cover, cover, cover';
  b.backgroundRepeat=k==='none'?'no-repeat, no-repeat':'no-repeat, no-repeat, no-repeat';
  b.backgroundAttachment='scroll'; b.backgroundPosition='center';
}
function setBgPattern(v){ S.settings.bgPattern=v; save(); applyBg(); toast(v==='none'?'원래 배경으로 되돌렸어요':'배경: '+bgNames()[v]); }
function renderHeaderFox(){ document.getElementById('headerFox').innerHTML = mascotImg(32); }
function updateHomeMascot(active,doneCount,cleared){
  const el=document.getElementById('homeMascot'); if(!el) return;
  const now=kstNow(), day=Math.floor(now/864e5), hr=now.getUTCHours();
  const pick=a=>a[(day+doneCount)%a.length], note=evNote();
  let mood,msg;
  if(active.length===0){ mood='sleepy'; msg='퀘스트 마스터에서 데일리 퀘스트를 만들어 주면 함께 모험을 시작할 수 있어요.'; }
  else if(cleared){ mood='clear'; msg=pick(['QUEST CLEAR! 오늘도 멋졌어요.','오늘의 페이지가 완성됐어요.','수고했어요. 푹 쉬어도 좋아요.','대단해요. 내일도 새 퀘스트가 기다려요.']); if(note) msg+=' '+note; }
  else if(hr>=23||hr<5){ mood='sleepy'; msg=pick(['늦었어요. 내일은 새로운 퀘스트예요.','오늘은 여기까지여도 괜찮아요. 푹 자요.','벌점은 없어요. 내일 다시 펼쳐봐요.']); }
  else if(note&&(doneCount+day)%2===0){ mood='cheer'; msg=note; }
  else if(doneCount>0){ const need=Math.max(1,Math.ceil(active.length*S.settings.clearPercent/100-1e-9)-doneCount); mood='cheer'; msg=pick([`클리어까지 ${need}개 남았어요. 조금만 더!`,`좋아요, 잘 하고 있어요! ${need}개만 더 하면 클리어예요.`,'한 걸음씩, 그거면 충분해요.','이 페이스 좋아요. 계속 가봐요.']); }
  else{ mood='idle'; msg=pick(['오늘의 모험, 지금부터 시작해볼까요?','책장을 넘기듯 하나씩 해봐요.','첫 퀘스트부터 가볍게 시작해요.','오늘의 기록장이 펼쳐졌어요.']); }
  if(_say&&S.settings.lowenaReact!==false&&Date.now()-_say.t<(_say.ttl||90000)){ msg=esc(_say.text); mood=_say.mood||mood; }
  try{ lwFaceBase((_say&&_say.face&&S.settings.lowenaReact!==false&&Date.now()-_say.t<(_say.ttl||90000))?_say.face:(LW_MOOD_FACE[mood]||'greet')); }catch(e){ LQ.err(e); }
  el.innerHTML=`<div class="mascot-row">${mascotImg(56,mood)}<div class="speech-bubble">${msg}</div></div>`;
}
function emptyMascot(msg){ return `<div class="mascot-row">${mascotImg(44)}<div class="speech-bubble">${msg}</div></div>`; }
let _toastT=null;
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(_toastT); _toastT=setTimeout(()=>t.classList.remove('show'),Math.max(1600,String(msg).length*90)); }

function computeToday(){
  const t=todayStr();
  const day = S.history[t] || {done:{}};
  const active = S.dailyQuests.filter(q=>q.active&&!(q.off||[]).includes(new Date(t+'T00:00:00Z').getUTCDay()));
  const doneCount = active.filter(q=>day.done[q.id]).length;
  const pct = active.length ? Math.round((doneCount/active.length)*1000)/10 : 0;
  const cleared = active.length>0 && pct >= S.settings.clearPercent;
  day.percent=pct; day.cleared=cleared; if(pct>=100) (S.flags=S.flags||{}).perfect=true;
  S.history[t]=day;
  return {active, day, doneCount, pct, cleared};
}

function celebClear(){ S.celebDay=S.celebDay||{}; const t=todayStr(); if(S.celebDay[t]) return; S.celebDay[t]=1; celebrate('clear','오늘의 퀘스트를 클리어했어요'); }
function toggleQuest(id){
  if(dayChanged()){ rolloverDay(); toast('새로운 하루가 시작됐어요'); if(!computeToday().active.some(q=>q.id===id)) return; }
  const t=todayStr(); const day=S.history[t]||{done:{}};
  day.done[id]=!day.done[id]; S.history[t]=day;
  if(day.done[id]){ const hh=kstNow().getUTCHours(); if(hh>=4&&hh<6) (S.flags=S.flags||{}).dawn=true; bodyAuto(); }
  else { const qq=S.dailyQuests.find(x=>x.id===id); if(qq&&/운동/.test(qq.name)) bodyRecheck(t); }
  const before=!!day.cleared;
  sfx(day.done[id]?'check':'uncheck');
  computeToday(); save();
  if(!before && S.history[t].cleared){ celebClear(); earnDay('clear',5); comebackCheck(); chestCheck(); }
  checkAchievements(); renderHome();
}

function checkAchievements(){
  const dates=Object.keys(S.history).sort();
  let streak=0,maxStreak=0,total=0,prev=null;
  dates.forEach(d=>{
    if(S.history[d].cleared){ total++; streak=(prev&&(new Date(d)-new Date(prev))===86400000)?streak+1:1; prev=d; maxStreak=Math.max(maxStreak,streak); }
    else if(S.history[d].pass){ prev=d; } else{ streak=0; prev=null; }
  });
  const debt=S.mainQuests.find(m=>m.id==='debt'), cafe=S.mainQuests.find(m=>m.id==='cafe');
  const lab=S.subQuests.find(s=>s.id==='cafelab');
  const videos=S.mainQuests.filter(m=>m.type==='youtube').reduce((s,m)=>s+(m.videos||0),0);
  S.achievements.forEach(a=>{
    if(a.unlocked) return;
    const c=a.cond||{type:'manual'}, n=+c.value||1; let ok=false;
    if(c.type==='totalClear') ok=total>=n;
    else if(c.type==='streak') ok=maxStreak>=n;
    else if(c.type==='recipes') ok=!!lab && lab.recipes.length>=n;
    else if(c.type==='videos') ok=videos>=n;
    else if(c.type==='debtZero') ok=!!debt && debt.current<=0;
    else if(c.type==='cafeOpen') ok=!!cafe && cafe.doneStages>=cafe.stages.length;
    else if(c.type==='debtPct') ok=!!debt && debt.original>0 && (1-debt.current/debt.original)*100>=n;
    else if(c.type==='nightCount') ok=Object.keys(S.sleepLog||{}).length>=n;
    else if(c.type==='bodyDays'){ const b=S.subQuests.find(x=>x.id==='body'); ok=!!b && b.progress>=n; }
    else if(c.type==='recipeDone') ok=!!lab && lab.recipes.filter(r=>r.status==='COMPLETE').length>=n;
    else if(c.type==='flag') ok=!!(S.flags||{})[c.key];
    else if(c.type==='rewardsUsed') ok=S.rewards.filter(r=>r.redeemed).length>=n;
    else if(c.type==='stages') ok=!!cafe&&cafe.doneStages>=n;
    else if(c.type==='earlySleep') ok=Object.values(S.sleepLog||{}).filter(e=>e.time>='19:00'&&e.time<'23:00').length>=n;
    else if(c.type==='bodyLogs') ok=(S.bodyLog||[]).length>=n;
    else if(c.type==='journal') ok=Object.values(S.sleepLog||{}).filter(e=>e.note).length>=n;
    else if(c.type==='buyCount') ok=(S.ledger||[]).length>=n;
    else if(c.type==='goldTotal') ok=Object.keys(S.goldDay||{}).filter(k=>!/chest$/.test(k)).reduce((x,k)=>x+(+S.goldDay[k]||0),0)>=n;
    else if(c.type==='achCount') ok=S.achievements.filter(x=>x.unlocked).length>=n;
    else if(c.type==='eventClear') ok=(S.events||[]).filter(e=>e.cleared).length>=n;
    else if(c.type==='pantry') ok=(S.pantry||[]).length>=n;
    else if(c.type==='giftGot') ok=Object.keys(S.giftGot||{}).length>=n;
    else if(c.type==='chatTurns') ok=(S.deepChats||[]).reduce((x,cv)=>x+Math.floor(((cv&&cv.m)||[]).length/2),0)>=n;
    if(ok){ S.gold=(S.gold||0)+halfG(a.gold||20); a.unlocked=true; a.unlockedAt=todayStr(); celebrate('ach',a.name); }
  });
  save();
  try{ achMilestone(); }catch(e){ LQ.err(e); }
}

function renderHome(){
  document.getElementById('topDate').textContent = dispDate({year:'numeric',month:'long',day:'numeric'})+' · ◈ '+(S.gold||0);
  document.getElementById('homeDate').textContent = dispDate({month:'long',day:'numeric'}).toUpperCase();
  const {active,day,doneCount,pct,cleared} = computeToday();
  const list=document.getElementById('dailyList');
  if(active.length===0){ list.innerHTML='<div class="empty">퀘스트 마스터에서 데일리 퀘스트를 추가하세요</div>'; }
  else{
    list.innerHTML = active.map(q=>{
      const on = !!day.done[q.id];
      return `<div class="quest-row ${on?'done':''}" onclick="toggleQuest('${q.id}')">
        <div class="check">${on?'✓':''}</div><div class="label">${esc(q.name)}${q.desc?`<div class="qdesc2">${esc(q.desc)}</div>`:''}</div></div>`;
    }).join('');
  }
  document.getElementById('clearFrac').textContent = `${doneCount} / ${active.length}`;
  document.getElementById('clearBar').style.width = active.length? pct+'%':'0%';
  const w=document.getElementById('clearWord');
  if(active.length===0){ w.textContent=''; }
  else if(cleared){ w.textContent='QUEST CLEAR'; w.className='status-word clear'; }
  else{ w.textContent='QUEST NOT CLEARED'; w.className='status-word notclear'; }
  updateHomeMascot(active,doneCount,cleared); renderEvents(); renderNightBtn(); try{ renderPantryWarn(); }catch(e){ LQ.err(e); }
  const unlocked = S.achievements.filter(a=>a.unlocked);
  const hp=document.getElementById('homeAchievePreview'); hp.className='';
  hp.innerHTML = unlocked.length
    ? unlocked.slice(-2).map(a=>`<div class="seal"><div class="icon">✦</div><div><div class="t">${esc(a.name)}</div><div class="d">${esc(a.desc)}</div></div></div>`).join('')
    : emptyMascot('아직 달성한 업적이 없어요. 오늘 첫 퀘스트를 클리어해보세요!');
}

function calShift(d){ calOffset+=d; renderCalendar(); }
function renderCalendar(){
  const base=new Date(todayStr()+'T12:00:00Z'); base.setUTCDate(1); base.setUTCMonth(base.getUTCMonth()+calOffset);
  const y=base.getUTCFullYear(), m=base.getUTCMonth();
  document.getElementById('calMonthLabel').textContent = `${y}. ${m+1}`;
  const first=new Date(Date.UTC(y,m,1)).getUTCDay();
  const days=new Date(Date.UTC(y,m+1,0)).getUTCDate();
  const todayFull=todayStr();
  let html = ['일','월','화','수','목','금','토'].map(d=>`<div class="dow">${d}</div>`).join('');
  for(let i=0;i<first;i++) html+='<div class="cal-day blank"></div>';
  for(let d=1;d<=days;d++){
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = S.history[ds];
    let cls='nodata', mark='—', bg='';
    if(rec){ cls = rec.cleared?'clear':'notclear'; mark = rec.cleared?'✓':'×'; bg=`background:rgba(${rec.cleared?'90,122,62':'122,50,41'},${(.12+(rec.percent||0)/100*.5).toFixed(2)})`; if(rec.pass&&!rec.cleared){ cls='nodata'; mark='☾'; bg=''; } else if(ds===todayFull&&!rec.cleared){ mark='·'; } }
    const todayCls = ds===todayFull ? ' today':'';
    html += `<div class="cal-day ${cls}${todayCls}" style="${bg}" onclick="openDayModal('${ds}')"><span>${d}</span><span class="mark">${mark}</span></div>`;
  }
  document.getElementById('calGrid').innerHTML = html;
}
function computeDay(ds){
  const day=S.history[ds]||{done:{}}; day.done=day.done||{};
  const dow=new Date(ds+'T00:00:00Z').getUTCDay();
  const active=S.dailyQuests.filter(q=>q.active&&!(q.off||[]).includes(dow));
  const n=active.filter(q=>day.done[q.id]).length;
  day.percent=active.length?Math.round(n/active.length*1000)/10:0;
  day.cleared=active.length>0&&day.percent>=S.settings.clearPercent;
  if(day.percent>=100) (S.flags=S.flags||{}).perfect=true;
  S.history[ds]=day; return {active,day,n};
}
function toggleDayQuest(ds,id){
  if(ds===todayStr()){ toggleQuest(id); openDayModal(ds); renderCalendar(); return; }
  const day=S.history[ds]||{done:{}}; day.done=day.done||{}; day.done[id]=!day.done[id]; S.history[ds]=day;
  const q=S.dailyQuests.find(x=>x.id===id);
  if(q&&/운동/.test(q.name)){ if(day.done[id]){ S.bodyDays[ds]=1; bodySync(); } else bodyRecheck(ds); }
  computeDay(ds); save(); sfx(day.done[id]?'check':'uncheck'); checkAchievements();
  openDayModal(ds); renderCalendar();
}
function openDayModal(ds){
  const editable = ds<=todayStr();
  const day = S.history[ds]||{done:{}}, dow=new Date(ds+'T00:00:00Z').getUTCDay();
  const active = S.dailyQuests.filter(q=>q.active&&!(q.off||[]).includes(dow));
  const rows = active.map(q=>{
    const on=!!(day.done||{})[q.id];
    return `<div class="milestone ${on?'mdone':''}" ${editable?`onclick="toggleDayQuest('${ds}','${q.id}')" style="cursor:pointer"`:''}><span class="m-check">${on?'✓':'○'}</span>${esc(q.name)}</div>`;
  }).join('') || '<div class="empty">이 날의 퀘스트가 없어요</div>';
  const hint = editable ? '<div class="mdesc" style="margin-top:6px">퀘스트를 눌러 체크를 바꿀 수 있어요. 완료율은 지금 설정된 퀘스트 기준으로 계산돼요.</div>' : '<div class="mdesc" style="margin-top:6px">아직 오지 않은 날이에요.</div>';
  document.getElementById('modalBox').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>${ds}</h2>${hint}${rows}<div class="modal-sec-h">완료율</div><div>${day.percent||0}% · ${day.cleared?'QUEST CLEAR':'QUEST NOT CLEARED'}${day.pass?' · ☾ 쉬는 날':''}</div>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal(){ document.getElementById('modalOverlay').classList.remove('show'); document.getElementById('modalBox').classList.remove('menu-mode'); renderQuests(); renderHome(); }

function debtQ(){ return S.mainQuests.find(m=>m.id==='debt'); }
function bodyQ(){ return S.subQuests.find(s=>s.id==='body'); }
function findQuest(id){ return S.mainQuests.find(q=>q.id===id) || S.subQuests.find(q=>q.id===id); }
function openQuestModal(id){
  const q=findQuest(id); if(!q) return;
  let milestones='';
  if(q.type==='stages'){ milestones = q.stages.map((s,i)=>`<div class="milestone ${i<q.doneStages?'mdone':''}"><span class="m-check">${i<q.doneStages?'✓':'○'}</span>${esc(s)}</div>`).join(''); }
  else if(q.type==='youtube'){ milestones = Array.from({length:q.need}).map((_,i)=>`<div class="milestone ${i<q.videos?'mdone':''}"><span class="m-check">${i<q.videos?'✓':'○'}</span>VIDEO ${i+1}</div>`).join(''); }
  else if(q.type==='debt'){ milestones = `<div class="milestone ${q.current<=0?'mdone':''}"><span class="m-check">${q.current<=0?'✓':'○'}</span>DEBT ZERO</div>`; }
  else if(q.id==='body'){ milestones = `<div class="milestone"><span class="m-check">○</span>${q.progress} / ${q.total}일 진행</div>`; }
  else if(q.id==='cafelab'){ const mg=r=>(+r.price>0)?(r.price-(+r.cost||0))/r.price:-1; milestones = q.recipes.slice().sort((a,b)=>mg(b)-mg(a)).map(r=>`<div class="milestone">${esc(r.name)} · ${esc(r.status)}${mg(r)>=0?' · 마진 '+Math.round(mg(r)*100)+'%':''}</div>`).join('') || '<div class="empty">레시피 없음</div>'; }
  const relAch = (q.relatedAch||[]).map(aid=>{ const a=S.achievements.find(x=>x.id===aid); return a?`<span class="chip">${a.unlocked?'✦':'🔒'} ${esc(a.name)}</span>`:''; }).join('') || '<span class="chip">연결된 업적 없음</span>';
  document.getElementById('modalBox').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>${esc(q.name)}</h2><div class="mdesc">${esc(q.desc||'')}</div>
    <div class="modal-sec-h">체크리스트 / 마일스톤</div>${milestones}${q.id==='body'?bodyLogHTML():''}${q.type==='debt'?debtSimHTML(q)+debtLogHTML(q):''}
    <div class="modal-sec-h">관련 업적</div>${relAch}
    <div class="modal-sec-h">노트</div>
    <textarea rows="3" placeholder="자유롭게 기록하세요" onchange="saveNote('${id}',this.value)">${esc(q.notes||'')}</textarea>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function saveNote(id,val){ const q=findQuest(id); if(q){ q.notes=val; save(); } }

function renderQuests(){
  const mq = document.getElementById('mainQuestList');
  mq.innerHTML = S.mainQuests.map(q=>{
    if(q.type==='debt'){
      const pct = Math.max(0,Math.min(100, Math.round((1-(q.current/q.original))*100)));
      return `<div class="quest-card" onclick="openQuestModal('${q.id}')"><div class="qname">${esc(q.name)}</div><div class="qdesc">${esc(q.desc)}</div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="meta"><span>남은 금액 ${q.current.toLocaleString()}원</span><span>${pct}%</span></div>
        <div class="inline" style="margin-top:8px"><button class="ghost-btn" onclick="event.stopPropagation();payDebt('${q.id}')">상환 입력</button></div></div>`;
    }
    if(q.type==='youtube'){
      const pct=Math.round((q.videos/q.need)*100);
      const unlocked = q.videos>=q.need;
      const actionBtn = q.id==='ytB'
        ? `<button class="ghost-btn" onclick="event.stopPropagation();openThemeEditor()">테마 관리</button>`
        : `<button class="ghost-btn" onclick="event.stopPropagation();addVideo('${q.id}')">영상 완료 +1</button>`;
      return `<div class="quest-card" onclick="openQuestModal('${q.id}')"><div class="qname">${esc(q.name)}</div><div class="qdesc">${esc(q.desc)}</div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="meta"><span>${q.videos} / ${q.need} VIDEOS</span><span class="${unlocked?'unlocked-tag':'locked-tag'}">${unlocked?'🔓 UNLOCKED':'🔒 LOCKED'}</span></div>${ytMonthHTML(q)}
        <div class="inline" style="margin-top:8px">${actionBtn}<button class="ghost-btn" onclick="event.stopPropagation();openProdModal('${q.id}')">제작 체크리스트</button></div></div>`;
    }
    if(q.type==='stages'){
      const pct=Math.round((q.doneStages/q.stages.length)*100);
      const cur = q.stages[q.doneStages] || 'OPEN';
      return `<div class="quest-card" onclick="openQuestModal('${q.id}')"><div class="qname">${esc(q.name)}</div><div class="qdesc">${esc(q.desc)}</div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="meta"><span>현재 단계: ${q.doneStages>=q.stages.length?'404 OPEN':esc(cur)}</span><span>${q.doneStages}/${q.stages.length}</span></div>
        <div class="inline" style="margin-top:8px">${q.doneStages<q.stages.length?`<button class="ghost-btn" onclick="event.stopPropagation();advanceStage('${q.id}')">다음 단계 완료</button>`:''}</div></div>`;
    }
  }).join('');

  const sq = document.getElementById('subQuestList');
  sq.innerHTML = S.subQuests.map(q=>{
    if(q.id==='body'){
      const pct=Math.round((q.progress/q.total)*100);
      return `<div class="quest-card" onclick="openQuestModal('${q.id}')"><div class="qname">${esc(q.name)}</div><div class="qdesc">${esc(q.desc)}</div>
        <div class="bar"><i style="width:${pct}%"></i></div><div class="meta"><span>실천 ${q.progress}일째 / ${q.total}일 · PHASE ${Math.min(Math.ceil(q.total/30),Math.floor(q.progress/30)+1)}/${Math.ceil(q.total/30)}</span><span>${pct}%</span></div>
        <div class="inline" style="margin-top:8px"><button class="ghost-btn" onclick="event.stopPropagation();bumpBody()">${S.bodyDays[todayStr()]?'✓ 오늘 실천 완료 (다시 누르면 취소)':'오늘 실천 기록하기'}</button></div><div class="qdesc" style="margin-top:8px">몸 관리(운동·스트레칭 등)를 한 날을 1일로 세는 기록이에요. 운동 퀘스트를 체크하면 자동으로 올라가고, 이 버튼으로도 직접 기록할 수 있어요. 하루에 한 번만 올라가요.</div><div class="inline"></div></div>`;
    }
    if(q.id==='cafelab'){
      return `<div class="quest-card" onclick="openQuestModal('${q.id}')"><div class="qname">${esc(q.name)}</div><div class="qdesc">${esc(q.desc)}</div>
        <div class="meta"><span>레시피 ${q.recipes.length}개</span></div>${labCover(q)}
        <div class="inline lab-btns" style="margin-top:8px"><button class="ghost-btn" onclick="event.stopPropagation();openPantry()">🧺 재료창고 (${S.pantry.length})</button><button class="ghost-btn" onclick="event.stopPropagation();addRecipe()">+ 레시피 추가</button><button class="ghost-btn" onclick="event.stopPropagation();openMenuBoard()">📋 메뉴판 보기</button></div>
        ${q.recipes.map(r=>`<div class="pl-row" onclick="event.stopPropagation();openRecipeModal('${r.id}')" style="${r.archived?'opacity:.45':''}"><span>${esc(r.name)}</span><span class="cnt">${esc(r.status)}</span></div>`).join('')}</div>`;
    }
  }).join('');
  try{ lwWatch(); }catch(e){ LQ.err(e); }
}

function payDebt(id){
  const q=S.mainQuests.find(m=>m.id===id);
  askText('상환한 금액(원)을 입력하세요','',v=>{ const n=parseInt(v,10);
    if(!isNaN(n)&&n>0){ const b4=q.current; q.current=Math.max(0,q.current-n); (q.payLog=q.payLog||[]).push({id:'p'+Date.now(),date:todayStr(),amt:b4-q.current}); const M=[25,50,75].filter(m=>{ const t=q.original*(1-m/100); return b4>t&&q.current<=t&&q.current>0; }); if(M.length) setTimeout(()=>toast('상환 '+M[M.length-1]+'% 돌파!'),400); save(); checkAchievements(); renderQuests(); if(q.current<=0) toast('DEBT ZERO'); } },{num:true});
}

/* ===== 유튜브 월간 목표 ===== */
function ytMonthN(q){ const ym=todayStr().slice(0,7); return (q.vLog||[]).filter(d=>d&&d.slice(0,7)===ym).length; }
function ytGoalCheck(q){ const g=+q.monthGoal||0, ym=todayStr().slice(0,7); if(g>0&&ytMonthN(q)>=g&&q.goalMonth!==ym){ q.goalMonth=ym; S.gold=(S.gold||0)+20; setTimeout(()=>toast('이번 달 영상 목표 달성! +20골드'),600); } }
function ytMonthHTML(q){ const g=+q.monthGoal||0, n=ytMonthN(q), td=todayStr().split('-').map(Number), left=new Date(Date.UTC(td[0],td[1],0)).getUTCDate()-td[2], oc=`onclick="event.stopPropagation();setMonthGoal('${q.id}')"`;
  if(!g) return `<div class="meta" style="cursor:pointer" ${oc}><span>🎯 이번 달 목표 정하기</span><span>›</span></div>`;
  const need=Math.max(0,g-n);
  return `<div class="meta" style="cursor:pointer" ${oc}><span>🎯 이번 달 ${n} / ${g}개</span><span>${need?'D-'+left+' · '+need+'개 남음':'✦ 달성'}</span></div><div class="bar"><i style="width:${Math.min(100,Math.round(n/g*100))}%"></i></div>`; }
function setMonthGoal(id){ const q=S.mainQuests.find(m=>m.id===id); if(!q) return; askText('이번 달 목표 영상 개수 (0이면 끔)',q.monthGoal||'',v=>{ const n=parseInt(v,10); q.monthGoal=(isNaN(n)||n<0)?0:n; save(); renderQuests(); },{num:true}); }
function ytRecalc(q){
  const before=q.videos, prod=(q.prod||[]).filter(v=>v.steps.every(Boolean)).length;
  const pl=(q.themes||[]).reduce((s,t)=>s+t.playlists.reduce((s2,p)=>s2+p.videos.length,0),0);
  if(!q.vLog) q.vLog=Array(before||0).fill(null); q.videos=(q.baseVideos||0)+prod+pl; while(q.vLog.length<q.videos) q.vLog.push(todayStr()); while(q.vLog.length>q.videos) q.vLog.pop(); ytGoalCheck(q); save(); checkAchievements();
  if(q.videos>=q.need && before<q.need) toast('NEW QUEST UNLOCKED');
}
function addVideo(id){ const q=S.mainQuests.find(m=>m.id===id); if(q.videos<q.need){ q.baseVideos=(q.baseVideos||0)+1; ytRecalc(q); renderQuests(); } }
const YT_STEPS=['기획','촬영','편집','업로드'];
function openProdModal(qid){
  const q=findQuest(qid); q.prod=q.prod||[];
  document.getElementById('modalBox').innerHTML=`<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>제작 체크리스트</h2><div class="mdesc">${esc(q.name)} · 4단계를 모두 체크하면 영상 1개가 완성으로 집계돼요. (${q.videos}/${q.need})</div>
    ${q.prod.map(v=>`<div class="theme-block"><div class="theme-head"><span class="tname">${esc(v.title)}${v.steps.every(Boolean)?' ✦':dueTag(v)}</span><span class="tacts"><input type="date" value="${v.due||''}" style="width:auto;margin:0;font-size:12px;padding:2px" onchange="setDue('${qid}','${v.id}',this.value)"><button onclick="delProd('${qid}','${v.id}')">✕</button></span></div>
      <div class="inline" style="flex-wrap:wrap">${YT_STEPS.map((s,i)=>`<button class="ghost-btn" style="${v.steps[i]?'background:rgba(154,117,48,.35);color:var(--ink)':'color:var(--brown)'}" onclick="toggleProd('${qid}','${v.id}',${i})">${v.steps[i]?'✓ ':''}${s}</button>`).join('')}</div></div>`).join('')||'<div class="empty" style="color:var(--ink-soft)">아직 영상이 없어요.</div>'}
    <div class="inline" style="margin-top:8px"><input id="newProd" placeholder="새 영상 제목"><button class="ghost-btn" onclick="addProd('${qid}')">추가</button></div>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function toggleProd(qid,vid,i){ const q=findQuest(qid), v=q.prod.find(x=>x.id===vid); v.steps[i]=!v.steps[i]; const was=q.videos; ytRecalc(q); if(v.steps.every(Boolean)) toast('영상 1개 완성!'); openProdModal(qid); }
function addProd(qid){ const t=document.getElementById('newProd').value.trim(); if(!t) return; const q=findQuest(qid); q.prod.push({id:'v'+Date.now(),title:t,steps:[false,false,false,false]}); save(); openProdModal(qid); }
function delProd(qid,vid){ askOk('이 영상 항목을 삭제할까요?',()=>{ const q=findQuest(qid); q.prod=q.prod.filter(x=>x.id!==vid); ytRecalc(q); openProdModal(qid); }); }

function ytB(){ return S.mainQuests.find(m=>m.id==='ytB'); }
function recomputeYtBVideos(){ ytRecalc(ytB()); }
function openThemeEditor(){
  const q=ytB();
  const html = q.themes.map(t=>`
    <div class="theme-block ${t.archived?'archived':''}">
      <div class="theme-head"><span class="tname">${esc(t.name)}${t.archived?' (보관됨)':''}</span>
        <span class="tacts">
          <button onclick="renameTheme('${t.id}')">✎</button>
          <button onclick="toggleArchiveTheme('${t.id}')">${t.archived?'복원':'보관'}</button>
          <button onclick="deleteTheme('${t.id}')">✕</button>
        </span></div>
      ${t.playlists.map(p=>`<div class="pl-row"><span onclick="addVideoToPlaylist('${t.id}','${p.id}')">▶ ${esc(p.name)}</span><span class="cnt">${p.videos.length}편 · <button class="small-x" style="font-size:11px" onclick="deletePlaylist('${t.id}','${p.id}')">✕</button></span></div>`).join('')}
      <button class="ghost-btn" style="margin-top:6px" onclick="addPlaylist('${t.id}')">+ 플레이리스트 추가</button>
    </div>`).join('') || '<div class="empty">테마가 없습니다</div>';
  document.getElementById('modalBox').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>THEME EDITOR</h2><div class="mdesc">CHANNEL B · 총 ${q.videos} / ${q.need} VIDEOS</div>
    ${html}
    <div class="inline" style="margin-top:10px"><input id="newThemeName" placeholder="새 테마 이름 (예: Rain)"><button class="ghost-btn" onclick="addThemeFromInput()">테마 추가</button></div>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function addThemeFromInput(){ const v=document.getElementById('newThemeName').value.trim(); if(!v) return; ytB().themes.push({id:'th'+Date.now(),name:v,archived:false,playlists:[]}); save(); openThemeEditor(); }
function renameTheme(id){ const t=ytB().themes.find(x=>x.id===id); askText('테마 이름 변경',t.name,v=>{ v=v.trim(); if(v){t.name=v; save(); openThemeEditor();} }); }
function toggleArchiveTheme(id){ const t=ytB().themes.find(x=>x.id===id); t.archived=!t.archived; save(); openThemeEditor(); }
function deleteTheme(id){ askOk('이 테마와 안의 플레이리스트·영상을 모두 삭제할까요?',()=>{ const q=ytB(); q.themes=q.themes.filter(x=>x.id!==id); recomputeYtBVideos(); openThemeEditor(); }); }
function addPlaylist(themeId){ const t=ytB().themes.find(x=>x.id===themeId); askText('플레이리스트 이름','',v=>{ v=v.trim(); if(v){t.playlists.push({id:'pl'+Date.now(),name:v,videos:[]}); save(); openThemeEditor();} }); }
function deletePlaylist(themeId,plId){ askOk('이 플레이리스트와 안의 영상을 삭제할까요?',()=>{ const t=ytB().themes.find(x=>x.id===themeId); t.playlists=t.playlists.filter(p=>p.id!==plId); recomputeYtBVideos(); openThemeEditor(); }); }
function addVideoToPlaylist(themeId,plId){ const t=ytB().themes.find(x=>x.id===themeId); const p=t.playlists.find(x=>x.id===plId); askText('완료한 영상 제목','',v=>{ v=v.trim(); if(v){p.videos.push({id:'v'+Date.now(),title:v}); recomputeYtBVideos(); openThemeEditor();} }); }
function advanceStage(id){ const q=S.mainQuests.find(m=>m.id===id); if(q.doneStages<q.stages.length){q.doneStages++; save(); checkAchievements(); renderQuests(); if(q.doneStages>=q.stages.length) toast('404 OPEN');} }
function bumpBody(){ const t=todayStr(); S.bodyManual=S.bodyManual||{}; if(S.bodyDays[t]){ delete S.bodyDays[t]; delete S.bodyManual[t]; toast('오늘 실천 기록을 취소했어요'); } else { S.bodyDays[t]=1; S.bodyManual[t]=1; toast('오늘도 해냈어요! 실천 '+(Object.keys(S.bodyDays).length+(S.subQuests.find(x=>x.id==='body').baseProgress||0))+'일째'); } bodySync(); save(); checkAchievements(); renderQuests(); }
function addRecipe(){
  askText('새 레시피 이름','',n=>{ n=n.trim(); if(n) addRecipe2(n); }); }
function addRecipe2(name){
  const q=S.subQuests.find(s=>s.id==='cafelab');
  const r={id:'rc'+Date.now(),name,ingredients:'',prep:'',taste:'',cost:0,price:0,status:'IDEA',notes:'',created:todayStr(),archived:false};
  q.recipes.push(r); save(); checkAchievements(); openRecipeModal(r.id);
}
function recipeCats(){ const lab=S.subQuests.find(s=>s.id==='cafelab'); return [...new Set(lab.recipes.map(r=>(r.cat||'').trim()).filter(Boolean))]; }
function rcSummary(r){
  const c=+r.cost||0, p=+r.price||0;
  if(p<=0) return '판매가를 입력하면 원가율과 마진을 계산해 줘요.';
  const m=p-c; return `${c/p<=.3?'🟢 ':'🔴 '}원가율 <b>${Math.round(c/p*100)}%</b> · 마진 <b>${m.toLocaleString()}원</b> (${Math.round(m/p*100)}%)`;
}
function refreshRcSum(id){ const r=findRecipe(id), el=document.getElementById('rcSum'); if(el) el.innerHTML=rcSummary(r); }
function addRcItem(id){ const r=findRecipe(id); (r.items=r.items||[]).push({name:'',cost:0}); save(); openRecipeModal(id); }
function delRcItem(id,i){ const r=findRecipe(id); r.items.splice(i,1); if(r.items.length) r.cost=r.items.reduce((s,x)=>s+(+x.cost||0),0); save(); openRecipeModal(id); }
function setRcItem(id,i,f,v){
  const r=findRecipe(id); r.items[i][f]=v; r.cost=r.items.reduce((s,x)=>s+(+x.cost||0),0); save();
  const c=document.getElementById('rcCost'); if(c) c.value=r.cost; refreshRcSum(id);
}
let menuAll=false;
function toggleMenuAll(){ menuAll=!menuAll; openMenuBoard(); }
function editMenuInfo(){
  askText('영업 정보 (줄바꿈은 / 로 구분)',(S.menuInfo||'').replace(/\n/g,' / '),v=>{ S.menuInfo=v.split('/').map(x=>x.trim()).filter(Boolean).join('\n'); save(); openMenuBoard(); },{multi:true});
}
function openMenuBoard(){
  const lab=S.subQuests.find(s=>s.id==='cafelab');
  if(S.menuInfo==null) S.menuInfo='MON-SUN. 7AM-10PM\nWIFI password : whereami';
  const list=lab.recipes.filter(r=>!r.archived && (+r.price)>0 && (menuAll||r.status==='COMPLETE'));
  const cats=[]; list.forEach(r=>{ const c=(r.cat||'음료').trim(); if(!cats.includes(c)) cats.push(c); });
  const body = cats.map(c=>`<div class="mb-cat">${esc(c)}</div><div class="mb-box">${list.filter(r=>(r.cat||'음료').trim()===c).map(r=>`<div class="mb-item"><div><div class="mb-n">${esc(r.name)}</div>${r.menuDesc?`<div class="mb-d">${esc(r.menuDesc)}</div>`:''}</div><div class="mb-p">${(r.price/1000).toFixed(1)}</div></div>`).join('')}</div>`).join('')
    || `<div class="mb-box"><div class="mb-empty">${menuAll?'판매가를 입력한 레시피가 아직 없어요.':'상태가 COMPLETE이고 판매가가 있는 레시피가 여기에 나타나요.<br>아래 버튼으로 준비 중인 메뉴도 미리 볼 수 있어요.'}</div></div>`;
  const box=document.getElementById('modalBox'); box.classList.add('menu-mode');
  box.innerHTML=`<button class="modal-close" onclick="closeModal()">✕</button>
    <div class="mb-head"><div class="mb-404">404</div><div class="mb-title">Drink Bar</div></div>
    ${body}
    <div class="mb-cat">information</div><div class="mb-box mb-info">${esc(S.menuInfo).replace(/\n/g,'<br>')}</div>
    <div class="inline" style="margin-top:14px"><button class="mb-btn" onclick="toggleMenuAll()">${menuAll?'완성 메뉴만 보기':'준비 중인 메뉴도 보기'}</button><button class="mb-btn" onclick="editMenuInfo()">정보 수정</button></div>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function findRecipe(id){ return S.subQuests.find(s=>s.id==='cafelab').recipes.find(r=>r.id===id); }
function saveRecipeField(id,field,val){ const r=findRecipe(id); r[field]=val; save(); }
function deleteRecipe(id){ const q=S.subQuests.find(s=>s.id==='cafelab'); q.recipes=q.recipes.filter(r=>r.id!==id); save(); closeModal(); }
function toggleArchiveRecipe(id){ const r=findRecipe(id); r.archived=!r.archived; save(); openRecipeModal(id); }
function openRecipeModal(id){
  const r=findRecipe(id); if(!r) return;
  document.getElementById('modalBox').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>${esc(r.name)}</h2><div class="mdesc">작성일 ${r.created}${r.archived?' · 보관됨':''}</div>
    <label>재료 및 분량</label><textarea rows="3" placeholder="예: 우유 200ml, 에스프레소 2샷" onchange="saveRecipeField('${id}','ingredients',this.value)">${esc(r.ingredients)}</textarea>
    <label>제조 방법</label><textarea rows="3" onchange="saveRecipeField('${id}','prep',this.value)">${esc(r.prep)}</textarea>
    <label>맛 노트</label><input value="${esc(r.taste)}" onchange="saveRecipeField('${id}','taste',this.value)">
    <div class="modal-sec-h">메뉴판 표기</div>
    <label>카테고리 (예: 커피 coffee)</label><input list="catList" value="${esc(r.cat||'')}" placeholder="음료" onchange="saveRecipeField('${id}','cat',this.value)"><datalist id="catList">${recipeCats().map(c=>`<option value="${esc(c)}">`).join('')}</datalist>
    <label>메뉴 설명 (작은 글씨)</label><input value="${esc(r.menuDesc||'')}" placeholder="예: cold brew coffee+fresh milk" onchange="saveRecipeField('${id}','menuDesc',this.value)">
    <div class="modal-sec-h">재료별 원가 계산</div>
    ${(r.items||[]).map((it,i)=>`<div class="inline" style="margin-bottom:6px"><input style="flex:2;margin:0" placeholder="재료" value="${esc(it.name)}" onchange="setRcItem('${id}',${i},'name',this.value)"><input style="flex:1;margin:0" type="number" inputmode="numeric" placeholder="원" value="${it.cost||''}" onchange="setRcItem('${id}',${i},'cost',+this.value)"><button class="mini-x" onclick="delRcItem('${id}',${i})">✕</button></div>`).join('')}
    <button class="ghost-btn" onclick="addRcItem('${id}')">+ 재료 추가</button> <button class="ghost-btn" onclick="addFromPantry('${id}')">🧺 창고에서 추가</button>
    <div class="inline" style="margin-top:8px"><div style="flex:1"><label>원가(원)${(r.items||[]).length?' · 자동 합계':''}</label><input id="rcCost" type="number" inputmode="numeric" value="${r.cost}" ${(r.items||[]).length?'readonly':''} onchange="saveRecipeField('${id}','cost',+this.value);refreshRcSum('${id}')"></div>
    <div style="flex:1"><label>판매가(원)</label><input type="number" inputmode="numeric" value="${r.price}" onchange="saveRecipeField('${id}','price',+this.value);refreshRcSum('${id}')"></div></div>
    <div class="rc-sum" id="rcSum">${rcSummary(r)}</div>
    <label>상태</label><select onchange="saveRecipeField('${id}','status',this.value);openRecipeModal('${id}')">
      ${['IDEA','TESTING','REVISION','COMPLETE'].map(s=>`<option value="${s}" ${r.status===s?'selected':''}>${s}</option>`).join('')}</select>
    <label>메모</label><textarea rows="2" onchange="saveRecipeField('${id}','notes',this.value)">${esc(r.notes)}</textarea>${rcExtraHTML(r)}
    <div class="inline" style="margin-top:6px">
      <button class="ghost-btn" onclick="toggleArchiveRecipe('${id}')">${r.archived?'보관 해제':'보관하기'}</button>
      <button class="mini-x" onclick="deleteRecipe('${id}')">삭제</button>
    </div>`;
  document.getElementById('modalOverlay').classList.add('show');
}


function buyReward(id){ const r=S.rewards.find(x=>x.id===id); if((S.gold||0)<r.price){ toast('골드가 부족해요'); return; } askOk(r.name+' 을(를) '+r.price+'골드에 구매할까요?',()=>{ S.gold-=r.price; if(r.repeatable) S.rewards.push({id:'r'+Date.now(),name:r.name,price:r.price,owned:true,redeemed:false,repeatable:false}); else r.owned=true; save(); renderTreasure(); renderHome(); try{ lwFaceTemp('give',60000); }catch(e){ LQ.err(e); } toast('보물 획득!'); }); }
function redeem(id){ const r=S.rewards.find(x=>x.id===id); askOk(r.name+' 을(를) 사용할까요?'+(r.repeatable?'':' (되돌릴 수 없어요)'),()=>{ if(r.repeatable) r.uses=(r.uses||0)+1; else r.redeemed=true; save(); checkAchievements(); renderTreasure(); toast('TREASURE USED'); }); }
/* ===== 마티의 보상 추천·안내 ===== */
const MARTY_IDEAS=[['🍓 제철 과일 한 접시',20,1],['🧃 편의점 신상 간식',15,1],['📷 인생네컷 찍기',25,1],['🍪 쿠키 구워 먹기',25,1],['🧦 예쁜 양말 한 켤레',30,1],['🪴 작은 화분 하나',40],
 ['🧸 귀여운 키링·인형',50],['🍜 좋아하는 면 요리 맛집',60,1],['🛁 입욕제·핸드크림',60],['📓 새 다이어리·노트',70],['🎬 심야 영화 + 팝콘',80],['🧵 뜨개·자수 키트',90],['🥐 브런치 카페 데이',100],['🎨 원데이 클래스',150],
 ['💇 새 헤어스타일',300],['🛏️ 침구 세트 교체',350],['🖱️ 갖고 싶던 기기 액세서리',400],['🎫 좋아하는 아티스트 콘서트',500],['🏕️ 근교 캠핑·글램핑',700]];
const MG_DAILY=7; // 하루에 모이는 기본 골드 (클리어 5 + 마무리 2)
let MG={};
function mgPicks(){ const have=new Set(S.rewards.map(r=>r.name)), pool=MARTY_IDEAS.filter(i=>!have.has(i[0])), pick=[], used=new Set();
  const rnd=a=>a[Math.floor(Math.random()*a.length)], add=x=>{ pick.push(x); used.add(x[0]); };
  [i=>i[1]<=40,i=>i[1]>40&&i[1]<=150,i=>i[1]>150].forEach(f=>{ const c=pool.filter(f); if(c.length) add(rnd(c)); });
  while(pick.length<3){ const c=pool.filter(i=>!used.has(i[0])); if(!c.length) break; add(rnd(c)); }
  return pick; }
function mgDays(price){ const g=S.gold||0; if(price<=0) return '…바로 쓸 수 있다냥.'; if(price<=g) return '…지금 골드로 바로 살 수 있다냥.'; return '…하루 약 '+MG_DAILY+'골드씩 모이니까 약 '+Math.ceil((price-g)/MG_DAILY)+'일이면 된다냥.'; }
function mgCat(magic){ const src=(window.WL_IMG1&&window.WL_IMG1.magic)?window.WL_IMG1.magic:'';
  return magic&&src?`<img class="mg-img mg-magic" src="${src}" alt="마법냥이">`:`<span class="mg-img mg-black" title="평소의 시나">🐈‍⬛</span>`; }
/* 마법냥이의 추천 대사: 하루 한 번 랜덤으로 정해서 그날은 '다른 추천'을 눌러도 바뀌지 않아요 */
function mgSayToday(){ const d=todayStr(); if(!S.mgSay||S.mgSay.d!==d||!S.mgSay.t){ S.mgSay={d,t:LQD.pick('magic.guide.pick',[`…마법냥이 모드다냥. ✨\n보상 후보를 뽑아 왔다.\n지금 모은 골드는 ◈{g}.`],{cameo:false,vars:{g:'{g}'}})}; save(); } return String(S.mgSay.t).split('{g}').join(S.gold||0); }
function mgRender(){ const o=document.getElementById('askOv'); let say='', body='', foot='', magic=false;
  if(MG.step==='pick'){
    magic=true;
    say=MG.picks.length?mgSayToday():`…준비한 추천은 전부 담았다냥. 👏\n이제 직접 만들어라.`;
    body=MG.picks.map((it,i)=>`<button class="mg-opt" onclick="mgChoose(${i})"><b>${esc(it[0])}</b><span>${it[1]<=40?'가볍게':it[1]<=150?'적당히':'크게'} · ◈${it[1]}${it[1]<=(S.gold||0)?' · 지금 가능':''}</span></button>`).join('');
    foot=(MG.picks.length?`<button class="ghost-btn" onclick="mgReroll()">🔄 다른 추천</button>`:'')+`<button class="ghost-btn" onclick="mgCustom()">✏️ 직접 만들래요</button><button class="ghost-btn" onclick="mgClose()">닫기</button>`;
  } else if(MG.step==='name'){
    say=LQD.pick('magic.guide.name',[`…직접 만들겠다고냥.\n어떤 보상을 주고 싶은데.\n이모지 하나 붙이면 더 낫다. (예: 🧸 인형 뽑기)`],{cameo:false});
    body=`<input id="mgName" placeholder="보상 이름" maxlength="40" value="${esc(MG.name||'')}" onkeydown="if(event.key==='Enter')mgNext()">`;
    foot=`<button class="ghost-btn" onclick="mgBack()">뒤로</button><button class="gold-btn" onclick="mgNext()">다음</button>`;
  } else {
    say=`'${esc(MG.name)}'…나쁘지 않다냥. 가격은?\n가벼운 즐거움 10~40 · 적당한 보상 50~150 · 큰 선물 200+ 정도다.\n<span id="mgHintT">${mgDays(MG.price)}</span>`;
    body=`<input id="mgPrice" type="number" inputmode="numeric" min="0" value="${MG.price}" oninput="mgHint()" onkeydown="if(event.key==='Enter')mgAdd()">`;
    foot=`<button class="ghost-btn" onclick="mgBack()">뒤로</button><button class="gold-btn" onclick="mgAdd()">추가하기</button>`;
  }
  o.innerHTML=`<div class="ask-box mg-box"><div class="mg-row">${mgCat(magic)}<div class="speech-bubble">${lqNya(say)}</div></div>${body}<div class="mg-foot">${foot}</div></div>`;
  o.classList.add('show'); if(MG.step==='name') setTimeout(()=>{ const i=document.getElementById('mgName'); if(i) i.focus(); },60); }
function martyRewardGuide(){ MG={step:'pick',picks:mgPicks()}; mgRender(); }
function mgClose(){ const o=document.getElementById('askOv'); o.classList.remove('show'); o.innerHTML=''; }
function mgChoose(i){ const it=MG.picks[i]; MG.name=it[0]; MG.price=it[1]; MG.rep=!!it[2]; MG.from='pick'; MG.step='price'; mgRender(); }
function mgReroll(){ MG.picks=mgPicks(); mgRender(); }
function mgCustom(){ MG.step='name'; MG.name=''; MG.rep=false; mgRender(); }
function mgBack(){ MG.step=(MG.step==='price'&&MG.from==='custom')?'name':'pick'; mgRender(); }
function mgNext(){ const v=document.getElementById('mgName').value.trim(); if(!v){ toast('마법냥이: …이름이 필요하다냥.'); return; } MG.name=v; MG.price=50; MG.from='custom'; MG.step='price'; mgRender(); }
function mgHint(){ const v=parseInt(document.getElementById('mgPrice').value,10); document.getElementById('mgHintT').textContent=mgDays(isNaN(v)?0:v); }
function mgAdd(){ const pv=parseInt(document.getElementById('mgPrice').value,10), price=(isNaN(pv)||pv<0)?0:pv;
  const r={id:'r'+Date.now(),name:MG.name,redeemed:false,price,owned:price<=0}; if(MG.rep) r.repeatable=true;
  S.rewards.push(r); save(); mgClose(); renderTreasure(); toast('마법냥이: …등록했다냥. ✨'); }
function addReward(){ martyRewardGuide(); }


function updateBackupInfo(){
  const el=document.getElementById('backupInfo'); if(!el) return;
  const t=S.lastBackup;
  el.textContent = t ? `마지막 백업: ${new Date(t).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}` : '아직 백업한 적이 없어요. 기록이 사라지지 않게 가끔 백업해 두세요.'; updateUndoBtn();
}
function exportBackup(){
  S.lastBackup=Date.now(); save();
  const code = 'LQ1:' + btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  const ta=document.getElementById('backupText'); ta.value=code;
  ta.focus(); ta.select();
  updateBackupInfo(); toast('BACKUP READY');
}
function copyBackup(){
  const ta=document.getElementById('backupText');
  if(!ta.value){ exportBackup(); }
  ta.focus(); ta.select(); try{ ta.setSelectionRange(0,ta.value.length); }catch(e){ LQ.err(e); }
  let ok=false;
  try{ ok=document.execCommand('copy'); }catch(e){ LQ.err(e); }
  if(!ok && navigator.clipboard){ navigator.clipboard.writeText(ta.value).then(()=>toast('COPIED')).catch(()=>toast('길게 눌러 복사하세요')); return; }
  toast(ok?'COPIED':'길게 눌러 복사하세요');
}
const PREV_KEY=KEY+'_prev';
function stashPrevData(){ try{ localStorage.setItem(PREV_KEY, JSON.stringify({t:Date.now(), d:S})); }catch(e){ LQ.err(e); } }
function getPrevData(){ try{ const p=JSON.parse(localStorage.getItem(PREV_KEY)); return (p&&p.d&&Array.isArray(p.d.dailyQuests)&&p.d.settings&&p.d.history)?p:null; }catch(e){ return null; } }
function updateUndoBtn(){ const btn=document.getElementById('undoRestoreBtn'); if(!btn) return; const p=getPrevData(); btn.style.display=p?'':'none';
  if(p) btn.textContent='↩ 복원 전 기록으로 되돌리기 ('+new Date(p.t).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit'})+' 기준)'; }
function applyRestore(data){
  const dd=defaultData(); ['mainQuests','subQuests','achievements','rewards'].forEach(k=>{ if(!Array.isArray(data[k])) data[k]=dd[k]; });
  S=data; _snap=null; _say=null; calOffset=0; ensureAchievements(); ensureMisc(); lastDay=todayStr(); computeToday(); save(); renderHome(); renderCalendar(); renderQuests(); renderAchievements(); renderTreasure(); renderMaster();
  applyBg(); applyVol(); renderSoundUI();
  if(bgmOn()){ if(bgmTimer){ const nt=bgmDayTrack(); if(nt!==bgmTrack){ bgmTrack=nt; bgmStep=0; } } else startBgm(); } else stopBgm();
}
function restoreData(data){
  if(!data||!Array.isArray(data.dailyQuests) || !data.settings || !data.history) throw new Error('bad');
  askOk('현재 기록이 백업 내용으로 덮어써져요. 복원할까요? (직전 기록은 "복원 전 기록으로 되돌리기"로 되살릴 수 있어요)',()=>{
    stashPrevData(); applyRestore(data); updateUndoBtn();
    toast('복원했어요. 실수라면 "되돌리기"를 눌러요'); });
}
function undoRestore(){
  const p=getPrevData(); if(!p){ toast('되돌릴 기록이 없어요'); updateUndoBtn(); return; }
  askOk('복원하기 전의 기록으로 되돌릴까요? (지금 기록은 다시 "되돌리기"로 되살릴 수 있어요)',()=>{
    stashPrevData(); applyRestore(p.d); updateUndoBtn(); toast('복원 전 기록으로 되돌렸어요'); });
}
function importBackup(){
  const raw=document.getElementById('backupText').value.trim();
  if(!raw.startsWith('LQ1:')){ toast('올바른 백업 코드가 아니에요.'); return; }
  try{ restoreData(JSON.parse(decodeURIComponent(escape(atob(raw.slice(4)))))); }
  catch(e){ toast('백업 코드를 읽을 수 없어요. 코드를 통째로 붙여넣었는지 확인해 주세요.'); }
}
function saveBackupViaLink(json,fname,done){
  try{
    const blob=new Blob([json],{type:'application/json'}), url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download=fname; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);
    done();
  }catch(e){ toast('파일 저장이 안 돼요. 백업 코드를 이용해 주세요'); }
}
function downloadBackup(){
  const now=Date.now(), prevLB=S.lastBackup;
  const stamp=kstNow().toISOString().slice(0,10).replace(/-/g,''), fname='life-quest-backup-'+stamp+'.json';
  S.lastBackup=now; const json=JSON.stringify(S); S.lastBackup=prevLB;
  const done=()=>{ S.lastBackup=now; save(); updateBackupInfo(); toast('백업 파일을 저장했어요'); };
  try{
    if(navigator.share&&navigator.canShare&&typeof File==='function'){
      const f=new File([json],fname,{type:'application/json'});
      if(navigator.canShare({files:[f]})){
        navigator.share({files:[f],title:'LIFE QUEST 백업'}).then(done).catch(e=>{ if(!e||e.name!=='AbortError') saveBackupViaLink(json,fname,done); });
        return;
      }
    }
  }catch(e){ LQ.err(e); }
  saveBackupViaLink(json,fname,done);
}
function importBackupFile(inp){
  const f=inp.files&&inp.files[0]; if(!f) return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{ const txt=String(rd.result).trim(); restoreData(txt.startsWith('LQ1:')?JSON.parse(decodeURIComponent(escape(atob(txt.slice(4))))):JSON.parse(txt)); }
    catch(e){ toast('백업 파일을 읽을 수 없어요.'); }
    inp.value='';
  };
  rd.onerror=()=>{ toast('파일을 읽을 수 없어요.'); inp.value=''; };
  rd.readAsText(f);
}
function sfxOn(){ return S.settings.sfx!==false; }
function bgmOn(){ return S.settings.bgm!==false; }
let actx=null, master=null, sfxOut=null, sfxGain=null, bgmGain=null, bgmTimer=null, bgmStep=0, bgmNext=0;
const mf=m=>440*Math.pow(2,(m-69)/12);
function initAudio(){
  if(actx){ if(actx.state==='suspended') actx.resume(); return true; }
  try{
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
    try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){ LQ.err(e); }
    actx=new AC(); master=actx.createGain(); sfxGain=actx.createGain(); bgmGain=actx.createGain();
    sfxOut=actx.createGain(); sfxGain.connect(sfxOut); sfxOut.connect(actx.destination); bgmGain.connect(master); master.connect(actx.destination);
    const n=Math.floor(actx.sampleRate*2.4), buf=actx.createBuffer(2,n,actx.sampleRate);
    for(let c=0;c<2;c++){ const d=buf.getChannelData(c); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6); }
    const cv=actx.createConvolver(); cv.buffer=buf; const rg=actx.createGain(); rg.gain.value=.4; bgmGain.connect(cv); cv.connect(rg); rg.connect(master);
    applyVol(); actx.resume(); return true;
  }catch(e){ return false; }
}
function applyVol(){ if(!master) return; const v=(S.settings.vol==null?60:S.settings.vol)/100; master.gain.value=v*v; bgmGain.gain.value=.8; sfxGain.gain.value=1; if(sfxOut){ const sv=(S.settings.sfxVol==null?(S.settings.vol==null?60:S.settings.vol):S.settings.sfxVol)/100; sfxOut.gain.value=sv*sv*.5*(window._roomOn?.1:1); } }
function tone(f,t,d,type,vol,dest,slide,att){
  const o=actx.createOscillator(), g=actx.createGain(); o.type=type; o.frequency.setValueAtTime(f,t);
  if(slide) o.frequency.exponentialRampToValueAtTime(slide,t+d);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+(att||0.01)); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t+d+0.05);
}
function bell(f,t,d,vol,dest){ tone(f,t,d,'sine',vol,dest); tone(f*2.005,t,d*.6,'sine',vol*.35,dest); tone(f*4.01,t,d*.25,'sine',vol*.15,dest); }
function sfx(kind){
  if(!sfxOn() || !initAudio()) return;
  const t=actx.currentTime+0.01, d=sfxGain;
  if(kind==='check'){ bell(mf(88),t,.4,.12,d); bell(mf(95),t+.1,.6,.12,d); }
  else if(kind==='uncheck'){ bell(mf(88),t,.3,.08,d); bell(mf(81),t+.09,.4,.07,d); }
  else if(kind==='tick'){ bell(mf(91),t,.25,.06,d); bell(mf(98),t+.07,.4,.06,d); }
  else if(kind==='clear'){ [76,79,83,88,91,95].forEach((m,i)=>bell(mf(m),t+i*.1,.9,.1,d)); tone(mf(64),t,1.4,'triangle',.1,d,0,.05); }
  else if(kind==='ach'){ [84,88,91,96].forEach((m,i)=>bell(mf(m),t+i*.11,.9,.11,d)); }
}
var bgmTrack=null, _BT=null;
const BGM_CH=[{b:40,a:[55,59,64,67]},{b:36,a:[55,60,64,67]},{b:43,a:[55,59,62,67]},{b:38,a:[54,57,62,66]},{b:40,a:[55,59,64,67]},{b:36,a:[55,60,64,67]},{b:45,a:[57,60,64,69]},{b:47,a:[54,57,59,63]}];
const BGM_A=[[83,0,88,0,86,83],[84,0,88,0,84,79],[83,0,86,0,83,79],[81,0,86,0,90,86],[83,0,88,0,91,88],[88,0,84,0,91,88],[88,0,84,0,81,84],[83,0,78,0,83,0]];
const BGM_B=[[91,0,88,0,83,0],[88,0,91,0,96,0],[95,0,91,0,86,0],[90,0,93,0,90,86],[88,0,83,0,88,0],[84,0,88,0,91,0],[93,0,91,0,88,84],[95,0,90,0,83,0]];
function bgmVar(T,seed){
  let x=seed>>>0; const r=()=>(x=(x*1664525+1013904223)>>>0)/4294967296;
  const all=[]; let nz=0;
  [T.A,T.B].forEach(S8=>S8.forEach(row=>row.forEach((v,k)=>{ if(v) all.push(v); if(v&&k%2===0) nz++; })));
  const pcs=new Set(all.map(v=>v%12)), lo=Math.min(...all), hi=Math.max(...all), pool=[];
  for(let n=lo;n<=hi;n++) if(pcs.has(n%12)) pool.push(n);
  const dens=Math.min(.85,Math.max(.4,nz/48)); let p=Math.floor(pool.length/2); const bars=[];
  for(let b=0;b<16;b++){ const c=T.ch[b%8], row=[];
    for(let k=0;k<6;k++){ let v=0;
      if((k%2===0&&r()<dens)||(k===5&&r()<dens*.5)){ p=Math.max(0,Math.min(pool.length-1,p+Math.floor(r()*5)-2)); v=pool[p];
        if(k===0){ const ct=pool.filter(q=>c.a.some(a=>(q-a)%12===0)); if(ct.length){ v=ct.reduce((m,q)=>Math.abs(q-v)<Math.abs(m-v)?q:m); p=pool.indexOf(v); } } }
      row.push(v); }
    bars.push(row); }
  return {A:bars.slice(0,8),B:bars.slice(8)};
}
function bgmTr(){ if(_BT) return _BT;
  const mk=(n,bpm,ch,sc,base,seed,dens,o)=>{ let x=seed>>>0; const r=()=>(x=(x*1664525+1013904223)>>>0)/4294967296, pool=[]; for(let o=0;o<2;o++) sc.forEach(i=>pool.push(base+o*12+i));
    let p=Math.floor(pool.length/2); const bars=[];
    for(let b=0;b<16;b++){ const c=ch[b%8], row=[]; for(let k=0;k<6;k++){ let v=0;
      if((k%2===0&&r()<dens)||(k===5&&r()<dens*.5)){ p=Math.max(0,Math.min(pool.length-1,p+Math.floor(r()*5)-2)); v=pool[p];
        if(k===0){ const ct=pool.filter(q=>c.a.some(a=>(q-a)%12===0)); if(ct.length){ v=ct.reduce((m,q)=>Math.abs(q-v)<Math.abs(m-v)?q:m); p=pool.indexOf(v); } } }
      row.push(v); } bars.push(row); }
    return Object.assign({n,bpm,ch,A:bars.slice(0,8),B:bars.slice(8)},o||{}); };
  _BT=[{n:'서재의 오후',bpm:90,ch:BGM_CH,A:BGM_A,B:BGM_B},
    mk('입학식의 종소리',84,[{b:48,a:[60,64,67,71]},{b:50,a:[62,66,69,74]},{b:52,a:[59,64,67,71]},{b:48,a:[60,64,67,71]},{b:45,a:[57,60,64,69]},{b:50,a:[62,66,69,74]},{b:43,a:[59,62,67,71]},{b:48,a:[60,64,67,71]}],[0,2,4,6,7,9,11],72,11,.8,{sp:1}),
    mk('금서 구역의 밤',62,[{b:45,a:[57,60,64,69]},{b:40,a:[56,59,64,68]},{b:41,a:[57,60,65,69]},{b:40,a:[56,59,64,68]},{b:45,a:[57,60,64,69]},{b:38,a:[57,62,65,69]},{b:40,a:[56,59,64,68]},{b:45,a:[57,60,64,69]}],[0,2,3,5,7,8,11],69,29,.55,{sp:1,w:'sine'}),
    mk('빗자루 비행 수업',108,[{b:40,a:[59,64,67,71]},{b:48,a:[60,64,67,72]},{b:43,a:[59,62,67,71]},{b:50,a:[62,66,69,74]},{b:40,a:[59,64,67,71]},{b:45,a:[60,64,69,72]},{b:47,a:[59,63,66,71]},{b:40,a:[59,64,67,71]}],[0,2,3,5,7,9,10],76,47,.85,{sp:1})];
  _BT.forEach((T,i)=>{ T.P=[{A:T.A,B:T.B},bgmVar(T,1013+i*97),bgmVar(T,2027+i*97),bgmVar(T,3041+i*97)]; });
  return _BT; }
function bgmPlay(step,t){
  const T=bgmTr()[bgmTrack||0], PP=T.P||[{A:T.A,B:T.B}], bar=Math.floor(step/6)%(16*PP.length), k=step%6, c=T.ch[bar%8], d=bgmGain, P=PP[Math.floor(bar/16)], bb=bar%16, m=(bb<8?P.A:P.B)[bb%8][k];
  if(k===0){ tone(mf(c.b),t,1.7,'sine',.13,d); [c.a[0],c.a[2],c.a[3]].forEach(n=>tone(mf(n),t,2.2,'triangle',.028,d,0,.7)); }
  tone(mf(c.a[[0,1,2,3,2,1][k]]),t,.9,T.w||'triangle',.045,d);
  if(m) bell(mf(m),t,1.3,.06,d);
  if(bar%4===3&&k===3) bell(mf(c.a[3]+36),t,1.6,.03,d);
  if(T.sp&&k===4&&bar%2===1) bell(mf(c.a[(bar>>1)%4]+36),t,1.8,.026,d);
}
function bgmDayTrack(){
  const d=todayStr(), n=bgmTr().length, B=S.settings.bgmDay; if(B&&B.d===d&&B.t<n) return B.t;
  let t=Math.floor(Math.random()*n); if(B&&n>1&&t===B.t) t=(B.t+1+Math.floor(Math.random()*(n-1)))%n;
  S.settings.bgmDay={d,t}; save(); return t;
}
function bgmSched(){ while(bgmNext<actx.currentTime+.6){ const T=bgmTr()[bgmTrack||0]; bgmPlay(bgmStep,bgmNext); bgmNext+=60/T.bpm/2; bgmStep=(bgmStep+1)%(96*(T.P?T.P.length:1));
    if(bgmStep===0) bgmTrack=bgmDayTrack(); } }
function startBgm(){
  if(bgmTimer||window._sleepOn||window._roomOn||!initAudio()) return;
  bgmGain.gain.cancelScheduledValues(actx.currentTime); bgmGain.gain.setTargetAtTime(.8,actx.currentTime,.05);
  { const nt=bgmDayTrack(); if(nt!==bgmTrack){ bgmTrack=nt; bgmStep=0; } }
  bgmNext=actx.currentTime+.1; bgmTimer=setInterval(bgmSched,250);
}
function stopBgm(){
  if(bgmTimer){ clearInterval(bgmTimer); bgmTimer=null; }
  if(actx&&bgmGain){ bgmGain.gain.cancelScheduledValues(actx.currentTime); bgmGain.gain.setTargetAtTime(0,actx.currentTime,.15); }
}
function toggleSfx(){ S.settings.sfx=!sfxOn(); save(); if(sfxOn()){ initAudio(); sfx('check'); } renderSoundUI(); }
function toggleBgm(){ S.settings.bgm=!bgmOn(); save(); if(bgmOn()){ initAudio(); startBgm(); } else stopBgm(); renderSoundUI(); }
function setVol(v){ if(S.settings.sfxVol==null) S.settings.sfxVol=(S.settings.vol==null?60:S.settings.vol); S.settings.vol=+v; applyVol(); save(); }
function setSfxVol(v){ S.settings.sfxVol=+v; applyVol(); save(); }
function renderSoundUI(){
  const on=(id,label,v)=>{ const b=document.getElementById(id); if(b){ b.textContent=label+' '+(v?'켜짐':'꺼짐'); b.style.background=v?'rgba(209,168,86,.22)':'transparent'; } };
  on('sfxBtn','효과음',!!sfxOn()); on('bgmBtn','배경음악',!!bgmOn());
  const r=document.getElementById('volRange'); if(r) r.value=S.settings.vol==null?60:S.settings.vol;
  const sr=document.getElementById('sfxVolRange'); if(sr) sr.value=S.settings.sfxVol==null?(S.settings.vol==null?60:S.settings.vol):S.settings.sfxVol;
  const m=document.getElementById('musicBtn'); if(m) m.classList.toggle('on',!!bgmOn());
}
function unlockAudio(){ if(!(sfxOn()||bgmOn())) return; initAudio();
  if(actx&&master&&!document.hidden&&master.gain.value<.001){ applyVol(); if(bgmGain&&bgmTimer) bgmGain.gain.setTargetAtTime(.8,actx.currentTime,.05); }
  if(bgmOn()) startBgm(); }
['pointerdown','touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,unlockAudio,{passive:true}));
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('button,select')) sfx('tick'); });
/* 앱을 내리거나 끌 때 '띡' 소리가 나던 원인: 소리가 나는 도중에 오디오를 그대로 멈추거나, 열려 있는 오디오 장치를 iOS가 강제로 닫아서 파형이 뚝 끊겼어요.
   그래서 (1) 앱이 내려가려는 순간 볼륨을 0.05초 동안 0으로 내리고, (2) 오디오 장치를 아예 닫아서 iOS의 소리 세션을 풀어 줘요.
   앱으로 돌아오면 장치를 다시 열고 음악을 이어서 틀어요. */
function audioHush(){ if(!actx) return; const t=actx.currentTime;
  [master,sfxOut,bgmGain].forEach(g=>{ if(g){ try{ g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value,t); g.gain.linearRampToValueAtTime(0,t+.04); }catch(e){ LQ.err(e); } } }); }
function audioRelease(){ const c=actx; if(!c) return;
  if(bgmTimer){ clearInterval(bgmTimer); bgmTimer=null; }
  actx=null; master=null; sfxOut=null; sfxGain=null; bgmGain=null;
  try{ c.close(); }catch(e){ LQ.err(e); }
  try{ if(navigator.audioSession) navigator.audioSession.type='auto'; }catch(e){ LQ.err(e); } }
function audioGoingAway(){ if(!actx||window._sleepOn) return;
  if(bgmTimer){ clearInterval(bgmTimer); bgmTimer=null; }
  audioHush(); setTimeout(()=>{ if(document.hidden||_awayFlag) audioRelease(); },70); }
let _awayFlag=false;
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){ _awayFlag=true; audioGoingAway(); }
  else { _awayFlag=false; if(bgmOn()||sfxOn()){ initAudio(); applyVol(); if(bgmOn()) startBgm(); } }
});
window.addEventListener('pagehide',()=>{ _awayFlag=true; audioGoingAway(); });
window.addEventListener('pageshow',()=>{ _awayFlag=false; });
/* 앱 전환 화면(위로 살짝 올렸을 때)에서는 페이지가 아직 '보이는 상태'일 수 있어서, 앱이 비활성이 되는 순간에도 볼륨을 내려요 */
window.addEventListener('blur',()=>{ if(actx&&!window._sleepOn) audioHush(); });
window.addEventListener('focus',()=>{ if(!document.hidden&&actx){ applyVol(); if(bgmGain) bgmGain.gain.setTargetAtTime(.8,actx.currentTime,.05); } });

const stampQ=[]; let stampBusy=false, stampTimer=null;
function celebrate(kind,sub){ stampQ.push({kind,sub}); if(!stampBusy) nextStamp(); }
function skipStamp(){ clearTimeout(stampTimer); nextStamp(); }
function nextStamp(){
  const el=document.getElementById('stamp'), s=stampQ.shift();
  if(!s){ stampBusy=false; el.classList.remove('show'); return; }
  stampBusy=true; const c=s.kind==='clear';
  el.innerHTML=`<div class="stampwrap"><div class="ring">${mascotImg(60,'clear')}<div class="big ${c?'':'kr'}">${c?'QUEST CLEAR':(s.kind==='event'?'이벤트 클리어':'업적 해금')}</div><div class="sub">${esc(s.sub)}</div></div>
    <span class="sp" style="left:-6%;top:8%">✦</span><span class="sp" style="right:-4%;top:18%;animation-delay:.3s">✦</span><span class="sp" style="left:6%;bottom:2%;animation-delay:.6s">✦</span><span class="sp" style="right:8%;bottom:-2%;animation-delay:.15s">✦</span></div>`;
  el.classList.add('show'); sfx(c?'clear':'ach');
  stampTimer=setTimeout(nextStamp,2000);
}

function debtSim(q){
  const pay=(+q.monthly||0)+(+q.extra||0); let bal=q.current;
  if(bal<=0) return 'DEBT ZERO 달성! ✦';
  if(pay<=0) return '월 상환액을 입력하면 예상 완납 시기를 계산해 줘요.';
  const r=(+q.rate||0)/1200; let n=0; while(bal>0&&n<600){ bal=bal*(1+r)-pay; n++; }
  if(n>=600) return '이 상환액으로는 이자를 감당하기 어려워요. 상환액을 조금 늘려 보세요.';
  const d=kstNow(); d.setUTCMonth(d.getUTCMonth()+n);
  return `이 속도면 <b>${n}개월 후</b> (${d.getUTCFullYear()}년 ${d.getUTCMonth()+1}월) <b>DEBT ZERO</b> 예상`;
}
function debtSimHTML(q){
  const f=(k,l,ph)=>`<div style="flex:1"><label>${l}</label><input type="number" inputmode="decimal" placeholder="${ph}" value="${q[k]||''}" onchange="setDebt('${k}',+this.value)"></div>`;
  return `<div class="modal-sec-h">상환 시뮬레이션</div><div class="inline">${f('monthly','월 상환액(원)','예: 300000')}${f('extra','추가 상환(원)','0')}${f('rate','연 이자율(%)','0')}</div><div class="rc-sum" id="debtSim">${debtSim(q)}</div>`;
}
function setDebt(k,v){ const q=S.mainQuests.find(m=>m.id==='debt'); q[k]=v; save(); document.getElementById('debtSim').innerHTML=debtSim(q); }
function bodyLogHTML(){
  const L=(S.bodyLog=S.bodyLog||[]).slice().sort((a,b)=>a.date<b.date?-1:1);
  const tr=(k,n,u)=>{ const a=L.filter(e=>e[k]>0); if(!a.length) return ''; const last=a[a.length-1][k]; if(a.length<2) return `${n} ${last}${u} (기록 1회)`; const d=last-a[0][k]; return `${n} ${last}${u} · 첫 기록 대비 ${d>0?'+':''}${d.toFixed(1)}${u} (기록 ${a.length}회)`; };
  const sp=k=>{ const a=L.filter(e=>e[k]>0).slice(-12); if(a.length<2) return ''; const v=a.map(e=>e[k]), mn=Math.min(...v), r=(Math.max(...v)-mn)||1;
    return `<svg viewBox="0 0 200 40" width="100%" height="40"><polyline points="${v.map((x,i)=>`${(i/(v.length-1)*200).toFixed(1)},${(36-(x-mn)/r*32).toFixed(1)}`).join(' ')}" fill="none" stroke="#9a7530" stroke-width="2"/></svg>`; };
  return `<div class="modal-sec-h">몸 기록 (모두 선택 입력 · 점수 없음)</div>
    <div class="rc-sum">${tr('weight','체중','kg')||'체중 기록 없음'}<br>${tr('waist','허리','cm')||'허리 기록 없음'}</div>${sp('weight')}${sp('waist')}
    <div class="inline"><input id="bwDate" type="date" value="${todayStr()}"><input id="bwW" type="number" step="0.1" inputmode="decimal" placeholder="체중 kg"><input id="bwC" type="number" step="0.1" inputmode="decimal" placeholder="허리 cm"></div>
    <input id="bwN" placeholder="운동·식단 메모 (선택)">
    <div class="inline"><button class="ghost-btn" style="flex:1;margin-bottom:8px" onclick="addBodyLog()">기록 추가</button></div>
    ${L.slice().reverse().slice(0,20).map(e=>`<div class="pl-row"><span style="display:flex;gap:8px;align-items:center"><span>${e.date} ${e.weight?e.weight+'kg ':''}${e.waist?e.waist+'cm ':''}${esc(e.note||'')}</span></span><button class="small-x" style="color:var(--burgundy)" onclick="delBodyLog('${e.id}')">✕</button></div>`).join('')}`;
}
function addBodyLog(){
  const g=id=>document.getElementById(id).value, w=parseFloat(g('bwW')), c=parseFloat(g('bwC')), note=g('bwN').trim();
  if(!(w>0)&&!(c>0)&&!note){ toast('체중, 허리, 메모 중 하나만 입력해도 돼요.'); return; }
  (S.bodyLog=S.bodyLog||[]).push({id:'b'+Date.now(),date:g('bwDate')||todayStr(),weight:w>0?w:null,waist:c>0?c:null,note});
  save(); checkAchievements(); openQuestModal('body');
}
function delBodyLog(id){ askOk('이 기록을 삭제할까요?',()=>{ S.bodyLog=S.bodyLog.filter(e=>e.id!==id); save(); openQuestModal('body'); }); }
function eventDefs(){ return {
1:['새해 첫 페이지','올해 목표 세 가지 적기','새해 첫 산책','나에게 편지 쓰기'],
2:['겨울의 끝자락','따뜻한 차 한 잔의 여유','좋아하는 책 한 권 펴기','봄맞이 방 정리'],
3:['새 학기의 마법','새로운 습관 하나 시작','책상 정리하기','이번 달 목표 적기'],
4:['벚꽃 산책','꽃길 걷기','봄 사진 한 장 남기기','봄 메뉴 상상해 보기'],
5:['초록의 달','공원 산책','가까운 사람에게 안부 전하기','초록빛 음료 마셔 보기'],
6:['장마 서재','비 오는 날 독서','창가 티타임','실내 스트레칭 10분'],
7:['한여름 밤의 모험','시원한 저녁 산책','제철 과일 먹기','물 충분히 마시기 7일'],
8:['여름의 끝자락','시원한 곳으로 나들이','여름 추억 사진 정리','다음 계절 계획 세우기'],
9:['가을 학기의 시작','아침 산책 3회','새 책 한 권 시작','가을 음악 플레이리스트 만들기'],
10:['달빛 마법의 밤','밤하늘 올려다보기','따뜻한 음료 직접 만들어 보기','분위기 있는 소품 꾸미기'],
11:['낙엽 서재','낙엽길 산책','감사 일기 3일','올해 남은 목표 점검'],
12:['연말의 종소리','올해 잘한 일 세 가지 적기','새해 계획 초안 쓰기','나에게 선물하기']}; }
function curYM(){ const t=todayStr().split('-'); return t[0]+'-'+(+t[1]); }
function ensureMisc(){
  S.mainQuests.forEach(q=>{ if(q.type==='youtube'&&q.baseVideos==null){ q.baseVideos=q.id==='ytB'?0:(q.videos||0); q.prod=q.prod||[]; } });
  S.events=S.events||[]; S.evSeed=S.evSeed||{}; S.bodyLog=S.bodyLog||[]; S.bodyLog.forEach(e=>{ if(e&&'photo' in e) delete e.photo; });
  S.sleepLog=S.sleepLog||{}; S.bodyDays=S.bodyDays||{}; S.bodyManual=S.bodyManual||{}; S.flags=S.flags||{}; S.gold=S.gold||0; S.goldDay=S.goldDay||{}; seedMore();
  const ym=curYM();
  seedEvents(); migrateRewards(); migrateSettings();
  save();
}
function evXtra(){ return {
1:['새해의 첫걸음','올해의 한 단어 정하기','겨울 햇살 아래 걷기','좋아하는 노래 다시 듣기','새 다이어리 꾸미기'],
2:['입춘 맞이','따뜻한 국물 요리하기','옛 사진 꺼내 보기','창문 열고 환기하기','영화 한 편 보기'],
3:['봄의 문턱','새 노래 하나 발견하기','화분·꽃 들여다보기','옷장 정리하기','아침 스트레칭 3회'],
4:['봄바람 소풍','좋아하는 곳에서 커피 마시기','새 길로 걸어 보기','봄노래 듣기','편지 한 통 쓰기'],
5:['푸른 오월','창가에서 햇볕 쬐기','새로운 레시피 도전','감사한 사람 떠올리기','저녁 노을 보기'],
6:['비 내리는 서재','빗소리 들으며 쉬기','따뜻한 차 우려 마시기','옛 일기 읽어 보기','좋아하는 영화 다시 보기'],
7:['한여름의 서재','시원한 음료 만들기','별 보러 나가기','여름 노래 목록 만들기','일찍 자는 밤 3회'],
8:['늦여름의 바람','노을 구경하기','냉장고 속 재료로 요리하기','사진 폴더 정리하기','좋아하는 책 다시 펴기'],
9:['가을의 문턱','선선한 저녁 산책','따뜻한 차 시작하기','가을 옷 꺼내 두기','하늘 사진 한 장 남기기'],
10:['깊어가는 가을 밤','달 보며 산책하기','새 음료 레시피 시도하기','가을 책 한 권 읽기','조명 낮추고 쉬는 밤 보내기'],
11:['늦가을 기록장','따뜻한 국물 요리하기','한 해 사진 돌아보기','두꺼운 이불 꺼내기','좋아하는 노래 3곡 고르기'],
12:['한 해의 마지막 장','올해의 책·음악 꼽기','따뜻한 저녁 차리기','소중한 사람에게 연락하기','내년 첫 주 계획 세우기']}; }
function evSpecials(){ return [
{k:'bday',md:'07-22',pre:7,name:'🎂 아멜리아의 생일 주간',items:['나에게 줄 작은 선물 고르기','좋아하는 음식 먹기','올 한 해 돌아보며 한 줄 적기'],reward:'🎂 생일 보물',gold:80},
{k:'hween',md:'10-31',pre:7,name:'🎃 할로윈 밤의 모험',items:['좋아하는 간식 하나 준비하기','밤 산책하며 달 올려다보기','촛불이나 작은 조명 켜고 쉬는 밤'],reward:'🎃 할로윈 보물',gold:60},
{k:'xmas',md:'12-25',pre:7,name:'🎄 크리스마스 이브의 모험',items:['따뜻한 음료 마시며 캐럴 듣기','소중한 사람에게 안부 전하기','겨울밤 조명 보며 산책'],reward:'🎄 크리스마스 보물',gold:60},
{k:'chuseok',lunar:{2026:'09-25',2027:'09-15',2028:'10-03',2029:'09-22',2030:'09-12'},pre:6,name:'🌕 한가위 보름달',items:['보름달 올려다보기','가족·친구에게 안부 전하기','송편이나 제철 과일 먹기'],reward:'🌕 한가위 보물',gold:60},
{k:'seol',lunar:{2027:'02-06',2028:'01-26',2029:'02-13',2030:'02-03'},pre:5,name:'🧧 설날의 첫 페이지',items:['새해 인사 전하기','따뜻한 국물 한 그릇','올해 소망 하나 적기'],reward:'🧧 설날 보물',gold:60}]; }
function evShuffle(a,seed){ let x=seed>>>0; const r=()=>(x=(x*1664525+1013904223)>>>0)/4294967296; a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function evPlan(){ return {"2026-10": ["달빛 마법의 밤", "밤하늘 올려다보기", "따뜻한 음료 직접 만들어 보기", "조명 낮추고 쉬는 밤 보내기"], "2026-11": ["낙엽 서재", "낙엽길 산책하기", "감사 일기 3일 쓰기", "올해 남은 목표 점검하기"], "2026-12": ["연말의 종소리", "올해 잘한 일 세 가지 적기", "소중한 사람에게 연락하기", "나에게 작은 선물하기"], "2027-01": ["새해 첫 페이지", "올해의 한 단어 정하기", "새해 첫 산책하기", "새 다이어리 꾸미기"], "2027-02": ["겨울의 끝자락", "따뜻한 차 한 잔의 여유", "좋아하는 책 한 권 펴기", "봄맞이 방 정리하기"], "2027-03": ["봄의 문턱", "새로운 습관 하나 시작하기", "화분·꽃 들여다보기", "옷장 정리하기"], "2027-04": ["벚꽃 산책", "꽃길 걷기", "봄 사진 한 장 남기기", "봄 메뉴 상상해 보기"], "2027-05": ["초록의 달", "공원 산책하기", "가까운 사람에게 안부 전하기", "초록빛 음료 마셔 보기"], "2027-06": ["장마 서재", "비 오는 날 독서", "창가 티타임", "빗소리 들으며 쉬기"], "2027-07": ["한여름 밤의 모험", "시원한 저녁 산책", "제철 과일 먹기", "별 보러 나가기"], "2027-08": ["여름의 끝자락", "여름 추억 사진 정리하기", "노을 구경하기", "다음 계절 계획 세우기"], "2027-09": ["가을 학기의 시작", "아침 산책 3회", "새 책 한 권 시작하기", "가을 음악 플레이리스트 만들기"], "2027-10": ["가을 서재의 초대", "가을 책 한 권 읽기", "달 보며 산책하기", "새 음료 레시피 시도하기"], "2027-11": ["늦가을 기록장", "따뜻한 국물 요리하기", "한 해 사진 돌아보기", "두꺼운 이불 꺼내기"], "2027-12": ["한 해의 마지막 장", "올해의 책·음악 꼽기", "따뜻한 저녁 차리기", "내년 첫 주 계획 세우기"], "2028-01": ["눈 내리는 서재", "겨울 햇살 아래 걷기", "좋아하는 노래 다시 듣기", "올해 목표 세 가지 적기"], "2028-02": ["입춘 맞이", "창문 열고 환기하기", "옛 사진 꺼내 보기", "영화 한 편 보기"], "2028-03": ["새 학기의 마법", "책상 정리하기", "이번 달 목표 적기", "아침 스트레칭 3회"], "2028-04": ["봄바람 소풍", "좋아하는 곳에서 커피 마시기", "새 길로 걸어 보기", "편지 한 통 쓰기"], "2028-05": ["푸른 오월", "창가에서 햇볕 쬐기", "새로운 레시피 도전하기", "감사한 사람 떠올리기"], "2028-06": ["비 내리는 서재", "따뜻한 차 우려 마시기", "옛 일기 읽어 보기", "실내 스트레칭 10분"], "2028-07": ["한여름의 서재", "시원한 음료 만들기", "물 충분히 마시기 7일", "일찍 자는 밤 3회"], "2028-08": ["늦여름의 바람", "냉장고 속 재료로 요리하기", "사진 폴더 정리하기", "좋아하는 책 다시 펴기"], "2028-09": ["가을의 문턱", "선선한 저녁 산책", "가을 옷 꺼내 두기", "하늘 사진 한 장 남기기"], "2028-10": ["깊어가는 가을 밤", "조명 낮추고 쉬는 밤 보내기", "달 보며 산책하기", "따뜻한 음료 직접 만들어 보기"], "2028-11": ["낙엽길 위의 하루", "낙엽길 산책하기", "좋아하는 노래 3곡 고르기", "감사 일기 3일 쓰기"], "2028-12": ["겨울밤의 종소리", "올해 잘한 일 세 가지 적기", "소중한 사람에게 안부 전하기", "나에게 선물하기"], "2029-01": ["새해의 첫걸음", "올해의 한 단어 정하기", "새 다이어리 꾸미기", "겨울 햇살 아래 걷기"], "2029-02": ["겨울의 끝, 봄의 입구", "따뜻한 차 한 잔의 여유", "봄맞이 방 정리하기", "영화 한 편 보기"], "2029-03": ["꽃눈이 트는 달", "화분·꽃 들여다보기", "새 노래 하나 발견하기", "새로운 습관 하나 시작하기"], "2029-04": ["벚꽃 아래서", "꽃길 걷기", "봄 사진 한 장 남기기", "봄노래 듣기"], "2029-05": ["초록의 서재", "공원 산책하기", "초록빛 음료 마셔 보기", "저녁 노을 보기"], "2029-06": ["장마 속 티타임", "비 오는 날 독서", "창가 티타임", "좋아하는 영화 다시 보기"], "2029-07": ["한여름 밤의 별", "별 보러 나가기", "시원한 음료 만들기", "제철 과일 먹기"], "2029-08": ["여름의 마지막 페이지", "노을 구경하기", "여름 추억 사진 정리하기", "다음 계절 계획 세우기"], "2029-09": ["가을 문턱의 서재", "아침 산책 3회", "새 책 한 권 시작하기", "하늘 사진 한 장 남기기"]}; }
function evPlanKey(y,m){ return y+'-'+String(m).padStart(2,'0'); }
function seedEvents(){
  const ym=curYM(), t=todayStr(), y=+t.slice(0,4), m=+ym.split('-')[1];
  if(!S.evSeed[ym]){ const pl=evPlan()[evPlanKey(y,m)];
    if(pl){ S.events.push({id:'e'+ym,ym,name:pl[0],items:pl.slice(1).map(i=>({t:i,done:false})),reward:`🎁 ${m}월 이벤트 보상`,cleared:false}); }
    else { const base=eventDefs()[m], x=evXtra()[m], pick=evShuffle(base.slice(1).concat(x.slice(1)),y*13+m).slice(0,3);
      S.events.push({id:'e'+ym,ym,name:(y%2===0)?base[0]:x[0],items:pick.map(i=>({t:i,done:false})),reward:`🎁 ${m}월 이벤트 보상`,cleared:false}); }
    S.evSeed[ym]=1; }
  evSpecials().forEach(sp=>{ const md=sp.lunar?sp.lunar[y]:sp.md; if(!md) return; const until=y+'-'+md, from=new Date(Date.parse(until)-sp.pre*864e5).toISOString().slice(0,10), k=sp.k+y;
    if(t>=from&&t<=until&&!S.evSeed[k]){ S.events.push({id:'e'+k,ym,sp:sp.k,until,name:sp.name,items:sp.items.map(i=>({t:i,done:false})),reward:sp.reward,gold:sp.gold,cleared:false}); S.evSeed[k]=1; } });
}
function migrateSettings(){ ['Chat','Greet'].forEach(function(k){ var o='r'+'w'+k, n='lw'+k; if(o in S){ if(!(n in S)) S[n]=S[o]; delete S[o]; } }); ['React','Taste','Greet','Chat'].forEach(function(k){ var o='row'+'ena'+k, n='lowena'+k; if(S.settings&&o in S.settings){ if(!(n in S.settings)) S.settings[n]=S.settings[o]; delete S.settings[o]; } }); if(!S.settingsMig){ S.settingsMig=1; S.settings.clearPercent=75; if(S.settings.dayStart==null) S.settings.dayStart=6; } }
function migrateRewards(){ S.rewards.forEach(r=>{ if(r.repeatable==null) r.repeatable=/^rn[1-6]$/.test(r.id)||r.id==='r1'||r.id==='r4'; });
  if(!S.rwMig){ S.rwMig=1; S.rewards.forEach(r=>{ if(r.repeatable&&r.redeemed&&!(r.price>0)){ r.redeemed=false; r.uses=(r.uses||0)+1; } }); } }
function ymN(y){ const a=y.split('-'); return a[0]*12+ +a[1]; }
function evExpired(e){ return e.sp?e.until<todayStr():ymN(e.ym)<ymN(curYM()); }
function evLeft(e){ if(e.sp) return Math.round((Date.parse(e.until)-Date.parse(todayStr()))/864e5); const tp=todayStr().split('-').map(Number); return new Date(Date.UTC(tp[0],tp[1],0)).getUTCDate()-tp[2]; }
function lwFaceImg(sz,k){ return '<span class="mascot" style="width:'+sz+'px;height:'+sz+'px"><img src="'+(LW_CROP[k]||LW_CROP.greet)+'" alt="" style="width:'+sz+'px;height:'+sz+'px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);display:block;box-shadow:0 3px 6px rgba(0,0,0,.4)"></span>'; }
function evRow(e,dn,left,urg){ const n=e.items.length; let k,t;
  if(e.cleared){ k='give'; t='이번 달의 보물을 건네줄게요. 끝까지 해냈네요.'; }
  else if(urg&&left===0){ k='worry2'; t='오늘이 마지막 날이에요. 못 해도 괜찮아요. 할 수 있는 만큼만 해봐요.'; }
  else if(urg){ k='worry'; t=left+'일 남았어요. 서두르지 않아도 돼요, 하나씩만요.'; }
  else if(n&&n-dn===1){ k='proud'; t='하나만 더 하면 이번 달 보물이 손에 들어와요.'; }
  else if(dn>0){ k='proud'; t=dn+'개 채웠어요. 이 페이스 좋아요.'; }
  else { k='greet'; t=e.sp?'특별한 이벤트가 열렸어요. 가볍게 구경부터 해봐요.':'이번 달의 이벤트가 열렸어요. 천천히 하나씩 해봐요.'; }
  return '<div class="mascot-row" style="margin:4px 0 10px">'+lwFaceImg(48,k)+'<div class="speech-bubble">'+t+'</div></div>'; }
function renderEvents(){
  const el=document.getElementById('homeEvent'); if(!el) return;
  el.innerHTML=S.events.filter(e=>!evExpired(e)).map(e=>{ const dn=e.items.filter(i=>i.done).length, left=evLeft(e), urg=!e.cleared&&left<=3, ltxt=left===0?'오늘까지':left+'일 남음';
    return `<div class="section-h">${e.sp?'🎉 특별 이벤트':'🌙 이달의 이벤트 퀘스트'} · ${ltxt}${urg?' ⏳':''}</div><div class="scroll-panel">
      <div class="panel-title" style="font-family:'Noto Serif KR',serif;font-size:15px;font-weight:700">${esc(e.name)}</div>
      ${evRow(e,dn,left,urg)}
      ${e.items.map((it,i)=>`<div class="quest-row ${it.done?'done':''}" onclick="toggleEvItem('${e.id}',${i})"><div class="check">${it.done?'✓':''}</div><div class="label">${esc(it.t)}</div></div>`).join('')}
      <div class="clear-strip"><div class="bar"><i style="width:${e.items.length?dn/e.items.length*100:0}%"></i></div>
      <div style="font-size:12.5px;color:${urg?'var(--burgundy)':'var(--brown)'}">${e.cleared?'이벤트 클리어 ✦ 보물을 획득했어요':urg?`⏳ ${left===0?'오늘이 마지막이에요':left+'일 남았어요'} · ${e.items.length-dn}개만 더 하면 클리어!`:`${dn} / ${e.items.length} · 모두 채우면 한정 보물 ${esc(e.reward||'')}`}</div></div></div>`; }).join('');
}
function openCodex(){
  const key=e=>{ if(e.sp) return e.until; const a=e.ym.split('-'); return a[0]+'-'+a[1].padStart(2,'0')+'-15'; };
  const L=S.events.slice().sort((a,b)=>key(a)<key(b)?1:-1), got=L.filter(e=>e.cleared).length, miss=L.filter(e=>!e.cleared&&evExpired(e)).length;
  showModal(`<h2>📖 이벤트 도감</h2><div class="mdesc">클리어 ${got}개 · 아쉽게 놓침 ${miss}개 (놓쳐도 괜찮아요)</div>`+(L.map(e=>{ const dn=e.items.filter(i=>i.done).length, ex=evExpired(e);
    const st=e.cleared?'<span style="color:var(--ok)">✦ 클리어</span>':ex?`<span style="color:var(--burgundy)">🕯 아쉽게 놓침 ${dn}/${e.items.length}</span>`:'<span>진행 중</span>';
    const carry=(!e.cleared&&ex&&!e.sp&&!e.carried)?`<button class="mini-x" onclick="carryEv('${e.id}')">이번 달로 이월</button>`:'';
    return `<div class="pl-row"><span>${esc(e.name)}<div class="qdesc2">${e.sp?e.until:e.ym.replace('-','. ')}${e.carried?' · 이월함':''} · ${esc(e.reward||'')}</div></span><span style="text-align:right">${st}<br>${carry}</span></div>`; }).join('')||'<div class="empty">아직 이벤트가 없어요</div>'));
}
function carryEv(id){ const e=S.events.find(x=>x.id===id); if(!e) return; askOk('이 이벤트를 이번 달로 이월할까요? (한 번만 가능해요)',()=>{ e.ym=curYM(); e.carried=true; save(); openCodex(); renderEvents(); toast('이번 달로 이월했어요'); }); }
function openMonthly(off,intro){
  off=off||0; intro=intro||''; const t=todayStr().split('-').map(Number), dt=new Date(Date.UTC(t[0],t[1]-1+off,1)), y=dt.getUTCFullYear(), m=dt.getUTCMonth()+1, pre=y+'-'+String(m).padStart(2,'0'), dim=new Date(Date.UTC(y,m,0)).getUTCDate(), last=off===0?t[2]:dim;
  let cl=0,cur=0,best=0,ps=0; for(let d=1;d<=last;d++){ const h=S.history[pre+'-'+String(d).padStart(2,'0')]||{}; if(h.cleared){ cl++; cur++; best=Math.max(best,cur); } else if(h.pass){ ps++; } else cur=0; }
  const g=Object.keys(S.goldDay).filter(k=>k.startsWith(pre)&&!/chest$/.test(k)).reduce((a,k)=>a+(+S.goldDay[k]||0),0);
  const ev=S.events.filter(e=>e.sp?e.until.startsWith(pre):e.ym===y+'-'+m), evc=ev.filter(e=>e.cleared).length, rate=last?Math.round(cl/last*100):0;
  showModal(`<h2>🗓 월간 리포트</h2>${intro?'<div class="mdesc">'+intro+'</div>':''}<div class="pager" style="color:var(--brown)"><button style="color:var(--brown)" onclick="openMonthly(${off-1})">‹</button><span>${y}. ${m}</span><button style="color:var(--brown)" ${off>=0?'disabled':''} onclick="openMonthly(${off+1})">›</button></div>
    <div class="milestone"><span class="m-check">✓</span>클리어한 날 ${cl} / ${last} (${rate}%)${ps?' · 쉬는 날 '+ps:''}</div>
    <div class="milestone"><span class="m-check">🔥</span>최장 연속 클리어 ${best}일</div>
    <div class="milestone"><span class="m-check">◈</span>이번 달 번 골드 ${g}</div>
    <div class="milestone"><span class="m-check">✦</span>이벤트 클리어 ${evc} / ${ev.length}</div>
    <div class="rc-sum" style="margin-top:12px">${rate>=80?'정말 멋진 한 달이었어요.':rate>=50?'좋은 리듬이었어요. 다음 달도 이 흐름으로 가요.':'조금 쉬어 간 달이었어요. 괜찮아요, 새 달이 시작돼요.'}</div>`);
}
const MARTY_IMG='assets/71f4c4a828.png';
var _say=null,_snap=null,_inTQ=false,_lastSay='',_mtPend=false,_mtT=null;
var LW_EXTRA={
 walk:['엘리자베스 베넷은 흙 묻은 치맛단도 개의치 않고 걸었죠. 오늘 산책도 그만큼 근사했을 거예요.','걷다 보면 계절이 먼저 말을 걸어요. 겐지 이야기의 사람들이 계절마다 편지를 쓴 이유를 알 것 같아요.','스마로 물러나 바닷가를 거닐던 겐지도 결국 돌아왔어요. 걷는 시간은 사람을 제자리로 돌려놓아 줘요.'],
 ex:['달리는 사람은 어제의 자신과 나란히 달리는 거래요. 오늘도 수고했어요.','땀이 식으면 따뜻한 차를 한 잔 해요. 몸이 고마워할 거예요.'],
 str:['몸을 하나의 작품처럼 다듬는 사람이 있었대요. 오늘의 한 세트도 조각칼 한 번이에요.'],
 dinner:['조용한 부엌에서 파스타를 삶는 저녁, 그런 마무리도 좋아요.','겐지 이야기의 저택에선 계절마다 상을 차렸대요. 오늘 저녁은 어떤 계절이었나요.'],
 sleep:['오늘 밤 꿈에는 어떤 이야기가 기다릴까요. 열흘 밤의 꿈처럼 이상해도 좋으니 푹 자요.','겐지 이야기의 마지막 장 이름이 꿈의 부교예요. 오늘의 장도 꿈으로 이어 두고 쉬어요.'],
 stretch:['우쓰세미의 허물처럼, 굳었던 몸을 한 겹 벗어 놓은 기분이겠어요.'],
 water:['물 한 잔도 좋지만, 차를 우릴 여유가 있다면 그것도 좋겠어요.'],
 dessert:['티타임에 과자가 빠지면 응접실이 아니죠. 맛있게 먹었길 바라요.','향을 겨루던 사람들도 잠깐은 쉬며 과자를 들었겠죠. 오늘의 달콤함도 하나의 풍류예요.'],
 generic:['한 줄이 쌓여 한 장이 되고, 한 장이 쌓여 쉰네 장이 되죠.'],
 first:['오늘의 첫 페이지예요. 첫 줄은 언제나 조용히 시작되죠.'],
 clear:['오늘의 마지막 장까지 덮었어요. 책갈피는 내일 아침의 당신 몫이에요.','오늘의 장이 하나 끝났어요. 이제 등불을 낮추고 쉬어요.'],
 streak:['{n}일째예요. 보이차도 며칠 두어야 맛이 트이는 법이에요.'],
 comeback:['겐지도 스마로 물러났다가 다시 돌아왔어요. 쉬어 간 시간도 이야기의 일부예요.'],
 debt:['돈 걱정은 고전 속 인물들도 피하지 못했어요. 그래도 장부를 펼친 사람이 이야기를 끌어가요.'],
 video:['복선을 전부 회수한 영상이에요. 좋은 추리소설의 마지막 장 같아요.','그림 겨루기 날 사람들이 각자의 그림을 내놓았듯, 오늘 영상도 당당히 내놓아요.'],
 recipe:['새 레시피가 올랐네요. 향을 겨루던 겐지의 사람들처럼, 이번 배합도 기대돼요.','가오루는 타고난 향이, 니오우는 정성껏 배합한 향이 이름이 되었죠. 이 레시피는 어느 쪽일까요.'],
 reward:['쉬는 것도 한 장이에요. 헤이안의 사람들은 달구경만으로도 하루를 채웠대요.'],
 event:['오늘의 행사가 끝났어요. 하나노엔의 벚꽃 연회처럼 기억에 남을 페이지예요.']
};
function lwMerge(o){ for(var k in LW_EXTRA) o[k]=(o[k]||[]).concat(LW_EXTRA[k]); return o; }
function lwLines(){ return lwMerge({
 walk:['오늘도 걸었네요. 바깥 공기는 어땠어요?','걷는 동안 머리가 조금 가벼워졌길 바라요.','한 걸음 한 걸음이 쌓여서 이 페이지가 돼요.'],
 str:['근력 운동까지 해냈군요. 몸이 고마워하고 있을 거예요.','묵직한 한 세트, 조용히 대단해요.','오늘의 힘이 내일의 당신을 받쳐 줄 거예요.'],
 ex:['운동을 해냈네요. 땀 흘린 만큼 개운하길 바라요.','몸을 움직인 하루는 어딘가 달라요.','수고했어요. 물 한 잔 마시고 쉬어요.'],
 dinner:['저녁을 챙겼네요. 오늘의 나에게 하는 좋은 대접이에요.','따뜻한 한 끼면 하루가 부드럽게 접혀요.','잘 먹는 것도 훌륭한 퀘스트예요.'],
 sleep:['일찍 자려고 했군요. 좋은 선택이에요.','푹 자요. 내일의 페이지는 내일 쓰면 돼요.','잘 자는 것도 하루의 마지막 장이에요.'],
 stretch:['몸이 한결 펴졌겠어요.','스트레칭 한 번이 어깨를 살려 줘요.','천천히, 그거면 충분해요.'],
 water:['물 한 잔, 사소하지만 몸은 알아요.','수분 채우기 성공이네요.','작은 습관이 오래 가요.'],
 dessert:['달콤한 시간도 오늘의 일부예요.','디저트까지 챙겼네요. 맛있게 먹었길 바라요.','잠깐의 달콤함도 충분히 소중해요.'],
 generic:['하나 해냈네요. 좋아요.','차근차근 잘 하고 있어요.','이 한 줄이 오늘의 페이지가 돼요.'],
 first:['오늘의 첫 페이지가 채워졌어요.','시작이 반이라던데, 정말 그런 것 같아요.'],
 early:['오늘은 일찍 시작했네요. 아침 공기가 잘 어울려요.','이른 시간부터 부지런하네요.'],
 almost:['하나만 더 하면 오늘의 페이지가 완성돼요.','거의 다 왔어요. 조금만 더요.'],
 clear:['오늘의 페이지를 다 채웠어요. 수고했어요.','오늘도 해냈네요. 이제 좀 쉬어도 좋아요.'],
 streak:['벌써 {n}일째예요. 조용히 대단한 일이에요.','{n}일 연속이라니, 이 도서관에 당신의 발자국이 남았어요.'],
 comeback:['돌아와 줘서 반가워요. 쉬는 동안은 어땠어요?','오랜만이에요. 천천히 다시 시작해도 괜찮아요.'],
 debt:['{n}원이 줄었어요. 숫자보다 꾸준함이 더 중요해요.','한 걸음이면 충분해요. 장부가 조금 가벼워졌어요.'],
 video:['영상 하나가 완성됐어요. 만드는 동안의 시간이 다 담겨 있겠죠.','새 영상이 서가에 꽂혔어요. 수고 많았어요.'],
 stage:['한 단계를 넘겼어요. 가게의 모습이 조금 더 선명해졌어요.'],
 body:['오늘의 실천이 하루 더 쌓였어요.','몸은 정직해서 좋아요. 잘 하고 있어요.'],
 bodylog:['기록을 남겼어요. 숫자는 그저 참고일 뿐이에요.'],
 recipe:['새 레시피가 노트에 올랐어요. 어떤 향일지 궁금해요.'],
 reward:['보상을 누렸군요. 충분히 누릴 자격이 있어요.','쉬어 가는 것도 이야기의 일부예요.'],
 event:['이벤트를 마무리했어요. 특별한 페이지가 하나 늘었네요.'] }); }
function lwSay(kind,ctx,opt){
  if(S.settings.lowenaReact===false) return; const P=lwLines()[kind]; if(!P) return;
  let t=(kind==='streak'&&ctx&&window.LW_MILE&&window.LW_MILE[ctx.n])||P[Math.floor(Math.random()*P.length)]; if(t===_lastSay&&P.length>1) t=P[(P.indexOf(t)+1)%P.length]; _lastSay=t;
  t=t.replace(/\{(\w+)\}/g,(m,k)=>(ctx&&ctx[k]!=null)?ctx[k]:'');
  _say={text:t,t:Date.now(),mood:(opt&&opt.mood)||'cheer',face:LW_KIND_FACE[kind]||((opt&&opt.mood)==='clear'?'smile':'proud')}; if(opt&&opt.toast) setTimeout(()=>toast('로웨나: '+t),1700);
  try{ lwFaceTemp(_say.face,45000); }catch(e){ LQ.err(e); }
}
function lwCat(name){ return /걷|산책/.test(name)?'walk':/근력|웨이트|근육/.test(name)?'str':/운동|헬스|러닝/.test(name)?'ex':/저녁|식사|밥/.test(name)?'dinner':/취침|수면|잠/.test(name)?'sleep':/스트레칭|요가/.test(name)?'stretch':/물|수분/.test(name)?'water':/디저트|간식/.test(name)?'dessert':'generic'; }
function lwMetrics(){ const d=debtQ(), cf=S.mainQuests.find(q=>q.type==='stages'), cl=S.subQuests.find(q=>q.id==='cafelab');
  return {debt:d?d.current:0, yt:S.mainQuests.filter(q=>q.type==='youtube').reduce((a,q)=>a+(q.videos||0),0), stage:cf?cf.doneStages:0, body:Object.keys(S.bodyDays||{}).length, blog:(S.bodyLog||[]).length, rec:cl?cl.recipes.length:0, rw:S.rewards.reduce((a,r)=>a+(r.redeemed?1:0)+(r.uses||0),0)}; }
function lwBig(kind,ctx){ lwSay(kind,ctx,{toast:true}); martyMaybe(.5,kind); }
function lwWatch(){ const m=lwMetrics(), o=_snap; _snap=m; if(!o||_inTQ) return;
  if(m.debt<o.debt) return lwBig('debt',{n:(o.debt-m.debt).toLocaleString()});
  if(m.yt>o.yt) return lwBig('video'); if(m.stage>o.stage) return lwBig('stage'); if(m.rec>o.rec) return lwBig('recipe');
  if(m.body>o.body) return lwBig('body'); if(m.blog>o.blog) return lwBig('bodylog'); if(m.rw>o.rw) return lwBig('reward'); }
function lwGreetInit(){ try{ if(S.settings.lowenaReact===false) return; const t=todayStr(), H=S.history;
  if(H[t]&&Object.values(H[t].done||{}).some(Boolean)) return;
  const ks=Object.keys(H).filter(k=>k<t&&Object.values(H[k].done||{}).some(Boolean)).sort(); if(!ks.length) return;
  if(Math.round((Date.parse(t)-Date.parse(ks[ks.length-1]))/864e5)>=4){ lwSay('comeback',{}); _say.ttl=300000; } }catch(e){ LQ.err(e); } }
const MT={
 walk:['걸었어요? 다리 대신 제가 박수 쳐 드릴게요! 👏','한 걸음, 두 걸음… 세다가 저도 신나서 날아왔어요!'],
 str:['우와, 근육이 반짝반짝! 💪 오늘도 멋졌어요.','무거운 거 들었죠? 저는 이슬 한 방울도 무거운데, 대단해요!'],
 ex:['땀 흘린 당신, 오늘의 MVP예요! ✨','운동 끝! 이제 물 한 잔이 기다리고 있어요 💧'],
 dinner:['든든하게 먹었네요! 밥심이 최고예요 🍚','맛있게 먹었어요? 저도 한 입만… 농담이에요, 후후'],
 sleep:['일찍 자는 사람에겐 꿈나라 특급열차를 태워 드려요 🌙','오늘도 수고했어요. 좋은 꿈 꿔요!'],
 stretch:['쭈우욱— 늘어나는 건 어깨만이 아니에요, 기분도요! 🙆','몸이 부드러워지면 마음도 말랑해져요 ✨'],
 water:['물 한 잔 성공! 촉촉한 하루가 되길 💧','작은 습관이 큰 마법이 돼요, 진짜예요!'],
 dessert:['달콤한 건 마음의 연료예요. 오늘은 죄책감 없이 냠! 🍰','디저트는 들어가는 위장이 따로 있대요. 저도 그래요 😋'],
 generic:['하나 해냈네요! 이런 분을 응원하는 게 제 일이에요 ✨','잘하고 있어요. 제가 옆에서 반짝이고 있을게요!','작은 걸음도 모이면 큰 길이 돼요. 계속 가요!'],
 first:['오늘의 첫 퀘스트 완료! 시작이 제일 어려운데 벌써 해냈어요 🌟','좋은 출발이에요! 이 기세로 쭉 가 봐요!'],
 early:['벌써 시작했어요? 아침 요정도 깜짝 놀랐어요 ☀️','부지런한 하루의 시작, 멋져요!'],
 almost:['하나만 더요! 결승선이 코앞이에요 🏁','거의 다 왔어요. 마지막 한 걸음은 제가 응원할게요!'],
 clear:['오늘 퀘스트 클리어! 오늘의 당신, 정말 멋졌어요 🎉','다 해냈네요. 이제 마음껏 쉬어도 돼요, 자격 충분해요!'],
 streak:['연속 기록이 쭉쭉 늘고 있어요! 꾸준함이 진짜 마법이에요 🔥'],
 debt:['빚이 줄었어요! 숫자가 작아질수록 마음도 가벼워져요 🪽'],
 video:['영상 완성! 저 몰래 감독님이 되셨네요 🎬'],
 stage:['한 단계 돌파! 가게가 점점 모양을 갖춰 가요 🏠'],
 body:['꾸준한 실천, 몸이 다 알고 있어요 💪'],
 bodylog:['기록하는 사람은 강해요. 멋진 습관이에요 📝'],
 recipe:['새 레시피다! 완성되면 저도 한 입만 주세요 🍳'],
 reward:['보상 타임! 충분히 누릴 자격 있어요 🎁','쉬는 것도 퀘스트예요. 마음껏 즐겨요!'],
 event:['이벤트 완료! 특별한 하루를 만들었네요 🎊'],
 ach:['새 업적 달성! 저도 모르게 박수가 나왔어요 🏆'],
 confess:['털어놓아 줘서 고마워요. 로웨나와 저는 늘 당신 편이에요 🤍'],
 rewardAdd:['새 보물 등록 완료! 얼른 모아서 누려 봐요 ✨']
};
const MT_T={
 morn:['좋은 아침이에요! 오늘은 어떤 하루가 될까요? ☀️','아침 요정 마티 출근했어요! 물 한 잔부터 어때요? 💧','일어난 것만으로도 오늘의 첫 퀘스트는 성공이에요!'],
 fore:['오전 잘 보내고 있어요? 어깨 한 번 펴 봐요 🙆','커피 향이 그리울 시간이죠. 저는 이슬 한 방울로 버티지만요 ☕','집중이 안 되면 5분만 시작해 봐요. 시작하면 어떻게든 돼요!'],
 lunch:['점심시간이에요! 뭐 먹을지 정했어요? 🍚','밥은 챙겨 먹었죠? 든든해야 퀘스트도 잘 풀려요!','점심 뒤엔 졸려도 괜찮아요. 저도 그래요… 😴'],
 aft:['오후의 고비를 넘는 중이네요. 조금만 힘내요! ✨','잠깐 창밖 한 번 보고 와요. 눈도 쉬어야 해요 🌤️','간식 타임 어때요? 요정 통계상 당 충전이 효과 좋아요 🍪'],
 eve:['하루 수고 많았어요! 저녁은 맛있게 먹었어요? 🌆','오늘의 나에게 칭찬 한마디 해 줄 시간이에요 👏','오늘도 잘 버텼어요. 정말이에요!'],
 night:['늦은 시간이네요. 슬슬 하루를 접어 볼까요? 🌙','잠들기 전엔 폰 대신 스트레칭 어때요? 마티의 추천이에요','오늘도 정말 수고했어요. 내일의 당신을 위해 푹 자요 ✨']
};
const MT_C={
 none:['오늘은 아직 퀘스트가 조용하네요. 제일 쉬운 것부터 하나만 해 볼까요? 🌱','시작이 제일 어려워요. 가장 작은 것부터 마티랑 같이 해요!'],
 mid:['벌써 몇 개 해냈네요! 이 페이스면 충분해요 👍','절반의 마법은 이미 걸렸어요. 남은 것도 천천히!'],
 near:['퀘스트가 {n}개 남았어요! 조금만 더 하면 오늘 클리어예요 🏁','{n}개만 더! 마티가 응원 요정으로 대기 중이에요 📣'],
 cleared:['오늘 퀘스트는 이미 클리어! 이제 저랑 수다나 떨어요 😄','다 끝냈으니 오늘은 당신이 주인공이에요. 푹 쉬어요 🎉']
};
const MT_J=['퀴즈! 세상에서 가장 빠른 퀘스트는? 이미 끝낸 퀘스트예요 😎','요정 개그예요. 제가 제일 좋아하는 색은? 반짝반짝 ✨ …죄송해요.'];
var _mtLast='';
function martyPick(P,n,key){ return LQD.pick(key||null,P,{who:'marty',vars:{n:n==null?'':n}}); }
function martyBand(h){ return h>=22||h<5?'night':h<9?'morn':h<12?'fore':h<14?'lunch':h<18?'aft':'eve'; }
function martyChatLine(){ const b=martyBand(kstNow().getUTCHours()); let c=null,left=0;
  try{ const act=computeToday().active, day=S.history[todayStr()]||{}, dn=act.filter(q=>(day.done||{})[q.id]).length; left=act.length-dn;
    c=day.cleared?'cleared':(act.length&&dn===0)?'none':(left>0&&left<=2)?'near':dn>0?'mid':null; }catch(e){ LQ.err(e); }
  const r=Math.random(); let PP=MT_T[b], kk='marty.time.'+b; if(r<.2){ PP=MT_J; kk='marty.time.joke'; } else if(c&&r<.6){ PP=MT_C[c]; kk='marty.state.'+c; } return martyPick(PP,left,kk); }
function martyShow(kind,txt){ const el=document.getElementById('martyPop'); if(!el) return;
  const t=txt||(kind&&MT[kind]?martyPick(MT[kind]):martyChatLine()), ms=Math.min(9000,Math.max(3400,1800+t.length*130));
  el.innerHTML=`<div class="mp-all" style="animation-duration:${ms}ms"><div class="mp-bub" onclick="martyHide()"><b>마티</b>${esc(t)}</div><div class="mp-in"><i class="mp-s a">✦</i><i class="mp-s b">✦</i><i class="mp-s c">✧</i><img src="${MARTY_IMG}" alt="" onclick="martyHide()"></div></div>`;
  el.className='show'; clearTimeout(_mtT); _mtT=setTimeout(martyHide,ms); }
function martyHide(){ const el=document.getElementById('martyPop'); if(el){ el.className=''; el.innerHTML=''; } }
function martyMust(kind){ if(S.settings.martyPop===false||_mtPend) return; _mtPend=true; let n=0; const go=()=>{ if(stampBusy&&n++<20){ setTimeout(go,500); return; } _mtPend=false; martyShow(kind); }; setTimeout(go,2300); }
function martyDay(){ const t=todayStr(); if(!S.marty||S.marty.d!==t) S.marty={d:t,n:0,b:[]}; if(!S.marty.b) S.marty.b=[]; return S.marty; }
function martyMaybe(p,kind){ if(S.settings.martyPop===false) return; const m=martyDay(); if(m.n>=2||Math.random()>=p) return; m.n++; m.t=Date.now(); save(); martyShow(kind); }
function martyIdle(){ try{ if(S.settings.martyPop===false||S.settings.martyChat===false||document.hidden||stampBusy||_mtPend) return;
  const sp=document.getElementById('splash'); if(sp){ const cs=getComputedStyle(sp); if(cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05) return; }
  if(document.getElementById('modalOverlay').classList.contains('show')||document.querySelector('.mg-box')||document.getElementById('martyPop').className==='show') return;
  const h=kstNow().getUTCHours(); if(h>=1&&h<7) return;
  const m=martyDay(), b=martyBand(h); if(m.b.includes(b)||Date.now()-(m.t||0)<20*6e4) return;
  m.b.push(b); m.t=Date.now(); save(); martyShow(); }catch(e){ LQ.err(e); } }
setInterval(martyIdle,45000); setTimeout(martyIdle,6000);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) setTimeout(martyIdle,2500); });
function setLw(k,v){ S.settings[k]=v; save(); toast(v?'켰어요':'껐어요'); }
{ const _tq=toggleQuest;
  toggleQuest=function(id){
    const t=todayStr(), h0=S.history[t], before=!!(h0&&h0.done&&h0.done[id]), bc=!!(h0&&h0.cleared);
    _inTQ=true; try{ _tq(id); }finally{ _inTQ=false; }
    try{ const day=S.history[todayStr()]; if(todayStr()!==t||before||!day||!day.done[id]) return;
      const act=computeToday().active, dn=act.filter(q=>day.done[q.id]).length, need=Math.ceil(act.length*S.settings.clearPercent/100-1e-9)-dn, q=S.dailyQuests.find(x=>x.id===id), hr=kstNow().getUTCHours();
      if(day.cleared&&!bc){ const st=curStreak(); if([3,7,14,21,30,50,54,100].includes(st)) lwSay('streak',{n:st},{mood:'clear'}); else lwSay('clear',{},{mood:'clear'}); }
      else{ const k=need===1?'almost':dn===1?(hr<8?'early':'first'):lwCat(q?q.name:''); lwSay(k); martyMaybe(.2,k); }
      renderHome(); }catch(e){ LQ.err(e); }
  };
  const _cel=celebrate; celebrate=function(kind,sub){ _cel(kind,sub); try{ if(kind==='event'){ lwSay('event',{},{mood:'clear'}); setTimeout(renderHome,60); } else if(kind!=='clear'){ lwFaceTemp('proud2',60000); } martyMust(kind); }catch(e){ LQ.err(e); } };
  const _ca2=checkAchievements; checkAchievements=function(){ _ca2(); try{ lwWatch(); }catch(e){ LQ.err(e); } };
}
document.body.insertAdjacentHTML('beforeend','<div id="martyPop"></div>');
lwGreetInit();

/* ===== 고해성사: 로웨나에게 털어놓기 ===== */

var CF_LINES={
 sad:['말해 줘서 고마워요. 오늘은 그 마음이 조금 무거웠겠어요.','슬픈 날은 슬픈 채로 있어도 돼요. 정리하지 않아도 괜찮아요.','그런 일이 있었군요. 여기서 다 듣고 있을게요.','애쓰지 않아도 돼요. 오늘은 쉬어 가는 페이지로 두어요.','쓰는 동안 조금은 덜어졌길 바라요. 무거운 건 이 노트에 두고 가도 돼요.','속상했겠어요. 그 마음이 틀린 게 아니에요.','오늘 하루 잘 버텼어요. 따뜻한 걸 마시고 천천히 쉬어요.','혼자 안고 있지 않아도 돼요. 말이 안 돼도 다시 와서 적어도 좋아요.'],
 lonely:['혼자 있다고 해서 정말 아무도 없는 건 아니에요. 저는 여기 있어요.','오늘 그 허전함, 이유 없이 찾아온 게 아니었을 거예요.','곁에 아무도 없다고 느껴지는 밤도 있죠. 그럴 땐 여기 와도 돼요.','외로움을 말로 꺼내는 것도 꽤 용기가 필요한 일이에요.','조용한 시간이 유독 힘들 때가 있죠. 오늘은 제가 옆에 있을게요.','혼자라는 느낌과 실제로 혼자인 건 다를 때가 많아요. 당신을 아는 사람들이 있어요.','이런 마음도 지나가요. 지금은 그냥 흘려보내도 괜찮아요.','털어놔 줘서 고마워요. 다음에 또 이런 밤이 오면 다시 와요.'],
 angry:['화가 날 만한 일이었나 봐요. 참지 않고 말해 줘서 다행이에요.','그 감정, 틀린 게 아니에요. 잠깐 여기 내려놓고 가요.','억울했겠어요. 오늘은 그 마음 그대로 인정해 줄게요.','화를 낸다고 이상한 사람이 되는 거 아니에요.','속에 쌓아두지 않고 적어 준 것만으로도 잘한 거예요.','누구라도 그 상황이면 화가 났을 것 같아요.','오늘 그 감정은 여기 두고, 몸은 잠깐 쉬어가요.','말해 줘서 고마워요. 조금은 풀렸길 바라요.'],
 anxious:['걱정되는 일이 있었군요. 그 마음도 자연스러운 거예요.','아직 일어나지 않은 일이 자꾸 신경 쓰이는 날이었나 봐요.','불안한 채로도 여기까지 잘 왔어요.','떨리는 마음, 굳이 가라앉히려 애쓰지 않아도 돼요.','걱정을 적어두면 머릿속에서 조금은 덜어지기도 해요.','무슨 일이 있어도 지금 이 순간은 안전해요.','조급해하지 않아도 돼요. 하나씩 가면 돼요.','말해 줘서 고마워요. 오늘 밤은 편히 쉬어요.'],
 dessert:['달콤한 한 입이 하루를 망치지 않아요. 내일은 내일의 페이지예요.','솔직하게 말해 줘서 고마워요. 맛있었길 바라요.','오늘은 그런 날이었나 봐요. 벌점은 없어요.','규칙도 소중하지만 당신이 더 소중해요. 물 한 잔 마시고 넘어가요.','한 번의 디저트로 흐름이 끊기지 않아요. 내일 다시 이어 가면 돼요.','기분이 필요했던 날이었을지도 몰라요. 그래도 괜찮아요.','그 달콤함은 이미 지나갔고, 남은 하루는 여전히 당신 거예요.','만회하려고 애쓰지 않아도 돼요. 평소처럼 지내는 게 가장 좋아요.'],
 joy:['우와, 정말 잘했어요! 같이 기뻐요.','그 순간을 이렇게 적어두다니, 더 오래 기억날 것 같아요.','오늘 하루, 스스로를 칭찬해 줘도 좋을 것 같아요.','듣기만 해도 기분이 좋아지는 이야기네요.','이런 날은 꼭 기록해 둬야 해요. 잘 왔어요.','당신이 해낸 거예요. 축하해요!','작은 기쁨도 소중해요. 나눠줘서 고마워요.','이 기분, 조금 더 오래 간직해도 돼요.'],
 chat:['오늘은 그냥 이야기하고 싶은 기분이었나 봐요. 좋아요.','별일 아니어도 괜찮아요. 그냥 나누는 이야기도 좋으니까요.','오늘 하루는 어땠어요? 저도 궁금했어요.','이렇게 가볍게 얘기해 주는 것도 반가워요.','아무 얘기나 좋아요. 저는 듣는 걸 좋아하거든요.','오늘도 잘 지냈다니 다행이에요.','심심할 땐 언제든 와서 말 걸어도 돼요.','소소한 이야기, 잘 들었어요.'],
 free:['들었어요. 털어놓아 줘서 고마워요.','그런 하루였군요. 여기에 잘 적어 두었어요.','말로 꺼내 놓으면 조금 가벼워지기도 해요. 오늘 어땠는지 알겠어요.','적어 준 이야기, 소중히 간직할게요.','정리되지 않은 말이어도 괜찮아요. 그대로 충분해요.','여기는 언제든 와서 내려놓아도 되는 곳이에요.','오늘도 이야기해 줘서 반가워요.','그랬군요. 조용히 끝까지 들었어요.'],
 qotd:['오늘의 질문에 답해 줘서 고마워요. 이런 것도 당신을 이루는 한 조각이겠죠.','생각해 봐 줘서 고마워요. 이 페이지에 잘 넣어 둘게요.','짧게라도 답해 준 것만으로 충분해요.','이런 질문에 답하는 시간, 저는 꽤 소중하다고 생각해요.','오늘 하루를 돌아보게 해 줘서 저도 좋아요.','당신 생각을 조금 더 알게 됐어요. 반가워요.','이 대답, 나중에 다시 꺼내 보면 재밌을 거예요.']};
var CF_KIND={sad:'슬픈 일',lonely:'외로움',angry:'화남',anxious:'불안',dessert:'디저트',joy:'기쁜 일',chat:'잡담',free:'털어놓기',qotd:'오늘의 질문',hug:'안아주기',mood:'기분 체크인'};
var CF_LABEL={sad:'슬픈 일',lonely:'외로워요',angry:'화가 나요',anxious:'불안해요',dessert:'디저트 먹었어요',joy:'좋은 일 있었어요',chat:'잡담하고 싶어요',free:'그냥 털어놓기'};
var CF_CHIP_KEYS=['sad','lonely','angry','anxious','dessert','joy','chat','free'];
var CF_NEG_LABEL={sad:'속상한',lonely:'외로운',angry:'화가 나는',anxious:'불안한'};
function cfWeekAware(k){ if(!CF_NEG_LABEL[k]) return ''; const t0=Date.parse(todayStr());
  const n=(S.confess||[]).filter(e=>e.k===k&&(t0-Date.parse(e.d))>=0&&(t0-Date.parse(e.d))<7*864e5).length;
  if(![3,5,7].includes(n)) return '';
  return '\n\n이번 주에 벌써 '+n+'번째 '+CF_NEG_LABEL[k]+' 얘기네요. 요즘 마음이 계속 힘든 시기인가 봐요. 혼자 버티지 않아도 돼요. 괜찮다면 가까운 사람이나 상담 전문가에게도 이야기해봐요.'; }
/* 가끔 로웨나 대신 마티가 대타로 답하는 이벤트 */
var MT_CONFESS=['어이쿠, 오늘은 제가 대신 왔어요! 로웨나 님은 옆에서 살짝 쉬는 중이에요 😊','마티가 땜빵 출동! 그래도 진심으로 듣고 있었어요 ✨','로웨나 님 대신 제가 답할게요! 편하게 털어놓은 거 잘 봤어요 🌟','짜잔, 오늘은 마티가 답장 담당이에요! 무슨 얘기든 좋아요 👂','살짝 로웨나 님 몰래 끼어들었어요! 그래도 잘 들었어요 🤫','오늘은 특별히 마티가 답해드릴게요. 잘 하고 있어요! 💪','로웨나 님이 잠깐 자리를 비운 사이, 마티가 왔어요! 힘내요 🎈','깜짝 등장! 마티도 당신 얘기 소중히 들었어요 🍀'];
function cfMartyChance(){ return Math.random()<0.15; }
function martyMascotImg(size){ return '<span class="mascot" style="width:'+size+'px;height:'+size+'px"><img src="'+MARTY_IMG+'" alt="" style="width:'+size+'px;height:'+size+'px;object-fit:contain;display:block;filter:drop-shadow(0 0 6px rgba(243,216,138,.5))"></span>'; }
var _cfChip='';
/* 부정문("힘들지 않았어", "안 우울해")과 부정된 성공("합격 못 했어")을 걷어내고 판별용 문자열을 만든다 */
var CF_NEG3=/잠이\s*안|잠\s*못|못\s*잤|안\s*떠나|떠나지\s*않|싸웠|다퉜|혼났|깨졌|서운|지친|지치|지쳐/;
var CF_NEG2=/안\s*좋|좋지\s*않|재미\s*없|기분\s*(이\s*)?나쁘|나빴|망했|최악|불합격|실패|합격\s*못|성공\s*못|해내지\s*못|떨어졌/;
function cfStripNeg(t){ t=String(t||'');
  var A='화나|화가\\s*나|짜증|우울|슬프|슬퍼|힘들|힘드|불안|걱정|외롭|외로|속상|피곤|지치|지쳤|억울|답답|무섭|괴롭|서럽|싫';
  var B='기쁘|기뻐|행복|즐겁|재미있|재밌|뿌듯|설레|신나|좋|괜찮|편하|나아지|나아졌';
  return t
    .replace(new RegExp('(?:'+A+'|'+B+')[가-힣]{0,2}?지\\s*(?:는|도|가)?\\s*(?:않|못|안)[가-힣]*','g'),' ')
    .replace(new RegExp('안\\s*(?:'+A+'|'+B+')[가-힣]*','g'),' ')
    .replace(/(?:걱정|불안|고민|스트레스)\s*(?:은|는|이|가)?\s*(?:안|없|하나도\s*없)[가-힣]*/g,' ')
    .replace(/(?:합격|성공|해내|해냈)[가-힣]{0,2}\s*(?:못|하지\s*못)[가-힣]*/g,' ')
    .replace(/(?:하나도|전혀|별로)\s*(?:안|않)[가-힣]*/g,' '); }
function cfKind(t,chip){ if(chip) return chip;
  t=String(t||''); var o=t; t=cfStripNeg(t);
  if(/배고|배가\s*고|출출/.test(t)) return 'hungry';
  if(/먹고\s*싶|땡겨|땡기|당겨|당기/.test(t)&&/디저트|케이크|과자|아이스크림|초콜릿|빵|쿠키|마카롱|달달|단\s*거/.test(t)) return 'crave';
  if(/졸려|졸리|피곤|잠\s*와|기운\s*없|지쳤|나른/.test(t)&&!/불안|걱정|우울|슬|속상|화나|짜증/.test(t)) return 'tired';
  var strongNeg=/우울|힘들|속상|눈물|울었|서러|지쳐|외로|불안|걱정|화나|화가\s*나|짜증|억울/.test(t);
  if(!strongNeg&&(/디저트|케이크|과자|아이스크림|초콜릿|쿠키|마카롱|빵(?!\s*터)/.test(t)||(/먹었|먹음/.test(t)&&/달달|단\s*거|단거/.test(t)))) return 'dessert';
  if(/기뻐|기분\s*좋|행복|뿌듯|해냈|성공|합격|축하/.test(t)) return 'joy';
  if(/화나|화가\s*나|짜증|열받|빡치|억울|분해/.test(t)) return 'angry';
  if(/불안|걱정|초조|떨려|긴장/.test(t)) return 'anxious';
  if(/외로|혼자\s*있|아무도\s*없|쓸쓸/.test(t)) return 'lonely';
  if(/슬프|슬퍼|슬펐|슬픔|슬픈|우울|힘들|속상|눈물|울었|서러|지쳐|지친|싸웠|다퉜|서운|혼났/.test(t)||CF_NEG2.test(o)) return 'sad';
  if(/잡담|심심|아무\s*말|그냥\s*얘기/.test(t)) return 'chat';
  return 'free'; }
function cfReply(k){ return LQD.pick('lowena.confess.'+k,CF_LINES[k],{who:'lowena'}); }
/* ============================================================================
   밀담실 (로웨나의 밀담실) — 이 아래가 밀담실 코드 구역이에요. 전부 아래 하나의 IIFE 안에 있어요.
   1) 답장 엔진: 문구 확장 · 주제 사전 · 시간대/요일 문구 · 되묻기 · 후속 질문
   2) 감정 칩 · 타이핑 답장 · 밀담실 전용 화면(촛불 조명 · 표정 · 낮은 배경음)
   3) 연출: 촛불 · 쓰고 태우기 · 숨 고르기 · 말없이 곁에 · 축하/업적 · 힘든 날 보상
   덮어쓰기: cfKind / cfPick / cfSend / cfRoomClose 는 각각 한 곳에서만 정의돼요.
   (마티 보상 화면 연결부 mgPicks / mgRender 만 다른 모듈 함수를 감싸는 훅으로 남아 있어요.)
   ============================================================================ */
(function(){
  var MORE={
    sad:['오늘 얼마나 마음이 쓰였을지 조금은 알 것 같아요.','슬픈 마음도 당신의 일부니까, 억지로 밀어내지 않아도 돼요.','울고 싶으면 울어도 괜찮아요. 여기선 아무도 재촉하지 않아요.','그 일이 작지 않았다는 거, 저는 알아요.','오늘은 나를 다그치지 말고 조용히 있어 줘요.','글로 꺼내 놓은 것만으로 벌써 한 걸음이에요.','마음이 가라앉은 날엔 가라앉은 대로 하루를 보내도 돼요.','힘든 얘기를 꺼내 준 용기, 제가 잘 받았어요.','지금 느끼는 게 전부가 되지는 않을 거예요. 천천히 흘러갈 거예요.','오늘 밤은 따뜻한 이불 속에서 쉬어 가요.','충분히 속상할 만한 일이에요. 스스로를 탓하지 말아요.','조금 쉬어도 세상은 그대로예요. 오늘은 당신 편을 들게요.'],
    lonely:['외로운 마음도 누군가를 그리워한다는 뜻일지 몰라요.','이 시간에 여기 와 줘서 반가워요.','혼자라고 느끼는 순간에도 당신은 충분히 소중해요.','허전한 밤엔 따뜻한 걸 손에 쥐고 있어 봐요.','말 걸어 줘서 고마워요. 저는 언제든 여기 있어요.','누군가에게 안부 한 줄 보내는 것도 좋아요. 부담 없이요.','외로움은 나쁜 게 아니에요. 그저 마음이 온기를 찾는 거예요.','오늘은 저랑 조금 더 이야기해도 좋아요.','조용한 방 안에서도 마음은 닿을 수 있어요.','이런 밤을 지나온 당신이 저는 대단해 보여요.','혼자인 시간도 언젠가 당신을 지켜 주는 시간이 될 거예요.','지금 느끼는 그 쓸쓸함, 적어 두면 조금 가벼워질 거예요.'],
    angry:['화가 난 건 당신이 소중한 걸 지키려 했다는 뜻일 수도 있어요.','그 순간 얼마나 열이 올랐을지 상상이 돼요.','속이 부글부글했겠어요. 여기선 마음껏 말해도 돼요.','참느라 애썼어요. 이제 조금 내려놔도 괜찮아요.','화를 느끼는 것과 화를 내는 건 달라요. 느끼는 건 자연스러워요.','깊게 숨 한 번 쉬고, 물 한 잔 마셔요.','억울한 마음, 제가 알아 줄게요.','그 사람이 어땠든 당신의 감정은 진짜예요.','오늘은 그 일을 곱씹지 말고, 좋아하는 걸 하나 해 봐요.','화가 가라앉을 때까지 기다려 줄게요. 서두르지 않아도 돼요.','이렇게 적어 내려간 것만으로도 화가 조금은 풀렸을지 몰라요.','당신이 이렇게까지 화가 난 데엔 이유가 있을 거예요.'],
    anxious:['생각이 꼬리에 꼬리를 무는 날이었군요.','걱정은 대비하려는 마음이기도 해요. 그래도 오늘은 잠깐 쉬어요.','지금 이 순간, 숨을 천천히 내쉬어 봐요.','해결하지 못한 채로도 오늘 밤은 잘 수 있어요.','걱정의 대부분은 생각보다 작게 끝나곤 해요.','오늘 할 수 있는 건 다 했어요. 나머지는 내일의 몫이에요.','불안한 마음을 적어 두면 머릿속 자리가 조금 생겨요.','지금 당장 답을 내지 않아도 괜찮아요.','떨리는 건 그만큼 중요한 일이라는 뜻이에요.','한 번에 하나씩만 생각해 봐요. 제가 옆에 있을게요.','긴장한 어깨를 한번 내려 볼까요? 후우, 하고요.','당신은 지금까지도 잘 헤쳐 왔어요.'],
    dessert:['맛있게 먹었다면 그걸로 충분해요.','가끔은 달콤함이 위로가 되어 주죠.','즐겁게 먹은 기억도 오늘의 좋은 순간이에요.','오늘은 그냥 맛있었던 날로 남겨 둬요.','먹은 걸 만회하려 하지 않아도 돼요. 내일은 평소처럼요.','한 끼가 당신의 노력을 지우지 않아요.','자신에게 준 작은 선물이었다고 생각해도 좋아요.','솔직하게 적어 준 게 더 멋져요.','맛있는 걸 먹으면 기분이 좋아지는 건 당연해요.','다음엔 뭐가 먹고 싶은지도 궁금해요.','물 한 잔이랑 같이 마무리하면 딱 좋겠어요.','이 정도는 하루의 작은 쉼표예요.'],
    joy:['오늘 정말 빛났겠어요!','그 기쁨, 여기까지 다 느껴져요.','이런 날의 기분은 오래 남았으면 좋겠어요.','열심히 한 만큼 돌아온 거예요.','작은 승리도 승리예요. 박수 보내요!','오늘의 나에게 칭찬 한마디 해 줘요.','기쁜 일을 나눠 주니 저도 신나요.','이 순간을 기억해 두었다가 힘든 날 꺼내 봐요.','웃음이 나는 하루라니, 참 좋아요.','정말 멋져요. 자랑스러워해도 돼요!','좋은 일이 좋은 일을 부르는 법이에요.','오늘은 마음껏 기뻐해도 되는 날이에요.'],
    chat:['오늘 뭐 했는지 더 얘기해 줘도 좋아요.','수다 떠는 시간, 저도 좋아해요.','아무 얘기나 편하게 해요. 듣고 있어요.','별거 없는 하루도 이야기하면 별거가 되죠.','오늘 하루 중 가장 기억에 남는 건 뭐였어요?','이런 소소한 얘기가 하루를 채워 주는 것 같아요.','잡담도 마음을 풀어 주는 좋은 방법이에요.','심심했다면 저랑 놀아요!','오늘의 이야기, 재미있게 들었어요.','언제든 놀러 와요. 문은 늘 열려 있어요.','시시콜콜한 얘기가 제일 정겹죠.','말 걸어 줘서 반가워요. 오늘 컨디션은 어때요?'],
    free:['그렇군요. 천천히 더 말해도 괜찮아요.','정리되지 않아도 돼요. 있는 그대로 적어도 좋아요.','들려줘서 고마워요. 여기서만 조용히 간직할게요.','말하고 나면 마음이 조금 가벼워지곤 해요.','당신의 이야기라면 언제든 들을게요.','굳이 결론을 내지 않아도 괜찮아요.','오늘의 마음을 그대로 두고 가요.','적는 동안 어떤 기분이었는지도 궁금해요.','이 노트는 당신만의 조용한 자리예요.','별말 아니어도 이렇게 와 줘서 좋아요.','마음이 복잡한 날엔 복잡한 대로 적어도 돼요.','한 줄이든 열 줄이든, 저는 다 소중하게 읽어요.'],
    qotd:['이 질문에 대한 당신의 답이 궁금했어요. 들려줘서 고마워요.','같은 질문도 날마다 답이 달라질 거예요. 그래서 기록이 재밌어요.','당신다운 대답이네요.','이런 생각을 하는 사람이구나, 하고 또 알게 됐어요.','오늘의 답은 나중에 좋은 추억이 될 거예요.','솔직하게 답해 줘서 좋아요.','한 줄이어도 마음이 담겨 있어요.','내일은 또 어떤 답이 나올지 기대돼요.']
  };
  Object.keys(MORE).forEach(function(k){ if(!CF_LINES[k]) return; MORE[k].forEach(function(x){ if(CF_LINES[k].indexOf(x)<0) CF_LINES[k].push(x); }); });

  /* 주제 사전: 글에서 이 단어가 보이면 그 얘기에 반응 (문자열=그대로 인용, [단어,표시]=표시 문구 사용) */
  var TOPICS=[
    {w:['엄마','아빠','어머니','아버지',['부모','부모님'],'가족','동생','언니','누나','오빠','남편','아내','할머니','할아버지','시댁'],
     neg:['가까운 사이라서 더 마음이 쓰일 때가 있죠.','가족 일은 마음에 더 오래 남곤 해요.','가까운 사람 일이라 더 무거웠겠어요.'],
     pos:['가까운 사람과 좋은 일이 있으면 하루가 더 따뜻해져요.','그런 순간이 있어서 든든하겠어요.']},
    {w:['친구','지인','단톡','모임','선배','후배'],
     neg:['사람 사이 일은 유독 마음이 쓰이죠.','관계에서 오는 마음은 혼자 정리하기 어려워요.'],
     pos:['좋은 사람이 곁에 있다는 건 든든한 일이에요.','그런 사람들이 있어서 다행이에요.']},
    {w:['남자친구','여자친구','남친','여친','애인','연애','썸',['이별','이별'],['헤어졌','이별'],['헤어지','이별']],
     neg:['마음 가는 사람 일은 유독 크게 느껴져요.','사랑 앞에서는 누구나 흔들려요. 이상한 게 아니에요.'],
     pos:['설레는 마음, 참 예뻐요.','그 마음이 오래 따뜻했으면 좋겠어요.']},
    {w:['회사','직장','상사','팀장','출근','퇴근','야근','알바','업무','동료','사수','거래처',['일이 많','일이 많았던 하루']],
     neg:['일터에서 애쓴 만큼, 오늘은 퇴근하고 푹 쉬어요.','일 생각은 잠깐 내려놓아도 괜찮아요.','열심히 하는 사람일수록 지치기 쉬워요.'],
     pos:['일에서 인정받은 기분이면 힘이 나죠.','애쓴 게 보람으로 돌아왔네요.']},
    {w:['시험','공부','과제','학교','수업','성적','학원','발표','리포트','수행평가',['교수','교수님'],'선생님'],
     neg:['해야 할 게 많으면 마음이 먼저 지쳐요.','완벽하지 않아도 여기까지 온 게 대단해요.','한 번에 하나씩만 해도 충분해요.'],
     pos:['해낸 만큼 자신감도 쌓였을 거예요.','애쓴 시간이 보상받은 느낌이겠어요.']},
    {w:['면접','취업','이직','진로','자격증','이력서','퇴사','승진'],
     neg:['앞날 고민은 누구에게나 무거워요.','답이 안 보이는 시기에도 당신은 앞으로 가고 있어요.'],
     pos:['좋은 방향으로 풀리고 있나 봐요.','그 노력이 길을 열어 줄 거예요.']},
    {w:['몸살','두통','감기','병원','컨디션',['피곤','피곤한 하루'],'배탈'],
     neg:['몸이 보내는 신호일지도 몰라요. 오늘은 무리하지 말아요.','아플 땐 아무것도 안 해도 괜찮아요.'],
     pos:['몸이 가벼우면 마음도 가벼워지죠.']},
    {w:[['못 잤','잠 못 잔 밤'],['못잤','잠 못 잔 밤'],['불면','잠 못 드는 밤'],['잠이 안','잠 못 드는 밤'],['새벽','새벽 시간'],'늦잠'],
     neg:['잠이 모자라면 마음도 더 예민해져요. 오늘은 일찍 쉬어 가요.','오늘 밤은 화면 끄고 천천히 눕는 걸 목표로 해요.'],
     pos:['푹 자고 나면 하루가 달라 보이죠.']},
    {w:['월급','카드값','대출','월세','지출','용돈','적금','돈'],
     neg:['돈 걱정은 마음까지 무겁게 하죠. 오늘은 한 가지만 생각해도 충분해요.','숫자 앞에서는 누구나 불안해져요.'],
     pos:['마음이 한결 놓이겠어요.','차근차근 쌓은 게 보이는 순간이네요.']},
    {w:['강아지','고양이',['반려','반려동물'],'댕댕','냥이'],
     neg:['작은 친구가 마음에 걸리면 더 애틋하죠.'],
     pos:['그 아이 덕분에 웃은 하루였을 것 같아요.','함께 있는 시간이 참 소중하죠.']},
    {w:['게임','운동','산책','요리','독서','영화','드라마','노래','그림','여행'],
     neg:['못 해서 마음에 걸렸다면, 그 마음이 이미 노력이에요.','쉬어 가는 날도 필요해요.'],
     pos:['좋아하는 걸 하는 시간은 참 소중해요.','그런 즐거움이 하루를 채워 주죠.']},
    {w:['날씨','장마',['더워','더운 날'],['추워','추운 날'],['비가','비 오는 날']],
     neg:['날씨가 마음에도 스며들 때가 있어요.'],
     pos:['날씨까지 도와주는 날이네요.']},
    {w:['다이어트','체중','몸무게','외모','뱃살','체형','여드름','피부',['거울','외모'],['살쪘','체중'],['살쪄','체중'],['살찌','체중'],['살이 쪘','체중'],['살 빠','체중']],
     neg:['몸이나 외모에 대한 생각은 유독 오래 마음에 남곤 해요.','거울 속 모습으로 오늘의 나를 판단하지 않아도 돼요.','몸은 오늘도 당신을 데리고 하루를 살아 냈어요.','숫자나 모습보다 당신이 훨씬 커요.'],
     pos:['듣기 좋은 말을 들은 날은 마음도 한결 가벼워지죠.','내 모습이 마음에 든 날, 그 기분 오래 간직해요.','몸과 마음이 편안한 날이네요.']},
    {w:['화해','용서','서먹','냉전',['미안','미안한 마음'],['사과했','사과'],['사과하','사과'],['사과받','사과'],['사과해','사과'],['사과할','사과']],
     neg:['미안한 마음이든 서운한 마음이든, 관계가 걸린 일은 무겁죠.','먼저 말을 꺼내기가 제일 어렵죠.','풀고 싶은 마음이 있다는 것만으로도 이미 애쓰고 있는 거예요.','화해는 서두르지 않아도 돼요. 마음이 정리될 시간이 필요해요.'],
     pos:['마음이 풀려서 다행이에요.','먼저 손을 내밀다니, 쉬운 일이 아닌데 용기 있었어요.','관계가 다시 따뜻해지면 하루가 달라지죠.']},
    {w:['후회','미련',['그때 왜','후회'],['할 걸','후회'],['했어야','후회'],['그러지 말','후회'],['아쉬','아쉬운 마음'],['돌이키','후회'],['되돌리','후회']],
     neg:['그때는 그게 최선이었을 거예요. 지금의 눈으로 보면 달라 보일 뿐이에요.','후회가 남는다는 건 그만큼 진심이었다는 뜻이기도 해요.','지난 일을 되감아 보느라 마음이 무거웠겠어요.','되돌릴 순 없어도, 오늘의 나는 다르게 고를 수 있어요.'],
     pos:['돌아볼 수 있다는 건 그만큼 자랐다는 뜻이에요.','지난 일이 이제는 편해졌나 봐요. 다행이에요.']}
  ];
  var REF={
    neg:['{x}, 마음에 계속 남았나 봐요.','{x}, 꽤 무거웠겠어요.','{x}, 혼자 안고 있었죠. 들려줘서 고마워요.','{x}, 그럴 만해요.'],
    pos:['{x}, 듣기만 해도 기분이 좋아져요!','{x}, 반가운 소식이네요.','{x}, 그 순간이 눈에 그려져요.'],
    neu:['{x}, 잘 들었어요.','{x}, 오늘 마음에 남았군요.','{x}, 조금 더 들려줘도 좋아요.']
  };
  var ACK=['꾹꾹 눌러 쓴 글, 끝까지 다 읽었어요.','길게 적어 준 만큼 마음이 담겨 있네요.','이만큼 털어놓는 것도 쉽지 않았을 텐데, 다 읽었어요.'];
  var NEG_RE=/힘들|지쳐|지쳤|우울|슬퍼|슬프|속상|짜증|화나|화가|불안|걱정|외로|싫|억울|피곤|괴롭|지겹|답답|막막|서러|눈물|울었|무서|스트레스|후회|여전히|아직도/;
  var POS_RE=/좋았|좋아서|기뻐|기쁘|행복|뿌듯|재밌|재미있|즐거|웃었|감사|고마|설레|다행|해냈|성공|합격|축하|나아졌|괜찮아졌|풀렸|편해졌|해결/;

  function pk(arr,key){ return LQD.pick('lowena.cf.'+key,arr,{who:'lowena'}); }
  /* "재밌는 얘기 해줄래요?"처럼 로웨나에게 부탁하는 말은 기쁜 소식이 아니라서 축하하지 않는다 */
  var REQ_RE=/(해|들려|알려|말해|읽어|골라|추천해)\s*(줄래|줄\s*수|주세요|주실|주라|줘(?!서)|줄까|봐(?!서))/;
  function tone(k,t){ if(k==='dessert'||k==='hungry'||k==='tired'||k==='crave') return 'neu'; if(k==='sad'||k==='lonely'||k==='angry'||k==='anxious') return 'neg'; if(k==='joy') return 'pos'; if(REQ_RE.test(t)&&!NEG_RE.test(cfStripNeg(t))) return 'neu'; var st=cfStripNeg(t), n=NEG_RE.test(st)||CF_NEG2.test(t)||CF_NEG3.test(st), p=POS_RE.test(st); return (n&&!p)?'neg':(p&&!n)?'pos':(n&&p)?'neg':'neu'; }
  function topic(t){ var s=cfStripNeg(t).replace(/돈까스|돈가스/g,''), best=null;
    TOPICS.forEach(function(tp,ti){ tp.w.forEach(function(e){ var w=Array.isArray(e)?e[0]:e, i=s.indexOf(w); if(i<0) return;
      var pv=s.charAt(i-1), nx=s.charAt(i+w.length);
      if(w==='돈'&&(/[가-힣]/.test(pv)||/[까가독]/.test(nx))) return;
      if(w==='그림'&&nx==='자') return; if(w==='썸'&&/[머네]/.test(nx)) return;
      if(!best||i<best.i||(i===best.i&&w.length>best.w.length)) best={tp:tp,ti:ti,i:i,w:w,d:Array.isArray(e)?e[1]:null}; }); });
    return best; }
  function timeLine(tn){ var d=kstNow(), h=d.getUTCHours(), dow=d.getUTCDay(), m=d.getUTCMonth();
    if(h<5) return tn==='pos'?'이 시간에도 기분이 좋다니, 좋은 밤이에요.':pk(['이 시간까지 깨어 있었군요. 적어 두었으니 이제 눈 붙여 봐요.','늦은 밤엔 마음이 더 크게 느껴지기도 해요. 오늘은 여기 내려놓고 자요.'],'tm_night');
    if(h<9) return '아침부터 얘기해 줘서 고마워요. 오늘은 조금 가볍게 시작해요.';
    if(dow===1&&tn==='neg') return '월요일이라 더 무거웠을지도 몰라요. 한 주는 아직 길어요, 천천히 가요.';
    if(dow===5&&tn==='pos') return '금요일이라 더 신나죠! 주말이 코앞이에요.';
    if(dow===5&&tn==='neg') return '한 주 버티느라 애썼어요. 주말엔 푹 쉬어요.';
    if((dow===0||dow===6)&&tn==='neg') return '쉬는 날인데도 마음이 편치 않았나 봐요. 오늘은 좀 쉬어요.';
    if(tn==='neg'&&(m===11||m<=1)) return '추운 계절엔 마음도 시릴 때가 있어요. 따뜻하게 지내요.';
    if(tn==='neg'&&m>=6&&m<=7) return '더운 날씨에 더 지치기도 해요. 시원한 물 한 잔 마셔요.';
    return ''; }

  /* ===== 2번: 답장 끝 되묻기 + 며칠 뒤 후속 질문 ===== */
  var FQ={
    neg:['지금 마음은 어느 정도예요? 한 줄만 더 들려줘요.','그 얘기 중에서 제일 마음에 걸린 게 뭐예요?','오늘 하루 중 그나마 괜찮았던 순간이 있었어요?','지금 제일 필요한 건 뭘까요? 쉬는 시간, 위로, 아니면 그냥 들어 주는 것?','오늘 밤 스스로에게 해 주고 싶은 말이 있다면요?'],
    pos:['그 순간, 제일 좋았던 장면이 뭐였어요?','그 소식, 제일 먼저 누구에게 말하고 싶어요?','오늘의 나에게 칭찬 한마디 해 준다면요?'],
    neu:['오늘 하루 어땠는지 한 줄만 더 들려줄래요?','지금 기분을 색깔로 말하면 무슨 색이에요?','오늘 제일 기억에 남는 건 뭐예요?']
  };
  var FU_ACK={
    pos:['그렇게 나아졌다니 제가 다 안심이에요.','좋아졌다니 다행이에요. 잘 견뎠어요.'],
    neg:['아직 마음이 무겁군요. 얘기해 줘서 고마워요.','여전히 힘들 수 있죠. 서두르지 않아도 돼요.'],
    neu:['그 뒤 얘기, 들려줘서 고마워요.','궁금했는데 알려 줘서 고마워요.']
  };
  var FU_KIND={sad:'속상했던 얘기',lonely:'외롭다던 얘기',angry:'화났던 얘기',anxious:'걱정되던 얘기'};
  

  window.cfTone=tone; window.cfPk=pk; window.cfPickQuote=pickQuote; window.cfTopicOf=function(t){ var tp=topic(String(t||'')); return tp?tp.ti:-1; };
  window.cfMeta=function(k,t){ var tn=tone(k,t), tp=topic(t); return {tn:tn, tw: tp?(tp.d?tp.d:tp.w):'', ti: tp?tp.ti:-1}; };
  var TQ=[
    {neg:['그 일에서 제일 마음에 걸리는 사람은 누구예요?','가까운 사람이라 더 말하기 어려웠던 건 뭐예요?'],pos:['그 사람과 있었던 일 중 제일 따뜻했던 장면은요?']},
    {neg:['그 사람에게 정말 하고 싶었던 말이 있다면 뭐예요?','그 일에서 제일 서운했던 순간은 언제였어요?'],pos:['그 사람에게 고맙다고 말해 본 적 있어요?']},
    {neg:['지금 그 사람에게 바라는 게 있다면 뭐예요?','마음이 제일 흔들렸던 순간은 언제였어요?'],pos:['그 순간 어떤 기분이었는지 한 줄만 더 들려줄래요?']},
    {neg:['그 일 중에서 내일 하나만 덜어낼 수 있다면 뭘까요?','오늘 일하면서 그래도 괜찮았던 순간이 있었어요?'],pos:['그 성과, 제일 먼저 누구에게 말하고 싶어요?']},
    {neg:['지금 제일 먼저 손대야 할 건 뭐예요? 하나만요.','오늘 해낸 것 중에 작은 거라도 있다면요?'],pos:['그 결과를 위해 제일 애썼던 부분은 뭐였어요?']},
    {neg:['지금 가장 확실하게 알고 있는 건 뭐예요? 하나만요.','그 고민에서 제일 두려운 건 뭐예요?'],pos:['이 흐름이 이어지면 어떤 모습이 되고 싶어요?']},
    {neg:['몸이 지금 제일 바라는 게 뭘까요? 쉬기, 먹기, 자기?','오늘은 무리하지 않으려면 뭘 내려놓을 수 있을까요?'],pos:['몸이 가벼운 날엔 뭘 하고 싶어져요?']},
    {neg:['잠이 안 올 때 그나마 도움이 됐던 게 있어요?','오늘 밤은 어떻게 하면 조금 편하게 누울 수 있을까요?'],pos:['푹 잔 날엔 하루가 어떻게 달라져요?']},
    {neg:['그 걱정 중에서 오늘 당장 할 수 있는 건 뭐예요? 하나만요.','제일 마음에 걸리는 숫자가 뭐예요?'],pos:['그 안도감, 뭐가 제일 컸어요?']},
    {neg:['그 아이는 지금 어때요?'],pos:['그 아이가 오늘 뭘 했어요? 들려줘요!']},
    {neg:['다시 하고 싶은 마음은 남아 있어요?'],pos:['그걸 할 때 제일 좋은 순간이 언제예요?']},
    {neg:['이런 날 몸과 마음을 달래 주는 게 있어요?'],pos:['이런 날엔 뭘 하고 싶어요?']},
    {neg:['오늘 내 몸이 해 준 일 중에 고마운 게 하나 있다면요?','그 말, 가까운 친구가 나에게 했다면 어떤 기분일까요?'],pos:['그 말을 들었을 때 어떤 기분이었어요?']},
    {neg:['지금 하고 싶은 말이 있다면 한 줄로 쓰면요?','그 일에서 제일 마음에 걸리는 장면은 어디예요?'],pos:['그 말을 하고 나서 마음이 어땠어요?']},
    {neg:['그때의 나에게 한마디 해 준다면요?','지금 할 수 있는 작은 일이 하나 있다면 뭘까요?'],pos:['그 경험에서 배운 게 있다면 뭐예요?']}
  ];
  var FQ_KIND={
    sad:['오늘 마음이 제일 가라앉은 순간이 언제였어요?','지금 스스로에게 뭐라고 말해 주고 싶어요?'],
    lonely:['요즘 안부를 묻고 싶은 사람이 있어요?','지금 곁에 있으면 좋을 게 뭘까요? 사람, 음악, 따뜻한 것?'],
    angry:['그 일에서 제일 억울했던 부분이 뭐예요?','지금 화를 조금 내려놓을 수 있다면 뭐가 도움이 될까요?'],
    anxious:['지금 제일 걱정되는 걸 한 문장으로 쓰면요?','그 걱정 중에서 지금 내 손으로 할 수 있는 건 어느 쪽이에요?'],
    joy:['그 순간 몸으로는 어떤 느낌이었어요? 웃음이 났어요, 가슴이 뛰었어요?']
  };
  window.cfFollowQ=function(k,meta){ if(k==='dessert'||k==='hungry'||k==='crave') return ''; if(Math.random()>(meta.tn==='neg'?.7:.5)) return '';
    var sp=[], ti=meta.ti;
    if(ti!=null&&ti>=0&&TQ[ti]){ var a=TQ[ti][meta.tn==='neg'?'neg':meta.tn==='pos'?'pos':'']; if(a) sp=sp.concat(a); }
    if(FQ_KIND[k]) sp=sp.concat(FQ_KIND[k]);
    if(sp.length&&Math.random()<.8) return pk(sp,'fqs_'+k+'_'+ti);
    return pk(FQ[meta.tn],'fq_'+meta.tn); };
  window.cfFqBox=function(id){ return '<textarea id="cfFa" class="cf-ta" rows="3" placeholder="답하고 싶으면 적어 줘요. 건너뛰어도 괜찮아요." style="margin-top:10px"></textarea><button class="cfb" style="width:100%;margin-top:6px" onclick="cfFollow(\''+id+'\')">답하기</button>'; };
  var endBtns='<div style="display:flex;gap:6px;margin-top:12px"><button class="cfb" style="flex:1" onclick="openConfessLog()">고해 노트 보기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>';
  var bubble=function(txt){ return '<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(txt)+'</div></div>'; };

  /* 같은 자리에서 답하기: 한 번 더 받아 주기 */
  window.cfFollow=function(id){
    var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e||e.fa) return;
    var ta=document.getElementById('cfFa'), a=((ta&&ta.value)||'').trim(); if(!a){ toast('한 줄만 적어 주세요'); return; }
    var r=cfReplyFor(cfKind(a,''),a,1);
    e.fa=a; e.fr=r; save();
    cfShowTyped(bubble(r)+endBtns);
  };

  /* 며칠 뒤 후속 질문 카드 (홈) */
  function fuList(){ var t0=Date.parse(todayStr());
    return (S.confess||[]).filter(function(e){
      if(e.fu||e.k==='hug'||e.k==='mood'||e.k==='qotd') return false;
      var g=(t0-Date.parse(e.d))/864e5; if(!(g>=2&&g<=7)) return false;
      return e.tn==='neg'||!!FU_KIND[e.k]; }); }
  function fuText(e){
    var x=e.tw?String(e.tw).replace(/[“”]/g,'')+' 얘기':(FU_KIND[e.k]||'힘들었다던 얘기');
    var T=['지난번에 '+x+' 들려줬었죠. 그 뒤로 좀 어때요?','며칠 전 '+x+', 계속 마음에 걸렸어요. 요즘은 어때요?',x+', 그 뒤로 조금은 나아졌나요?'];
    return T[(e.ts||0)%3]; }
  function fuPick(){ if(S.cfFuDone===todayStr()) return null; var L=fuList(); if(!L.length) return null; return L[dateHashDay()%L.length]; }
  window.cfFuCard=function(){ try{ var e=fuPick(); if(!e) return '';
    return '<div class="cf-fu" onclick="cfFuOpen(\''+e.id+'\')">💬 로웨나: '+esc(fuText(e))+'</div>'; }catch(err){ return ''; } };
  window.cfFuOpen=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e) return;
    var snip=(e.text||'').length>40?e.text.slice(0,40)+'…':(e.text||'');
    showModal(bubble(fuText(e))+'<div style="font-size:12px;color:var(--ink-soft);font-style:italic;margin-top:8px">'+esc(e.d)+' · “'+esc(snip)+'”</div>'
      +'<textarea id="cfFuTa" class="cf-ta" rows="4" placeholder="지금은 어때요? 한 줄만 적어도 돼요." style="margin-top:10px"></textarea>'
      +'<div style="display:flex;gap:6px;margin-top:8px"><button class="cfb" style="flex:1" onclick="cfFuAnswer(\''+id+'\')">들려줄게요</button><button class="cfb" style="flex:1" onclick="cfFuSkip(\''+id+'\')">건너뛸게요</button></div>'); };
  window.cfFuAnswer=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e||e.fu) return;
    var ta=document.getElementById('cfFuTa'), a=((ta&&ta.value)||'').trim(); if(!a){ toast('한 줄만 적어 주세요'); return; }
    var kk=cfKind(a,''), r;
    { var tn=tone(kk,a); r=pk(FU_ACK[tn],'fu_'+tn)+'\n'+cfReplyFor(kk,a,2); }
    e.fu=Date.now(); e.fua=a; e.fur=r; S.cfFuDone=todayStr(); save();
    cfShowTyped(bubble(r)+endBtns); };
  window.cfFuSkip=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(e){ e.fu='skip'; } S.cfFuDone=todayStr(); save(); closeModal(); };
  window.cfFuLog=function(e){ var h='';
    if(e.fq) h+='<div class="r" style="white-space:pre-line">로웨나: '+esc(e.fq)+'</div>';
    if(e.fa) h+='<div class="t">↳ '+esc(e.fa)+'</div><div class="r" style="white-space:pre-line">로웨나: '+esc(e.fr||'')+'</div>';
    if(e.fu&&e.fu!=='skip'&&e.fua) h+='<div class="m" style="margin-top:6px">며칠 뒤 · 후속 대화</div><div class="t">↳ '+esc(e.fua)+'</div><div class="r" style="white-space:pre-line">로웨나: '+esc(e.fur||'')+'</div>';
    return h; };

  /* --- B) 내 말 되받기 · 반복 주제 기억 --- */
  var TNAME=['가족','사람 관계','연애','직장 일','공부','진로','몸 컨디션','잠','돈','반려동물','취미','날씨','외모·체중','사과·화해','후회'];
  var RFL={
    neg:['“{q}” — 이 말이 마음에 남았어요.','“{q}”라고 적어 줬죠. 그렇게 느꼈군요.','“{q}”, 이 부분을 오래 읽었어요.'],
    pos:['“{q}” — 읽는 저도 기분이 좋아졌어요.','“{q}”, 이 부분이 참 좋아요.'],
    neu:['“{q}” — 이 부분이 기억에 남아요.','“{q}”라고 했죠. 잘 읽었어요.']
  };
  var MEM={
    neg:['이번 달에만 {x} 얘기가 벌써 {n}번째예요. 계속 마음에 걸리는 일인가 봐요.','{x} 얘기가 이번 달에 {n}번째 나왔어요. 혼자 오래 안고 있지 않았으면 해요.'],
    pos:['이번 달 {x} 얘기가 벌써 {n}번째예요. 좋은 흐름이 이어지나 봐요.'],
    neu:['이번 달에 {x} 얘기가 {n}번째 나왔어요. 요즘 자주 마음에 머무는 주제네요.']
  };
  function pickQuote(t){
    var cl=String(t||'').split(/[.!?\n~…]+/).map(function(x){ return x.replace(/[“”"'‘’]/g,'').trim(); }).filter(function(x){ return x.length>=6; });
    var best=null,bs=0;
    cl.forEach(function(c){ if(c.length>30) return;
      var st=cfStripNeg(c), sc=0; if(NEG_RE.test(st)||POS_RE.test(st)||CF_NEG3.test(st)) sc+=2; if(topic(c)) sc+=1; if(c.length>=8&&c.length<=24) sc+=1;
      if(sc>bs){ bs=sc; best=c; } });
    return bs>=2?best:null; }
  function entTi(e){ if(e.ti!=null) return e.ti; if(!e.text) return -1; var tp=topic(e.text); return tp?tp.ti:-1; }
  function topicMemory(tp,tn){
    if(!tp) return ''; try{
      var t0=Date.parse(todayStr()), N=S.cfTopicNote=S.cfTopicNote||{}, key='t'+tp.ti;
      if(N[key]&&(t0-Date.parse(N[key]))<7*864e5) return '';
      var n=(S.confess||[]).filter(function(e){ if(e.k==='hug'||e.k==='mood'||e.k==='qotd') return false;
        var g=t0-Date.parse(e.d); return g>=0&&g<30*864e5&&entTi(e)===tp.ti; }).length;
      if(n<2) return '';
      N[key]=todayStr();
      return pk(MEM[tn],'mem_'+tn).replace('{x}',TNAME[tp.ti]||'이').replace('{n}',n+1);
    }catch(e){ return ''; } }

  window.cfReplyFor=function(k,t,short){
    try{
      t=String(t||''); var tn=tone(k,t), tp=topic(t), long=t.length>=70, base=cfReply(k), first='', mem='', tl='', useBase=true, ack='';
      var q=(!short&&t.length>=14)?pickQuote(t):null, refl=false;
      if(q&&Math.random()<.75){ first=pk(RFL[tn],'rfl_'+tn).replace('{q}',q); refl=true; }
      if(tp){
        var x=(tp.d||tp.w)+' 얘기';
        if(!refl) first=pk(REF[tn],'rf_'+tn).replace('{x}',x);
        var pool=tp.tp[tn==='neg'?'neg':tn==='pos'?'pos':'none'], tls=pool&&pool.length?pk(pool,'tl_'+tp.ti+tn):'';
        var useTL=!!tls&&(long||Math.random()<.6);
        if(useTL) tl=tls;
        useBase=!useTL||long;
      } else if(long&&!short&&!refl){ ack=pk(ACK,'ack'); }
      if(!short) mem=topicMemory(tp,tn);
      var parts=[]; if(first) parts.push(first); if(ack) parts.push(ack); if(mem) parts.push(mem); if(tl) parts.push(tl); if(useBase) parts.push(base);
      var max=long?4:3; while(parts.length>max) parts.splice(parts.length-1,1);
      if(!short&&parts.length<3&&Math.random()<.4){ var tm=timeLine(tn); if(tm) parts.push(tm); }
      if(short) parts=short===2?[parts[0]]:parts.slice(0,2);
      return parts.join('\n');
    }catch(e){ return cfReply(k); }
  };

  /* ---------- 3차: 감정 칩 추가 · 타이핑 답장 · 밀담실 전용 화면 · 마티 축하/업적 · 힘든 날 보상 ---------- */
  /* --- 5) 감정 칩: 배고파요 / 피곤해요 / 디저트 먹고 싶어요 --- */
  CF_KIND.hungry='배고픔'; CF_KIND.tired='피곤함'; CF_KIND.crave='디저트 땡김';
  CF_LABEL.hungry='배고파요'; CF_LABEL.tired='피곤해요'; CF_LABEL.crave='디저트 먹고 싶어요';
  var di=CF_CHIP_KEYS.indexOf('dessert'); CF_CHIP_KEYS.splice(di<0?CF_CHIP_KEYS.length:di,0,'hungry','tired','crave');
  CF_LINES.hungry=['배고픈 건 몸이 보내는 아주 정직한 신호예요. 든든히 챙겨 먹어요.','먼저 뭐든 먹고 오세요. 얘기는 그다음에 들어도 돼요.','배가 고프면 마음도 예민해져요. 맛있는 걸로 채워 줘요.','따뜻한 국물이나 밥 한 공기, 오늘은 그런 게 필요할지도 몰라요.','먹는 걸 미루지 않아도 돼요. 오늘의 나를 챙기는 게 먼저예요.','허기를 참지 않아도 괜찮아요. 천천히 맛있게 먹어요.','배고픔도 소중한 몸의 목소리예요. 잘 들어 줘요.','뭐가 제일 당겨요? 그걸 먹어도 좋아요.','든든히 먹고 나면 기분도 한결 나아질 거예요.','물 한 잔 마시고, 좋아하는 걸로 한 끼 챙겨요.'];
  CF_LINES.tired=['오늘은 많이 지쳤군요. 조금 쉬어도 괜찮아요.','피곤한 날엔 쉬는 것도 하루의 일이에요.','해야 할 일은 잠깐 내려놓고 눈을 붙여 봐요.','몸이 쉬고 싶다고 말하는 거예요. 들어 줘요.','오늘은 최소한만 하고 일찍 쉬어요. 그래도 충분해요.','따뜻한 물 한 잔 마시고 천천히 숨을 쉬어 봐요.','애쓴 하루였나 봐요. 수고했어요.','잠깐이라도 누워 있으면 조금은 나아질 거예요.','피곤할 땐 완벽하지 않아도 돼요.','오늘 밤은 일찍 이불 속으로 들어가요.'];
  CF_LINES.crave=['먹고 싶은 마음, 참 자연스러워요.','달콤한 게 당기는 날도 있죠. 이상한 게 아니에요.','뭐가 제일 먹고 싶어요? 떠올리기만 해도 기분이 좋아지죠.','먹고 싶은 게 있다는 건 오늘의 나를 챙기고 싶다는 뜻일지도 몰라요.','좋아하는 디저트 하나 골라 먹어도 괜찮아요. 오늘의 작은 선물로요.','당기는 마음을 억지로 누르지 않아도 돼요.','맛있게 먹고 나면 기분이 조금은 달라질 거예요.','천천히 음미하면서 먹으면 더 행복해요.','디저트 얘기만 해도 벌써 기분이 좋아지네요.','오늘은 먹고 싶은 걸 소중하게 대해 줘요.'];

  /* --- 3) 답장이 한 글자씩 타이핑되듯 --- */
  window.cfTypeIn=function(){ try{
    var b=document.querySelector('#modalBox .speech-bubble'); if(!b||b.__typing) return;
    var full=b.textContent; if(!full) return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    /* 2~3문장씩 쪽으로 나눠 한 쪽씩 타이핑 (bubbles.js 의 LQB.split). 마지막 쪽이 끝나야 아래 버튼들이 보여요 */
    var pages=(window.LQB&&LQB.split(full))||[full], pi=0, box=document.getElementById('modalBox'), row=b;
    while(row.parentNode&&row.parentNode!==box) row=row.parentNode;
    if(pages.length>1&&row.parentNode===box){ row.classList.add('bp-row'); box.classList.add('bp-wait'); }
    var longest=pages.reduce(function(a,c){ return c.length>a.length?c:a; },''); b.textContent=longest; b.style.minHeight=b.offsetHeight+'px';
    b.textContent=''; b.__typing=1; b.__bpOwn=1; b.__typedOnce=1; b.style.cursor='pointer';
    var ch, i, done, fast, tok=0;
    function last(){ return pi>=pages.length-1; }
    function fin(){ if(done) return; done=true; b.textContent=pages[pi];
      if(!last()){ var m=document.createElement('span'); m.className='bp-more'; m.textContent='▼'; b.appendChild(m); }
      else { b.__typing=0; b.style.cursor=''; box.classList.remove('bp-wait'); } }
    function page(){ ch=Array.from(pages[pi]); i=0; done=false; fast=ch.length>140; b.textContent=''; var my=++tok; setTimeout(function(){ step(my); },pi?120:260); }
    b.addEventListener('click',function(){ if(!done) fin(); else if(!last()){ pi++; page(); } });
    function step(my){ if(done||my!==tok) return; if(!b.isConnected){ done=true; return; }
      var c=ch[i++]; b.textContent+=c; if(i>=ch.length){ fin(); return; }
      setTimeout(function(){ step(my); }, /[.!?…~]/.test(c)?(fast?110:190):c==='\n'?(fast?150:260):/[,]/.test(c)?(fast?60:110):(fast?22:38)); }
    page();
  }catch(e){ LQ.err(e); } };
  window.cfShowTyped=function(h){ showModal(h); cfTypeIn(); };

  /* --- 4) 밀담실 전용 화면: 촛불 · 낮은 배경음 · 표정 변화 --- */
  
  var FACE_HI={greet:'어서 와요. 여긴 우리 둘뿐이에요.\n하고 싶은 이야기를 편하게 적어 줘요.',proud:'듣고 있어요. 천천히 적어요.',sad:'괜찮아요. 천천히, 조용히 기다릴게요.',angry:'속에 있는 거, 여기다 다 내려놓아요.',worry2:'숨을 천천히 쉬면서 적어 봐요.',worry:'많이 지쳐 보여요. 편하게 적어요.',smile:'좋은 일이에요? 어서 들려줘요!',laugh:'수다 좋죠! 아무 얘기나 편하게 들려줘요.',listen:'응, 듣고 있어요.\n하고 싶은 말, 천천히 다 해도 돼요.',proud2:'듣고 있어요. 천천히 적어요.'};
  /* 표정은 그대로 두고, 먹는 것과 관련된 칩은 문구만 따로 (다이어트 중인 마음에 맞게) */
  var KIND_HI={crave:'당기는 마음, 여기선 솔직해도 괜찮아요.\n뭐가 먹고 싶은지 편하게 적어 줘요.',dessert:'먹었어도 괜찮아요. 여기선 벌점 없어요.\n오늘 어땠는지 편하게 적어 줘요.',hungry:'배고픔은 몸이 보내는 신호예요.\n어떤 하루였는지 편하게 적어 줘요.'};
  function kindFace(k,tn){ var m={sad:'sad',lonely:'sad',angry:'angry',anxious:'worry2',joy:'smile',dessert:'proud2',crave:'proud2',hungry:'proud2',tired:'worry',chat:'laugh',free:'listen'}; return m[k]||(tn==='neg'?'worry':tn==='pos'?'smile':'proud'); }
  window.cfRoomFace=function(f,k){ var im=document.getElementById('cfFaceImg'); if(!im) return;
    var h=document.getElementById('cfHi'); var tx=(k&&KIND_HI[k])||FACE_HI[f]; if(h&&tx) h.textContent=tx;
    if(im.dataset.f===f) return; im.dataset.f=f; im.style.opacity=0;
    setTimeout(function(){ im.src=LW_CROP[f]||LW_CROP.greet; im.style.opacity=1; },180); };
  window.cfRoomTune=function(){ var ta=document.getElementById('cfText'); if(!ta) return; var t=ta.value.trim();
    var bb=document.getElementById('cfBreathBtn'); if(!t&&!_cfChip){ cfRoomFace('greet'); if(bb) bb.classList.remove('cf-pulse'); return; } var k=cfKind(t,_cfChip); cfRoomFace(kindFace(k,cfTone(k,t)),k); if(bb) bb.classList.toggle('cf-pulse',k==='anxious'); };
  var _tt=null; window.cfRoomTuneDeb=function(){ clearTimeout(_tt); _tt=setTimeout(cfRoomTune,350); };
  window.cfPick=function(k){ _cfChip=(_cfChip===k)?'':k; document.querySelectorAll('#cfChips .cfb').forEach(function(e){ e.classList.toggle('on',e.dataset.k===_cfChip); }); if(_cfChip){ var c=g('cfChips'); if(c) c.style.display='none'; } cfMoodLabel(); cfRoomTune(); };
  window.cfMoodLabel=function(){ var b=g('cfMoodBtn'); if(!b) return; var c=g('cfChips'), open=c&&c.style.display!=='none'; b.textContent=(_cfChip?(CF_LABEL[_cfChip]||CF_KIND[_cfChip]||'')+' ✓':'지금 마음은?')+(open?' ▴':' ▾'); };
  window.cfMoodToggle=function(){ var c=g('cfChips'); if(!c) return; c.style.display=(c.style.display==='none')?'flex':'none'; cfMoodLabel(); };
  window.cfMoreToggle=function(){ var c=g('cfMore'), b=g('cfMoreBtn'); if(!c) return; var o=c.style.display==='none'; c.style.display=o?'flex':'none'; if(b) b.textContent='🕯️ 더보기 '+(o?'▴':'▾'); };
  window.cfRoomAfterSend=function(k){ var r=document.getElementById('cfRoom'); if(!r) return;
    var ta=document.getElementById('cfText'); if(ta) ta.value=''; _cfChip='';
    document.querySelectorAll('#cfChips .cfb').forEach(function(e){ e.classList.remove('on'); });
    try{ cfMoodLabel(); }catch(e){ LQ.err(e); } cfRoomFace(kindFace(k,'neu'),k); };

  /* 낮은 배경음: 켜져 있는 배경음악은 작게, 장작 타는 소리를 아주 조용히 */
  var amb=null;
  function ambStart(){ try{ window._roomOn=true; if(!initAudio()) return; applyVol(); stopBgm();
    if(!bgmOn()||amb) return;
    var n=actx.sampleRate*2, buf=actx.createBuffer(1,n,actx.sampleRate), d=buf.getChannelData(0), last=0;
    for(var i=0;i<n;i++){ var w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.5; }
    var src=actx.createBufferSource(); src.buffer=buf; src.loop=true;
    var lp=actx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=380;
    var g=actx.createGain(); g.gain.value=0; g.gain.setTargetAtTime(.10,actx.currentTime,.8);
    src.connect(lp); lp.connect(g); g.connect(master); src.start();
    amb={src:src,g:g,t:null};
  }catch(e){ LQ.err(e); } }
  function ambStop(){ try{ window._roomOn=false; if(actx){ applyVol(); if(bgmOn()) startBgm(); }
    if(!amb) return; var a=amb; amb=null; clearTimeout(a.t);
    a.g.gain.setTargetAtTime(0,actx.currentTime,.25); setTimeout(function(){ try{ a.src.stop(); }catch(e){ LQ.err(e); } },1200);
  }catch(e){ LQ.err(e); } }

  window.openConfess=function(){ _cfChip=''; _burn=false; _burning=false; cfVisit();
    var mo=document.getElementById('modalOverlay'); if(mo) mo.classList.remove('show');
    var r=document.getElementById('cfRoom'); if(!r){ r=document.createElement('div'); r.id='cfRoom'; r.className='cf-room'; document.body.appendChild(r); }
    var chips=CF_CHIP_KEYS.map(function(k){ return '<button class="cfb" data-k="'+k+'" onclick="cfPick(\''+k+'\')">'+(CF_LABEL[k]||CF_KIND[k])+'</button>'; }).join('');
    r.innerHTML='<div class="cf-glow"></div>'+cfCandlesHtml()+''
      +'<button class="cf-x" onclick="cfRoomClose()">나가기</button>'
      +'<div class="cf-inner"><div class="cf-face"><img id="cfFaceImg" data-f="greet" src="'+LW_CROP.greet+'" alt=""></div>'
      +'<div class="cf-hi" id="cfHi">'+esc(FACE_HI.greet)+'</div>'
      +'<div class="cf-tools" id="cfTop" style="flex-wrap:nowrap;width:100%"><button class="cfb" id="cfMoodBtn" onclick="cfMoodToggle()">지금 마음은? ▾</button><button class="cfb" id="cfMoreBtn" onclick="cfMoreToggle()">🕯️ 더보기 ▾</button></div>'
      +'<div style="display:none;flex-wrap:wrap;gap:6px;justify-content:center" id="cfChips">'+chips+'</div>'
      +'<div class="cf-tools" id="cfMore" style="display:none"><button class="cfb" id="cfBurnBtn" onclick="cfBurnToggle()">🔥 쓰고 태우기</button><button class="cfb" id="cfBreathBtn" onclick="cfBreathe()">🌬️ 숨 고르기</button><button class="cfb" onclick="cfSit()">🕯️ 말없이 곁에</button></div>'
      +'<textarea id="cfText" class="cf-ta" rows="6" placeholder="한 줄만 써도 돼요." oninput="cfRoomTuneDeb()"></textarea>'
      +'<button class="cfb" id="cfSendBtn" style="width:100%" onclick="cfSend()">전할게요</button>'
      +'<button class="cfb" style="width:100%" onclick="openConfessLog()">고해 노트 보기</button></div>';
    r.classList.add('show'); document.body.classList.add('cf-room-on'); ambStart(); };
  window.cfRoomClose=function(){ try{ cfSitStop(true); }catch(e){ LQ.err(e); } try{ cfBreathStop(); }catch(e){ LQ.err(e); } _burn=false; _burning=false; document.querySelectorAll('.cf-fire,.cf-embers').forEach(function(e){ e.remove(); }); var r=document.getElementById('cfRoom'); if(r){ r.classList.remove('show'); r.innerHTML=''; }
    document.body.classList.remove('cf-room-on','cf-cele'); _cfChip=''; ambStop(); };

  /* ===== C) 밀담실 연출: 촛불 · 쓰고 태우기 · 숨 고르기 · 말없이 곁에 ===== */
  CF_KIND.sit='곁에 있기';
  
  var g=function(id){ return document.getElementById(id); };
  var _burn=false, _burning=false, _br=null, _sit=null;
  var reduced=function(){ return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches); };

  /* --- 촛불: 이번 주 찾아온 날 수만큼 늘어난다 --- */
  window.cfVisit=function(){ try{ var t=todayStr(), V=S.cfVisits=S.cfVisits||[]; if(V.indexOf(t)<0){ V.push(t); if(V.length>60) V.splice(0,V.length-60); save(); } }catch(e){ LQ.err(e); } };
  function visitDays(){ var t0=Date.parse(todayStr()); return (S.cfVisits||[]).filter(function(d){ var q=t0-Date.parse(d); return q>=0&&q<7*864e5; }).length; }
  window.cfCandlesHtml=function(){ var n=Math.min(7,Math.max(1,visitDays())), P=[[-150,46],[-126,32],[134,58],[-176,40],[158,36],[-100,50],[110,42],[-72,34],[84,44]], c=Math.min(P.length,2+n), h='<div class="cf-candles">';
    for(var i=0;i<c;i++){ var x=P[i][0], hh=P[i][1], d=(-(i*0.37)%1.2).toFixed(2); h+='<i class="cf-pxc" style="left:calc(50% '+(x<0?'- '+(-x):'+ '+x)+'px);height:'+hh+'px;background-image:url('+pxBody(hh)+')"><b class="cf-pxg" style="background-image:url('+pxSpr().g+');animation-delay:'+d+'s"></b><b class="cf-pxf" style="background-image:url('+pxSpr().f+');animation-delay:'+d+'s;animation-duration:'+(0.72+(i%3)*0.11).toFixed(2)+'s"></b></i>'; }
    return h+'</div>'; };
  /* 도트 촛불: 몸통(높이별)·불꽃(6장 넘김)·빛 무리를 캔버스로 그려 쓴다. 1칸 = 2px */
  var PXC={}, PXS=null;
  function pxCv(w,h){ var c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
  function pxDraw(x,rows,pal,ox){ rows.forEach(function(r,y){ for(var i=0;i<r.length;i++){ var k=r.charAt(i); if(pal[k]){ x.fillStyle=pal[k]; x.fillRect((ox||0)+i,y,1,1); } } }); }
  function pxBody(hp){ if(PXC[hp]) return PXC[hp]; var R=Math.round(hp/2), c=pxCv(11,R), x=c.getContext('2d'), W=['#5a3a22','#fff3d6','#f2e2bb','#e6d1a2','#d4bb86','#b89a66'], f=function(col,y,cl){ x.fillStyle=cl; x.fillRect(col,y,1,1); };
    for(var y=0;y<R-3;y++){ f(2,y,W[0]); f(8,y,W[0]); for(var k=1;k<=5;k++) f(2+k,y,W[k]); }
    for(var k=3;k<=7;k++){ f(k,0,W[0]); f(k,1,'#fffaea'); } f(2,0,'rgba(0,0,0,0)'); x.clearRect(2,0,1,1); x.clearRect(8,0,1,1); f(2,1,W[0]); f(8,1,W[0]);
    f(3,2,'#fffaea'); f(3,3,'#fffaea'); f(3,4,'#fffaea'); f(6,2,'#f6e8c8'); f(6,3,'#f6e8c8');
    f(2,2,W[1]); f(2,3,W[1]); f(1,2,W[0]); f(1,3,W[0]); f(2,4,W[0]);
    for(var k=1;k<=9;k++){ f(k,R-3,k<3||k>7?'#5a3a22':'#f0c860'); f(k,R-2,k===1?'#f0c860':k===9?'#8a5a1c':'#c9973a'); } f(0,R-2,'#5a3a22'); f(10,R-2,'#5a3a22'); for(var k=0;k<=10;k++) f(k,R-1,'#4a2a12');
    return PXC[hp]=c.toDataURL(); }
  function pxSpr(){ if(PXS) return PXS;
    var pal={k:'#3a2a1a',w:'#fffbe6',y:'#ffe066',o:'#ff9a2a',r:'#e0531f'},
      F1=['...r...','...o...','..oo...','..oyo..','.oyyo..','.oywyo.','.oywyo.','.oywyo.','..oyo..','...w...','...k...'],
      F2=['....r..','....o..','...oo..','..oyo..','..oyyo.','.oywyo.','.oywyo.','.oywyo.','..oyo..','...w...','...k...'],
      F3=['..r....','...o...','..oo...','..oyo..','.oyyo..','.oywyo.','.oywyo.','..owo..','..oyo..','...w...','...k...'],
      F4=['.......','...r...','...o...','..oyo..','.oyyo..','.oywyo.','.oywyo.','.oywyo.','..oyo..','...w...','...k...'],
      fr=[F1,F2,F1,F4,F3,F2], c=pxCv(7*fr.length,11), x=c.getContext('2d');
    fr.forEach(function(F,i){ pxDraw(x,F,pal,i*7); });
    var g=pxCv(16,16), y=g.getContext('2d');
    for(var a=0;a<16;a++) for(var b=0;b<16;b++){ var dd=Math.round(Math.hypot(a-7.5,b-8.5)*2)/2, al=dd<3.5?.42:dd<5?.28:dd<6.5?.16:dd<8?.07:0; if(al){ y.fillStyle='rgba(255,170,70,'+al+')'; y.fillRect(a,b,1,1); } }
    return PXS={f:c.toDataURL(),g:g.toDataURL()}; }
  window.cfCandleNote=function(){ var n=visitDays(); if(n<2) return ''; return '<div class="cf-note">이번 주에 '+n+'번 찾아와 줬어요. 촛불이 '+(2+Math.min(7,n))+'개예요.'+(n>=7?'\n한 주 내내 와 줬네요.':'')+'</div>'; };

  /* --- 쓰고 태우기: 저장하지 않고 불꽃으로 --- */
  var BURN={neg:['다 태웠어요. 무거운 건 재로 남겨 두고 가요.','타서 사라졌어요. 이제 그 말은 여기에 없어요. 마음도 조금 가벼워졌길 바라요.','꺼내 놓은 것만으로 반은 덜어진 거예요. 나머지는 연기처럼 흩어졌어요.'],
    pos:['기쁜 마음이 불꽃처럼 환하게 타올랐어요. 마음속에는 그대로 남아 있을 거예요.'],
    neu:['조용히 태웠어요. 아무 데도 남지 않았어요.','잘 태웠어요. 하고 싶은 말이 또 생기면 언제든 와요.']};
  window.cfBurnToggle=function(){ if(_burning) return; _burn=!_burn; var b=g('cfBurnBtn'), ta=g('cfText'), sb=g('cfSendBtn'), pv=g('cfPriv');
    if(b) b.classList.toggle('on',_burn); if(ta) ta.placeholder=_burn?'적고 나면 태워 줄게요. 어디에도 남지 않아요.':'한 줄만 써도 돼요.';
    if(sb) sb.textContent=_burn?'🔥 태울게요':'전할게요'; if(pv) pv.textContent=_burn?'태운 글은 어디에도 저장되지 않아요.':'쓴 글은 이 기기에만 저장돼요.'; };
  window.cfSend=function(){ if(_burn) return cfBurnSend(); const t=(document.getElementById('cfText').value||'').trim(); if(!t){ toast('한 줄만 적어 주세요'); return; }
  const k=cfKind(t,_cfChip); let r, full, by='로웨나', img=mascotImg(56,'cheer'), useMarty=false;
  if(cfMartyChance()&&cfTone(k,t)==='neu'&&k!=='tired'&&k!=='joy'){ useMarty=true; by='마티'; img=martyMascotImg(56); r=MT_CONFESS[Math.floor(Math.random()*MT_CONFESS.length)]; full=r; }
  else { r=cfReplyFor(k,t); full=r+cfWeekAware(k); }
  const eid='cf'+Date.now(); let meta=null, fq=''; try{ if(!useMarty){ meta=cfMeta(k,t); fq=cfFollowQ(k,meta); } }catch(e){ LQ.err(e); }
  let cele=false, hard=false; if(!useMarty){ if(k==='joy'||((k==='free'||k==='chat')&&meta&&meta.tn==='pos')){ cele=true; fq=''; } else if(meta&&(meta.tn==='neg'||k==='tired')) hard=true; }
  (S.confess=S.confess||[]).push({id:eid,ts:Date.now(),d:todayStr(),k:k,text:t,reply:full,by:by,fq:fq||undefined,tn:meta?meta.tn:undefined,tw:(meta&&meta.tw)||undefined,ti:(meta&&meta.ti>=0)?meta.ti:undefined}); save(); try{ cfRoomAfterSend(k); }catch(e){ LQ.err(e); }
  if(!useMarty){ try{ lwFaceTemp(({sad:'sad',lonely:'sad',angry:'angry',anxious:'worry2',joy:'smile',dessert:'smile',crave:'smile',hungry:'smile',tired:'worry'}[k]||'proud'),120000); }catch(e){ LQ.err(e); } } if(!useMarty) _say={text:r,t:Date.now(),mood:'cheer',ttl:120000}; if(!useMarty&&k!=='sad'&&!cele) setTimeout(()=>martyMaybe(.35,'confess'),700);
  cfShowTyped('<div class="mascot-row">'+img+'<div class="speech-bubble" style="white-space:pre-line">'+esc(full)+(fq?'\n\n'+esc(fq):'')+(cele?'\n\n마티를 불러서 같이 축하해도 될까요? 🎉':'')+'</div></div>'+(fq?cfFqBox(eid):'')+(cele?cfCeleBox(eid):'')+(k==='anxious'&&!useMarty?cfBreathBox():'')+'<div style="display:flex;gap:6px;margin-top:12px"><button class="cfb" style="flex:1" onclick="openConfessLog()">고해 노트 보기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>'); };
  function cfBurnSend(){ if(_burning) return; var ta=g('cfText'), t=((ta&&ta.value)||'').trim(); if(!t){ toast('한 줄만 적어 주세요'); return; }
    
    var k=cfKind(t,_cfChip), tn=cfTone(k,t), r=g('cfRoom'), rc=ta.getBoundingClientRect(), fast=reduced();
    _burning=true; ta.readOnly=true; ta.classList.add('cf-burning');
    if(!fast&&r){ var f=document.createElement('div'); f.className='cf-fire'; f.style.cssText='left:'+rc.left+'px;top:'+rc.top+'px;width:'+rc.width+'px;height:'+rc.height+'px';
      var em=document.createElement('div'); em.className='cf-embers'; em.style.cssText='left:'+rc.left+'px;top:'+rc.top+'px;width:'+rc.width+'px;height:'+rc.height+'px';
      for(var i=0;i<14;i++){ var e=document.createElement('i'); e.className='cf-ember'; e.style.cssText='left:'+Math.round(Math.random()*100)+'%;--x:'+Math.round((Math.random()-.5)*60)+'px;--d:'+(1.4+Math.random()*1.2).toFixed(2)+'s;--w:'+(Math.random()*1.1).toFixed(2)+'s'; em.appendChild(e); }
      r.appendChild(f); r.appendChild(em); setTimeout(function(){ if(f.parentNode) f.remove(); if(em.parentNode) em.remove(); },3400); }
    setTimeout(function(){ ta.classList.remove('cf-burning'); ta.readOnly=false; _burning=false;
      if(!g('cfRoom')||!g('cfRoom').classList.contains('show')) return;
      ta.value=''; cfRoomAfterSend(k,false); var line=cfPk(BURN[tn]||BURN.neu,'burn_'+tn);
      cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(line)+'</div></div><div style="margin-top:12px"><button class="cfb" style="width:100%" onclick="closeModal()">닫기</button></div>'); }, fast?1100:2500); }

  /* --- 숨 고르기: 4초 들이쉬고 · 2초 멈추고 · 6초 내쉬기 --- */
  window.cfBreathBox=function(){ return '<button class="cfb" style="width:100%;margin-top:10px" onclick="cfBreathFromModal()">🌬️ 같이 숨 쉬어요</button>'; };
  window.cfBreathFromModal=function(){ closeModal(); setTimeout(function(){ cfBreathe(); },150); };
  window.cfBreathe=function(cycles){ var r=g('cfRoom'); if(!r||!r.classList.contains('show')||_br||_sit) return; cycles=(typeof cycles==='number'&&cycles>0)?cycles:4;
    var o=document.createElement('div'); o.id='cfBreath'; o.className='cf-breath';
    o.innerHTML='<div class="cf-b-ring"><div class="cf-b-c" id="cfBc"></div></div><div class="cf-b-t" id="cfBt">편하게 앉아요. 곧 시작할게요.</div><div class="cf-b-s" id="cfBs"></div><button class="cfb" id="cfBx" onclick="cfBreathStop()">그만할래요</button>';
    r.appendChild(o); _br={T:[],done:false}; var PH=[['들이쉬어요',4,1.55],['잠깐 멈춰요',2,1.55],['천천히 내쉬어요',6,1]], cy=0, pi=0;
    function later(fn,ms){ var t=setTimeout(fn,ms); _br&&_br.T.push(t); }
    function phase(){ if(!_br) return; var c=g('cfBc'), tx=g('cfBt'), sb=g('cfBs'); if(!c||!tx) return;
      var p=PH[pi]; tx.textContent=p[0]; c.style.transition=reduced()?'none':'transform '+p[1]+'s ease-in-out'; c.style.transform='scale('+p[2]+')';
      if(sb) sb.textContent=(cy+1)+' / '+cycles; var left=p[1]; var cd=function(){ if(!_br) return; if(sb) sb.textContent=left+'초 · '+(cy+1)+' / '+cycles; left--; if(left>=0) later(cd,1000); }; cd();
      later(function(){ pi++; if(pi>=PH.length){ pi=0; cy++; } if(cy>=cycles) finish(); else phase(); },p[1]*1000); }
    function finish(){ if(!_br) return; _br.done=true; var tx=g('cfBt'), sb=g('cfBs'), x=g('cfBx'), c=g('cfBc'); if(c){ c.style.transition='transform 1.5s ease-in-out'; c.style.transform='scale(1.2)'; }
      if(tx) tx.textContent='잘했어요. 숨이 조금 느려졌길 바라요.'; if(sb) sb.textContent=''; if(x){ x.textContent='고마워요'; } }
    later(phase,1600); };
  window.cfBreathStop=function(){ var done=!!(_br&&_br.done); if(_br){ _br.T.forEach(clearTimeout); _br=null; } var o=g('cfBreath'); if(o) o.remove();
    var r=g('cfRoom'); if(r&&r.classList.contains('show')){ cfRoomFace('proud'); var h=g('cfHi'); if(h) h.textContent=done?'숨 쉬는 동안 옆에 있었어요.\n이제 천천히 써 봐요.':'괜찮아요. 준비되면 언제든 다시 해요.'; } };

  /* --- 말없이 곁에: 글 없이 촛불 곁에 머물기 --- */
  var SITL=['말하지 않아도 괜찮아요. 저는 여기 있어요.','숨은 천천히 쉬어도 돼요.','촛불 타는 소리만 들어도 충분해요.','아무것도 안 해도 되는 시간이에요.','오늘은 그냥 여기 있어요, 우리.','조금 쉬어도 세상은 그대로예요.','여기선 아무도 재촉하지 않아요.','마음이 가라앉을 때까지 기다릴게요.'];
  var SITEND=['곁에 있는 것만으로도 충분한 밤이었어요. 또 언제든 와요.','말하지 않아도 괜찮았죠? 저는 계속 여기 있을게요.','조용히 함께 있어 줘서 고마워요.'];
  function sitSay(txt){ var h=g('cfHi'); if(!h) return; h.style.opacity=0; setTimeout(function(){ if(g('cfHi')){ h.textContent=txt; h.style.opacity=1; } },800); }
  window.cfSit=function(){ var r=g('cfRoom'), inn=r&&r.querySelector('.cf-inner'); if(!r||!inn||_sit||_br||_burning) return;
    var box=document.createElement('div'); box.id='cfSitBox'; box.innerHTML='<div class="cf-sit-t" id="cfSitT">함께 있는 중…</div><button class="cfb" onclick="cfSitStop()">일어날게요</button>'; inn.appendChild(box);
    r.classList.add('cf-sit'); cfRoomFace('greet'); var h=g('cfHi'); if(h) h.textContent='말하지 않아도 돼요.\n저는 여기 있어요.'; r.scrollTop=0;
    var t0=Date.now(); window.__cfSit=_sit={t0:t0,next:t0+25000,last:-1,iv:null};
    _sit.iv=setInterval(function(){ if(!_sit) return; var m=Math.floor((Date.now()-_sit.t0)/60000), st=g('cfSitT'); if(st) st.textContent=m<1?'함께 있는 중…':m+'분째 함께 있어요';
      if(Date.now()>=_sit.next){ var i=Math.floor(Math.random()*SITL.length); if(i===_sit.last) i=(i+1)%SITL.length; _sit.last=i; sitSay(SITL[i]); _sit.next=Date.now()+70000+Math.random()*40000; } },1000); };
  window.cfSitStop=function(silent){ if(!_sit) return; var el=Date.now()-_sit.t0, m=Math.floor(el/60000); clearInterval(_sit.iv); _sit=null; window.__cfSit=null;
    var r=g('cfRoom'), bx=g('cfSitBox'); if(bx) bx.remove(); if(r) r.classList.remove('cf-sit');
    var h=g('cfHi'); if(h){ h.style.opacity=1; h.textContent=FACE_HI.greet; } cfRoomFace('greet');
    if(el<60000){ if(silent!==true) toast('언제든 다시 와요'); return; }
    var line=cfPk(SITEND,'sitend')+'\n'+m+'분 동안 함께 있었어요.';
    (S.confess=S.confess||[]).push({id:'cf'+Date.now(),ts:Date.now(),d:todayStr(),k:'sit',text:'(말없이 곁에 앉아 있었어요 · '+m+'분)',reply:line}); save(); try{ renderConfess(); }catch(e){ LQ.err(e); }
    if(silent===true) return;
    cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(line)+'</div></div><div style="display:flex;gap:6px;margin-top:12px"><button class="cfb" style="flex:1" onclick="openConfessLog()">고해 노트 보기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>'); };

  /* 방에서 나갈 때 진행 중인 것들 정리 */

  /* --- 1) 기쁜 일: 마티 축하 + 오늘의 업적 후보 --- */
  window.cfCeleBox=function(id){ return '<div style="display:flex;gap:6px;margin-top:10px"><button class="cfb" style="flex:1" onclick="cfCele(\''+id+'\')">🎉 불러 주세요</button><button class="cfb" style="flex:1" onclick="closeModal()">괜찮아요</button></div>'; };
  var CELE=['와아~ 축하해요! 마티가 달려왔어요 🎉✨','기쁜 소식이라고 해서 날아왔어요! 정말 잘했어요 👏','짜잔, 축하 요정 마티 등장! 오늘은 마음껏 기뻐해요 🌟','반짝반짝! 마티가 축하 가루 들고 왔어요 ✨🎊'];
  var CELEQ=['“{q}” — 와아~ 마티가 달려왔어요 🎉✨','“{q}” — 소식 듣고 날아왔어요! 정말 잘했어요 👏','“{q}” — 짜잔, 축하 요정 마티 등장! 오늘의 주인공이네요 🌟','“{q}”! 저도 모르게 박수가 나왔어요 🎊'];
  var WADN={'해냈':'해낸','끝냈':'끝낸','마쳤':'마친','따냈':'따낸','만들었':'만든','이겼':'이긴','붙었':'붙은','받았':'받은','만났':'만난','먹었':'먹은','찾았':'찾은','풀었':'푼','올랐':'오른','나았':'나은','뛰었':'뛴','했':'한','샀':'산','갔':'간','됐':'된','되었':'된','썼':'쓴','왔':'온','봤':'본'};
  var WRE=/^(.*?)(해냈|끝냈|마쳤|따냈|만들었|이겼|붙었|받았|만났|먹었|찾았|풀었|올랐|나았|뛰었|했|샀|갔|됐|되었|썼|왔|봤)(?:어요|어|다|음|네요|네|구나|지|는데|거든|고)?$/;
  /* “시험 합격했어” → “시험 합격한 날” */
  function winPhrase(c){ c=String(c||'').replace(/[!?.~ㅎㅋㅠ\s]+$/,'').replace(/^(오늘|방금|아까)\s*/,'').trim();
    if(/망|실패|못|안\s|싫|힘들|짜증|아프|피곤/.test(c)) return null;
    var m=c.match(WRE), ws=c.split(/\s+/), k=ws.length-1;
    while(!m&&k>=2){ m=ws.slice(0,k).join(' ').match(WRE); k--; }   /* “발표 끝냈어 다행이야” → 앞부분만으로 시도 */
    if(!m||m[1].replace(/\s/g,'').length<2) return null;
    var w=m[1]+WADN[m[2]]+' 날'; return w.length<=26?w:null; }
  var FEEL=[[/뿌듯/,'뿌듯함이 가득했던 날'],[/행복/,'행복이 번진 날'],[/기쁘|기뻐/,'기쁨이 가득했던 날'],[/설레/,'설렘이 찾아온 날'],[/신나|신났/,'신나게 웃은 날'],[/다행|안도|놓였|놓이/,'마음이 놓인 날'],[/감사|고마/,'고마움을 느낀 날'],[/재밌|재미있|즐거/,'즐겁게 보낸 날'],[/웃었|웃음/,'크게 웃은 날']];
  var CAT=['🏠 가족과 따뜻했던 날','🤝 좋은 사람들과 함께한 날','💗 설렘이 찾아온 날','💼 일터에서 빛난 날','📚 노력이 결실을 맺은 날','🧭 앞길이 열리는 날','🌿 몸이 가벼웠던 날','🌙 푹 잔 개운한 날','💰 마음이 든든해진 날','🐾 작은 친구와 웃은 날','🎨 좋아하는 걸 즐긴 날','🌤️ 날씨까지 좋았던 날','🪞 내 모습이 마음에 든 날','🤝 마음이 풀린 날','🌱 돌아보고 한 걸음 나아간 날'];
  function achIdeas(e){ var t=String(e.text||'').trim(), d=todayStr(), q=null;
    try{ q=window.cfPickQuote?cfPickQuote(t):null; }catch(x){ LQ.err(x); }
    if(!q){ var f=t.split(/[.!?\n~…]/)[0].trim(); q=(f.length>=4&&f.length<=24)?f:null; }
    var qs=q&&q.length>24?q.slice(0,24)+'…':q, ds=d+' · 밀담실에서 나눈 기쁜 순간'+(qs?' · “'+qs+'”':''), L=[], seen={};
    function add(n,desc){ if(!n||seen[n]) return; seen[n]=1; L.push([n,desc||ds]); }
    var cl=t.split(/[.!?\n~…]+/).map(function(x){ return x.trim(); }).filter(Boolean), w=null, i;
    if(q) w=winPhrase(q); for(i=0;!w&&i<cl.length;i++) w=winPhrase(cl[i]);
    if(w) add('🏅 '+w);
    for(i=0;i<FEEL.length;i++){ if(FEEL[i][0].test(t)){ add('💛 '+FEEL[i][1]); break; } }
    var ti=(e.ti!=null)?e.ti:(window.cfTopicOf?cfTopicOf(t):-1); if(ti>=0&&CAT[ti]) add(CAT[ti]);
    add('🌟 오늘의 나, 칭찬해요','스스로에게 박수 한 번 쳐 준 날 · '+d);
    add('🎉 기쁨을 나눈 날','좋은 일을 로웨나와 마티에게 들려준 날 · '+d);
    return L.slice(0,3); }
  window.cfAchDialog=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e) return;
    var C=achIdeas(e); window.__cfAch={id:id,list:C,ds:(C[0]&&C[0][1])||todayStr()+' · 밀담실에서 나눈 기쁜 순간'};
    var o=document.getElementById('askOv');
    o.innerHTML='<div class="ask-box mg-box"><div class="mg-row"><img class="mg-img" src="'+MARTY_IMG+'" alt=""><div class="speech-bubble">축하해요! 🎉\n이 순간을 오늘의 업적으로 남겨 볼까요?\n마음에 드는 걸 골라 줘요.</div></div>'
      +C.map(function(c,i){ return '<button class="mg-opt" onclick="cfAchPick('+i+')"><b>'+esc(c[0])+'</b><span>'+esc(c[1])+'</span></button>'; }).join('')
      +'<input id="cfAchName" maxlength="28" placeholder="✏️ 내가 직접 이름 붙이기" style="font-size:16px;padding:8px;border:1px solid var(--gold-d);border-radius:5px;background:#d6c7a0;color:var(--ink);font-family:inherit;margin-top:2px">'
      +'<button class="mg-opt" style="margin-top:6px;align-items:center" onclick="cfAchCustom()"><b>이 이름으로 남기기</b></button>'
      +'<div class="mg-foot"><button class="ghost-btn" onclick="mgClose()">다음에 할게요</button></div></div>';
    o.classList.add('show'); };
  window.cfAchAdd=function(name,desc){ var t=todayStr(); S.achievements=S.achievements||[];
    if(S.achievements.some(function(a){ return a.name===name&&a.unlockedAt===t; })){ toast('이미 남긴 업적이에요'); mgClose(); window.__cfAch=null; return; }
    S.achievements.push({id:'a'+Date.now(),name:name,desc:desc,cond:{type:'manual'},gold:2,unlocked:true,unlockedAt:t});
    S.gold=(S.gold||0)+halfG(2); save(); mgClose(); window.__cfAch=null;
    try{ celebrate('ach',name); }catch(e){ LQ.err(e); } try{ renderAchievements(); renderHome(); }catch(e){ LQ.err(e); } };
  window.cfAchPick=function(i){ var A=window.__cfAch; if(!A||!A.list[i]) return; cfAchAdd(A.list[i][0],A.list[i][1]); };
  window.cfAchCustom=function(){ var A=window.__cfAch||{}, el=document.getElementById('cfAchName'), n=((el&&el.value)||'').trim();
    if(!n){ toast('이름을 한 줄만 적어 주세요'); return; } cfAchAdd('🏅 '+n.replace(/^🏅\s*/,''),A.ds||todayStr()+' · 밀담실에서 나눈 기쁜 순간'); };
  window.cfCele=function(id){ closeModal(); document.body.classList.add('cf-cele'); try{ sfx('ach'); }catch(e){ LQ.err(e); }
    var e=(S.confess||[]).find(function(x){ return x.id===id; }), q=null;
    try{ q=(e&&window.cfPickQuote)?cfPickQuote(e.text):null; }catch(x){ LQ.err(x); }
    var t=(q&&q.length<=24&&Math.random()<.85)?cfPk(CELEQ,'celeq').replace('{q}',q):cfPk(CELE,'cele');
    var go=function(){ document.body.classList.remove('cf-cele'); cfAchDialog(id); };
    if(S.settings.martyPop===false){ toast('마티: '+t); setTimeout(go,1300); return; }
    martyShow('cele',t);
    var n=0, seen=false, iv=setInterval(function(){ var p=document.getElementById('martyPop'), on=!!p&&p.className==='show'; if(on) seen=true; n++;
      if((seen&&!on)||n>24){ clearInterval(iv); setTimeout(go,seen?350:150); } },300); };

})();
var _cfLogFilter='all';
function cfFav(id){ const e=(S.confess||[]).find(x=>x.id===id); if(!e) return; e.fav=!e.fav; save(); openConfessLog(); }
function openConfessLog(filter){ if(filter!==undefined) _cfLogFilter=filter;
  const all=(S.confess||[]).slice().reverse();
  const kindsPresent=[...new Set(all.map(e=>e.k))];
  if(_cfLogFilter!=='all'&&_cfLogFilter!=='fav'&&!kindsPresent.includes(_cfLogFilter)) _cfLogFilter='all';
  const A=_cfLogFilter==='all'?all:_cfLogFilter==='fav'?all.filter(e=>e.fav):all.filter(e=>e.k===_cfLogFilter);
  const chip=(k,label)=>'<button class="cfb'+(_cfLogFilter===k?' on':'')+'" style="padding:5px 10px;font-size:12px" onclick="openConfessLog(\''+k+'\')">'+label+'</button>';
  const chips='<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">'+chip('all','전체')+chip('fav','⭐ 즐겨찾기')+kindsPresent.map(k=>chip(k,CF_KIND[k]||k)).join('')+'</div>';
  showModal('<h3 style="margin-bottom:6px">고해 노트</h3><div class="panel-sub" style="margin-top:0">이 기기에만 저장돼요. 백업에는 함께 들어가요.</div>'+chips+(A.length?A.map(e=>'<div class="cf-ent"><div class="m">'+esc(e.d)+' · '+esc(CF_KIND[e.k]||'')+'<button class="cf-star" onclick="cfFav(\''+e.id+'\')" title="즐겨찾기">'+(e.fav?'⭐':'☆')+'</button></div>'+(e.q?'<div style="font-size:12px;color:var(--ink-soft);font-style:italic;margin-top:2px">Q. '+esc(e.q)+'</div>':'')+'<div class="t">'+esc(e.text)+'</div><div class="r" style="white-space:pre-line">'+esc(e.by||'로웨나')+': '+esc(e.reply)+'</div>'+cfFuLog(e)+'<button class="cfb" style="margin-top:6px;padding:4px 10px;font-size:12px" onclick="cfDel(\''+e.id+'\')">삭제</button></div>').join(''):'<div class="empty">해당하는 글이 없어요</div>')+'<button class="cfb" style="width:100%;margin-top:10px" onclick="openConfess()">새로 털어놓기</button>'); }
function cfDel(id){ askOk('이 글을 지울까요?',()=>{ S.confess=(S.confess||[]).filter(e=>e.id!==id); save(); openConfessLog(); }); }

/* ===== 오늘의 질문 ===== */
var LW_QUESTIONS=['오늘 제일 좋았던 순간은?','요즘 제일 자주 하는 생각은?','오늘 가장 고마웠던 건 뭐예요?','지금 가장 하고 싶은 건 뭐예요?','최근에 나를 웃게 한 건 뭐였어요?','오늘 하루를 색깔로 표현하면?','요즘 제일 그리운 건 뭐예요?','오늘의 나에게 한마디 해준다면?','최근에 스스로 대견했던 순간은?','지금 가장 걱정되는 건 뭐예요?','오늘 하루, 다시 산다면 바꾸고 싶은 게 있나요?','요즘 어떤 노래를 자주 들어요?','최근에 누군가에게 고마움을 느꼈던 순간은?','요즘 나를 가장 지치게 하는 건 뭐예요?','내일의 나에게 하고 싶은 말은?'];
function qotdIndex(){ const t=todayStr(); let h=0; for(let i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return h%LW_QUESTIONS.length; }
var LW_SPECIAL_Q={
 '01-01':'새해 첫날이에요. 올해 가장 하고 싶은 건 뭐예요?',
 '12-31':'올해 제일 기억에 남는 순간은?',
 '12-25':'오늘 하루, 마음이 따뜻해지는 일이 있었나요?',
 '03-01':'새 계절이 시작됐어요. 요즘 마음은 어때요?',
 '06-01':'여름 문턱이에요. 올해 여름엔 뭘 해보고 싶어요?',
 '09-01':'선선해지는 계절, 요즘 기분은 어때요?',
 '11-01':'한 해가 저물어가요. 요즘 자주 드는 생각은?',
 '10-31':'오늘같이 특별한 날, 평소와 다른 기분이 있나요?',
 '07-22':'오늘은 특별한 날이에요. 올 한 해를 돌아보면 어떤가요?'
};
function qotdText(){ const md=todayStr().slice(5); if(LW_SPECIAL_Q[md]) return LW_SPECIAL_Q[md]; return LW_QUESTIONS[qotdIndex()]; }
function qotdEntryToday(){ const t=todayStr(); return (S.confess||[]).find(e=>e.k==='qotd'&&e.d===t); }
function openQotd(){ const ex=qotdEntryToday();
  if(ex){ showModal('<h3 style="margin-bottom:6px">오늘의 질문</h3><div class="panel-sub" style="margin-top:0">'+esc(qotdText())+'</div><div class="cf-ent" style="border-top:none;padding-top:0"><div class="t">'+esc(ex.text)+'</div><div class="r" style="white-space:pre-line">로웨나: '+esc(ex.reply)+'</div></div><button class="cfb" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>'); return; }
  showModal('<h3 style="margin-bottom:6px">오늘의 질문</h3><div class="panel-sub" style="margin-top:0">'+esc(qotdText())+'</div><textarea id="qotdInput" class="cf-ta" rows="5" placeholder="편하게 적어 봐요."></textarea><button class="cfb" style="width:100%;margin-top:8px" onclick="qotdSend()">전할게요</button>'); }
function qotdSend(){ const t=(document.getElementById('qotdInput').value||'').trim(); if(!t){ toast('한 줄만 적어 주세요'); return; }
  const r=cfReplyFor('qotd',t);
  (S.confess=S.confess||[]).push({id:'cf'+Date.now(),ts:Date.now(),d:todayStr(),k:'qotd',q:qotdText(),text:t,reply:r}); save();
  try{ lwFaceTemp('proud',120000); }catch(e){ LQ.err(e); }
  _say={text:r,t:Date.now(),mood:'cheer',ttl:120000}; setTimeout(()=>martyMaybe(.3,'confess'),700);
  cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(r)+'</div></div>'+'<div style="margin-top:12px"><button class="cfb" style="width:100%" onclick="closeModal()">닫기</button></div>'); }

/* ===== 원터치: 안아주기 / 기분 체크인 ===== */
var HUG_LINES=['꼭 안아줄게요. 아무 말 안 해도 괜찮아요.','토닥토닥, 오늘 하루도 잘 견뎠어요.','괜찮아요, 잠깐 이렇게 있어도 돼요.','당신은 혼자가 아니에요. 여기 제가 있어요.','힘들었죠. 오늘은 그냥 이렇게 쉬어가요.','아무 이유 없이 안아주고 싶은 날이에요.','말이 필요 없을 때도 있죠. 그냥 이렇게 있을게요.','잘하고 있어요, 오늘도 수고했어요.'];
function hugMe(){ const r=LQD.pick('lowena.hug',HUG_LINES,{who:'lowena'});
  (S.confess=S.confess||[]).push({id:'cf'+Date.now(),ts:Date.now(),d:todayStr(),k:'hug',text:'(말없이 안아달라고 했어요)',reply:r}); save();
  _say={text:r,t:Date.now(),mood:'cheer',ttl:90000}; try{ lwFaceTemp('proud',90000); }catch(e){ LQ.err(e); }
  cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble">'+esc(r)+'</div></div><div style="margin-top:12px"><button class="cfb" style="width:100%" onclick="closeModal()">닫기</button></div>'); }
var MOOD_EMOJI={happy:'😊',okay:'🙂',meh:'😐',sad:'😢',angry:'😠',anxious:'😰'};
var MOOD_LINES={happy:['좋은 기분이네요! 그 느낌 오래가길 바라요.','오늘 컨디션이 좋아 보여요, 다행이에요.'],okay:['무난한 하루였나 봐요. 그것도 좋아요.','평온한 하루, 그 자체로 좋은 거예요.'],meh:['그럭저럭인 날도 있는 법이죠.','애매한 기분, 그대로 인정해 줘도 돼요.'],sad:['오늘 마음이 가라앉았군요. 무리하지 말아요.','속상한 하루였나 봐요, 잘 버텼어요.'],angry:['오늘 좀 답답했나 봐요. 그 마음 인정해요.','화가 났던 하루, 잠시 내려놓고 가요.'],anxious:['불안한 하루를 보냈군요. 지금은 안전해요.','걱정이 많았던 날이네요, 천천히 가요.']};
function openMoodCheck(){ showModal('<h3 style="margin-bottom:6px">오늘 기분은 어때요?</h3><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px">'+Object.keys(MOOD_EMOJI).map(m=>'<button class="cfb" style="font-size:30px;padding:8px 12px;line-height:1" onclick="moodCheck(\''+m+'\')">'+MOOD_EMOJI[m]+'</button>').join('')+'</div>'); }
function moodCheck(m){ const P=MOOD_LINES[m]||['알려줘서 고마워요.']; const r=LQD.pick('lowena.mood.'+m,P,{who:'lowena'});
  (S.confess=S.confess||[]).push({id:'cf'+Date.now(),ts:Date.now(),d:todayStr(),k:'mood',text:(MOOD_EMOJI[m]||'')+' 기분 체크인',reply:r}); save();
  try{ lwFaceTemp({happy:'smile',okay:'proud',meh:'worry',sad:'sad',angry:'angry',anxious:'worry2'}[m]||'greet',90000); }catch(e){ LQ.err(e); }
  toast('로웨나: '+r); closeModal(); }

/* ===== 회상: 예전 고해 노트 다시 꺼내기 ===== */
function recallEntry(){ const t=todayStr(); const old=(S.confess||[]).filter(e=>e.d<t&&e.k!=='hug'&&e.k!=='mood'&&e.k!=='sit'&&(Date.parse(t)-Date.parse(e.d))>=14*864e5);
  if(!old.length) return null; let h=0; for(let i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return old[h%old.length]; }
function dateHashDay(){ const t=todayStr(); let h=0; for(let i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))>>>0; return h; }

/* ===== 주간 편지 ===== */
function weekLetterText(){ const t0=Date.parse(todayStr()); const recent=(S.confess||[]).filter(e=>(t0-Date.parse(e.d))>=0&&(t0-Date.parse(e.d))<7*864e5);
  if(!recent.length) return '이번 주엔 아직 나눈 이야기가 없어요. 편하게 아무 때나 와서 얘기해 줘요.';
  const cnt={}; recent.forEach(e=>cnt[e.k]=(cnt[e.k]||0)+1);
  const neg=(cnt.sad||0)+(cnt.lonely||0)+(cnt.angry||0)+(cnt.anxious||0), pos=(cnt.joy||0)+(cnt.dessert||0)+(cnt.chat||0);
  const mood=neg>pos?'이번 주엔 마음이 무거운 날이 좀 더 많았던 것 같아요.':pos>neg?'이번 주엔 좋은 순간도 꽤 있었네요.':'이번 주는 이런저런 마음이 고루 섞인 한 주였어요.';
  const detail=[]; if(cnt.sad) detail.push('속상한 얘기 '+cnt.sad+'번'); if(cnt.lonely) detail.push('외로운 얘기 '+cnt.lonely+'번'); if(cnt.angry) detail.push('화났던 얘기 '+cnt.angry+'번'); if(cnt.anxious) detail.push('불안했던 얘기 '+cnt.anxious+'번'); if(cnt.joy) detail.push('기뻤던 얘기 '+cnt.joy+'번');
  const detailText=detail.length?'\n\n'+detail.join(', ')+' 들려줬어요.':'';
  let topText=''; try{ const tc={}; recent.forEach(e=>{ if(e.tw){ var _w=String(e.tw).replace(/[“”]/g,''); tc[_w]=(tc[_w]||0)+1; } }); const tk=Object.keys(tc).sort((a,b)=>tc[b]-tc[a])[0]; if(tk&&tc[tk]>=2) topText='\n\n'+tk+' 얘기가 '+tc[tk]+'번 나왔어요. 요즘 마음에 자주 머무는 주제인가 봐요.'; }catch(e){ LQ.err(e); }
  return '이번 주에 저한테 '+recent.length+'번 이야기해 줬네요.\n\n'+mood+detailText+topText+'\n\n어떤 하루였든, 여기까지 온 당신에게 잘했다고 말해주고 싶어요.'; }
function openWeekLetter(){ showModal('<h3 style="margin-bottom:6px">로웨나의 주간 편지</h3><div class="mascot-row" style="margin-top:6px">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(weekLetterText())+'</div></div><button class="cfb" style="width:100%;margin-top:12px" onclick="closeModal()">닫기</button>'); }



function renderConfess(){ const el=document.getElementById('homeConfess'); if(!el) return; if(S.settings.confess===false){ el.innerHTML=''; return; }
  let recallHtml='';
  try{ if(dateHashDay()%3===0){ const e=recallEntry(); if(e){ const label=CF_KIND[e.k]||''; const snip=e.text.length>36?e.text.slice(0,36)+'…':e.text;
    recallHtml='<div class="cf-recall" onclick="openConfessLog()">💭 '+esc(e.d)+' · '+esc(label)+' — "'+esc(snip)+'" 그때 이런 얘기 했었죠.</div>'; } } }catch(err){ LQ.err(err); }
  const qDone=!!qotdEntryToday();
  el.innerHTML=(cfFuCard()||recallHtml)
    +'<div class="inline" style="margin-bottom:8px"><button class="ghost-btn" style="flex:1" onclick="openConfess()">로웨나의 밀담실</button><button class="ghost-btn" style="flex:1" onclick="openConfessLog()">고해 노트</button></div>'
    +'<div class="inline" style="margin-bottom:8px"><button class="ghost-btn" style="flex:1" onclick="openQotd()">'+(qDone?'오늘의 질문 ✓':'오늘의 질문')+'</button><button class="ghost-btn" style="flex:1" onclick="openMoodCheck()">기분 체크인</button></div>'
    +'<div class="inline" style="margin-bottom:14px"><button class="ghost-btn" style="flex:1" onclick="hugMe()">그냥 안아주세요</button>'+((S.confess||[]).length>=3?'<button class="ghost-btn" style="flex:1" onclick="openWeekLetter()">주간 편지</button>':'')+'</div>'; }
{ const _rh=renderHome; renderHome=function(){ _rh(); try{ renderConfess(); }catch(e){ LQ.err(e); } };
  LQ.on('master:after',function(){ try{ const e=document.getElementById('cfSel'); if(e) e.value=S.settings.confess===false?'0':'1'; }catch(e){ LQ.err(e); } }); }
try{ renderConfess(); }catch(e){ LQ.err(e); }


function resetAllData(){
  askOk('모든 기록(퀘스트 체크, 업적, 고해 노트, 설정 등)이 이 기기에서 지워져요. 계속할까요?',()=>{
    askOk('정말 지울까요? 되돌릴 수 없어요. 필요하면 먼저 백업해 두세요.',()=>{
      try{ S=defaultData(); S.firstSeen=Date.now(); localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){ LQ.err(e); }
      location.reload();
    });
  });
}
function monthlyAutoCheck(){
  const cur=curYM(); if(S.reportSeen==null){ S.reportSeen=cur; save(); return; } if(S.reportSeen===cur) return;
  S.reportSeen=cur; save(); const t=todayStr().split('-').map(Number), d=new Date(Date.UTC(t[0],t[1]-2,1)), pre=d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0');
  if(Object.keys(S.history).some(k=>k.startsWith(pre))) openMonthly(-1,'새 달이 시작됐어요 ✦ 지난달을 돌아봐요.');
}
function evNote(){
  const L=S.events.filter(e=>!evExpired(e)&&!e.cleared); let best=null;
  L.forEach(e=>{ const left=evLeft(e); if(left<=3&&(!best||left<best.left)) best={e,left}; });
  if(best){ const rem=best.e.items.filter(i=>!i.done).length; return `'${best.e.name}' ${best.left===0?'오늘이 마지막 날이에요':best.left+'일 남았어요'}. ${rem}개만 더 하면 클리어!`; }
  const sp=L.find(e=>e.sp); if(sp) return '🎉 지금은 '+sp.name+' 기간이에요. 이벤트 카드를 살펴봐요.';
  if(+todayStr().slice(8)<=2) return '새 달이 시작됐어요! 지난달 이야기는 🗓 월간 리포트에서 볼 수 있어요.';
  return null;
}
function toggleRep(id){ const r=S.rewards.find(x=>x.id===id); if(!r) return; r.repeatable=!r.repeatable; save(); renderTreasure(); toast(r.repeatable?'반복 가능 ↻ (사거나 쓴 뒤에도 계속 남아요)':'한 번만 쓰는 보상으로 바꿨어요'); }
function downloadCSV(){
  const Q=S.dailyQuests, c=v=>'"'+String(v).replace(/"/g,'""')+'"', head=['date','percent','cleared','rest_day'].concat(Q.map(x=>x.name));
  const rows=Object.keys(S.history).sort().map(d=>{ const h=S.history[d]; return [d,h.percent||0,h.cleared?1:0,h.pass?1:0].concat(Q.map(x=>(h.done||{})[x.id]?1:0)); });
  try{ const blob=new Blob(['\uFEFF'+[head].concat(rows).map(r=>r.map(c).join(',')).join('\n')],{type:'text/csv'}), url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download='life-quest-history-'+todayStr().replace(/-/g,'')+'.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000); toast('CSV를 저장했어요'); }
  catch(e){ toast('파일 저장이 안 돼요'); }
}
function evCheckClear(e){
  if(!e.cleared && e.items.length && e.items.every(x=>x.done)){ e.cleared=true; S.rewards.push({id:'r'+Date.now(),name:e.reward||'🎁 이벤트 보상',redeemed:false,owned:true,price:0}); S.gold=(S.gold||0)+halfG(e.gold||50); save(); celebrate('event',e.name); renderTreasure(); }
}
function toggleEvItem(id,i){
  const e=S.events.find(x=>x.id===id); e.items[i].done=!e.items[i].done; sfx(e.items[i].done?'check':'uncheck');
  evCheckClear(e);
  save(); renderEvents();
}
function renderEvEditList(){
  const el=document.getElementById('evEditList'); if(!el) return;
  el.innerHTML=S.events.filter(e=>!evExpired(e)).map(e=>`<div class="quest-row"><div class="label">${esc(e.name)}${e.cleared?' ✦':''}<div class="qdesc2">${e.items.length}개 항목 · ${esc(e.reward||'')}</div></div><div class="qr-actions" style="display:flex"><button class="small-x" onclick="openEvModal('${e.id}')">✎</button></div></div>`).join('')||'<div class="empty">이번 달 이벤트가 없어요.</div>';
}
function openEvModal(id){
  const e=id?S.events.find(x=>x.id===id):{name:'',items:[],reward:'🎁 이벤트 보상'};
  document.getElementById('modalBox').innerHTML=`<button class="modal-close" onclick="closeModal()">✕</button><h2>${id?'이벤트 편집':'이번 달 이벤트'}</h2><div class="mdesc">이번 달에만 열리는 한정 퀘스트예요. 모두 완료하면 보물이 생겨요.</div>
    <label>이름</label><input id="evName" value="${esc(e.name)}"><label>항목 (한 줄에 하나)</label><textarea id="evItems" rows="5">${esc(e.items.map(i=>i.t).join('\n'))}</textarea>
    <label>완료 보상 (보물 이름)</label><input id="evReward" value="${esc(e.reward||'')}">
    <div class="inline" style="margin-top:6px"><button class="ghost-btn" onclick="saveEv('${id||''}')">저장</button>${id?`<button class="mini-x" onclick="delEv('${id}')">삭제</button>`:''}</div>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function saveEv(id){
  const name=document.getElementById('evName').value.trim(); if(!name){ toast('이름을 입력해 주세요.'); return; }
  const old=id?S.events.find(x=>x.id===id):null;
  const lines=document.getElementById('evItems').value.split('\n').map(x=>x.trim()).filter(Boolean), oldItems=old?old.items:[], kept=new Set(lines);
  // 1) 이름이 그대로인 항목은 완료 상태 유지(중복 이름도 하나씩 소진), 2) 이름을 고친 항목은 남은 옛 항목과 순서대로 짝지어 완료 상태 승계
  const usedOld=new Set(), matched=new Array(lines.length).fill(null);
  lines.forEach((t,i)=>{ const j=oldItems.findIndex((o,k)=>!usedOld.has(k)&&o.t===t); if(j>=0){ usedOld.add(j); matched[i]=oldItems[j]; } });
  const freeOld=oldItems.filter((o,k)=>!usedOld.has(k));
  const items=lines.map((t,i)=>{ let m=matched[i]; if(!m&&freeOld.length) m=freeOld.shift(); return {t,done:!!(m&&m.done)}; });
  const reward=document.getElementById('evReward').value.trim()||'🎁 이벤트 보상';
  if(old){ old.name=name; old.items=items; old.reward=reward; evCheckClear(old); } else S.events.push({id:'e'+Date.now(),ym:curYM(),name,items,reward,cleared:false});
  save(); closeModal(); renderMaster(); renderEvents();
}
function delEv(id){ askOk('이 이벤트를 삭제할까요?',()=>{ S.events=S.events.filter(x=>x.id!==id); save(); closeModal(); renderMaster(); renderEvents(); }); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function ensureAchievements(){
  const defs=defaultData().achievements;
  const old=['THE FIRST STEP','THREE DAYS','SURVIVOR','DEBT ZERO','404 OPEN'];
  if(!S.achSeed){ defs.forEach(d=>{ if(!S.achievements.find(x=>x.id===d.id)) S.achievements.push(JSON.parse(JSON.stringify(d))); }); S.achSeed=1; }
  defs.forEach(d=>{ const a=S.achievements.find(x=>x.id===d.id); if(!a) return;
    if(old.includes(a.name)){ a.name=d.name; a.desc=d.desc; a.cond=d.cond; }
    else if(!a.cond){ a.cond=d.cond; } });
  S.achievements.forEach(a=>{ if(!a.cond) a.cond={type:'manual'}; });
  save();
}
const COND_TYPES=[['manual','직접 달성 처리'],['totalClear','누적 클리어 일수'],['streak','연속 클리어 일수'],['recipes','카페 랩 레시피 개수'],['videos','유튜브 영상 개수'],['debtZero','빚 전액 상환'],['cafeOpen','404 DRINK BAR 오픈'],['debtPct','빚 상환율(%)'],['bodyDays','BODY 실천 일수'],['recipeDone','COMPLETE 레시피 개수'],['nightCount','하루 마무리 횟수'],['rewardsUsed','보상 사용 개수'],['stages','404 준비 단계 수'],['earlySleep','23시 전 마무리 횟수'],['bodyLogs','몸 기록 횟수'],['journal','밤 한 줄 일기 횟수'],['buyCount','보물 구매 횟수'],['goldTotal','누적 획득 골드'],['achCount','해금한 업적 수'],['eventClear','클리어한 이벤트 수'],['pantry','재료 창고 재료 수'],['giftGot','받은 선물 수'],['chatTurns','로웨나 AI 대화 횟수']];
function condLabel(c){
  c=c||{type:'manual'}; const n=c.value||1;
  return ({manual:'직접 달성 처리',totalClear:`데일리 퀘스트 누적 ${n}일 클리어`,streak:`${n}일 연속 클리어`,recipes:`레시피 ${n}개 만들기`,videos:`유튜브 영상 ${n}개 완성`,debtZero:'빚 전액 상환',cafeOpen:'404 DRINK BAR 오픈',debtPct:`빚 ${n}% 상환`,bodyDays:`BODY ${n}일 실천`,recipeDone:`COMPLETE 레시피 ${n}개`,nightCount:`하루 마무리 ${n}회`,flag:'히든 조건',rewardsUsed:`보상 ${n}개 사용`,stages:`404 준비 ${n}단계 완료`,earlySleep:`23시 전 마무리 ${n}회`,bodyLogs:`몸 기록 ${n}회`,journal:`밤 한 줄 일기 ${n}회`,buyCount:`보물 ${n}회 구매`,goldTotal:`누적 획득 골드 ${n}`,achCount:`업적 ${n}개 해금`,eventClear:`이벤트 ${n}개 클리어`,pantry:`재료 ${n}개 등록`,giftGot:`선물 ${n}개 받기`,chatTurns:`로웨나 대화 ${n}회`})[c.type]||'직접 달성 처리';
}
function manualUnlock(id){ const a=S.achievements.find(x=>x.id===id); if(!a) return; S.gold=(S.gold||0)+halfG(a.gold||20); a.unlocked=true; a.unlockedAt=todayStr(); save(); celebrate('ach',a.name); renderAchievements(); renderHome(); try{ achMilestone(); }catch(e){ LQ.err(e); } }
function renderAchEditList(){
  const el=document.getElementById('achEditList'); if(!el) return;
  el.innerHTML='<div style="font-size:12.5px;color:var(--ink-soft);line-height:1.6;margin-bottom:10px">업적 목록은 비밀로 두었어요. 어떤 업적이 있는지는 해금될 때까지 알 수 없고, 고치거나 지울 수도 없어요. 새 업적만 로웨나의 안내를 받아 추가할 수 있어요.</div>';
}
function achTypeChange(){
  const t=document.getElementById('achType').value;
  document.getElementById('achValRow').style.display = ['totalClear','streak','recipes','videos','debtPct','bodyDays','recipeDone','nightCount','rewardsUsed','stages','earlySleep','bodyLogs','journal'].includes(t)?'block':'none';
}
function openAchModal(id){
  id=null; /* 기존 업적은 편집할 수 없어요. 새 업적 추가만 가능 */
  const a = id ? S.achievements.find(x=>x.id===id) : {name:'',desc:'',cond:{type:'manual',value:1}};
  const c=a.cond||{type:'manual',value:1};
  document.getElementById('modalBox').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>${id?'업적 편집':'새 업적'}</h2><div class="mdesc">조건을 채우면 자동으로 해금돼요. '직접 달성 처리'는 내가 직접 눌러 해금해요.</div>
    <label>업적 이름</label><input id="achName" value="${esc(a.name)}">
    <label>설명</label><input id="achDesc" value="${esc(a.desc)}">
    <label>해금 조건</label><select id="achType" onchange="achTypeChange()">${COND_TYPES.map(t=>`<option value="${t[0]}" ${c.type===t[0]?'selected':''}>${t[1]}</option>`).join('')}</select>
    <div id="achValRow"><label>목표 숫자</label><input id="achVal" type="number" min="1" value="${c.value||1}"></div>
    <div class="inline" style="margin-top:6px"><button class="ghost-btn" onclick="saveAch('${id||''}')">저장</button>${id?`<button class="mini-x" onclick="deleteAch('${id}')">삭제</button>`:''}</div>`;
  document.getElementById('modalOverlay').classList.add('show');
  achTypeChange();
}
function saveAch(id){
  const name=document.getElementById('achName').value.trim();
  if(!name){ toast('업적 이름을 입력해 주세요.'); return; }
  const desc=document.getElementById('achDesc').value.trim();
  const type=document.getElementById('achType').value;
  const cond={type}; if(['totalClear','streak','recipes','videos','debtPct','bodyDays','recipeDone','nightCount','rewardsUsed','stages','earlySleep','bodyLogs','journal'].includes(type)) cond.value=Math.max(1,parseInt(document.getElementById('achVal').value,10)||1);
  if(id){ const a=S.achievements.find(x=>x.id===id); a.name=name; a.desc=desc; a.cond=cond; }
  else S.achievements.push({id:'a'+Date.now(),name,desc:desc||'나만의 업적',cond,unlocked:false});
  save(); checkAchievements(); closeModal(); renderMaster(); renderAchievements(); toast('저장됐어요');
}
function deleteAch(id){ askOk('이 업적을 삭제할까요?',()=>{ S.achievements=S.achievements.filter(x=>x.id!==id); save(); closeModal(); renderMaster(); renderAchievements(); }); }

function moveDQ(id,dir){
  const i=S.dailyQuests.findIndex(d=>d.id===id), j=i+dir;
  if(i<0||j<0||j>=S.dailyQuests.length) return;
  const t=S.dailyQuests[i]; S.dailyQuests[i]=S.dailyQuests[j]; S.dailyQuests[j]=t;
  save(); renderMaster(); renderHome();
}
function openDqModal(id){
  const q=S.dailyQuests.find(d=>d.id===id); if(!q) return;
  document.getElementById('modalBox').innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>데일리 퀘스트 편집</h2><div class="mdesc">이름과 완료 조건을 자유롭게 바꿔요. (예: 걷기 7,000보)</div>
    <label>이름</label><input id="dqName" value="${esc(q.name)}">
    <label>완료 조건 · 설명 (선택)</label><input id="dqDesc" value="${esc(q.desc||'')}" placeholder="예: 저녁 식사 후 30분 이내에">
    <label>쉬는 요일 (체크한 요일엔 이 퀘스트가 빠져요)</label><div class="inline" style="flex-wrap:wrap">${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="display:flex;align-items:center;gap:3px;margin:0 8px 6px 0;font-size:13px"><input type="checkbox" class="dqOff" value="${i}" style="width:auto;margin:0" ${(q.off||[]).includes(i)?'checked':''}>${d}</label>`).join('')}</div>
    <div class="inline" style="margin-top:6px"><button class="ghost-btn" onclick="saveDQ('${id}')">저장</button></div>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function saveDQ(id){
  const q=S.dailyQuests.find(d=>d.id===id); const name=document.getElementById('dqName').value.trim();
  if(!name){ toast('이름을 입력해 주세요.'); return; }
  q.off=[...document.querySelectorAll('.dqOff')].filter(x=>x.checked).map(x=>+x.value); q.name=name; q.desc=document.getElementById('dqDesc').value.trim();
  save(); closeModal(); renderMaster(); renderHome(); toast('저장됐어요');
}

function renderMaster(){
  updateBackupInfo(); renderAchEditList(); renderEvEditList(); renderSoundUI();
  document.getElementById('clearPercentSelect').value = S.settings.clearPercent; document.getElementById('dayStartSel').value=dayStartH(); document.getElementById('lwReactSel').value=S.settings.lowenaReact===false?'0':'1'; document.getElementById('martySel').value=S.settings.martyPop===false?'0':'1'; document.getElementById('martyChatSel').value=S.settings.martyChat===false?'0':'1';
  applyBg(); document.getElementById('bgPatSel').value=S.settings.bgPattern==null?'castle':S.settings.bgPattern;
  document.getElementById('dqEditList').innerHTML = S.dailyQuests.map(q=>
    `<div class="quest-row"><div class="label" style="${q.active?'':'opacity:.4'}">${esc(q.name)}${q.desc?`<div class="qdesc2">${esc(q.desc)}</div>`:''}</div>
      <div class="qr-actions" style="display:flex">
        <button class="small-x" onclick="moveDQ('${q.id}',-1)">▲</button><button class="small-x" onclick="moveDQ('${q.id}',1)">▼</button>
        <button class="small-x" onclick="openDqModal('${q.id}')">✎</button>
        <button class="small-x" onclick="toggleActiveDQ('${q.id}')">${q.active?'⏸':'▶'}</button>
        <button class="small-x" onclick="deleteDQ('${q.id}')">✕</button>
      </div></div>`
  ).join('');
  { const dq=debtQ(), bq=bodyQ();
  document.getElementById('progressEditList').innerHTML = (dq?`
    <div class="field-row"><label>DEBT 원금</label><input type="number" min="1" value="${dq.original}" onchange="setProg('original',this)"></div>
    <div class="field-row"><label>DEBT 남은 금액</label><input type="number" min="0" value="${dq.current}" onchange="setProg('current',this)"></div>`:'')+(bq?`
    <div class="field-row"><label>BODY 프로젝트 총 일수</label><input type="number" min="1" value="${bq.total}" onchange="setProg('total',this)"></div>`:''); }
}
/* 설정 화면을 다 그린 뒤 다른 기능이 붙는 자리: LQ.on('master:after', fn) */
{ const _rmBase=renderMaster; renderMaster=function(){ _rmBase(); LQ.fire('master:after'); }; }
function setProg(k,el){
  const tgt=(k==='total')?bodyQ():debtQ(); if(!tgt){ toast('퀘스트를 찾을 수 없어요'); return; }
  const raw=String(el.value).trim(), n=Number(raw), old=tgt[k];
  const bad = raw===''||!isFinite(n)||n<0||((k==='total'||k==='original')&&n<1);
  if(bad){ el.value=old; toast('올바른 숫자를 입력해 주세요'); return; }
  const apply=()=>{ tgt[k]=Math.round(n); save(); bodySync(); checkAchievements(); renderQuests(); renderMaster(); };
  if(k==='current'&&Math.round(n)===0&&old>0){ askOk('남은 금액을 0원으로 바꾸면 빚을 모두 청산한 것으로 기록돼요. 계속할까요?',apply,()=>{ el.value=old; }); return; }
  apply();
}
function toggleActiveDQ(id){ const q=S.dailyQuests.find(d=>d.id===id); q.active=!q.active; save(); renderMaster(); renderHome(); }
function deleteDQ(id){ askOk('이 데일리 퀘스트를 삭제할까요? (일시정지로 잠시 빼둘 수도 있어요)',()=>{ S.dailyQuests = S.dailyQuests.filter(d=>d.id!==id); save(); renderMaster(); renderHome(); }); }
function setClearPercent(v){ S.settings.clearPercent=+v; save(); computeToday(); save(); renderHome(); toast('RULE UPDATED'); }


function setDayStart(v){ S.settings.dayStart=+v; save(); computeToday(); save(); renderHome(); renderCalendar(); toast('RULE UPDATED'); }
function earnDay(kind,n){ S.goldDay=S.goldDay||{}; const k=todayStr()+kind; if(S.goldDay[k]) return; S.goldDay[k]=n; S.gold=(S.gold||0)+n; save(); }
function comebackCheck(){ const y=new Date(todayStr()+'T00:00:00Z'); y.setUTCDate(y.getUTCDate()-1); const r=S.history[y.toISOString().slice(0,10)]; if(r&&!r.cleared) (S.flags=S.flags||{}).comeback=true; }
function bodyRecheck(ds){ const d=S.history[ds]||{done:{}}; if(S.dailyQuests.some(q=>q.active&&/운동/.test(q.name)&&(d.done||{})[q.id])) S.bodyDays[ds]=1; else if(!(S.bodyManual||{})[ds]) delete S.bodyDays[ds]; bodySync(); }
function bodySync(){ const b=S.subQuests.find(x=>x.id==='body'); if(b) b.progress=Math.min(b.total,(b.baseProgress||0)+Object.keys(S.bodyDays).length); }
function bodyAuto(){ const t=todayStr(), d=S.history[t]||{done:{}}; if(S.dailyQuests.some(q=>q.active&&/운동/.test(q.name)&&d.done[q.id])){ S.bodyDays[t]=1; bodySync(); } }
function labCover(q){ const K=[['커피','(?:^|[^논])커피|coffee'],['논커피','논커피|non|밀크'],['티','티|tea'],['에이드','에이드|ade|스무디'],['디저트','디저트|dessert']];
  return '<div style="margin-top:8px">'+K.map(([n,re])=>{ const ok=q.recipes.some(r=>!r.archived&&r.status==='COMPLETE'&&new RegExp(re,'i').test(r.cat||'')); return `<span class="chip" style="color:var(--ink);${ok?'':'opacity:.4'}">${ok?'✓':'○'} ${n}</span>`; }).join('')+'</div>'; }
function seedMore(){
  if(!S.achSeed2){ extraAch().forEach(d=>{ if(!S.achievements.find(x=>x.id===d.id)) S.achievements.push(d); }); S.achSeed2=1; }
  const pr={r1:30,r2:100,r3:50,r4:30,r5:150};
  S.rewards.forEach(r=>{ if(r.price==null){ r.price=pr[r.id]||0; if(!pr[r.id]) r.owned=true; } });
  S.pantry=S.pantry||[]; if(!S.firstSeen) S.firstSeen=Date.now();
  if(!S.achSeed3){ extraAch2().forEach(d=>{ if(!S.achievements.find(x=>x.id===d.id)) S.achievements.push(d); }); S.achSeed3=1; }
  if(!S.rewardSeed3){ newRewards().forEach(d=>S.rewards.push(d)); S.rewardSeed3=1; }
  if(!S.rewardSeed4){ newRewards2().forEach(d=>{ if(!S.rewards.find(x=>x.id===d.id)) S.rewards.push(d); }); S.rewardSeed4=1; }
  if(!S.achSeed4){ extraAch3().forEach(d=>{ if(!S.achievements.find(x=>x.id===d.id)) S.achievements.push(d); }); S.achSeed4=1; }
  if(S.rewardSeed5||S.gateSeen!=null){ S.rewards=S.rewards.filter(r=>!/^rn(4[6-9]|[5-9]\d)$/.test(r.id)||r.owned||r.redeemed||(r.uses||0)>0); delete S.rewardSeed5; delete S.gateSeen; }
  S.achievements.forEach(a=>{ if(a.gold==null) a.gold=20; });
}
function extraAch(){ const A=(id,name,desc,cond,gold,h)=>({id,name,desc,cond,gold,hidden:!!h,unlocked:false});
  return [A('b1','🥉 열흘의 기세','데일리 퀘스트 누적 10일 클리어',{type:'totalClear',value:10},20),
  A('b2','🥈 한 달의 모험가','누적 30일 클리어',{type:'totalClear',value:30},50),
  A('b3','🥇 백 일의 전설','누적 100일 클리어',{type:'totalClear',value:100},150),
  A('b4','🥈 2주 연속','14일 연속 클리어',{type:'streak',value:14},50),
  A('b5','🥇 30일의 불꽃','30일 연속 클리어',{type:'streak',value:30},120),
  A('b6','🥉 첫 상환','빚 5% 상환',{type:'debtPct',value:5},20),
  A('b7','🥈 반환점','빚 50% 상환',{type:'debtPct',value:50},80),
  A('b8','🥈 다섯 번째 씨앗','유튜브 영상 5개 완성',{type:'videos',value:5},50),
  A('b9','🥇 열 번째 영상','유튜브 영상 10개 완성',{type:'videos',value:10},100),
  A('b10','🥉 30일의 몸','BODY 30일 실천',{type:'bodyDays',value:30},30),
  A('b11','🥈 90일의 몸','BODY 90일 실천',{type:'bodyDays',value:90},80),
  A('b12','🥇 180일의 완주','BODY 180일 실천',{type:'bodyDays',value:180},200),
  A('b13','🥉 첫 완성 메뉴','레시피 1개를 COMPLETE로',{type:'recipeDone',value:1},30),
  A('b14','🥈 메뉴판이 채워져요','COMPLETE 레시피 5개',{type:'recipeDone',value:5},60),
  A('b15','🥈 레시피 25개','레시피 25개 만들기',{type:'recipes',value:25},80),
  A('b16','🌙 첫 굿나잇','하루 마무리 첫 기록',{type:'nightCount',value:1},15),
  A('b17','🌙 고요한 밤','하루 마무리 30회',{type:'nightCount',value:30},60),
  A('b18','🌙 밤의 수호자','하루 마무리 100회',{type:'nightCount',value:100},150),
  A('h1','새벽의 기록자','새벽 4~6시에 첫 퀘스트를 체크했어요',{type:'flag',key:'dawn'},40,1),
  A('h2','돌아온 모험가','클리어 못 한 다음 날 다시 클리어했어요',{type:'flag',key:'comeback'},40,1)]; }

const QUOTES=[
['속담','시작이 반이다',''],['속담','천 리 길도 한 걸음부터',''],['속담','급할수록 돌아가라',''],['속담','고생 끝에 낙이 온다',''],
['속담','하늘이 무너져도 솟아날 구멍이 있다',''],['속담','지성이면 감천이다',''],['속담','비 온 뒤에 땅이 굳는다',''],['속담','티끌 모아 태산',''],
['속담','호랑이에게 물려 가도 정신만 차리면 산다',''],['속담','가는 말이 고와야 오는 말이 곱다',''],['속담','뜻이 있는 곳에 길이 있다',''],
['소설 속 한마디','내일은 아직 아무 실수도 하지 않은 새로운 날이잖아요.','빨강머리 앤'],
['소설 속 한마디','내일은 내일의 태양이 떠오를 거야.','바람과 함께 사라지다'],
['소설 속 한마디','집처럼 좋은 곳은 없어.','오즈의 마법사'],
['희곡 속 한마디','잠은 근심으로 헝클어진 실타래를 풀어 준다.','셰익스피어, 맥베스'],
['명언','천천히 꾸준히 가는 자가 결국 경주에서 이긴다.','이솝 우화'],
['명언','배우고 때때로 익히면 또한 기쁘지 아니한가.','공자'],
['명언','우리는 삶이 짧아서가 아니라, 낭비해서 짧게 느낀다.','세네카'],
['명언','오늘 하루를 온전히 살아낸 사람은 편히 잠들 자격이 있다.','세네카의 편지 중에서'],
['명언','어려운 일도 시작하기 전에는 가장 크게 느껴진다.','격언'],
['명언','작은 일을 성실히 하는 사람이 큰일도 해낸다.','격언']];
const BREATH=['코로 4초 들이쉬고, 7초 멈추고, 8초 내쉬어요. 세 번만 해봐요.','오늘 있었던 일 중 좋았던 것 하나만 떠올리고 살짝 웃어 봐요.','발끝부터 힘을 풀어 볼까요. 발, 종아리, 어깨, 얼굴 순서로요.'];
function pickBy(a,salt){ const d=Math.floor(Date.parse(todayStr())/864e5); return a[(d*7+(salt||0))%a.length]; }
function prevDate(){ const y=new Date(todayStr()+'T00:00:00Z'); y.setUTCDate(y.getUTCDate()-1); return y.toISOString().slice(0,10); }
function curStreak(){ let n=0; const d=new Date(todayStr()+'T00:00:00Z'); const g=()=>S.history[d.toISOString().slice(0,10)]||{}; if(!g().cleared&&!g().pass) d.setUTCDate(d.getUTCDate()-1); while(g().cleared||g().pass){ if(g().cleared) n++; d.setUTCDate(d.getUTCDate()-1); } return n; }
function renderNightBtn(){
  const el=document.getElementById('homeNight'); if(!el) return;
  const t=todayStr(), h=kstNow().getUTCHours(), rec=S.sleepLog&&S.sleepLog[t], late=h>=21||h<dayStartH(), y=S.sleepLog&&S.sleepLog[prevDate()];
  const morning = (!rec&&y&&h>=dayStartH()&&h<12) ? `<div class="night-done">☀️ 어제는 ${y.time}에 잠들었어요. 잘 잤나요?</div>` : '';
  renderPass(); el.innerHTML = backupNag() + lvHTML() + morning + (!late ? '' : rec ? `<div class="night-done">🌙 오늘 하루는 마무리했어요 · ${rec.time} · <a onclick="openNight(true)">다시 보기</a></div>`
    : `<button class="night-btn ${late?'glow':''}" onclick="openNight()">🌙 하루 마무리${late?' · 이제 잘 시간이에요':''}</button>`);
}
let NT=null;
function openNight(replay){
  const c=computeToday(), h=kstNow().getUTCHours(), st=curStreak(), nm=c.active.filter(q=>c.day.done[q.id]).map(q=>q.name);
  let line;
  if(h<dayStartH()) line=pickBy(['많이 늦었어요. 지금 자도 충분히 회복할 수 있어요. 어서 눈을 감아요.','새벽이 가까워요. 오늘은 여기까지, 이제 푹 자요.']);
  else if(h>=19&&h<22) line=pickBy(['오늘은 일찍 자는 날이네요. 정말 좋은 선택이에요.','일찍 쉬는 것도 오늘의 멋진 퀘스트예요.']);
  else if(c.cleared&&st>=3) line=`${st}일째 이어가는 중이에요. 오늘 푹 자면 내일도 문제없어요.`;
  else if(c.cleared) line=pickBy(['오늘의 페이지는 여기서 덮어요. 정말 잘했어요.','오늘도 멋졌어요. 이제 마음 놓고 쉬어요.']);
  else line=pickBy(['오늘은 좀 힘들었나 봐요. 괜찮아요, 내일 다시 펼치면 돼요. 지금은 쉬는 게 퀘스트예요.','못 한 것보다 해낸 것을 봐요. 내일은 새 페이지예요.']);
  const recap = nm.length ? `오늘 해낸 일 (${c.doneCount}/${c.active.length}): ${esc(nm.slice(0,3).join(', '))}${nm.length>3?' 외 '+(nm.length-3)+'개':''}` : '오늘은 쉬어 간 하루였네요.';
  const dn=Math.floor(Date.parse(todayStr())/864e5);
  NT={replay:!!replay,step:0,note:'',line,recap:`LV ${lvInfo().n} ${lvInfo().title} · `+recap,quote:QUOTES[(dn*5+c.doneCount)%QUOTES.length],breath:pickBy(BREATH,3)};
  nightRender(); document.getElementById('night').classList.add('show');
}
setInterval(()=>{ try{ renderNightBtn(); }catch(e){ LQ.err(e); } },60000);
function nightGo(n){ const ta=document.getElementById('nightNote'); if(ta) NT.note=ta.value.trim(); NT.step=n; nightRender(); }
function nightRender(){
  const n=NT, st=['top:8%;left:12%','top:14%;right:16%;animation-delay:1s','bottom:18%;left:20%;animation-delay:.5s','bottom:10%;right:12%;animation-delay:1.6s'].map(x=>`<span class="nstar" style="${x}">✦</span>`).join('');
  let b;
  if(n.step===0) b=`${mascotImg(84,'sleepy')}<div class="nbub">${n.recap}<br><br>${n.line}</div><button class="nbtn" onclick="nightGo(1)">다음</button>`;
  else if(n.step===1) b=`${mascotImg(64)}<div class="nbub">머릿속에 남은 생각을 한 줄만 내려놓고 가요.<br>오늘 잘한 일, 감사한 일, 내일 제일 먼저 할 일 하나.</div><textarea id="nightNote" rows="3" placeholder="한 줄이면 충분해요 (건너뛰어도 돼요)">${esc(n.note)}</textarea><div><button class="nbtn" onclick="nightGo(2)">다음</button></div>`;
  else if(n.step===2){ const q=n.quote; b=`<div style="font-size:12px;color:#9d97c0;margin-bottom:4px">오늘 밤의 한마디</div><div class="nq">“${esc(q[1])}”<small>${q[0]}${q[2]?' · '+esc(q[2]):''}</small></div><div class="nbub">${n.breath}</div><button class="nbtn" onclick="nightFinish()">잘 자요 🌙</button>`; }
  else b=`<div style="font-size:54px">🌙</div><div class="big">GOOD NIGHT</div><div class="nbub">이제 폰 내려놓고 자요.<br>내일 아침에 만나요.</div>${new Date(todayStr()+'T00:00:00Z').getUTCDay()===0?'<button class="nbtn" onclick="closeNight();openWeekly()">📊 이번 주 리뷰</button>':''}<button class="nbtn" onclick="sleepSound()">🎵 오르골 15분</button><button class="nbtn" onclick="closeNight()">닫기</button>`;
  document.getElementById('night').innerHTML=st+b;
}
function nightFinish(){
  const n=NT;
  if(!n.replay){
    const t=todayStr(), k=kstNow(), tm=String(k.getUTCHours()).padStart(2,'0')+':'+String(k.getUTCMinutes()).padStart(2,'0');
    S.sleepLog[t]={time:tm,note:n.note,quote:n.quote[1]}; if(k.getUTCHours()<dayStartH()) S.flags.midnight=true;
    const sq=S.dailyQuests.find(q=>q.active&&/취침/.test(q.name));
    if(sq){ const d=S.history[t]||{done:{}}; d.done[sq.id]=true; S.history[t]=d; }
    const before=!!(S.history[t]&&S.history[t].cleared); computeToday(); earnDay('night',2);
    if(!before&&S.history[t].cleared){ celebClear(); earnDay('clear',5); comebackCheck(); chestCheck(); }
    save(); checkAchievements(); renderHome();
  }
  n.step=3; nightRender();
}
function closeNight(){ document.getElementById('night').classList.remove('show'); }
let sleepT=null;
function sleepSound(){
  if(!initAudio()) return; window._sleepOn=true; stopBgm(); clearInterval(sleepT);
  const end=Date.now()+15*60e3, p=[72,76,79,76,74,79,72,67]; let i=0;
  sleepT=setInterval(()=>{ const left=end-Date.now(); if(left<=0){ clearInterval(sleepT); window._sleepOn=false; return; } bell(mf(p[i++%8]),actx.currentTime+.05,2.2,.08*Math.min(1,left/18e4),sfxGain); },1400);
  toast('🎵 15분 뒤 서서히 꺼져요');
}

window.alert=function(m){ toast(String(m)); };
function askDlg(title,inner,onOk,onNo){
  const o=document.getElementById('askOv');
  o.innerHTML=`<div class="ask-box"><div class="ask-t">${esc(title)}</div>${inner}<div class="inline"><button class="ghost-btn" id="askNo">취소</button><button class="gold-btn" id="askYes">확인</button></div></div>`;
  o.classList.add('show'); const inp=document.getElementById('askIn'); if(inp) setTimeout(()=>inp.focus(),60);
  const done=ok=>{ const v=inp?inp.value:''; o.classList.remove('show'); o.innerHTML=''; if(ok) onOk(v); else if(onNo) onNo(); };
  document.getElementById('askNo').onclick=()=>done(false); document.getElementById('askYes').onclick=()=>done(true);
  if(inp) inp.onkeydown=e=>{ if(e.key==='Enter'&&inp.tagName==='INPUT') done(true); };
}
function askText(title,def,cb,opt){ opt=opt||{};
  askDlg(title, `<${opt.multi?'textarea':'input'} id="askIn" ${opt.multi?'rows="3">'+esc(def||'')+'</textarea>':(opt.num?'type="number" inputmode="numeric" ':'')+'value="'+esc(def==null?'':def)+'">'}`, cb); }
function askOk(msg,cb,no){ askDlg(msg,'',cb,no); }

function extraAch2(){ const A=(id,name,desc,cond,gold,h)=>({id,name,desc,cond,gold,hidden:!!h,unlocked:false});
  return [
  A('c1','🥈 반백일의 기록','데일리 퀘스트 누적 50일 클리어',{type:'totalClear',value:50},70),
  A('c2','🥇 이백 번의 아침','누적 200일 클리어',{type:'totalClear',value:200},200),
  A('c3','👑 한 해의 모험가','누적 365일 클리어',{type:'totalClear',value:365},300),
  A('c4','🥉 닷새의 리듬','5일 연속 클리어',{type:'streak',value:5},25),
  A('c5','🥈 21일의 습관','21일 연속 클리어',{type:'streak',value:21},70),
  A('c6','🥇 50일 연속','50일 연속 클리어',{type:'streak',value:50},150),
  A('c7','👑 100일의 불꽃','100일 연속 클리어',{type:'streak',value:100},300),
  A('c8','✨ 완벽한 하루','하루 퀘스트를 100% 완료',{type:'flag',key:'perfect'},30),
  A('c9','🥉 첫 10%','빚 10% 상환',{type:'debtPct',value:10},30),
  A('c10','🥈 4분의 1','빚 25% 상환',{type:'debtPct',value:25},60),
  A('c11','🥇 마지막 고비','빚 75% 상환',{type:'debtPct',value:75},120),
  A('c12','👑 스무 편의 창작','유튜브 영상 20개 완성',{type:'videos',value:20},200),
  A('c13','📏 첫 몸 기록','몸 기록 첫 입력',{type:'bodyLogs',value:1},15),
  A('c14','📏 기록의 습관','몸 기록 10회',{type:'bodyLogs',value:10},40),
  A('c15','🥈 60일의 몸','BODY 60일 실천',{type:'bodyDays',value:60},60),
  A('c16','🥇 120일의 몸','BODY 120일 실천',{type:'bodyDays',value:120},120),
  A('c17','👑 레시피 50개','레시피 50개 만들기',{type:'recipes',value:50},150),
  A('c18','🥇 메뉴판 완성','COMPLETE 레시피 10개',{type:'recipeDone',value:10},100),
  A('c19','🥈 카페 여정 반환점','404 준비 4단계 완료',{type:'stages',value:4},60),
  A('c20','🌙 일찍 자는 습관','23시 전 마무리 7회',{type:'earlySleep',value:7},40),
  A('c21','🌙 규칙적인 수면','23시 전 마무리 30회',{type:'earlySleep',value:30},100),
  A('c22','📓 밤의 일기','밤 한 줄 일기 7회',{type:'journal',value:7},40),
  A('c23','📓 한 달의 일기','밤 한 줄 일기 30회',{type:'journal',value:30},100),
  A('c24','🎁 첫 보상','보물 첫 사용',{type:'rewardsUsed',value:1},20),
  A('c25','🎁 보상 마스터','보물 10개 사용',{type:'rewardsUsed',value:10},60),
  A('h3','올빼미의 반성','자정 넘어 하루 마무리를 눌렀어요',{type:'flag',key:'midnight'},20,1)]; }
function extraAch3(){ const A=(id,name,desc,cond,gold,h)=>({id,name,desc,cond,gold,hidden:!!h,unlocked:false});
  return [
  A('d1','🛒 첫 구매','보물을 처음으로 구매',{type:'buyCount',value:1},10),
  A('d2','🌱 사흘의 발자국','데일리 퀘스트 누적 3일 클리어',{type:'totalClear',value:3},10),
  A('d3','🌙 세 번의 밤','하루 마무리 3회',{type:'nightCount',value:3},12),
  A('d4','📏 세 번의 기록','몸 기록 3회',{type:'bodyLogs',value:3},12),
  A('d5','🍵 세 번째 잔','레시피 3개 만들기',{type:'recipes',value:3},15),
  A('d6','🎁 보상 세 번','보물 3개 사용',{type:'rewardsUsed',value:3},15),
  A('d7','💪 첫 실천','BODY 첫 실천',{type:'bodyDays',value:1},10),
  A('d8','🌿 닷새의 발자국','누적 5일 클리어',{type:'totalClear',value:5},15),
  A('d9','🌙 일주일의 밤','하루 마무리 7회',{type:'nightCount',value:7},20),
  A('d10','🌙 이른 첫 잠','23시 전 마무리 1회',{type:'earlySleep',value:1},10),
  A('d11','📓 첫 밤의 일기','밤 한 줄 일기 1회',{type:'journal',value:1},10),
  A('d12','🎬 두 번째 영상','유튜브 영상 2개 완성',{type:'videos',value:2},20),
  A('d13','✨ 스무 날의 기록','누적 20일 클리어',{type:'totalClear',value:20},30),
  A('d14','🔥 열흘 연속','10일 연속 클리어',{type:'streak',value:10},35),
  A('d15','💪 2주의 몸','BODY 14일 실천',{type:'bodyDays',value:14},25),
  A('d16','💪 일주일의 몸','BODY 7일 실천',{type:'bodyDays',value:7},15),
  A('d17','🍵 레시피 5개','레시피 5개 만들기',{type:'recipes',value:5},25),
  A('d18','🥉 완성 메뉴 3개','COMPLETE 레시피 3개',{type:'recipeDone',value:3},40),
  A('d19','🧭 카페 여정 두 걸음','404 준비 2단계 완료',{type:'stages',value:2},30),
  A('d20','📏 다섯 번의 기록','몸 기록 5회',{type:'bodyLogs',value:5},20),
  A('d21','📏 스무 번의 기록','몸 기록 20회',{type:'bodyLogs',value:20},60),
  A('d22','🌙 스무 밤','하루 마무리 20회',{type:'nightCount',value:20},40),
  A('d23','🌙 일찍 자기 3회','23시 전 마무리 3회',{type:'earlySleep',value:3},20),
  A('d24','🌙 일찍 자기 14회','23시 전 마무리 14회',{type:'earlySleep',value:14},60),
  A('d25','📓 열다섯 밤의 일기','밤 한 줄 일기 15회',{type:'journal',value:15},60),
  A('d26','🎁 보물 5개 사용','보물 5개 사용',{type:'rewardsUsed',value:5},30),
  A('d27','🎁 보물 20개 사용','보물 20개 사용',{type:'rewardsUsed',value:20},100),
  A('d28','🛒 열 번의 구매','보물 10회 구매',{type:'buyCount',value:10},40),
  A('d29','🛒 서른 번의 구매','보물 30회 구매',{type:'buyCount',value:30},90),
  A('d30','💰 500골드의 모험','누적 획득 골드 500',{type:'goldTotal',value:500},40),
  A('d31','💰 2,000골드의 모험','누적 획득 골드 2,000',{type:'goldTotal',value:2000},90),
  A('d32','💰 5,000골드의 모험','누적 획득 골드 5,000',{type:'goldTotal',value:5000},200),
  A('d33','🏅 업적 20개','업적 20개 해금',{type:'achCount',value:20},60),
  A('d34','🏅 업적 50개','업적 50개 해금',{type:'achCount',value:50},150),
  A('d35','🎉 첫 이벤트 클리어','이달의 이벤트 1개 클리어',{type:'eventClear',value:1},30),
  A('d36','🎉 이벤트 5개 클리어','이벤트 5개 클리어',{type:'eventClear',value:5},80),
  A('d37','🧺 첫 재료','재료 창고에 재료 1개 등록',{type:'pantry',value:1},20),
  A('d38','🧺 재료 열 가지','재료 창고에 재료 10개 등록',{type:'pantry',value:10},60),
  A('d39','🕯️ 알레센도의 첫 선물','알레센도의 선물 1개 받기',{type:'giftGot',value:1},30),
  A('d40','🕯️ 선물 세 개','알레센도의 선물 3개 받기',{type:'giftGot',value:3},80),
  A('d41','🗓️ 150일의 기록','누적 150일 클리어',{type:'totalClear',value:150},150),
  A('d42','🗓️ 500일의 기록','누적 500일 클리어',{type:'totalClear',value:500},400),
  A('d43','🔥 150일 연속','150일 연속 클리어',{type:'streak',value:150},350),
  A('d44','💬 로웨나와 첫 대화','로웨나와 AI 대화 1회',{type:'chatTurns',value:1},20),
  A('d45','💬 열 번의 대화','로웨나와 AI 대화 10회',{type:'chatTurns',value:10},50)]; }
function newRewards2(){ const R=(n,name,price,rp)=>({id:'rn'+n,name,price,owned:false,redeemed:false,repeatable:!!rp});
  return [R(15,'🎵 좋아하는 노래 크게 듣기',10,1),R(16,'📺 유튜브 자유 시청 30분',15,1),R(17,'🍵 여유로운 티타임',15,1),R(18,'🍦 아이스크림 한 개',20,1),R(19,'😴 20분 낮잠',20,1),
  R(20,'🧁 베이커리 한 조각',25,1),R(21,'🎮 게임 1시간 추가',30,1),R(22,'📚 웹소설·만화 몰아보기 1시간',30,1),R(23,'🚶 목적 없는 산책 1시간',35,1),R(24,'🛌 늦잠 30분 허용',35,1),
  R(25,'🍕 배달 음식 한 끼',45,1),R(26,'🕯️ 향초·룸스프레이',50,1),R(27,'☕ 원두 한 봉지',55,1),
  R(28,'🎧 하루 종일 음악 감상 데이',60),R(29,'🖊️ 예쁜 문구류',70),R(30,'🌸 꽃 한 다발',80),R(31,'🍷 분위기 좋은 저녁 식사',110),R(32,'🧴 스킨케어·바디 제품',120),
  R(33,'🎲 보드게임 카페',130),R(34,'🕰️ 방 꾸미기 소품',160),R(35,'🎤 노래방',150),R(36,'🧖 스파·찜질방',180),R(37,'🎁 소중한 사람에게 선물하기',200),R(38,'🍿 영화관 나들이',220),
  R(39,'🎧 좋은 이어폰·헤드폰',600),R(40,'🪑 작업 환경 업그레이드',450),R(41,'♨️ 온천·료칸 하루',1000),R(42,'🍽️ 코스 요리 파인다이닝',700),R(43,'🎙️ 유튜브 장비 한 가지',900),R(44,'💍 나에게 주는 큰 선물',1200),R(45,'🏖️ 2박 3일 휴가',1500)]; }
function newRewards(){ const R=(id,name,price)=>({id,name,price,owned:false,redeemed:false});
  return [R('rn1','🧋 좋아하는 음료 한 잔',20),R('rn2','🍫 간식 사기',25),R('rn3','📱 SNS 자유 30분',20),R('rn4','🛁 오래 목욕하기',30),R('rn5','🎬 영화 한 편',40),
  R('rn6','🍽️ 맛집 외식',100),R('rn7','🛍️ 작은 쇼핑 (3만원)',120),R('rn8','🎨 새 취미 재료',130),R('rn9','💆 마사지·휴식',200),
  R('rn10','🎟️ 공연·전시 관람',250),R('rn11','👕 옷 한 벌',300),R('rn12','🧳 당일치기 여행',400),R('rn13','🎁 갖고 싶던 물건',500),R('rn14','🌴 1박 2일 여행',800)]; }

const PG={ach:0,tre:0,ed:0}, PER=6, PERK={tre:5}, FIL={ach:'all',tre:'shop'};
function pgSlice(k,l){ const P=PERK[k]||PER, n=Math.max(1,Math.ceil(l.length/P)); PG[k]=Math.min(PG[k],n-1); return l.slice(PG[k]*P,PG[k]*P+P); }
function pgHTML(k,total){ const n=Math.max(1,Math.ceil(total/(PERK[k]||PER))); if(n<=1) return '';
  return `<div class="pager"><button onclick="pgGo('${k}',-1,${n})">‹</button><span>${PG[k]+1} / ${n}</span><button onclick="pgGo('${k}',1,${n})">›</button></div>`; }
function pgGo(k,d,n){ const y=window.scrollY; PG[k]=n>1?(PG[k]+d+n)%n:0; ({ach:renderAchievements,tre:renderTreasure,ed:renderAchEditList})[k](); if(window.scrollTo) window.scrollTo(0,y); }
function pgSet(k,v){ FIL[k]=v; PG[k]=0; ({ach:renderAchievements,tre:renderTreasure})[k](); }
function tabsHTML(k,a){ return '<div class="ftabs">'+a.map(([v,l])=>`<button class="${FIL[k]===v?'on':''}" onclick="pgSet('${k}','${v}')">${l}</button>`).join('')+'</div>'; }
const ACH_ORDER=['a1', 'd7', 'b16', 'd10', 'd11', 'c13', 'a6', 'a8', 'd1', 'c24', 'd2', 'a2', 'd3', 'd23', 'd4', 'd5', 'd6', 'd12', 'c4', 'd8', 'a3', 'd9', 'd16', 'd20', 'd17', 'd26', 'b1', 'a9', 'b13', 'c22', 'd14', 'b4', 'd15', 'd13', 'd18', 'c20', 'c14', 'd28', 'c8', 'b6', 'c5', 'b2', 'b10', 'b14', 'b8', 'd24', 'd25', 'a7', 'c9', 'd22', 'b5', 'c1', 'd21', 'd29', 'd30', 'd33', 'd36', 'd37', 'd39', 'b17', 'c15', 'c10', 'c21', 'c23', 'c18', 'b9', 'b15', 'c19', 'd19', 'h2', 'b11', 'c6', 'b3', 'd31', 'd40', 'h1', 'h3', 'd34', 'c25', 'd35', 'c16', 'c17', 'c12', 'd41', 'c11', 'b18', 'd32', 'b7', 'd38', 'b12', 'c7', 'c2', 'a5', 'a4', 'c3', 'd43', 'd42', 'd44', 'd45', 'd27'];
function achView(){ const idx={}; ACH_ORDER.forEach((id,i)=>{ idx[id]=i; });
  const cat=S.achievements.filter(a=>a.id in idx), catUn=cat.filter(a=>a.unlocked).length, open=10*(1+Math.floor(catUn/10));
  const vis=S.achievements.filter(a=>!(a.id in idx)||a.unlocked||idx[a.id]<open).sort((a,b)=>((a.id in idx)?idx[a.id]:999)-((b.id in idx)?idx[b.id]:999));
  return {vis,hidden:S.achievements.length-vis.length,prog:catUn%10}; }
function renderAchievements(){
  const all=S.achievements, un=all.filter(a=>a.unlocked).length, f=FIL.ach, V=achView();
  const list=V.vis.filter(a=>f==='all'||(f==='on'?a.unlocked:!a.unlocked));
  const rows=pgSlice('ach',list).map(a=>{ const h=a.hidden&&!a.unlocked;
    return `<div class="seal ${a.unlocked?'':'locked'}"><div class="icon">${a.unlocked?'✦':'🔒'}</div><div style="flex:1"><div class="t">${h?'???':esc(a.name)}${a.unlocked?' · 해금':''}</div><div class="d">${h?'숨겨진 업적이에요':esc(a.desc||'')}</div><div class="d" style="opacity:.7;margin-top:3px">조건: ${h?'???':condLabel(a.cond)} · ◈${halfG(a.gold||20)}${a.unlocked&&a.unlockedAt?' · '+a.unlockedAt:''}</div>${(!a.unlocked&&(!a.cond||a.cond.type==='manual'))?`<button class="ghost-btn" style="margin-top:6px" onclick="manualUnlock('${a.id}')">달성 처리</button>`:''}</div></div>`; }).join('')||'<div class="empty">해당하는 업적이 없어요</div>';
  document.getElementById('achieveList').innerHTML=tabsHTML('ach',[['all','전체'],['on','해금'],['off','잠김']])+rows+pgHTML('ach',list.length);
}
function rwState(r){ if(r.redeemed) return 'used'; return (r.owned||!(r.price>0))?'own':'shop'; }
function rwTier(r){ const p=r.price||0; return p>=250?['전설','#e9be5a']:p>=60?['희귀','#8fb7d9']:['일반','#9db091']; }
function renderTreasure(){
  const cnt=k=>S.rewards.filter(r=>rwState(r)===k).length;
  const list=S.rewards.filter(r=>rwState(r)===FIL.tre).sort((a,b)=>(a.price||0)-(b.price||0));
  const rows=pgSlice('tre',list).map(r=>{ const [tn,tc]=rwTier(r), st=rwState(r); let b; const rep=`<button class="mini-x" style="margin-right:4px;opacity:${r.repeatable?1:.4}" onclick="toggleRep('${r.id}')">↻</button>`;
    if(st==='used') b='<span class="redeemed">사용됨</span>';
    else if(st==='own') b=`<button class="ghost-btn" onclick="redeem('${r.id}')">사용하기</button>`;
    else b=`<button class="ghost-btn" style="${(S.gold||0)>=r.price?'':'opacity:.45'}" onclick="buyReward('${r.id}')">◈ ${r.price} 구매</button>`;
    return `<div class="treasure-row"><span class="t">${esc(r.name)}<small style="color:${tc};margin-left:6px">${tn}${r.uses?' · '+r.uses+'회 사용':''}</small></span><span>${st!=='used'?rep:''}${b}</span></div>`; }).join('')||'<div class="empty">여기엔 아직 아무것도 없어요</div>';
  document.getElementById('treasureList').innerHTML=`<div class="gold-bar">◈ 골드 ${(S.gold||0).toLocaleString()}</div>${chestBtn()}`+tabsHTML('tre',[['shop','상점 '+cnt('shop')],['own','보유 '+cnt('own')],['used','사용됨 '+cnt('used')]])+rows+pgHTML('tre',list.length);
}


function backupNag(){ const t=todayStr(); if(S.backupSnooze===t) return ''; const days=Math.floor((Date.now()-(S.lastBackup||S.firstSeen||Date.now()))/864e5); if(days<7) return '';
  return `<div class="night-done" style="border:1px solid var(--gold-d);border-radius:6px;padding:8px">💾 ${S.lastBackup?'마지막 백업 후 '+days+'일이 지났어요':'아직 백업한 적이 없어요'}. <a onclick="goBackup()">지금 백업하기</a> · <a onclick="S.backupSnooze=todayStr();save();renderHome()">오늘은 넘기기</a></div>`; }
function goBackup(){ showScreen('master'); exportBackup(); }
function weekKey(ds){ const d=new Date(ds+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7); return d.toISOString().slice(0,10); }
function passUsedWeek(){ const w=weekKey(todayStr()); return Object.keys(S.history).some(k=>S.history[k].pass&&weekKey(k)===w); }
function renderPass(){ const el=document.getElementById('passRow'); if(!el) return; const on=!!(S.history[todayStr()]||{}).pass;
  el.innerHTML= on?`<button class="ghost-btn" style="color:var(--brown)" onclick="usePass()">☾ 오늘은 쉬는 날이에요 (취소)</button>`:passUsedWeek()?`<div style="font-size:11px;color:var(--ink-soft)">☾ 이번 주 쉬는 날 패스는 사용했어요</div>`:`<button class="ghost-btn" style="color:var(--brown)" onclick="usePass()">☾ 오늘은 쉬는 날 (주 1회)</button>`; }
function usePass(){ const t=todayStr(), d=S.history[t]||{done:{}}; S.history[t]=d;
  if(d.pass){ d.pass=false; save(); renderHome(); return; }
  askOk('오늘을 쉬는 날로 할까요?\n연속 기록이 끊기지 않아요. (주 1회)',()=>{ d.pass=true; save(); renderHome(); renderCalendar(); toast('☾ 푹 쉬어요'); }); }
function xpNow(){ let x=0; Object.values(S.history).forEach(d=>{ x+=Object.values(d.done||{}).filter(Boolean).length*1+(d.cleared?5:0); }); return x+Object.keys(S.sleepLog||{}).length*2+S.achievements.filter(a=>a.unlocked).length*10; }
const TITLES=['견습 모험가','떠오르는 모험가','숙련 모험가','길잡이','용맹한 탐험가','이야기꾼','전설의 서기','별을 읽는 자','404의 주인','끝없는 여정의 주인'];
function lvInfo(){ const x=xpNow(); let n=1; while(x>=30*n*n) n++; return {n,x,lo:30*(n-1)*(n-1),hi:30*n*n,title:TITLES[Math.min(n-1,TITLES.length-1)]}; }
function lvHTML(){ const L=lvInfo(); return `<div class="lvbar">LV ${L.n} · ${L.title} <span style="float:right">${L.x} / ${L.hi} XP</span><div class="bar"><i style="width:${Math.round((L.x-L.lo)/(L.hi-L.lo)*100)}%"></i></div></div>`; }
function checkLevel(){ const L=lvInfo(); if(S.lastLv==null){ S.lastLv=L.n; return; } if(L.n>S.lastLv){ S.lastLv=L.n; S.gold=(S.gold||0)+10*L.n; celebrate('ach','LV '+L.n+' · '+L.title); } }
const _origCA=checkAchievements; checkAchievements=function(){ _origCA(); checkLevel(); save(); };

/* ===== 레벨 곡선 이전(1회, 레벨업 보상 중복 방지) + 연말 회고 ===== */
try{ if(!S.lvMig){ S.lvMig=1; S.lastLv=lvInfo().n; save(); } }catch(e){ LQ.err(e); }
function openYear(y){
  const cy=+todayStr().slice(0,4); y=+y||cy; const Y=String(y), H=S.history, ks=Object.keys(H).filter(d=>d.slice(0,4)===Y);
  const cl=ks.filter(d=>H[d].cleared).length, perf=ks.filter(d=>(H[d].percent||0)>=100).length, done=ks.reduce((t,d)=>t+Object.values(H[d].done||{}).filter(Boolean).length,0);
  let best=0,run=0; const end=(y===cy)?Date.parse(todayStr()):Date.UTC(y,11,31);
  for(let t=Date.UTC(y,0,1);t<=end;t+=864e5){ const r=H[new Date(t).toISOString().slice(0,10)]||{}; if(r.cleared){ run++; best=Math.max(best,run); } else if(!r.pass) run=0; }
  const mc=Array(12).fill(0); ks.forEach(d=>{ if(H[d].cleared) mc[+d.slice(5,7)-1]++; });
  const dim=m=>new Date(Date.UTC(y,m+1,0)).getUTCDate(), mx=Math.max(...mc), bm=mc.indexOf(mx);
  const bars=mc.map((n,m)=>`<div style="flex:1;text-align:center;font-size:9px"><div style="height:50px;display:flex;align-items:flex-end"><i style="display:block;width:100%;background:${m===bm&&n>0?'#b5533c':'#9a7530'};height:${Math.round(n/dim(m)*100)}%;min-height:${n?2:0}px"></i></div>${m+1}</div>`).join('');
  const sl=Object.keys(S.sleepLog||{}).filter(d=>d.slice(0,4)===Y).map(d=>S.sleepLog[d]), avg=sl.length?fmtMin(sl.reduce((t,e)=>t+bedMin(e.time),0)/sl.length):'-', jn=sl.filter(e=>e.note).length;
  const ach=S.achievements.filter(a=>a.unlocked&&String(a.unlockedAt||'').slice(0,4)===Y).length;
  const debt=S.mainQuests.filter(q=>q.type==='debt').reduce((t,q)=>t+(q.payLog||[]).filter(e=>e.date.slice(0,4)===Y).reduce((u,e)=>u+e.amt,0),0);
  const vids=S.mainQuests.filter(q=>q.type==='youtube').reduce((t,q)=>t+(q.vLog||[]).filter(d=>d&&d.slice(0,4)===Y).length,0);
  const bl=(S.bodyLog||[]).filter(e=>e.weight>0&&e.date.slice(0,4)===Y).sort((a,b)=>a.date<b.date?-1:1), wd=bl.length>1?bl[bl.length-1].weight-bl[0].weight:null;
  const rc=((S.subQuests.find(x=>x.id==='cafelab')||{}).recipes||[]).filter(r=>String(r.created||'').indexOf(Y)>-1).length, L=lvInfo();
  const R=(i,t)=>`<div class="milestone"><span class="m-check">${i}</span>${t}</div>`;
  const hasPrev=Object.keys(H).some(d=>d.slice(0,4)===String(y-1));
  showModal(`<h2>${y} · 올해의 LIFE QUEST</h2><div class="mdesc">LV ${L.n} · ${L.title}</div>
    ${R('✓',`클리어 <b>${cl}</b>일 · 만점 ${perf}일 · 최장 연속 <b>${best}</b>일`)}${R('⚔',`완료한 데일리 퀘스트 ${done.toLocaleString()}개`)}
    <div class="modal-sec-h">월별 클리어 비율</div><div class="inline" style="gap:3px;align-items:flex-end">${bars}</div>${mx>0?`<div class="rc-sum">${bm+1}월이 가장 꾸준했어요 (${mx}일 클리어).</div>`:''}
    <div class="modal-sec-h">이 해의 발자국</div>
    ${R('☾',`평균 취침 ${avg} · 마무리 ${sl.length}회 · 밤 한 줄 ${jn}회`)}${R('✦',`달성한 업적 ${ach}개`)}
    ${debt>0?R('◈',`상환 ${debt.toLocaleString()}원`):''}${vids>0?R('▶',`완성한 영상 ${vids}개`):''}${rc>0?R('☕',`새 레시피 ${rc}개`):''}${wd!=null?R('♡',`체중 변화 ${wd>0?'+':''}${wd.toFixed(1)}kg (기록 ${bl.length}회)`):''}
    <div class="rc-sum" style="margin-top:12px">${cl>=200?'정말 긴 여정을 성실하게 걸어왔어요.':cl>=60?'꾸준히 쌓은 한 해였어요. 그 시간이 다 남아 있어요.':cl>0?'시작한 것만으로도 충분히 큰 걸음이에요.':'아직 이 해의 기록이 없어요.'}</div>
    <div class="inline" style="margin-top:10px">${hasPrev?`<button class="ghost-btn" style="flex:1;color:var(--brown)" onclick="openYear(${y-1})">‹ ${y-1}</button>`:''}${y<cy?`<button class="ghost-btn" style="flex:1;color:var(--brown)" onclick="openYear(${y+1})">${y+1} ›</button>`:''}</div>`);
}
function chestCheck(){ const st=curStreak(), k=todayStr()+'chest'; if(st>0&&st%7===0&&!S.goldDay[k]){ S.goldDay[k]=1; S.chests=(S.chests||0)+1; toast('📦 7일 연속! 보물상자를 얻었어요'); } }
function chestBtn(){ return (S.chests>0)?`<button class="gold-btn" style="margin:0 0 12px" onclick="openChest()">📦 보물상자 열기 (${S.chests}개)</button>`:'<div class="night-done">📦 7일 연속 클리어할 때마다 보물상자를 받아요</div>'; }
function openChest(){ if(!(S.chests>0)) return; S.chests--; const pool=S.rewards.filter(r=>rwState(r)==='shop'&&r.price<=150); let m;
  if(pool.length&&Math.random()<.6){ const r=pool[Math.floor(Math.random()*pool.length)]; r.owned=true; m='🎁 '+r.name+' 획득! (보유 탭 확인)'; } else { const g=15+Math.floor(Math.random()*36); S.gold=(S.gold||0)+g; m='◈ '+g+' 골드 획득!'; }
  save(); renderTreasure(); toast(m); }
function lastDays(n){ const o=[], d=new Date(todayStr()+'T00:00:00Z'); for(let i=0;i<n;i++){ o.unshift(d.toISOString().slice(0,10)); d.setUTCDate(d.getUTCDate()-1); } return o; }
function bedMin(t){ let m=+t.slice(0,2)*60+ +t.slice(3,5); if(m<720) m+=1440; return m; }
function fmtMin(m){ m=Math.round(m)%1440; return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); }
function showModal(h){ document.getElementById('modalBox').innerHTML='<button class="modal-close" onclick="closeModal()">✕</button>'+h; document.getElementById('modalOverlay').classList.add('show'); }
function openWeekly(){
  const ds=lastDays(7), R=ds.map(d=>S.history[d]||{}), cl=R.filter(r=>r.cleared).length, ps=R.filter(r=>r.pass).length, sl=ds.map(d=>S.sleepLog[d]).filter(Boolean);
  const avg=sl.length?fmtMin(sl.reduce((a,e)=>a+bedMin(e.time),0)/sl.length):'기록 없음', L=lvInfo();
  const g=Object.keys(S.goldDay).filter(k=>ds.includes(k.slice(0,10))&&!/chest$/.test(k)).reduce((a,k)=>a+(+S.goldDay[k]||0),0);
  const notes=sl.filter(e=>e.note).map(e=>`<div class="pl-row"><span>“${esc(e.note)}”</span></div>`).join('');
  showModal(`<h2>주간 리뷰</h2><div class="mdesc">${ds[0]} ~ ${ds[6]}</div>
    <div class="milestone"><span class="m-check">✓</span>클리어한 날 ${cl} / 7${ps?' (쉬는 날 '+ps+')':''}</div>
    <div class="milestone"><span class="m-check">☾</span>평균 잠드는 시각 ${avg}</div>
    <div class="milestone"><span class="m-check">◈</span>이번 주 번 골드 ${g}</div>
    <div class="milestone"><span class="m-check">✦</span>LV ${L.n} · ${L.title}</div>
    ${weeklyExtra(ds)}<div class="modal-sec-h">밤의 한 줄</div>${notes||'<div class="empty">적은 한 줄이 없어요</div>'}
    <div class="rc-sum" style="margin-top:12px">${cl>=6?'정말 꾸준한 한 주였어요. 스스로를 칭찬해 주세요.':cl>=3?'좋은 흐름이에요. 다음 주도 이 리듬으로 가요.':'조금 쉬어 간 주였어요. 괜찮아요, 새 주가 시작돼요.'}</div>`);
}

/* ===== 보강: 상환 기록 / 주간 비교 / 영상 마감일 ===== */
function debtLogHTML(q){
  const L=(q.payLog=q.payLog||[]).slice().sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.id<b.id?-1:1);
  const paid=q.original-q.current, pct=q.original>0?Math.round(paid/q.original*100):0;
  let g='';
  if(L.length){ let bal=q.current; const pts=[bal]; for(let i=L.length-1;i>=0;i--){ bal+=L[i].amt; pts.unshift(bal); }
    const mx=Math.max(...pts,1), X=i=>8+i*(284/(pts.length-1)), Y=v=>66-v/mx*58;
    g=`<svg viewBox="0 0 300 74" width="100%" height="84"><polyline points="${pts.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}" fill="none" stroke="#9a7530" stroke-width="2"/>${pts.map((v,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.5" fill="#9a7530"/>`).join('')}</svg>`; }
  return `<div class="modal-sec-h">상환 기록</div><div class="rc-sum">지금까지 <b>${paid.toLocaleString()}원</b> 상환 · <b>${pct}%</b> 진행 (남은 ${q.current.toLocaleString()}원)</div>${g}${L.slice().reverse().slice(0,15).map(e=>`<div class="pl-row"><span>${e.date} · −${e.amt.toLocaleString()}원</span><button class="small-x" onclick="delPay('${q.id}','${e.id}')">✕</button></div>`).join('')||'<div class="empty" style="padding:6px">상환하면 여기에 기록이 쌓여요</div>'}`;
}
function delPay(qid,pid){ askOk('이 상환 기록을 삭제할까요? (남은 금액도 그만큼 되돌아가요)',()=>{ const q=S.mainQuests.find(m=>m.id===qid), e=(q.payLog||[]).find(x=>x.id===pid); if(!e) return; q.current=Math.min(q.original,q.current+e.amt); q.payLog=q.payLog.filter(x=>x.id!==pid); save(); renderQuests(); openQuestModal(qid); }); }
function weeklyExtra(ds){
  const H=S.history, prev=lastDays(14).slice(0,7), cn=a=>a.filter(d=>(H[d]||{}).cleared).length;
  const av=a=>{ const v=a.map(d=>(H[d]||{}).percent).filter(x=>typeof x==='number'); return v.length?Math.round(v.reduce((t,x)=>t+x,0)/v.length):null; };
  const a1=av(ds), a0=av(prev), dl=(a1!=null&&a0!=null)?Math.round(a1-a0):null, dc=cn(ds)-cn(prev);
  const ar=x=>x>0?'▲ '+x:x<0?'▼ '+(-x):'– 0';
  const W=['일','월','화','수','목','금','토'], acc=W.map(()=>[0,0]);
  lastDays(56).forEach(d=>{ const r=H[d]; if(!r||typeof r.percent!=='number') return; const w=new Date(d+'T00:00:00Z').getUTCDay(); acc[w][0]+=r.percent; acc[w][1]++; });
  const wk=[1,2,3,4,5,6,0].map(w=>({n:W[w],v:acc[w][1]?Math.round(acc[w][0]/acc[w][1]):null})), ok=wk.filter(x=>x.v!=null), lo=ok.length>2?ok.reduce((a,b)=>b.v<a.v?b:a):null;
  const bars=wk.map(x=>`<div style="flex:1;text-align:center;font-size:10px"><div style="height:44px;display:flex;align-items:flex-end"><i style="display:block;width:100%;background:${x===lo?'#b5533c':'#9a7530'};height:${x.v||0}%;min-height:2px"></i></div>${x.n}<br>${x.v==null?'-':x.v}</div>`).join('');
  const isNeg=e=>/^(😢|😠|😰)/.test(e.text||''), mo=(S.confess||[]).filter(e=>e.k==='mood');
  const mAvg=f=>{ const v=[...new Set(mo.filter(f).map(e=>e.d))].map(d=>(H[d]||{}).percent).filter(x=>typeof x==='number'); return v.length>=3?Math.round(v.reduce((t,x)=>t+x,0)/v.length):null; };
  const mn=mAvg(isNeg), mp=mAvg(e=>!isNeg(e));
  return `<div class="modal-sec-h">지난주와 비교</div>
    <div class="milestone"><span class="m-check">≋</span>평균 달성률 ${a1==null?'-':a1+'%'}${dl!=null?' ('+ar(dl)+'%p)':''}</div>
    <div class="milestone"><span class="m-check">✓</span>클리어 ${cn(ds)}일 (지난주 ${cn(prev)}일 · ${ar(dc)})</div>
    <div class="modal-sec-h">요일별 평균 달성률 (최근 8주)</div><div class="inline" style="gap:4px;align-items:flex-end">${bars}</div>${lo?`<div class="rc-sum">${lo.n}요일이 가장 약해요. 그날만 퀘스트를 가볍게 조정해 봐도 좋아요.</div>`:''}
    ${(mn!=null&&mp!=null)?`<div class="rc-sum">기분 체크인 기준 · 힘든 날 평균 ${mn}% / 괜찮은 날 평균 ${mp}%</div>`:''}`;
}
function dueTag(v){ if(!v.due) return ''; const d=Math.round((Date.parse(v.due)-Date.parse(todayStr()))/864e5); return ` <span class="chip" style="${d<0?'color:#b5533c':''}">${d<0?'⚠ '+(-d)+'일 지남':d===0?'D-DAY':'D-'+d}</span>`; }
function setDue(qid,vid,val){ const v=findQuest(qid).prod.find(x=>x.id===vid); if(!v) return; v.due=val||''; save(); openProdModal(qid); }
function openStats(){
  const ds=lastDays(14), pts=ds.map((d,i)=>S.sleepLog[d]?[i,bedMin(S.sleepLog[d].time)]:null).filter(Boolean), lo=1260, hi=1620;
  const X=i=>10+i*(280/13), Y=m=>70-(Math.max(lo,Math.min(hi,m))-lo)/(hi-lo)*60;
  const svg=`<svg viewBox="0 0 300 80" width="100%" height="90">${[22,24,26].map(h=>`<line x1="10" x2="290" y1="${Y(h*60)}" y2="${Y(h*60)}" stroke="#b8a877" stroke-dasharray="3"/><text x="0" y="${Y(h*60)-2}" font-size="7" fill="#5a4530">${h%24}시</text>`).join('')}${pts.length>1?`<polyline fill="none" stroke="#8f6a30" stroke-width="2" points="${pts.map(q=>X(q[0])+','+Y(q[1])).join(' ')}"/>`:''}${pts.map(q=>`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3" fill="#7a3229"/>`).join('')}</svg>`;
  const allSl=Object.values(S.sleepLog), avg=allSl.length?fmtMin(allSl.reduce((a,e)=>a+bedMin(e.time),0)/allSl.length):'-';
  const rows=S.dailyQuests.filter(q=>q.active).map(q=>{ const n=ds.filter(d=>((S.history[d]||{}).done||{})[q.id]).length; return `<div style="margin:6px 0;font-size:12.5px">${esc(q.name)} <span style="float:right">${n}/14</span><div class="bar" style="margin:3px 0"><i style="width:${n/14*100}%"></i></div></div>`; }).join('');
  showModal(`<h2>통계</h2>
    <div class="milestone"><span class="m-check">✓</span>총 클리어 ${Object.values(S.history).filter(d=>d.cleared).length}일 · 현재 연속 ${curStreak()}일</div>
    <div class="milestone"><span class="m-check">☾</span>평균 취침 ${avg} · 마무리 ${allSl.length}회</div>
    <div class="modal-sec-h">최근 14일 취침 시각</div>${pts.length?svg:'<div class="empty">하루 마무리를 하면 그래프가 그려져요</div>'}
    <div class="modal-sec-h">퀘스트별 최근 14일 달성</div>${rows||'<div class="empty">퀘스트가 없어요</div>'}
    <div class="rc-sum">달력은 완료율이 높을수록 진하게 표시돼요.</div>`);
}
function perUnit(p){ return (+p.price||0)/(+p.qty||1); }
function repriceAll(){ S.subQuests.find(x=>x.id==='cafelab').recipes.forEach(r=>{ let ch=false; (r.items||[]).forEach(it=>{ const p=it.pid&&S.pantry.find(x=>x.id===it.pid); if(p){ it.cost=Math.round((+it.amt||0)*perUnit(p)); ch=true; } }); if(ch) r.cost=r.items.reduce((a,x)=>a+(+x.cost||0),0); }); save(); }

/* ===== 재료 재고 / 유통기한 ===== */
function pantryDays(p){ return p.exp?Math.round((Date.parse(p.exp)-Date.parse(todayStr()))/864e5):null; }
function pantryDTxt(d){ return d<0?'기한 '+(-d)+'일 지남':d===0?'오늘까지':'D-'+d; }
function pantryTag(p){ const d=pantryDays(p), a=[]; if(p.stock!=null) a.push('재고 '+p.stock+esc(p.unit)); if(d!=null) a.push(`<span style="${d<=3?'color:#b5533c;font-weight:700':''}">${pantryDTxt(d)}</span>`); return a.length?'<br><small>'+a.join(' · ')+'</small>':''; }
function editStock(id){ const p=S.pantry.find(x=>x.id===id); if(!p) return;
  askText(p.name+' 재고량, 유통기한\n예: 500, 2026-10-15\n숫자만 또는 날짜만 입력해도 돼요 (비우면 삭제)',(p.stock!=null?p.stock:'')+(p.exp?(p.stock!=null?', ':'')+p.exp:''),v=>{
    const a=v.split(/[,\s]+/).filter(Boolean);
    if(!a.length){ delete p.stock; delete p.exp; }
    else{ const st=a.find(x=>/^\d+(\.\d+)?$/.test(x)), ex=a.find(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)); if(st==null&&ex==null){ toast('예: 500, 2026-10-15 처럼 입력해 주세요'); return; } if(st!=null) p.stock=+st; if(ex) p.exp=ex; }
    save(); openPantry(); }); }
function renderPantryWarn(){ let el=document.getElementById('homePantry'); if(!el){ const h=document.getElementById('homeEvent'); if(!h) return; el=document.createElement('div'); el.id='homePantry'; h.parentNode.insertBefore(el,h); }
  const A=(S.pantry||[]).map(p=>({p,d:pantryDays(p)})).filter(x=>(x.d!=null&&x.d<=3)||(x.p.stock!=null&&x.p.stock<=0)).sort((a,b)=>(a.d==null?99:a.d)-(b.d==null?99:b.d));
  el.innerHTML=A.length?`<div class="quest-card" style="cursor:pointer;padding:10px 14px" onclick="openPantry()"><div class="qname" style="font-size:13px">🧺 재료 확인이 필요해요</div>${A.slice(0,4).map(x=>`<div class="qdesc" style="margin:3px 0 0">${esc(x.p.name)} · ${x.d!=null&&x.d<=3?pantryDTxt(x.d):'재고 없음'}</div>`).join('')}${A.length>4?`<div class="qdesc" style="margin:3px 0 0">외 ${A.length-4}개</div>`:''}</div>`:''; }
function openPantry(){
  const L=S.pantry.slice().sort((a,b)=>(a.exp||'9999')<(b.exp||'9999')?-1:1).map(p=>`<div class="pl-row"><span onclick="editPantry('${p.id}')">${esc(p.name)} · ${p.price.toLocaleString()}원 / ${p.qty}${esc(p.unit)}${pantryTag(p)}</span><span style="display:flex;gap:4px;flex:none"><button class="mini-x" style="color:var(--brown);border-color:var(--gold-d)" onclick="editStock('${p.id}')">재고</button><button class="mini-x" onclick="delPantry('${p.id}')">삭제</button></span></div>`).join('')||'<div class="empty">아직 재료가 없어요</div>';
  showModal(`<h2>재료 창고</h2><img class="cf-bn" src="assets/60f604e342.webp" alt=""><div class="mdesc">재료 단가를 한 번만 등록하면, 가격이 바뀔 때 모든 레시피 원가가 같이 바뀌어요. 재료 이름을 누르면 가격을, [재고] 버튼으로 재고량과 유통기한을 입력해요. 기한이 3일 이내이거나 재고가 0이면 홈에 알려줘요.</div>${L}<div style="margin-top:10px"><button class="ghost-btn" onclick="addPantry()">+ 재료 등록</button></div>`); }
function addPantry(){ askText('이름, 구매가격(원), 용량, 단위\n예: 우유, 2500, 1000, ml','',v=>{ const a=v.split(',').map(x=>x.trim()), price=+a[1], qty=+a[2]; if(!a[0]||!(price>0)||!(qty>0)){ toast('형식을 확인해 주세요'); return; } S.pantry.push({id:'pt'+Date.now(),name:a[0],price,qty,unit:a[3]||'개'}); save(); openPantry(); }); }
function editPantry(id){ const p=S.pantry.find(x=>x.id===id); askText(p.name+' 구매가격(원)',p.price,v=>{ if(+v>0){ p.price=+v; repriceAll(); openPantry(); toast('모든 레시피 원가를 갱신했어요'); } },{num:true}); }
function delPantry(id){ askOk('이 재료를 창고에서 삭제할까요?',()=>{ S.pantry=S.pantry.filter(x=>x.id!==id); save(); openPantry(); }); }
function addFromPantry(id){ if(!S.pantry.length){ toast('먼저 재료 창고에 재료를 등록해 주세요'); return; }
  askText('재료와 사용량 (예: 우유 200)\n창고: '+S.pantry.map(p=>p.name+'('+p.unit+')').join(', '),'',v=>{ const m=v.trim().match(/^(.+?)\s+([\d.]+)$/), p=m&&S.pantry.find(x=>x.name===m[1].trim()); if(!p){ toast('예: 우유 200 처럼 입력해 주세요'); return; }
    const r=findRecipe(id); (r.items=r.items||[]).push({name:p.name,cost:Math.round(+m[2]*perUnit(p)),pid:p.id,amt:+m[2]}); r.cost=r.items.reduce((a,x)=>a+(+x.cost||0),0); save(); openRecipeModal(id); }); }
const RAD=[['sweet','단맛'],['sour','산미'],['body','바디'],['aroma','향'],['finish','여운']];
function radarSVG(r){ const v=r.radar||{}, pt=(i,k)=>{ const a=-Math.PI/2+i*2*Math.PI/5; return [(60+Math.cos(a)*46*k/5).toFixed(1),(64+Math.sin(a)*46*k/5).toFixed(1)]; }, ring=k=>RAD.map((_,i)=>pt(i,k).join(',')).join(' ');
  return `<svg viewBox="0 0 120 124" width="150" height="155" style="display:block;margin:6px auto"><polygon points="${ring(5)}" fill="none" stroke="#b8a877"/><polygon points="${ring(2.5)}" fill="none" stroke="#b8a877" stroke-dasharray="2"/><polygon points="${RAD.map((d,i)=>pt(i,v[d[0]]||1).join(',')).join(' ')}" fill="rgba(143,106,48,.4)" stroke="#8f6a30" stroke-width="1.5"/>${RAD.map((d,i)=>{ const q=pt(i,6.4); return `<text x="${q[0]}" y="${q[1]}" font-size="8" text-anchor="middle" fill="#5a4530">${d[1]}</text>`; }).join('')}</svg>`; }
function setRadar(id,k,val){ const r=findRecipe(id); (r.radar=r.radar||{})[k]=val; save(); document.getElementById('rcRadar').innerHTML=radarSVG(r); }
function rcExtraHTML(r){ const id=r.id, v=r.radar||{}, T=r.tastings||[], V=r.versions||[], avg=T.length?(T.reduce((a,x)=>a+(+x.score||0),0)/T.length).toFixed(1):'-';
  return `<div class="modal-sec-h">맛 레이더</div><div id="rcRadar">${radarSVG(r)}</div>`+RAD.map(d=>`<div class="inline" style="align-items:center"><span style="width:38px;font-size:12px">${d[1]}</span><input type="range" min="1" max="5" value="${v[d[0]]||1}" style="margin:0" oninput="setRadar('${id}','${d[0]}',+this.value)"></div>`).join('')
  +`<div class="modal-sec-h">시음 로그 (평균 ★${avg})</div>${T.map(x=>`<div class="pl-row"><span>${esc(x.date)} · ${esc(x.who)} · ${'★'.repeat(x.score)}${x.note?' · '+esc(x.note):''}</span></div>`).join('')||'<div class="empty" style="padding:6px">아직 시음 기록이 없어요</div>'}<button class="ghost-btn" style="margin-top:6px" onclick="addTasting('${id}')">+ 시음 기록</button>`
  +`<div class="modal-sec-h">버전 기록</div>${V.map((x,i)=>`<div class="pl-row"><span>v${i+1} · ${esc(x.date)} · ${esc(x.note)}${x.cost?' · 원가 '+x.cost.toLocaleString()+'원':''}</span></div>`).join('')||'<div class="empty" style="padding:6px">저장된 버전이 없어요</div>'}<button class="ghost-btn" style="margin-top:6px" onclick="addVersion('${id}')">📌 지금 상태를 새 버전으로 저장</button>`; }
function addTasting(id){ askText('시음자, 점수(1~5), 한줄평\n예: 친구A, 4, 우유를 조금 줄이면 좋겠어','',v=>{ const a=v.split(',').map(x=>x.trim()); if(!a[0]||!a[1]){ toast('형식을 확인해 주세요'); return; } const r=findRecipe(id); (r.tastings=r.tastings||[]).push({date:todayStr(),who:a[0],score:Math.max(1,Math.min(5,parseInt(a[1],10)||1)),note:a.slice(2).join(', ')}); save(); openRecipeModal(id); }); }
function addVersion(id){ askText('이번 버전에서 바꾼 점','',v=>{ if(!v.trim()) return; const r=findRecipe(id); (r.versions=r.versions||[]).push({date:todayStr(),note:v.trim(),cost:+r.cost||0}); save(); openRecipeModal(id); }); }

function showScreen(s){
  LQ.fire('screen:before',s);
  try{ _showScreenBase(s); }finally{ LQ.fire('screen:done',s); }
  LQ.fire('screen:after',s);
}
function _showScreenBase(s){
  document.querySelectorAll('.screen').forEach(e=>e.classList.remove('active'));
  document.getElementById('screen-'+s).classList.add('active');
  document.querySelectorAll('nav.bottom button').forEach(b=>b.classList.toggle('active', b.dataset.s===s));
  if(s==='home'){ renderHome(); renderCalendar(); }
  if(s==='quests') renderQuests();
  if(s==='achieve'){ try{ checkAchievements(); }catch(e){ LQ.err(e); } renderAchievements(); }
  if(s==='treasure') renderTreasure();
  if(s==='master') renderMaster();
}
document.querySelectorAll('nav.bottom button').forEach(b=> b.addEventListener('click',()=>showScreen(b.dataset.s)) );

computeToday(); save();
applyBg();
document.documentElement.style.setProperty('--libimg','url('+LIB_FULL+')');
document.getElementById('splashImg').src=LIB_FULL;
(function(){ const box=document.getElementById('homeLowena'), im=document.getElementById('lowenaSceneImg'); if(!box||!im) return; _lwFace=''; lwSceneFace(_lwBase);
  const L=['dawn','morning','day','afternoon','evening','night'];
  function band(h){ return h>=21||h<4?'night':h<7?'dawn':h<11?'morning':h<15?'day':h<18?'afternoon':'evening'; }
  function apply(){ let b; try{ let q=new URLSearchParams(location.search).get('light'); if(q==='sunset') q='evening'; b=L.includes(q)?q:band(kstNow().getUTCHours()); }catch(e){ b='day'; } if(box.dataset.light!==b) box.dataset.light=b; }
  apply(); setInterval(apply,300000); document.addEventListener('visibilitychange',()=>{ if(!document.hidden) apply(); });
})();
(function(){
  const sp=document.getElementById('splash'), h=kstNow().getUTCHours(), L=lvInfo(), st=curStreak();
  document.getElementById('spHi').textContent = (h<5||h>=22)?'늦은 밤이에요 🌙':h<11?'좋은 아침이에요 ☀️':h<17?'좋은 오후예요 🌿':'좋은 저녁이에요 🌆';
  document.getElementById('spDate').textContent = dispDate({month:'long',day:'numeric',weekday:'long'});
  document.getElementById('spInfo').textContent = 'LV '+L.n+' · '+L.title+' · '+(st>0?'🔥 '+st+'일 연속':'오늘부터 시작해요');
  const box=document.getElementById('ffs');
  for(let i=0;i<16;i++){ const f=document.createElement('i'), z=2+Math.random()*3; f.className='ff'; f.style.cssText='left:'+(Math.random()*100)+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+(8+Math.random()*8)+'s;animation-delay:-'+(Math.random()*12)+'s;--dx:'+((Math.random()*80-40))+'px'; box.appendChild(f); }
  const hide=()=>{ sp.classList.add('hide'); setTimeout(()=>sp.remove(),800); };
  sp.addEventListener('click',hide);
})();
renderHeaderFox();
setTimeout(()=>{ try{ monthlyAutoCheck(); }catch(e){ LQ.err(e); } },600);
renderHome();
renderCalendar();
renderSoundUI();
if(bgmOn()){ startBgm(); setTimeout(()=>{ if(!actx||actx.state!=='running') toast('♪ 화면을 터치하면 음악이 시작돼요'); },900); }
