/* ===== 아멜리아의 생일 (7월 22일 고정, 설정 화면에는 따로 두지 않아요) =====
   생일 당일: 로웨나 인사 + 알레센도의 선물 28골드 + 모두의 한마디 + 겐지 생일 이야기, 연도별 업적
   생일 주간(7/15~): 홈 카운트다운과 특별 이벤트 퀘스트 / 전날·다음 날 한마디 / 설정에서 끄기·태어난 해 입력 */
(function(){
  var BM=7, BD=22, GIFT=28;
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function on(){ return true; }
  function bd(){ var b=S.bday; if(!b||typeof b!=='object') b=S.bday={}; b.done=b.done||{}; return b; }
  function td(){ var t=todayStr(); return {y:+t.slice(0,4),m:+t.slice(5,7),d:+t.slice(8,10)}; }
  function utc(y,m,d){ return Date.UTC(y,m-1,d); }
  function daysTo(){ var t=td(), now=utc(t.y,t.m,t.d), diff=Math.round((utc(t.y,BM,BD)-now)/864e5); if(diff<0) diff=Math.round((utc(t.y+1,BM,BD)-now)/864e5); return diff; }
  function isDay(){ var t=td(); return t.m===BM&&t.d===BD; }
  function isAfter(){ var t=td(); return t.m===BM&&t.d===BD+1; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

  /* ---------- 지금 다른 창이 떠 있지 않을 때만 보여줘요 ---------- */
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
  function rows(list){ return list.map(function(r){ return '<div class="lc-row" style="margin-bottom:10px">'+face(r[0])+'<div class="lc-w"><b>'+esc(r[1])+'</b>'+esc(r[0]==='wella'&&window.lqLaugh?lqLaugh(r[2]):r[2])+'</div></div>'; }).join(''); }
  function card(o){ closeCard(); var e=document.createElement('div'); e.id='lqCard'; e.className='show'+(o.cls?' '+o.cls:'');
    e.innerHTML='<div class="lc-box" style="max-height:86vh;overflow:auto"><div class="lc-t">'+esc(o.title)+'</div>'+rows(o.rows)+(o.fx?'<div class="lc-fx">'+esc(o.fx)+'</div>':'')
      +(o.extra||'')+'<button class="gold-btn" id="bdOk">'+esc(o.btn||'고마워요')+'</button></div>';
    document.body.appendChild(e);
    document.getElementById('bdOk').onclick=function(){ closeCard(); if(o.next) setTimeout(o.next,250); };
    try{ sfx('check'); }catch(x){ LQ.err(x); }
    try{ lqNote(o.rows[0][1],o.rows[0][2]); }catch(x){ LQ.err(x); } }

  /* ---------- 대사 ---------- */
  var L={
    day:['생일 축하해요, 아멜리아. 오늘은 아멜리아가 이 세상에 온 날이에요. 올해도 여기까지 잘 걸어와 줬어요. 저는 그게 제일 고마워요.',
         '아멜리아, 생일이에요. 오늘만큼은 해야 할 일보다 아멜리아의 마음이 먼저예요. 천천히, 좋아하는 것부터 해요.',
         '축하해요, 아멜리아. 겐지 이야기 속 사람들도 소중한 사람의 날은 이렇게 조용히 챙겼대요. 오늘은 제가 곁에서 챙길게요.'],
    dayN:'우리가 함께 맞는 {n} 생일이에요. 저는 이 날을 오래오래 기억할게요.',
    alN:'장부에는 {n} 생일로 적어 두었습니다. 내년에도 이 페이지를 펼쳐 놓겠습니다.',
    gift:'알레센도 님이 장부에 선물을 적어 두었어요. 생일 이야기도 하나 준비했어요. 듣고 싶으면 아래 버튼을 눌러요.',
    eve:['내일이 아멜리아의 생일이에요. 오늘 밤은 일찍 쉬고 내일을 가볍게 맞이해요. 저는 벌써 설레요.',
         '내일은 특별한 날이에요, 아멜리아. 오늘은 무리하지 말고 마음을 편히 해 둬요. 선물은 내일 건넬게요.'],
    after:['어제는 아멜리아의 생일이었어요. 아직 그 여운이 남아 있나요? 오늘도 어제만큼 소중한 하루예요.',
           '생일이 지나갔지만 축하는 아직 끝나지 않았어요. 오늘도 아멜리아답게, 천천히 가요.'],
    marty:['아멜리아 님, 생일 축하해요! 마티가 제일 먼저 박수 칠게요! 오늘은 퀘스트 걱정은 접어 두고 맘껏 즐겨요 ✨',
           '생일 축하 축하! 오늘은 마티도 쉬는 날처럼 놀래요. 아멜리아 님 덕분에 여기 모두가 행복해요 🎉'],
    wella:['아멜리아 님, 생일 축하해요! 빗자루 타고 하늘에 글자를 그리고 싶은데 오늘은 비밀이에요, 하하! 정말 좋은 날이에요!',
           '생일이네요, 생일! 포션 병마다 반짝이를 넣어 놨어요. 소원 하나 빌어요, 하하!'],
    sina:['…생일이다냥. …축하한다냥. …오늘은 꼬리를 한 번 더 흔들어 주겠다냥.',
          '…생일 축하다냥. …밤하늘의 별 하나는 오늘 아멜리아 몫이다냥.'],
    alesendo:['생일을 축하드립니다, 아멜리아. 장부에 오늘 날짜를 가장 먼저 적어 두었습니다. 선물은 정확히 28골드입니다.',
              '오늘은 장부에서 가장 귀한 날입니다. 생일 축하드립니다, 아멜리아. 약소하지만 선물을 받아 주십시오.']
  };

  /* ---------- 생일 당일 ---------- */
  function runDay(){
    var t=td(), b=bd(); if(b.done[t.y]&&b.done[t.y].gift) return;
    whenFree(function(){
      b.done[t.y]=b.done[t.y]||{}; b.done[t.y].gift=1; S.gold=(S.gold||0)+GIFT;
      var cnt=Object.keys(b.done).filter(function(y){ return b.done[y]&&b.done[y].gift; }).length, od=(['','첫','두','세','네','다섯','여섯','일곱','여덟','아홉','열'][cnt]||'')?(['','첫','두','세','네','다섯','여섯','일곱','여덟','아홉','열'][cnt]+' 번째'):cnt+'번째';
      var txt=pick(L.day)+' '+L.dayN.replace('{n}',od), als=pick(L.alesendo)+' '+L.alN.replace('{n}',od);
      S.achievements=S.achievements||[]; var id='bday'+t.y;
      if(!S.achievements.some(function(a){ return a.id===id; })) S.achievements.push({id:id,name:'🎂 '+od+' 생일 · '+cnt+'년을 함께한 사람',desc:t.y+'년 생일, 로웨나와 알레센도가 '+od+' 생일로 기억해요',cond:{type:'manual'},gold:2,unlocked:true,unlockedAt:todayStr()});
      save(); try{ renderHome(); }catch(e){ LQ.err(e); } try{ renderAchievements(); }catch(e){ LQ.err(e); }
      var story='<button class="ghost-btn" style="width:100%;margin-top:8px" id="bdStory">🌙 생일 이야기 듣기</button>';
      card({title:'🎂 생일 축하해요, 아멜리아',rows:[['lowena','로웨나',txt+' '+L.gift]],fx:'🎁 알레센도의 장부 선물 ◈ +'+GIFT+' 골드',extra:story,btn:'다음',
        next:function(){ card({title:'🎉 모두의 한마디',rows:[['marty','마티',pick(L.marty)],['wella','웰라',pick(L.wella)],['sina','시나',pick(L.sina)],['alesendo','알레센도',als]],btn:'고마워요'}); }});
      var sb=document.getElementById('bdStory'); if(sb) sb.onclick=function(){ closeCard(); setTimeout(function(){ try{ window.stRequest('생일 이야기 들려줘'); }catch(e){ LQ.err(e); } },250); };
    });
  }
  function runOnce(kind,key){ var t=td(), b=bd(); b.done[t.y]=b.done[t.y]||{}; if(b.done[t.y][kind]) return;
    whenFree(function(){ b.done[t.y][kind]=1; save();
      card({title:kind==='eve'?'🎂 내일은 생일이에요':'🕯 생일이 지나간 아침',rows:[['lowena','로웨나',pick(L[kind])]],btn:'고마워요'}); }); }

  /* ---------- 홈 배너 (생일 주간 카운트다운) ---------- */
  function banner(){
    var el=document.getElementById('bdayBanner'), home=document.getElementById('screen-home'); if(!home) return;
    var d=daysTo(), show=on()&&d<=7, txt='';
    if(show) txt=d===0?'🎂 오늘은 아멜리아의 생일이에요':d===1?'🎂 내일은 아멜리아의 생일이에요':'🎂 생일까지 D-'+d+' · 아멜리아의 생일 주간이에요';
    if(!show){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement('div'); el.id='bdayBanner';
      el.style.cssText='margin:6px 0 10px;padding:10px 12px;text-align:center;font-size:13.5px;font-weight:700;color:#f6e3a8;border:1px solid #c9a24d;border-radius:8px;background:linear-gradient(#2a2016,#201910);box-shadow:0 0 14px rgba(209,168,86,.25)';
      var ev=document.getElementById('homeEvent'); if(ev&&ev.parentNode) ev.parentNode.insertBefore(el,ev); else home.insertBefore(el,home.firstChild); }
    el.textContent=txt; }

  /* 생일 주간 이벤트 퀘스트(🎂 아멜리아의 생일 주간)는 core.js evSpecials에 이미 있어요 */

  /* ---------- 스플래시 문구 ---------- */
  try{ if(on()){ var sp=document.getElementById('spHi'), d0=daysTo(); if(sp){ if(d0===0) sp.textContent='🎂 생일 축하해요, 아멜리아 ✨'; else if(d0===1) sp.textContent='내일은 특별한 날이에요 🎂'; } } }catch(e){ LQ.err(e); }

  /* ---------- 홈에 올 때마다 확인 ---------- */
  var tm=null;
  function onHome(){ clearTimeout(tm);
    try{ banner(); }catch(e){ LQ.err(e); }
    tm=setTimeout(function(){ try{ if(!on()) return;
      if(isDay()) runDay(); else if(daysTo()===1) runOnce('eve'); else if(isAfter()) runOnce('after'); }catch(e){ LQ.err(e); } },3600); }
  LQ.on('screen:after',function(s){ if(s==='home') onHome(); else clearTimeout(tm); });
  /* 앱을 막 열었을 때는 screen:after가 오지 않아서 한 번 직접 확인해요 */
  setTimeout(function(){ try{ var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')) onHome(); }catch(e){ LQ.err(e); } },800);
})();
