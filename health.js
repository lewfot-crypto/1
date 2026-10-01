/* ===== 건강 점검: 저장 공간 확인 · 오류 기록(E 버튼) =====
   - 저장 공간: 설정에는 표시하지 않고, 브라우저 저장 한도(약 5MB)의 85%가 넘으면 로웨나가 하루 한 번 알려요.
   - 오류 기록: 앱이 조용히 넘긴 오류를 이 기기에만 최근 30개까지 남겨요(백업에는 들어가지 않아요).
   - E 버튼: 설정 맨 아래의 작은 버튼. 처음 누르면 마티가 설명하고, 다음부터는 최근 기록을 보여줘요. */
(function(){
  var ELK='lq_errlog', LIMIT=5000000;
  function h(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  /* ---------- 오류 기록 ---------- */
  function rd(){ try{ var a=JSON.parse(localStorage.getItem(ELK)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function wr(a){ try{ localStorage.setItem(ELK,JSON.stringify(a.slice(-30))); }catch(e){} }
  function rec(src,e){ try{ var m=String(e&&e.message?e.message:e).slice(0,160), st=String(e&&e.stack?e.stack:'').split('\n')[1]||'', a=rd(), t=new Date();
    var last=a[a.length-1]; if(last&&last.m===m&&last.s===src){ last.n=(last.n||1)+1; last.t=t.toISOString(); wr(a); return; }
    a.push({t:t.toISOString(),s:src,m:m,w:st.trim().slice(0,110),n:1}); wr(a); }catch(x){} }
  if(window.LQ&&LQ.err){ var _e=LQ.err; LQ.err=function(e){ rec('조용히 넘긴 오류',e); return _e.apply(this,arguments); }; }
  window.addEventListener('error',function(ev){ rec('화면 오류',ev.error||ev.message); });
  window.addEventListener('unhandledrejection',function(ev){ rec('처리되지 않은 오류',ev.reason); });
  /* ---------- 저장 공간 ---------- */
  function usage(){ var n=0; try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); n+=k.length+(localStorage.getItem(k)||'').length; } }catch(e){ LQ.err(e); } return n; }
  function pct(){ return Math.min(100,Math.round(usage()/LIMIT*100)); }
  function warn(){ try{ var p=pct(), d=todayStr(); if(p<85||S.storWarn===d) return; S.storWarn=d; save();
    var t=p>=95?'아멜리아, 저장 공간이 거의 가득 찼어요. 새 기록이 저장되지 않을 수 있으니 지금 설정에서 백업 파일을 만들어 두세요.':'아멜리아, 저장 공간이 '+p+'% 찼어요. 곧 가득 찰 수 있으니 설정에서 백업 파일을 만들어 두면 안심이에요.';
    if(typeof lowenaShow==='function') lowenaShow(t); }catch(e){ LQ.err(e); } }
  /* ---------- E 버튼 ---------- */
  var GUIDE='이 작은 E 버튼은 오류 기록이에요. 앱이 조용히 넘긴 문제가 이 기기에만 쌓여 있다가, 다음부터 이 버튼을 누르면 최근 기록을 볼 수 있어요. 이상한 일이 생기면 그 화면을 캡처해서 보내 주세요!';
  window.lqErrBtn=function(){ try{
    if(!S.errGuide){ S.errGuide=1; save(); if(typeof martyShow==='function') martyShow(null,GUIDE); return; }
    var a=rd().slice().reverse();
    showModal('<h3 style="margin-bottom:6px">오류 기록</h3><div class="panel-sub" style="margin-top:0">최근 30개까지 이 기기에만 남아요. 비어 있으면 아무 문제가 없었다는 뜻이에요.</div>'
      +(a.length?a.map(function(x){ var d=new Date(x.t); return '<div class="cf-ent"><div class="m">'+h(d.toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}))+' · '+h(x.s)+(x.n>1?' · '+x.n+'번':'')+'</div><div style="font-size:12.5px;word-break:break-all">'+h(x.m)+(x.w?'<br><span style="opacity:.6">'+h(x.w)+'</span>':'')+'</div></div>'; }).join(''):'<div style="padding:14px 0;text-align:center;opacity:.7">기록된 오류가 없어요 ✓</div>')
      +'<div style="display:flex;gap:6px;margin-top:10px"><button class="cfb" style="flex:1" onclick="lqErrClear()">기록 지우기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>');
  }catch(e){ LQ.err(e); } };
  window.lqErrClear=function(){ wr([]); closeModal(); try{ toast('오류 기록을 지웠어요'); }catch(e){} };
  var VER='v5.8'; /* sw.js 의 V 번호와 같게 올려요 */
  function eBtn(){ var sc=document.getElementById('screen-master'); if(!sc||document.getElementById('lqEBtn')) return;
    var w=document.createElement('div'); w.style.cssText='display:flex;justify-content:flex-end;align-items:center;gap:6px;margin:18px 0 8px';
    var v=document.createElement('span'); v.id='lqVer'; v.textContent=VER; v.style.cssText='font-size:9px;letter-spacing:.5px;color:rgba(201,162,77,.45)';
    var b=document.createElement('button'); b.id='lqEBtn'; b.textContent='E'; b.setAttribute('aria-label','오류 기록');
    b.style.cssText='width:26px;height:26px;padding:0;font-size:12px;font-weight:700;border-radius:50%;border:1px solid rgba(201,162,77,.45);background:transparent;color:rgba(201,162,77,.7);cursor:pointer';
    b.onclick=window.lqErrBtn; w.appendChild(v); w.appendChild(b); sc.appendChild(w); }
  LQ.on('master:after',function(){ try{ eBtn(); }catch(e){ LQ.err(e); } });
  LQ.on('screen:after',function(s){ if(s==='home') setTimeout(warn,9000); });
})();
