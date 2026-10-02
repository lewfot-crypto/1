/* 홈/퀘스트 탭 지나가기 카메오 (웰라·시나·알레센도) */
(function(){
  var MAX=1, tm=null;
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  function st(){ var d=todayStr(); if(!S.passDay||S.passDay.d!==d) S.passDay={d:d,n:0,al:0,clr:0}; return S.passDay; }
  function hour(){ try{ return kstNow().getUTCHours(); }catch(e){ return new Date().getHours(); } }
  function act(n){ var e=document.getElementById('screen-'+n); return !!(e&&e.classList.contains('active')); }
  function freeSafe(){ var q=function(i){ var e=document.getElementById(i); return e&&(e.classList.contains('show')||getComputedStyle(e).display!=='none'&&i==='splash'); };
    var busy=false; try{ busy=!!stampBusy; }catch(e){ LQ.err(e); }
    var a=document.getElementById('askOv'),m=document.getElementById('modalOverlay'),w=document.getElementById('wlPop'),p=document.getElementById('martyPop');
    return !busy&&!(a&&a.classList.contains('show'))&&!(m&&m.classList.contains('show'))&&!(w&&w.classList.contains('show'))&&!(p&&p.classList.contains('show'))&&!document.getElementById('achMile')&&!document.getElementById('lqCard')&&!document.getElementById('bnCard')&&!(document.getElementById('lowenaPop')&&document.getElementById('lowenaPop').classList.contains('show')); }
  function esc2(s){ return String(s).replace(/[&<>"]/g,function(x){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]; }); }
  function close(){ var e=document.getElementById('passBy'); if(e) e.remove(); }
  var CH={
    wella:{n:'웰라',img:function(){ return (window.WL_IMG1||{}).fly; },cls:''},
    sina:{n:'시나',img:function(){ return (window.WL_IMG1||{}).magic; },cls:'pb-sina'},
    alesendo:{n:'알레센도',img:function(){ return 'assets/941fef42af.webp'; },cls:'pb-al'}};
  function card(who,text,tag){
    if(!text) return; close(); var c=CH[who];
    var o=document.createElement('div'); o.id='passBy'; o.className=c.cls+(who==='wella'?' pb-fly':'');
    o.innerHTML='<img src="'+(c.img()||'')+'" alt=""><div class="pb-b"><div class="pb-k">'+(tag||'')+'</div><b>'+c.n+'</b> '+esc2(who==='wella'?lqLaugh(text):text)+'</div><button class="pb-x" aria-label="닫기">×</button>';
    try{ lqNote(c.n,text); }catch(e){ LQ.err(e); }
    o.querySelector('.pb-x').onclick=close; document.body.appendChild(o);
    setTimeout(function(){ var e=document.getElementById('passBy'); if(e===o) o.remove(); },9000);
  }
  /* 겹칠 때 순서: 로웨나 > 마티 > 웰라·시나 > 알레센도. 앞선 말풍선이 떠 있거나 곧 뜰 예정이면 5초 뒤 다시 시도해요. */
  function pend(){ var p=false; try{ p=!!_mtPend; }catch(e){ LQ.err(e); } return p; }
  function retry(scr,n){ if((n||0)<14) tm=setTimeout(function(){ fire(scr,(n||0)+1); },5000); }
  function fire(scr,rn){
    try{
      if(!on()||!act(scr)) return;
      if(!freeSafe()||pend()){ retry(scr,rn); return; }
      var s=st(), cl=false; try{ cl=computeToday().cleared; }catch(e){ LQ.err(e); }
      if(cl&&hour()>=17&&!s.clr){ s.clr=1; s.n++; save(); card('wella',LQD.pick('wella.pass.cleared',[]),'✦ 빗자루가 지나가요'); return; }
      if(scr==='home'&&!s.al&&s.alr==null){ s.alr=Math.random()<.15?1:0; save(); }
      if(scr==='home'&&!s.al&&s.alr===1){ if(document.getElementById('passBy')||document.getElementById('trChat')){ retry(scr,rn); return; } s.al=1; save(); card('alesendo',LQD.pick('alesendo.homecameo',[],{who:'alesendo'}),'📖 장부를 든 채로'); return; }
      if(s.n>=MAX+s.al) return;
      var r=Math.random(), who;
      if(Math.random()>.55) return;
      who=Math.random()<.6?'wella':'sina'; s.n++; save();
      card(who,LQD.pick(who+'.pass.'+scr,[],{who:who}),who==='wella'?'✦ 빗자루가 지나가요':'✦ 검은 그림자가 지나가요');
    }catch(e){ LQ.err(e); }
  }
  LQ.on('screen:after',function(scr){
    clearTimeout(tm); close();
    if(scr!=='home'&&scr!=='quests') return;
    tm=setTimeout(function(){ fire(scr); },(window.__passFast?300:20000+Math.random()*40000));
  });
  window.passByNow=function(who,text){ card(who,text,''); };
  
})();

/* 오늘 있었던 일 기록(로웨나가 알 수 있게) + 이달의 이벤트 */
(function(){
  function log(){ var d=todayStr(); if(!S.dayLog||S.dayLog.d!==d) S.dayLog={d:d,a:[]}; return S.dayLog; }
  window.lqNote=function(who,text){ try{ if(!text) return; var l=log(); text=String(text).replace(/\s+/g,' ').slice(0,90);
    if(l.a.some(function(x){ return x.t===text; })) return; l.a.push({w:who,t:text}); if(l.a.length>8) l.a.shift(); save(); }catch(e){ LQ.err(e); } };
  window.lqDayText=function(){ try{ var l=log(); if(!l.a.length) return '';
    return '오늘 이웃들에게 있었던 일(참고용): '+l.a.map(function(x){ return x.w+' – '+x.t; }).join(' / ')+' 사용자가 이웃 이야기를 꺼내거나 자연스러울 때만 "오늘 웰라가 이런 얘기를 했다더라" 식으로 가볍게 언급하고, 여기 적힌 것 이상은 지어내지 마.'; }catch(e){ return ''; } };
  var tm=null;
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  window.lqMonthEvent=function(force){
    var n=0, ym=todayStr().slice(0,7), m=+ym.slice(5,7);
    if(!force&&(S.monthEvt===ym||m===10||!on())) return;
    (function go(){ var q=function(i){ var e=document.getElementById(i); return e&&e.classList.contains('show'); }, busy=false; try{ busy=!!stampBusy; }catch(e){ LQ.err(e); }
      if((busy||q('askOv')||q('modalOverlay')||q('wlPop')||q('martyPop')||q('lowenaPop')||document.getElementById('achMile')||document.getElementById('lqCard'))&&n++<30) return void setTimeout(go,1500);
      if(!document.getElementById('screen-home').classList.contains('active')) return;
      var e=LQD.pick('month.'+m,[],{cameo:false}); if(!e||!e.length) return;
      S.monthEvt=ym; S.gold=(S.gold||0)+3; save(); try{ renderHome(); }catch(x){ LQ.err(x); }
      lqNote('이달의 이벤트',e[1]+' – '+e[2]);
      wlPop({title:e[1],img:e[0],w:e[2],s:e[3],a:e[4]||'',fx:'🎁 이달의 선물 ◈ +3 골드',btn:'고마워요!'});
    })();
  };
  LQ.on('screen:after',function(s){ clearTimeout(tm); if(s==='home') tm=setTimeout(function(){ window.lqMonthEvent(false); },3500); });
})();

/* 월간 회고 · 알레센도의 기념일 장부 · 연말 결산 */
(function(){
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  function h(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(x){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]; }); }
  function busy(){ var q=function(i){ var e=document.getElementById(i); return e&&e.classList.contains('show'); }, b=false; try{ b=!!stampBusy; }catch(e){ LQ.err(e); }
    return b||q('askOv')||q('modalOverlay')||q('wlPop')||q('martyPop')||q('lowenaPop')||document.getElementById('achMile')||document.getElementById('lqCard'); }
  function whenFree(fn){ var n=0; (function go(){ if(busy()&&n++<40) return void setTimeout(go,1500); if(document.getElementById('screen-home').classList.contains('active')) fn(); })(); }
  function dd(a,b){ return Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/864e5); }
  function stats(pre){
    var H=S.history||{}, keys=Object.keys(H).filter(function(k){ return k.indexOf(pre)===0; }).sort();
    var cl=0,done=0,sum=0,best=0,run=0,prev=null,days=0;
    keys.forEach(function(k){ var d=H[k]||{}, n=Object.keys(d.done||{}).filter(function(i){ return d.done[i]; }).length;
      if(!n&&!d.cleared) return; days++; done+=n; sum+=d.percent||0;
      if(d.cleared){ cl++; run=(prev&&dd(prev,k)===1)?run+1:1; best=Math.max(best,run); prev=k; } else { run=0; prev=null; } });
    var ach=(S.achievements||[]).filter(function(a){ return a.unlocked&&a.unlockedAt&&String(a.unlockedAt).indexOf(pre)===0; }).length;
    return {days:days,cl:cl,done:done,avg:days?Math.round(sum/days):0,best:best,ach:ach}; }
  function close(){ var e=document.getElementById('lqCard'); if(e) e.remove(); }
  function card(o){
    close(); var e=document.createElement('div'); e.id='lqCard'; e.className='show'+(o.cls?' '+o.cls:'');
    e.innerHTML='<div class="lc-box" style="max-height:88vh;overflow:auto"><div class="lc-t">'+h(o.title)+'</div>'+(o.many?o.many.map(function(r){ return '<div class="lc-row" style="margin-bottom:10px">'+r[0]+'<div class="lc-w"><b>'+h(r[1])+'</b>'+h(r[2])+'</div></div>'; }).join(''):'<div class="lc-row">'+o.face+'<div class="lc-w"><b>'+h(o.name)+'</b>'+h(o.text)+'</div></div>')
      +(o.rows?'<div class="lc-st">'+o.rows.map(function(r){ return '<div><span>'+h(r[0])+'</span><b>'+h(r[1])+'</b></div>'; }).join('')+'</div>':'')
      +(o.extra||'')+(o.fx?'<div class="lc-fx">'+h(o.fx)+'</div>':'')+'<button class="gold-btn" id="lcOk">'+h(o.btn||'고마워요')+'</button></div>';
    document.body.appendChild(e); document.getElementById('lcOk').onclick=function(){ close(); if(o.next) setTimeout(o.next,250); };
    try{ sfx('check'); }catch(x){ LQ.err(x); }
    try{ if(o.many) lqNote(o.many[0][1],o.many[0][2]); else lqNote(o.name,o.text); }catch(x){ LQ.err(x); } }
  /* 회고 달력: 다 클리어한 날 금빛, 조금 한 날 연한 보라, 쉬는 날 달 */
  function cal(ym){
    var y=+ym.slice(0,4), m=+ym.slice(5,7), last=new Date(y,m,0).getDate(), first=new Date(y,m-1,1).getDay(), H=S.history||{}, c='';
    ['일','월','화','수','목','금','토'].forEach(function(w){ c+='<div class="rc-w">'+w+'</div>'; });
    for(var i=0;i<first;i++) c+='<div></div>';
    for(var d=1;d<=last;d++){ var r=H[ym+'-'+(d<10?'0'+d:d)]||{}, n=Object.keys(r.done||{}).filter(function(x){ return r.done[x]; }).length;
      var cls=r.cleared?'rc-g':r.pass?'rc-p':n?'rc-s':''; c+='<div class="rc-d '+cls+'">'+(r.pass&&!r.cleared?'☾':d)+'</div>'; }
    return '<div class="rc-cal">'+c+'</div><div class="rc-lg"><span><i class="rc-g"></i>클리어</span><span><i class="rc-s"></i>조금 한 날</span><span><i class="rc-p">☾</i>쉬는 날</span></div>'; }
  var rcCss=document.createElement('style');
  rcCss.textContent='#lqCard .rc-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin:12px 0 4px}'
    +'#lqCard .rc-w{font-size:10px;text-align:center;color:#b9a8d6}'
    +'#lqCard .rc-d{height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;border-radius:3px;background:rgba(255,255,255,.05);color:#8f84a3;image-rendering:pixelated}'
    +'#lqCard .rc-d.rc-g{background:#f3d88a;color:#3a2a10;font-weight:700;box-shadow:inset -2px -2px 0 #c9a24d,inset 2px 2px 0 #fff2c4}'
    +'#lqCard .rc-d.rc-s{background:#5b4a80;color:#e9e0f5;box-shadow:inset -2px -2px 0 #463866}'
    +'#lqCard .rc-d.rc-p{background:#2c2440;color:#cdb8ff;font-size:13px}'
    +'#lqCard .rc-lg{display:flex;justify-content:center;gap:12px;font-size:10.5px;color:#b9a8d6;margin-bottom:4px}'
    +'#lqCard .rc-lg i{display:inline-block;width:10px;height:10px;margin-right:4px;vertical-align:-1px;font-style:normal;font-size:9px;line-height:10px;text-align:center;border-radius:2px}'
    +'#lqCard .rc-lg i.rc-g{background:#f3d88a}#lqCard .rc-lg i.rc-s{background:#5b4a80}#lqCard .rc-lg i.rc-p{background:#2c2440;color:#cdb8ff}';
  document.head.appendChild(rcCss);
  /* 회고 두 번째 장: 친구들 한마디 (그 달 숫자에 맞춰서) */
  var RF={
    marty:{high:['{m}월은 클리어한 날이 {c}일이에요! 마티 수첩이 금빛 동그라미로 꽉 찼어요 ✨','{m}월 정말 대단했어요! 마티가 금빛 칸 세다가 손가락이 모자랐어요 🎉'],
           mid:['{m}월은 클리어한 날이 {c}일! 반짝이는 날이 꽤 많았어요. 마티는 다 기억해요 ✨','{m}월 수고했어요! 금빛 칸 사이사이 연한 칸도 전부 노력한 날이에요 🌟'],
           low:['{m}월은 조금 쉬어 간 달이었죠? 괜찮아요. 마티는 연한 칸 하나하나도 다 반가웠어요 ✨','다음 달 달력은 새하얀 첫 장이에요! 마티가 첫 칸부터 응원할게요 🌱']},
    wella:{best:['연속 {s}일이라니! 제 빗자루 연속 비행 기록보다 길어요! 하하, 분하다!','{s}일 연속이에요! 저도 다음 달엔 빗자루에서 {s}일 연속 안 떨어져 볼래요, 하하!'],
           any:['{m}월 달력 봤어요! 금빛 칸 위로 빗자루 타고 한 바퀴 돌고 싶어요, 하하!','저도 {m}월에 열심히 했어요! 빗자루에서 세 번만 떨어졌어요, 하하!']},
    sina:{high:['…{m}월, 나쁘지 않았다냥. …아니, 꽤 좋았다냥.','…금빛 칸이 많다냥. 따뜻해 보인다냥. 그 위에서 자고 싶다냥.'],
          mid:['…{m}월은 적당했다냥. 적당한 게 오래간다냥.','…빈칸도 있다냥. 고양이도 하루는 잔다냥. 괜찮다냥.'],
          low:['…쉰 달도 달이다냥. 다음 달에 또 하면 된다냥.','…달력 빈칸은 낮잠 자리다냥. 나쁘지 않다냥.']}};
  function rfImg(k){ try{ return k==='marty'?'<img src="'+MARTY_IMG+'" alt="">':k==='wella'?'<img src="assets/fa2c999a3b.webp" alt="">':'<img src="'+((window.WL_IMG1||{}).magic||'')+'" alt="">'; }catch(e){ return ''; } }
  function rfPick(a,v){ return a[Math.floor(Math.random()*a.length)].replace(/\{m\}/g,v.m).replace(/\{c\}/g,v.c).replace(/\{s\}/g,v.s); }
  function friends(m,k,st){ var v={m:m,c:st.cl,s:st.best}, w=rfPick(st.best>=5?RF.wella.best:RF.wella.any,v);
    card({title:'📅 '+m+'월 회고 · 모두의 한마디',many:[[rfImg('marty'),'마티',rfPick(RF.marty[k],v)],[rfImg('wella'),'웰라',window.lqLaugh?lqLaugh(w):w],[rfImg('sina'),'시나',rfPick(RF.sina[k],v)]]}); }
  function ymPrev(){ var t=todayStr(), y=+t.slice(0,4), m=+t.slice(5,7)-1; if(m<1){ m=12; y--; } return y+'-'+(m<10?'0'+m:m); }
  window.lqRetroNow=function(force,ym){
    ym=ym||ymPrev(); var st=stats(ym), m=+ym.slice(5,7);
    if(!st.days){ if(force) toast('그 달의 기록이 아직 없어요'); return; }
    var k=st.avg>=80?'high':st.avg>=50?'mid':'low';
    var txt=LQD.pick('lowena.retro.'+k,[],{who:'lowena',cameo:false,vars:{m:m,c:st.cl,s:st.best}});
    card({title:'📅 '+m+'월 회고',face:(typeof mascotImg==='function'?mascotImg(64,k==='low'?'':'cheer'):''),name:'로웨나',text:txt,extra:cal(ym),
      rows:[['퀘스트 클리어한 날',st.cl+'일'],['가장 길었던 연속 기록',st.best+'일'],['해낸 퀘스트',st.done+'개'],['평균 달성률',st.avg+'%'],['해금한 업적',st.ach+'개']],
      btn:'다음',next:function(){ friends(m,k,st); }}); };
  window.lqYearNow=function(force,yr){
    yr=yr||todayStr().slice(0,4); var st=stats(yr+'-');
    if(!st.days){ if(force) toast('올해 기록이 아직 없어요'); return; }
    var txt=LQD.pick('alesendo.yearend',[],{who:'alesendo',cameo:false,vars:{y:yr,c:st.cl,s:st.best}});
    card({title:'📖 '+yr+'년 결산 · 알레센도의 장부',cls:'lc-al',face:'<img src="assets/941fef42af.webp" alt="">',name:'알레센도',text:txt,
      rows:[['클리어한 날',st.cl+'일'],['가장 길었던 연속 기록',st.best+'일'],['해낸 퀘스트',st.done+'개'],['평균 달성률',st.avg+'%'],['해금한 업적',st.ach+'개']]}); };
  /* 기념일 */
  function A(){ return Array.isArray(S.annis)?S.annis:(S.annis=[]); }
  function todayMD(){ var t=todayStr(); return {y:+t.slice(0,4),m:+t.slice(5,7),d:+t.slice(8,10)}; }
  function match(a,t){ if(a.m===t.m&&a.d===t.d) return true;
    if(a.m===2&&a.d===29&&t.m===2&&t.d===28){ var y=t.y; return !((y%4===0&&y%100!==0)||y%400===0); } return false; }
  function annisToday(){ var t=todayMD(); S.anniDone=S.anniDone||{};
    return A().filter(function(a){ return match(a,t)&&S.anniDone[a.id]!==t.y; })[0]; }
  window.lqAnniCheck=function(){
    if(!on()) return; var t=todayMD();
    var a=annisToday();
    if(a){ whenFree(function(){
      var bd=/생일|birthday/i.test(a.name), n=a.y&&a.y<t.y?t.y-a.y:0;
      var key='alesendo.anni.'+(bd?'b':'g')+(n?'n':'');
      var txt=LQD.pick(key,[],{who:'alesendo',cameo:false,vars:{name:a.name,n:n}});
      S.anniDone[a.id]=t.y; S.gold=(S.gold||0)+5; save(); try{ renderHome(); }catch(e){ LQ.err(e); }
      card({title:(bd?'🎂 ':'📖 ')+a.name,cls:'lc-al',face:'<img src="assets/941fef42af.webp" alt="">',name:'알레센도',text:txt,fx:'🎁 장부의 선물 ◈ +5 골드'}); }); return; }
    if(t.m===12&&t.d>=30&&S.yearEnd!==t.y) whenFree(function(){ S.yearEnd=t.y; save(); window.lqYearNow(false); });
  };
  window.lqAnniAdd=function(){
    var n=(document.getElementById('anniName').value||'').trim(), sv=function(id){ return document.getElementById(id).value; }, d=(sv('anniY')&&sv('anniM')&&sv('anniD'))?sv('anniY')+'-'+('0'+sv('anniM')).slice(-2)+'-'+('0'+sv('anniD')).slice(-2):'';
    if(!n){ toast('이름을 적어 주세요'); return; } if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){ toast('날짜를 골라 주세요'); return; }
    if(A().length>=12){ toast('장부에는 12개까지 적을 수 있어요'); return; }
    A().push({id:'an'+Date.now(),name:n.slice(0,20),y:+d.slice(0,4),m:+d.slice(5,7),d:+d.slice(8,10)}); save();
    document.getElementById('anniName').value=''; ['anniY','anniM','anniD'].forEach(function(id){ document.getElementById(id).value=''; }); window.lqAnniRender(); toast('알레센도가 장부에 적었어요'); };
  window.lqAnniDel=function(id){ S.annis=A().filter(function(a){ return a.id!==id; }); save(); window.lqAnniRender(); };
  window.lqAnniRender=function(){ var el=document.getElementById('anniList'); if(!el) return;
    el.innerHTML=A().length?A().map(function(a){ return '<div class="tg"><span>'+h(a.name)+' · '+a.m+'월 '+a.d+'일</span><button class="ghost-btn" style="padding:3px 8px" onclick="lqAnniDel(\''+a.id+'\')">지우기</button></div>'; }).join(''):'<div style="font-size:12px;color:var(--ink-soft);margin-bottom:6px">아직 적힌 기념일이 없어요.</div>'; };
  LQ.on('master:after',function(){ try{ window.lqAnniRender(); }catch(e){ LQ.err(e); } });
  var tm=null, tm2=null;
  LQ.on('screen:after',function(s){ clearTimeout(tm); clearTimeout(tm2); if(s!=='home') return;
    tm=setTimeout(function(){ try{
      var cur=todayStr().slice(0,7); if(S.monthRetro===cur) return; var had=S.monthRetro; S.monthRetro=cur; save();
      if(on()) whenFree(function(){ window.lqRetroNow(false); }); }catch(e){ LQ.err(e); } },2500);
    tm2=setTimeout(function(){ try{ window.lqAnniCheck(); }catch(e){ LQ.err(e); } },3000); });
  
})();
