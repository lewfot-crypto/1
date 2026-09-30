(function(){
const $=id=>document.getElementById(id);
const inM=()=>{const e=$('screen-master');return !!(e&&e.classList.contains('active'));};
const pop=t=>{ if(S.settings.martyPop===false) toast('마티: '+t); else martyShow(null,t); };
document.head.insertAdjacentHTML('beforeend','<style>.mt-qb{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.mt-qb button{background:#d6c7a0;border:1px solid var(--gold-d);border-radius:12px;color:var(--ink);padding:5px 10px;font-size:12px;cursor:pointer;font-family:inherit}#mtGuide{margin-bottom:14px}#mtGuide .speech-bubble b{font-size:11px;color:var(--gold-d)}.mg-box .mg-foot .gold-btn,.mg-box .mg-foot .ghost-btn{flex:1}</style>');
function dlg(say,body,btns){ const o=$('askOv'); window._mtB=btns;
  o.innerHTML='<div class="ask-box mg-box"><div class="mg-row"><img class="mg-img" src="'+MARTY_IMG+'" alt=""><div class="speech-bubble">'+say+'</div></div>'+(body||'')+'<div class="mg-foot">'+btns.map((b,i)=>'<button class="'+(b[2]||'ghost-btn')+'" onclick="_mtBtn('+i+')">'+b[0]+'</button>').join('')+'</div></div>';
  o.classList.add('show'); const inp=o.querySelector('input[type=text],input:not([type])'); if(inp) setTimeout(()=>inp.focus(),60); }
window._mtBtn=i=>{ const o=$('askOv'), b=window._mtB[i], before=o.innerHTML, r=b[1]?b[1]():null; if(r!=='keep'&&o.innerHTML===before){ o.classList.remove('show'); o.innerHTML=''; } };
const _ad=window.askDlg;
window.askDlg=function(title,inner,ok,no){ if(!inM()) return _ad(title,inner,ok,no);
  dlg(esc(title),inner,[['잠깐만요',()=>{ if(no) no(); }],['네, 부탁해요',()=>{ const i=$('askIn'); ok(i?i.value:''); },'gold-btn']]); };
/* 새 데일리 퀘스트: 마티와 함께 */
const IDEAS=['💧 물 2L 마시기','🚶 30분 걷기','🧘 스트레칭 10분','📖 책 10쪽 읽기','🛏 12시 전에 눕기','🍽 저녁 챙겨 먹기','📝 하루 한 줄 기록','🪥 영양제 챙기기','☀️ 아침 햇빛 쬐기'];
let G={};
function dqPick(){ const have=new Set(S.dailyQuests.map(q=>q.name)), pool=IDEAS.filter(x=>!have.has(x)), a=[]; while(a.length<3&&pool.length) a.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); return a; }
window.mtNewDQ=function(){ G={step:'pick',picks:dqPick()}; rd(); };
window._mtDq=i=>{ G.name=G.picks[i]; G.step='detail'; rd(); };
function rd(){
  if(G.step==='pick') dlg('새 데일리 퀘스트를 만들어 볼까요? ✨\n제가 골라 봤어요. 마음에 드는 걸 눌러 주세요!',G.picks.map((t,i)=>'<button class="mg-opt" onclick="_mtDq('+i+')"><b>'+esc(t)+'</b><span>눌러서 담기</span></button>').join(''),[['🔄 다른 추천',()=>{G.picks=dqPick();rd();}],['✏️ 직접 쓸래요',()=>{G.step='name';G.name='';rd();}],['닫기',null]]);
  else if(G.step==='name') dlg('어떤 퀘스트예요?\n하루 끝에 해냈는지 바로 알 수 있게 짧게 적어 봐요.','<input id="mtDqName" maxlength="30" placeholder="예: 💧 물 2L 마시기" value="'+esc(G.name||'')+'">',[['뒤로',()=>{G.step='pick';G.picks=dqPick();rd();}],['다음',()=>{ const v=$('mtDqName').value.trim(); if(!v){ toast('마티: 이름을 알려 주세요!'); return 'keep'; } G.name=v; G.step='detail'; rd(); },'gold-btn']]);
  else dlg("'"+esc(G.name)+"' 좋아요!\n완료 조건이나 쉬는 요일을 정해 두면 더 지키기 쉬워요. (건너뛰어도 돼요)",'<input id="mtDqDesc" maxlength="40" placeholder="완료 조건 (선택) 예: 저녁 식사 후 30분 이내" value="'+esc(G.desc||'')+'"><div style="display:flex;flex-wrap:wrap;margin-top:8px">'+['일','월','화','수','목','금','토'].map((d,i)=>'<label style="margin:0 8px 4px 0;font-size:13px;display:flex;align-items:center;gap:3px"><input type="checkbox" class="mtOff" value="'+i+'" style="width:auto;margin:0">'+d+'</label>').join('')+'</div><div style="font-size:11px;color:var(--ink-soft);margin-top:4px">체크한 요일은 쉬어요</div>',[['뒤로',()=>{G.desc=$('mtDqDesc').value;G.step='pick';G.picks=dqPick();rd();}],['만들기',()=>{ const q={id:'d'+Date.now(),name:G.name,active:true}, d=$('mtDqDesc').value.trim(), off=[...document.querySelectorAll('.mtOff')].filter(x=>x.checked).map(x=>+x.value); if(d) q.desc=d; if(off.length) q.off=off; S.dailyQuests.push(q); save(); renderMaster(); renderHome(); pop("새 퀘스트 '"+G.name+"' 등록 완료! 내일부터 같이 해 봐요 🌱"); },'gold-btn']]);
}
/* 규칙 변경: 설명 후 확인 */
window.mtRule=function(k,el){ const old=k==='clear'?S.settings.clearPercent:dayStartH(), v=+el.value; if(v===old) return;
  let n=0; try{ n=computeToday().active.length; }catch(e){}
  const say=k==='clear'?'CLEAR 기준을 '+old+'% → '+v+'%로 바꿀까요?\n지금 퀘스트가 '+n+'개라면 '+Math.ceil(n*v/100-1e-9)+'개를 해야 클리어예요. '+(v>old?'조금 더 도전적이에요!':'조금 더 여유로워져요.'):'하루 시작을 '+old+'시 → '+v+'시로 바꿀까요?\n한국시간 '+v+'시 전의 밤은 전날로 계산돼요. 캘린더의 날짜 구분이 달라질 수 있어요.';
  dlg(say,'',[['그대로 둘래요',()=>{ el.value=old; }],['바꿀게요',()=>{ (k==='clear'?setClearPercent:setDayStart)(v); pop(k==='clear'?'기준을 '+v+'%로 맞췄어요. 오늘 계산부터 적용돼요!':'하루 시작을 '+v+'시로 맞췄어요!'); },'gold-btn']]); };
/* 삭제/일시정지/초기화 */
window.deleteDQ=function(id){ const q=S.dailyQuests.find(d=>d.id===id); if(!q) return;
  dlg("'"+esc(q.name)+"' 퀘스트를 삭제할까요?\n삭제하면 목록에서 사라져요. 잠깐만 쉬게 하려면 ⏸(일시정지)가 더 안전해요!",'',[['⏸ 일시정지',()=>{ if(q.active) toggleActiveDQ(id); }],['삭제할게요',()=>{ S.dailyQuests=S.dailyQuests.filter(d=>d.id!==id); save(); renderMaster(); renderHome(); pop('삭제했어요. 필요하면 언제든 새로 만들어요!'); },'gold-btn'],['취소',null]]); };
const _tg=window.toggleActiveDQ; window.toggleActiveDQ=function(id){ _tg(id); const q=S.dailyQuests.find(d=>d.id===id); if(q) pop(q.active?"'"+q.name+"' 다시 시작해요! 💪":"'"+q.name+"'는 잠깐 쉬어요. ▶로 언제든 깨워 줘요 🌙"); };
window.resetAllData=function(){ dlg('모든 기록을 지우려는 거예요? 😢\n퀘스트 체크, 업적, 고해 노트, 설정이 이 기기에서 전부 사라져요. 먼저 백업해 두면 안전해요!','',[['💾 백업부터',()=>{ exportBackup(); const t=$('backupText'); if(t&&t.scrollIntoView) t.scrollIntoView({block:'center'}); }],['그래도 지울게요',()=>{ dlg('정말 정말 지울까요?\n되돌릴 수 없어요. 마지막 확인이에요!','',[['아니에요',null],['지울게요',()=>{ try{ S=defaultData(); S.firstSeen=Date.now(); localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} location.reload(); },'gold-btn']]); }],['취소',null]]); };
/* 모달 안내 + 저장 후 반응 */
function tip(t){ const h=$('modalBox').querySelector('h2'); if(!h) return; const d=document.createElement('div'); d.className='mg-row'; d.innerHTML='<img class="mg-img" style="width:44px" src="'+MARTY_IMG+'" alt=""><div class="speech-bubble" style="white-space:pre-line">'+t+'</div>'; h.insertAdjacentElement('afterend',d); }
[['openDqModal',()=>'이름은 그대로 두고 완료 조건만 적어도 좋아요.\n쉬는 요일을 체크하면 그날은 이 퀘스트가 빠져요!'],
 ['openAchModal',id=>id?'이름이나 조건을 바꿔도 이미 해금한 기록은 그대로예요 ✨':'나만의 업적을 만들어 봐요!\n조건을 고르면 자동으로 해금되고, "직접 달성 처리"는 내가 눌러 해금해요.'],
 ['openEvModal',id=>id?'항목 이름을 고쳐도 완료한 표시는 이어져요 ✨':'이번 달에만 열리는 한정 퀘스트예요. 항목은 3~5개가 딱 좋아요!\n모두 끝내면 보물이 생겨요 🎁']].forEach(([n,f])=>{ const o=window[n]; window[n]=function(id){ o(id); if(inM()) tip(f(id)); }; });
[['saveDQ','퀘스트를 고쳤어요! 홈 화면에도 바로 반영됐어요 ✨'],['saveAch','업적이 준비됐어요! 조건을 채우면 반짝 해금돼요 🏆'],['saveEv','이벤트가 저장됐어요! 홈에서 확인해 봐요 🎊']].forEach(([n,m])=>{ const o=window[n]; window[n]=function(id){ o(id); if(!$('modalOverlay').classList.contains('show')) pop(m); }; });
/* 토글·배경·백업 반응 */
const _lw=window.setLw; window.setLw=function(k,v){ _lw(k,v); const L={lowenaReact:['로웨나가 다시 말을 걸어 줄 거예요 📖','로웨나는 조용히 지켜볼게요. 필요하면 다시 켜 줘요'],martyPop:['다시 불러 줘서 고마워요! 반짝반짝 등장할게요 ✨',null],martyChat:['시간대별로 수다 떨러 올게요! ☀️','알겠어요, 말 거는 건 참을게요 🤐'],confess:['언제든 로웨나에게 털어놓아도 돼요 🤍','고해성사는 잠시 접어 둘게요']}[k]; if(!L) return;
  const t=v?L[0]:L[1]; if(t===null) toast('마티: 알겠어요, 조용히 있을게요. 필요하면 다시 불러 줘요 🌙'); else if(t) pop(t); };
const _bg=window.setBgPattern; window.setBgPattern=function(v){ _bg(v); pop(v==='none'?'원래 배경으로 돌아왔어요!':"배경이 '"+bgNames()[v]+"'로 바뀌었어요. 분위기 좋죠? ✨"); };
const _eb=window.exportBackup; window.exportBackup=function(){ _eb(); if(inM()) pop('백업 코드를 만들었어요! 복사해서 메모 앱이나 카카오톡 "나에게 보내기"에 보관해 두세요 💾'); };
/* 설정 탭 상단 마티 안내 */
function guide(){ let b=$('mtGuide'); if(!b){ b=document.createElement('div'); b.id='mtGuide'; document.querySelector('#screen-master .section-h').insertAdjacentElement('afterend',b); }
  const old=!S.lastBackup||Date.now()-S.lastBackup>7*864e5, noEv=!S.events.some(e=>!evExpired(e));
  const tip=!S.dailyQuests.length?'데일리 퀘스트가 아직 없어요. 같이 하나 만들어 볼까요? 🌱':old?'백업한 지 좀 됐어요. 기록이 사라지지 않게 코드를 만들어 둘까요? 💾':noEv?'이번 달 이벤트가 아직 없어요. 한정 퀘스트를 만들어 볼까요? 🎊':'바꾸고 싶은 게 있어요? 제가 옆에서 안내할게요! ✨';
  b.innerHTML='<div class="mg-row" style="margin:0"><img class="mg-img" src="'+MARTY_IMG+'" alt=""><div class="speech-bubble"><b>마티의 설정 안내</b><br>'+tip+'<div class="mt-qb"><button onclick="mtNewDQ()">🌱 새 퀘스트</button><button onclick="openAchModal()">🏆 새 업적</button><button onclick="openEvModal()">🎊 이벤트</button><button onclick="exportBackup()">💾 백업</button></div></div></div>'; }
const _rm=window.renderMaster; window.renderMaster=function(){ _rm(); guide(); };
if(inM()) window.renderMaster();
})();

