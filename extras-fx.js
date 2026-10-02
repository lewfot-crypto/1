/* ===== 3일마다 자동 백업 (이 기기 안에 최근 3개 보관) + 마티 알림 ===== */
(function(){
  const AK=KEY+'_auto', NK=KEY+'_autoann', EVERY=3, KEEP=3;
  const fmt=t=>new Date(t).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'numeric',minute:'2-digit'});
  const dayGap=(a,b)=>(Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/864e5;
  function rd(){ try{ const a=JSON.parse(localStorage.getItem(AK)); return Array.isArray(a)?a.filter(x=>x&&x.day&&x.d&&Array.isArray(x.d.dailyQuests)&&x.d.settings&&x.d.history):[]; }catch(e){ return []; } }
  function wr(a){ a=a.slice(0,KEEP); while(a.length){ try{ localStorage.setItem(AK,JSON.stringify(a)); return true; }catch(e){ a.pop(); } } return false; }
  function refreshUI(){ const i=document.getElementById('autoBackupInfo'); if(!i) return; const a=rd();
    i.textContent='자동 백업: '+EVERY+'일마다 이 기기에 최근 '+KEEP+'개까지 보관돼요.'+(a[0]?' 마지막 자동 백업: '+fmt(a[0].t)+'.':' 아직 자동 백업이 없어요.')+' 기기를 바꾸거나 브라우저 데이터를 지우면 함께 사라지니, 가끔 "파일로 저장"도 해 주세요.';
    const b=document.getElementById('autoRestoreBtn'); if(b) b.style.display=a.length?'':'none'; }
  window.restoreAuto=function(){ const a=rd(); if(!a.length){ toast('자동 백업이 아직 없어요'); refreshUI(); return; }
    const go=x=>{ try{ restoreData(JSON.parse(JSON.stringify(x.d))); }catch(e){ toast('이 백업은 읽을 수 없어요'); } };
    if(typeof window.dlg==='function') window.dlg('어느 자동 백업으로 되돌릴까요?','',a.map(x=>['🗂 '+fmt(x.t)+' 백업',()=>go(x)]).concat([['닫기',null]]));
    else go(a[0]); };
  const _ub=window.updateBackupInfo; if(typeof _ub==='function') window.updateBackupInfo=function(){ _ub.apply(this,arguments); refreshUI(); };

  const _m=window.martyShow; window.__mtAutoUntil=0;
  window.martyShow=function(k,t){ if(k!=='autoBackup'&&k!=='cele'&&Date.now()<window.__mtAutoUntil) return; return _m.apply(this,arguments); };

  function canShow(){
    const sp=document.getElementById('splash'); if(sp){ const cs=getComputedStyle(sp); if(cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05) return false; }
    if(document.hidden) return false;
    if(window.lqIsBye&&lqIsBye()) return false;
    if(typeof stampBusy!=='undefined'&&stampBusy) return false;
    const on=id=>{ const e=document.getElementById(id); return !!(e&&e.className==='show'); };
    if(on('lowenaPop')||on('martyPop')) return false;
    const mo=document.getElementById('modalOverlay'), ask=document.getElementById('askOv');
    if((mo&&mo.classList.contains('show'))||(ask&&ask.classList.contains('show'))||document.querySelector('.mg-box')) return false;
    return true; }
  const MORNING=['좋은 아침이에요! 마티가 몰래 자동 백업을 해 뒀어요! 💾✨','짜잔~! 오늘 아침 자동 백업 완료! 기록은 마티가 지켰어요 🛡️','아침 요정 마티 출근! 3일마다 챙기는 백업, 방금 끝났어요! 칭찬해 주세요 😚'];
  const OTHER=['짜잔! 자동 백업 완료! 기록을 마티가 꼭 안아 뒀어요 🤗💾','3일 만에 자동 백업했어요! 이제 안심이에요 ✨','마티가 몰래 백업해 놨어요! 비밀이에요, 쉿 🤫💾'];
  function announce(day){
    const h=kstNow().getUTCHours(), L=(h>=5&&h<12)?MORNING:OTHER, text=L[Math.floor(Math.random()*L.length)];
    try{ localStorage.setItem(NK,day); }catch(e){ LQ.err(e); }
    if(S.settings.martyPop===false){ window.__mtAutoUntil=0; toast('마티: '+text); return; }
    window.__mtAutoUntil=Date.now()+Math.min(9000,Math.max(3400,1800+text.length*130))+800;
    martyShow('autoBackup',text);
    const all=document.querySelector('#martyPop .mp-all'); if(all){ all.classList.add('bk'); const mi=all.querySelector('.mp-in'); if(mi) mi.insertAdjacentHTML('beforeend','<i class="mp-bk">💾</i>'); } }
  let waiting=false;
  function queue(day){ if(waiting) return; waiting=true; let ok=0, n=0;
    window.__mtAutoUntil=Date.now()+30*60*1000;              /* 알림 전까지 마티의 평소 수다는 잠시 양보 */
    (function tick(){ if(++n>1500||todayStr()!==day){ waiting=false; window.__mtAutoUntil=0; return; }
      ok=canShow()?ok+1:0;
      if(ok>=3){ waiting=false; announce(day); return; }   /* 스플래시·로웨나 인사가 끝나고 잠깐 조용할 때 */
      setTimeout(tick,1200); })(); }
  function check(){ try{
    if(!S||!S.settings) return;
    const today=todayStr(), a=rd(), last=a[0];
    if(!last&&!Object.keys(S.history||{}).length) return;                 /* 처음 쓰는 빈 기록은 백업하지 않음 */
    if(!last||dayGap(last.day,today)>=EVERY){
      if(!wr([{t:Date.now(),day:today,d:JSON.parse(JSON.stringify(S))}].concat(a))) return;   /* 저장 실패 시 알리지 않음 */
    }
    const cur=rd()[0];
    if(cur&&cur.day===today&&localStorage.getItem(NK)!==today) queue(today);
    refreshUI();
  }catch(e){ LQ.err(e); } }
  window.autoBackupCheck=check;
  setTimeout(check,2500);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) setTimeout(check,1500); });
  setInterval(check,30*60*1000);
})();

