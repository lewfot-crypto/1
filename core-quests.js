/* ===== core-quests.js : 유튜브 월간 목표, 마티의 보상 추천, 퀘스트·이벤트·보물 화면 (core.js에서 나눔, 순서 유지) ===== */
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