(function(){
const $=id=>document.getElementById(id);
const inM=()=>{const e=$('screen-master');return !!(e&&e.classList.contains('active'));};
const pop=t=>{ if(S.settings.martyPop===false) toast('마티: '+t); else martyShow(null,t); };
const won=n=>Math.round(n).toLocaleString()+'원';
const pct=(o,c)=>o>0?Math.max(0,Math.min(100,Math.round((o-c)/o*100))):0;
/* 1) 빚·BODY 숫자 수정: 마티가 계산해서 알려 주고 확인 */
const _sp=window.setProg;
window.setProg=function(k,el){
  const tgt=(k==='total')?bodyQ():debtQ(); if(!tgt) return _sp(k,el);
  const raw=String(el.value).trim(), n=Number(raw), old=tgt[k];
  if(raw===''||!isFinite(n)||n<0||((k==='total'||k==='original')&&n<1)) return _sp(k,el);
  const r=Math.round(n); if(r===old) return;
  let say,done;
  if(k==='original'){ const c=tgt.current; say='빚 원금을 '+won(old)+' → '+won(r)+'으로 바꿀까요?\n남은 금액은 그대로라서 상환율이 '+pct(old,c)+'% → '+pct(r,c)+'%로 달라져요.'+(c>r?'\n(남은 금액이 원금보다 커요. 남은 금액도 확인해 봐요!)':''); done='원금을 고쳤어요. 상환율도 다시 계산했어요 🧮'; }
  else if(k==='current'){ const d=old-r, o=tgt.original; say='남은 금액을 '+won(old)+' → '+won(r)+'으로 바꿀까요?\n'+(d>0?won(d)+' 더 갚은 걸로':won(-d)+' 늘어난 걸로')+' 기록돼요. 상환율은 '+pct(o,old)+'% → '+pct(o,r)+'%예요.'; done=d>0?won(d)+'이나 갚았네요! 대단해요 🎉':'괜찮아요, 숫자는 다시 줄이면 돼요. 같이 가요 💪'; }
  else { const p=tgt.progress||0; say='BODY 프로젝트를 '+old+'일 → '+r+'일로 바꿀까요?\n지금까지 '+p+'일 채웠어요.'+(r<p?'\n(이미 채운 일수보다 짧아져요)':''); done='BODY 목표를 '+r+'일로 맞췄어요. 천천히 함께 가요 🌿'; }
  askOk(say,()=>{ _sp(k,el); if(tgt[k]===r) pop(done); },()=>{ el.value=old; });
};
/* 2) 사운드 */
const _tsf=window.toggleSfx; window.toggleSfx=function(){ _tsf(); if(inM()) pop(sfxOn()?'효과음이 켜졌어요! 체크할 때마다 톡톡 울려요 🔔':'효과음을 껐어요. 조용히 할 수 있어요 🤫'); };
const _tbg=window.toggleBgm; window.toggleBgm=function(){ _tbg(); if(inM()) pop(bgmOn()?'배경음악을 켰어요! 브라우저 규칙상 첫 터치 때부터 흘러나올 수 있어요 🎵':'배경음악을 껐어요. 다시 듣고 싶으면 ♪를 눌러요'); };
let vt=null; const _sv=window.setVol; window.setVol=function(v){ _sv(v); clearTimeout(vt); vt=setTimeout(()=>{ if(!inM()) return; v=+v; pop(v===0?'볼륨이 0이에요. 소리를 들으려면 슬라이더를 올려 줘요 🔈':v<30?'살짝 작게 맞췄어요. 밤에 쓰기 좋아요 🌙':v>80?'우와, 빵빵해요! 주변 사람 놀라지 않게 조심해요 📢':'딱 좋은 소리예요 🎶'); },700); };
/* 3) 업적·이벤트 편집창: 마티의 추천 */
const bub=()=>$('modalBox').querySelector('.mg-row .speech-bubble');
const say=t=>{ const b=bub(); if(b) b.textContent=t; };
const streakNext=()=>{ let c=0; try{ c=curStreak(); }catch(e){} return [3,5,7,10,14,21,30,50,100].find(x=>x>c)||100; };
function achIdeas(){ const A=[['🔥 다음 불꽃','연속 '+streakNext()+'일 클리어','streak',streakNext()],['📅 한 달의 모험가','누적 30일 클리어','totalClear',30],['🎁 보상 애호가','보상을 5번 사용하기','rewardsUsed',5],['🌙 일찍 자는 사람','일찍 자기 7번','earlySleep',7],['💰 빚 절반 돌파','빚 50% 상환','debtPct',50],['🏅 나만의 훈장','내가 직접 달성 처리','manual',1]];
  return A.filter(a=>COND_TYPES.some(t=>t[0]===a[2])).sort(()=>Math.random()-.5).slice(0,4); }
const mon=()=>kstNow().getUTCMonth()+1;
function evIdeas(){ const m=mon(), E=[['🌿 '+m+'월 건강 챌린지',['물 2L 마시기 5일','30분 걷기 3번','스트레칭 5번','일찍 자기 3번'],'🍰 좋아하는 디저트'],['📚 '+m+'월 마음 채우기',['책 30쪽 읽기','영화 한 편 보기','산책하며 사진 3장 찍기','메모나 편지 써 보기'],'☕ 카페 나들이'],['🏠 '+m+'월 정리 챌린지',['서랍 하나 정리하기','안 입는 옷 5벌 고르기','책상 위 비우기','사진·앱 정리하기'],'🪴 작은 화분'],['🍳 '+m+'월 집밥 챌린지',['새 요리 하나 도전','도시락 3번 싸기','간식 직접 만들기','장 보고 냉장고 정리'],'🧁 예쁜 컵케이크'],['🎨 '+m+'월 취미 챌린지',['새로운 취미 검색하기','30분 몰입해 보기','결과물 사진 남기기','친구에게 자랑하기'],'🎁 취미 용품 하나']];
  return E.sort(()=>Math.random()-.5).slice(0,3); }
let AI=[],EI=[];
function chips(list,fn,label){ const d=document.createElement('div'); d.className='mt-qb'; d.style.margin='-2px 0 10px'; d.innerHTML=list.map((x,i)=>'<button onclick="'+fn+'('+i+')">'+esc(x[0])+'</button>').join('')+'<button onclick="'+label+'()">🔄 다른 추천</button>'; return d; }
function mountChips(kind){ const row=$('modalBox').querySelector('.mg-row'); if(!row) return; const old=$('modalBox').querySelector('.mt-qb'); if(old) old.remove(); row.insertAdjacentElement('afterend',kind==='ach'?chips(AI,'_mtAch','_mtAchR'):chips(EI,'_mtEv','_mtEvR')); }
window._mtAchR=()=>{ AI=achIdeas(); mountChips('ach'); };
window._mtEvR=()=>{ EI=evIdeas(); mountChips('ev'); };
window._mtAch=i=>{ const a=AI[i]; if(!a||!$('achName')) return; $('achName').value=a[0]; $('achDesc').value=a[1]; $('achType').value=a[2]; achTypeChange(); if($('achVal')&&a[2]!=='manual') $('achVal').value=a[3]; say("'"+a[0]+"'로 채웠어요! 마음대로 고쳐서 저장해 봐요 ✨"); };
window._mtEv=i=>{ const e=EI[i]; if(!e||!$('evName')) return; $('evName').value=e[0]; $('evItems').value=e[1].join('\n'); $('evReward').value=e[2]; say("'"+e[0]+"' 골랐어요! 항목과 보상은 자유롭게 바꿔도 돼요 🎊"); };
const _oa=window.openAchModal; window.openAchModal=function(id){ _oa(id); if(inM()&&!id){ AI=achIdeas(); mountChips('ach'); } };
const _oe=window.openEvModal; window.openEvModal=function(id){ _oe(id); if(inM()&&!id){ EI=evIdeas(); mountChips('ev'); } };
/* 4) 빈칸 저장 시 마티가 부드럽게 안내 */
const guard=(fn,check)=>{ const o=window[fn]; window[fn]=function(id){ const m=inM()&&check(); if(m){ say(m); return; } return o(id); }; };
guard('saveAch',()=>{ const n=$('achName'); return n&&!n.value.trim()?'이름부터 정해 볼까요?\n위의 추천을 눌러 보면 쉬워요!':''; });
guard('saveDQ',()=>{ const n=$('dqName'); return n&&!n.value.trim()?'퀘스트 이름이 비어 있어요. 짧게라도 적어 줘요 ✏️':''; });
guard('saveEv',()=>{ const n=$('evName'), it=$('evItems'); if(n&&!n.value.trim()) return '이벤트 이름부터 정해 볼까요?\n위의 추천을 눌러 보면 쉬워요!'; if(it&&!it.value.trim()) return '항목이 하나도 없어요!\n한 줄에 하나씩 적어 줘요. 3~5개가 딱 좋아요 📝'; return ''; });
})();