/* ===== 탭 배경 도트 애니메이션: 밤의 성 · 별하늘 · 촛불 · 마법진 (픽셀아트, 약 9fps) ===== */
(function(){
  var PS=3, cv=null, cx=null, st=null, sx=null, W=0, H=0, kind='', timer=null, T0=Date.now(), shoot=null, dyn=[];
  var reduced=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
  var GOLD='#e9c977', CREAM='#f4e6b8', FL1='#fff3b0', FL2='#ffb347';
  var seed=1; function rs(k){ seed=k*2654435761>>>0; }
  function r(){ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }
  function px(c,x,y,col,a){ c.globalAlpha=a==null?1:a; c.fillStyle=col; c.fillRect(Math.round(x),Math.round(y),1,1); }
  function line(c,x0,y0,x1,y1,col,a,every){ x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
    var dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx_=x0<x1?1:-1, sy_=y0<y1?1:-1, e=dx+dy, n=0;
    for(;;){ if(!every||n%every<every-1) px(c,x0,y0,col,a); n++; if(x0===x1&&y0===y1) break; var e2=2*e; if(e2>=dy){ e+=dy; x0+=sx_; } if(e2<=dx){ e+=dx; y0+=sy_; } } }
  function ring(c,cx0,cy0,rad,col,a,every){ var n=Math.ceil(Math.PI*2*rad*1.6); for(var i=0;i<n;i++){ if(every&&i%every>=every/2) continue; var t=i/n*Math.PI*2; px(c,cx0+Math.cos(t)*rad,cy0+Math.sin(t)*rad,col,a); } }
  function moon(c,mx,my,rad){ for(var dy=-rad;dy<=rad;dy++) for(var dx=-rad;dx<=rad;dx++) if(dx*dx+dy*dy<=rad*rad&&(dx-2)*(dx-2)+(dy+1)*(dy+1)>(rad-1)*(rad-1)) px(c,mx+dx,my+dy,CREAM,.16); } /* 글자 뒤로 지나갈 때 튀지 않게 옅게 */
  function addStars(n,ym){ for(var i=0;i<n;i++) dyn.push({t:'s',x:Math.floor(r()*W),y:Math.floor(r()*ym),p:r()*4,v:.5+r()*.9,big:r()<.12,c:r()<.3?GOLD:CREAM}); }
  function addFlies(n){ for(var i=0;i<n;i++) dyn.push({t:'f',x:r()*W,y:H*.3+r()*H*.7,vy:.04+r()*.1,ph:r()*6.28,sw:1.6+r()*3,c:r()<.5?FL1:FL2}); }

  function build(k){
    kind=k; dyn=[]; rs({castle:7,sky:19,candles:31,circle:43}[k]||7);
    st.width=W; st.height=H; sx.clearRect(0,0,W,H);
    if(k==='castle'){
      addStars(Math.round(W*H/300),H*.6); moon(sx,W-16,14,6);
      var x=0; while(x<W){ var w=5+Math.floor(r()*9), h=Math.floor(H*(.1+r()*.22)), roof=r()<.5;
        sx.globalAlpha=.85; sx.fillStyle='#090503'; sx.fillRect(x,H-h,w,h);
        if(roof){ for(var i=0;i<w/2+1;i++) sx.fillRect(x+i,H-h-i,w-2*i,1); }
        else { for(var c=x;c<x+w-1;c+=3) sx.fillRect(c,H-h-2,2,2); }
        for(var j=0;j<Math.floor(h/12);j++) dyn.push({t:'w',x:x+1+Math.floor(r()*Math.max(1,w-3)),y:H-h+4+Math.floor(r()*Math.max(1,h-8)),p:r()*6,on:r()<.6});
        x+=w+Math.floor(r()*3); }
      sx.fillRect(0,H-3,W,3);
    } else if(k==='sky'){
      addStars(Math.round(W*H/130),H); moon(sx,W-16,16,7);
      for(var q=0;q<3;q++){ var bx=r()*W*.8+5, by=r()*H*.7+10, pts=[[bx,by]]; for(var m=0;m<4;m++) pts.push([pts[m][0]+8+r()*14,pts[m][1]+(r()-.4)*18]);
        for(var m2=0;m2<pts.length;m2++){ if(m2) line(sx,pts[m2-1][0],pts[m2-1][1],pts[m2][0],pts[m2][1],GOLD,.16,2); dyn.push({t:'s',x:Math.round(pts[m2][0]),y:Math.round(pts[m2][1]),p:r()*4,v:.6,big:true,c:CREAM}); } }
    } else if(k==='candles'){
      addStars(Math.round(W*H/500),H*.7); addFlies(8);
      for(var n=0;n<22;n++){ var cxp=4+Math.floor(r()*(W-8)), cyp=12+Math.floor(r()*(H-30)), hh=4+Math.floor(r()*5);
        sx.globalAlpha=.45; sx.fillStyle='#efe1bd'; sx.fillRect(cxp-1,cyp,3,hh);
        dyn.push({t:'c',x:cxp,y:cyp-1,p:r()*6}); }
    } else {
      addStars(Math.round(W*H/380),H); addFlies(6);
      var cx0=Math.round(W/2), cy0=Math.round(H*.5), R=Math.round(Math.min(W,H*.62)*.46);
      ring(sx,cx0,cy0,R,GOLD,.22); ring(sx,cx0,cy0,R-4,GOLD,.14,4); ring(sx,cx0,cy0,Math.round(R*.6),GOLD,.18); ring(sx,cx0,cy0,Math.round(R*.48),GOLD,.12,3);
      [-90,90].forEach(function(a0){ var P=[0,1,2].map(function(i){ var a=(a0+i*120)*Math.PI/180; return [cx0+Math.cos(a)*R*.76,cy0+Math.sin(a)*R*.76]; });
        line(sx,P[0][0],P[0][1],P[1][0],P[1][1],GOLD,.2); line(sx,P[1][0],P[1][1],P[2][0],P[2][1],GOLD,.2); line(sx,P[2][0],P[2][1],P[0][0],P[0][1],GOLD,.2); });
      for(var i2=0;i2<24;i2++){ var ang=i2*Math.PI/12; dyn.push({t:'r',x:cx0+Math.cos(ang)*(R+4),y:cy0+Math.sin(ang)*(R+4),i:i2}); }
    }
  }
  function draw(t){
    if(!st||!st.width||!st.height) return;
    cx.clearRect(0,0,W,H); cx.globalAlpha=1; cx.drawImage(st,0,0);
    dyn.forEach(function(d){
      if(d.t==='s'){ var k=Math.floor(t*d.v+d.p)%4, a=[.14,.3,.48,.3][k]; px(cx,d.x,d.y,d.c,a); if(d.big&&k===2){ px(cx,d.x-1,d.y,d.c,.3); px(cx,d.x+1,d.y,d.c,.3); px(cx,d.x,d.y-1,d.c,.3); px(cx,d.x,d.y+1,d.c,.3); } }
      else if(d.t==='w'){ var on=d.on?(Math.sin(t*.7+d.p)>-.55):(Math.sin(t*.4+d.p)>.85); if(on){ px(cx,d.x,d.y,GOLD,.75); px(cx,d.x,d.y+1,GOLD,.55); } }
      else if(d.t==='c'){ var f=Math.floor(t*8+d.p)%3; px(cx,d.x,d.y-f%2,FL1,.95); px(cx,d.x,d.y-1-f%2,FL2,.8); if(f===1) px(cx,d.x,d.y-2,FL2,.45); cx.globalAlpha=.07; cx.fillStyle=FL2; cx.fillRect(d.x-4,d.y-4,9,9); }
      else if(d.t==='r'){ var ph=(Math.floor(t*3)%24), dist=Math.min((d.i-ph+24)%24,(ph-d.i+24)%24); var a2=dist===0?1:dist===1?.6:dist===2?.35:.15; px(cx,d.x,d.y,dist<3?FL1:GOLD,a2); if(dist===0){ px(cx,d.x+1,d.y,FL1,.6); px(cx,d.x-1,d.y,FL1,.6); px(cx,d.x,d.y+1,FL1,.6); px(cx,d.x,d.y-1,FL1,.6); } }
      else if(d.t==='f'){ if(!reduced){ d.y-=d.vy; if(d.y<-2){ d.y=H+2; d.x=r()*W; } } var x=d.x+Math.sin(t/d.sw+d.ph)*3, a3=.35+.65*Math.abs(Math.sin(t*1.3+d.ph)); px(cx,x,d.y,d.c,a3); px(cx,x-1,d.y,d.c,a3*.35); px(cx,x+1,d.y,d.c,a3*.35); px(cx,x,d.y-1,d.c,a3*.35); px(cx,x,d.y+1,d.c,a3*.35); }
    });
    if((kind==='castle'||kind==='sky')&&!reduced){
      if(!shoot&&Math.random()<.018) shoot={x:r()*W*.7+W*.2,y:r()*H*.3,l:0};
      if(shoot){ for(var i=0;i<6;i++) px(cx,shoot.x-i,shoot.y-i*.5,CREAM,1-i/6); shoot.x+=3; shoot.y+=1.5; if(++shoot.l>22) shoot=null; }
    }
    cx.globalAlpha=1;
  }
  function frame(){ timer=null; if(!cv||!cv.isConnected||document.hidden) return; draw((Date.now()-T0)/1000); if(!reduced) timer=setTimeout(frame,110); }
  function dims(){ var de=document.documentElement, vw=Math.max(innerWidth||0,de.clientWidth||0), vh=Math.max(innerHeight||0,de.clientHeight||0,(window.screen&&screen.height)||0,(window.visualViewport&&visualViewport.height)||0); return [Math.max(1,Math.ceil(vw/PS)),Math.max(1,Math.ceil(vh/PS))]; }
  function size(){ var d=dims(); W=d[0]; H=d[1]; cv.width=W; cv.height=H; cv.style.width=(W*PS)+'px'; cv.style.height=(H*PS)+'px'; }
  function start(k){
    if(!cv){ cv=document.createElement('canvas'); cv.id='bgPx'; cv.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated;image-rendering:crisp-edges;z-index:-1'; document.body.insertBefore(cv,document.body.firstChild); cx=cv.getContext('2d'); st=document.createElement('canvas'); sx=st.getContext('2d'); }
    cv.style.display=''; size(); build(k); clearTimeout(timer); frame();
  }
  function stop(){ clearTimeout(timer); timer=null; if(cv) cv.style.display='none'; }
  function on(){ try{ return S.settings.bgPixel!==false; }catch(e){ return true; } }
  var _ab=window.applyBg;
  window.applyBg=function(){ _ab(); try{
    var k=S.settings.bgPattern==null?'castle':S.settings.bgPattern, sel=document.getElementById('bgPxSel'); if(sel) sel.value=on()?'1':'0';
    if(k==='none'||!on()){ stop(); return; }
    var b=bgLayer().style; b.backgroundImage='linear-gradient(rgba(23,14,8,.90),rgba(20,12,7,.94)), url('+BG_TEXTURE+')'; b.backgroundSize='cover, cover'; b.backgroundRepeat='no-repeat, no-repeat';
    start(k); }catch(e){ LQ.err(e); } };
  window.setBgPixel=function(v){ S.settings.bgPixel=!!v; save(); applyBg(); toast(v?'도트 애니메이션을 켰어요':'부드러운 그림으로 되돌렸어요'); };
  document.addEventListener('visibilitychange',function(){ if(!document.hidden&&cv&&cv.style.display!=='none'&&!timer) frame(); });
  var rz=null; window.addEventListener('resize',function(){ clearTimeout(rz); rz=setTimeout(function(){ if(cv&&cv.style.display!=='none'){ var d=dims(); if(d[0]===W&&d[1]===H) return; size(); build(kind); if(!timer) frame(); } },200); });
  try{ applyBg(); }catch(e){ LQ.err(e); }
})();

/* ===== 로웨나 서재 픽셀 모션 (촛불·먼지·마법 반짝임) — 배경 픽셀 효과와 같은 방식 ===== */
(function(){
  var box=document.getElementById('homeLowena'); if(!box) return;
  var cv=box.querySelector('.rs-px'); if(!cv||!cv.getContext) return;
  var cx=cv.getContext('2d'), W=0, H=0, timer=null, T0=Date.now(), motes=[];
  var reduced=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
  var GOLD='#e9c977', CREAM='#f4e6b8', FL1='#fff3b0', FL2='#ffb347', MAG='#e3ccff';
  var seed=11; function r(){ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }
  /* 위치는 이미지 기준 % (x, y, 세기) */
  var FLAMES=[[27.3,71.2,1],[18.3,10.8,.7],[17.6,54.3,.7],[33.2,54.2,.7],[60.3,50.2,.8],[62.0,49.5,.8],[63.8,50.6,.8],[82.5,47.7,.7],[50.3,20.6,.5]];
  var SPARKS=[[30.5,40,0],[27.5,37,2],[33.5,38.5,4],[34,44.5,1],[40,26,3],[69,73.5,5],[78,53,2],[68.5,78,0]];
  for(var i=0;i<18;i++) motes.push({x:r()*100,y:r()*100,vy:.05+r()*.11,sw:1.5+r()*3,ph:r()*6.28,c:r()<.35?GOLD:CREAM});
  function px(x,y,col,a){ cx.globalAlpha=a==null?1:a; cx.fillStyle=col; cx.fillRect(Math.round(x),Math.round(y),1,1); }
  function size(){
    var w=box.clientWidth, h=box.clientHeight; if(!w||!h) return false;
    var nw=200, nh=Math.max(1,Math.round(200*h/w));
    if(cv.width!==nw||cv.height!==nh){ cv.width=nw; cv.height=nh; }
    W=cv.width; H=cv.height; return W>0&&H>0;
  }
  function draw(t){
    cx.clearRect(0,0,W,H); cx.globalAlpha=1;
    var L=box.dataset.light, dark=(L==='night'||L==='dawn'||L==='evening'), nm=dark?motes.length:Math.round(motes.length*.5), am=dark?1:.6;
    /* 촛불 */
    FLAMES.forEach(function(f,i){
      var x=f[0]/100*W, y=f[1]/100*H, k=Math.floor(t*8+i*1.7)%3, sway=(Math.floor(t*2+i)%5===0)?1:0;
      cx.globalAlpha=.06*f[2]; cx.fillStyle=FL2; cx.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);
      px(x+sway,y-k%2,FL1,.8*f[2]); px(x+sway,y-1-k%2,FL2,.65*f[2]); if(k===1) px(x,y-2,FL2,.4*f[2]);
    });
    /* 떠다니는 금빛 먼지 */
    for(var i=0;i<nm;i++){ var m=motes[i];
      if(!reduced){ m.y-=m.vy*.35; if(m.y<-2) m.y=102; }
      var x=m.x/100*W+Math.sin(t/m.sw+m.ph)*2, y=m.y/100*H, a=(.25+.6*Math.abs(Math.sin(t*1.1+m.ph)))*am;
      px(x,y,m.c,a); if(a>.6) px(x+1,y,m.c,a*.35);
    }
    /* 마법 반짝임 (책·마법구 주변) */
    SPARKS.forEach(function(s){
      var k=Math.floor(t*1.3+s[2])%7, x=s[0]/100*W, y=s[1]/100*H, c=(s[0]>60?MAG:CREAM);
      if(k===0) px(x,y,c,.95);
      else if(k===1){ px(x,y,c,.9); px(x-1,y,c,.5); px(x+1,y,c,.5); px(x,y-1,c,.5); px(x,y+1,c,.5); }
      else if(k===2) px(x,y,c,.4);
    });
    cx.globalAlpha=1;
  }
  function frame(){ timer=null; if(document.hidden||!cv.isConnected) return; if(size()) draw((Date.now()-T0)/1000); if(!reduced) timer=setTimeout(frame,110); }
  function kick(){ clearTimeout(timer); timer=null; frame(); }
  document.addEventListener('visibilitychange',function(){ if(!document.hidden&&!timer) kick(); });
  var rz=null; window.addEventListener('resize',function(){ clearTimeout(rz); rz=setTimeout(kick,200); });
  kick();
})();

/* (예전 '자유 대화'는 아래 '로웨나 AI 대화 (통합)' 모듈로 합쳐졌어요. 여기엔 잠들기 버튼 위치 정리만 남겨요.) */
(function(){
  function inject(){ try{ var st=document.getElementById('stBtn'), mo=document.getElementById('cfMore'); if(st&&mo&&st.parentNode!==mo) mo.appendChild(st); }catch(e){ LQ.err(e); } }
  new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
})();
