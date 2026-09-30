/* ===== 만담 카드: 웰라·시나·알레센도가 서로 주고받는 이야기 =====
   대사 등록: LQD.add('banter.<쌍>.<길이>', [ {t:['제목', ['w','대사'], ['s','대사'], ...], when:{season:'au'}} ])
     쌍: ws(웰라·시나) wa(웰라·알레센도) sa(시나·알레센도) wsa(셋이서)
     길이: s(짧은 3~5줄) l(긴 8~12줄)
     말하는 사람: w 웰라 · s 시나 · a 알레센도
   화면에서 직접 불러 보기: lqBanter.show('ws','s')  */
(function(){
  var WHO={w:{n:'웰라',img:function(){ return 'assets/fa2c999a3b.webp'; }},
           s:{n:'시나',img:function(){ return (window.WL_IMG1||{}).magic||''; }},
           a:{n:'알레센도',img:function(){ return 'assets/941fef42af.webp'; }}};
  var PAIRS={ws:'ws',wa:'wa',sa:'sa',wsa:'wsa'}, WT={ws:50,wa:20,sa:20,wsa:10};
  var cur=null, auto=null;
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  function h(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function day(){ var d=todayStr(); if(!S.bnDay||S.bnDay.d!==d) S.bnDay={d:d,s:0,l:0}; return S.bnDay; }
  function pool(pair,len){ try{ return (LQD.get('banter.'+pair+'.'+len)||[]).length; }catch(e){ LQ.err(e); return 0; } }
  /* 셋이서 나오는 만담은 특별한 날에만: 주말, 월초(1~2일), 오늘 퀘스트를 클리어한 날 */
  function special(){ try{ var t=todayStr(), dw=new Date(t+'T00:00:00Z').getUTCDay(), dd=+t.slice(8,10);
    return dw===0||dw===6||dd<=2||!!(S.history&&S.history[t]&&S.history[t].cleared); }catch(e){ LQ.err(e); return false; } }
  function busy(){ var q=function(i){ var e=document.getElementById(i); return e&&e.classList.contains('show'); }, b=false; try{ b=!!stampBusy; }catch(e){ LQ.err(e); }
    return b||q('askOv')||q('modalOverlay')||q('wlPop')||q('lowenaPop')||document.getElementById('achMile')||document.getElementById('lqCard')||document.getElementById('passBy'); }
  function close(){ clearTimeout(auto); cur=null; var e=document.getElementById('bnCard'); if(e) e.remove(); }
  function render(){
    var e=document.getElementById('bnCard'); if(!e||!cur) return;
    var t=cur.turns[cur.i], w=WHO[t[0]]||WHO.w;
    e.querySelector('.bn-face').innerHTML=cur.who.map(function(k){ return '<img class="'+(k===t[0]?'on':'')+'" src="'+WHO[k].img()+'" alt="'+WHO[k].n+'">'; }).join('');
    e.querySelector('.bn-line').innerHTML='<b>'+w.n+'</b>'+h(t[1]);
    e.querySelector('.bn-pg').textContent=(cur.i+1)+' / '+cur.turns.length;
    e.querySelector('.bn-nx').textContent=cur.i>=cur.turns.length-1?'닫기 ✓':'다음 ▸';
    var l=e.querySelector('.bn-line'); l.style.animation='none'; void l.offsetWidth; l.style.animation='';
    clearTimeout(auto); auto=setTimeout(next,Math.max(4200,t[1].length*120+(cur.long?1800:800)));
  }
  function next(){ if(!cur) return; if(cur.i>=cur.turns.length-1){ close(); return; } cur.i++; render(); }
  function start(entry,pair,long){
    close(); var turns=entry.filter(function(x){ return Array.isArray(x); }), title=entry.filter(function(x){ return typeof x==='string'; })[0]||'';
    if(!turns.length) return false;
    var who=[]; turns.forEach(function(t){ if(who.indexOf(t[0])<0&&WHO[t[0]]) who.push(t[0]); });
    cur={turns:turns,i:0,who:who,long:!!long};
    var e=document.createElement('div'); e.id='bnCard'; e.className='show'+(who.indexOf('a')>=0&&who.length===1?' bn-al':'');
    e.innerHTML='<div class="bn-hd"><span class="bn-tt">'+h(title)+(long?' · 긴 이야기':'')+'</span><span class="bn-pg"></span><button class="bn-x" aria-label="닫기">×</button></div>'
      +'<div class="bn-face"></div><div class="bn-line"></div><div class="bn-ft"><span>탭하면 넘어가요</span><button class="bn-nx"></button></div>';
    e.querySelector('.bn-x').onclick=function(ev){ ev.stopPropagation(); close(); };
    e.addEventListener('click',function(ev){ if(ev.target.closest('.bn-x')) return; next(); });
    document.body.appendChild(e); render();
    try{ lqNote(who.map(function(k){ return WHO[k].n; }).join('·'),title+' – '+turns[0][1]); }catch(x){ LQ.err(x); }
    return true; }
  function show(pair,len){
    len=len||'s'; var e=LQD.pick('banter.'+pair+'.'+len,[],{cameo:false});
    if(!e||!e.length) return false; return start(e,pair,len==='l'); }
  function pickPair(len){ var sp=special(), opts=Object.keys(PAIRS).filter(function(p){ return pool(p,len)>0&&(p!=='wsa'||sp); }); if(!opts.length) return null;
    var tot=0; opts.forEach(function(p){ tot+=WT[p]; }); var r=Math.random()*tot; for(var i=0;i<opts.length;i++){ r-=WT[opts[i]]; if(r<0) return opts[i]; } return opts[0]; }
  /* 트레저 탭에서 가끔: 짧은 만담 하루 6번까지, 긴 만담 하루 1번까지 */
  function maybe(){
    if(!on()||busy()||document.getElementById('bnCard')||document.getElementById('trChat')) return false;
    var d=day(), wantLong=d.l<1&&Math.random()<.18, len=wantLong?'l':'s';
    if(len==='s'&&d.s>=6) return false; var p=pickPair(len); if(!p&&len==='l'){ len='s'; p=pickPair('s'); } if(!p) return false;
    if(show(p,len)){ if(len==='l') d.l++; else d.s++; save(); return true; } return false; }
  var tm=null;
  function loop(){ clearTimeout(tm); tm=setTimeout(function(){ if(document.getElementById('screen-treasure').classList.contains('active')){ if(Math.random()<.45) maybe(); loop(); } },(70+Math.random()*80)*1000); }
  /* 홈 탭에서도 하루 한 번, 가끔 짧은 만담이 지나가요 */
  function homeMaybe(){
    if(!on()||busy()||document.getElementById('bnCard')||document.getElementById('trChat')||document.getElementById('passBy')) return;
    if(!document.getElementById('screen-home').classList.contains('active')) return;
    var d=day(); if(d.h||Math.random()>.3) return; var p=pickPair('s'); if(!p) return;
    if(show(p,'s')){ d.h=1; d.s++; save(); } }
  LQ.on('screen:after',function(sn){ clearTimeout(tm); clearTimeout(window._bnFirst); clearTimeout(window._bnHome);
    if(sn==='treasure'){
      window._bnFirst=setTimeout(function(){ if(document.getElementById('screen-treasure').classList.contains('active')&&Math.random()<.45) maybe(); loop(); },(12+Math.random()*15)*1000); }
    else { close(); if(sn==='home') window._bnHome=setTimeout(homeMaybe,(window.__bnFast?300:(15+Math.random()*20)*1000)); } });
  window.lqBanter={show:show,close:close,maybe:maybe,pool:pool,special:special,homeMaybe:homeMaybe};
})();