(function(){
const $=id=>document.getElementById(id);
const RT={
 morn:['좋은 아침이에요. 오늘도 우리 함께 천천히 시작해 봐요.','아침이에요. 물 한 잔 마시고, 오늘 할 일을 한 번 훑어볼까요?','서두르지 않아도 돼요. 오늘의 첫 페이지를 같이 열어요.','밤새 쉬었으니 오늘은 가볍게 시작해도 충분해요.'],
 fore:['오전이 흐르고 있어요. 지금 할 수 있는 작은 것 하나부터 해 볼까요?','숨을 한 번 깊게 쉬고, 어깨의 힘을 풀어요. 그다음에 시작해요.','한 번에 하나씩, 그게 가장 빠른 길이에요.','지금 이 순간에 집중해도 충분해요. 나는 옆에 있어요.'],
 lunch:['점심 시간이에요. 잠시 멈추고 제대로 챙겨 먹어요.','든든히 먹는 것도 오늘의 중요한 퀘스트예요.','식사하고 나면 잠깐 걸어 보는 것도 좋아요.'],
 aft:['오후는 조금 나른하죠. 괜찮아요, 천천히 가도 우리는 도착해요.','지금까지 한 것만 돌아봐도 충분히 잘하고 있어요.','잠깐 창밖을 바라보고, 다시 이어가요.','피곤하면 쉬어도 돼요. 쉬는 것도 여정의 일부니까요.'],
 eve:['하루가 저물어 가요. 오늘의 나에게 수고했다고 말해 줘요.','저녁이에요. 남은 퀘스트가 있다면 무리하지 말고 하나만 골라 봐요.','오늘 걸어온 길을 잠시 돌아봐요. 생각보다 멀리 왔을 거예요.'],
 night:['늦은 시간이에요. 이제 하루를 접고 쉬어도 좋아요.','내일의 페이지는 내일 쓰면 돼요. 오늘은 여기까지 해요.','잘 자요. 내일도 내가 옆에 있을게요.','오늘 못한 건 내일 다시 하면 돼요. 벌점은 없어요.']
};
const RC={
 none:['아직 오늘의 페이지가 비어 있네요. 가장 쉬운 것 하나만 같이 해 볼까요?','시작이 가장 무겁게 느껴질 때가 있어요. 제일 작은 것부터 해요.'],
 mid:['벌써 {d}개를 해냈어요. 이 리듬 그대로 가요.','좋은 흐름이에요. 남은 건 차근차근 이어가요.'],
 near:['{n}개만 더 하면 오늘의 페이지가 완성돼요. 거의 다 왔어요.','{n}개 남았어요. 지금의 당신이라면 충분히 할 수 있어요.'],
 cleared:['오늘의 퀘스트를 모두 마쳤어요. 정말 수고했어요.','오늘의 페이지가 완성됐어요. 이제 편히 쉬어요.']
};
const RM=['마티는 오늘도 정신없이 날아다니네요. 그래도 당신을 위해서예요.','마티가 또 뭔가 준비하고 있는 것 같아요. 같이 응원해 줄 거예요.','제 조수가 조금 소란스럽죠? 하지만 마음만은 누구보다 진심이에요.'];
const MTA=['로웨나 님 말씀 들었죠? 저는 옆에서 응원 요정으로 대기 중이에요! 📣','로웨나 님의 조수 마티, 출동! 어려우면 저를 불러요 ✨','로웨나 님이 이끌고 제가 반짝이면 무적이에요! 🌟','방금 그 말, 마티가 보증해요! 우리 셋이 함께면 해낼 수 있어요 💫'];
/* 마티는 로웨나의 조수라는 설정 반영 */
MT_T.morn.push('로웨나 님이 아침부터 기다리고 계세요! 조수답게 제가 먼저 인사하러 왔어요 ☀️');
MT_T.fore.push('로웨나 님은 차분하게, 저는 발랄하게! 둘이 합치면 완벽하죠? ✨');
MT_T.lunch.push('점심 챙기라고 로웨나 님이 시켰어요… 아니, 제가 자원했어요! 🍚');
MT_T.aft.push('로웨나 님께 오늘 진행 상황 보고드릴게요. 꽤 좋아요! 📋');
MT_T.eve.push('로웨나 님이 오늘 수고했다고 전해 달래요. (제가 하는 말이지만요 😚)');
MT_T.night.push('로웨나 님이 이제 쉬라고 하셨어요. 저도 하품이 나와요… 🥱');

/* ===== 취향 대사 1단계: 차·향·고전(겐지 이야기 중심) ===== */
RT.morn.push('아쌈을 조금 진하게 우렸어요. 우유를 넣는 쪽이 오늘의 기분에 어울려요.','우쓰세미는 허물 같은 옷만 남기고 떠났지만, 당신은 이불만 벗고 나오면 충분해요.','헤이안의 사람들은 아침에 편지를 꽃가지에 묶어 보냈대요. 오늘 아침엔 어떤 소식이 올까요.','핸드드립 물이 천천히 내려가는 동안, 오늘 할 일도 천천히 떠올려 봐요.');
RT.fore.push('콜드브루를 꺼내 왔어요. 밤새 천천히 우러난 커피라 첫 모금이 부드러워요. 오늘 일도 그렇게 시작해요.','베티버 향을 살짝 피웠어요. 비 갠 뒤 젖은 흙 냄새를 닮았어요.','겐지 이야기는 쉰네 장에 걸쳐 천천히 흘러가요. 하루쯤 서두르지 않아도 되는 이유가 되죠.');
RT.lunch.push('식사 뒤엔 녹차가 좋아요. 물은 너무 뜨겁지 않게, 무리하지 않는 온도로요.','센차 한 잔이면 오후의 첫 걸음이 가벼워져요.','잠깐 창가에 앉아 있어요. 겐지 이야기의 사람들도 이런 한낮엔 부채질하며 이야기를 나눴겠죠.');
RT.aft.push('우롱차를 세 번째 우렸어요. 처음보다 지금이 더 향기로워요. 반복은 그렇게 깊어져요.','재스민 향이 오후 햇살과 잘 어울려요. 잠깐 숨을 고르고 가요.','헤이안의 사람들은 계절마다 옷 색을 겹쳐 입는 배색에 이름까지 붙였대요. 오늘 오후는 무슨 색일까요.','봄과 가을 중 어느 계절이 더 좋은지 우아하게 겨루던 장면이 겐지 이야기에 있어요. 지금 이 오후는 어느 쪽일까요.');
RT.eve.push('서가에 백단 향을 피웠어요. 하루가 저무는 냄새예요.','보이차를 우렸어요. 묵은 차일수록 깊은 맛이 나듯, 오늘 하루도 어딘가에 깊이 쌓였을 거예요.','저녁에 피는 꽃이라 유가오라는 이름이 붙었대요. 하루가 저물 때 열리는 것도 있으니까요.','반딧불을 풀어 사람의 얼굴을 비추던 장면이 있어요. 작은 빛 하나면 충분한 저녁도 있죠.','벽난로 곁의 찻잔이 생각나는 저녁이에요. 제인 에어가 그토록 바랐던 따뜻한 자리 같은 시간이죠.');
RT.night.push('이 시간의 커피는 내일 아침으로 미뤄 둘게요. 대신 향을 하나 피울까요.','오늘은 달이 참 밝네요. …그냥 그렇다는 얘기예요.','침향을 조금 태웠어요. 연기가 곧게 올라가는 걸 보고 있으면 생각이 가라앉아요.','헤이안의 사람들은 달이 뜨면 시부터 떠올렸대요. 당신은 오늘 어떤 한 줄이었나요.','비 오는 밤에 벗들이 밤새 이야기를 나누던 장면이 겐지 이야기에 있어요. 오늘은 조용히 오늘을 정리해 봐요.');
RM.push('마티가 또 콜드브루 병 주변을 맴돌고 있어요. 요정에게 카페인은 위험한데요.','마티가 향로에 코를 들이밀었다가 재채기를 했어요. 그래도 표정은 뿌듯해 보여요.');
document.head.insertAdjacentHTML('beforeend','<style>#lowenaPop{position:fixed;left:max(10px,calc((100vw - 480px)/2 + 10px));bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:1000;pointer-events:none;display:none;max-width:calc(100vw - 20px)}#lowenaPop.show{display:block}.rp-all{display:flex;align-items:flex-end;gap:8px;animation:rpIn 8s ease both}.rp-all .mascot{flex:none;pointer-events:auto}.rp-bub{max-width:min(230px,calc(100vw - 100px));background:var(--parch);color:var(--ink);border:1px solid var(--gold-d);border-radius:10px;padding:8px 12px;font-size:12.5px;line-height:1.5;position:relative;margin-bottom:8px;box-shadow:0 4px 14px rgba(0,0,0,.4);pointer-events:auto;word-break:keep-all}.rp-bub b{display:block;font-size:11px;color:var(--gold-d);margin-bottom:2px}.rp-bub:before{content:"";position:absolute;left:-7px;bottom:14px;border:7px solid transparent;border-left:0;border-right-color:var(--gold-d)}.rp-bub:after{content:"";position:absolute;left:-5px;bottom:15px;border:6px solid transparent;border-left:0;border-right-color:var(--parch)}@keyframes rpIn{0%{opacity:0;transform:translateY(10px)}9%{opacity:1;transform:none}90%{opacity:1}100%{opacity:0}}.rp-bub .rp-reply{display:block;margin-top:6px;background:transparent;border:1px solid var(--gold-d);color:var(--gold-d);border-radius:10px;padding:3px 9px;font-size:11px;cursor:pointer;font-family:inherit}</style>');
document.body.insertAdjacentHTML('beforeend','<div id="lowenaPop"></div>');
let _rT=null, visUntil=0, _lastR='';
const pick=(P,f,key)=>{ let t=LQD.pick(key||null,P,{who:'lowena'}); return f?f(t):t; };
function lowenaLine(){ const b=martyBand(kstNow().getUTCHours()); let c=null,left=0,dn=0;
  try{ const act=computeToday().active, day=S.history[todayStr()]||{}; dn=act.filter(q=>(day.done||{})[q.id]).length; left=act.length-dn;
    c=day.cleared?'cleared':(act.length&&dn===0)?'none':(left>0&&left<=2)?'near':dn>0?'mid':null; }catch(e){}
  const fill=t=>t.replace('{n}',left).replace('{d}',dn), r=Math.random();
  const tl=window.lwTasteLine&&window.lwTasteLine(b); if(tl) return tl;
  if(r<.18) return {t:pick(RM,null,'lowena.home.misc'),mood:''};
  if(c&&r<.65) return {t:pick(RC[c],fill,'lowena.home.'+c),mood:c==='cleared'?'clear':''};
  return {t:pick(RT[b],null,'lowena.home.'+b),mood:''}; }
let _fT=null;
window.lowenaHide=function(){ clearTimeout(_rT); visUntil=0; const el=$('lowenaPop'); if(!el) return; clearTimeout(_fT);
  if(el.className!=='show'){ el.className=''; el.innerHTML=''; return; }
  el.style.transition='opacity .9s ease'; el.style.opacity='0'; el.style.pointerEvents='none';
  _fT=setTimeout(function(){ el.className=''; el.innerHTML=''; el.style.transition=''; el.style.opacity=''; el.style.pointerEvents=''; },950); };
var _lastLwLine='', _lastLwReplyable=false;
window.lowenaShow=function(txt){ const el=$('lowenaPop'); if(!el) return 0; let L=txt?{t:txt,mood:''}:lowenaLine(), ms=Math.min(11000,Math.max(5500,2800+L.t.length*150));
  _lastLwLine=L.t; _lastLwReplyable=!txt;
  el.innerHTML='<div class="rp-all" style="animation-duration:'+ms+'ms">'+mascotImg(64,L.mood)+'<div class="rp-bub"><span onclick="lowenaHide()"><b>로웨나</b>'+esc(L.t)+'</span>'+(_lastLwReplyable?'<button class="rp-reply" onclick="event.stopPropagation();lowenaReply();">답장하기</button>':'')+'</div></div>';
  clearTimeout(_fT); el.style.transition=''; el.style.opacity=''; el.style.pointerEvents=''; el.className='show'; clearTimeout(_rT); _rT=setTimeout(lowenaHide,ms); visUntil=Date.now()+ms; return ms; };
window.lowenaTrim=function(ms){ clearTimeout(_rT); _rT=setTimeout(lowenaHide,ms); visUntil=Date.now()+ms; };
window.lowenaReply=function(){ lowenaHide();
  cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble">'+esc(_lastLwLine)+'</div></div><textarea id="lwReplyInput" class="cf-ta" rows="4" placeholder="답장해 볼까요?" style="margin-top:10px"></textarea><button class="cfb" style="width:100%;margin-top:8px" onclick="lowenaReplySend()">보내기</button>'); };
window.lowenaReplySend=function(){ const t=(document.getElementById('lwReplyInput').value||'').trim(); if(!t){ toast('한 줄만 적어 주세요'); return; }
  let r,full;
  r=cfReplyFor('chat',t); full=r;
  (S.confess=S.confess||[]).push({id:'cf'+Date.now(),ts:Date.now(),d:todayStr(),k:'chat',text:t,reply:full}); save();
  cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(full)+'</div></div>'+'<div style="margin-top:12px"><button class="cfb" style="width:100%" onclick="closeModal()">닫기</button></div>'); };
/* 로웨나가 나와 있는 동안엔 마티가 잠깐 기다렸다가 등장 */
const _ms=window.martyShow; window.martyShow=function(k,t){ const w=visUntil-Date.now(); if(w>0){ setTimeout(()=>_ms(k,t),w+900); return; } return _ms(k,t); };
function lwDay(){ const t=todayStr(), o=S.lwChat; if(!o||o.d!==t) S.lwChat={d:t,b:[],t:o&&o.t||0}; return S.lwChat; }
function lowenaIdle(){ try{
  if(S.settings.lowenaReact===false||S.settings.lowenaChat===false||document.hidden||stampBusy) return;
  const sp=$('splash'); if(sp){ const cs=getComputedStyle(sp); if(cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05) return; }
  if($('modalOverlay').classList.contains('show')||$('askOv').classList.contains('show')) return;
  if($('lowenaPop').className==='show'||$('martyPop').className==='show') return;
  const h=kstNow().getUTCHours(); if(h>=1&&h<7) return;
  const m=lwDay(), b=martyBand(h); if(m.b.includes(b)||Date.now()-(m.t||0)<45*6e4) return;
  m.b.push(b); if(Math.random()>.45){ save(); return; }
  m.t=Date.now(); save(); const ms=lowenaShow();
  if(S.settings.martyPop!==false&&Math.random()<.4) setTimeout(()=>{ if($('martyPop').className!=='show') martyShow(null,LQD.pick('marty.greet',MTA,{who:'marty'})); },ms+1300);
}catch(e){} }
setInterval(lowenaIdle,50000); setTimeout(lowenaIdle,9000);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) setTimeout(lowenaIdle,3500); });
/* 설정 연동 */
const _lw=window.setLw; window.setLw=function(k,v){ _lw(k,v); if(k==='lowenaChat'){ if(v) lowenaShow('다시 때때로 찾아올게요. 우리 함께 천천히 가요.'); else toast('로웨나: 필요할 때 불러 줘요. 언제든 여기 있어요.'); } };
const _rm=window.renderMaster; window.renderMaster=function(){ _rm(); const e=$('lowenaChatSel'); if(e) e.value=S.settings.lowenaChat===false?'0':'1'; };
if($('screen-master')&&$('screen-master').classList.contains('active')) window.renderMaster();
})();

