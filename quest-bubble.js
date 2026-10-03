/* ===== 퀘스트 연속 기록 「뾰로롱 버블」 =====
   오늘 퀘스트마다 이번 달 안에서 며칠 연속 했는지 작은 요정 비눗방울과 숫자로 보여 줘요.
   - 2일째부터 보여요. 오늘 아직 안 했어도 어제까지 이어졌으면 옅은 방울로 남아요(오늘 하면 이어져요).
   - 쉬는 날 패스를 쓴 날은 끊기지도 세지지도 않아요.
   - 매달 1일에 처음부터 다시 세요.
   - 3·7·30일째가 되는 순간 마티가 축하해요(같은 달 같은 퀘스트는 한 번만, S.qbCele[연월]).
   core.js renderHome 이 window.lqQBubble(id), toggleQuest 가 window.lqQBubbleHit(id,on) 을 불러요. */
(function(){
  var MILE=[3,7,30];
  function prevDay(d){ var t=new Date(Date.parse(d+'T00:00:00Z')-864e5); return t.toISOString().slice(0,10); }
  /* 오늘(또는 어제)부터 거꾸로, 이번 달 안에서 연속으로 한 날 수 */
  function streak(id){ var t=todayStr(), ym=t.slice(0,7), H=S.history||{}, d=t, n=0, live=true;
    var today=H[t]||{}; if(!(today.done&&today.done[id])){ live=false; d=prevDay(t); }
    while(d.slice(0,7)===ym){ var h=H[d]||{};
      if(h.done&&h.done[id]) n++; else if(!h.pass) break;
      d=prevDay(d); }
    return {n:n,live:live}; }
  window.lqQStreak=streak;
  window.lqQBubble=function(id){ try{ var s=streak(id); if(s.n<2) return '';
      var mile=MILE.indexOf(s.n)>=0&&s.live;
      return '<span class="qb'+(s.live?'':' qb-wait')+(mile?' qb-mile':'')+'" title="이번 달 '+s.n+'일 연속"><i class="qb-s a">✧</i><i class="qb-s b">✦</i><b>'+s.n+'</b></span>';
    }catch(e){ LQ.err(e); return ''; } };

  var LINE={
    3:['뾰로롱! 「{q}」 사흘 연속이에요! 마티가 방울 하나 띄워 드렸어요 🫧','「{q}」 3일째예요! 작은 방울이 생겼어요. 톡 건드리면 반짝해요 ✨'],
    7:['「{q}」 일주일 연속! 마티가 요정 가루 듬뿍 뿌린 큰 방울이에요 🫧✨','뾰로롱~! 「{q}」 7일 연속이에요. 이건 진짜 대단한 거예요!'],
    30:['「{q}」 이번 달 30일 연속…! 마티 날개가 떨릴 만큼 감동이에요 🫧🌟','한 달 내내 「{q}」! 마티가 제일 반짝이는 방울을 드릴게요. 정말 정말 대단해요!']};
  function busy(){ var b=false; try{ b=!!stampBusy; }catch(e){} var q=function(i){ var e=document.getElementById(i); return e&&e.classList.contains('show'); };
    return b||q('martyPop')||q('modalOverlay')||!!document.getElementById('lqCard'); }
  window.lqQBubbleHit=function(id,on){ try{
    if(!on) return; var s=streak(id); if(MILE.indexOf(s.n)<0) return;
    var ym=todayStr().slice(0,7), c=S.qbCele; if(!c||typeof c!=='object') c=S.qbCele={}; c[ym]=c[ym]||{};
    var k=id+':'+s.n; if(c[ym][k]) return; c[ym][k]=1; save();
    if(S.settings&&S.settings.martyPop===false) return;
    var q=(S.dailyQuests||[]).find(function(x){ return x.id===id; }), name=q?q.name:'퀘스트';
    var a=LINE[s.n], t=a[Math.floor(Math.random()*a.length)].replace('{q}',name), n=0;
    (function go(){ if(busy()&&n++<30) return void setTimeout(go,700); try{ martyShow('cele',t); }catch(e){ LQ.err(e); } })();
  }catch(e){ LQ.err(e); } };

  var css=document.createElement('style');
  css.textContent='.quest-row .qb{position:relative;flex:none;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;margin-left:2px;border-radius:50%;'
    +'background:radial-gradient(circle at 34% 30%,#ffffff 0 12%,rgba(255,255,255,.55) 13% 22%,rgba(196,232,255,.55) 40%,rgba(184,170,255,.5) 72%,rgba(255,190,232,.55) 100%);'
    +'box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.75),0 0 6px rgba(170,200,255,.55);animation:qbBob 2.8s ease-in-out infinite}'
    +'.quest-row .qb b{font-family:"Noto Sans KR",sans-serif;font-size:12px;font-weight:700;color:#5a4a9a;text-shadow:0 1px 0 rgba(255,255,255,.8)}'
    +'.quest-row .qb .qb-s{position:absolute;font-style:normal;font-size:9px;line-height:1;color:#e2a530;text-shadow:0 0 2px #fff3c4,0 0 4px #ffd36b;animation:qbTw 1.8s steps(2) infinite}'
    +'.quest-row .qb .qb-s.a{top:-3px;right:-3px}.quest-row .qb .qb-s.b{bottom:-2px;left:-4px;font-size:7px;animation-delay:-.9s}'
    +'.quest-row .qb.qb-wait{opacity:.5;filter:saturate(.6);animation:none}.quest-row .qb.qb-wait .qb-s{display:none}'
    +'.quest-row .qb.qb-mile{width:34px;height:34px;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85),0 0 12px rgba(255,214,120,.8)}'
    +'@keyframes qbBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}'
    +'@keyframes qbTw{0%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}100%{opacity:1}}'
    +'@media (prefers-reduced-motion:reduce){.quest-row .qb,.quest-row .qb .qb-s{animation:none}}';
  document.head.appendChild(css);
  /* 처음 그릴 때는 이 파일이 아직 없었으니 한 번 다시 그려요 */
  try{ if(typeof renderHome==='function') renderHome(); }catch(e){ LQ.err(e); }
})();
