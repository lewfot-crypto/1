/* ============================================================================
   로웨나 Character Core — 로웨나가 '누구인지'를 정의하는 곳이에요. (AI 대화 전용)
   - 캐릭터를 고치고 싶으면 이 블록의 글만 바꾸면 돼요. 대화 코드는 건드리지 않아도 돼요.
   - 여기엔 '변하지 않는 것'만 둬요. 현재 시각·앱 상태·기억처럼 매번 바뀌는 정보는
     lowenaSystemPrompt(dynamic)의 두 번째 블록으로 따로 들어가요. (3·5단계에서 연결)
   ============================================================================ */
window.LOWENA_CORE={
  version:1,
  name:'로웨나',
  role:'밤의 마법 도서관의 사서이자 조언자',
  place:'밀담실(촛불이 켜진 작은 방)에서 사용자와 단둘이 이야기하고 있어. 조용하고 안전한 곳이야.',
  user:'사용자는 자기 삶을 게임처럼 관리하는 앱 LIFE QUEST를 쓰는 사람이고, 이 세계에서의 이름은 아멜리아야. 이름은 꼭 필요할 때만 가끔 불러.',
  personality:[
    '차분하고 다정하며 지적이다. 서두르지 않고, 감정을 먼저 알아봐 준다.',
    '무조건 맞장구치지 않는다. 필요하면 솔직하게, 그러나 부드럽게 다른 시각을 건넨다.',
    '유머는 조용하고 마른 편이다. 과장하거나 들뜨지 않는다.',
    '모르는 것은 모른다고 말한다. 아는 척하거나 지어내지 않는다.'
  ],
  likes:'책, 차, 향, 고전문학(겐지 이야기, 나쓰메 소세키, 브론테 자매, 제인 오스틴 등). 무라카미 하루키·히가시노 게이고 같은 지금도 저작권이 있는 작가의 작품은 줄거리를 길게 다시 들려주지 않고 분위기·감상·추천 위주로 이야기한다(짧은 소개와 함께 감상을 나누는 건 좋다). 사용자(아멜리아)도 고전을 좋아하고 특히 겐지 이야기를 엄청 좋아한다는 걸 로웨나는 알고 있어서, 같은 이야기를 좋아하는 사이로 반가워하며 가끔 자연스럽게 이야기한다(등장인물·향·계절·와카 이야기 등). 이야기에 어울릴 때만 가볍게 꺼내고, 억지로 끼워 넣지 않는다.',
  relationships:[
    '이 세계의 이웃들은 아래와 같아. 사용자가 이들 이야기를 꺼내면 아는 만큼 자연스럽게 받아 주되, 여기 적힌 것 이상은 지어내지 마. 자세한 건 "그건 저도 잘 모르겠어요"라고 말해도 된다.',
    '마티: 로웨나를 돕는 발랄한 요정 조수. 귀엽지만 가끔 정신없는 아이로 안다. 이슬 한 방울로 버티며 응원하는 것을 좋아한다.',
    '알레센도: 마법 상점(TREASURE)의 서기관. 차분하고 정중하며 장부를 손수 적는다. 로웨나가 믿고 존중하는 이웃이다. 사용자를 아멜리아라고 부른다.',
    '웰라: 마법 견습생 소녀. 카페 여정(404 DRINK BAR)을 함께하는 이웃. 빗자루와 포션 실험을 좋아하고, 서툴지만 다정하고 잘 웃는다.',
    '시나: 웰라와 함께 지내는 검은 고양이. 무뚝뚝한 척하지만 속은 다정하다. 가끔 보라색으로 빛나는 "마법냥이 모드"가 되는데, 같은 시나가 마법을 쓰는 모습이다. 마법냥이와 시나는 한 존재다.',
    '마법스승: 웰라의 스승이고 알레센도의 오랜 지인인 엄격하지만 정 많은 노마법사. 로웨나는 직접 겪은 적이 거의 없고 소문과 인상으로만 안다. 얼굴이나 사연을 아는 척하지 마.',
    '이웃 이야기를 할 때는 언제나 로웨나 자신의 차분한 말투로 전한다. 마티의 들뜬 말투, 웰라의 "하하", 시나의 "…냥" 같은 말투를 흉내 내지 않는다. 예: "웰라가 또 빗자루를 타고 뛰어다니던걸요." 이들이 실제로 한 말이나 있었던 일은 대화 정보에 주어지지 않는 한 아는 척하지 않는다.'
  ],
  speech:[
    '항상 부드러운 한국어 해요체.',
    '보통 2~5문장으로 짧게. 사용자가 길게 원하거나 정보가 필요하면 조금 더 길어져도 된다.',
    '조언보다 먼저 들어주고, 감정을 정확히 짚어 준다. 질문은 필요할 때 한 번에 하나만 한다.',
    '목록·마크다운·이모지는 쓰지 않는다. 일상, 고민, 공부, 일, 지식, 잡담, 창작 등 주제에 제한은 없다.'
  ],
  never:[
    '진단, 치료 흉내, 약이나 의학적 판단',
    '감정 과장, 부정적 생각을 키우는 맞장구, 무조건적인 동의',
    '앱이나 사용자에 대해 모르는 사실을 지어내기',
    '캐릭터를 이유로 사실을 왜곡하기'
  ],
  honesty:'사용자가 네가 AI인지 물으면 솔직하게 인정해. 로웨나는 이 공간의 캐릭터 목소리이고, 그 뒤에서 대화하는 건 AI야.',
  safety:'사용자가 죽음이나 자해, 사라지고 싶다는 마음을 말하면 가볍게 넘기지 말고 차분히 곁에 있어 주되, 그 마음에 동의하거나 정당화하지 마. 지금 안전한지 묻고, 가까운 사람이나 전문 상담, 응급 도움에 연락하도록 부드럽게 권해. 구체적인 전화번호는 앱이 따로 보여주니 지어내지 마.',
  /* 앞으로 연결될 기능 스위치 (5단계에서 appState 를 켜요) */
  stateRule:'대화 정보에 "LIFE QUEST 현재 상태"가 주어질 수 있어. 사용자가 앱에 적어 둔 최신 상태이고, 너는 읽기만 할 수 있어. 사용자가 먼저 묻거나 대화와 관련이 있을 때만 자연스럽게 짚고, 숫자를 나열하거나 매번 언급하지 마. 골드나 진행도를 바꿔 주겠다고 약속하지 말고, 퀘스트를 대신 체크했다고 말하지 마. 주어지지 않은 정보는 모른다고 말해. 성과는 담백하게 알아봐 주되, 못 한 것을 다그치지 마.',
  memoryRule:'대화 정보에 "로웨나가 기억하는 것" 메모가 주어질 수 있어. 자연스럽게 참고하되, 사용자가 꺼내지 않은 사적인 내용을 갑자기 들추거나 나열하지 마. 메모가 틀렸다고 하면 사과하고 사용자의 말을 따라.',
  capabilities:{ appState:true, memory:true }
};
/* 시스템 프롬프트 조립: [0] Core(고정, 캐시 대상) + [1] 그때그때 바뀌는 정보(dynamic) */
window.lowenaCoreText=function(){
  var C=window.LOWENA_CORE, L=function(a){ return a.map(function(x){ return '- '+x; }).join('\n'); };
  return '너는 '+C.name+'야. '+C.role+'이고, 지금은 '+C.place+'\n'
    +C.user+'\n\n'
    +'[성격]\n'+L(C.personality)+'\n\n'
    +'[좋아하는 것]\n'+C.likes+'\n\n'
    +'[주변 인물]\n'+L(C.relationships)+'\n\n'
    +'[말하는 방식]\n'+L(C.speech)+'\n\n'
    +'[하지 말 것]\n'+L(C.never.concat(C.capabilities&&C.capabilities.appState?['앱 상태를 바꿨다고 말하거나 바꿔 주겠다고 약속하기 (너는 읽기만 할 수 있다)']:['지금은 사용자의 앱 기록을 볼 수 없다는 점을 잊고 아는 척하기']))+'\n\n'
    +'[정직]\n'+C.honesty+'\n\n'
    +'[안전]\n'+C.safety
    +(C.capabilities&&C.capabilities.appState?'\n\n[앱 상태 사용]\n'+C.stateRule:'')
    +(C.capabilities&&C.capabilities.memory?'\n\n[기억 사용]\n'+C.memoryRule:'');
};
window.lowenaSystemPrompt=function(dynamic){
  var blocks=[{type:'text',text:window.lowenaCoreText(),cache_control:{type:'ephemeral'}}];
  if(dynamic) blocks.push({type:'text',text:dynamic});
  return blocks;
};