(function(){
const $=id=>document.getElementById(id);
const pick=P=>P[Math.floor(Math.random()*P.length)];
let byeOpen=false;
document.head.insertAdjacentHTML('beforeend','<style>.rp-bub{white-space:pre-line}#byeScreen{position:fixed;inset:0;z-index:350;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;background:radial-gradient(ellipse at 50% 30%,rgba(120,80,45,.38),transparent 62%),linear-gradient(#1f130b,#170e08 78%);opacity:0;transition:opacity .6s}#byeScreen.show{display:flex}#byeScreen.in{opacity:1}#byeScreen .by-b{width:min(320px,100%);background:var(--parch);color:var(--ink);border:1px solid var(--gold-d);border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.7;white-space:pre-line;box-shadow:0 6px 20px rgba(0,0,0,.5);position:relative;text-align:center}#byeScreen .by-b b{display:block;font-size:11px;color:var(--gold-d);margin-bottom:4px}#byeScreen .by-m{display:flex;align-items:center;gap:8px;width:min(320px,100%);font-size:12.5px;color:var(--parch)}#byeScreen .by-m img{width:44px;image-rendering:pixelated;filter:drop-shadow(0 0 6px rgba(243,216,138,.5));flex:none}#byeScreen .by-h{font-size:11.5px;color:#a99a76;text-align:center;line-height:1.5;min-height:17px}#byeScreen .by-f{display:flex;gap:8px;width:min(320px,100%)}#byeScreen .by-f button{flex:1;margin:0}</style>');
document.body.insertAdjacentHTML('beforeend','<div id="byeScreen"></div>');
/* 상황 파악 */
function ctx(){ let c=null,left=0,dn=0; try{ const act=computeToday().active, day=S.history[todayStr()]||{}; dn=act.filter(q=>(day.done||{})[q.id]).length; left=act.length-dn; c=day.cleared?'cleared':(act.length&&dn===0)?'none':(left>0&&left<=2)?'near':dn>0?'mid':null; }catch(e){} let st=0; try{ st=curStreak(); }catch(e){} return {c,left,dn,st}; }
const fill=(t,x)=>t.replace('{n}',x.left).replace('{d}',x.dn).replace('{s}',x.st);
const GO={
 morn:['좋은 아침이에요. 오늘도 우리 함께 시작해요.','어서 와요. 오늘의 첫 페이지를 같이 열어 볼까요?'],
 fore:['어서 와요. 오전이 한창이네요. 오늘 할 일을 함께 살펴봐요.','반가워요. 천천히, 하나씩 시작해 봐요.'],
 lunch:['어서 와요. 점심은 챙겨 먹었어요?','반가워요. 잠깐 쉬어 가는 시간이네요.'],
 aft:['어서 와요. 오후도 천천히 함께 가요.','반가워요. 오늘도 와 줘서 고마워요.'],
 eve:['어서 와요. 하루 수고 많았어요.','저녁이에요. 오늘의 페이지를 함께 돌아볼까요?'],
 night:['늦은 시간에 왔네요. 무리하지 말고 오늘을 정리해요.','어서 와요. 하루를 마무리하러 왔군요.']
};
const GL=['다시 왔군요. 반가워요.','어서 와요. 이어서 함께 해 봐요.','돌아왔군요. 기다리고 있었어요.'];
const GR=['돌아와 줘서 반가워요. 오랜만이에요.\n천천히 다시 시작해도 괜찮아요. 나는 여기 있었어요.','어서 와요. 쉬는 동안 어떻게 지냈어요?\n오늘부터 다시, 한 걸음씩 함께 가요.'];
const GC={none:'아직 오늘의 첫 퀘스트 전이에요. 하나씩 같이 해요.',mid:'벌써 {d}개나 해냈네요. 이 리듬 좋아요.',near:'{n}개만 더 하면 오늘의 페이지가 완성돼요.',cleared:'오늘의 퀘스트는 이미 모두 마쳤어요. 편히 있어요.'};
const MG_OPEN=['어서 와요, 어서 와요! 마티가 기다렸어요 ✨','왔다 왔다! 오늘도 로웨나 님이랑 셋이서 힘내 봐요 🌟','조수 마티, 인사 담당 출동! 반가워요 👋'];
const BB={morn:'좋은 하루 보내요.',fore:'남은 오전도 평안하길 바라요.',lunch:'맛있게 먹고 오후도 잘 보내요.',aft:'오후도 무탈하길 바라요.',eve:'편안한 저녁 보내요.',night:'푹 자요. 내일 또 만나요.'};

/* ===== 취향 대사 1단계: 인사·복귀·작별 ===== */
GO.morn.push('좋은 아침이에요. 차를 우려 뒀어요. 천천히 시작해요.');
GO.aft.push('어서 와요. 오후의 차가 알맞게 우러났어요.');
GO.eve.push('어서 와요. 서가에 향을 피워 뒀어요.');
GO.night.push('어서 와요. 등불을 낮춰 뒀어요. 무리하지 않고 정리해요.');
GL.push('차가 아직 식지 않았어요. 어서 와요.');
GR.push('오래 우린 차는 쓰지만, 다시 물을 부으면 또 향이 나요. 어서 와요.\n천천히 다시 시작해요.','겐지도 스마로 물러났다가 돌아왔어요. 당신의 자리도 그대로예요.\n어서 와요.');
const BBX={morn:['차 한 잔 더 우려 둘게요. 좋은 하루 보내요.'],fore:['남은 오전도 향기롭길 바라요.'],lunch:['따뜻한 차 한 잔으로 오후를 열어요.'],aft:['향이 다 타기 전에 돌아와요.'],eve:['서가의 등불은 켜 둘게요. 편안한 저녁 보내요.'],night:['향은 내가 꺼 둘게요. 잘 자요.','달이 밝은 밤이에요. 좋은 꿈 꿔요.']};
const BS={cleared:'오늘의 퀘스트를 모두 마쳤어요. 정말 수고했어요.',none:'오늘은 아직 시작 전이지만 괜찮아요. 준비되면 언제든 돌아와요.',near:'{n}개만 남았어요. 잠깐 쉬었다가 다시 돌아와요. 기다릴게요.',mid:'오늘 {d}개를 해냈어요. 충분히 잘했어요.'};
const MG_BYE=['로웨나 님 조수 마티도 배웅해요! 또 만나요 👋','다녀오세요~! 마티는 여기서 반짝이며 기다릴게요 ✨','오늘도 수고했어요! 다음에 또 놀아요 🌙','조수 마티의 마지막 한마디! 물 한 잔 꼭 마셔요 💧'];
function isFirstToday(){ const t=todayStr(), g=S.lwGreet; return !g||g.d!==t; }
function comebackGap(){ try{ const t=todayStr(), H=S.history, ks=Object.keys(H).filter(k=>k<t&&Object.values(H[k].done||{}).some(Boolean)).sort(); if(!ks.length) return 0; return Math.round((Date.parse(t)-Date.parse(ks[ks.length-1]))/864e5); }catch(e){ return 0; } }
function greetText(kind,first){ const h=kstNow().getUTCHours(), b=martyBand(h), x=ctx(), O={who:'lowena',cameo:false}, V={vars:{n:x.left,d:x.dn,s:x.st}};
  const st=()=>x.c?LQD.pick('lowena.greet.st.'+x.c,[GC[x.c]],Object.assign({},O,V)):'';
  if(kind==='back') return LQD.pick('lowena.greet.back',['어서 와요. 벌써 돌아왔군요.','다시 만났네요. 이어서 함께 해요.'],O)+(x.c?'\n'+st():'');
  if(first&&comebackGap()>=4) return LQD.pick('lowena.greet.return',GR,O);
  let main=(first?LQD.pick('lowena.greet.'+b,GO[b],O):(b==='night'?LQD.pick('lowena.greet.againnight',['늦은 시간에 다시 왔네요. 무리는 말아요.'],O):LQD.pick('lowena.greet.again',GL,O)));
  let sub=st(); if(x.st>=3&&Math.random()<.45&&x.c!=='cleared') sub=(sub?sub+' ':'')+LQD.pick('lowena.greet.streak',['{s}일째 이어 가고 있어요.'],Object.assign({},O,V));
  return main+(sub?'\n'+sub:''); }
window.lwGreetText=greetText;
function byeText(){ const h=kstNow().getUTCHours(), b=martyBand(h), x=ctx();
  let sit=(b==='night'&&x.c==='none')?'오늘은 쉬어도 괜찮아요. 벌점은 없어요. 내일 다시 함께 해요.':(BS[x.c]||'오늘도 와 줘서 고마워요.');
  sit=fill(sit,x); if(x.c==='cleared'&&x.st>=3) sit+=' '+x.st+'일 연속, 참 대단해요.';
  return sit+'\n'+pick([].concat(BB[b],(BBX[b]||[]))); }
/* 인사 */
function greet(kind){ try{
  if(byeOpen||S.settings.lowenaReact===false||S.settings.lowenaGreet===false) return;
  const first=isFirstToday(); S.lwGreet={d:todayStr(),n:((S.lwGreet&&S.lwGreet.d===todayStr())?S.lwGreet.n:0)+1};
  const b=martyBand(kstNow().getUTCHours()); if(!S.lwChat||S.lwChat.d!==todayStr()) S.lwChat={d:todayStr(),b:[],t:(S.lwChat&&S.lwChat.t)||0}; if(!S.lwChat.b.includes(b)) S.lwChat.b.push(b); S.lwChat.t=Date.now(); save();
  let ms=lowenaShow(greetText(kind==='return'?'open':kind,first&&kind!=='return'));
  if(kind==='open'){ ms=5000; window.lowenaTrim&&window.lowenaTrim(ms); }
  if(S.settings.martyPop!==false&&Math.random()<(first?.6:.25)) setTimeout(()=>{ if(!byeOpen&&$('martyPop').className!=='show') martyShow(null,LQD.pick('marty.open',MG_OPEN,{who:'marty'})); },ms+1300);
}catch(e){} }
/* 실행화면 다음에 인사 */
const sp=$('splash');
if(!sp||!document.body.contains(sp)) setTimeout(()=>greet('open'),800);
else { const mo=new MutationObserver(()=>{ if(sp.classList.contains('hide')){ mo.disconnect(); setTimeout(()=>greet('open'),1100); } }); mo.observe(sp,{attributes:true,attributeFilter:['class']}); }
/* 앱으로 돌아왔을 때(오래 떠나 있었다면) 다시 인사 */
let hiddenAt=0; document.addEventListener('visibilitychange',()=>{ if(document.hidden){ hiddenAt=Date.now(); return; } const away=hiddenAt?Date.now()-hiddenAt:0; hiddenAt=0; if(away>=30*6e4&&!byeOpen&&$('splash')===null) setTimeout(()=>greet('return'),900); });
/* 접속 종료 */
const _sb=window.startBgm; window.startBgm=function(){ if(byeOpen) return; return _sb.apply(this,arguments); };
const _rs=window.lowenaShow; window.lowenaShow=function(t){ if(byeOpen&&!t) return 0; return _rs(t); };
const _ms=window.martyShow; window.martyShow=function(k,t){ if(byeOpen) return; return _ms(k,t); };
window.lowenaBye=function(){ if(byeOpen) return; byeOpen=true; try{ lowenaHide(); martyHide(); }catch(e){} try{ stopBgm(); }catch(e){}
  S.lastBye=Date.now(); save();
  const o=$('byeScreen'); o.innerHTML=mascotImg(96)+'<div class="by-b"><b>로웨나</b>'+esc(byeText())+'</div><div class="by-m"><img src="'+MARTY_IMG+'" alt=""><span>'+esc(LQD.pick('marty.bye',MG_BYE,{who:'marty'}))+'</span></div><div class="by-f"><button class="gold-btn" onclick="byeBack()">다시 돌아가기</button></div>';
  o.classList.add('show'); requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('in'))); };
