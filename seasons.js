/* ===== 절기와 크리스마스 =====
   24절기: 그날 처음 홈에 오면 로웨나와 친구 한 명이 한마디 (해마다 1번, S.sj[연도][절기])
   크리스마스 주간(12/18~12/25): 홈 맨 위 눈 내리는 장식과 카운트다운 (이벤트 퀘스트는 core.js evSpecials의 🎄 크리스마스 이브의 모험)
   12/24 이브: 로웨나 인사 + 「전나무 이야기 듣기」 → 모두의 한마디
   12/25 당일: 로웨나 인사 → 모두의 한마디 → 선물 상자 고르기 (해마다 1번, S.xm[연도]) */
(function(){
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function td(){ var t=todayStr(); return {y:+t.slice(0,4),m:+t.slice(5,7),d:+t.slice(8,10),md:t.slice(5)}; }
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
  var NAME={lowena:'로웨나',marty:'마티',wella:'웰라',sina:'시나',alesendo:'알레센도'};
  function say(k,t){ return k==='wella'&&window.lqLaugh?lqLaugh(t):t; }
  function rows(list){ return list.map(function(r){ return '<div class="lc-row" style="margin-bottom:10px">'+face(r[0])+'<div class="lc-w"><b>'+esc(NAME[r[0]]||r[0])+'</b>'+esc(say(r[0],r[1]))+'</div></div>'; }).join(''); }
  function card(o){ closeCard(); var e=document.createElement('div'); e.id='lqCard'; e.className='show';
    e.innerHTML='<div class="lc-box" style="max-height:86vh;overflow:auto"><div class="lc-t">'+esc(o.title)+'</div><div id="ssBody">'+rows(o.rows)+(o.fx?'<div class="lc-fx">'+esc(o.fx)+'</div>':'')+'</div>'
      +(o.extra||'')+(o.btn?'<button class="gold-btn" id="ssOk">'+esc(o.btn)+'</button>':'')+'</div>';
    document.body.appendChild(e);
    var ok=document.getElementById('ssOk'); if(ok) ok.onclick=function(){ closeCard(); if(o.next) setTimeout(o.next,250); };
    try{ sfx('check'); }catch(x){ LQ.err(x); }
    try{ lqNote(NAME[o.rows[0][0]],o.rows[0][1]); }catch(x){ LQ.err(x); } }

  /* ================= 24절기 (해마다 하루쯤 달라질 수 있어 대표 날짜로) ================= */
  var SJ=[
    ['01-05','소한','❄️','소한이에요. 이름은 작은 추위지만 사실은 한 해 중 제일 추운 때래요. 오늘은 목도리를 꼭 해요.',['sina','…소한이다냥. 난로 앞에서 한 발짝도 안 움직이겠다냥.']],
    ['01-20','대한','❄️','대한이에요. 큰 추위라는 뜻이지만, 옛말에 대한이 소한 집에 놀러 갔다가 얼어 죽었대요. 이제 추위도 조금씩 물러날 거예요.',['wella','대한이 소한한테 졌대요! 하하, 이름만 크고 약한 거 저랑 비슷해요!']],
    ['02-04','입춘','🌱','입춘이에요. 봄이 들어서는 날이라서 옛사람들은 대문에 좋은 글귀를 붙였대요. 아멜리아 님의 올봄에도 좋은 일이 들어오길 바라요.',['marty','입춘대길! 마티가 서재 문에도 붙여 놨어요! 좋은 일 잔뜩 들어와라 ✨']],
    ['02-19','우수','💧','우수예요. 눈이 녹아 비가 되는 때예요. 얼어 있던 마음도 오늘은 조금 풀어 줘요.',['alesendo','우수입니다. 장부에서도 겨울 항목을 하나씩 정리하고 있습니다.']],
    ['03-05','경칩','🐸','경칩이에요. 겨울잠 자던 개구리가 깨어나는 날이래요. 아멜리아 님도 미뤄 둔 일 하나를 살짝 깨워 볼까요?',['wella','개구리가 깨어나는 날이래요! 제 빗자루 밑에서도 뭔가 꿈틀했어요, 하하!']],
    ['03-20','춘분','🌸','춘분이에요. 낮과 밤의 길이가 같아지는 날이에요. 오늘 하루는 일과 쉼도 반반씩 나눠 봐요.',['sina','…낮과 밤이 똑같다냥. 그럼 낮잠과 밤잠도 똑같이 자겠다냥.']],
    ['04-05','청명','🌿','청명이에요. 하늘이 맑고 밝아지는 때예요. 창문을 열고 바깥 공기를 한 번 깊게 마셔 봐요.',['marty','청명이에요! 마티는 오늘 하늘색 리본 달았어요. 하늘이랑 깔맞춤이에요 🌤']],
    ['04-20','곡우','🌧','곡우예요. 곡식을 깨우는 봄비가 내리는 때예요. 오늘 내리는 비는 반가운 비라고 생각해 줘요.',['alesendo','곡우에는 찻잎을 따기 시작합니다. 올해 첫 햇차가 들어오면 가장 먼저 내어 드리겠습니다.']],
    ['05-05','입하','🌳','입하예요. 여름이 들어서는 날이에요. 나뭇잎이 짙어지는 것처럼 아멜리아 님의 하루도 조금씩 단단해지고 있어요.',['wella','벌써 여름이래요! 빗자루 타고 날면 바람이 시원할 거예요, 하하!']],
    ['05-21','소만','🌾','소만이에요. 햇볕이 넉넉해서 모든 것이 조금씩 차오르는 때예요. 아멜리아 님 마음도 조금씩 차오르길 바라요.',['sina','…조금씩 찬다냥. 내 밥그릇도 조금씩 찼으면 좋겠다냥.']],
    ['06-06','망종','🌾','망종이에요. 씨를 뿌리기 좋은 때예요. 오늘 작은 씨앗 같은 일 하나를 시작해 봐요.',['marty','씨앗 같은 일! 마티는 오늘 새 노트 첫 장을 열었어요 🌱']],
    ['06-21','하지','☀️','하지예요. 일 년 중 낮이 가장 긴 날이에요. 해가 오래 머무는 만큼 너무 서두르지 말고 천천히 가요.',['wella','오늘은 해가 제일 오래 있대요! 저녁 비행을 두 번 할 수 있겠어요!']],
    ['07-07','소서','🌤','소서예요. 작은 더위가 시작되는 때예요. 물 한 잔 더 마시는 걸 잊지 말아요.',['alesendo','소서입니다. 가게에 시원한 보리차를 준비해 두었습니다.']],
    ['07-23','대서','🔥','대서예요. 일 년 중 가장 더운 때예요. 오늘은 무리하지 말고 시원한 곳에서 쉬어 가요.',['sina','…덥다냥. 오늘 나는 바닥에 녹아 있겠다냥.']],
    ['08-07','입추','🍂','입추예요. 아직 덥지만 달력에는 벌써 가을이 들어섰어요. 저녁 바람이 조금 달라졌을 거예요.',['marty','가을이 온대요! 마티는 벌써 단풍색 리본을 골라 놨어요 🍂']],
    ['08-23','처서','🍃','처서예요. 모기 입이 비뚤어진다는 날이래요. 더위가 한풀 꺾이는 때예요. 조금만 더 힘내요.',['wella','모기 입이 비뚤어진대요! 그럼 이제 안 물리겠죠? 하하, 그래도 모기장은 쳐 둘게요!']],
    ['09-07','백로','💧','백로예요. 풀잎에 하얀 이슬이 맺히기 시작하는 때예요. 아침 공기가 맑아졌어요.',['alesendo','백로입니다. 아침 이슬이 장부 표지에도 맺혔더군요. 가을이 깊어집니다.']],
    ['09-23','추분','🌕','추분이에요. 다시 낮과 밤이 같아지는 날이에요. 이제부터는 밤이 조금씩 길어져요. 이야기 듣기 좋은 계절이에요.',['sina','…밤이 길어진다냥. 좋은 소식이다냥.']],
    ['10-08','한로','🍁','한로예요. 찬 이슬이 내리는 때예요. 겉옷 하나 챙겨 나가요.',['marty','찬 이슬이래요! 마티는 오늘 가디건 입었어요. 따뜻해요 🧥']],
    ['10-23','상강','🍁','상강이에요. 서리가 내리기 시작하는 때예요. 단풍이 가장 고운 때이기도 해요. 잠깐 창밖을 봐요.',['wella','서리가 내린대요! 빗자루 끝이 하얗게 얼었어요, 하하! 그래도 단풍은 정말 예뻐요!']],
    ['11-07','입동','🍂','입동이에요. 겨울이 들어서는 날이에요. 옛날에는 이맘때 김장을 하며 겨울을 준비했대요. 오늘은 아멜리아 님도 따뜻한 것 하나 챙겨요.',['alesendo','입동입니다. 가게 난로에 오늘 처음 불을 넣었습니다. 추우시면 언제든 들르십시오.']],
    ['11-22','소설','❄️','소설이에요. 첫눈이 내린다는 때예요. 첫눈이 오면 소원 하나를 빌어 봐요. 저도 하나 빌어 둘게요.',['wella','첫눈 오면 소원 빌래요! 제 소원은… 비밀이지만 빗자루랑 관련 있어요, 하하!']],
    ['12-07','대설','☃️','대설이에요. 큰 눈이 내린다는 때예요. 눈길은 미끄러우니까 천천히 걸어요.',['sina','…눈이다냥. 발이 시렵다냥. 오늘은 밖에 안 나가겠다냥.']],
    ['12-22','동지','🌙','동지예요. 일 년 중 밤이 가장 긴 날이에요. 옛사람들은 팥죽을 쑤어 먹으며 나쁜 기운을 쫓았대요. 오늘 밤이 가장 기니까, 내일부터는 해가 조금씩 길어져요.',['wella','팥죽 끓였어요! 새알심은 제가 빚었는데 모양이 다 달라요. 그래도 맛은 똑같아요, 하하!']]];
  /* 받침이 있으면 「이에요」, 없으면 「예요」 */
  function iyo(w){ var c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28?'이에요':'예요'; }
  function sjToday(){ var t=td(); for(var i=0;i<SJ.length;i++) if(SJ[i][0]===t.md) return SJ[i]; return null; }
  function sjRun(){ var s=sjToday(); if(!s) return; var t=td(), m=S.sj; if(!m||typeof m!=='object') m=S.sj={}; m[t.y]=m[t.y]||{}; if(m[t.y][s[1]]) return;
    whenFree(function(){ m[t.y][s[1]]=1; save();
      card({title:s[2]+' 오늘은 '+s[1]+iyo(s[1]),rows:[['lowena',s[3]],s[4]],btn:'고마워요'}); }); }
  window.lqSolarTerm=sjToday;

  /* ================= 크리스마스 ================= */
  function xLeft(){ var t=td(); return t.m===12&&t.d>=18&&t.d<=25?25-t.d:-1; }
  function xm(){ var t=td(), h=S.xm; if(!h||typeof h!=='object') h=S.xm={}; return h[t.y]=h[t.y]||{}; }
  var L={
    eve:['오늘은 크리스마스 이브예요, 아멜리아 님. 서재 창가에 작은 트리를 세워 두었어요. 오늘 밤은 조금 늦게까지 불을 켜 둘게요.',
         '크리스마스 이브예요. 바깥은 춥지만 서재 안은 따뜻해요. 오늘 하루 수고한 아멜리아 님에게 조용한 밤이 찾아오길 바라요.'],
    eveStory:'잠들기 전에 들려줄 이야기도 준비했어요. 숲속 작은 전나무 이야기예요. 듣고 싶으면 아래 버튼을 눌러요.',
    day:['메리 크리스마스, 아멜리아 님. 올해도 이 날을 함께 맞을 수 있어서 기뻐요. 오늘은 퀘스트보다 아멜리아 님 마음이 먼저예요.',
         '메리 크리스마스예요. 서재의 촛불을 전부 켜 두었어요. 아멜리아 님이 지나온 한 해가 이 불빛처럼 따뜻했길 바라요.'],
    dayGift:'모두가 트리 아래에 선물 상자를 하나씩 놓아두었대요. 조금 뒤에 하나 골라 봐요.',
    marty:['메리 크리스마스예요, 아멜리아 님! 마티는 오늘 빨간 모자 썼어요. 산타 조수 마티예요 🎅',
           '크리스마스다! 마티가 트리 꼭대기 별을 세 번이나 닦았어요. 반짝반짝하죠? ✨'],
    wella:['메리 크리스마스! 빗자루에 방울을 달았더니 날 때마다 딸랑딸랑해요, 하하!',
           '눈 오는 하늘을 날아 봤는데 코가 꽁꽁 얼었어요! 그래도 진짜 예뻤어요, 하하!'],
    sina:['…메리 크리스마스다냥. …트리 밑 상자 하나는 내 자리다냥.',
          '…오늘은 특별히 방울 장식을 건드리지 않겠다냥. …아마도.'],
    alesendo:['메리 크리스마스입니다, 아멜리아. 올해 장부의 마지막 장에 오늘을 가장 따뜻한 날로 적어 두겠습니다.',
              '크리스마스를 축하드립니다. 가게 앞 트리에 아멜리아의 이름을 단 장식을 하나 걸어 두었습니다.']
  };
  var GIFT=[
    {who:'wella',t:'제 선물이에요! 빗자루 타고 밤새 모은 반짝이 골드예요. 하하, 조금 찌그러진 건 비밀이에요!',g:[10,15]},
    {who:'marty',t:'마티 선물 도착! 리본을 세 번이나 다시 묶었어요. 열어 보니 골드가 반짝반짝하죠? ✨',g:[10,15]},
    {who:'alesendo',t:'제 선물은 장부에 적어 두었습니다. 「하고 싶은 일 하나」 쿠폰입니다. 언제든 보물 진열대에서 쓰십시오.',item:'🎁 알레센도의 크리스마스 쿠폰 · 하고 싶은 일 하나'},
    {who:'sina',t:'…내 선물이다냥. 상자 안에 내가 들어가 있었다. …오늘 하루 무릎 위에 앉아 주겠다냥. 그리고 골드도 조금.',g:[8,12]}];
  function giftCard(){
    var h=xm(); if(h.gift) return;
    var pool=GIFT.slice().sort(function(){ return Math.random()-.5; }).slice(0,3);
    var boxes='<div style="display:flex;justify-content:center;gap:14px;margin:6px 0 12px" id="ssBoxes">'+[0,1,2].map(function(i){
      return '<button class="ghost-btn" data-i="'+i+'" style="font-size:34px;padding:8px 10px;line-height:1">🎁</button>'; }).join('')+'</div>';
    card({title:'🎁 선물 상자 고르기',rows:[['lowena','트리 아래에 상자가 세 개 있어요. 누가 놓아둔 건지는 열어 봐야 알아요. 하나만 골라 봐요.']],extra:boxes});
    Array.prototype.forEach.call(document.querySelectorAll('#ssBoxes button'),function(b){ b.onclick=function(){
      var hh=xm(); if(hh.gift) return; var gft=pool[+b.getAttribute('data-i')], fx='';
      hh.gift=1;
      if(gft.item){ S.rewards=S.rewards||[]; S.rewards.push({id:'r'+Date.now(),name:gft.item,redeemed:false,owned:true,price:0}); fx='🎁 보물 진열대에 「'+gft.item.replace(/^\S+\s/,'')+'」가 생겼어요'; }
      else { var g=rnd(gft.g[0],gft.g[1]); S.gold=(S.gold||0)+g; fx='🎁 크리스마스 선물 ◈ +'+g+' 골드'; }
      save(); try{ renderHome(); }catch(e){ LQ.err(e); } try{ renderTreasure(); }catch(e){ LQ.err(e); }
      var body=document.getElementById('ssBody'), bx=document.getElementById('ssBoxes');
      if(bx) bx.outerHTML='<div class="lc-fx">'+esc(fx)+'</div><button class="gold-btn" id="ssOk">고마워요!</button>';
      if(body) body.innerHTML=rows([[gft.who,gft.t]]);
      var ok=document.getElementById('ssOk'); if(ok) ok.onclick=closeCard;
      try{ sfx('check'); }catch(e){ LQ.err(e); } try{ lqNote(NAME[gft.who],gft.t); }catch(e){ LQ.err(e); }
    }; });
  }
  function friends(next){ card({title:'🎄 모두의 한마디',rows:[['marty',pick(L.marty)],['wella',pick(L.wella)],['sina',pick(L.sina)],['alesendo',pick(L.alesendo)]],btn:next?'다음':'고마워요',next:next}); }
  function runEve(){ var h=xm(); if(h.eve) return;
    whenFree(function(){ h.eve=1; save();
      var story='<button class="ghost-btn" style="width:100%;margin-top:8px" id="ssStory">🌙 전나무 이야기 듣기</button>';
      card({title:'🎄 크리스마스 이브',rows:[['lowena',pick(L.eve)+' '+L.eveStory]],extra:story,btn:'다음',next:function(){ friends(null); }});
      var sb=document.getElementById('ssStory'); if(sb) sb.onclick=function(){ closeCard(); setTimeout(function(){ try{ window.stRequest('전나무 이야기 들려줘'); }catch(e){ LQ.err(e); } },250); };
    }); }
  function runDay(){ var h=xm(); if(h.day){ if(!h.gift) whenFree(giftCard); return; }
    whenFree(function(){ h.day=1; save();
      card({title:'🎄 메리 크리스마스, 아멜리아',rows:[['lowena',pick(L.day)+' '+L.dayGift]],btn:'다음',next:function(){ friends(giftCard); }}); }); }

  /* ---------- 홈 배너: 카운트다운 + 내리는 눈 ---------- */
  var css=document.createElement('style');
  css.textContent='#xmBanner{position:relative;overflow:hidden;margin:0 0 10px;padding:22px 12px 10px;text-align:center;font-size:13.5px;font-weight:700;color:#e8f4ff;border:1px solid #6fa8dc;border-radius:8px;background:linear-gradient(#13243a,#0e1a2a);box-shadow:0 0 14px rgba(111,168,220,.3)}'
    +'#xmBanner .xm-s{position:absolute;top:-14px;font-size:11px;pointer-events:none;animation:xmFall linear infinite;opacity:.9}'
    +'#xmBanner .xm-t{position:absolute;top:2px;font-size:16px;pointer-events:none}'
    +'@keyframes xmFall{0%{transform:translate(0,0)}50%{transform:translate(6px,34px)}100%{transform:translate(-2px,70px)}}'
    +'@media (prefers-reduced-motion:reduce){#xmBanner .xm-s{animation:none;top:4px}}';
  document.head.appendChild(css);
  function banner(){
    var el=document.getElementById('xmBanner'), home=document.getElementById('screen-home'); if(!home) return;
    var d=xLeft(); if(d<0){ if(el) el.remove(); return; }
    var txt=d===0?'🎄 메리 크리스마스':d===1?'🎄 오늘은 크리스마스 이브예요':'🎄 크리스마스까지 D-'+d+' · 크리스마스 주간이에요';
    if(!el){ el=document.createElement('div'); el.id='xmBanner';
      var sn=''; [[12,3.6,0],[30,4.4,-1.6],[48,3.9,-2.8],[66,4.8,-0.8],[84,4.1,-2.2]].forEach(function(s){ sn+='<span class="xm-s" style="left:'+s[0]+'%;animation-duration:'+s[1]+'s;animation-delay:'+s[2]+'s">❄️</span>'; });
      el.innerHTML=sn+'<span class="xm-t" style="left:6%">🎄</span><span class="xm-t" style="right:6%">🎁</span><div class="xm-x"></div>';
      home.insertBefore(el,home.firstChild); }
    el.querySelector('.xm-x').textContent=txt; }

  /* ---------- 스플래시 문구 ---------- */
  try{ var sp=document.getElementById('spHi'), t0=td(); if(sp){ if(t0.md==='12-25') sp.textContent='🎄 메리 크리스마스, 아멜리아 ❄'; else if(t0.md==='12-24') sp.textContent='🎄 크리스마스 이브예요 ✨'; } }catch(e){ LQ.err(e); }

  /* ---------- 홈에 올 때마다 확인 ---------- */
  var tm=null;
  function onHome(){ clearTimeout(tm);
    try{ banner(); }catch(e){ LQ.err(e); }
    tm=setTimeout(function(){ try{ var t=td(); if(t.md==='12-24') runEve(); else if(t.md==='12-25') runDay(); sjRun(); }catch(e){ LQ.err(e); } },4200); }
  LQ.on('screen:after',function(s){ if(s==='home') onHome(); else clearTimeout(tm); });
  /* 앱을 막 열었을 때는 screen:after가 오지 않아서 한 번 직접 확인해요 */
  setTimeout(function(){ try{ var h=document.getElementById('screen-home'); if(h&&h.classList.contains('active')) onHome(); }catch(e){ LQ.err(e); } },800);
})();