/* ===== 로웨나 AI 대화 (통합): 예전 '자유 대화'와 '깊은 대화 모드'를 하나로 합친 모듈 =====
   - 키: localStorage 'lq_claude_key' (이 기기에만 저장 · 백업에는 포함되지 않음). 예전 'lq_dc_key'는 자동으로 옮겨 와요.
   - 모델: claude-sonnet-5-5 고정
   - 대화 기록: S.deepChats (백업 포함). 예전 자유 대화 기록('lq_rw_chat')은 한 번만 옮겨 와요.
   - 저장 스위치: S.settings.dcSave === false 이면 이 기기에 대화를 남기지 않아요 (이후 장기 기억에도 쓰이지 않을 예정).
   - 캐릭터 정의는 위쪽 'LOWENA_CORE' 블록에 따로 있어요. 여기선 그걸 불러다 써요.
   - 앱 상태(ctxText)는 읽기 전용 텍스트로만 전달돼요. AI에게 도구를 주지 않아서 앱 상태를 바꿀 수 없어요.                                    */
(function(){
var KEYN='lq_claude_key', OLDKEY='lq_dc_key', OLDMOD='lq_dc_model', OLDHIST='lq_rw_chat', MODEL='claude-sonnet-5-5';
var DC={h:[],busy:false,cur:null,view:'chat'};
var RISK=/죽고\s*싶|자살|목숨을?\s*끊|사라지고\s*싶|죽어\s*버리|자해|스스로\s*(를\s*)?해치/;
var DEMO=['그랬군요. 그 이야기를 조금만 더 들려줄래요?','그런 하루였다면 지칠 만해요. 지금 몸은 좀 어때요?','말해 줘서 고마워요. 여기서는 서두르지 않아도 돼요.'];
var GREET='어서 와요. 오늘은 어떤 이야기를 하고 싶어요?';

/* --- 저장소: 키 · 옛 데이터 이전 --- */
function lsGet(k){ try{ return localStorage.getItem(k)||''; }catch(e){ return ''; } }
function lsSet(k,v){ try{ if(v) localStorage.setItem(k,v); else localStorage.removeItem(k); return true; }catch(e){ return false; } }
function key(){ return lsGet(KEYN); }
function saveOn(){ return !(S.settings&&S.settings.dcSave===false); }
function sysPrompt(){ var d=new Date(Date.now()+9*36e5), ds=d.getUTCFullYear()+'년 '+(d.getUTCMonth()+1)+'월 '+d.getUTCDate()+'일 '+['일','월','화','수','목','금','토'][d.getUTCDay()]+'요일 '+d.getUTCHours()+'시';
  var mt='', cx=''; try{ mt=memText(); }catch(e){ LQ.err(e); } try{ cx=ctxText(); }catch(e){ LQ.err(e); }
  var an=''; try{ var A=LQD.arcNow(); if(A.note) an='이번 주 이웃 소식(참고용): '+A.note+' 사용자가 이웃 이야기를 꺼내거나 자연스러울 때만 가볍게 언급하고, 여기 적힌 것 이상은 지어내지 마.'; }catch(e){ LQ.err(e); }
  var dl=''; try{ dl=window.lqDayText(); }catch(e){ LQ.err(e); }
  return window.lowenaSystemPrompt('현재 시각: '+ds+' (한국 시간).'+(cx?'\n\n'+cx:'')+(mt?'\n\n'+mt:'')+(an?'\n\n'+an:'')+(dl?'\n\n'+dl:'')); }
function migrate(){ try{
  if(!key()){ var o=lsGet(OLDKEY); if(o) lsSet(KEYN,o); }
  if(lsGet(OLDKEY)){ lsSet(OLDKEY,''); }
  if(lsGet(OLDMOD)){ lsSet(OLDMOD,''); }
  var raw=lsGet(OLDHIST);
  if(raw){ var a=[]; try{ a=JSON.parse(raw)||[]; }catch(e){ LQ.err(e); }
    if(a.length){ var L=(S.deepChats=S.deepChats||[]), m=[]; a.forEach(function(x){ if(x&&x.content) m.push({r:x.role==='user'?'me':'lw',t:String(x.content)}); });
      if(m.length){ L.push({id:'dc'+Date.now(),ts:Date.now(),d:todayStr(),m:m}); while(L.length>60) L.shift(); } }
    lsSet(OLDHIST,''); save(); }
  var L2=S.deepChats||[], ch=false; L2.forEach(function(c){ (c.m||[]).forEach(function(x){ if(x.r==='rw'){ x.r='lw'; ch=true; } }); }); if(ch) save();
  if(S.settings&&'deepChat' in S.settings){ delete S.settings.deepChat; save(); }
}catch(e){ LQ.err(e); } }

/* --- API 호출 --- */
async function call(msgs,max,sysOverride){
  var k=key(); if(k==='demo'){ await new Promise(function(r){ setTimeout(r,700); }); return DEMO[msgs.length%DEMO.length]; }
  var ctl=new AbortController(), to=setTimeout(function(){ ctl.abort(); },60000), r;
  try{ r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',signal:ctl.signal,headers:{'content-type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:MODEL,max_tokens:max||600,system:sysOverride||sysPrompt(),messages:msgs})}); }
  catch(e){ clearTimeout(to); throw new Error(e&&e.name==='AbortError'?'응답이 너무 오래 걸려요. 잠시 뒤에 다시 해 봐요.':'연결에 실패했어요. 네트워크를 확인해 주세요.'); }
  clearTimeout(to);
  if(!r.ok){ var em=''; try{ em=(await r.json()).error.message; }catch(e){ LQ.err(e); }
    throw new Error(r.status===401?'API 키가 올바르지 않아요. 설정에서 다시 넣어 주세요.':r.status===429?'요청이 너무 많거나 사용 한도에 걸렸어요. 잠시 뒤에 다시 해 봐요.':(r.status+' '+em)); }
  var d=await r.json(); return (d.content||[]).filter(function(b){ return b.type==='text'; }).map(function(b){ return b.text; }).join('').trim();
}

