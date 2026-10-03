/* ===== 카드 도우미 (생일·할로윈·겨울·봄이 같이 써요) =====
   예전에는 birthday.js · halloween.js · seasons.js · spring.js 가 똑같은 도우미를 하나씩 복사해 가지고 있었어요.
   - LQC.whenFree(fn): 다른 창·팝업·도장이 떠 있지 않고 홈 화면일 때만 fn 실행 (최대 1분 기다림)
   - LQC.kit('hw') → {rows, card}: 카드 안 아이디가 hwBody·hwOk 처럼 파일마다 따로 붙어요
     줄은 [사람, 말] 또는 [사람, 이름, 말] 둘 다 돼요. 웰라의 말은 lqLaugh로 웃음소리가 바뀌어요.
     card({title, rows, fx, extra, btn, next, cls}) — btn이 없으면 버튼 없이 떠요(kit의 btn 옵션으로 기본값을 줄 수 있어요) */
(function(){
  var NAME={lowena:'로웨나',marty:'마티',wella:'웰라',sina:'시나',alesendo:'알레센도'};
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function td(){ var t=todayStr(); return {y:+t.slice(0,4),m:+t.slice(5,7),d:+t.slice(8,10),md:t.slice(5),s:t}; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function rnd(a,b){ return a+Math.floor(Math.random()*(b-a+1)); }

  /* ---------- 다른 창이 떠 있지 않을 때만 ---------- */
  function splashOn(){ var sp=document.getElementById('splash'); if(!sp) return false; var cs=getComputedStyle(sp); return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05; }
  function busy(){ var q=function(i){ var e=document.getElementById(i); return e&&e.classList.contains('show'); }, b=false; try{ b=!!stampBusy; }catch(e){ LQ.err(e); }
    return b||splashOn()||q('askOv')||q('modalOverlay')||q('wlPop')||q('martyPop')||q('lowenaPop')||document.getElementById('achMile')||document.getElementById('lqCard')||document.getElementById('bnCard'); }
  function whenFree(fn){ var n=0; (function go(){ if(busy()&&n++<40) return void setTimeout(go,1500); var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')&&!busy()) fn(); })(); }
  function closeCard(){ var e=document.getElementById('lqCard'); if(e) e.remove(); }
  function face(k){ var s={
      lowena:function(){ return typeof mascotImg==='function'?mascotImg(64,'cheer'):''; },
      marty:function(){ return '<img src="'+MARTY_IMG+'" alt="">'; },
      wella:function(){ return '<img src="assets/fa2c999a3b.webp" alt="">'; },
      sina:function(){ return '<img src="'+((window.WL_IMG1||{}).magic||'')+'" alt="">'; },
      alesendo:function(){ return '<img src="assets/941fef42af.webp" alt="">'; }};
    try{ return s[k](); }catch(e){ return ''; } }
  function say(k,t){ return k==='wella'&&window.lqLaugh?lqLaugh(t):t; }
  /* [사람, 말] 또는 [사람, 이름, 말] → {k, n, t} */
  function row(r){ return r.length>2?{k:r[0],n:r[1],t:r[2]}:{k:r[0],n:NAME[r[0]]||r[0],t:r[1]}; }
  function rows(list){ return list.map(function(r){ var x=row(r); return '<div class="lc-row" style="margin-bottom:10px">'+face(x.k)+'<div class="lc-w"><b>'+esc(x.n)+'</b>'+esc(say(x.k,x.t))+'</div></div>'; }).join(''); }

  function kit(pre,opt){ opt=opt||{};
    function card(o){ closeCard(); var e=document.createElement('div'); e.id='lqCard'; e.className='show'+(o.cls?' '+o.cls:'');
      var btn=o.btn||opt.btn||'';
      e.innerHTML='<div class="lc-box" style="max-height:86vh;overflow:auto"><div class="lc-t">'+esc(o.title)+'</div><div id="'+pre+'Body">'+rows(o.rows)+(o.fx?'<div class="lc-fx">'+esc(o.fx)+'</div>':'')+'</div>'
        +(o.extra||'')+(btn?'<button class="gold-btn" id="'+pre+'Ok">'+esc(btn)+'</button>':'')+'</div>';
      document.body.appendChild(e);
      var ok=document.getElementById(pre+'Ok'); if(ok) ok.onclick=function(){ closeCard(); if(o.next) setTimeout(o.next,250); };
      try{ sfx('check'); }catch(x){ LQ.err(x); }
      try{ var f=row(o.rows[0]); lqNote(f.n,f.t); }catch(x){ LQ.err(x); } }
    return {rows:rows,card:card}; }

  window.LQC={NAME:NAME,esc:esc,td:td,pick:pick,rnd:rnd,busy:busy,whenFree:whenFree,closeCard:closeCard,face:face,say:say,row:row,rows:rows,kit:kit};
})();
