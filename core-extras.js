/* ===== core-extras.js : 오늘의 질문, 원터치, 회상, 주간 편지, 업적·보상 기본 목록 (core.js에서 나눔, 순서 유지) ===== */
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
/* 주간 편지 머리: 최근 7일 도트 줄(클리어=금빛, 조금 한 날=보라, 쉬는 날=☾)과 가장 잘한 날 */
function weekStripHTML(){ const W=['일','월','화','수','목','금','토'], t=todayStr(), days=[];
  for(let i=6;i>=0;i--){ const d=new Date(Date.parse(t+'T00:00:00Z')-i*864e5).toISOString().slice(0,10); days.push(d); }
  let best=null, cl=0, nights=0;
  const cells=days.map(d=>{ const r=S.history[d]||{}, n=Object.keys(r.done||{}).filter(k=>r.done[k]).length, p=r.percent||0, dw=new Date(d+'T00:00:00Z').getUTCDay();
    if(r.cleared) cl++; if((S.sleepLog||{})[d]) nights++;
    if(n&&(!best||p>=best.p)) best={d,p,dw};
    const c=r.cleared?'wk-g':(r.pass?'wk-p':(n?'wk-s':'')); return '<div class="wk-c"><i class="wk-d '+c+'">'+(r.pass&&!r.cleared?'☾':'')+'</i><span>'+W[dw]+'</span></div>'; }).join('');
  const bestTxt=best?'✦ 가장 잘한 날 · '+(+best.d.slice(5,7))+'월 '+(+best.d.slice(8))+'일('+W[best.dw]+') '+Math.round(best.p)+'%':'✦ 이번 주는 쉬어 가는 한 주였어요';
  return '<div class="wk-box"><div class="wk-row">'+cells+'</div><div class="wk-sum">'+bestTxt+'<br>클리어 '+cl+'일 · 하루 마무리 '+nights+'번</div></div>'; }
function openWeekLetter(){ showModal('<h3 style="margin-bottom:6px">로웨나의 주간 편지</h3>'+weekStripHTML()+'<div class="mascot-row" style="margin-top:6px">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(weekLetterText())+'</div></div><button class="cfb" style="width:100%;margin-top:12px" onclick="closeModal()">닫기</button>'); }



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
    return `<div class="seal ${a.unlocked?'':'locked'}"><div class="icon">${a.unlocked?'✦':'🔒'}</div><div style="flex:1"><div class="t">${h?'???':esc(a.name)}${a.unlocked?' · 해금':''}</div><div class="d">${h?'숨겨진 업적이에요':esc(a.desc||'')}</div><div class="d" style="opacity:.7;margin-top:3px">조건: ${h?'???':condLabel(a.cond)} · ◈${halfG(a.gold||20)}${a.unlocked&&a.unlockedAt?' · <span class="nw">'+esc(String(a.unlockedAt))+'</span>':''}</div>${(!a.unlocked&&(!a.cond||a.cond.type==='manual'))?`<button class="ghost-btn" style="margin-top:6px" onclick="manualUnlock('${a.id}')">달성 처리</button>`:''}</div></div>`; }).join('')||'<div class="empty">해당하는 업적이 없어요</div>';
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
  document.getElementById('treasureList').innerHTML=`<div class="gold-bar">◈<span class="kr">골드</span>${(S.gold||0).toLocaleString()}</div>${chestBtn()}`+tabsHTML('tre',[['shop','상점 '+cnt('shop')],['own','보유 '+cnt('own')],['used','사용됨 '+cnt('used')]])+rows+pgHTML('tre',list.length);
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