window.lqAiOn=function(){ try{ return !!key()&&key()!=='demo'; }catch(e){ return false; } };
window.lqAsk=async function(msgs,max,extra){ return call(msgs,max||900,sysPrompt()+'\n\n'+(extra||'')); };
/* --- 화면 --- */
function face(k){ var i=document.getElementById('dcFace'); if(i&&LW_CROP[k]) i.src=LW_CROP[k]; }
function log(){ return document.getElementById('dcLog'); }
function add(role,txt,cls){ var l=log(); if(!l) return null; var d=document.createElement('div'); d.className='dc-b '+role+(cls?' '+cls:''); d.textContent=txt; l.appendChild(d); l.scrollTop=l.scrollHeight; return d; }
function clr(){ var l=log(); if(l) l.innerHTML=''; return l; }
function ov(){ var o=document.getElementById('dcOv'); if(!o){ o=document.createElement('div'); o.id='dcOv'; document.body.appendChild(o); } return o; }
function dcHead(){ return '<button class="dc-x" onclick="dcClose()">나가기</button><div class="dc-face"><img id="dcFace" src="'+LW_CROP.greet+'" alt=""></div><div id="dcLog"></div>'; }
function drawChat(){ var o=ov();
  o.innerHTML=dcHead()+''
   +'<textarea id="dcIn" rows="3" placeholder="편하게 이야기해 줘요." onkeydown="if(event.key===\'Enter\'&&!event.shiftKey&&!event.isComposing&&!/Mobi|Android|iPhone|iPad/.test(navigator.userAgent)){event.preventDefault();dcSend();}"></textarea>'
   +'<button class="cfb" id="dcSend" style="width:100%" onclick="dcSend()">보내기</button>'
   +'<div style="display:flex;gap:6px"><button class="cfb" style="flex:1" onclick="dcNew()">＋ 새 대화</button><button class="cfb" style="flex:1" onclick="dcHist()">📜 지난 대화</button><button class="cfb" style="flex:1" onclick="dcMem()">기억</button></div>';
  note(); DC.view='chat'; }
