/* ===== 밤 일기 다시 보기 · 1년 전 오늘 =====
   하루 마무리에 적은 한 줄(S.sleepLog[날짜].note)을 홈 달력에서 날짜를 눌러 다시 읽어요(한 줄이 있는 날은 달력에 작은 점).
   1년 전 오늘 적은 한 줄이 있으면, 그날 처음 홈에 왔을 때 로웨나가 한 번 꺼내 줘요(S.yearAgo = 보여 준 날짜).
   core.js openDayModal 이 window.lqDayMemo(날짜) 를 불러요. */
(function(){
  var esc=LQC.esc, td=LQC.td, pick=LQC.pick, K=LQC.kit('ya');
  function yearAgo(ds){ var y=+ds.slice(0,4)-1, md=ds.slice(5); if(md==='02-29') md='02-28'; return y+'-'+md; }
  function log(ds){ return (S.sleepLog||{})[ds]||null; }
  window.lqDayMemo=function(ds){ try{ var r=log(ds), a=log(yearAgo(ds)), h='';
      if(r&&(r.note||r.time)) h+='<div class="modal-sec-h">🌙 밤의 한 줄</div><div class="dm-note">'+(r.note?'「'+esc(r.note)+'」':'<span class="dm-none">적은 한 줄은 없어요</span>')+(r.time?'<span class="dm-time">'+esc(r.time)+'에 하루를 마무리했어요</span>':'')+'</div>';
      if(a&&a.note) h+='<div class="modal-sec-h">📖 1년 전 이날</div><div class="dm-note dm-ago">「'+esc(a.note)+'」</div>';
      return h; }catch(e){ LQ.err(e); return ''; } };

  var L=['1년 전 오늘, 아멜리아 님은 하루를 닫으며 이렇게 적었어요. 「{n}」 그날의 아멜리아 님에게 오늘의 아멜리아 님이 한마디 해 준다면 뭐라고 할까요.',
         '서재 책장에서 작년 오늘의 페이지를 찾았어요. 「{n}」 일 년 사이에 많은 것이 지나갔지요. 여기까지 와 줘서 고마워요.',
         '오늘은 1년 전의 한 줄을 꺼내 볼게요. 「{n}」 그때도 지금도, 아멜리아 님은 하루를 끝까지 잘 데려왔어요.'];
  function check(){ var t=td(); if(S.yearAgo===t.s) return; var a=log(yearAgo(t.s)); if(!a||!a.note) return;
    LQC.whenFree(function(){ if(S.yearAgo===t.s) return; S.yearAgo=t.s; save();
      K.card({title:'📖 1년 전 오늘',rows:[['lowena',pick(L).replace('{n}',a.note)]],btn:'고마워요'}); }); }
  var tm=null;
  LQ.on('screen:after',function(s){ clearTimeout(tm); if(s==='home') tm=setTimeout(function(){ try{ check(); }catch(e){ LQ.err(e); } },6500); });
  setTimeout(function(){ try{ var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')) tm=setTimeout(function(){ try{ check(); }catch(e){ LQ.err(e); } },6000); }catch(e){ LQ.err(e); } },800);
  var css=document.createElement('style');
  css.textContent='.cal-day{position:relative}.cal-day .cal-memo{position:absolute;top:4px;right:5px;width:5px;height:5px;background:#8a6bd1;box-shadow:0 0 0 1px rgba(255,255,255,.6)}'
    +'.dm-note{font-size:14px;line-height:1.65;color:var(--ink);padding:8px 10px;border-left:3px solid #a78bfa;background:rgba(167,139,250,.08);border-radius:2px}'
    +'.dm-note.dm-ago{border-left-color:var(--gold-d);background:rgba(211,167,95,.1)}.dm-time{display:block;margin-top:4px;font-size:11.5px;color:var(--ink-soft)}.dm-none{color:var(--ink-soft)}';
  document.head.appendChild(css);
  try{ if(typeof renderCalendar==='function') renderCalendar(); }catch(e){ LQ.err(e); }
})();
