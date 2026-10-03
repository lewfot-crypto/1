/* ===== 여름 (한여름 밤 주간 · 칠석) =====
   한여름 밤 주간(8/1~8/15): 홈 위쪽 반딧불 배너와 「반딧불 모으기」(하루 한 번, 작은 골드),
     첫 방문에 로웨나 인사 + 인어공주 이야기, 8/15 마지막 날에 모두의 한마디 (이벤트 퀘스트는 core.js evSpecials의 🌌 한여름 밤의 반딧불)
   칠석(음력 7월 7일, 아래 CS 표): 로웨나 → 까치가 물어 온 7골드 → 모두의 한마디, 「견우와 직녀」 이야기 (해마다 1번)
   기록은 S.sum[연도] = {open, end, fd(마지막으로 반딧불 모은 날), fn(모은 수), cs}
   여름 이야기는 stories/story_summer.js, 한여름 밤 주간에 처음 이야기를 청하면 「견우와 직녀」를 먼저 골라요(lowena-talk.js stPick) */
(function(){
  /* 카드 도우미는 card-kit.js (LQC) 를 같이 써요 */
  var esc=LQC.esc, td=LQC.td, pick=LQC.pick, rnd=LQC.rnd, whenFree=LQC.whenFree, closeCard=LQC.closeCard, K=LQC.kit('su'), card=K.card;
  var CS={2026:'08-19',2027:'08-08',2028:'08-26',2029:'08-16',2030:'08-05',2031:'08-24',2032:'08-12'};
  function week(){ var md=td().md; return md>='08-01'&&md<='08-15'; }
  function left(){ var t=td(); return t.m===8?15-t.d:-1; }
  function isCS(){ var t=td(); return CS[t.y]===t.md; }
  function sum(){ var t=td(), h=S.sum; if(!h||typeof h!=='object') h=S.sum={}; return h[t.y]=h[t.y]||{}; }
  function storyBtn(label,ask){ return {html:'<button class="ghost-btn" style="width:100%;margin-top:8px" id="suStory">'+esc(label)+'</button>',
    bind:function(){ var sb=document.getElementById('suStory'); if(sb) sb.onclick=function(){ closeCard(); setTimeout(function(){ try{ window.stRequest(ask); }catch(e){ LQ.err(e); } },250); }; }}; }

  /* ================= 한여름 밤 주간 ================= */
  var L={
    open:['아멜리아 님, 한여름 밤 주간이 시작됐어요. 해가 진 뒤 서재 창밖 풀숲에 반딧불이가 하나둘 떠올라요. 오늘 밤은 불을 조금 낮춰 두고 같이 봐요.',
          '한여름 밤이에요. 낮에는 덥지만 밤바람은 조금 시원해졌어요. 옛사람들은 반딧불 빛으로 책을 읽었대요. 이번 주는 그 빛처럼 작게, 오래 가요.'],
    openHow:'홈 위쪽에 반딧불이가 날아다니면 하루에 한 번 「반딧불 모으기」를 눌러 봐요. 누가 반딧불을 모아 왔는지 알 수 있어요. 잠들기 전에 들려줄 인어공주 이야기도 준비했어요.',
    end:['한여름 밤 주간의 마지막 날이에요. 반딧불이는 짧게 반짝이고 가지만, 그 빛을 본 밤은 오래 기억에 남아요.',
         '오늘로 한여름 밤 주간이 끝나요. 더운 날들을 잘 지나왔어요. 이제 곧 바람이 달라질 거예요.'],
    endCount:'이번 여름 아멜리아 님이 모은 반딧불은 {n}마리예요. 서재 유리병에 담아 두었다가 오늘 밤 전부 풀어 줄게요.',
    endStory:'잠들기 전에 견우와 직녀 이야기도 들려줄 수 있어요.',
    marty:['반딧불이 따라 날다가 마티 날개도 같이 반짝였어요! 오늘 밤은 마티가 제일 밝은 요정이에요 ✨',
           '한여름 밤 주간 끝! 마티는 수박을 열한 조각 먹었어요. 세다가 까먹어서 열한 조각이에요 🍉'],
    wella:['반딧불이랑 빗자루 경주했는데 졌어요! 걔네 생각보다 빨라요, 하하!',
           '밤하늘 날다가 은하수에 손이 닿을 뻔했어요! 진짜예요, 하하!'],
    sina:['…반딧불이는 잡는 게 아니다냥. 보는 거다냥. …앞발은 그냥 뻗어 본 거다냥.',
          '…여름밤 툇마루가 제일 시원하다냥. 오늘은 거기서 자겠다냥.'],
    alesendo:['가게 앞 풍경(風磬)이 밤새 울렸습니다. 여름 바람이 지나간 소리였습니다.',
              '올여름 장부의 마지막 칸에 반딧불을 하나 그려 두었습니다. 내년 여름에도 함께 보시지요.']};
  var FLY=[
    ['wella','반딧불이 따라 날다가 빗자루 끝에 한 마리가 앉았어요! 살짝 데려왔어요, 하하!'],
    ['wella','풀숲 위를 낮게 날았더니 반딧불이가 줄줄이 따라왔어요! 한 마리만 드릴게요!'],
    ['marty','마티가 반딧불이랑 친구 됐어요! 인사하러 같이 왔대요. 반짝반짝 골드도 챙겨 왔어요 ✨'],
    ['marty','오늘의 반딧불 배달이에요! 마티 날개보다 조금 덜 밝지만 귀여워요 🌟'],
    ['sina','…코끝에 앉아 있었다냥. 데려가라냥. 간지럽다냥.'],
    ['sina','…툇마루에 혼자 있길래 데려왔다냥. 외로워 보였다냥.'],
    ['alesendo','가게 등불에 길을 잃은 반딧불이 한 마리를 모셔 왔습니다. 오늘 몫은 골드로 적어 두었습니다.'],
    ['lowena','책장 사이로 반딧불이 하나가 들어왔어요. 책 읽는 걸 좋아하나 봐요. 아멜리아 님에게 보내 줄게요.']];
  function firefly(){
    var t=td(), h=sum(); if(!week()||h.fd===t.s) return;
    var r=pick(FLY), g=rnd(3,6);
    h.fd=t.s; h.fn=(h.fn||0)+1; S.gold=(S.gold||0)+g; save();
    try{ renderHome(); }catch(e){ LQ.err(e); }
    try{ banner(); }catch(e){ LQ.err(e); }
    card({title:'✨ 오늘의 반딧불',rows:[r],fx:'✨ 반딧불 '+h.fn+'마리째 ◈ +'+g+' 골드',btn:'고마워요'});
  }
  function runOpen(){ var h=sum(); if(h.open) return;
    whenFree(function(){ h.open=1; save();
      var sb=storyBtn('🧜 인어공주 이야기 듣기','인어공주 들려줘');
      card({title:'🌌 한여름 밤 주간이 시작됐어요',rows:[['lowena',pick(L.open)+' '+L.openHow]],extra:sb.html,btn:'고마워요'}); sb.bind(); }); }
  function runEnd(){ var h=sum(); if(h.end) return;
    whenFree(function(){ h.end=1; h.open=1; save();
      var n=h.fn||0, txt=pick(L.end)+(n?' '+L.endCount.replace('{n}',n):'')+' '+L.endStory, sb=storyBtn('🌌 견우와 직녀 듣기','견우와 직녀 이야기 들려줘');
      card({title:'🌌 한여름 밤 주간의 마지막 날',rows:[['lowena',txt]],extra:sb.html,btn:'다음',
        next:function(){ card({title:'🌌 모두의 한마디',rows:[['marty',pick(L.marty)],['wella',pick(L.wella)],['sina',pick(L.sina)],['alesendo',pick(L.alesendo)]],btn:'고마워요'}); }});
      sb.bind(); }); }

  /* ================= 칠석 (음력 7월 7일) ================= */
  var CL={
    lw:['오늘은 칠석이에요. 일 년에 단 하루, 견우와 직녀가 까치와 까마귀가 놓아 준 다리 위에서 만나는 날이래요. 오늘 밤 하늘을 한 번 올려다봐요.',
        '칠석이에요, 아멜리아 님. 옛사람들은 오늘 밤 직녀별에게 솜씨가 좋아지게 해 달라고 빌었대요. 아멜리아 님도 늘고 싶은 것 하나를 떠올려 봐요.'],
    gift:'창가에 까치 한 마리가 와서 반짝이는 것을 두고 갔어요. 다리를 놓느라 바빴을 텐데 아멜리아 님 몫도 챙겼나 봐요.',
    marty:['칠석이에요! 마티도 까치들 다리 놓는 거 도와주고 싶었는데 너무 작아서 깃털 하나만 날랐어요 ✨',
           '견우랑 직녀가 오늘 만난대요! 마티는 그 얘기 들을 때마다 날개가 찡해요 🌌'],
    wella:['오작교 구경 가려고 빗자루 탔는데 까치들이 길 막지 말래요, 하하! 멀리서만 봤어요!',
           '은하수 건너는 건 빗자루로도 어려워요! 그래서 까치 다리가 대단한 거예요, 하하!'],
    sina:['…일 년에 한 번 만난다냥. …나는 매일 보는 게 좋다냥. 아멜리아를.',
          '…까치가 시끄럽다냥. …오늘만은 봐주겠다냥.']};
  function runCS(){ var h=sum(); if(h.cs) return;
    whenFree(function(){ h.cs=1; save();
      var sb=storyBtn('🌌 견우와 직녀 이야기 듣기','견우와 직녀 이야기 들려줘');
      card({title:'🌌 오늘은 칠석이에요',rows:[['lowena',pick(CL.lw)+' '+CL.gift]],extra:sb.html,btn:'까치 선물 보기',next:function(){
        S.gold=(S.gold||0)+7; save(); try{ renderHome(); }catch(e){ LQ.err(e); }
        card({title:'🌌 모두의 한마디',rows:[['marty',pick(CL.marty)],['wella',pick(CL.wella)],['sina',pick(CL.sina)]],fx:'🐦 까치가 물어 온 선물 ◈ +7 골드',btn:'고마워요'}); }});
      sb.bind(); }); }

  /* ---------- 홈 배너: 한여름 밤 주간 + 떠다니는 반딧불 + 반딧불 모으기 ---------- */
  var css=document.createElement('style');
  css.textContent='#suBanner{position:relative;overflow:hidden;margin:0 0 10px;padding:22px 12px 10px;text-align:center;font-size:13.5px;font-weight:700;color:#e9f6c8;border:1px solid #6f9a4a;border-radius:8px;background:linear-gradient(#10202a,#0b1418);box-shadow:0 0 14px rgba(190,230,110,.25)}'
    +'#suBanner .su-f{position:absolute;width:4px;height:4px;border-radius:1px;background:#e8ff8a;box-shadow:0 0 6px 2px rgba(220,255,120,.75);pointer-events:none;animation:suFly 7s ease-in-out infinite,suGlow 1.6s steps(2) infinite}'
    +'#suBanner .su-btn{margin-top:8px;font-size:12.5px;padding:5px 14px}'
    +'@keyframes suFly{0%{transform:translate(0,0)}25%{transform:translate(10px,-6px)}50%{transform:translate(2px,6px)}75%{transform:translate(-9px,-2px)}100%{transform:translate(0,0)}}'
    +'@keyframes suGlow{0%{opacity:1}50%{opacity:.35}100%{opacity:1}}'
    +'@media (prefers-reduced-motion:reduce){#suBanner .su-f{animation:none}}';
  document.head.appendChild(css);
  function banner(){
    var el=document.getElementById('suBanner'), home=document.getElementById('screen-home'); if(!home) return;
    if(!week()){ if(el) el.remove(); return; }
    var d=left(), txt=d===0?'🌌 오늘은 한여름 밤 주간의 마지막 날이에요':'🌌 한여름 밤 주간이에요 · '+d+'일 남았어요';
    if(!el){ el=document.createElement('div'); el.id='suBanner';
      var ff=''; [[8,10,0],[22,30,-2.1],[38,12,-4.3],[57,34,-1.2],[72,14,-3.4],[88,28,-5.1]].forEach(function(s){ ff+='<span class="su-f" style="left:'+s[0]+'%;top:'+s[1]+'px;animation-delay:'+s[2]+'s,'+(s[2]/2)+'s"></span>'; });
      el.innerHTML=ff+'<div class="su-x"></div><div class="su-b"></div>';
      home.insertBefore(el,home.firstChild); }
    el.querySelector('.su-x').textContent=txt;
    var b=el.querySelector('.su-b'), got=sum().fd===td().s;
    b.innerHTML=got?'<div style="margin-top:6px;font-size:11.5px;font-weight:400;opacity:.8">오늘의 반딧불은 모았어요 · 내일 밤 또 날아와요</div>':'<button class="ghost-btn su-btn" id="suFly">✨ 반딧불 모으기</button>';
    var fb=document.getElementById('suFly'); if(fb) fb.onclick=function(){ if(document.getElementById('lqCard')) return; firefly(); }; }

  /* ---------- 스플래시 문구 ---------- */
  try{ var sp=document.getElementById('spHi'), t0=td(); if(sp){ if(isCS()) sp.textContent='🌌 오늘은 칠석이에요'; else if(t0.md==='08-01') sp.textContent='🌌 한여름 밤 주간이 시작됐어요'; else if(t0.md==='08-15') sp.textContent='🌌 한여름 밤 주간의 마지막 날이에요'; } }catch(e){ LQ.err(e); }

  /* ---------- 홈에 올 때마다 확인 ---------- */
  var tm=null;
  function onHome(){ clearTimeout(tm);
    try{ banner(); }catch(e){ LQ.err(e); }
    tm=setTimeout(function(){ try{ var t=td(); if(isCS()&&!sum().cs) runCS(); else if(t.md==='08-15') runEnd(); else if(week()) runOpen(); }catch(e){ LQ.err(e); } },3800); }
  LQ.on('screen:after',function(s){ if(s==='home') onHome(); else clearTimeout(tm); });
  /* 앱을 막 열었을 때는 screen:after가 오지 않아서 한 번 직접 확인해요 */
  setTimeout(function(){ try{ var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')) onHome(); }catch(e){ LQ.err(e); } },800);
  window.lqSummerWeek=week; window.lqChilseok=CS;
})();