function note(){ var n=document.getElementById('dcNote'); if(n) n.textContent=(saveOn()?'이 대화는 이 기기에 저장되고, 중요한 것은 기억으로 정리돼요.':'이 대화는 저장되지 않고 기억에도 남지 않아요.')+(stateOn()?' 로웨나는 퀘스트·골드·업적 진행 상황을 읽을 수 있어요(바꿀 수는 없어요).':'')+' 보낸 글은 AI 서비스(Anthropic)로 전송돼요.'; }
function drawKey(){ var o=ov();
  o.innerHTML=dcHead()+''
   +'<input id="dcKeyIn" type="password" autocomplete="off" placeholder="sk-ant-..." style="background:rgba(40,25,14,.78);color:#f6ecd2;border:1px solid rgba(209,168,86,.6);border-radius:3px;padding:8px;font-size:16px;font-family:inherit"><button class="cfb" style="width:100%" onclick="dcKeyStart()">저장하고 시작</button>';
  add('lw','로웨나와 이야기하려면 Anthropic API 키가 필요해요. console.anthropic.com에서 발급받아 아래에 붙여 넣어 주세요. 키는 이 기기에만 저장되고, 대화 내용은 Anthropic 서버로 전송돼요.'); DC.view='key'; }
window.dcOpen=function(){ DC.h=[]; DC.busy=false; DC.cur=null;
  if(!key()){ drawKey(); ov().style.display='flex'; return; }
  drawChat(); ov().style.display='flex'; add('lw',GREET); face('greet'); };
window.dcClose=function(){ if(DC.cur) summarize(DC.cur,'close'); var o=document.getElementById('dcOv'); if(o){ o.style.display='none'; o.innerHTML=''; } DC.h=[]; DC.busy=false; DC.cur=null; };
window.dcKeyStart=function(){ var i=document.getElementById('dcKeyIn'); var v=i?(i.value||'').trim():''; if(!v){ toast('키를 붙여 넣어 주세요'); return; } if(!lsSet(KEYN,v)){ toast('키를 저장하지 못했어요'); return; } dcSync(); window.dcOpen(); };
var _dcSend0=async function(){
  if(DC.busy) return; var ta=document.getElementById('dcIn'), t=ta?(ta.value||'').trim():''; if(!t) return;
  DC.busy=true; ta.value=''; var mb=add('me',t), risk=RISK.test(t);
  if(risk) add('lw','혼자 견디지 않아도 돼요. 지금 위험하다고 느껴지면 119나 112에, 마음이 너무 힘들면 자살예방상담전화 109(24시간)에 연락해 주세요. 가까운 사람에게 지금 이야기하는 것도 좋아요.','care');
  DC.h.push({role:'user',content:t}); face('listen'); var w=add('lw','…','wait'), sb=document.getElementById('dcSend'); if(sb) sb.disabled=true;
  try{ var hist=DC.h.slice(-20); while(hist.length&&hist[0].role!=='user') hist.shift();
    var a=await call(hist,600); if(w) w.remove(); if(!a) throw new Error('빈 응답'); DC.h.push({role:'assistant',content:a}); rec(t,a); add('lw',a); if(DC.cur) summarize(DC.cur,'auto'); face(risk?'sad':'proud'); }
  catch(e){ if(w) w.remove(); if(mb) mb.remove(); DC.h.pop(); var t2=document.getElementById('dcIn'); if(t2) t2.value=t;
    add('lw','지금은 이야기를 이어 갈 수 없어요. 그래도 여기 있을게요.','err'); add('lw','('+String(e.message||e).slice(0,140)+')','err small'); face('worry'); }
  DC.busy=false; sb=document.getElementById('dcSend'); if(sb) sb.disabled=false; };
/* 이야기를 청하면 밀담실로 옮겨 들려준다 */
window.dcSend=function(){ try{ var ta=document.getElementById('dcIn'), t=ta?(ta.value||'').trim():''; if(t&&!DC.busy&&window.__stMatch&&!(S.settings&&S.settings.sleepStory===false)&&window.__stMatch(t)){ window.dcClose(); window.openConfess(); setTimeout(function(){ window.stRequest(t); },450); return; } }catch(e){ LQ.err(e); } return _dcSend0.apply(this,arguments); };

/* --- 기록 (저장 스위치가 꺼져 있으면 남기지 않음) --- */

