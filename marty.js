/* 마티의 퀘스트창 첫 안내 */
(function(){
var QG_STEPS=[
 '안녕하세요, 마티예요! ✨\n여기는 퀘스트창이에요. 로웨나 님의 모험이 전부 모여 있는 곳이죠.\n서재로 치면 "언젠가 읽을 책" 코너인데, 여긴 먼지 대신 진행 막대가 쌓여 있어서 훨씬 상쾌해요!',
 '위쪽 MAIN QUEST는 오래 걸리는 큰 모험이에요.\n카드를 톡 누르면 자세한 창이 열리고, 카드 안 버튼으로 진행을 올려요. (상환 입력, 영상 완료 +1, 다음 단계 완료 같은 것들이요.)\n막대가 차오르는 걸 보면 은근히 중독돼요. 제가 증인이에요.',
 '아래쪽 SUB QUEST는 일상을 돌보는 작은 모험이에요.\n몸 관리 기록이나 카페 랩 레시피 같은 것들이죠. 몸 관리는 하루에 한 번만 올라가요. 연타해도 소용없어요, 제가 세어 봤거든요!',
 '마지막으로, 막힌 카드가 있으면 서두르지 않아도 돼요.\n퀘스트는 도망가지 않아요. 도망가는 건 저뿐이에요. (책 사이로요.)\n이 안내는 한 번만 나오고, QUEST MASTER 설정에서 언제든 다시 볼 수 있어요. 그럼 모험 잘 다녀오세요!'];
var st=0;
function render(){
  var o=document.getElementById('askOv'); if(!o) return;
  var last=(st>=QG_STEPS.length-1);
  var foot=(last?'':'<button class="ghost-btn" onclick="mqSkip()">건너뛰기</button>')+'<button class="gold-btn" onclick="mqNext()">'+(last?'알겠어요!':'다음')+'</button>';
  o.innerHTML='<div class="ask-box mg-box"><div style="font-size:11px;color:var(--ink-soft);margin-bottom:6px">퀘스트창 안내 · '+(st+1)+' / '+QG_STEPS.length+'</div><div class="mg-row"><img class="mg-img" src="'+MARTY_IMG+'" alt=""><div class="speech-bubble">'+esc(QG_STEPS[st])+'</div></div><div class="mg-foot">'+foot+'</div></div>';
  o.classList.add('show');
}
function close(){ var o=document.getElementById('askOv'); if(o){ o.classList.remove('show'); o.innerHTML=''; } }
window.mqNext=function(){ if(st>=QG_STEPS.length-1){ close(); } else { st++; render(); } };
window.mqSkip=function(){ close(); try{ toast('마티: 필요하면 설정에서 다시 불러 주세요!'); }catch(e){ LQ.err(e); } };
window.martyQuestGuide=function(force){
  try{ S.flags=S.flags||{}; if(!force){ if(S.flags.questGuide) return; S.flags.questGuide=1; save(); } }catch(e){ LQ.err(e); }
  if(force){ try{ closeModal(); }catch(e){ LQ.err(e); } try{ showScreen('quests'); }catch(e){ LQ.err(e); } }
  st=0; render();
};
/* 퀘스트 탭을 처음 열 때 한 번만 */
LQ.on('screen:after',function(s){
  if(s==='quests' && S.settings.martyPop!==false && !(S.flags&&S.flags.questGuide)){
    setTimeout(function(){
      var o=document.getElementById('askOv');
      var mo=document.getElementById('modalOverlay');
      if((o&&o.classList.contains('show'))||(mo&&mo.classList.contains('show'))) return;
      window.martyQuestGuide(false);
    },350);
  }
});
})();

