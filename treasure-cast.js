/* 이번 달 이벤트를 모두 완료하면: 보물을 건네받는 그림이 팝업으로 뜬다 */
(function(){
var MSG_M=[
 '이번 달의 보물이 도착했어요. 제가 손으로 받아 뒀으니 당신 몫이에요.\n끝까지 해낸 사람만 받을 수 있는 거예요.',
 '어머, 이게 이번 달의 보물이군요! 표지가 조금 낡은 건 그만큼 오래 기다렸다는 뜻이에요.\n한 달 동안 정말 애썼어요.',
 '이벤트를 전부 해냈어요! 책이 꽤 묵직하죠? 당신의 한 달이 그만큼 알찼다는 증거예요.',
 '보물 배달 완료! 반품은 안 돼요. 이건 당신이 직접 벌어들인 거라서요.'];
var MSG_S=[
 '특별 이벤트까지 해냈어요! 이건 아무나 받을 수 있는 보물이 아니에요.',
 '짜잔, 특별 이벤트 보물이 도착했어요. 저도 한 번 만져 봤는데 반짝반짝했어요.',
 '이벤트 완료! 오늘만큼은 마음껏 뿌듯해해도 돼요.'];
var last=-1;
function pickMsg(a){ var i=Math.floor(Math.random()*a.length); if(i===last&&a.length>1) i=(i+1)%a.length; last=i; return a[i]; }
function esc2(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

document.body.insertAdjacentHTML('beforeend','<div id="evGive"></div>');
window.evGiveClose=function(){ var o=document.getElementById('evGive'); if(!o) return; o.classList.remove('in'); setTimeout(function(){ o.classList.remove('show'); o.innerHTML=''; },350); };
window.evGiveGo=function(){ evGiveClose(); try{ showScreen('treasure'); }catch(e){ LQ.err(e); } };
function open(e,preview){
  var o=document.getElementById('evGive'); if(!o) return;
  var img=''; try{ img=LW_FACES.give.s; }catch(x){ LQ.err(x); }
  var sp=!!e.sp, gold=0; try{ gold=halfG(e.gold||50); }catch(x){ gold=e.gold||50; }
  o.innerHTML='<div class="eg-card" onclick="event.stopPropagation()"><div class="eg-t">'+(sp?'🎉 특별 이벤트 완료':'🌙 이번 달 이벤트 완료')+'</div>'+(img?'<img src="'+img+'" alt="">':'')+
    '<div class="eg-m">'+esc2(pickMsg(sp?MSG_S:MSG_M))+'</div>'+
    '<div class="eg-r">'+esc2(e.reward||'🎁 이벤트 보상')+' 이(가) 보물함에 들어갔어요'+(preview?'':' · +◈'+gold)+'</div>'+
    '<div class="eg-b"><button class="ghost-btn" onclick="evGiveClose()">닫기</button><button class="gold-btn" onclick="evGiveGo()">보물함 보기</button></div></div>';
  o.onclick=function(){ evGiveClose(); };
  o.classList.add('show'); void o.offsetWidth; o.classList.add('in');
  try{ sfx('ach'); }catch(x){ LQ.err(x); }
}
window.evGivePop=function(e,preview){
  var n=0;
  (function go(){
    var busy=false; try{ busy=!!stampBusy; }catch(x){ LQ.err(x); }
    if(busy&&!preview&&n++<40) return void setTimeout(go,500);
    open(e,preview);
  })();
};
/* 이벤트가 '방금' 완료 처리될 때만 */
var _ec=evCheckClear;
evCheckClear=function(e){ var was=!!e.cleared; var r=_ec.apply(this,arguments); try{ if(!was&&e.cleared) window.evGivePop(e,false); }catch(x){ LQ.err(x); } return r; };
/* 같은 순간에 마티 팝업이 겹쳐 뜨지 않게 */
var _mm=martyMust;
martyMust=function(k){ if(k==='event') return; return _mm.apply(this,arguments); };
})();

/* ===== 보물 탭: 서기관 알레센도의 마법상점 ===== */
(function(){
  var ALS_IMG='assets/cb78f5ee9b.webp';
  var ALS_IMG_SMILE='assets/941fef42af.webp';
  var ALS_SC={"smile":"assets/0525cfd577.webp","hello":"assets/9a0f0029c1.webp","read1":"assets/9527bd2109.webp","read2":"assets/0341a76eb6.webp","sit":"assets/cf1f84b0f4.webp","sort1":"assets/bf4b922b82.webp","sort2":"assets/c52108ffdc.webp","sort3":"assets/c4bb1decef.webp","sort4":"assets/37c256188e.webp","herb":"assets/cd72dca962.webp","brew1":"assets/c3787045d8.webp","brew2":"assets/ed0e7e63d5.webp","potion":"assets/7cb0a587c5.webp","tutor":"assets/31232ab29d.webp","study":"assets/f0e68d6800.webp","ponder":"assets/e360885fb2.webp","worry":"assets/ef3ea157f8.webp","cat1":"assets/161e731d34.webp","cat2":"assets/37c83bf943.webp","res":"assets/f09b47cd34.webp","write":"assets/2d4b05d101.webp","guest":"assets/3101c507a6.webp"};
  window.__als={smile:ALS_SC.smile,face:ALS_IMG_SMILE};
  var rnd=function(a,k){ return LQD.pick(k?'alesendo.'+k:null,a,{who:'alesendo'}); };
  var LINES={
   greet:['어서 와요, 아멜리아. 오늘 새로 들어온 물건이 있어요. 천천히 둘러봐요.','아멜리아, 오셨군요. 차를 준비해 두었어요. 편하게 구경하세요.','어서 와요. 장부는 정리해 두었어요. 필요하시면 언제든 말씀하세요.','오늘도 와 주셨네요. 진열은 이미 마쳤어요. 마음에 드는 게 있는지 살펴보세요.'],
   poor:['골드가 조금 모자라요, 아멜리아. 괜찮아요. 물건은 제가 잘 맡아 둘게요.','조금만 더 모으면 돼요. 서두르지 않으셔도 됩니다.'],
   buy:['{n}, 좋은 선택이에요, 아멜리아. 장부에 정확히 적어 두었어요.','고맙습니다, 아멜리아. 소중히 쓰세요. 기록은 제가 남겨 둘게요.','{n}이(가) 아멜리아에게 갔어요. 잘 어울려요.'],
   use:['{n}, 쓰시는군요. 즐겁게 누리세요, 아멜리아. 아껴 둔 것도 쓸 때가 오는 법이에요.','잘 쓰셨으면 좋겠어요. 쓴 것도 장부에 기억해 둘게요.'],
   pick:['오늘 아침에 들어온 물건이에요. 상태도 좋아요.','오늘 제일 먼저 닦아 둔 물건이에요. 아멜리아 생각이 나서요.','오늘의 추천이에요. 가격은 장부대로예요. 깎아 드리고 싶지만 원칙은 지켜야 해서요.'],
   own:['가지고 계신 보물이에요. 아끼는 것도 좋지만, 가끔은 써 보세요.'],
   used:['다 쓰신 보물들이에요. 좋은 기억으로 남았길 바라요.'],
   ledger:['장부는 제가 직접 적어요. 모든 거래가 여기 남아 있어요.'],
   empty:['진열대가 조금 비었네요. 새 보물은 QUEST MASTER에서 들여올 수 있어요.'],
   gift:['업적은 아멜리아가 쌓아 온 시간의 증거예요. 골드로는 살 수 없는 선물이 여기 있어요.','이 선물들은 진열대에 없어요. 아멜리아가 스스로 열어야 하는 것들이에요.','저는 그저 전달할 뿐이에요. 해낸 건 전부 아멜리아의 몫이고요.']};
  var HID=[{id:'hs_key',name:'🗝️ 알레센도의 낡은 열쇠',price:150,line:'그 열쇠가 어느 문을 여는지는 저도 몰라요. 그래서 더 아껴 두었어요.'},
   {id:'hs_letter',name:'📜 잉크 얼룩 편지',price:300,line:'그 편지의 얼룩은 제 것이에요. 내용은 모두 사실이에요.'},
   {id:'hs_dust',name:'🔮 별가루 든 유리병',price:500,line:'별가루는 밤에만 반짝여요. 밤에 열어 보세요.'}];
  var HID_NEED=10, _say='', _sayTab='', _sc='', _scLast='';
  var SCG={joy:['smile'],greet:['hello','read1','read2','sit','smile'],night:['write','res'],shop:['sort1','sort2'],own:['sort3','sort4'],low:['herb'],mid:['brew1','brew2','potion'],high:['tutor','study'],key:['ponder'],used:['cat2','read1'],ledger:['write','res','sit'],gift:['cat1','hello'],poor:['worry'],buy:['guest','smile'],use:['cat1','smile'],empty:['worry']};
  SCG.shopAll=SCG.greet.concat(SCG.night);
  var TABG={shopAll:1,own:1,used:1,ledger:1,gift:1,low:1,mid:1,high:1,key:1};
  /* 탭마다 알레센도 사진은 하루에 하나로 고정(날짜+탭으로 정해요). 사고·부족 같은 반응 장면만 그때그때 달라요 */
  function scPick(g){ var a=SCG[g]||SCG.greet, k;
    if(TABG[g]){ var d=todayStr()+g, x=5381; for(var i=0;i<d.length;i++) x=((x<<5)+x+d.charCodeAt(i))>>>0; k=a[x%a.length]; _scLast=k; return k; }
    k=a[Math.random()*a.length|0]; if(k===_scLast&&a.length>1) k=a[(a.indexOf(k)+1)%a.length]; _scLast=k; return k; }
  function scFor(tab){ if(tab==='shop'){ var f=FIL.shelf||'all'; return f==='all'?'shopAll':f; } return ({own:'own',used:'used',ledger:'ledger',gift:'gift'})[tab]||'greet'; }
  function esc2(t){ return String(t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function fill(t,n){ return t.replace('{n}',n||'보물'); }
  function unl(){ return (S.achievements||[]).filter(function(a){ return a.unlocked; }).length; }
  function say(t,g){ _say=t; if(g) _sc=scPick(g); }
  
  var GIFTS=[
   {id:'gf_tea',need:3,name:'🍵 알레센도의 찻잔',desc:'따뜻한 차 한 잔과 함께하는 티타임 30분',line:'첫 선물이에요, 아멜리아. 차는 제가 직접 끓였어요. 천천히 드세요.'},
   {id:'gf_book',need:7,name:'📖 서기관의 추천서',desc:'읽고 싶던 책·웹소설을 1시간 마음껏 읽기',line:'이 책은 제가 직접 골랐어요. 아멜리아가 좋아할 것 같았어요.'},
   {id:'gf_ink',need:12,name:'🖋️ 황금 잉크병',desc:'갖고 싶던 작은 사치 하나 (1만 원 이내)',line:'잉크가 반짝이죠? 아멜리아의 업적 장부에 쓰던 잉크예요. 특별히 나눠 드릴게요.'},
   {id:'gf_lamp',need:20,name:'🕯️ 밤샘 서재의 촛불',desc:'좋아하는 것에 푹 빠지는 자유 시간 2시간',line:'이 촛불은 오래 타요. 마음 편히 시간을 보내세요.'},
   {id:'gf_map',need:30,name:'🗺️ 미지의 지도',desc:'가고 싶던 곳으로 떠나는 반나절 외출',line:'지도 한쪽에 제가 남긴 메모가 있어요. 길잡이로 삼아 보세요.'},
   {id:'gf_crown',need:45,name:'👑 서기관의 인장',desc:'나에게 주는 큰 선물 하나 (예산은 내 마음대로)',line:'이건 오래 아껴 둔 거예요. 아멜리아가 해낸 만큼의 무게가 있어요.'}];
  var SHELF=[['low','🪵 일반 진열대',0,60],['mid','🔷 희귀 진열대',60,250],['high','👑 전설 진열대',250,1e12]];
  function shelfOf(r){ for(var i=0;i<SHELF.length;i++){ if(r.price>=SHELF[i][2]&&r.price<SHELF[i][3]) return SHELF[i]; } return SHELF[2]; }
  function gfReady(){ var n=unl(), got=S.giftGot||{}; return GIFTS.filter(function(g){ return n>=g.need&&!got[g.id]; }); }
  function visitLine(){ try{ var v=S.alsV=S.alsV||{d:'',n:0}, td=todayStr(); if(v.d===td) return '';
      var gap=v.d?Math.round((Date.parse(td)-Date.parse(v.d))/864e5):0; v.d=td; v.n++; save();
      var k=v.n===1?'first':(gap>=7?'back':([10,30,50,100].indexOf(v.n)>=0?'visitN':'')); if(!k) return '';
      return LQD.pick('alesendo.'+k,[],{who:'alesendo',cameo:false,vars:{n:v.n,gap:gap}}); }catch(e){ return ''; } }
  function buyLine(nm,pr){ var k=pr>=300?'bigbuy':pr<=20?'smallbuy':'', x=k&&Math.random()<.7?LQD.pick('alesendo.'+k,[],{who:'alesendo',cameo:false}):''; return fill(x||rnd(LINES.buy,'buy'),nm); }
  function head(tab){ var t=(_say&&_sayTab===tab)?_say:'';
    if(!t){ var kk=({shop:'greet',own:'own',used:'used',ledger:'ledger',gift:'gift'})[tab]||'greet'; t=(kk==='greet'&&visitLine())||rnd(LINES[kk],kk); _say=t; _sc=scPick(scFor(tab)); }
    _sayTab=tab; if(!_sc||!ALS_SC[_sc]) _sc=scPick(scFor(tab));
    var L='day'; try{ L=document.getElementById('homeLowena').getAttribute('data-light')||'day'; }catch(e){ LQ.err(e); }
    return '<div class="als-scene" data-light="'+L+'"><img src="'+ALS_SC[_sc]+'" alt="알레센도의 마법상점" draggable="false"><div class="als-tint"></div><div class="als-glow"></div><div class="als-glow g2"></div></div>'
      +'<div class="als-head"><div class="als-pt"><img src="'+(_sc==='smile'?ALS_IMG_SMILE:ALS_IMG)+'" alt="알레센도"></div><div class="als-bub"><b>알레센도 · 서기관</b>'+esc2(t)+'</div></div>'; }
  function tabs(){ var g=gfReady().length; return tabsHTML('tre',[['shop','진열대'],['own','보유'],['used','사용됨'],['gift','선물'+(g?' 🎁':'')],['ledger','장부']]); }
  function row(r){ var t=r.gift?['선물','#e6a0c8']:rwTier(r), st=rwState(r), b, rep='<button class="mini-x rep" style="margin-right:4px;opacity:'+(r.repeatable?1:.4)+'" onclick="toggleRep(\''+r.id+'\')">↻</button>';
    if(st==='used') b='<span class="redeemed">사용됨</span>'; else if(st==='own') b='<button class="ghost-btn" onclick="redeem(\''+r.id+'\')">사용하기</button>';
    else b='<button class="ghost-btn" style="'+((S.gold||0)>=r.price?'':'opacity:.45')+'" onclick="buyReward(\''+r.id+'\')">◈ '+r.price+' 구매</button>';
    return '<div class="treasure-row"><span class="t">'+esc(r.name)+'<small style="color:'+t[1]+';margin-left:6px">'+t[0]+(r.mo?' · 이달의':'')+(r.uses?' · '+r.uses+'회 사용':'')+'</small>'+(r.note?'<div style="font-size:11px;color:#a8b79e;margin-top:3px">'+esc(r.note)+'</div>':'')+'</span><span>'+(st!=='used'&&!r.mo?rep:'')+b+'</span></div>'; }
  function dayIdx(n){ var d=todayStr(), h=0; for(var i=0;i<d.length;i++) h=(h*31+d.charCodeAt(i))>>>0; return h%n; }
  function hiddenHTML(){ var n=unl(), open=n>=HID_NEED, h='<div class="shelf-h">🗝️ 숨겨진 진열장</div>';
    if(!open) h+='<div class="als-lock">'+(n>=HID_NEED-3?'열쇠가 조금 반짝이기 시작했어요. 곧 열릴 것 같아요.':'저 안쪽 진열장에는 열쇠가 필요해요. 아멜리아가 모험을 조금 더 이어 가면 열릴 거예요.')+'</div>';
    else h+=HID.map(function(x){ var have=S.rewards.some(function(r){ return r.id===x.id; }), t=rwTier({price:x.price});
      return '<div class="treasure-row"><span class="t">'+esc(x.name)+'<small style="color:'+t[1]+';margin-left:6px">'+t[0]+' · 숨겨진</small></span><span>'+(have?'<span class="redeemed">보유 중</span>':'<button class="ghost-btn" style="'+((S.gold||0)>=x.price?'':'opacity:.45')+'" onclick="hsBuy(\''+x.id+'\')">◈ '+x.price+' 구매</button>')+'</span></div>'; }).join('');
    return h; }
  /* ===== 진열대 확장: 상시 진열(기본 물건) + 이달의 진열 50개 (계절·달·나의 상태에 따라 매달 바뀜) ===== */
  var POOL_RAW=[
   '🌸 벚꽃 나들이 반나절|150|sp','🧺 공원 피크닉 세트|90|sp','🍓 제철 딸기 디저트|35|sp','🌷 봄꽃 화분 하나|55|sp','🚲 자전거 산책|30|sp','👟 산뜻한 봄 운동화|350|sp','🌿 화사한 봄 셔츠|120|sp','🍵 봄 햇살 아래 티타임|20|sp','📷 봄 사진 출사 반나절|60|sp','🧴 봄맞이 스킨케어 세트|110|sp',
   '🍡 봄 소풍 도시락|45|sp','🌼 들꽃 스케치 산책|25|sp','🛍️ 봄 신상 소품 쇼핑|180|sp','🚆 근교 봄꽃 당일치기|380|sp','🎠 놀이공원 하루|420|sp','🍰 벚꽃 에디션 케이크|40|sp','🐝 꽃 시장 구경|30|sp','🧢 가벼운 봄 모자|70|sp','🏞️ 1박 2일 봄 캠핑|700|sp','🌱 새 화분과 흙 세트|50|sp',
   '🍧 빙수 한 그릇|30|su','🏊 수영장·워터파크|250|su','🍉 수박 한 통|25|su','🕶️ 여름 선글라스|140|su','🧊 아이스 음료 마음껏 하루|35|su','🌊 바다 당일치기|400|su','🏖️ 여름 휴가 3박 4일|1800|su','🍦 젤라토 두 스쿱|30|su','🎆 야간 축제·불꽃놀이|150|su','🌴 시원한 카페에서 반나절 독서|40|su',
   '🪭 예쁜 손풍기·부채|55|su','🏕️ 계곡 물놀이 나들이|300|su','🥤 여름 한정 에이드 탐방|45|su','🩴 시원한 샌들|110|su','🌙 여름밤 야식 데이|50|su','🛶 카약·서핑 체험|480|su','🌻 해바라기 밭 나들이|180|su','🎬 에어컨 빵빵한 영화관 하루|70|su','🧴 선크림·쿨링 케어 세트|80|su','🍹 루프탑 음료 한 잔|90|su',
   '🍂 단풍 산책|20|au','🍁 단풍 명소 당일치기|380|au','🎃 할로윈 간식 파티|60|au,m10','🕯️ 가을 향 캔들|50|au','🧣 가을 니트·가디건|250|au','☕ 가을 시즌 음료 탐방|40|au','🍠 군고구마·군밤 간식|20|au','📚 가을 독서 하루|30|au','🌰 밤·단감 제철 간식|25|au','🚶 낙엽 길 사진 산책|25|au',
   '🎡 가을 축제 나들이|140|au','🍄 버섯 요리 저녁|110|au','🥧 호박 파이 한 조각|30|au','🏔️ 가을 산행 후 보상 식사|130|au','🧥 가을 재킷|420|au','🍷 가을밤 와인 한 잔|100|au','🎧 가을 감성 플레이리스트 데이|30|au','🪁 가을 소풍 도시락|45|au','🍎 사과 따기 체험|90|au','🏡 가을 1박 2일 펜션 여행|850|au',
   '☕ 따뜻한 핫초코|20|wi','🧤 포근한 장갑·목도리|70|wi','🍲 뜨끈한 전골 저녁|100|wi','🎄 크리스마스 소품|90|wi,m12','🎁 크리스마스 선물 교환|200|wi,m12','🧦 포근한 수면 양말|35|wi','🔥 난로 앞 독서 하루|30|wi','🍊 귤 한 박스|30|wi','❄️ 눈 오는 날 산책|20|wi','⛷️ 스키·보드 하루|600|wi',
   '♨️ 따끈한 온천 반나절|280|wi','🧥 겨울 코트|650|wi','🍰 연말 케이크|45|wi,m12','🕯️ 연말 홈 파티|170|wi,m12','📔 새해 다짐 노트와 다이어리|60|wi,m1','🍜 뜨끈한 라멘 한 그릇|35|wi','🛏️ 전기장판 늦잠 데이|30|wi','🍫 발렌타인 초콜릿 셀프 선물|40|wi,m2','🚂 겨울 바다 기차 여행|420|wi','🌠 연말 소원 하나 이루기|900|wi,m12',
   '☔ 장마철 비 오는 날 커피|30|su,m7','🌕 한가위 송편·전 간식|40|au,m9','🌷 가정의 달 감사 선물|60|sp,m5','🍫 빼빼로 데이 간식|20|au,m11','✏️ 새 학기 기분의 새 플래너|60|sp,m3',
   '☕ 새 머그컵|45|cafe','🥐 브런치 카페 하루|90|cafe','🍮 디저트 카페 투어|110|cafe','🫖 새 티팟·티세트|150|cafe','🎂 홀케이크 한 판|180|cafe','📘 카페·바리스타 책 한 권|40|cafe','🥛 좋은 우유·시럽 재료 세트|65|cafe','🫘 스페셜티 원두 시음 세트|120|cafe','🎨 카페 무드보드 문구 세트|55|cafe','🪴 카페 분위기 화분|75|cafe','🗺️ 로컬 카페 하루 탐방|300|cafe',
   '🧦 러닝 양말·운동복|90|body','🥗 건강한 한 끼|50|body','💪 프로틴·간식 세트|70|body','🧘 요가·필라테스 체험|180|body','🎾 근육 이완 마사지볼|55|body','🏃 대회 참가 자유 이용권|350|body','💆 운동 후 스포츠 마사지|220|body','🧊 냉온찜질 & 스트레칭 도구|60|body','🚴 자전거 라이딩 하루|100|body','⌚ 스마트워치|650|body',
   '🎬 촬영 소품 하나|80|yt','💡 조명 하나|120|yt','📸 삼각대·거치대|60|yt','🖥️ 편집 프로그램 한 달|150|yt','🍿 영상 완성 후 셀프 시사회|30|yt','🍱 촬영 후 맛집 외식|110|yt','🎥 카메라 액세서리|300|yt','🎵 저작권 프리 음원 구독|70|yt','🪄 썸네일 폰트·에셋 구매|50|yt','🎞️ 컷 편집용 새 키보드·단축키 패드|130|yt',
   '🛁 입욕제 세트|35','🧸 작은 인형·굿즈|40','🎮 게임 신작 한 편|450','🍱 편의점 한 끼 풀코스|20','🥤 편의점 신상 음료 탐방|15','📖 새 책 한 권|40','🖼️ 포스터·액자|110','🎼 콘서트 티켓|300','🧩 퍼즐·레고|130','🛒 마트 카트 마음껏 담기 (3만 원)|100',
   '🌙 푹 잔 뒤 늦은 브런치|55','👯 친구와 약속 하루|100','🎳 볼링·오락실|60','🎤 코인노래방 세 곡|15','🍣 초밥 외식|160','🥩 고기 파티|150','🛋️ 쿠션·러그 교체|190','🎨 원데이 클래스|200','📦 택배 깜짝 구매 (2만 원)|60','💤 아무것도 안 하기 데이|50',
   '🚕 택시 타고 귀가|25','🐈 고양이 카페 방문|55','🌌 플라네타리움 관람|60','🏨 호캉스 1박|900','✈️ 짧은 해외여행|2200','🎪 페스티벌 티켓|500','🎮 게임기 새로 장만|1400','🛏️ 좋은 침구 업그레이드|800','🍦 편의점 아이스크림 두 개|15','🧃 좋아하는 과자 한 봉지|15'
  ];
  var POOL=[], POOLBY={};
  POOL_RAW.forEach(function(s,i){ var a=s.split('|'), id='p'+(i<100?(i<10?'00':'0'):'')+i, o={id:id,n:a[0],p:+a[1],t:(a[2]||'').split(',').filter(Boolean)}; POOL.push(o); POOLBY[id]=o; });
  function seasonOf(m){ return m>=3&&m<=5?'sp':m>=6&&m<=8?'su':m>=9&&m<=11?'au':'wi'; }
  function hash32(str){ var h=2166136261>>>0; for(var i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } return h; }
  function pickMonth(ym){
    var m=+ym.slice(5,7), se=seasonOf(m), gold=S.gold||0, un=0, stage=0, done=0, body=0, yt=0;
    try{ un=(S.achievements||[]).filter(function(a){ return a.unlocked; }).length; }catch(e){ LQ.err(e); }
    try{ var cf=S.mainQuests.find(function(q){ return q.id==='cafe'; }); stage=cf?cf.doneStages||0:0; var lab=S.subQuests.find(function(q){ return q.id==='cafelab'; }); done=lab?lab.recipes.filter(function(r){ return !r.archived&&r.status==='COMPLETE'; }).length:0; }catch(e){ LQ.err(e); }
    try{ body=Object.keys(S.bodyDays||{}).length; yt=S.mainQuests.filter(function(q){ return q.type==='youtube'; }).reduce(function(a,q){ return a+(q.videos||0); },0); }catch(e){ LQ.err(e); }
    var poor=gold<100, rich=gold>=1000;
    var cand=[];
    POOL.forEach(function(it){
      var t=it.t, w=0, seas=null, mon=null, st=null;
      t.forEach(function(x){ if(/^(sp|su|au|wi)$/.test(x)) seas=x; else if(/^m\d+$/.test(x)) mon=+x.slice(1); else st=x; });
      if(seas&&seas!==se) return; if(mon&&mon!==m) return;
      if(seas) w=6; else if(st==='cafe') w=(stage>0||done>0)?5:1; else if(st==='body') w=body>=3?5:1; else if(st==='yt') w=yt>0?5:1; else w=3;
      if(mon) w+=10;
      var tier=it.p>=250?'high':it.p>=60?'mid':'low';
      if(poor) w*=(tier==='low'?1.6:tier==='high'?0.4:1); else if(rich) w*=(tier==='high'?2:tier==='low'?0.8:1);
      if(un>=20&&tier!=='low') w*=1.3;
      var r=(hash32(ym+':'+it.id)+1)/4294967297;
      cand.push({id:it.id,tier:tier,key:Math.pow(r,1/w)});
    });
    var q=poor?{low:28,mid:16,high:6}:rich?{low:20,mid:16,high:14}:{low:24,mid:16,high:10}, out=[], left=[];
    ['low','mid','high'].forEach(function(tr){ var L=cand.filter(function(c){ return c.tier===tr; }).sort(function(a,b){ return b.key-a.key; }); out=out.concat(L.slice(0,q[tr])); left=left.concat(L.slice(q[tr])); });
    left.sort(function(a,b){ return b.key-a.key; }); while(out.length<50&&left.length) out.push(left.shift());
    return out.map(function(c){ return c.id; });
  }
  function monthState(){ var ym=todayStr().slice(0,7); if(!S.moShelf||S.moShelf.ym!==ym||!S.moShelf.ids){ S.moShelf={ym:ym,ids:pickMonth(ym),bought:{}}; try{ save(); }catch(e){ LQ.err(e); } } return S.moShelf; }
  function monthItems(){ var m=monthState(); return m.ids.filter(function(id){ return !m.bought[id]; }).map(function(id){ var p=POOLBY[id]; return p?{id:'mo_'+id,pid:id,name:p.n,price:p.p,mo:1,owned:false,redeemed:false,repeatable:false}:null; }).filter(Boolean); }
  function moFind(id){ return monthItems().find(function(x){ return x.id===id; }); }
  window.__moItems=monthItems;
  function shopHTML(){ var items=S.rewards.filter(function(r){ return rwState(r)==='shop'; }).concat(monthItems()).sort(function(a,b){ return a.price-b.price; }), f=FIL.shelf||'all', h='';
    function cnt(k){ return items.filter(function(r){ return shelfOf(r)[0]===k; }).length; }
    h+='<div class="ftabs als-sub">'+[['all','전체'],['low','일반'],['mid','희귀'],['high','전설'],['key','🗝️']].map(function(x){ return '<button class="'+(f===x[0]?'on':'')+'" onclick="shSet(\''+x[0]+'\')">'+x[1]+'</button>'; }).join('')+'</div>';
    if(f==='key') return h+hiddenHTML();
    var list=f==='all'?items:items.filter(function(r){ return shelfOf(r)[0]===f; }), page=pgSlice('tre',list);
    if(f==='all'&&PG.tre===0){ var mm=+todayStr().slice(5,7), se=seasonOf(mm); h+='<div class="als-mo">'+({sp:'🌸',su:'🌊',au:'🍂',wi:'❄️'})[se]+' '+mm+'월의 진열이에요. 이 중 절반은 다음 달에 새 물건으로 바뀌어요.</div>'; }
    if(f==='all'&&items.length){ var pk=items[dayIdx(items.length)], PL=LINES.pick.concat(LQD.get('alesendo.pick')), q=PL[dayIdx(PL.length)];
      h+='<div class="shelf-h">✦ 오늘의 추천</div><div class="als-pick"><div class="k">오늘 입고된 물건</div>'+row(pk).replace('class="treasure-row"','class="treasure-row" style="margin:0"').replace('margin-left:6px','display:block;margin:2px 0 0')+'<div class="q">'+esc2(q)+'</div></div>'; }
    var last=''; page.forEach(function(r){ var s=shelfOf(r); if(f==='all'&&s[0]!==last){ last=s[0]; h+='<div class="shelf-h">'+s[1]+'</div>'; } h+=row(r); });
    if(!list.length&&!items.length&&_sc!=='worry') _sc=scPick('empty');
    if(!list.length) h+='<div class="empty" style="margin-top:8px">'+(items.length?'비어 있어요':esc2(rnd(LINES.empty,'empty')))+'</div>';
    return h+pgHTML('tre',list.length); }
  function giftHTML(){ var n=unl(), got=S.giftGot||{}, tot=(S.achievements||[]).length, ready=gfReady().length;
    var h='<div class="gf-s">✦ 골드로는 살 수 없는 선물이에요. 업적을 해금하면 알레센도가 하나씩 건네줘요.<br>해금한 업적 <b>'+n+'</b> / '+tot+'개'+(ready?' · 🎁 받을 수 있는 선물 <b>'+ready+'</b>개':'')+'</div>';
    return h+GIFTS.map(function(g){ var have=!!got[g.id], can=!have&&n>=g.need, pct=Math.min(100,Math.round(n/g.need*100)), cls='gf-card'+(have?' got':can?' can':'');
      var act=have?'<span class="redeemed">받음 · '+got[g.id]+'</span>':can?'<button class="ghost-btn" onclick="gfClaim(\''+g.id+'\')">🎁 받기</button>':'<span class="redeemed">🔒 '+n+' / '+g.need+'</span>';
      return '<div class="'+cls+'"><div class="top"><span class="t">'+esc(g.name)+'</span><span>'+act+'</span></div><div class="d">'+esc2(g.desc)+'</div>'+(have?'':'<div class="need">업적 '+g.need+'개 해금 시 열려요</div><div class="gf-bar"><i style="width:'+pct+'%"></i></div>')+'</div>'; }).join(''); }
  function ledgerHTML(){ var L=(S.ledger||[]).slice().reverse(), tot=L.reduce(function(a,e){ return a+e.p; },0), P=10, n=Math.max(1,Math.ceil(L.length/P));
    PG.tre=Math.min(PG.tre,n-1); var pg=L.slice(PG.tre*P,PG.tre*P+P);
    return '<div class="led"><div class="s">📒 알레센도의 장부 · 산 보물 '+L.length+'개 · 쓴 골드 ◈ '+tot.toLocaleString()+'</div>'+(pg.map(function(e){ return '<div class="r"><span>'+esc(e.n)+'</span><i>'+e.d+' · ◈'+e.p+'</i></div>'; }).join('')||'<div class="r"><span>아직 적힌 게 없어요.</span></div>')+'</div>'
      +(n>1?'<div class="pager"><button onclick="pgGo(\'tre\',-1,'+n+')">‹</button><span>'+(PG.tre+1)+' / '+n+'</span><button onclick="pgGo(\'tre\',1,'+n+')">›</button></div>':''); }
  window.renderTreasure=function(){ var tab=FIL.tre, body='';
    if(tab==='shop') body=shopHTML(); else if(tab==='ledger') body=ledgerHTML(); else if(tab==='gift') body=giftHTML();
    else { var list=S.rewards.filter(function(r){ return rwState(r)===tab; }).sort(function(a,b){ return (a.price||0)-(b.price||0); });
      body=(pgSlice('tre',list).map(row).join('')||'<div class="empty">여기엔 아직 아무것도 없어요</div>')+pgHTML('tre',list.length); }
    document.getElementById('treasureList').innerHTML=head(tab)+'<div class="gold-bar">◈<span class="kr">골드</span>'+(S.gold||0).toLocaleString()+'</div>'+chestBtn()+tabs()+body; LQ.fire('treasure:rendered');
    try{ var ab=document.getElementById('addRewardBtn'); if(ab) ab.style.display=(tab==='shop')?'':'none'; }catch(e){ LQ.err(e); } };
  window.shSet=function(v){ FIL.shelf=v; PG.tre=0; _sc=scPick(scFor('shop')); renderTreasure(); };
  window.gfClaim=function(id){ var g=GIFTS.find(function(x){ return x.id===id; }); if(!g) return; S.giftGot=S.giftGot||{}; if(S.giftGot[id]) return;
    if(unl()<g.need){ toast('아직 업적이 모자라요'); return; }
    S.giftGot[id]=todayStr(); S.rewards.push({id:g.id,name:g.name,price:0,owned:true,redeemed:false,repeatable:false,gift:true,note:g.desc});
    save(); say(g.line,'joy'); renderTreasure(); try{ lwFaceTemp('give',60000); }catch(e){ LQ.err(e); } toast('🎁 선물 획득! (보유 탭에서 사용해요)'); };
  function gfNotify(){ var fresh=gfReady().filter(function(g){ return !(S.giftSeen||{})[g.id]; }); if(!fresh.length) return;
    S.giftSeen=S.giftSeen||{}; fresh.forEach(function(g){ S.giftSeen[g.id]=1; }); save(); toast('🎁 알레센도의 선물이 준비됐어요! (TREASURE › 선물)'); }
  var _caG=checkAchievements; checkAchievements=function(){ var r=_caG.apply(this,arguments); try{ gfNotify(); }catch(e){ LQ.err(e); } return r; };
  function logBuy(n,p){ (S.ledger=S.ledger||[]).push({ts:Date.now(),d:todayStr(),n:n,p:p}); }
  window.buyReward=function(id){ var r=S.rewards.find(function(x){ return x.id===id; })||moFind(id); if(!r) return;
    if((S.gold||0)<r.price){ say(rnd(LINES.poor,'poor'),'poor'); toast('골드가 부족해요'); renderTreasure(); return; }
    askOk(r.name+' 을(를) '+r.price+'골드에 구매할까요?',function(){ S.gold-=r.price;
      if(r.mo){ S.rewards.push({id:'r'+Date.now(),name:r.name,price:r.price,owned:true,redeemed:false,repeatable:false}); monthState().bought[r.pid]=1; }
      else if(r.repeatable) S.rewards.push({id:'r'+Date.now(),name:r.name,price:r.price,owned:true,redeemed:false,repeatable:false}); else r.owned=true;
      logBuy(r.name,r.price); save(); say(buyLine(r.name,r.price),'buy'); renderTreasure(); renderHome(); try{ lwFaceTemp('give',60000); }catch(e){ LQ.err(e); } toast('보물 획득!'); }); };
  window.hsBuy=function(id){ var x=HID.find(function(h){ return h.id===id; }); if(!x||S.rewards.some(function(r){ return r.id===id; })) return;
    if((S.gold||0)<x.price){ say(rnd(LINES.poor,'poor'),'poor'); toast('골드가 부족해요'); renderTreasure(); return; }
    askOk(x.name+' 을(를) '+x.price+'골드에 구매할까요?',function(){ S.gold-=x.price; S.rewards.push({id:x.id,name:x.name,price:x.price,owned:true,redeemed:false,repeatable:true,hidden:true});
      logBuy(x.name,x.price); save(); say(x.line,'joy'); renderTreasure(); renderHome(); toast('보물 획득!'); }); };
  window.redeem=function(id){ var r=S.rewards.find(function(x){ return x.id===id; }); if(!r) return;
    askOk(r.name+' 을(를) 사용할까요?'+(r.repeatable?'':' (되돌릴 수 없어요)'),function(){ if(r.repeatable) r.uses=(r.uses||0)+1; else r.redeemed=true; save(); checkAchievements();
      var h=HID.find(function(x){ return x.id===r.id; }); say(h?h.line:fill(rnd(LINES.use,'use'),r.name),'use'); renderTreasure(); toast('TREASURE USED'); }); };
  /* 보물 탭에서는 마티는 쉬고, 서기관이 반응한다 */
  var _ms=window.martyShow; window.martyShow=function(){ var sc=document.getElementById('screen-treasure'); if(sc&&sc.classList.contains('active')) return; return _ms.apply(this,arguments); };
  
  window.recToggle=function(){ var b=document.getElementById('recBox'), t=document.getElementById('recBtn'); if(!b) return; var o=b.style.display==='none'; b.style.display=o?'block':'none'; if(t) t.textContent='📒 기록 '+(o?'▴':'▾'); };
  LQ.on('screen:before',function(sn){ if(sn==='treasure'){ _say=''; } });
})();

/* ===== 디저트데이: 3의 배수 날짜(3·6·9…일)에 마티가 알려 줘요 ===== */
(function(){
  var NK=(typeof KEY!=='undefined'?KEY:'lq')+'_dessertann', shown=false;
  var LINES=['오늘은 3의 배수 날짜! 🍰 디저트 먹어도 되는 디저트데이예요! 퀘스트의 \'디저트 규칙\'이 바로 오늘을 말하는 거예요 ✨',
    '띵동~! 마티가 알려 드려요. 오늘은 디저트데이! 죄책감은 두고 맛있게 즐겨요 🧁',
    '오늘 날짜 확인! 3의 배수네요 🎉 다이어트 열심히 한 나에게 주는 달콤한 하루예요 🍮',
    '디저트데이 알림! 오늘은 마음 편히 달콤하게~ 뭐 먹을지 벌써 정했어요? 🍩',
    '짜잔! 3의 배수 날이라 마티가 달려왔어요. 오늘은 디저트 OK! 🍪 (물도 잊지 말고요 💧)'];
  function forced(){ try{ return new URLSearchParams(location.search).get('dessert')==='1'; }catch(e){ return false; } }
  window.isDessertDay=function(){ if(forced()) return true; try{ var d=+todayStr().slice(8,10); return d>0&&d%3===0; }catch(e){ return false; } };
  function canShow(){
    var sp=document.getElementById('splash'); if(sp){ var cs=getComputedStyle(sp); if(cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05) return false; }
    if(document.hidden) return false;
    if(window.lqIsBye&&lqIsBye()) return false;
    if(typeof stampBusy!=='undefined'&&stampBusy) return false;
    if(Date.now()<(window.__mtAutoUntil||0)) return false;
    var on=function(id){ var e=document.getElementById(id); return !!(e&&e.className==='show'); };
    if(on('lowenaPop')||on('martyPop')) return false;
    var mo=document.getElementById('modalOverlay'), ask=document.getElementById('askOv');
    if((mo&&mo.classList.contains('show'))||(ask&&ask.classList.contains('show'))||document.querySelector('.mg-box')) return false;
    var tr=document.getElementById('screen-treasure'); if(tr&&tr.classList.contains('active')) return false;
    return true; }
  function announce(day){
    var t=LQD.pick('marty.dessert',LINES,{who:'marty'}); shown=true;
    if(!forced()){ try{ localStorage.setItem(NK,day); }catch(e){ LQ.err(e); } }
    if(S.settings.martyPop===false){ toast('마티: '+t); return; }
    martyShow('dessert',t);
    var all=document.querySelector('#martyPop .mp-all'); if(all){ all.classList.add('bk'); var mi=all.querySelector('.mp-in'); if(mi) mi.insertAdjacentHTML('beforeend','<i class="mp-bk">🍰</i>'); } }
  var waiting=false;
  function queue(day){ if(waiting) return; waiting=true; var ok=0, n=0;
    (function tick(){ if(++n>1500||todayStr()!==day){ waiting=false; return; }
      ok=canShow()?ok+1:0;
      if(ok>=3){ waiting=false; announce(day); return; }
      setTimeout(tick,1200); })(); }
  function check(){ try{ if(!S||!S.settings||!window.isDessertDay()) return; var day=todayStr();
    if(forced()){ if(shown) return; } else { try{ if(localStorage.getItem(NK)===day) return; }catch(e){ LQ.err(e); } }
    queue(day); }catch(e){ LQ.err(e); } }
  setTimeout(check,3200);
  document.addEventListener('visibilitychange',function(){ if(!document.hidden) setTimeout(check,1800); });
  setInterval(check,30*60*1000);
})();

/* ===== 웰라 & 시나: 카페 여정(404 DRINK BAR) 단계 반응 + CAFÉ LAB 시음 반응 ===== */
(function(){
  var IMG=window.WL_IMG1={"forest": "assets/15bd8f5f3d.webp", "potion": "assets/6abb58f623.webp", "fly": "assets/504437277b.webp", "magic": "assets/dfdf40cb4b.webp"};
  var LAST=-1;
  function esc3(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function pick(a,k,who){ return LQD.pick(k||null,a,{who:who||'wella'}); }
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }

  /* 여정 8단계 (완료한 순서 기준) : 그림, 웰라 대사, 시나 대사, 효과 문구 */
  var ST=[
   {i:'forest',w:'좋았어요, 첫 단계 끝! 컨셉은 확실히 잡혔죠? 벌써 간판에 그릴 그림이 떠올랐어요. 빗자루 타고 후딱 붙이러 갈까요?!',s:'…간판은 아직 없다냥. 진정해.'},
   {i:'potion',w:'남의 가게 메뉴 염탐이라니, 완전 제 취향이에요! 살금살금… 아, 염탐 아니고 견학이에요, 견학!',s:'…염탐 맞잖아.'},
   {i:'potion',w:'드디어 제 시간이에요! 냄비랑 병 전부 꺼내 올게요. 이번엔 폭발 안 시킬 자신 있어요. …아마도요!',s:'…지난번엔 눈썹이 탔다냥.'},
   {i:'magic',w:'숫자는 어렵지만 벌써 반이나 왔어요! 열매는 아껴도 정성은 안 아낀다, 이거 제 신조예요. 하하!',s:'…반환점이다. …잘했어.',fx:'✨ 시나의 눈이 파랗게 빛나요'},
   {i:'forest',w:'우리 가게 얼굴이 생기는 단계네요! 로고에는 별 하나 꼭 넣어요. 제 모자에 있는 것처럼요!',s:'…고양이도 넣어라냥.'},
   {i:'potion',w:'돈 얘기는 서기관님이 더 잘 아시지만… 골드 주머니 지키는 건 자신 있어요! 누가 건드리면 제가 빗자루로 한 방이에요!',s:'…계산은 내가 지켜본다냥.'},
   {i:'fly',w:'자리가 정해졌어요! 하늘에서 내려다보니까 동네가 다 예쁘던데요? 아, 빗자루 타고 답사 다녀왔어요!',s:'…허락도 안 받고 날아갔다냥.'},
   {i:'open',w:'다 됐어요, 이제 문만 열면 돼요! 첫 손님은 제가 모실게요. 서기관님도 오실 거죠?!',s:'…축하한다냥. 진심이다.',fx:'🌙 404 OPEN 준비 완료!',big:true}
  ];
  var OPEN2={title:'🌙 404 DRINK BAR · 첫 손님',img:'latte',big:true,btn:'또 오세요!',fx:'☕ 웰라가 끓인 첫 잔이 나갔어요',
    a:'웰라가 끓인 첫 잔을 받았어요. 정말 맛있어요. 향이 깊고 따뜻하네요. 첫 손님으로서 영광이에요.',
    w:'서기관님이 첫 손님이라니, 영광이에요! 계산은… 어, 오늘은 안 받을게요! 대신 다음엔 친구들 데려와 주세요!',s:'…돈은 받아라냥. 장사는 냉정한 거다.'};
  var GEN={i:'potion',w:'또 한 걸음 나아갔어요! 이 기세면 금방 열겠는데요? 헤헤!',s:'…나쁘지 않다냥.'};

  /* CAFÉ LAB 시음 반응 : 카테고리별 */
  var TA={
   coffee:{i:'roast',w:['으악, 향 진하다! 한 모금… 오, 눈이 번쩍 떠졌어요! 잠이 다 달아났어요!','와, 쌉싸름해요! 어른 맛이 이런 건가 봐요. 저 이제 어른이에요, 어른!'],s:['…냄새만 맡겠다냥. 난 사양.','…한 입만 줘. 아니, 됐다.']},
   nonc:{i:'syrup',w:['달콤하고 부드러워요! 이건 마시는 구름 같아요!','으음~ 이거 계속 마셔도 되는 거죠? 아, 컵이 벌써 비었어요!'],s:['…우유 들어갔으면 한 입만이다냥.','…입가에 묻었다냥.']},
   tea:{i:'jar',w:['숲에서 맡던 풀 냄새가 나요! 이 허브 뭔지 알아요, 맞혀 볼게요… 캐모마일!','따끈해요! 이걸 마시면 발이 나무뿌리처럼 뻗어 나갈 것 같아요!'],s:['…캐모마일 아니다냥. …아닌가.','…뜨거우니까 천천히 마셔.']},
   ade:{i:'focus',w:['톡톡 튀어요! 입안에서 별똥별이 떨어지는 것 같아요!','시원해요! 빗자루 타고 바람 가르는 맛이에요!'],s:['…코에 거품 묻었다냥.','…재채기하지 마라냥.']},
   dessert:{i:'dragon',w:['으아아, 이거 위험해요! 눈이 반짝반짝, 한 입만 더 먹을게요!','이건 반칙이에요! 한 조각인데 왜 이렇게 행복하죠?!'],s:['…이미 세 입째다냥.','…내 몫은 남겨 둬.']},
   any:{i:'toss',w:['한 잔 완성! 제가 제일 먼저 마셔 볼게요. 음… 합격이에요!','좋아요, 좋아요! 이 맛이라면 손님들이 줄 서겠어요!'],s:['…판정은 내가 한다냥. …합격.','…나쁘지 않다냥.']}
  };
  function catOf(c){ c=c||'';
    if(/논커피|non|밀크/i.test(c)) return 'nonc';
    if(/(?:^|[^논])커피|coffee/i.test(c)) return 'coffee';
    if(/에이드|ade|스무디/i.test(c)) return 'ade';
    if(/티|tea/i.test(c)) return 'tea';
    if(/디저트|dessert/i.test(c)) return 'dessert';
    return 'any'; }

  
  document.body.insertAdjacentHTML('beforeend','<div id="wlPop"></div>');
  window.wlDone=function(){ var nx=window._wlNext; window._wlNext=null; wlClose(); if(nx) setTimeout(function(){ window.wlPop(nx); },450); };
  window.wlClose=function(){ var o=document.getElementById('wlPop'); if(!o) return; o.classList.remove('in'); setTimeout(function(){ o.classList.remove('show'); o.innerHTML=''; },350); };
  function open(o){
    var el=document.getElementById('wlPop'); if(!el) return;
    var src=(o.img==='smile'&&window.__als)?window.__als.smile:(IMG[o.img]||(window.WL_IMG2||{})[o.img]||IMG.potion);
    window._wlNext=o.next||null; try{ if(!o.noLog) lqNote('웰라·시나',(o.title||'')+' – '+(o.w||'')); }catch(e){ LQ.err(e); }
    var mg=(o.img==='magic');
    el.innerHTML='<div class="wl-card" onclick="event.stopPropagation()">'+(mg?'':'<div class="wl-t">'+esc3(o.title)+'</div>')+'<img src="'+src+'" alt="">'
      +(o.fx?'<div class="wl-fx">'+esc3(o.fx)+'</div>':'')
      +(o.a?'<div class="wl-b a"><b>알레센도</b>'+esc3(o.a)+'</div>':'')
      +'<div class="wl-b w"><b>웰라</b>'+esc3(lqLaugh(o.w))+'</div><div class="wl-b s"><b>'+(mg?'마법냥이':'시나')+'</b>'+esc3(mg?lqNya(o.s):o.s)+'</div>'
      +'<div class="wl-btn"><button class="gold-btn" onclick="wlDone()">'+esc3(o.btn||'좋아요!')+'</button></div></div>';
    el.onclick=function(){ wlDone(); };
    el.classList.add('show'); void el.offsetWidth; el.classList.add('in');
    try{ sfx(o.big?'ach':'check'); }catch(e){ LQ.err(e); }
  }
  window.wlPop=function(o){
    var n=0;
    (function go(){ var busy=false; try{ busy=!!stampBusy; }catch(e){ LQ.err(e); }
      if(busy&&n++<40) return void setTimeout(go,500);
      open(o); })();
  };

  /* 다음 단계 완료 */
  var _adv=window.advanceStage;
  window.advanceStage=function(id){
    var q=null, before=0; try{ q=S.mainQuests.find(function(m){ return m.id===id; }); before=q?q.doneStages:0; }catch(e){ LQ.err(e); }
    var r=_adv.apply(this,arguments);
    try{ if(on()&&q&&q.type==='stages'&&q.doneStages>before){
      var n=q.doneStages, d=(n<=ST.length&&q.stages.length===ST.length)?ST[n-1]:GEN, nm=q.stages[n-1]||'';
      wlPop({title:(d.big?'🌙 ':'☕ ')+'404 DRINK BAR · '+n+'/'+q.stages.length+' 단계 완료',img:d.i,w:d.w,s:d.s,fx:d.fx||'',big:!!d.big,btn:d.big?'문 열러 가요!':'좋아요!',next:d.big?OPEN2:null});
    } }catch(e){ LQ.err(e); }
    return r; };

  /* 레시피를 COMPLETE로 바꿀 때 시음 */
  var _srf=window.saveRecipeField;
  window.saveRecipeField=function(id,field,val){
    var prev=null, rc=null; try{ rc=findRecipe(id); prev=rc?rc.status:null; }catch(e){ LQ.err(e); }
    var r=_srf.apply(this,arguments);
    try{ if(on()&&field==='status'&&val==='COMPLETE'&&prev!=='COMPLETE'&&rc){
      var lab=S.subQuests.find(function(x){ return x.id==='cafelab'; }), cnt=lab.recipes.filter(function(x){ return !x.archived&&x.status==='COMPLETE'; }).length;
      var t=TA[catOf(rc.cat)], magic=(cnt>0&&cnt%5===0), nm=(rc.name||'이 메뉴');
      wlPop({title:'☕ 시음 타임 · '+nm,img:magic?'magic':t.i,w:pick(t.w,'wella.taste.'+catOf(rc.cat),'wella'),s:pick(t.s,'sina.taste.'+catOf(rc.cat),'sina'),fx:magic?'✨ COMPLETE '+cnt+'개! 시나의 마법이 깨어났어요':'',big:magic,btn:'잘 먹었어요!'});
    } }catch(e){ LQ.err(e); }
    return r; };

  /* 설정: 켜기/끄기 */
  window.setWella=function(v){ S.settings.wellaPop=!!v; save(); toast(v?'웰라와 시나가 놀러 올 거예요 🐈‍⬛':'웰라와 시나는 조용히 있을게요'); };
  LQ.on('master:after',function(){ try{ var e=document.getElementById('wlSel'); if(e) e.value=on()?'1':'0'; }catch(x){ LQ.err(x); } });
})();

/* ===== 알레센도 상점의 카페 재료 코너: 웰라가 재료 상자를 정리해요 ===== */
(function(){
  var FACE='assets/fa2c999a3b.webp';
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  function h(t){ return String(t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function dayHash(){ var d=(typeof todayStr==='function'?todayStr():String(Date.now())), x=0; for(var i=0;i<d.length;i++) x=(x*31+d.charCodeAt(i))>>>0; return x; }
  function lines(){
    var n=(S.pantry||[]).length, lab=null, rc=0;
    try{ lab=S.subQuests.find(function(q){ return q.id==='cafelab'; }); rc=lab?lab.recipes.filter(function(r){ return !r.archived; }).length:0; }catch(e){ LQ.err(e); }
    var pool=[];
    if(!n) pool.push(
      ['재료 창고가 텅 비었어요! 재료 단가를 한 번만 등록해 두면 원가 계산이 훨씬 쉬워져요. 상자 나르는 건 제가 도울게요!','알레센도: "상자 뒤쪽 자리는 비워 두었어요. 웰라가 쓸 수 있게요."'],
      ['아직 등록한 재료가 없네요. 우유, 원두, 시럽… 뭐든 좋아요. 제가 냄새 맡아 보고 신선한지 알려 드릴게요!','시나: "…냄새로 감별하는 건 내 일이다냥."']);
    else pool.push(
      ['재료 '+n+'종 정리 끝! 이 중에 숲에서 본 것 같은 냄새도 있어요. 아, 진짜예요. 저 코 좋거든요!','알레센도: "웰라가 라벨을 붙여 줬어요. 글씨에 힘이 넘치지만 읽는 데 지장은 없어요."'],
      ['재료 상자 '+n+'개 확인 완료! 가격이 바뀌면 재료 창고에서 한 번만 고치면 돼요. 레시피 원가가 자동으로 따라와요!','마법냥이: "…냐앙." (허브 상자 위에서 자고 있어요)']);
    if(rc) pool.push(['메뉴 연구 중인 레시피가 '+rc+'개나 있네요! 저도 시음하러 갈 준비 됐어요. 빗자루 시동 걸어 둘게요!','시나: "…시음은 냄새만 맡겠다냥."']);
    else pool.push(['아직 레시피가 없어요! 첫 레시피 만들면 제가 제일 먼저 시음할 거예요. 약속이에요, 약속!','알레센도: "그 약속은 저도 기억하고 있어요. 웰라가 시음할 날을 기다려요."']);
    return pool.concat(LQD.get('wella.shop')); }
  
  LQ.on('treasure:rendered',function(){
    if(!on()||FIL.tre!=='shop'||(FIL.shelf||'all')!=='all'||PG.tre!==0) return;
    var box=document.getElementById('treasureList'), hd=box&&box.querySelector('.als-head'); if(!hd||box.querySelector('.wl-shop')) return;
    var L=lines(), x=dayHash(), pick=L[x%L.length];
    var el=document.createElement('div'); el.className='wl-shop';
    el.innerHTML='<div class="pt"><img src="'+FACE+'" alt="웰라"></div><div><div class="k">☕ 카페 재료 코너 · 웰라</div><div class="t">'+h(lqLaugh(pick[0]))+'</div><div class="s">'+h(pick[1])+'</div></div>';
    hd.insertAdjacentElement('afterend',el);
  });
})();

/* ===== 웰라 & 시나: 10월 호박 배달 / 쉬는 날 / 접속 종료 인사 ===== */
(function(){
  var IM={"pump": "assets/791b48dbd3.webp", "room": "assets/5bc64bd38c.webp", "tall": "assets/07f51b8a29.webp"};
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  function esc4(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function pk(a,k){ return LQD.pick(k||null,a,{cameo:false}); }
  window.WL_IMG2=IM;
  Object.assign(IM,{jar:'assets/3dd924cfcf.webp',raven:'assets/0aa925430f.webp',roast:'assets/60f604e342.webp',toss:'assets/6f13c1187e.webp',dragon:'assets/99421b0c0e.webp',focus:'assets/a5e689ef71.webp',syrup:'assets/de0d683510.webp',latte:'assets/1f03b9c34c.webp',open:'assets/43178bf77c.webp'});

  /* 1) 10월 한정 이벤트: 웰라의 호박 배달 (하루 한 번) */
  var HW=[
   {w:'호박 배달 왔어요! 밭에서 제일 잘 익은 걸로 골라 왔어요. 아, 빗자루에 좀 부딪혀서 모양이 찌그러졌지만 맛은 똑같아요!',s:'…내가 안 말렸으면 절반은 떨어뜨렸다냥.'},
   {w:'10월이니까 할로윈 준비해야죠! 호박 등불 켜 놓고 밤하늘 한 바퀴 돌고 올게요. 같이 갈래요?',s:'…나는 지붕 위에서 구경만 하겠다.'},
   {w:'오늘 밤은 달이 진짜 예뻐요! 박쥐들이랑 인사하고 왔어요. 다들 저를 알아보더라고요, 헤헤!',s:'…박쥐들이 도망간 거다냥.'},
   {w:'사탕 대신 골드 한 줌이에요! 서기관님이 만든 특제 주머니에 담아 왔어요. 잃어버리면 안 돼요!',s:'…주머니 구멍은 내가 꿰맸다. 감사해라냥.'}];
  var HW31={w:'오늘이 할로윈 밤이에요! 호박 등불 다 켰어요. 소원 빌면 이뤄지는 날이래요. 저는 빗자루 두 개 갖고 싶다고 빌었어요!',s:'…욕심이 과하다냥. …나는 비밀이다.'};
  window.wlHalloween=function(force){
    try{
      if(!force&&!on()) return;
      var t=todayStr(), mm=+t.slice(5,7), dd=+t.slice(8,10);
      if(!force&&mm!==10) return;
      S.hwDay=S.hwDay||{}; if(!force&&S.hwDay[t]) return;
      var big=(dd===31), g=big?30:5, d=big?HW31:pk(HW,'wella.halloween');
      S.hwDay[t]=1; S.gold=(S.gold||0)+g; save(); try{ renderHome(); }catch(e){ LQ.err(e); } try{ renderTreasure(); }catch(e){ LQ.err(e); }
      wlPop({title:'🎃 10월 이벤트 · 웰라의 호박 배달',img:'pump',w:d.w,s:d.s,fx:'🎃 호박 사탕 ◈ +'+g+' 골드',big:big,btn:'고마워요!'});
    }catch(e){ LQ.err(e); }
  };
  setTimeout(function(){ try{ window.wlHalloween(false); }catch(e){ LQ.err(e); } },4500);

  /* 2) 쉬는 날 버튼: 방에서 책 읽는 웰라 */
  var REST=[
   {w:'오늘은 쉬는 날이죠? 좋아요! 저도 침대에서 책 읽을래요. 마법책 말고 그림책이요. 가끔은 마법도 쉬어야 해요!',s:'…푹 쉬어라냥. 오늘은 잔소리 없다.'},
   {w:'쉬는 것도 퀘스트예요! 이불 덮고 뒹굴뒹굴하면 경험치가 쌓이는 거예요, 제가 방금 정했어요!',s:'…그런 규칙은 없다냥. …하지만 인정.'},
   {w:'벽난로 불 피워 놨어요! 따뜻한 차도 끓였고요. 오늘은 아무것도 안 해도 괜찮아요, 진짜예요!',s:'…내 자리는 이불 위다. 비켜 주지 마라냥.'}];
  var _toast=window.toast;
  window.toast=function(m){
    var r=_toast.apply(this,arguments);
    try{ if(on()&&m==='☾ 푹 쉬어요'){ var d=pk(REST,'wella.rest'); wlPop({title:'☾ 쉬는 날 · 웰라의 방',img:'room',w:d.w,s:d.s,btn:'고마워요'}); } }catch(e){ LQ.err(e); }
    return r; };

  /* 3) 접속 종료 인사: 세로 비행 사진 */
  var BYE=[
   {w:'오늘도 수고했어요! 저는 빗자루 타고 하늘 한 바퀴 돌고 잘 거예요. 내일 또 만나요!',s:'…잘 자라냥.'},
   {w:'달이 떴어요! 별똥별 하나 보이면 소원 빌어 봐요. 저는 벌써 세 개 빌었어요, 헤헤!',s:'…소원은 한 번에 하나만이다냥.'},
   {w:'푹 자고 내일도 씩씩하게 만나요! 제가 꿈속 숲에서 기다릴게요!',s:'…이불 잘 덮어라. 감기 걸리지 말고.'}];
  
  var _bye=window.lowenaBye;
  if(typeof _bye==='function') window.lowenaBye=function(){
    var r=_bye.apply(this,arguments);
    try{ if(on()){ var o=document.getElementById('byeScreen'), f=o&&o.querySelector('.by-f'), d=pk(BYE,'wella.bye');
      if(o&&f&&!o.querySelector('.by-w')){ var el=document.createElement('div'); el.className='by-w';
        el.innerHTML='<img src="'+IM.tall+'" alt=""><div><b>웰라</b>'+esc4(d.w)+'<div class="sn"><b>시나</b>'+esc4(d.s)+'</div></div>';
        o.insertBefore(el,f); } } }catch(e){ LQ.err(e); }
    return r; };
})();

/* ===== TREASURE 탭 수다 카드: 마법냥이(시나) & 웰라가 가끔 나타나 잡담해요 ===== */
(function(){
  function on(){ try{ return S.settings.wellaPop!==false; }catch(e){ return true; } }
  function h(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var A=window.WL_IMG1||{}, B=window.WL_IMG2||{};
  /* [그림키, 제목, 웰라, 시나] — 그림키 magic=마법냥이 모드(보라색) */
  var T=[];
  var last=-1, timer=null, tmr2=null;
  function imgSrc(k){ var d=A[k]||B[k]; return d||''; }
  function active(){ var sc=document.getElementById('screen-treasure'); return sc&&sc.classList.contains('active'); }
  function close(){ var e=document.getElementById('trChat'); if(e) e.remove(); }
  function fade(){ var e=document.getElementById('trChat'); if(!e||e.classList.contains('tc-out')) return; e.classList.add('tc-out'); setTimeout(function(){ if(e.parentNode&&e.classList.contains('tc-out')) e.remove(); },1100); }
  function cap(){ var d=todayStr(), c=S.trChatCap; if(!c||c.d!==d) c=S.trChatCap={d:d,n:0}; return c; }
  function show(){
    try{
      if(!on()||!active()||document.getElementById('bnCard')) return;
      /* 로웨나·마티가 떠 있거나 곧 뜰 예정이면 잠시 뒤 다시 */
      var lp=document.getElementById('lowenaPop'), mp=document.getElementById('martyPop'), pd=false; try{ pd=!!_mtPend; }catch(x){ LQ.err(x); }
      if((lp&&lp.classList.contains('show'))||(mp&&mp.classList.contains('show'))||pd){ clearTimeout(window._trRetry); window._trRetry=setTimeout(show,6000); return; }
      if(cap().n>=2) return; /* 하루 최대 2번 */
      if(document.getElementById('askOv')&&document.getElementById('askOv').classList.contains('show')) return;
      var wp=document.getElementById('wlPop'); if(wp&&wp.classList.contains('show')) return;
      close();
      var t=LQD.pick('wella.chat',T,{cameo:false}), magic=t[0]==='magic';
      try{ lqNote(magic?'마법냥이':'웰라',(magic?'':t[1]+' – ')+(t[2]||(magic?lqNya(t[3]):t[3]))); }catch(e){ LQ.err(e); }
      var el=document.createElement('div'); el.id='trChat'; if(magic) el.className='tc-magic';
      el.innerHTML='<img src="'+imgSrc(t[0])+'" alt=""><div class="tc-b">'+(magic?'':'<div class="tc-k">'+h(t[1])+'</div>')+(t[2]?'<div class="tc-w"><b>웰라</b>'+h(lqLaugh(t[2]))+'</div>':'')+(t[3]?'<div class="tc-s"><b>'+(magic?'마법냥이':'시나')+'</b>'+h(magic?lqNya(t[3]):t[3])+'</div>':'')+'</div><button class="tc-x" aria-label="닫기">×</button>';
      el.querySelector('.tc-x').onclick=fade;
      document.body.appendChild(el);
      cap().n++; save();
      clearTimeout(tmr2); tmr2=setTimeout(fade,14000);
    }catch(e){ LQ.err(e); }
  }
  window.trChatNow=show;
  function loop(){ clearTimeout(timer); timer=setTimeout(function(){ if(active()) show(); loop(); },(180+Math.random()*180)*1000); }
  LQ.on('screen:after',function(sn){
    if(sn==='treasure'){ loop(); clearTimeout(window._trFirst); window._trFirst=setTimeout(function(){ if(Math.random()<.6) show(); },(40+Math.random()*50)*1000); } else { close(); clearTimeout(timer); }
  });
  
})();

/* ===== 업적 마일스톤: 90개를 넘기면 마법냥이가, 이후 1개씩 달성할 때마다 넷이 번갈아 알려줘요 ===== */
(function(){
  var ROT=['magic','wella','marty','alesendo'];
  var CH={
   magic:{name:'마법냥이',img:function(){ return (window.WL_IMG1||{}).magic; }},
   wella:{name:'웰라',img:function(){ return 'assets/fa2c999a3b.webp'; }},
   marty:{name:'마티',img:function(){ return MARTY_IMG; }},
   alesendo:{name:'알레센도',img:function(){ return 'assets/941fef42af.webp'; }}};
  function say(who,n){ var left=100-n;
    if(n>=100) return {magic:'…전부 해냈다냥. 100개 전부다. ✨ 웰라도 마티도 알레센도도, 모두 박수 치고 있다.'}[who]||'';
    var T={
     magic:['…마법냥이 모드다냥. ✨ 벌써 {n}개를 해냈다. 남은 건 {left}개뿐이다.','…{n}개째다냥. 별이 하나 더 켜졌다. 남은 건 {left}개.'],
     wella:['와아, {n}개째예요! 빗자루 타고 한 바퀴 돌고 싶은 기분이에요! 이제 {left}개 남았어요, 하하!','벌써 {n}개! 포션 병이 다 반짝이고 있어요. 남은 건 {left}개예요, 조금만 더요!'],
     marty:['조수 마티, 소식 전해요! 업적 {n}개 달성이에요! 남은 건 {left}개, 끝이 보여요 ✨','대단해요, {n}개나 해냈어요! 마티가 제일 먼저 박수 칠게요. 이제 {left}개 남았어요 👏'],
     alesendo:['장부에 기록했습니다. 업적 {n}개 달성이군요. 남은 것은 {left}개입니다.','축하드립니다. {n}번째 업적을 정리해 두었습니다. 이제 {left}개가 남았습니다.']};
    var r=LQD.pick('ach.'+who,T[who]||[],{cameo:false,vars:{n:n,left:left}}); return who==='wella'?lqLaugh(r):r; }
  function free(){ var a=document.getElementById('askOv'), m=document.getElementById('modalOverlay'), w=document.getElementById('wlPop');
    var busy=false; try{ busy=!!stampBusy; }catch(e){ LQ.err(e); }
    return !busy&&!(a&&a.classList.contains('show'))&&!(m&&m.classList.contains('show'))&&!(w&&w.classList.contains('show')); }
  function close(){ var e=document.getElementById('achMile'); if(e) e.remove(); }
  function show(n){
    var t=0; (function go(){ if(!free()&&t++<40) return void setTimeout(go,1000);
      close();
      var who=(n===90||n>=100)?'magic':ROT[(n-90)%4], c=CH[who];
      var o=document.createElement('div'); o.id='achMile'; if(who==='magic') o.className='am-magic';
      var title=n===90?'✨ 업적 90개 달성!':n>=100?'🏆 업적 100개 전부 해금!':'✦ 업적 '+n+'개 달성';
      o.innerHTML='<div class="am-box"><img src="'+c.img()+'" alt=""><div class="am-t">'+title+'</div><div class="am-w"><b>'+c.name+'</b>'+
        (function(x){ return who==='magic'?lqNya(x):x; })(n===90?'…90개를 해냈다냥. ✨ 이제 마지막 10개가 남았다. …끝까지 같이 가 준다.':say(who,n)).replace(/[&<>"]/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x];})+
        '</div><button class="gold-btn" onclick="document.getElementById(\'achMile\').remove()">고마워요</button></div>';
      document.body.appendChild(o);
    })();
  }
  window.achMilestone=function(){
    var idx={}; ACH_ORDER.forEach(function(id){ idx[id]=1; });
    var n=S.achievements.filter(function(a){ return (a.id in idx)&&a.unlocked; }).length;
    if(S.achMile==null) S.achMile=89;
    if(n>S.achMile&&n>=90){ S.achMile=n; save(); show(n); } else if(n>S.achMile){ S.achMile=Math.min(n,89); }
  };
  
})();