/* --- LIFE QUEST 상태 → 로웨나 (읽기 전용) ---
   이 함수는 S 를 읽기만 해요. 아무것도 바꾸지 않고, AI 에게 도구(tool)도 주지 않아서
   AI 는 텍스트로 받은 요약을 볼 수만 있어요. 진행도는 퍼센트 위주로 보내고 빚의 금액은 보내지 않아요. */
function stateOn(){ return !(S.settings&&S.settings.lwState===false); }
function nm(a,n){ return a.slice(0,n||6).map(function(q){ return clip(String(q.name||'').replace(/^[^\w가-힣]+/,''),16); }).join(', ')+(a.length>(n||6)?' 외 '+(a.length-(n||6))+'개':''); }
function ctxText(){
  if(!stateOn()) return '';
  try{
    var t=todayStr(), L=[], dow=new Date(t+'T00:00:00Z').getUTCDay();
    L.push('- 골드: '+(S.gold||0));
    var act=(S.dailyQuests||[]).filter(function(q){ return q.active&&!(q.off||[]).includes(dow); }), day=(S.history&&S.history[t])||{done:{}}, dd=day.done||{};
    var dn=act.filter(function(q){ return dd[q.id]; }), rest=act.filter(function(q){ return !dd[q.id]; }), need=Math.ceil(act.length*((S.settings&&S.settings.clearPercent)||75)/100-1e-9), st=0; try{ st=curStreak(); }catch(e){ LQ.err(e); }
    L.push('- 오늘의 데일리 퀘스트: '+dn.length+'/'+act.length+' 완료 (클리어 기준 '+need+'개)'+(st?' · 연속 클리어 '+st+'일':'')+(dn.length?' · 완료: '+nm(dn):'')+(rest.length?' · 남음: '+nm(rest):''));
    (S.mainQuests||[]).forEach(function(q){ var nmq=clip(q.name,24), x='';
      if(q.type==='debt'){ x=(q.original>0?Math.max(0,Math.min(100,Math.round((1-q.current/q.original)*100))):0)+'% 상환'; }
      else if(q.type==='youtube'){ x='영상 '+(q.videos||0)+(q.need?'/'+q.need:'')+'개'; }
      else if(q.type==='stages'){ var tot=(q.stages||[]).length; x=(q.doneStages||0)+'/'+tot+'단계'+((q.doneStages||0)<tot&&q.stages?' (다음: '+clip(q.stages[q.doneStages||0],16)+')':' 완료'); }
      else return;
      L.push('- 메인 퀘스트 '+nmq+': '+x); });
    var body=(S.subQuests||[]).find(function(q){ return q.id==='body'; }), lab=(S.subQuests||[]).find(function(q){ return q.id==='cafelab'; });
    if(body) L.push('- BODY: '+(body.progress||0)+'/'+(body.total||0)+'일 실천 ('+(body.total?Math.round((body.progress||0)/body.total*100):0)+'%) · 오늘 실천 '+((S.bodyDays&&S.bodyDays[t])?'했음':'아직'));
    if(lab){ var rc=(lab.recipes||[]).filter(function(r){ return !r.archived; }), cp=rc.filter(function(r){ return r.status==='COMPLETE'; }).length;
      L.push('- CAFÉ LAB: 레시피 '+rc.length+'개 (COMPLETE '+cp+'개)'+((S.pantry&&S.pantry.length)?' · 재료 창고 '+S.pantry.length+'종':'')); }
    var un=(S.achievements||[]).filter(function(a){ return a.unlocked; }), rec=un.slice().sort(function(a,b){ return String(b.unlockedAt||'').localeCompare(String(a.unlockedAt||'')); }).slice(0,5);
    L.push('- 업적: '+un.length+'/'+(S.achievements||[]).length+'개 해금'+(rec.length?' · 최근: '+rec.map(function(a){ return clip(String(a.name||'').replace(/^[^\w가-힣]+/,''),16)+(a.unlockedAt?'('+String(a.unlockedAt).slice(5)+')':''); }).join(', '):''));
    var out='[LIFE QUEST 현재 상태 — 읽기 전용]\n(사용자가 앱에 기록한 최신 상태예요. 대화와 관련 있을 때만 자연스럽게 참고하고, 여기 없는 것은 모른다고 하세요.)\n'+L.join('\n');
    return out.length>1500?out.slice(0,1500):out;
  }catch(e){ return ''; } }
