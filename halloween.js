/* ===== 할로윈 (10월 31일) =====
   할로윈 주간(10/24~10/31): 홈 위쪽 호박 등불·박쥐 장식과 카운트다운 (이벤트 퀘스트는 core.js evSpecials의 🎃 할로윈 밤의 모험)
   당일: 로웨나 인사 + 할로윈 이야기 듣기 → 모두의 한마디 → 사탕 아니면 장난! (호박 3개 중 하나, 해마다 1번)
   할로윈 이야기는 stories/story_halloween.js, 그 주에 처음 이야기를 청하면 먼저 골라요(lowena-talk.js stPick) */
(function(){
  /* 카드 도우미는 card-kit.js (LQC) 를 같이 써요 */
  var esc=LQC.esc, td=LQC.td, pick=LQC.pick, rnd=LQC.rnd, busy=LQC.busy, whenFree=LQC.whenFree, closeCard=LQC.closeCard, say=LQC.say, NAME=LQC.NAME, K=LQC.kit('hw'), rows=K.rows, card=K.card;
  var HM=10, HD=31;
  function left(){ var t=td(); return t.m===HM&&t.d>=HD-7&&t.d<=HD?HD-t.d:-1; }
  function hw(){ var t=td(), h=S.hw; if(!h||typeof h!=='object') h=S.hw={}; return h[t.y]=h[t.y]||{}; }


  /* ---------- 대사 ---------- */
  var L={
    day:['오늘은 할로윈이에요, 아멜리아 님. 옛날 사람들은 이 밤에 길 잃은 것들이 집을 찾아온다고 믿어서 창가에 등불을 켜 두었대요. 오늘은 저도 서재 창가에 작은 등불 하나 켜 둘게요.',
         '할로윈 밤이 왔어요. 무서운 건 하나도 없어요. 호박 등불은 원래 길을 밝혀 주려고 켜는 거래요. 오늘 하루도 아멜리아 님 발밑을 환하게 비춰 줄게요.',
         '아멜리아 님, 할로윈이에요. 서재 책장 사이에 박쥐 모양 책갈피를 몇 개 숨겨 뒀어요. 오늘은 조금 장난스러운 마음으로 하루를 보내도 괜찮아요.'],
    story:'잠들기 전에 들려줄 할로윈 이야기도 하나 준비했어요. 무섭지 않은 등불 이야기예요. 듣고 싶으면 아래 버튼을 눌러요.',
    marty:['해피 할로윈이에요, 아멜리아 님! 마티는 오늘 호박 모자 쓰고 왔어요! 어때요, 잘 어울리죠? 🎃',
           '할로윈이다! 마티가 사탕 바구니 들고 서재를 한 바퀴 돌았는데요, 벌써 반은 제가 먹어 버렸어요! 남은 건 아멜리아 님 거예요 🍬'],
    wella:['하하! 할로윈이에요! 빗자루에 호박 등불 매달고 하늘을 날았어요! 박쥐들이 줄 서서 따라왔어요!',
           '마녀한테는 할로윈이 제일 바쁜 날이에요! 그래도 아멜리아 님한테 줄 사탕은 꼭 챙겨 왔어요, 하하!'],
    sina:['…할로윈이다냥. …검은 고양이가 주인공인 날이다냥. …오늘은 내가 좀 대단하다냥.',
          '…호박 등불 옆이 따뜻하다냥. …오늘 밤은 거기서 자겠다냥.'],
    alesendo:['할로윈을 맞이해 장부 한쪽에 사탕 항목을 따로 만들어 두었습니다. 오늘만은 계산하지 않겠습니다.',
              '오늘 밤 가게 앞에 호박 등불을 걸어 두었습니다. 지나가시다 들르시면 따뜻한 차를 내어 드리겠습니다.']
  };
  /* 사탕 아니면 장난! 호박 셋 중 둘은 사탕(골드), 하나는 시나의 장난(손해 없음, 작은 사과 사탕) */
  var TREAT=[
    ['wella','웰라','하하! 이 호박엔 제가 숨겨 둔 사탕이 들어 있었어요! 빗자루 타고 밤새 모은 거예요!'],
    ['marty','마티','짜잔! 마티 특제 호박 사탕이에요! 반짝반짝 금빛이라 골드로 바꿔 드릴게요 ✨'],
    ['alesendo','알레센도','이 호박은 제가 준비했습니다. 장부에 사탕 대신 골드로 정확히 적어 두었습니다.']];
  var TRICK=[
    ['sina','시나','…장난이다냥. 호박 안엔 내 꼬리만 있었다냥. …놀랐으면 미안하다냥. 사과의 뜻으로 작은 사탕 하나 두고 간다냥.'],
    ['sina','시나','…속았다냥. 그 호박은 텅 비었다냥. …웰라 몫 사탕을 내가 먹었다는 건 비밀이다냥. 한 알은 남겨 줬다냥.']];

  function totCard(){
    var h=hw(); if(h.tot) return;
    var slots=[0,1,2].sort(function(){ return Math.random()-.5; }), trick=slots[0];
    var pumps='<div style="display:flex;justify-content:center;gap:14px;margin:6px 0 12px" id="hwPumps">'+[0,1,2].map(function(i){
      return '<button class="ghost-btn" data-i="'+i+'" style="font-size:34px;padding:8px 10px;line-height:1">🎃</button>'; }).join('')+'</div>';
    card({title:'🎃 사탕 아니면 장난!',rows:[['lowena','로웨나','모두가 호박 세 개에 무언가를 숨겨 두었대요. 하나만 골라 봐요. 사탕일 수도 있고, 누군가의 장난일 수도 있어요.']],extra:pumps});
    Array.prototype.forEach.call(document.querySelectorAll('#hwPumps button'),function(b){ b.onclick=function(){
      var hh=hw(); if(hh.tot) return; var i=+b.getAttribute('data-i'), isTrick=i===trick, r=isTrick?pick(TRICK):pick(TREAT), g=isTrick?2:rnd(5,12);
      hh.tot=1; S.gold=(S.gold||0)+g; save(); try{ renderHome(); }catch(e){ LQ.err(e); }
      var body=document.getElementById('hwBody'), pp=document.getElementById('hwPumps');
      if(pp) pp.outerHTML='<div class="lc-fx">'+(isTrick?'🍬 장난 뒤에 남은 사과 사탕':'🍬 할로윈 사탕')+' ◈ +'+g+' 골드</div><button class="gold-btn" id="hwOk">'+(isTrick?'하하, 괜찮아요':'고마워요!')+'</button>';
      if(body) body.innerHTML=rows([r]);
      var ok=document.getElementById('hwOk'); if(ok) ok.onclick=closeCard;
      try{ sfx('check'); }catch(e){ LQ.err(e); } try{ lqNote(r[1],r[2]); }catch(e){ LQ.err(e); }
    }; });
  }

  function runDay(){
    var h=hw(); if(h.day){ if(!h.tot) whenFree(totCard); return; }
    whenFree(function(){
      h.day=1; save();
      var story='<button class="ghost-btn" style="width:100%;margin-top:8px" id="hwStory">🌙 할로윈 이야기 듣기</button>';
      card({title:'🎃 해피 할로윈, 아멜리아',rows:[['lowena','로웨나',pick(L.day)+' '+L.story]],extra:story,btn:'다음',
        next:function(){ card({title:'🦇 모두의 한마디',rows:[['marty','마티',pick(L.marty)],['wella','웰라',pick(L.wella)],['sina','시나',pick(L.sina)],['alesendo','알레센도',pick(L.alesendo)]],btn:'다음',next:totCard}); }});
      var sb=document.getElementById('hwStory'); if(sb) sb.onclick=function(){ closeCard(); setTimeout(function(){ try{ window.stRequest('할로윈 이야기 들려줘'); }catch(e){ LQ.err(e); } },250); };
    });
  }

  /* ---------- 홈 배너: 카운트다운 + 떠다니는 호박 등불과 박쥐 ---------- */
  var css=document.createElement('style');
  css.textContent='#hwBanner{position:relative;overflow:hidden;margin:0 0 10px;padding:22px 12px 10px;text-align:center;font-size:13.5px;font-weight:700;color:#ffd9a0;border:1px solid #d9822b;border-radius:8px;background:linear-gradient(#2a1a2e,#1c1220);box-shadow:0 0 14px rgba(217,130,43,.3)}'
    +'#hwBanner .hw-f{position:absolute;top:2px;font-size:15px;pointer-events:none;animation:hwFly 9s ease-in-out infinite}'
    +'#hwBanner .hw-l{position:absolute;top:3px;font-size:14px;pointer-events:none;animation:hwGlow 2.6s ease-in-out infinite}'
    +'@keyframes hwFly{0%{transform:translate(0,0)}25%{transform:translate(14px,-2px)}50%{transform:translate(4px,3px)}75%{transform:translate(-12px,-1px)}100%{transform:translate(0,0)}}'
    +'@keyframes hwGlow{0%,100%{opacity:.75;filter:drop-shadow(0 0 2px #ff9a2a)}50%{opacity:1;filter:drop-shadow(0 0 6px #ffb347)}}'
    +'@media (prefers-reduced-motion:reduce){#hwBanner .hw-f,#hwBanner .hw-l{animation:none}}';
  document.head.appendChild(css);
  function banner(){
    var el=document.getElementById('hwBanner'), home=document.getElementById('screen-home'); if(!home) return;
    var d=left(); if(d<0){ if(el) el.remove(); return; }
    var txt=d===0?'🎃 오늘은 할로윈 밤이에요':d===1?'🎃 내일은 할로윈이에요':'🎃 할로윈까지 D-'+d+' · 할로윈 주간이에요';
    if(!el){ el=document.createElement('div'); el.id='hwBanner';
      el.innerHTML='<span class="hw-l" style="left:8%">🎃</span><span class="hw-f" style="left:28%;animation-delay:-2s">🦇</span><span class="hw-f" style="left:62%;animation-delay:-5s;animation-duration:11s">🦇</span><span class="hw-l" style="right:8%;animation-delay:-1.3s">🎃</span><div class="hw-t"></div>';
      home.insertBefore(el,home.firstChild); }
    el.querySelector('.hw-t').textContent=txt; }

  /* ---------- 스플래시 문구 ---------- */
  try{ var sp=document.getElementById('spHi'), d0=left(); if(sp){ if(d0===0) sp.textContent='🎃 해피 할로윈, 아멜리아 🦇'; } }catch(e){ LQ.err(e); }

  /* ---------- 홈에 올 때마다 확인 ---------- */
  var tm=null;
  function onHome(){ clearTimeout(tm);
    try{ banner(); }catch(e){ LQ.err(e); }
    tm=setTimeout(function(){ try{ if(left()===0) runDay(); }catch(e){ LQ.err(e); } },3600); }
  LQ.on('screen:after',function(s){ if(s==='home') onHome(); else clearTimeout(tm); });
  /* 앱을 막 열었을 때는 screen:after가 오지 않아서 한 번 직접 확인해요 */
  setTimeout(function(){ try{ var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')) onHome(); }catch(e){ LQ.err(e); } },800);
})();