/* 마티의 실시간 반응: 퀘스트탭 성과 / 업적 해금 / 골드 구매 */
(function(){
function add(k,arr){ if(!MT[k]) MT[k]=[]; arr.forEach(function(x){ MT[k].push(x); }); }
add('ach',[
 '새 업적 달성! 벽에 걸어 두고 싶어요. 액자는 제가 준비할게요 🖼️',
 '해금 완료! 업적 서랍이 조금 더 묵직해졌어요 🏆',
 '업적은 원래 "어, 벌써?" 하고 찾아오는 거예요. 축하해요! 🎊',
 '전설에 한 줄이 추가됐어요. 이건 자랑해도 돼요. 저는 이미 서재에 소문냈어요 📣',
 '오늘의 당신, 반짝반짝했어요. 제 눈이 부실 정도로요 ✨']);
var Q={
 debt:['{n}원 상환! 빚이 살짝 도망갔어요. 다음엔 꼬리까지 잡아요 🪽',
  '통장이 "아야" 했지만 미래의 당신은 "고마워"라고 했어요 💸',
  '{n}원만큼 마음이 가벼워졌어요. 깃털로 치면 몇 개일까요? 🪶',
  '갚는 사람은 멋져요. 저는 갚을 게 이슬 한 방울뿐이라 부러울 지경이에요 💧',
  '숫자가 줄어드는 소리, 들려요? 사각사각… 제 귀엔 박수 소리로 들려요 👏'],
 debtZero:['빚 제로예요! 마티 지금 책장 위에서 꽃가루 뿌리는 중이에요 🎉',
  '완전히 갚았어요! 이제 통장이 한숨 대신 콧노래를 불러요 🎶',
  '제로! 저는 계산이 서툴지만 이 숫자만큼은 정확히 알아요. 해냈어요 🏆'],
 video:['영상 +1! 이러다 저를 주연으로 캐스팅하실 것 같아요 🎬',
  '편집을 끝낸 사람의 눈빛은 특별해요. 반짝… 아니 조금 퀭? 그래도 멋져요 ✨',
  '조회수는 몰라도 저는 이미 구독했어요 🔔',
  '감독님, 다음 컷도 준비되셨나요? 저는 조명 담당이에요 💡',
  '영상이 하나 쌓일 때마다 채널이 자라요. 저는 물 주는 요정이고요 🌱'],
 stage:['한 단계 돌파! 간판이 살짝 웃은 것 같아요 🏠',
  '벽돌 한 장이 올라갔어요. 저는 감독처럼 고개를 끄덕이는 중이에요 🧱',
  '단계 완료! 오픈 날 첫 손님 자리는 제가 예약할게요 🪑',
  '착착 진행되네요. 이 속도면 개업 떡은 제가 돌릴게요 🍡',
  '로웨나 님의 가게는 이미 제 마음속에서 영업 중이에요 🕯️'],
 body:['오늘도 몸 관리 성공! 몸이 "고마워요" 하고 속삭였어요 💪',
  '실천 기록 완료! 근육이 있다면 지금 박수 치고 있을 거예요 👏',
  '꾸준함 한 칸 추가! 스트레칭 요정 자격증을 드려요 🎓',
  '기록하는 순간 이미 승리예요. 마티 공식 인증! 🏅',
  '저는 몸이 없는 요정이지만, 당신 몸이 좋아하는 소리는 들려요 ✨'],
 recipe:['새 레시피 등록! 실패작도 제가 맛봐 드릴게요… 는 농담이에요, 아마도요 🍳',
  '메뉴판이 두꺼워지고 있어요. 이러다 카페 랩이 별을 따겠어요 ⭐',
  '레시피 하나 추가! 저는 시식 담당이에요. 한 입 크기로요 🍰',
  '아이디어는 반죽 같아서 일단 시작하면 부풀어요 🥖',
  '오, 냄새가 나는 것 같아요. 제 코는 픽셀이지만요 👃'],
 buy:['{name}! 골드는 이렇게 쓰는 거예요. 쌓아 두면 마음만 든든하죠 🛍️',
  '◈{price}골드로 행복을 샀어요. 환불은 안 돼요, 행복은 반품이 안 되거든요 😌',
  '이 정도는 누릴 자격 충분해요. 마티 공식 승인 도장 쾅! 📜',
  '골드 주머니는 가벼워졌지만 마음은 두둑해졌어요 ✨',
  '열심히 모은 골드의 정석적인 마무리예요! 다음 보물도 벌써 눈독 들이고 계시죠? 👀',
  '{name}, 좋은 선택이에요. 저였으면 고르다 하루가 다 갔을 거예요 🤭']
};
function pick(k,vars){ var a=Q[k]; var t=martyPick(a,null,'marty.react.'+k); Object.keys(vars||{}).forEach(function(x){ t=t.split('{'+x+'}').join(vars[x]); }); return t; }
function react(k,vars){
  try{ if(S.settings.martyPop===false) return; }catch(e){ return; }
  var text=pick(k,vars), n=0;
  (function go(){
    var p=document.getElementById('martyPop');
    var busy=(typeof stampBusy!=='undefined'&&stampBusy)||(typeof _mtPend!=='undefined'&&_mtPend)||(p&&p.className==='show');
    if(busy){ if(n++<40) return void setTimeout(go,500); return; }
    martyShow(null,text);
  })();
}
function active(id){ var e=document.getElementById('screen-'+id); return !!(e&&e.classList.contains('active')); }
var entering=false;
/* 탭을 새로 열 때는 스냅샷만 갱신 (다른 탭에서 쌓인 변화에는 반응하지 않기) */
LQ.on('screen:before',function(s){ if(s==='quests'||s==='treasure') entering=true; });
LQ.on('screen:done',function(){ entering=false; });

/* 퀘스트탭 */
function qM(){
  var debt=S.mainQuests.find(function(m){ return m.type==='debt'||m.id==='debt'; });
  var vids=S.mainQuests.filter(function(m){ return m.type==='youtube'; }).reduce(function(s,m){ return s+(m.videos||0); },0);
  var stg=S.mainQuests.filter(function(m){ return m.type==='stages'; }).reduce(function(s,m){ return s+(m.doneStages||0); },0);
  var body=S.subQuests.find(function(x){ return x.id==='body'; }), lab=S.subQuests.find(function(x){ return x.id==='cafelab'; });
  return {paid:debt?(debt.original-debt.current):0, zero:!!debt&&debt.current<=0, vids:vids, stg:stg, body:body?(body.progress||0):0, rec:lab&&lab.recipes?lab.recipes.length:0};
}
var qSnap=null, _rq=renderQuests;
renderQuests=function(){
  var r=_rq.apply(this,arguments);
  try{
    var m=qM(), o=qSnap; qSnap=m;
    if(o&&!entering&&active('quests')){
      if(m.zero&&!o.zero) react('debtZero');
      else if(m.paid>o.paid) react('debt',{n:(m.paid-o.paid).toLocaleString()});
      else if(m.stg>o.stg) react('stage');
      else if(m.vids>o.vids) react('video');
      else if(m.body>o.body) react('body');
      else if(m.rec>o.rec) react('recipe');
    }
  }catch(e){ LQ.err(e); }
  return r;
};

/* 레시피 추가는 화면을 다시 그리지 않고 모달을 열기 때문에 따로 감지 */
var _ar=addRecipe2;
addRecipe2=function(name){ var r=_ar.apply(this,arguments); try{ if(active('quests')){ if(qSnap) qSnap.rec=qM().rec; setTimeout(function(){ react('recipe'); },500); } }catch(e){ LQ.err(e); } return r; };

})();