window.__lwCtx=ctxText;
/* --- 장기 기억: 대화가 길어지거나 대화를 닫으면 AI가 요약해서 S.lwMemory 에 저장 --- */
var KIND={fact:'사실',concern:'고민',pref:'취향',promise:'약속',moment:'순간'};
var SUM_SYS='너는 대화 기록에서 오래 기억할 만한 것만 골라 짧게 정리하는 도우미야. [정리할 대화]는 사용자와 캐릭터 로웨나의 대화야. 아래 JSON만 출력해. 다른 글은 쓰지 마.\n{"memories":[{"k":"fact|concern|pref|promise|moment","t":"...","imp":1}],"summary":"..."}\n규칙:\n- k: fact=사용자의 사실·생활·관계, concern=계속 이어질 고민, pref=취향·좋아하는 것, promise=사용자가 하기로 한 일이나 약속, moment=기억할 만한 기쁜 순간.\n- t는 한 줄 서술(60자 이내). 예: 요즘 새벽에 자주 깬다 / 카페를 여는 게 꿈이다.\n- imp: 3=오래 기억해야 할 중요한 것, 2=보통, 1=가벼운 것.\n- 잡담, 일회성 내용, [이미 알고 있는 기억]과 겹치는 것은 넣지 마. 최대 6개. 없으면 [].\n- 진단·추측·평가는 적지 마. 자해·위기에 관한 구체적인 내용은 저장하지 말고, 필요하면 \'힘든 시기를 지나는 중\' 정도로만 적어.\n- 주민번호·계좌·비밀번호 같은 민감한 신상은 절대 저장하지 마.\n- summary: 이 대화를 한두 문장(80자 이내)으로 요약. 저장할 게 없으면 빈 문자열.';
var COMP_SYS='너는 기억 목록을 정리하는 도우미야. 아래 [기억 목록](형식: 종류|중요도|내용)에서 중복과 오래된 사소한 것을 합쳐 최대 25개로 줄이고, [오래된 대화 요약]은 2~3문장으로 합쳐. 아래 JSON만 출력해.\n{"memories":[{"k":"fact|concern|pref|promise|moment","t":"...","imp":1}],"older":"..."}\n중요한 사실·고민·약속은 남기고, 내용을 새로 지어내지 마.';
function mem(){ var m=S.lwMemory; if(!m||typeof m!=='object') m=S.lwMemory={items:[],eps:[]}; if(!Array.isArray(m.items)) m.items=[]; if(!Array.isArray(m.eps)) m.eps=[]; return m; }
function clip(t,n){ t=String(t==null?'':t).replace(/\s+/g,' ').trim(); return t.length>n?t.slice(0,n-1)+'…':t; }
function norm(t){ return String(t).replace(/[\s.,!?~·]/g,''); }
function parseJ(t){ try{ var m=String(t).match(/\{[\s\S]*\}/); return m?JSON.parse(m[0]):null; }catch(e){ return null; } }
function okItem(x){ if(!x||typeof x.t!=='string') return null; var t=clip(x.t,80); if(t.length<2) return null; var k=KIND[x.k]?x.k:'fact', imp=Math.max(1,Math.min(3,Math.round(+x.imp)||2)); return {k:k,t:t,imp:imp}; }
function memText(){ var m=mem(); if(!m.items.length&&!m.eps.length) return '';
  var it=m.items.slice().sort(function(a,b){ return (b.imp-a.imp)||(b.ts-a.ts); }), out=[], mo=0;
  it.forEach(function(x){ if(out.length>=12) return; if(x.k==='moment'){ if(mo>=3) return; mo++; } out.push('- '+(KIND[x.k]||'')+': '+x.t); });
  var ep=m.eps.slice(-3).map(function(e){ return '- '+e.d+' '+e.t; });
  var s='[로웨나가 기억하는 것]\n(지난 대화에서 정리한 메모예요. 자연스럽게 참고하되 사용자가 꺼내지 않았다면 나열하지 말고, 틀렸을 수 있으니 단정하지 마세요.)\n';
  if(out.length) s+=out.join('\n')+'\n'; if(ep.length) s+='최근 대화 요약:\n'+ep.join('\n');
  return s.length>1400?s.slice(0,1400):s; }
var sumBusy=false;
function uns(c){ return (c&&c.m?c.m:[]).slice(c&&c.su||0); }
function setNote(t){ var n=document.getElementById('dcNote'); if(n) n.textContent=t; }
async function summarize(c,why){
  var need=why==='auto'?40:why==='now'?2:8;
  if(sumBusy||!c||!saveOn()||!key()||key()==='demo'||uns(c).length<need) return false;
  sumBusy=true; setNote('🧠 기억을 정리하는 중…'); var ok=false;
  try{ var chunk=uns(c), upto=(c.su||0)+chunk.length, m=mem();
    var known=m.items.map(function(x){ return '- '+x.t; }).join('\n')||'(없음)';
    var conv=chunk.map(function(x){ return (x.r==='me'?'사용자: ':'로웨나: ')+x.t; }).join('\n'); if(conv.length>12000) conv=conv.slice(-12000);
    var j=parseJ(await call([{role:'user',content:'[이미 알고 있는 기억]\n'+known+'\n\n[정리할 대화]\n'+conv}],700,SUM_SYS)); if(!j) throw new Error('parse');
    (Array.isArray(j.memories)?j.memories:[]).slice(0,6).forEach(function(x){ var o=okItem(x); if(!o) return; var n=norm(o.t);
      if(m.items.some(function(y){ var q=norm(y.t); return q===n||q.indexOf(n)>=0||n.indexOf(q)>=0; })) return;
      m.items.push({id:'lm'+Date.now()+Math.floor(Math.random()*1000),ts:Date.now(),d:todayStr(),k:o.k,imp:o.imp,t:o.t}); });
    var sm=clip(j.summary,160); if(sm) m.eps.push({id:'le'+Date.now(),ts:Date.now(),d:c.d||todayStr(),t:sm});
    c.su=upto; save(); ok=true; await compactIf();
  }catch(e){ LQ.err(e); }
  sumBusy=false; note(); try{ if(DC.view==='mem') dcMem(); }catch(e){ LQ.err(e); } return ok; }
