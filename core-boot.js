/* ===== core-boot.js : 레벨·연말 회고, 상환·주간 비교, 재료 재고, 시작 화면과 첫 그리기 (core.js에서 나눔, 순서 유지) ===== */
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
