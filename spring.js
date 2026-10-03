/* ===== 봄 (벚꽃 주간 · 화이트데이 · 어린이날) =====
   벚꽃 주간(3/28~4/10): 홈 위쪽 벚꽃잎 배너와 「꽃잎 줍기」(하루 한 번, 작은 골드),
     첫 방문에 로웨나 인사 + 엄지공주 이야기, 4/10 마지막 날에 모두의 한마디 (이벤트 퀘스트는 core.js evSpecials의 🌸 벚꽃 서재의 봄날)
   3/14 화이트데이: 로웨나 → 알레센도의 사탕 상자(14골드) → 모두의 한마디 (해마다 1번)
   5/5 어린이날: 로웨나 → 마티·웰라·시나 한마디 → 웰라의 어린이날 쿠폰 (해마다 1번)
   기록은 S.spr[연도] = {open, end, pd(마지막으로 꽃잎 주운 날), pn(주운 꽃잎 수), wd, kd}
   봄 이야기는 stories/story_spring.js, 벚꽃 주간에 처음 이야기를 청하면 「어린 이다의 꽃」을 먼저 골라요(lowena-talk.js stPick) */
(function(){
  /* 카드 도우미는 card-kit.js (LQC) 를 같이 써요 */
  var esc=LQC.esc, td=LQC.td, pick=LQC.pick, rnd=LQC.rnd, busy=LQC.busy, whenFree=LQC.whenFree, closeCard=LQC.closeCard, say=LQC.say, NAME=LQC.NAME, K=LQC.kit('sp'), rows=K.rows, card=K.card;
  function week(){ var md=td().md; return md>='03-28'&&md<='04-10'; }
  function left(){ var t=td(); return t.m===4?10-t.d:t.m===3?31-t.d+10:-1; }
  function spr(){ var t=td(), h=S.spr; if(!h||typeof h!=='object') h=S.spr={}; return h[t.y]=h[t.y]||{}; }

  function storyBtn(label,ask){ return {html:'<button class="ghost-btn" style="width:100%;margin-top:8px" id="spStory">'+esc(label)+'</button>',
    bind:function(){ var sb=document.getElementById('spStory'); if(sb) sb.onclick=function(){ closeCard(); setTimeout(function(){ try{ window.stRequest(ask); }catch(e){ LQ.err(e); } },250); }; }}; }

  /* ================= 벚꽃 주간 ================= */
  var L={
    open:['아멜리아 님, 벚꽃 주간이 시작됐어요. 서재 창밖 벚나무에 꽃이 하나둘 열리기 시작했어요. 바람이 불 때마다 꽃잎이 창가까지 날아와요.',
          '벚꽃이 피기 시작했어요. 꽃은 금방 지니까, 옛사람들은 이 짧은 날들을 더 소중하게 여겼대요. 이번 주는 조금 천천히 걸어도 괜찮아요.'],
    openHow:'홈 위쪽에 꽃잎이 떨어지면 하루에 한 번 「꽃잎 줍기」를 눌러 봐요. 누가 꽃잎을 주워 왔는지 알 수 있어요. 잠들기 전에 들려줄 엄지공주 이야기도 준비했어요.',
    end:['벚꽃 주간의 마지막 날이에요. 꽃은 지지만, 꽃이 진 자리에서 초록 잎이 올라와요. 끝나는 것도 다음 계절의 시작이에요.',
         '오늘로 벚꽃 주간이 끝나요. 이번 봄에 본 꽃 중에 마음에 남은 장면이 하나쯤 있었으면 좋겠어요.'],
    endCount:'올봄에 아멜리아 님이 모은 꽃잎은 {n}장이에요. 서재 책갈피 사이에 한 장씩 끼워 둘게요.',
    endStory:'잠들기 전에 어린 이다의 꽃 이야기도 들려줄 수 있어요.',
    marty:['벚꽃이 다 지기 전에 마티가 꽃잎 하나를 수첩에 꾹 눌러 뒀어요! 봄을 저장했어요 🌸',
           '벚꽃 주간 끝! 마티는 이번 주에 꽃 구경을 열한 번 했어요. 세다가 까먹어서 열한 번이에요 ✨'],
    wella:['꽃잎 사이로 날았더니 빗자루가 분홍색이 됐어요! 털어도 안 떨어져요, 하하!',
           '벚꽃비 맞으면서 날아 봤어요! 진짜 예뻤어요. 재채기는 일곱 번 했지만요, 하하!'],
    sina:['…꽃잎이 코에 붙었다냥. …떼지 마라냥. 봄이 끝날 때까지 두겠다냥.',
          '…벚나무 밑은 그늘이 좋다냥. 꽃이 져도 나는 거기서 자겠다냥.'],
    alesendo:['벚꽃 주간 동안 가게 창문을 열어 두었습니다. 꽃잎이 장부 사이에 들어와서 그대로 두었습니다.',
              '올해 벚꽃도 잘 보았습니다. 장부에 봄 항목을 하나 더 만들어 두었습니다. 내년에도 함께 보시지요.']};
  /* 꽃잎 줍기: 하루 한 번, 누가 주워 왔는지 */
  var PETAL=[
    ['wella','하하! 빗자루에 붙어 온 꽃잎이에요! 하나만 드리려고 했는데 잔뜩 붙어 왔어요!'],
    ['wella','벚나무 꼭대기에서 제일 예쁜 꽃잎을 골라 왔어요! 손에 쥐고 날다가 떨어뜨릴 뻔했어요, 하하!'],
    ['marty','마티가 꽃잎 한 장 주워 왔어요! 반짝이 가루를 살짝 뿌렸더니 골드가 됐어요 ✨'],
    ['marty','오늘의 꽃잎 배달이에요! 바람이 마티 쪽으로 밀어 줬어요 🌸'],
    ['sina','…꼬리에 붙어 있던 거다냥. 필요하면 가져가라냥.'],
    ['sina','…발밑에 떨어져 있었다냥. 주운 건 아니다냥. 그냥 거기 있었다냥.'],
    ['alesendo','가게 앞에 떨어진 꽃잎을 모아 두었습니다. 오늘 몫을 골드로 바꿔 드리겠습니다.'],
    ['lowena','책 사이에 끼어 있던 꽃잎이에요. 언제 들어왔는지 모르겠어요. 아멜리아 님이 가져가요.']];
  function petal(){
    var t=td(), h=spr(); if(!week()||h.pd===t.s) return;
    var r=pick(PETAL), g=rnd(3,6);
    h.pd=t.s; h.pn=(h.pn||0)+1; S.gold=(S.gold||0)+g; save();
    try{ renderHome(); }catch(e){ LQ.err(e); }
    try{ banner(); }catch(e){ LQ.err(e); }
    card({title:'🌸 오늘의 꽃잎',rows:[r],fx:'🌸 꽃잎 '+h.pn+'장째 ◈ +'+g+' 골드',btn:'고마워요'});
  }
  function runOpen(){ var h=spr(); if(h.open) return;
    whenFree(function(){ h.open=1; save();
      var sb=storyBtn('🌷 엄지공주 이야기 듣기','엄지공주 들려줘');
      card({title:'🌸 벚꽃 주간이 시작됐어요',rows:[['lowena',pick(L.open)+' '+L.openHow]],extra:sb.html,btn:'고마워요'}); sb.bind(); }); }
  function runEnd(){ var h=spr(); if(h.end) return;
    whenFree(function(){ h.end=1; h.open=1; save();
      var n=h.pn||0, txt=pick(L.end)+(n?' '+L.endCount.replace('{n}',n):'')+' '+L.endStory, sb=storyBtn('🌙 어린 이다의 꽃 듣기','이다의 꽃 이야기 들려줘');
      card({title:'🌸 벚꽃 주간의 마지막 날',rows:[['lowena',txt]],extra:sb.html,btn:'다음',
        next:function(){ card({title:'🌸 모두의 한마디',rows:[['marty',pick(L.marty)],['wella',pick(L.wella)],['sina',pick(L.sina)],['alesendo',pick(L.alesendo)]],btn:'고마워요'}); }});
      sb.bind(); }); }

  /* ================= 화이트데이 (3/14) ================= */
  var WD={
    lw:['오늘은 화이트데이예요. 원래는 사탕으로 고마운 마음을 돌려주는 날이래요. 아침에 알레센도 님이 서재에 들러서 작은 상자 하나를 맡기고 갔어요.',
        '화이트데이예요, 아멜리아 님. 오늘은 달콤한 것 하나쯤 먹어도 되는 날이에요. 그리고 알레센도 님이 준비한 게 있대요.'],
    als:['평소에 가게를 찾아 주시는 데 대한 답례입니다. 사탕 열네 알을 골드로 바꾸어 담았습니다. 장부에는 「고마움」이라고만 적어 두었습니다.',
         '화이트데이의 답례입니다. 상자 안의 사탕은 하나하나 직접 골랐습니다. 단것은 하루에 조금씩 드시기를 권합니다.'],
    marty:['화이트데이예요! 마티는 사탕을 하나 받으면 두 개를 돌려주는 요정이에요. 그러니까 아멜리아 님한테 두 개 드릴게요 🍬',
           '달콤한 날이다! 마티는 사탕 포장지로 리본을 만들었어요. 머리에 달았는데 어때요? ✨'],
    wella:['사탕을 만들어 보려고 했는데 냄비가 펑 했어요! 그래도 하나는 건졌어요, 하하!',
           '빗자루 손잡이에 사탕 주머니를 달았어요! 날면서 하나씩 꺼내 먹어요, 하하!'],
    sina:['…사탕은 이빨에 붙는다냥. …그래도 하나는 먹겠다냥.',
          '…알레센도가 준 사탕 상자, 나는 리본만 가지고 놀겠다냥.']};
  function runWD(){ var h=spr(); if(h.wd) return;
    whenFree(function(){ h.wd=1; save();
      card({title:'🍬 해피 화이트데이',rows:[['lowena',pick(WD.lw)]],btn:'상자 열어 보기',next:function(){
        S.gold=(S.gold||0)+14; save(); try{ renderHome(); }catch(e){ LQ.err(e); }
        card({title:'🍬 알레센도의 사탕 상자',rows:[['alesendo',pick(WD.als)]],fx:'🍬 사탕 상자 ◈ +14 골드',btn:'다음',next:function(){
          card({title:'🍬 모두의 한마디',rows:[['marty',pick(WD.marty)],['wella',pick(WD.wella)],['sina',pick(WD.sina)]],btn:'고마워요'}); }}); }}); }); }

  /* ================= 어린이날 (5/5) ================= */
  var KD={
    lw:['오늘은 어린이날이에요. 어른이 되어도 마음 한쪽에는 어린 아멜리아 님이 그대로 있어요. 오늘은 그 아이가 좋아하던 걸 하나 해 줘요.',
        '어린이날이에요, 아멜리아 님. 어릴 때 좋아하던 간식, 놀이, 노래가 떠오르나요? 오늘 하루는 퀘스트보다 그 마음이 먼저예요.'],
    marty:['오늘은 어린이날! 마티도 오늘만 어린 요정이 될래요. 풍선 불다가 날아갈 뻔했어요 🎈',
           '어린이날 기념으로 마티가 종이비행기를 접었어요! 서재 끝까지 날아갔어요 ✨'],
    wella:['저 어릴 때는 빗자루 대신 대걸레로 나는 연습을 했어요! 스승님한테 엄청 혼났어요, 하하!',
           '어린이날이에요! 오늘은 비행 연습 쉬고 비눗방울 불래요. 하하, 방울이 빗자루보다 잘 날아요!'],
    sina:['…어린 고양이 시절의 나는 지금보다 더 귀여웠다냥. …믿어라냥.',
          '…오늘은 실뭉치를 가지고 놀아도 되는 날이다냥. 아무한테도 말하지 마라냥.'],
    gift:'웰라가 어린이날 선물이라며 쿠폰 한 장을 남기고 갔어요. 보물 진열대에 넣어 둘게요.',
    item:'🎈 웰라의 어린이날 쿠폰 · 좋아하던 간식 하나'};
  function runKD(){ var h=spr(); if(h.kd) return;
    whenFree(function(){ h.kd=1; save();
      card({title:'🎈 오늘은 어린이날',rows:[['lowena',pick(KD.lw)]],btn:'다음',next:function(){
        S.rewards=S.rewards||[]; S.rewards.push({id:'r'+Date.now(),name:KD.item,redeemed:false,owned:true,price:0}); save();
        try{ renderTreasure(); }catch(e){ LQ.err(e); }
        card({title:'🎈 모두의 한마디',rows:[['marty',pick(KD.marty)],['wella',pick(KD.wella)],['sina',pick(KD.sina)],['lowena',KD.gift]],
          fx:'🎈 보물 진열대에 「'+KD.item.replace(/^\S+\s/,'')+'」가 생겼어요',btn:'고마워요'}); }}); }); }

  /* ---------- 홈 배너: 벚꽃 주간 + 떨어지는 꽃잎 + 꽃잎 줍기 ---------- */
  var css=document.createElement('style');
  css.textContent='#spBanner{position:relative;overflow:hidden;margin:0 0 10px;padding:22px 12px 10px;text-align:center;font-size:13.5px;font-weight:700;color:#ffe3ee;border:1px solid #e88aa8;border-radius:8px;background:linear-gradient(#3a2034,#24162a);box-shadow:0 0 14px rgba(232,138,168,.3)}'
    +'#spBanner .sp-p{position:absolute;top:-14px;font-size:11px;pointer-events:none;animation:spFall linear infinite;opacity:.9}'
    +'#spBanner .sp-btn{margin-top:8px;font-size:12.5px;padding:5px 14px}'
    +'@keyframes spFall{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(-8px,36px) rotate(40deg)}100%{transform:translate(4px,74px) rotate(80deg)}}'
    +'@media (prefers-reduced-motion:reduce){#spBanner .sp-p{animation:none;top:4px}}';
  document.head.appendChild(css);
  function banner(){
    var el=document.getElementById('spBanner'), home=document.getElementById('screen-home'); if(!home) return;
    if(!week()){ if(el) el.remove(); return; }
    var d=left(), txt=d===0?'🌸 오늘은 벚꽃 주간의 마지막 날이에요':'🌸 벚꽃 주간이에요 · '+d+'일 남았어요';
    if(!el){ el=document.createElement('div'); el.id='spBanner';
      var pp=''; [[10,4.2,0],[27,5.0,-1.8],[45,4.5,-3.1],[63,5.4,-0.9],[81,4.7,-2.4]].forEach(function(s){ pp+='<span class="sp-p" style="left:'+s[0]+'%;animation-duration:'+s[1]+'s;animation-delay:'+s[2]+'s">🌸</span>'; });
      el.innerHTML=pp+'<div class="sp-x"></div><div class="sp-b"></div>';
      home.insertBefore(el,home.firstChild); }
    el.querySelector('.sp-x').textContent=txt;
    var b=el.querySelector('.sp-b'), got=spr().pd===td().s;
    b.innerHTML=got?'<div style="margin-top:6px;font-size:11.5px;font-weight:400;opacity:.8">오늘의 꽃잎은 주웠어요 · 내일 또 떨어져요</div>':'<button class="ghost-btn sp-btn" id="spPetal">🌸 꽃잎 줍기</button>';
    var pb=document.getElementById('spPetal'); if(pb) pb.onclick=function(){ if(document.getElementById('lqCard')) return; petal(); }; }

  /* ---------- 스플래시 문구 ---------- */
  try{ var sp=document.getElementById('spHi'), t0=td(); if(sp){ if(t0.md==='03-14') sp.textContent='🍬 해피 화이트데이, 아멜리아'; else if(t0.md==='05-05') sp.textContent='🎈 오늘은 어린이날이에요'; else if(t0.md==='03-28') sp.textContent='🌸 벚꽃 주간이 시작됐어요'; else if(t0.md==='04-10') sp.textContent='🌸 벚꽃 주간의 마지막 날이에요'; } }catch(e){ LQ.err(e); }

  /* ---------- 홈에 올 때마다 확인 ---------- */
  var tm=null;
  function onHome(){ clearTimeout(tm);
    try{ banner(); }catch(e){ LQ.err(e); }
    tm=setTimeout(function(){ try{ var t=td(); if(t.md==='03-14') runWD(); else if(t.md==='05-05') runKD(); else if(t.md==='04-10') runEnd(); else if(week()) runOpen(); }catch(e){ LQ.err(e); } },3800); }
  LQ.on('screen:after',function(s){ if(s==='home') onHome(); else clearTimeout(tm); });
  /* 앱을 막 열었을 때는 screen:after가 오지 않아서 한 번 직접 확인해요 */
  setTimeout(function(){ try{ var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')) onHome(); }catch(e){ LQ.err(e); } },800);
  window.lqSpringWeek=week;
})();