window.byeBack=function(){ const o=$('byeScreen'); o.classList.remove('in'); setTimeout(()=>{ o.classList.remove('show'); o.innerHTML=''; },600); byeOpen=false; try{ if(bgmOn()) startBgm(); }catch(e){} setTimeout(()=>greet('back'),700); };
/* 설정 연동 */
const _lw=window.setLw; window.setLw=function(k,v){ _lw(k,v); if(k==='lowenaGreet'){ if(v) lowenaShow('앱을 켤 때마다 인사할게요. 어서 와요, 하고요.'); else toast('로웨나: 조용히 맞이할게요. 필요하면 다시 켜 줘요.'); } };
const _rm=window.renderMaster; window.renderMaster=function(){ _rm(); const e=$('lowenaGreetSel'); if(e) e.value=S.settings.lowenaGreet===false?'0':'1'; };
if($('screen-master')&&$('screen-master').classList.contains('active')) window.renderMaster();
})();

document.head.insertAdjacentHTML('beforeend','<style>.mp-bub{max-width:min(440px,calc(100vw - 24px));padding:8px 14px;line-height:1.5}.mp-bub b,.rp-bub b{display:block;margin:0 0 3px 0}.rp-all{flex-direction:column-reverse;align-items:flex-start;gap:6px}.rp-bub{max-width:min(440px,calc(100vw - 20px));margin:0;padding:8px 14px;line-height:1.5}.rp-bub:before{left:27px;top:auto;bottom:-8px;border:8px solid transparent;border-bottom:0;border-top-color:var(--gold-d)}.rp-bub:after{left:29px;top:auto;bottom:-6px;border:6px solid transparent;border-bottom:0;border-top-color:var(--parch)}</style>');

/* 마티와 로웨나가 둘 다 왼쪽에 나오므로, 마티가 떠 있는 동안엔 로웨나가 끝나길 기다렸다가 나온다 */
(function(){ const _r=window.lowenaShow; if(typeof _r!=='function') return;
  window.lowenaShow=function(t){ const mp=document.getElementById('martyPop');
    if(mp&&mp.className==='show'){ let n=0; const w=()=>{ if(mp.className==='show'&&n++<30) setTimeout(w,400); else _r(t); }; setTimeout(w,400); return 5000; }
    return _r(t); };
})();
