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
  var VER='v6.51'; /* sw.js 의 V 번호와 같게 올려요 */
  /* 업데이트 기록: 설정 맨 아래 버전 번호를 누르면 보여요. 업데이트할 때마다 맨 위에 한 줄씩 추가해요 */
  var LOG=[
   ['v6.51','2026-10-03',['생일·할로윈·크리스마스·봄 카드가 같은 도우미를 쓰도록 정리했어요 (보이는 화면은 그대로예요)']],
   ['v6.5','2026-10-02',['월간 회고에 그 달 도트 달력과 마티·웰라·시나의 한마디가 생겼어요','한글이 들어간 버튼·알림·제목의 넓던 띄어쓰기를 고치고 한글 글꼴로 맞췄어요','배경 별가루·달이 버튼과 글자 위로 비치지 않게, 흐리던 설정 글씨는 밝게, 슬라이더는 금색으로']],
   ['v6.4','2026-10-02',['봄 준비: 벚꽃 주간(3/28~4/10)에 홈 꽃잎 배너와 하루 한 번 「꽃잎 줍기」, 이벤트 「🌸 벚꽃 서재의 봄날」','3/14 화이트데이에 알레센도의 사탕 상자, 5/5 어린이날에 웰라의 쿠폰','봄 이야기 「어린 이다의 꽃」과 「엄지공주」(5화)','봄 도트 🦋🐝🌼🍡🎈와 봄 대사 25개']],
   ['v6.31','2026-10-02',['업데이트 기록을 한 장씩 넘겨 볼 수 있어요 (왼쪽으로 밀면 이전 버전)']],
   ['v6.3','2026-10-02',['🎄 크리스마스: 12/18~25 눈 내리는 홈 장식, 이브·당일 카드, 선물 상자 고르기',
     '🎍 새해: 연말 불꽃놀이 장식, 12/31 한 해 마무리(1월 1일에 적은 소원을 다시 꺼내 줘요), 1/1 올해의 소원 적기와 복주머니',
     '🧧 설날: 세배와 알레센도의 세뱃돈',
     '🍂 24절기: 입동·동지 같은 날 로웨나와 친구가 한마디',
     '📖 겨울밤 이야기: 「전나무」, 「눈의 여왕」(4화), 「열두 띠 이야기」',
     '움직이는 도트 29개로 늘렸어요 (김 나는 차, 불꽃놀이, 반짝이는 보물 등), ⛄🧣🧤 새로 그림',
     '자동 백업으로 되돌릴 때 어느 백업인지 고를 수 있게 고쳤어요',
     '✨☕⭐ 같은 이모지가 도트로 안 바뀌던 문제 해결',
     '코드 정리: 큰 파일(core.js)을 다섯 개로 나누고 안 쓰는 코드 정리']],
   ['v6.2','2026-10-02',['도트 이모지를 직접 50개 더 그렸어요 (모두 108개)',
     '움직이는 도트 10개: ✨🌟 반짝임, 🔥🕯 불꽃, 🎃 빛, 😴 Zz, 🎉 꽃가루, 👻 둥실, 🦇 날갯짓, 🐈‍⬛ 눈 깜빡',
     '직접 그리지 않은 이모지도 게임용 64색 도트로 (빛과 검은 테두리)',
     '▶ ⚔ ⚙ 같은 기호가 아이폰에서 컬러 이모지로 바뀌지 않게']],
   ['v6.1','2026-10-02',['밀담실 촛불을 도트 그림으로 바꿨어요 (불꽃이 일렁이고 빛이 깜빡여요)',
     '길게 대화하기 화면에도 로웨나 양옆에 도트 촛불 두 개 (글을 쓸 때는 숨어요)',
     '폰에서 날짜·시간을 골라 미리 눌러 보는 미리보기 페이지 (주소 끝에 /preview/)',
     '앱을 막 열었을 때 생일 주간 배너가 안 보이던 문제 해결',
     '시작 화면 위에 생일 카드가 겹쳐 뜨지 않게',
     '로웨나 인사가 다양해졌어요 (오전·점심·오후·저녁·밤·다시 왔을 때 새 인사 48개)',
     '인사 속 차 이야기는 가끔만 나오게']],
   ['v6.0','2026-10-02',['🎃 할로윈 주간(10/24~10/31): 홈 위쪽에 호박 등불과 박쥐 장식, 할로윈까지 남은 날짜',
     '특별 이벤트 「🎃 할로윈 밤의 모험」 퀘스트 3개 (다 하면 할로윈 보물과 골드)',
     '10/31 당일: 로웨나 인사와 모두의 한마디, 호박 세 개 중 하나를 고르는 「사탕 아니면 장난!」',
     '밀담실: 무섭지 않은 할로윈 등불 이야기 (할로윈 주간에 처음 이야기를 청하면 먼저 들려줘요)',
     '박쥐·사탕·유령 이모지를 도트로 새로 그렸어요']],
   ['v5.9','2026-10-02',['설정 맨 아래 버전 번호를 누르면 업데이트 기록이 보여요',
     '말풍선 글이 길면 2~3문장씩 나눠서 보여 줘요 (누르면 다음으로)',
     '오늘 기분 체크의 표정을 귀여운 도트 얼굴로 새로 그렸어요',
     '길게 대화하기: 글을 쓸 때 입력칸이 마지막 메시지를 가리던 문제 해결',
     '길게 대화하기: 로웨나 답이 문장 중간에 끊기던 문제 해결, 답을 여러 말풍선으로 나눠 보여 줘요',
     '짧은 알림이 화면 맨 위 상태 표시줄에 가려지던 문제 해결',
     '트레저·홈 지나가기 팝업이 아이폰 아래쪽 홈 막대에 가리지 않게 조정']],
   ['v5.8','2026-10-02',['이모지를 도트 그림으로 (자주 쓰는 50개는 직접 그림, 나머지는 자동 변환)',
     '밀담실: "재밌는 얘기 해 줘"라고 하면 로웨나가 이야기를 제안해요',
     '밀담실: 부탁하는 말을 기쁜 소식으로 잘못 알아듣고 축하하던 문제 해결',
     '길게 대화하기: 키 안내를 짧게',
     '구운몽·겐지 이야기 4부·생일 이야기 추가',
     '트레저 탭 웰라·시나 말풍선은 하루 2번까지, 서서히 사라지게',
     '아이폰에서 입력칸이 옆으로 넘치던 문제 해결']],
   ['v5.7','',['생일 주간 이벤트와 생일 이야기',
     '저장 공간이 85%를 넘으면 로웨나가 하루 한 번 알려 줘요',
     '업적 90개 이후 달성 소식을 캐릭터들이 번갈아 알려 줘요',
     '설정 맨 아래 오류 기록(E) 버튼과 버전 표시',
     '팝업이 겹치면 로웨나 → 마티 → 시나·웰라 → 알레센도 순서로']]];
  /* 업데이트 기록: 한 페이지에 버전 하나씩. 왼쪽으로 넘기면(또는 「이전 버전 ▶」) 더 옛날 버전이 나와요 */
  var VL=0;
  function vlPage(i){ var v=LOG[i], n=LOG.length;
    return '<div id="vlPage" style="min-height:240px;animation:vlIn .22s ease">'
      +'<div style="display:flex;justify-content:space-between;align-items:baseline;margin:4px 0 8px"><b style="font-size:17px;color:var(--brown,#6b4a1e)">'+h(v[0])+'</b>'
      +'<span style="font-size:12px;opacity:.7">'+(v[1]?h(v[1]):'')+(v[0]===VER?' · 지금 버전':'')+'</span></div>'
      +'<ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.7">'+v[2].map(function(x){ return '<li>'+h(x)+'</li>'; }).join('')+'</ul>'
      +(i===n-1?'<div class="panel-sub" style="margin-top:12px">'+h(v[0])+' 이전 기록은 따로 남아 있지 않아요.</div>':'')+'</div>'
      +'<div style="display:flex;justify-content:center;gap:5px;margin:12px 0 8px">'+LOG.map(function(x,j){ return '<i style="width:7px;height:7px;border-radius:50%;background:'+(j===i?'var(--gold,#c9a24d)':'rgba(120,90,40,.25)')+'"></i>'; }).join('')+'</div>'
      +'<div style="display:flex;gap:8px;align-items:center"><button class="cfb" style="flex:1" '+(i===0?'disabled style="flex:1;opacity:.35"':'')+' onclick="lqVerGo(-1)">◀ 최근</button>'
      +'<span style="font-size:12px;min-width:44px;text-align:center">'+(i+1)+' / '+n+'</span>'
      +'<button class="cfb" style="flex:1'+(i===n-1?';opacity:.35" disabled':'"')+' onclick="lqVerGo(1)">이전 버전 ▶</button></div>'
      +'<button class="cfb" style="width:100%;margin-top:8px" onclick="closeModal()">닫기</button>'; }
  function vlDraw(){ var box=document.getElementById('vlBox'); if(box) box.innerHTML=vlPage(VL); }
  window.lqVerGo=function(d){ var j=Math.max(0,Math.min(LOG.length-1,VL+d)); if(j===VL) return; VL=j; vlDraw(); };
  window.lqVerLog=function(){ try{ VL=0;
    showModal('<h3 style="margin-bottom:2px">업데이트 기록</h3><div class="panel-sub" style="margin-top:0">왼쪽으로 넘기면 이전 버전을 볼 수 있어요.</div><div id="vlBox"></div>');
    vlDraw();
    var box=document.getElementById('vlBox'), x0=null, y0=null;
    box.addEventListener('touchstart',function(e){ var t=e.touches[0]; x0=t.clientX; y0=t.clientY; },{passive:true});
    box.addEventListener('touchend',function(e){ if(x0==null) return; var t=e.changedTouches[0], dx=t.clientX-x0, dy=t.clientY-y0; x0=null;
      if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3) window.lqVerGo(dx<0?1:-1); },{passive:true});
  }catch(e){ LQ.err(e); } };
  try{ var vcss=document.createElement('style'); vcss.textContent='@keyframes vlIn{from{opacity:.2;transform:translateX(14px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#vlPage{animation:none!important}}'; document.head.appendChild(vcss); }catch(e){}
  function eBtn(){ var sc=document.getElementById('screen-master'); if(!sc||document.getElementById('lqEBtn')) return;
    var w=document.createElement('div'); w.style.cssText='display:flex;justify-content:flex-end;align-items:center;gap:6px;margin:18px 0 8px';
    var v=document.createElement('span'); v.id='lqVer'; v.textContent=VER; v.style.cssText='font-size:9px;letter-spacing:.5px;color:rgba(201,162,77,.45);padding:6px 4px;cursor:pointer'; v.setAttribute('role','button'); v.setAttribute('aria-label','업데이트 기록'); v.onclick=window.lqVerLog;
    var b=document.createElement('button'); b.id='lqEBtn'; b.textContent='E'; b.setAttribute('aria-label','오류 기록');
    b.style.cssText='width:26px;height:26px;padding:0;font-size:12px;font-weight:700;border-radius:50%;border:1px solid rgba(201,162,77,.45);background:transparent;color:rgba(201,162,77,.7);cursor:pointer';
    b.onclick=window.lqErrBtn; w.appendChild(v); w.appendChild(b); sc.appendChild(w); }
  LQ.on('master:after',function(){ try{ eBtn(); }catch(e){ LQ.err(e); } });
  LQ.on('screen:after',function(s){ if(s==='home') setTimeout(warn,9000); });
})();
