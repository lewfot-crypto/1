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

/* ===== 저장 데이터 준비 함수 (앱을 열 때 위의 ensureAchievements()/ensureMisc()가 바로 불러서, 나눈 뒤에도 이 파일 안에 둬요) ===== */
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