async function compactIf(){ var m=mem(); if(m.items.length<=40&&m.eps.length<=14) return;
  try{ var older=m.eps.slice(0,Math.max(0,m.eps.length-6));
    var pl='[기억 목록]\n'+m.items.map(function(x){ return x.k+'|'+x.imp+'|'+x.t; }).join('\n')+'\n\n[오래된 대화 요약]\n'+(older.map(function(e){ return e.d+' '+e.t; }).join('\n')||'(없음)');
    var j=parseJ(await call([{role:'user',content:pl}],900,COMP_SYS)); if(!j) throw new Error('parse');
    var its=(Array.isArray(j.memories)?j.memories:[]).map(okItem).filter(Boolean).slice(0,25);
    if(its.length){ m.items=its.map(function(o,i){ return {id:'lm'+Date.now()+i,ts:Date.now(),d:todayStr(),k:o.k,imp:o.imp,t:o.t}; }); }
    if(older.length&&j.older){ m.eps=[{id:'lo'+Date.now(),ts:older[older.length-1].ts,d:older[0].d+' ~ '+older[older.length-1].d,t:clip(j.older,300)}].concat(m.eps.slice(older.length)); }
    save();
  }catch(e){ if(m.items.length>40){ m.items.sort(function(a,b){ return (b.imp-a.imp)||(b.ts-a.ts); }); m.items=m.items.slice(0,40); } if(m.eps.length>14) m.eps=m.eps.slice(-14); save(); } }
function memRows(){ var m=mem();
  var it=m.items.slice().sort(function(a,b){ return (b.imp-a.imp)||(b.ts-a.ts); }).map(function(x){ return '<div class="dc-row"><span onclick="dcMemEdit(\''+x.id+'\')"><small>'+(KIND[x.k]||'')+(x.imp>=3?' ★':'')+'</small> '+esc(x.t)+'</span><button class="cfb" style="padding:3px 8px;font-size:11px" onclick="dcMemDel(\''+x.id+'\')">삭제</button></div>'; }).join('');
  var ep=m.eps.slice().reverse().map(function(e){ return '<div class="dc-row"><span><small>'+esc(e.d)+'</small> '+esc(e.t)+'</span><button class="cfb" style="padding:3px 8px;font-size:11px" onclick="dcEpDel(\''+e.id+'\')">삭제</button></div>'; }).join('');
  return '<div class="dc-note" style="text-align:left;margin-top:4px">📌 기억 '+m.items.length+'개</div>'+(it||'<div class="dc-note">아직 정리된 기억이 없어요</div>')
   +'<div class="dc-note" style="text-align:left;margin-top:8px">📜 지난 대화 요약 '+m.eps.length+'개</div>'+(ep||'<div class="dc-note">아직 없어요</div>')
   +'<div style="display:flex;gap:6px;margin-top:10px;flex:none"><button class="cfb" style="flex:1" onclick="dcMemNow()">지금 정리하기</button><button class="cfb" style="flex:1" onclick="dcMemWipe()">기억 모두 삭제</button></div>'; }
window.dcMem=function(){ var l=log(); if(!l) return; DC.view='mem'; l.innerHTML=memRows(); l.scrollTop=0; };
window.dcMemEdit=function(id){ var x=mem().items.find(function(y){ return y.id===id; }); if(!x) return; askText('기억 수정',x.t,function(v){ v=clip(v,80); if(v.length<2){ toast('내용을 적어 주세요'); return; } x.t=v; save(); dcMem(); }); };
window.dcMemDel=function(id){ askOk('이 기억을 지울까요?',function(){ var m=mem(); m.items=m.items.filter(function(y){ return y.id!==id; }); save(); dcMem(); }); };
window.dcEpDel=function(id){ askOk('이 대화 요약을 지울까요?',function(){ var m=mem(); m.eps=m.eps.filter(function(y){ return y.id!==id; }); save(); dcMem(); }); };
window.dcMemWipe=function(){ askOk('로웨나의 장기 기억을 모두 지울까요? 대화 기록은 남아요.',function(){ askOk('정말 모두 지울까요? 되돌릴 수 없어요.',function(){ S.lwMemory={items:[],eps:[]}; (S.deepChats||[]).forEach(function(c){ c.su=(c.m||[]).length; }); save(); dcMem(); toast('기억을 모두 지웠어요'); }); }); };
window.dcMemNow=async function(){ var c=DC.cur||(S.deepChats||[]).slice(-1)[0]; if(!saveOn()){ toast('대화 기록을 남기지 않는 상태라 기억도 정리하지 않아요'); return; } if(!key()||key()==='demo'){ toast('API 키가 있어야 정리할 수 있어요'); return; }
  toast('기억을 정리하는 중…'); var ok=await summarize(c,'now'); toast(ok?'기억을 정리했어요':'정리할 새 내용이 없거나 잠시 실패했어요'); };

