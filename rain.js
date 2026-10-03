/* ===== 비 오는 날 서재 =====
   홈 서재 그림 오른쪽 아래 ☔ 버튼을 누르면 그날 하루 서재 창밖에 도트 비가 내리고 그림이 조금 차분해져요.
   켤 때 로웨나가 빗소리 인사를 해요. 한 번 더 누르면 비가 그쳐요. 다음 날이 되면 저절로 맑아져요(S.rain = 비 오는 날짜). */
(function(){
  var td=LQC.td, pick=LQC.pick, K=LQC.kit('rn');
  function on(){ return S.rain===td().s; }
  var L=['비가 오네요, 아멜리아 님. 창밖 빗소리가 서재 안까지 들려요. 오늘은 조금 천천히 가도 괜찮아요. 따뜻한 차 한 잔 우려 둘게요.',
         '빗방울이 창문을 두드려요. 이런 날은 책장 넘기는 소리도 더 부드럽게 들려요. 우산 챙겼어요? 젖었다면 잠깐 말리고 가요.',
         '비 오는 날의 서재는 제가 제일 좋아하는 풍경이에요. 할 일이 많아도 빗소리 한 곡만큼은 쉬어 가요.',
         '오늘은 비가 오는군요. 옛사람들은 비 오는 날을 책 읽기 좋은 날이라고 했대요. 아멜리아 님도 마음 젖지 않게 조심해요.'];
  var F=[['sina','…비 오는 날엔 창가가 제일이다냥. …오늘은 거기서 안 비키겠다냥.'],['wella','빗자루가 젖어서 오늘은 못 날아요! 대신 서재에서 놀래요, 하하!'],
         ['marty','마티는 비 오는 날 날개가 무거워져요. 그래서 오늘은 책장 위에서 빗소리 들을 거예요 ☔'],['alesendo','가게 처마 밑에 우산을 하나 더 걸어 두었습니다. 필요하시면 가져가십시오.']];
  function paint(){ var sc=document.getElementById('homeLowena'); if(!sc) return;
    var w=sc.querySelector('.rs-window'), r=w&&w.querySelector('.rs-rain'), b=document.getElementById('rnBtn');
    sc.classList.toggle('rainy',on());
    if(w&&on()&&!r){ r=document.createElement('i'); r.className='rs-rain'; w.appendChild(r); }
    if(r&&!on()) r.remove();
    if(!b){ b=document.createElement('button'); b.id='rnBtn'; b.className='rn-btn'; b.title='오늘 비 와요'; b.onclick=toggle; sc.appendChild(b); }
    b.textContent=on()?'☔ 비 그쳤어요':'☔'; b.classList.toggle('on',on()); }
  function toggle(e){ if(e) e.stopPropagation(); if(document.getElementById('lqCard')) return;
    if(on()){ S.rain=''; save(); paint(); try{ toast('☀️ 비가 그쳤어요'); }catch(x){ LQ.err(x); } return; }
    S.rain=td().s; save(); paint(); try{ sfx('check'); }catch(x){ LQ.err(x); }
    K.card({title:'☔ 비 오는 날의 서재',rows:[['lowena',pick(L)],pick(F)],btn:'고마워요'}); }
  window.lqRainOn=on;
  var css=document.createElement('style');
  css.textContent='#homeLowena{position:relative}'
    +'#homeLowena .rs-window .rs-rain{inset:0;overflow:hidden;opacity:.85;background:'
      +'linear-gradient(transparent 0 35%,rgba(225,236,255,.95) 35% 65%,transparent 65%) 0 0/5px 9px,'
      +'linear-gradient(transparent 0 60%,rgba(190,210,245,.85) 60% 85%,transparent 85%) 2px 4px/7px 13px;'
      +'image-rendering:pixelated;animation:rnFall .45s steps(4) infinite}'
    /* 그림 전체를 흐린 날 빛으로: 기존 시간대 변수(--b 밝기, --s 채도, --c 색, --sky 창밖 하늘)를 덮어써요 */
    +'#homeLowena.rainy{--b:.98;--s:.85;--se:0;--c:#e2e8f5;--sky:linear-gradient(#4e586c 0%,#6f7a8e 55%,#8c96a6 100%);--so:0;--co:.95;--cc:#9aa3b2;--st:0}'
    +'#homeLowena.rainy[data-light="night"]{--b:.6;--c:#7f8cc4}'
    +'@keyframes rnFall{from{background-position:0 0,3px 5px}to{background-position:-2px 12px,1px 20px}}'
    +'.rn-btn{position:absolute;right:8px;bottom:8px;z-index:3;min-width:34px;height:30px;padding:0 9px;border-radius:15px;border:1px solid rgba(211,167,95,.75);background:rgba(23,14,8,.72);color:var(--gold);font-size:12.5px;line-height:28px;cursor:pointer}'
    +'.rn-btn.on{border-color:#9fb6e0;color:#d7e4ff;background:rgba(30,40,64,.82)}'
    +'@media (prefers-reduced-motion:reduce){#homeLowena .rs-window .rs-rain{animation:none}}';
  document.head.appendChild(css);
  LQ.on('screen:after',function(s){ if(s==='home') try{ paint(); }catch(e){ LQ.err(e); } });
  setTimeout(function(){ try{ paint(); }catch(e){ LQ.err(e); } },600);
})();