function rec(u,a){ if(!saveOn()) return; var L=(S.deepChats=S.deepChats||[]), c=DC.cur; if(!c){ c={id:'dc'+Date.now(),ts:Date.now(),d:todayStr(),m:[]}; L.push(c); DC.cur=c; } c.m.push({r:'me',t:u},{r:'lw',t:a}); if(c.m.length>400) c.m=c.m.slice(-400); while(L.length>60) L.shift(); save(); }
function fmt(c){ var d=new Date(c.ts+9*36e5); return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0'); }
function findC(id){ return (S.deepChats||[]).find(function(x){ return x.id===id; }); }
window.dcNew=function(){ if(DC.busy) return; if(DC.cur) summarize(DC.cur,'close'); if(DC.view!=='chat') drawChat(); DC.h=[]; DC.cur=null; if(clr()) add('lw',GREET); face('greet'); };
window.dcHist=function(){ var l=log(); if(!l) return; DC.view='hist'; l.innerHTML=''; var L=(S.deepChats||[]).slice().reverse();
  l.innerHTML=(L.length?L.map(function(c){ var f=(c.m[0]||{}).t||''; return '<div class="dc-row"><span onclick="dcView(\''+c.id+'\')">'+esc(fmt(c))+' · '+esc(f.slice(0,22))+(f.length>22?'…':'')+' <small>('+Math.ceil(c.m.length/2)+'턴)</small></span><button class="cfb" style="padding:3px 8px;font-size:11px" onclick="dcDel(\''+c.id+'\')">삭제</button></div>'; }).join(''):'<div class="dc-note">저장된 대화가 없어요</div>'); };
window.dcView=function(id){ var c=findC(id), l=clr(); if(!c||!l) return; c.m.forEach(function(m){ add(m.r,m.t); });
  var b=document.createElement('div'); b.style.cssText='display:flex;gap:6px;flex:none'; b.innerHTML='<button class="cfb" style="flex:1" onclick="dcResume(\''+id+'\')">이어서 대화하기</button><button class="cfb" style="flex:1" onclick="dcHist()">목록으로</button>'; l.appendChild(b); l.scrollTop=0; };
window.dcResume=function(id){ var c=findC(id); if(!c) return; if(DC.cur&&DC.cur!==c) summarize(DC.cur,'close'); DC.cur=c; DC.h=c.m.slice(-20).map(function(m){ return {role:m.r==='me'?'user':'assistant',content:m.t}; }); DC.view='chat'; clr(); c.m.forEach(function(m){ add(m.r,m.t); }); add('lw','다시 만나서 반가워요. 이어서 이야기해 볼까요?'); face('greet'); };
window.dcDel=function(id){ askOk('이 대화를 삭제할까요?',function(){ S.deepChats=(S.deepChats||[]).filter(function(x){ return x.id!==id; }); if(DC.cur&&DC.cur.id===id) DC.cur=null; save(); dcHist(); }); };

/* --- 설정 화면 --- */
window.dcSaveKey=function(v){ v=(v||'').trim(); if(!v) return; if(!lsSet(KEYN,v)){ toast('키를 저장하지 못했어요'); return; } toast(v==='demo'||v.indexOf('sk-ant-')===0?'키를 저장했어요':'저장했어요. 키 형식이 다른지 확인해 주세요'); dcSync(); };
window.dcClearKey=function(){ askOk('저장된 API 키를 이 기기에서 지울까요?',function(){ lsSet(KEYN,''); dcSync(); toast('키를 지웠어요'); }); };
window.dcTest=async function(){ if(!key()){ toast('먼저 API 키를 입력해 주세요'); return; } toast('연결 확인 중…'); try{ await call([{role:'user',content:'안녕'}],30); toast('연결 성공!'); }catch(e){ toast('실패: '+String(e.message||e).slice(0,80)); } };
window.dcStateToggle=function(v){ S.settings.lwState=!!v; save(); note(); toast(v?'로웨나가 앱 진행 상황을 읽을 수 있어요':'이제 로웨나는 앱 진행 상황을 보지 않아요'); };
window.dcSaveToggle=function(v){ S.settings.dcSave=!!v; save(); note(); toast(v?'대화를 이 기기에 저장해요':'이제 대화를 저장하지 않아요'); };
window.dcWipe=function(){ askOk('저장된 로웨나 대화를 모두 삭제할까요? (장기 기억은 밀담실의 🧠 기억에서 따로 지워요. 되돌릴 수 없어요)',function(){ S.deepChats=[]; DC.cur=null; save(); toast('삭제했어요'); }); };
window.dcSync=function(){ var ss=document.getElementById('dcSaveSel'); if(ss) ss.value=saveOn()?'1':'0'; var st=document.getElementById('lwStateSel'); if(st) st.value=stateOn()?'1':'0';
  var k=key(), ki=document.getElementById('dcKey'); if(ki){ ki.value=''; ki.placeholder=k?(k==='demo'?'demo 모드':'저장됨 (•••• '+k.slice(-4)+')'):'sk-ant-...'; } };
LQ.on('master:after',function(){ try{ dcSync(); }catch(e){ LQ.err(e); } });

/* --- 밀담실에 버튼 하나 (기존 기능은 그대로 두고 아래에 덧붙임) --- */
var _oc=window.openConfess; window.openConfess=function(){ var r=_oc.apply(this,arguments);
  try{ if(!document.getElementById('dcBtn')){ var sb=document.getElementById('cfSendBtn'); if(sb){ var b=document.createElement('button'); b.className='cfb'; b.id='dcBtn'; b.style.width='100%'; b.textContent='💬 길게 얘기하고 싶어요'; b.onclick=window.dcOpen; sb.insertAdjacentElement('afterend',b); } } }catch(e){ LQ.err(e); }
  return r; };
migrate();
setTimeout(function(){ try{ var L=(S.deepChats||[]).slice().reverse().filter(function(c){ return uns(c).length>=8; }); if(L.length&&L[0]!==DC.cur) summarize(L[0],'close'); }catch(e){ LQ.err(e); } },6000);

})();
