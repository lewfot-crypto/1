/* ===== core-confess.js : 고해성사, 밀담실 (core.js에서 나눔, 순서 유지) ===== */
/* ===== 고해성사: 로웨나에게 털어놓기 ===== */

var CF_LINES={
 sad:['말해 줘서 고마워요. 오늘은 그 마음이 조금 무거웠겠어요.','슬픈 날은 슬픈 채로 있어도 돼요. 정리하지 않아도 괜찮아요.','그런 일이 있었군요. 여기서 다 듣고 있을게요.','애쓰지 않아도 돼요. 오늘은 쉬어 가는 페이지로 두어요.','쓰는 동안 조금은 덜어졌길 바라요. 무거운 건 이 노트에 두고 가도 돼요.','속상했겠어요. 그 마음이 틀린 게 아니에요.','오늘 하루 잘 버텼어요. 따뜻한 걸 마시고 천천히 쉬어요.','혼자 안고 있지 않아도 돼요. 말이 안 돼도 다시 와서 적어도 좋아요.'],
 lonely:['혼자 있다고 해서 정말 아무도 없는 건 아니에요. 저는 여기 있어요.','오늘 그 허전함, 이유 없이 찾아온 게 아니었을 거예요.','곁에 아무도 없다고 느껴지는 밤도 있죠. 그럴 땐 여기 와도 돼요.','외로움을 말로 꺼내는 것도 꽤 용기가 필요한 일이에요.','조용한 시간이 유독 힘들 때가 있죠. 오늘은 제가 옆에 있을게요.','혼자라는 느낌과 실제로 혼자인 건 다를 때가 많아요. 당신을 아는 사람들이 있어요.','이런 마음도 지나가요. 지금은 그냥 흘려보내도 괜찮아요.','털어놔 줘서 고마워요. 다음에 또 이런 밤이 오면 다시 와요.'],
 angry:['화가 날 만한 일이었나 봐요. 참지 않고 말해 줘서 다행이에요.','그 감정, 틀린 게 아니에요. 잠깐 여기 내려놓고 가요.','억울했겠어요. 오늘은 그 마음 그대로 인정해 줄게요.','화를 낸다고 이상한 사람이 되는 거 아니에요.','속에 쌓아두지 않고 적어 준 것만으로도 잘한 거예요.','누구라도 그 상황이면 화가 났을 것 같아요.','오늘 그 감정은 여기 두고, 몸은 잠깐 쉬어가요.','말해 줘서 고마워요. 조금은 풀렸길 바라요.'],
 anxious:['걱정되는 일이 있었군요. 그 마음도 자연스러운 거예요.','아직 일어나지 않은 일이 자꾸 신경 쓰이는 날이었나 봐요.','불안한 채로도 여기까지 잘 왔어요.','떨리는 마음, 굳이 가라앉히려 애쓰지 않아도 돼요.','걱정을 적어두면 머릿속에서 조금은 덜어지기도 해요.','무슨 일이 있어도 지금 이 순간은 안전해요.','조급해하지 않아도 돼요. 하나씩 가면 돼요.','말해 줘서 고마워요. 오늘 밤은 편히 쉬어요.'],
 dessert:['달콤한 한 입이 하루를 망치지 않아요. 내일은 내일의 페이지예요.','솔직하게 말해 줘서 고마워요. 맛있었길 바라요.','오늘은 그런 날이었나 봐요. 벌점은 없어요.','규칙도 소중하지만 당신이 더 소중해요. 물 한 잔 마시고 넘어가요.','한 번의 디저트로 흐름이 끊기지 않아요. 내일 다시 이어 가면 돼요.','기분이 필요했던 날이었을지도 몰라요. 그래도 괜찮아요.','그 달콤함은 이미 지나갔고, 남은 하루는 여전히 당신 거예요.','만회하려고 애쓰지 않아도 돼요. 평소처럼 지내는 게 가장 좋아요.'],
 joy:['우와, 정말 잘했어요! 같이 기뻐요.','그 순간을 이렇게 적어두다니, 더 오래 기억날 것 같아요.','오늘 하루, 스스로를 칭찬해 줘도 좋을 것 같아요.','듣기만 해도 기분이 좋아지는 이야기네요.','이런 날은 꼭 기록해 둬야 해요. 잘 왔어요.','당신이 해낸 거예요. 축하해요!','작은 기쁨도 소중해요. 나눠줘서 고마워요.','이 기분, 조금 더 오래 간직해도 돼요.'],
 chat:['오늘은 그냥 이야기하고 싶은 기분이었나 봐요. 좋아요.','별일 아니어도 괜찮아요. 그냥 나누는 이야기도 좋으니까요.','오늘 하루는 어땠어요? 저도 궁금했어요.','이렇게 가볍게 얘기해 주는 것도 반가워요.','아무 얘기나 좋아요. 저는 듣는 걸 좋아하거든요.','오늘도 잘 지냈다니 다행이에요.','심심할 땐 언제든 와서 말 걸어도 돼요.','소소한 이야기, 잘 들었어요.'],
 free:['들었어요. 털어놓아 줘서 고마워요.','그런 하루였군요. 여기에 잘 적어 두었어요.','말로 꺼내 놓으면 조금 가벼워지기도 해요. 오늘 어땠는지 알겠어요.','적어 준 이야기, 소중히 간직할게요.','정리되지 않은 말이어도 괜찮아요. 그대로 충분해요.','여기는 언제든 와서 내려놓아도 되는 곳이에요.','오늘도 이야기해 줘서 반가워요.','그랬군요. 조용히 끝까지 들었어요.'],
 qotd:['오늘의 질문에 답해 줘서 고마워요. 이런 것도 당신을 이루는 한 조각이겠죠.','생각해 봐 줘서 고마워요. 이 페이지에 잘 넣어 둘게요.','짧게라도 답해 준 것만으로 충분해요.','이런 질문에 답하는 시간, 저는 꽤 소중하다고 생각해요.','오늘 하루를 돌아보게 해 줘서 저도 좋아요.','당신 생각을 조금 더 알게 됐어요. 반가워요.','이 대답, 나중에 다시 꺼내 보면 재밌을 거예요.']};
var CF_KIND={sad:'슬픈 일',lonely:'외로움',angry:'화남',anxious:'불안',dessert:'디저트',joy:'기쁜 일',chat:'잡담',free:'털어놓기',qotd:'오늘의 질문',hug:'안아주기',mood:'기분 체크인'};
var CF_LABEL={sad:'슬픈 일',lonely:'외로워요',angry:'화가 나요',anxious:'불안해요',dessert:'디저트 먹었어요',joy:'좋은 일 있었어요',chat:'잡담하고 싶어요',free:'그냥 털어놓기'};
var CF_CHIP_KEYS=['sad','lonely','angry','anxious','dessert','joy','chat','free'];
var CF_NEG_LABEL={sad:'속상한',lonely:'외로운',angry:'화가 나는',anxious:'불안한'};
function cfWeekAware(k){ if(!CF_NEG_LABEL[k]) return ''; const t0=Date.parse(todayStr());
  const n=(S.confess||[]).filter(e=>e.k===k&&(t0-Date.parse(e.d))>=0&&(t0-Date.parse(e.d))<7*864e5).length;
  if(![3,5,7].includes(n)) return '';
  return '\n\n이번 주에 벌써 '+n+'번째 '+CF_NEG_LABEL[k]+' 얘기네요. 요즘 마음이 계속 힘든 시기인가 봐요. 혼자 버티지 않아도 돼요. 괜찮다면 가까운 사람이나 상담 전문가에게도 이야기해봐요.'; }
/* 가끔 로웨나 대신 마티가 대타로 답하는 이벤트 */
var MT_CONFESS=['어이쿠, 오늘은 제가 대신 왔어요! 로웨나 님은 옆에서 살짝 쉬는 중이에요 😊','마티가 땜빵 출동! 그래도 진심으로 듣고 있었어요 ✨','로웨나 님 대신 제가 답할게요! 편하게 털어놓은 거 잘 봤어요 🌟','짜잔, 오늘은 마티가 답장 담당이에요! 무슨 얘기든 좋아요 👂','살짝 로웨나 님 몰래 끼어들었어요! 그래도 잘 들었어요 🤫','오늘은 특별히 마티가 답해드릴게요. 잘 하고 있어요! 💪','로웨나 님이 잠깐 자리를 비운 사이, 마티가 왔어요! 힘내요 🎈','깜짝 등장! 마티도 당신 얘기 소중히 들었어요 🍀'];
function cfMartyChance(){ return Math.random()<0.15; }
function martyMascotImg(size){ return '<span class="mascot" style="width:'+size+'px;height:'+size+'px"><img src="'+MARTY_IMG+'" alt="" style="width:'+size+'px;height:'+size+'px;object-fit:contain;display:block;filter:drop-shadow(0 0 6px rgba(243,216,138,.5))"></span>'; }
var _cfChip='';
/* 부정문("힘들지 않았어", "안 우울해")과 부정된 성공("합격 못 했어")을 걷어내고 판별용 문자열을 만든다 */
var CF_NEG3=/잠이\s*안|잠\s*못|못\s*잤|안\s*떠나|떠나지\s*않|싸웠|다퉜|혼났|깨졌|서운|지친|지치|지쳐/;
var CF_NEG2=/안\s*좋|좋지\s*않|재미\s*없|기분\s*(이\s*)?나쁘|나빴|망했|최악|불합격|실패|합격\s*못|성공\s*못|해내지\s*못|떨어졌/;
function cfStripNeg(t){ t=String(t||'');
  var A='화나|화가\\s*나|짜증|우울|슬프|슬퍼|힘들|힘드|불안|걱정|외롭|외로|속상|피곤|지치|지쳤|억울|답답|무섭|괴롭|서럽|싫';
  var B='기쁘|기뻐|행복|즐겁|재미있|재밌|뿌듯|설레|신나|좋|괜찮|편하|나아지|나아졌';
  return t
    .replace(new RegExp('(?:'+A+'|'+B+')[가-힣]{0,2}?지\\s*(?:는|도|가)?\\s*(?:않|못|안)[가-힣]*','g'),' ')
    .replace(new RegExp('안\\s*(?:'+A+'|'+B+')[가-힣]*','g'),' ')
    .replace(/(?:걱정|불안|고민|스트레스)\s*(?:은|는|이|가)?\s*(?:안|없|하나도\s*없)[가-힣]*/g,' ')
    .replace(/(?:합격|성공|해내|해냈)[가-힣]{0,2}\s*(?:못|하지\s*못)[가-힣]*/g,' ')
    .replace(/(?:하나도|전혀|별로)\s*(?:안|않)[가-힣]*/g,' '); }
function cfKind(t,chip){ if(chip) return chip;
  t=String(t||''); var o=t; t=cfStripNeg(t);
  if(/배고|배가\s*고|출출/.test(t)) return 'hungry';
  if(/먹고\s*싶|땡겨|땡기|당겨|당기/.test(t)&&/디저트|케이크|과자|아이스크림|초콜릿|빵|쿠키|마카롱|달달|단\s*거/.test(t)) return 'crave';
  if(/졸려|졸리|피곤|잠\s*와|기운\s*없|지쳤|나른/.test(t)&&!/불안|걱정|우울|슬|속상|화나|짜증/.test(t)) return 'tired';
  var strongNeg=/우울|힘들|속상|눈물|울었|서러|지쳐|외로|불안|걱정|화나|화가\s*나|짜증|억울/.test(t);
  if(!strongNeg&&(/디저트|케이크|과자|아이스크림|초콜릿|쿠키|마카롱|빵(?!\s*터)/.test(t)||(/먹었|먹음/.test(t)&&/달달|단\s*거|단거/.test(t)))) return 'dessert';
  if(/기뻐|기분\s*좋|행복|뿌듯|해냈|성공|합격|축하/.test(t)) return 'joy';
  if(/화나|화가\s*나|짜증|열받|빡치|억울|분해/.test(t)) return 'angry';
  if(/불안|걱정|초조|떨려|긴장/.test(t)) return 'anxious';
  if(/외로|혼자\s*있|아무도\s*없|쓸쓸/.test(t)) return 'lonely';
  if(/슬프|슬퍼|슬펐|슬픔|슬픈|우울|힘들|속상|눈물|울었|서러|지쳐|지친|싸웠|다퉜|서운|혼났/.test(t)||CF_NEG2.test(o)) return 'sad';
  if(/잡담|심심|아무\s*말|그냥\s*얘기/.test(t)) return 'chat';
  return 'free'; }
function cfReply(k){ return LQD.pick('lowena.confess.'+k,CF_LINES[k],{who:'lowena'}); }
/* ============================================================================
   밀담실 (로웨나의 밀담실) — 이 아래가 밀담실 코드 구역이에요. 전부 아래 하나의 IIFE 안에 있어요.
   1) 답장 엔진: 문구 확장 · 주제 사전 · 시간대/요일 문구 · 되묻기 · 후속 질문
   2) 감정 칩 · 타이핑 답장 · 밀담실 전용 화면(촛불 조명 · 표정 · 낮은 배경음)
   3) 연출: 촛불 · 쓰고 태우기 · 숨 고르기 · 말없이 곁에 · 축하/업적 · 힘든 날 보상
   덮어쓰기: cfKind / cfPick / cfSend / cfRoomClose 는 각각 한 곳에서만 정의돼요.
   (마티 보상 화면 연결부 mgPicks / mgRender 만 다른 모듈 함수를 감싸는 훅으로 남아 있어요.)
   ============================================================================ */
(function(){
  var MORE={
    sad:['오늘 얼마나 마음이 쓰였을지 조금은 알 것 같아요.','슬픈 마음도 당신의 일부니까, 억지로 밀어내지 않아도 돼요.','울고 싶으면 울어도 괜찮아요. 여기선 아무도 재촉하지 않아요.','그 일이 작지 않았다는 거, 저는 알아요.','오늘은 나를 다그치지 말고 조용히 있어 줘요.','글로 꺼내 놓은 것만으로 벌써 한 걸음이에요.','마음이 가라앉은 날엔 가라앉은 대로 하루를 보내도 돼요.','힘든 얘기를 꺼내 준 용기, 제가 잘 받았어요.','지금 느끼는 게 전부가 되지는 않을 거예요. 천천히 흘러갈 거예요.','오늘 밤은 따뜻한 이불 속에서 쉬어 가요.','충분히 속상할 만한 일이에요. 스스로를 탓하지 말아요.','조금 쉬어도 세상은 그대로예요. 오늘은 당신 편을 들게요.'],
    lonely:['외로운 마음도 누군가를 그리워한다는 뜻일지 몰라요.','이 시간에 여기 와 줘서 반가워요.','혼자라고 느끼는 순간에도 당신은 충분히 소중해요.','허전한 밤엔 따뜻한 걸 손에 쥐고 있어 봐요.','말 걸어 줘서 고마워요. 저는 언제든 여기 있어요.','누군가에게 안부 한 줄 보내는 것도 좋아요. 부담 없이요.','외로움은 나쁜 게 아니에요. 그저 마음이 온기를 찾는 거예요.','오늘은 저랑 조금 더 이야기해도 좋아요.','조용한 방 안에서도 마음은 닿을 수 있어요.','이런 밤을 지나온 당신이 저는 대단해 보여요.','혼자인 시간도 언젠가 당신을 지켜 주는 시간이 될 거예요.','지금 느끼는 그 쓸쓸함, 적어 두면 조금 가벼워질 거예요.'],
    angry:['화가 난 건 당신이 소중한 걸 지키려 했다는 뜻일 수도 있어요.','그 순간 얼마나 열이 올랐을지 상상이 돼요.','속이 부글부글했겠어요. 여기선 마음껏 말해도 돼요.','참느라 애썼어요. 이제 조금 내려놔도 괜찮아요.','화를 느끼는 것과 화를 내는 건 달라요. 느끼는 건 자연스러워요.','깊게 숨 한 번 쉬고, 물 한 잔 마셔요.','억울한 마음, 제가 알아 줄게요.','그 사람이 어땠든 당신의 감정은 진짜예요.','오늘은 그 일을 곱씹지 말고, 좋아하는 걸 하나 해 봐요.','화가 가라앉을 때까지 기다려 줄게요. 서두르지 않아도 돼요.','이렇게 적어 내려간 것만으로도 화가 조금은 풀렸을지 몰라요.','당신이 이렇게까지 화가 난 데엔 이유가 있을 거예요.'],
    anxious:['생각이 꼬리에 꼬리를 무는 날이었군요.','걱정은 대비하려는 마음이기도 해요. 그래도 오늘은 잠깐 쉬어요.','지금 이 순간, 숨을 천천히 내쉬어 봐요.','해결하지 못한 채로도 오늘 밤은 잘 수 있어요.','걱정의 대부분은 생각보다 작게 끝나곤 해요.','오늘 할 수 있는 건 다 했어요. 나머지는 내일의 몫이에요.','불안한 마음을 적어 두면 머릿속 자리가 조금 생겨요.','지금 당장 답을 내지 않아도 괜찮아요.','떨리는 건 그만큼 중요한 일이라는 뜻이에요.','한 번에 하나씩만 생각해 봐요. 제가 옆에 있을게요.','긴장한 어깨를 한번 내려 볼까요? 후우, 하고요.','당신은 지금까지도 잘 헤쳐 왔어요.'],
    dessert:['맛있게 먹었다면 그걸로 충분해요.','가끔은 달콤함이 위로가 되어 주죠.','즐겁게 먹은 기억도 오늘의 좋은 순간이에요.','오늘은 그냥 맛있었던 날로 남겨 둬요.','먹은 걸 만회하려 하지 않아도 돼요. 내일은 평소처럼요.','한 끼가 당신의 노력을 지우지 않아요.','자신에게 준 작은 선물이었다고 생각해도 좋아요.','솔직하게 적어 준 게 더 멋져요.','맛있는 걸 먹으면 기분이 좋아지는 건 당연해요.','다음엔 뭐가 먹고 싶은지도 궁금해요.','물 한 잔이랑 같이 마무리하면 딱 좋겠어요.','이 정도는 하루의 작은 쉼표예요.'],
    joy:['오늘 정말 빛났겠어요!','그 기쁨, 여기까지 다 느껴져요.','이런 날의 기분은 오래 남았으면 좋겠어요.','열심히 한 만큼 돌아온 거예요.','작은 승리도 승리예요. 박수 보내요!','오늘의 나에게 칭찬 한마디 해 줘요.','기쁜 일을 나눠 주니 저도 신나요.','이 순간을 기억해 두었다가 힘든 날 꺼내 봐요.','웃음이 나는 하루라니, 참 좋아요.','정말 멋져요. 자랑스러워해도 돼요!','좋은 일이 좋은 일을 부르는 법이에요.','오늘은 마음껏 기뻐해도 되는 날이에요.'],
    chat:['오늘 뭐 했는지 더 얘기해 줘도 좋아요.','수다 떠는 시간, 저도 좋아해요.','아무 얘기나 편하게 해요. 듣고 있어요.','별거 없는 하루도 이야기하면 별거가 되죠.','오늘 하루 중 가장 기억에 남는 건 뭐였어요?','이런 소소한 얘기가 하루를 채워 주는 것 같아요.','잡담도 마음을 풀어 주는 좋은 방법이에요.','심심했다면 저랑 놀아요!','오늘의 이야기, 재미있게 들었어요.','언제든 놀러 와요. 문은 늘 열려 있어요.','시시콜콜한 얘기가 제일 정겹죠.','말 걸어 줘서 반가워요. 오늘 컨디션은 어때요?'],
    free:['그렇군요. 천천히 더 말해도 괜찮아요.','정리되지 않아도 돼요. 있는 그대로 적어도 좋아요.','들려줘서 고마워요. 여기서만 조용히 간직할게요.','말하고 나면 마음이 조금 가벼워지곤 해요.','당신의 이야기라면 언제든 들을게요.','굳이 결론을 내지 않아도 괜찮아요.','오늘의 마음을 그대로 두고 가요.','적는 동안 어떤 기분이었는지도 궁금해요.','이 노트는 당신만의 조용한 자리예요.','별말 아니어도 이렇게 와 줘서 좋아요.','마음이 복잡한 날엔 복잡한 대로 적어도 돼요.','한 줄이든 열 줄이든, 저는 다 소중하게 읽어요.'],
    qotd:['이 질문에 대한 당신의 답이 궁금했어요. 들려줘서 고마워요.','같은 질문도 날마다 답이 달라질 거예요. 그래서 기록이 재밌어요.','당신다운 대답이네요.','이런 생각을 하는 사람이구나, 하고 또 알게 됐어요.','오늘의 답은 나중에 좋은 추억이 될 거예요.','솔직하게 답해 줘서 좋아요.','한 줄이어도 마음이 담겨 있어요.','내일은 또 어떤 답이 나올지 기대돼요.']
  };
  Object.keys(MORE).forEach(function(k){ if(!CF_LINES[k]) return; MORE[k].forEach(function(x){ if(CF_LINES[k].indexOf(x)<0) CF_LINES[k].push(x); }); });

  /* 주제 사전: 글에서 이 단어가 보이면 그 얘기에 반응 (문자열=그대로 인용, [단어,표시]=표시 문구 사용) */
  var TOPICS=[
    {w:['엄마','아빠','어머니','아버지',['부모','부모님'],'가족','동생','언니','누나','오빠','남편','아내','할머니','할아버지','시댁'],
     neg:['가까운 사이라서 더 마음이 쓰일 때가 있죠.','가족 일은 마음에 더 오래 남곤 해요.','가까운 사람 일이라 더 무거웠겠어요.'],
     pos:['가까운 사람과 좋은 일이 있으면 하루가 더 따뜻해져요.','그런 순간이 있어서 든든하겠어요.']},
    {w:['친구','지인','단톡','모임','선배','후배'],
     neg:['사람 사이 일은 유독 마음이 쓰이죠.','관계에서 오는 마음은 혼자 정리하기 어려워요.'],
     pos:['좋은 사람이 곁에 있다는 건 든든한 일이에요.','그런 사람들이 있어서 다행이에요.']},
    {w:['남자친구','여자친구','남친','여친','애인','연애','썸',['이별','이별'],['헤어졌','이별'],['헤어지','이별']],
     neg:['마음 가는 사람 일은 유독 크게 느껴져요.','사랑 앞에서는 누구나 흔들려요. 이상한 게 아니에요.'],
     pos:['설레는 마음, 참 예뻐요.','그 마음이 오래 따뜻했으면 좋겠어요.']},
    {w:['회사','직장','상사','팀장','출근','퇴근','야근','알바','업무','동료','사수','거래처',['일이 많','일이 많았던 하루']],
     neg:['일터에서 애쓴 만큼, 오늘은 퇴근하고 푹 쉬어요.','일 생각은 잠깐 내려놓아도 괜찮아요.','열심히 하는 사람일수록 지치기 쉬워요.'],
     pos:['일에서 인정받은 기분이면 힘이 나죠.','애쓴 게 보람으로 돌아왔네요.']},
    {w:['시험','공부','과제','학교','수업','성적','학원','발표','리포트','수행평가',['교수','교수님'],'선생님'],
     neg:['해야 할 게 많으면 마음이 먼저 지쳐요.','완벽하지 않아도 여기까지 온 게 대단해요.','한 번에 하나씩만 해도 충분해요.'],
     pos:['해낸 만큼 자신감도 쌓였을 거예요.','애쓴 시간이 보상받은 느낌이겠어요.']},
    {w:['면접','취업','이직','진로','자격증','이력서','퇴사','승진'],
     neg:['앞날 고민은 누구에게나 무거워요.','답이 안 보이는 시기에도 당신은 앞으로 가고 있어요.'],
     pos:['좋은 방향으로 풀리고 있나 봐요.','그 노력이 길을 열어 줄 거예요.']},
    {w:['몸살','두통','감기','병원','컨디션',['피곤','피곤한 하루'],'배탈'],
     neg:['몸이 보내는 신호일지도 몰라요. 오늘은 무리하지 말아요.','아플 땐 아무것도 안 해도 괜찮아요.'],
     pos:['몸이 가벼우면 마음도 가벼워지죠.']},
    {w:[['못 잤','잠 못 잔 밤'],['못잤','잠 못 잔 밤'],['불면','잠 못 드는 밤'],['잠이 안','잠 못 드는 밤'],['새벽','새벽 시간'],'늦잠'],
     neg:['잠이 모자라면 마음도 더 예민해져요. 오늘은 일찍 쉬어 가요.','오늘 밤은 화면 끄고 천천히 눕는 걸 목표로 해요.'],
     pos:['푹 자고 나면 하루가 달라 보이죠.']},
    {w:['월급','카드값','대출','월세','지출','용돈','적금','돈'],
     neg:['돈 걱정은 마음까지 무겁게 하죠. 오늘은 한 가지만 생각해도 충분해요.','숫자 앞에서는 누구나 불안해져요.'],
     pos:['마음이 한결 놓이겠어요.','차근차근 쌓은 게 보이는 순간이네요.']},
    {w:['강아지','고양이',['반려','반려동물'],'댕댕','냥이'],
     neg:['작은 친구가 마음에 걸리면 더 애틋하죠.'],
     pos:['그 아이 덕분에 웃은 하루였을 것 같아요.','함께 있는 시간이 참 소중하죠.']},
    {w:['게임','운동','산책','요리','독서','영화','드라마','노래','그림','여행'],
     neg:['못 해서 마음에 걸렸다면, 그 마음이 이미 노력이에요.','쉬어 가는 날도 필요해요.'],
     pos:['좋아하는 걸 하는 시간은 참 소중해요.','그런 즐거움이 하루를 채워 주죠.']},
    {w:['날씨','장마',['더워','더운 날'],['추워','추운 날'],['비가','비 오는 날']],
     neg:['날씨가 마음에도 스며들 때가 있어요.'],
     pos:['날씨까지 도와주는 날이네요.']},
    {w:['다이어트','체중','몸무게','외모','뱃살','체형','여드름','피부',['거울','외모'],['살쪘','체중'],['살쪄','체중'],['살찌','체중'],['살이 쪘','체중'],['살 빠','체중']],
     neg:['몸이나 외모에 대한 생각은 유독 오래 마음에 남곤 해요.','거울 속 모습으로 오늘의 나를 판단하지 않아도 돼요.','몸은 오늘도 당신을 데리고 하루를 살아 냈어요.','숫자나 모습보다 당신이 훨씬 커요.'],
     pos:['듣기 좋은 말을 들은 날은 마음도 한결 가벼워지죠.','내 모습이 마음에 든 날, 그 기분 오래 간직해요.','몸과 마음이 편안한 날이네요.']},
    {w:['화해','용서','서먹','냉전',['미안','미안한 마음'],['사과했','사과'],['사과하','사과'],['사과받','사과'],['사과해','사과'],['사과할','사과']],
     neg:['미안한 마음이든 서운한 마음이든, 관계가 걸린 일은 무겁죠.','먼저 말을 꺼내기가 제일 어렵죠.','풀고 싶은 마음이 있다는 것만으로도 이미 애쓰고 있는 거예요.','화해는 서두르지 않아도 돼요. 마음이 정리될 시간이 필요해요.'],
     pos:['마음이 풀려서 다행이에요.','먼저 손을 내밀다니, 쉬운 일이 아닌데 용기 있었어요.','관계가 다시 따뜻해지면 하루가 달라지죠.']},
    {w:['후회','미련',['그때 왜','후회'],['할 걸','후회'],['했어야','후회'],['그러지 말','후회'],['아쉬','아쉬운 마음'],['돌이키','후회'],['되돌리','후회']],
     neg:['그때는 그게 최선이었을 거예요. 지금의 눈으로 보면 달라 보일 뿐이에요.','후회가 남는다는 건 그만큼 진심이었다는 뜻이기도 해요.','지난 일을 되감아 보느라 마음이 무거웠겠어요.','되돌릴 순 없어도, 오늘의 나는 다르게 고를 수 있어요.'],
     pos:['돌아볼 수 있다는 건 그만큼 자랐다는 뜻이에요.','지난 일이 이제는 편해졌나 봐요. 다행이에요.']}
  ];
  var REF={
    neg:['{x}, 마음에 계속 남았나 봐요.','{x}, 꽤 무거웠겠어요.','{x}, 혼자 안고 있었죠. 들려줘서 고마워요.','{x}, 그럴 만해요.'],
    pos:['{x}, 듣기만 해도 기분이 좋아져요!','{x}, 반가운 소식이네요.','{x}, 그 순간이 눈에 그려져요.'],
    neu:['{x}, 잘 들었어요.','{x}, 오늘 마음에 남았군요.','{x}, 조금 더 들려줘도 좋아요.']
  };
  var ACK=['꾹꾹 눌러 쓴 글, 끝까지 다 읽었어요.','길게 적어 준 만큼 마음이 담겨 있네요.','이만큼 털어놓는 것도 쉽지 않았을 텐데, 다 읽었어요.'];
  var NEG_RE=/힘들|지쳐|지쳤|우울|슬퍼|슬프|속상|짜증|화나|화가|불안|걱정|외로|싫|억울|피곤|괴롭|지겹|답답|막막|서러|눈물|울었|무서|스트레스|후회|여전히|아직도/;
  var POS_RE=/좋았|좋아서|기뻐|기쁘|행복|뿌듯|재밌|재미있|즐거|웃었|감사|고마|설레|다행|해냈|성공|합격|축하|나아졌|괜찮아졌|풀렸|편해졌|해결/;

  function pk(arr,key){ return LQD.pick('lowena.cf.'+key,arr,{who:'lowena'}); }
  /* "재밌는 얘기 해줄래요?"처럼 로웨나에게 부탁하는 말은 기쁜 소식이 아니라서 축하하지 않는다 */
  var REQ_RE=/(해|들려|알려|말해|읽어|골라|추천해)\s*(줄래|줄\s*수|주세요|주실|주라|줘(?!서)|줄까|봐(?!서))/;
  function tone(k,t){ if(k==='dessert'||k==='hungry'||k==='tired'||k==='crave') return 'neu'; if(k==='sad'||k==='lonely'||k==='angry'||k==='anxious') return 'neg'; if(k==='joy') return 'pos'; if(REQ_RE.test(t)&&!NEG_RE.test(cfStripNeg(t))) return 'neu'; var st=cfStripNeg(t), n=NEG_RE.test(st)||CF_NEG2.test(t)||CF_NEG3.test(st), p=POS_RE.test(st); return (n&&!p)?'neg':(p&&!n)?'pos':(n&&p)?'neg':'neu'; }
  function topic(t){ var s=cfStripNeg(t).replace(/돈까스|돈가스/g,''), best=null;
    TOPICS.forEach(function(tp,ti){ tp.w.forEach(function(e){ var w=Array.isArray(e)?e[0]:e, i=s.indexOf(w); if(i<0) return;
      var pv=s.charAt(i-1), nx=s.charAt(i+w.length);
      if(w==='돈'&&(/[가-힣]/.test(pv)||/[까가독]/.test(nx))) return;
      if(w==='그림'&&nx==='자') return; if(w==='썸'&&/[머네]/.test(nx)) return;
      if(!best||i<best.i||(i===best.i&&w.length>best.w.length)) best={tp:tp,ti:ti,i:i,w:w,d:Array.isArray(e)?e[1]:null}; }); });
    return best; }
  function timeLine(tn){ var d=kstNow(), h=d.getUTCHours(), dow=d.getUTCDay(), m=d.getUTCMonth();
    if(h<5) return tn==='pos'?'이 시간에도 기분이 좋다니, 좋은 밤이에요.':pk(['이 시간까지 깨어 있었군요. 적어 두었으니 이제 눈 붙여 봐요.','늦은 밤엔 마음이 더 크게 느껴지기도 해요. 오늘은 여기 내려놓고 자요.'],'tm_night');
    if(h<9) return '아침부터 얘기해 줘서 고마워요. 오늘은 조금 가볍게 시작해요.';
    if(dow===1&&tn==='neg') return '월요일이라 더 무거웠을지도 몰라요. 한 주는 아직 길어요, 천천히 가요.';
    if(dow===5&&tn==='pos') return '금요일이라 더 신나죠! 주말이 코앞이에요.';
    if(dow===5&&tn==='neg') return '한 주 버티느라 애썼어요. 주말엔 푹 쉬어요.';
    if((dow===0||dow===6)&&tn==='neg') return '쉬는 날인데도 마음이 편치 않았나 봐요. 오늘은 좀 쉬어요.';
    if(tn==='neg'&&(m===11||m<=1)) return '추운 계절엔 마음도 시릴 때가 있어요. 따뜻하게 지내요.';
    if(tn==='neg'&&m>=6&&m<=7) return '더운 날씨에 더 지치기도 해요. 시원한 물 한 잔 마셔요.';
    return ''; }

  /* ===== 2번: 답장 끝 되묻기 + 며칠 뒤 후속 질문 ===== */
  var FQ={
    neg:['지금 마음은 어느 정도예요? 한 줄만 더 들려줘요.','그 얘기 중에서 제일 마음에 걸린 게 뭐예요?','오늘 하루 중 그나마 괜찮았던 순간이 있었어요?','지금 제일 필요한 건 뭘까요? 쉬는 시간, 위로, 아니면 그냥 들어 주는 것?','오늘 밤 스스로에게 해 주고 싶은 말이 있다면요?'],
    pos:['그 순간, 제일 좋았던 장면이 뭐였어요?','그 소식, 제일 먼저 누구에게 말하고 싶어요?','오늘의 나에게 칭찬 한마디 해 준다면요?'],
    neu:['오늘 하루 어땠는지 한 줄만 더 들려줄래요?','지금 기분을 색깔로 말하면 무슨 색이에요?','오늘 제일 기억에 남는 건 뭐예요?']
  };
  var FU_ACK={
    pos:['그렇게 나아졌다니 제가 다 안심이에요.','좋아졌다니 다행이에요. 잘 견뎠어요.'],
    neg:['아직 마음이 무겁군요. 얘기해 줘서 고마워요.','여전히 힘들 수 있죠. 서두르지 않아도 돼요.'],
    neu:['그 뒤 얘기, 들려줘서 고마워요.','궁금했는데 알려 줘서 고마워요.']
  };
  var FU_KIND={sad:'속상했던 얘기',lonely:'외롭다던 얘기',angry:'화났던 얘기',anxious:'걱정되던 얘기'};
  

  window.cfTone=tone; window.cfPk=pk; window.cfPickQuote=pickQuote; window.cfTopicOf=function(t){ var tp=topic(String(t||'')); return tp?tp.ti:-1; };
  window.cfMeta=function(k,t){ var tn=tone(k,t), tp=topic(t); return {tn:tn, tw: tp?(tp.d?tp.d:tp.w):'', ti: tp?tp.ti:-1}; };
  var TQ=[
    {neg:['그 일에서 제일 마음에 걸리는 사람은 누구예요?','가까운 사람이라 더 말하기 어려웠던 건 뭐예요?'],pos:['그 사람과 있었던 일 중 제일 따뜻했던 장면은요?']},
    {neg:['그 사람에게 정말 하고 싶었던 말이 있다면 뭐예요?','그 일에서 제일 서운했던 순간은 언제였어요?'],pos:['그 사람에게 고맙다고 말해 본 적 있어요?']},
    {neg:['지금 그 사람에게 바라는 게 있다면 뭐예요?','마음이 제일 흔들렸던 순간은 언제였어요?'],pos:['그 순간 어떤 기분이었는지 한 줄만 더 들려줄래요?']},
    {neg:['그 일 중에서 내일 하나만 덜어낼 수 있다면 뭘까요?','오늘 일하면서 그래도 괜찮았던 순간이 있었어요?'],pos:['그 성과, 제일 먼저 누구에게 말하고 싶어요?']},
    {neg:['지금 제일 먼저 손대야 할 건 뭐예요? 하나만요.','오늘 해낸 것 중에 작은 거라도 있다면요?'],pos:['그 결과를 위해 제일 애썼던 부분은 뭐였어요?']},
    {neg:['지금 가장 확실하게 알고 있는 건 뭐예요? 하나만요.','그 고민에서 제일 두려운 건 뭐예요?'],pos:['이 흐름이 이어지면 어떤 모습이 되고 싶어요?']},
    {neg:['몸이 지금 제일 바라는 게 뭘까요? 쉬기, 먹기, 자기?','오늘은 무리하지 않으려면 뭘 내려놓을 수 있을까요?'],pos:['몸이 가벼운 날엔 뭘 하고 싶어져요?']},
    {neg:['잠이 안 올 때 그나마 도움이 됐던 게 있어요?','오늘 밤은 어떻게 하면 조금 편하게 누울 수 있을까요?'],pos:['푹 잔 날엔 하루가 어떻게 달라져요?']},
    {neg:['그 걱정 중에서 오늘 당장 할 수 있는 건 뭐예요? 하나만요.','제일 마음에 걸리는 숫자가 뭐예요?'],pos:['그 안도감, 뭐가 제일 컸어요?']},
    {neg:['그 아이는 지금 어때요?'],pos:['그 아이가 오늘 뭘 했어요? 들려줘요!']},
    {neg:['다시 하고 싶은 마음은 남아 있어요?'],pos:['그걸 할 때 제일 좋은 순간이 언제예요?']},
    {neg:['이런 날 몸과 마음을 달래 주는 게 있어요?'],pos:['이런 날엔 뭘 하고 싶어요?']},
    {neg:['오늘 내 몸이 해 준 일 중에 고마운 게 하나 있다면요?','그 말, 가까운 친구가 나에게 했다면 어떤 기분일까요?'],pos:['그 말을 들었을 때 어떤 기분이었어요?']},
    {neg:['지금 하고 싶은 말이 있다면 한 줄로 쓰면요?','그 일에서 제일 마음에 걸리는 장면은 어디예요?'],pos:['그 말을 하고 나서 마음이 어땠어요?']},
    {neg:['그때의 나에게 한마디 해 준다면요?','지금 할 수 있는 작은 일이 하나 있다면 뭘까요?'],pos:['그 경험에서 배운 게 있다면 뭐예요?']}
  ];
  var FQ_KIND={
    sad:['오늘 마음이 제일 가라앉은 순간이 언제였어요?','지금 스스로에게 뭐라고 말해 주고 싶어요?'],
    lonely:['요즘 안부를 묻고 싶은 사람이 있어요?','지금 곁에 있으면 좋을 게 뭘까요? 사람, 음악, 따뜻한 것?'],
    angry:['그 일에서 제일 억울했던 부분이 뭐예요?','지금 화를 조금 내려놓을 수 있다면 뭐가 도움이 될까요?'],
    anxious:['지금 제일 걱정되는 걸 한 문장으로 쓰면요?','그 걱정 중에서 지금 내 손으로 할 수 있는 건 어느 쪽이에요?'],
    joy:['그 순간 몸으로는 어떤 느낌이었어요? 웃음이 났어요, 가슴이 뛰었어요?']
  };
  window.cfFollowQ=function(k,meta){ if(k==='dessert'||k==='hungry'||k==='crave') return ''; if(Math.random()>(meta.tn==='neg'?.7:.5)) return '';
    var sp=[], ti=meta.ti;
    if(ti!=null&&ti>=0&&TQ[ti]){ var a=TQ[ti][meta.tn==='neg'?'neg':meta.tn==='pos'?'pos':'']; if(a) sp=sp.concat(a); }
    if(FQ_KIND[k]) sp=sp.concat(FQ_KIND[k]);
    if(sp.length&&Math.random()<.8) return pk(sp,'fqs_'+k+'_'+ti);
    return pk(FQ[meta.tn],'fq_'+meta.tn); };
  window.cfFqBox=function(id){ return '<textarea id="cfFa" class="cf-ta" rows="3" placeholder="답하고 싶으면 적어 줘요. 건너뛰어도 괜찮아요." style="margin-top:10px"></textarea><button class="cfb" style="width:100%;margin-top:6px" onclick="cfFollow(\''+id+'\')">답하기</button>'; };
  var endBtns='<div style="display:flex;gap:6px;margin-top:12px"><button class="cfb" style="flex:1" onclick="openConfessLog()">고해 노트 보기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>';
  var bubble=function(txt){ return '<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(txt)+'</div></div>'; };

  /* 같은 자리에서 답하기: 한 번 더 받아 주기 */
  window.cfFollow=function(id){
    var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e||e.fa) return;
    var ta=document.getElementById('cfFa'), a=((ta&&ta.value)||'').trim(); if(!a){ toast('한 줄만 적어 주세요'); return; }
    var r=cfReplyFor(cfKind(a,''),a,1);
    e.fa=a; e.fr=r; save();
    cfShowTyped(bubble(r)+endBtns);
  };

  /* 며칠 뒤 후속 질문 카드 (홈) */
  function fuList(){ var t0=Date.parse(todayStr());
    return (S.confess||[]).filter(function(e){
      if(e.fu||e.k==='hug'||e.k==='mood'||e.k==='qotd') return false;
      var g=(t0-Date.parse(e.d))/864e5; if(!(g>=2&&g<=7)) return false;
      return e.tn==='neg'||!!FU_KIND[e.k]; }); }
  function fuText(e){
    var x=e.tw?String(e.tw).replace(/[“”]/g,'')+' 얘기':(FU_KIND[e.k]||'힘들었다던 얘기');
    var T=['지난번에 '+x+' 들려줬었죠. 그 뒤로 좀 어때요?','며칠 전 '+x+', 계속 마음에 걸렸어요. 요즘은 어때요?',x+', 그 뒤로 조금은 나아졌나요?'];
    return T[(e.ts||0)%3]; }
  function fuPick(){ if(S.cfFuDone===todayStr()) return null; var L=fuList(); if(!L.length) return null; return L[dateHashDay()%L.length]; }
  window.cfFuCard=function(){ try{ var e=fuPick(); if(!e) return '';
    return '<div class="cf-fu" onclick="cfFuOpen(\''+e.id+'\')">💬 로웨나: '+esc(fuText(e))+'</div>'; }catch(err){ return ''; } };
  window.cfFuOpen=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e) return;
    var snip=(e.text||'').length>40?e.text.slice(0,40)+'…':(e.text||'');
    showModal(bubble(fuText(e))+'<div style="font-size:12px;color:var(--ink-soft);font-style:italic;margin-top:8px">'+esc(e.d)+' · “'+esc(snip)+'”</div>'
      +'<textarea id="cfFuTa" class="cf-ta" rows="4" placeholder="지금은 어때요? 한 줄만 적어도 돼요." style="margin-top:10px"></textarea>'
      +'<div style="display:flex;gap:6px;margin-top:8px"><button class="cfb" style="flex:1" onclick="cfFuAnswer(\''+id+'\')">들려줄게요</button><button class="cfb" style="flex:1" onclick="cfFuSkip(\''+id+'\')">건너뛸게요</button></div>'); };
  window.cfFuAnswer=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e||e.fu) return;
    var ta=document.getElementById('cfFuTa'), a=((ta&&ta.value)||'').trim(); if(!a){ toast('한 줄만 적어 주세요'); return; }
    var kk=cfKind(a,''), r;
    { var tn=tone(kk,a); r=pk(FU_ACK[tn],'fu_'+tn)+'\n'+cfReplyFor(kk,a,2); }
    e.fu=Date.now(); e.fua=a; e.fur=r; S.cfFuDone=todayStr(); save();
    cfShowTyped(bubble(r)+endBtns); };
  window.cfFuSkip=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(e){ e.fu='skip'; } S.cfFuDone=todayStr(); save(); closeModal(); };
  window.cfFuLog=function(e){ var h='';
    if(e.fq) h+='<div class="r" style="white-space:pre-line">로웨나: '+esc(e.fq)+'</div>';
    if(e.fa) h+='<div class="t">↳ '+esc(e.fa)+'</div><div class="r" style="white-space:pre-line">로웨나: '+esc(e.fr||'')+'</div>';
    if(e.fu&&e.fu!=='skip'&&e.fua) h+='<div class="m" style="margin-top:6px">며칠 뒤 · 후속 대화</div><div class="t">↳ '+esc(e.fua)+'</div><div class="r" style="white-space:pre-line">로웨나: '+esc(e.fur||'')+'</div>';
    return h; };

  /* --- B) 내 말 되받기 · 반복 주제 기억 --- */
  var TNAME=['가족','사람 관계','연애','직장 일','공부','진로','몸 컨디션','잠','돈','반려동물','취미','날씨','외모·체중','사과·화해','후회'];
  var RFL={
    neg:['“{q}” — 이 말이 마음에 남았어요.','“{q}”라고 적어 줬죠. 그렇게 느꼈군요.','“{q}”, 이 부분을 오래 읽었어요.'],
    pos:['“{q}” — 읽는 저도 기분이 좋아졌어요.','“{q}”, 이 부분이 참 좋아요.'],
    neu:['“{q}” — 이 부분이 기억에 남아요.','“{q}”라고 했죠. 잘 읽었어요.']
  };
  var MEM={
    neg:['이번 달에만 {x} 얘기가 벌써 {n}번째예요. 계속 마음에 걸리는 일인가 봐요.','{x} 얘기가 이번 달에 {n}번째 나왔어요. 혼자 오래 안고 있지 않았으면 해요.'],
    pos:['이번 달 {x} 얘기가 벌써 {n}번째예요. 좋은 흐름이 이어지나 봐요.'],
    neu:['이번 달에 {x} 얘기가 {n}번째 나왔어요. 요즘 자주 마음에 머무는 주제네요.']
  };
  function pickQuote(t){
    var cl=String(t||'').split(/[.!?\n~…]+/).map(function(x){ return x.replace(/[“”"'‘’]/g,'').trim(); }).filter(function(x){ return x.length>=6; });
    var best=null,bs=0;
    cl.forEach(function(c){ if(c.length>30) return;
      var st=cfStripNeg(c), sc=0; if(NEG_RE.test(st)||POS_RE.test(st)||CF_NEG3.test(st)) sc+=2; if(topic(c)) sc+=1; if(c.length>=8&&c.length<=24) sc+=1;
      if(sc>bs){ bs=sc; best=c; } });
    return bs>=2?best:null; }
  function entTi(e){ if(e.ti!=null) return e.ti; if(!e.text) return -1; var tp=topic(e.text); return tp?tp.ti:-1; }
  function topicMemory(tp,tn){
    if(!tp) return ''; try{
      var t0=Date.parse(todayStr()), N=S.cfTopicNote=S.cfTopicNote||{}, key='t'+tp.ti;
      if(N[key]&&(t0-Date.parse(N[key]))<7*864e5) return '';
      var n=(S.confess||[]).filter(function(e){ if(e.k==='hug'||e.k==='mood'||e.k==='qotd') return false;
        var g=t0-Date.parse(e.d); return g>=0&&g<30*864e5&&entTi(e)===tp.ti; }).length;
      if(n<2) return '';
      N[key]=todayStr();
      return pk(MEM[tn],'mem_'+tn).replace('{x}',TNAME[tp.ti]||'이').replace('{n}',n+1);
    }catch(e){ return ''; } }

  window.cfReplyFor=function(k,t,short){
    try{
      t=String(t||''); var tn=tone(k,t), tp=topic(t), long=t.length>=70, base=cfReply(k), first='', mem='', tl='', useBase=true, ack='';
      var q=(!short&&t.length>=14)?pickQuote(t):null, refl=false;
      if(q&&Math.random()<.75){ first=pk(RFL[tn],'rfl_'+tn).replace('{q}',q); refl=true; }
      if(tp){
        var x=(tp.d||tp.w)+' 얘기';
        if(!refl) first=pk(REF[tn],'rf_'+tn).replace('{x}',x);
        var pool=tp.tp[tn==='neg'?'neg':tn==='pos'?'pos':'none'], tls=pool&&pool.length?pk(pool,'tl_'+tp.ti+tn):'';
        var useTL=!!tls&&(long||Math.random()<.6);
        if(useTL) tl=tls;
        useBase=!useTL||long;
      } else if(long&&!short&&!refl){ ack=pk(ACK,'ack'); }
      if(!short) mem=topicMemory(tp,tn);
      var parts=[]; if(first) parts.push(first); if(ack) parts.push(ack); if(mem) parts.push(mem); if(tl) parts.push(tl); if(useBase) parts.push(base);
      var max=long?4:3; while(parts.length>max) parts.splice(parts.length-1,1);
      if(!short&&parts.length<3&&Math.random()<.4){ var tm=timeLine(tn); if(tm) parts.push(tm); }
      if(short) parts=short===2?[parts[0]]:parts.slice(0,2);
      return parts.join('\n');
    }catch(e){ return cfReply(k); }
  };

  /* ---------- 3차: 감정 칩 추가 · 타이핑 답장 · 밀담실 전용 화면 · 마티 축하/업적 · 힘든 날 보상 ---------- */
  /* --- 5) 감정 칩: 배고파요 / 피곤해요 / 디저트 먹고 싶어요 --- */
  CF_KIND.hungry='배고픔'; CF_KIND.tired='피곤함'; CF_KIND.crave='디저트 땡김';
  CF_LABEL.hungry='배고파요'; CF_LABEL.tired='피곤해요'; CF_LABEL.crave='디저트 먹고 싶어요';
  var di=CF_CHIP_KEYS.indexOf('dessert'); CF_CHIP_KEYS.splice(di<0?CF_CHIP_KEYS.length:di,0,'hungry','tired','crave');
  CF_LINES.hungry=['배고픈 건 몸이 보내는 아주 정직한 신호예요. 든든히 챙겨 먹어요.','먼저 뭐든 먹고 오세요. 얘기는 그다음에 들어도 돼요.','배가 고프면 마음도 예민해져요. 맛있는 걸로 채워 줘요.','따뜻한 국물이나 밥 한 공기, 오늘은 그런 게 필요할지도 몰라요.','먹는 걸 미루지 않아도 돼요. 오늘의 나를 챙기는 게 먼저예요.','허기를 참지 않아도 괜찮아요. 천천히 맛있게 먹어요.','배고픔도 소중한 몸의 목소리예요. 잘 들어 줘요.','뭐가 제일 당겨요? 그걸 먹어도 좋아요.','든든히 먹고 나면 기분도 한결 나아질 거예요.','물 한 잔 마시고, 좋아하는 걸로 한 끼 챙겨요.'];
  CF_LINES.tired=['오늘은 많이 지쳤군요. 조금 쉬어도 괜찮아요.','피곤한 날엔 쉬는 것도 하루의 일이에요.','해야 할 일은 잠깐 내려놓고 눈을 붙여 봐요.','몸이 쉬고 싶다고 말하는 거예요. 들어 줘요.','오늘은 최소한만 하고 일찍 쉬어요. 그래도 충분해요.','따뜻한 물 한 잔 마시고 천천히 숨을 쉬어 봐요.','애쓴 하루였나 봐요. 수고했어요.','잠깐이라도 누워 있으면 조금은 나아질 거예요.','피곤할 땐 완벽하지 않아도 돼요.','오늘 밤은 일찍 이불 속으로 들어가요.'];
  CF_LINES.crave=['먹고 싶은 마음, 참 자연스러워요.','달콤한 게 당기는 날도 있죠. 이상한 게 아니에요.','뭐가 제일 먹고 싶어요? 떠올리기만 해도 기분이 좋아지죠.','먹고 싶은 게 있다는 건 오늘의 나를 챙기고 싶다는 뜻일지도 몰라요.','좋아하는 디저트 하나 골라 먹어도 괜찮아요. 오늘의 작은 선물로요.','당기는 마음을 억지로 누르지 않아도 돼요.','맛있게 먹고 나면 기분이 조금은 달라질 거예요.','천천히 음미하면서 먹으면 더 행복해요.','디저트 얘기만 해도 벌써 기분이 좋아지네요.','오늘은 먹고 싶은 걸 소중하게 대해 줘요.'];

  /* --- 3) 답장이 한 글자씩 타이핑되듯 --- */
  window.cfTypeIn=function(){ try{
    var b=document.querySelector('#modalBox .speech-bubble'); if(!b||b.__typing) return;
    var full=b.textContent; if(!full) return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    /* 2~3문장씩 쪽으로 나눠 한 쪽씩 타이핑 (bubbles.js 의 LQB.split). 마지막 쪽이 끝나야 아래 버튼들이 보여요 */
    var pages=(window.LQB&&LQB.split(full))||[full], pi=0, box=document.getElementById('modalBox'), row=b;
    while(row.parentNode&&row.parentNode!==box) row=row.parentNode;
    if(pages.length>1&&row.parentNode===box){ row.classList.add('bp-row'); box.classList.add('bp-wait'); }
    var longest=pages.reduce(function(a,c){ return c.length>a.length?c:a; },''); b.textContent=longest; b.style.minHeight=b.offsetHeight+'px';
    b.textContent=''; b.__typing=1; b.__bpOwn=1; b.__typedOnce=1; b.style.cursor='pointer';
    var ch, i, done, fast, tok=0;
    function last(){ return pi>=pages.length-1; }
    function fin(){ if(done) return; done=true; b.textContent=pages[pi];
      if(!last()){ var m=document.createElement('span'); m.className='bp-more'; m.textContent='▼'; b.appendChild(m); }
      else { b.__typing=0; b.style.cursor=''; box.classList.remove('bp-wait'); } }
    function page(){ ch=Array.from(pages[pi]); i=0; done=false; fast=ch.length>140; b.textContent=''; var my=++tok; setTimeout(function(){ step(my); },pi?120:260); }
    b.addEventListener('click',function(){ if(!done) fin(); else if(!last()){ pi++; page(); } });
    function step(my){ if(done||my!==tok) return; if(!b.isConnected){ done=true; return; }
      var c=ch[i++]; b.textContent+=c; if(i>=ch.length){ fin(); return; }
      setTimeout(function(){ step(my); }, /[.!?…~]/.test(c)?(fast?110:190):c==='\n'?(fast?150:260):/[,]/.test(c)?(fast?60:110):(fast?22:38)); }
    page();
  }catch(e){ LQ.err(e); } };
  window.cfShowTyped=function(h){ showModal(h); cfTypeIn(); };

  /* --- 4) 밀담실 전용 화면: 촛불 · 낮은 배경음 · 표정 변화 --- */
  
  var FACE_HI={greet:'어서 와요. 여긴 우리 둘뿐이에요.\n하고 싶은 이야기를 편하게 적어 줘요.',proud:'듣고 있어요. 천천히 적어요.',sad:'괜찮아요. 천천히, 조용히 기다릴게요.',angry:'속에 있는 거, 여기다 다 내려놓아요.',worry2:'숨을 천천히 쉬면서 적어 봐요.',worry:'많이 지쳐 보여요. 편하게 적어요.',smile:'좋은 일이에요? 어서 들려줘요!',laugh:'수다 좋죠! 아무 얘기나 편하게 들려줘요.',listen:'응, 듣고 있어요.\n하고 싶은 말, 천천히 다 해도 돼요.',proud2:'듣고 있어요. 천천히 적어요.'};
  /* 표정은 그대로 두고, 먹는 것과 관련된 칩은 문구만 따로 (다이어트 중인 마음에 맞게) */
  var KIND_HI={crave:'당기는 마음, 여기선 솔직해도 괜찮아요.\n뭐가 먹고 싶은지 편하게 적어 줘요.',dessert:'먹었어도 괜찮아요. 여기선 벌점 없어요.\n오늘 어땠는지 편하게 적어 줘요.',hungry:'배고픔은 몸이 보내는 신호예요.\n어떤 하루였는지 편하게 적어 줘요.'};
  function kindFace(k,tn){ var m={sad:'sad',lonely:'sad',angry:'angry',anxious:'worry2',joy:'smile',dessert:'proud2',crave:'proud2',hungry:'proud2',tired:'worry',chat:'laugh',free:'listen'}; return m[k]||(tn==='neg'?'worry':tn==='pos'?'smile':'proud'); }
  window.cfRoomFace=function(f,k){ var im=document.getElementById('cfFaceImg'); if(!im) return;
    var h=document.getElementById('cfHi'); var tx=(k&&KIND_HI[k])||FACE_HI[f]; if(h&&tx) h.textContent=tx;
    if(im.dataset.f===f) return; im.dataset.f=f; im.style.opacity=0;
    setTimeout(function(){ im.src=LW_CROP[f]||LW_CROP.greet; im.style.opacity=1; },180); };
  window.cfRoomTune=function(){ var ta=document.getElementById('cfText'); if(!ta) return; var t=ta.value.trim();
    var bb=document.getElementById('cfBreathBtn'); if(!t&&!_cfChip){ cfRoomFace('greet'); if(bb) bb.classList.remove('cf-pulse'); return; } var k=cfKind(t,_cfChip); cfRoomFace(kindFace(k,cfTone(k,t)),k); if(bb) bb.classList.toggle('cf-pulse',k==='anxious'); };
  var _tt=null; window.cfRoomTuneDeb=function(){ clearTimeout(_tt); _tt=setTimeout(cfRoomTune,350); };
  window.cfPick=function(k){ _cfChip=(_cfChip===k)?'':k; document.querySelectorAll('#cfChips .cfb').forEach(function(e){ e.classList.toggle('on',e.dataset.k===_cfChip); }); if(_cfChip){ var c=g('cfChips'); if(c) c.style.display='none'; } cfMoodLabel(); cfRoomTune(); };
  window.cfMoodLabel=function(){ var b=g('cfMoodBtn'); if(!b) return; var c=g('cfChips'), open=c&&c.style.display!=='none'; b.textContent=(_cfChip?(CF_LABEL[_cfChip]||CF_KIND[_cfChip]||'')+' ✓':'지금 마음은?')+(open?' ▴':' ▾'); };
  window.cfMoodToggle=function(){ var c=g('cfChips'); if(!c) return; c.style.display=(c.style.display==='none')?'flex':'none'; cfMoodLabel(); };
  window.cfMoreToggle=function(){ var c=g('cfMore'), b=g('cfMoreBtn'); if(!c) return; var o=c.style.display==='none'; c.style.display=o?'flex':'none'; if(b) b.textContent='🕯️ 더보기 '+(o?'▴':'▾'); };
  window.cfRoomAfterSend=function(k){ var r=document.getElementById('cfRoom'); if(!r) return;
    var ta=document.getElementById('cfText'); if(ta) ta.value=''; _cfChip='';
    document.querySelectorAll('#cfChips .cfb').forEach(function(e){ e.classList.remove('on'); });
    try{ cfMoodLabel(); }catch(e){ LQ.err(e); } cfRoomFace(kindFace(k,'neu'),k); };

  /* 낮은 배경음: 켜져 있는 배경음악은 작게, 장작 타는 소리를 아주 조용히 */
  var amb=null;
  function ambStart(){ try{ window._roomOn=true; if(!initAudio()) return; applyVol(); stopBgm();
    if(!bgmOn()||amb) return;
    var n=actx.sampleRate*2, buf=actx.createBuffer(1,n,actx.sampleRate), d=buf.getChannelData(0), last=0;
    for(var i=0;i<n;i++){ var w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.5; }
    var src=actx.createBufferSource(); src.buffer=buf; src.loop=true;
    var lp=actx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=380;
    var g=actx.createGain(); g.gain.value=0; g.gain.setTargetAtTime(.10,actx.currentTime,.8);
    src.connect(lp); lp.connect(g); g.connect(master); src.start();
    amb={src:src,g:g,t:null};
  }catch(e){ LQ.err(e); } }
  function ambStop(){ try{ window._roomOn=false; if(actx){ applyVol(); if(bgmOn()) startBgm(); }
    if(!amb) return; var a=amb; amb=null; clearTimeout(a.t);
    a.g.gain.setTargetAtTime(0,actx.currentTime,.25); setTimeout(function(){ try{ a.src.stop(); }catch(e){ LQ.err(e); } },1200);
  }catch(e){ LQ.err(e); } }

  window.openConfess=function(){ _cfChip=''; _burn=false; _burning=false; cfVisit();
    var mo=document.getElementById('modalOverlay'); if(mo) mo.classList.remove('show');
    var r=document.getElementById('cfRoom'); if(!r){ r=document.createElement('div'); r.id='cfRoom'; r.className='cf-room'; document.body.appendChild(r); }
    var chips=CF_CHIP_KEYS.map(function(k){ return '<button class="cfb" data-k="'+k+'" onclick="cfPick(\''+k+'\')">'+(CF_LABEL[k]||CF_KIND[k])+'</button>'; }).join('');
    r.innerHTML='<div class="cf-glow"></div>'+cfCandlesHtml()+''
      +'<button class="cf-x" onclick="cfRoomClose()">나가기</button>'
      +'<div class="cf-inner"><div class="cf-face"><img id="cfFaceImg" data-f="greet" src="'+LW_CROP.greet+'" alt=""></div>'
      +'<div class="cf-hi" id="cfHi">'+esc(FACE_HI.greet)+'</div>'
      +'<div class="cf-tools" id="cfTop" style="flex-wrap:nowrap;width:100%"><button class="cfb" id="cfMoodBtn" onclick="cfMoodToggle()">지금 마음은? ▾</button><button class="cfb" id="cfMoreBtn" onclick="cfMoreToggle()">🕯️ 더보기 ▾</button></div>'
      +'<div style="display:none;flex-wrap:wrap;gap:6px;justify-content:center" id="cfChips">'+chips+'</div>'
      +'<div class="cf-tools" id="cfMore" style="display:none"><button class="cfb" id="cfBurnBtn" onclick="cfBurnToggle()">🔥 쓰고 태우기</button><button class="cfb" id="cfBreathBtn" onclick="cfBreathe()">🌬️ 숨 고르기</button><button class="cfb" onclick="cfSit()">🕯️ 말없이 곁에</button></div>'
      +'<textarea id="cfText" class="cf-ta" rows="6" placeholder="한 줄만 써도 돼요." oninput="cfRoomTuneDeb()"></textarea>'
      +'<button class="cfb" id="cfSendBtn" style="width:100%" onclick="cfSend()">전할게요</button>'
      +'<button class="cfb" style="width:100%" onclick="openConfessLog()">고해 노트 보기</button></div>';
    r.classList.add('show'); document.body.classList.add('cf-room-on'); ambStart(); };
  window.cfRoomClose=function(){ try{ cfSitStop(true); }catch(e){ LQ.err(e); } try{ cfBreathStop(); }catch(e){ LQ.err(e); } _burn=false; _burning=false; document.querySelectorAll('.cf-fire,.cf-embers').forEach(function(e){ e.remove(); }); var r=document.getElementById('cfRoom'); if(r){ r.classList.remove('show'); r.innerHTML=''; }
    document.body.classList.remove('cf-room-on','cf-cele'); _cfChip=''; ambStop(); };

  /* ===== C) 밀담실 연출: 촛불 · 쓰고 태우기 · 숨 고르기 · 말없이 곁에 ===== */
  CF_KIND.sit='곁에 있기';
  
  var g=function(id){ return document.getElementById(id); };
  var _burn=false, _burning=false, _br=null, _sit=null;
  var reduced=function(){ return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches); };

  /* --- 촛불: 이번 주 찾아온 날 수만큼 늘어난다 --- */
  window.cfVisit=function(){ try{ var t=todayStr(), V=S.cfVisits=S.cfVisits||[]; if(V.indexOf(t)<0){ V.push(t); if(V.length>60) V.splice(0,V.length-60); save(); } }catch(e){ LQ.err(e); } };
  function visitDays(){ var t0=Date.parse(todayStr()); return (S.cfVisits||[]).filter(function(d){ var q=t0-Date.parse(d); return q>=0&&q<7*864e5; }).length; }
  window.cfCandlesHtml=function(){ var n=Math.min(7,Math.max(1,visitDays())), P=[[-150,46],[-126,32],[134,58],[-176,40],[158,36],[-100,50],[110,42],[-72,34],[84,44]], c=Math.min(P.length,2+n), h='<div class="cf-candles">';
    for(var i=0;i<c;i++){ var x=P[i][0]; h+=cfPxCandle(P[i][1],i,'calc(50% '+(x<0?'- '+(-x):'+ '+x)+'px)'); }
    return h+'</div>'; };
  /* 도트 촛불 하나 (밀담실 방, 길게 대화하기 화면에서 같이 써요) */
  window.cfPxCandle=function(hh,i,left){ var d=(-(i*0.37)%1.2).toFixed(2);
    return '<i class="cf-pxc" style="left:'+left+';height:'+hh+'px;background-image:url('+pxBody(hh)+')"><b class="cf-pxg" style="background-image:url('+pxSpr().g+');animation-delay:'+d+'s"></b><b class="cf-pxf" style="background-image:url('+pxSpr().f+');animation-delay:'+d+'s;animation-duration:'+(0.72+(i%3)*0.11).toFixed(2)+'s"></b></i>'; };
  /* 도트 촛불: 몸통(높이별)·불꽃(6장 넘김)·빛 무리를 캔버스로 그려 쓴다. 1칸 = 2px */
  var PXC={}, PXS=null;
  function pxCv(w,h){ var c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
  function pxDraw(x,rows,pal,ox){ rows.forEach(function(r,y){ for(var i=0;i<r.length;i++){ var k=r.charAt(i); if(pal[k]){ x.fillStyle=pal[k]; x.fillRect((ox||0)+i,y,1,1); } } }); }
  function pxBody(hp){ if(PXC[hp]) return PXC[hp]; var R=Math.round(hp/2), c=pxCv(11,R), x=c.getContext('2d'), W=['#5a3a22','#fff3d6','#f2e2bb','#e6d1a2','#d4bb86','#b89a66'], f=function(col,y,cl){ x.fillStyle=cl; x.fillRect(col,y,1,1); };
    var y, k;
    for(y=0;y<R-3;y++){ f(2,y,W[0]); f(8,y,W[0]); for(k=1;k<=5;k++) f(2+k,y,W[k]); }
    for(k=3;k<=7;k++){ f(k,0,W[0]); f(k,1,'#fffaea'); } x.clearRect(2,0,1,1); x.clearRect(8,0,1,1); f(2,1,W[0]); f(8,1,W[0]);
    f(3,2,'#fffaea'); f(3,3,'#fffaea'); f(3,4,'#fffaea'); f(6,2,'#f6e8c8'); f(6,3,'#f6e8c8');
    f(2,2,W[1]); f(2,3,W[1]); f(1,2,W[0]); f(1,3,W[0]); f(2,4,W[0]);
    for(k=1;k<=9;k++){ f(k,R-3,k<3||k>7?'#5a3a22':'#f0c860'); f(k,R-2,k===1?'#f0c860':k===9?'#8a5a1c':'#c9973a'); } f(0,R-2,'#5a3a22'); f(10,R-2,'#5a3a22'); for(k=0;k<=10;k++) f(k,R-1,'#4a2a12');
    return PXC[hp]=c.toDataURL(); }
  function pxSpr(){ if(PXS) return PXS;
    var pal={k:'#3a2a1a',w:'#fffbe6',y:'#ffe066',o:'#ff9a2a',r:'#e0531f'},
      F1=['...r...','...o...','..oo...','..oyo..','.oyyo..','.oywyo.','.oywyo.','.oywyo.','..oyo..','...w...','...k...'],
      F2=['....r..','....o..','...oo..','..oyo..','..oyyo.','.oywyo.','.oywyo.','.oywyo.','..oyo..','...w...','...k...'],
      F3=['..r....','...o...','..oo...','..oyo..','.oyyo..','.oywyo.','.oywyo.','..owo..','..oyo..','...w...','...k...'],
      F4=['.......','...r...','...o...','..oyo..','.oyyo..','.oywyo.','.oywyo.','.oywyo.','..oyo..','...w...','...k...'],
      fr=[F1,F2,F1,F4,F3,F2], c=pxCv(7*fr.length,11), x=c.getContext('2d');
    fr.forEach(function(F,i){ pxDraw(x,F,pal,i*7); });
    var g=pxCv(16,16), y=g.getContext('2d');
    for(var a=0;a<16;a++) for(var b=0;b<16;b++){ var dd=Math.round(Math.hypot(a-7.5,b-8.5)*2)/2, al=dd<3.5?.42:dd<5?.28:dd<6.5?.16:dd<8?.07:0; if(al){ y.fillStyle='rgba(255,170,70,'+al+')'; y.fillRect(a,b,1,1); } }
    return PXS={f:c.toDataURL(),g:g.toDataURL()}; }
  window.cfCandleNote=function(){ var n=visitDays(); if(n<2) return ''; return '<div class="cf-note">이번 주에 '+n+'번 찾아와 줬어요. 촛불이 '+(2+Math.min(7,n))+'개예요.'+(n>=7?'\n한 주 내내 와 줬네요.':'')+'</div>'; };

  /* --- 쓰고 태우기: 저장하지 않고 불꽃으로 --- */
  var BURN={neg:['다 태웠어요. 무거운 건 재로 남겨 두고 가요.','타서 사라졌어요. 이제 그 말은 여기에 없어요. 마음도 조금 가벼워졌길 바라요.','꺼내 놓은 것만으로 반은 덜어진 거예요. 나머지는 연기처럼 흩어졌어요.'],
    pos:['기쁜 마음이 불꽃처럼 환하게 타올랐어요. 마음속에는 그대로 남아 있을 거예요.'],
    neu:['조용히 태웠어요. 아무 데도 남지 않았어요.','잘 태웠어요. 하고 싶은 말이 또 생기면 언제든 와요.']};
  window.cfBurnToggle=function(){ if(_burning) return; _burn=!_burn; var b=g('cfBurnBtn'), ta=g('cfText'), sb=g('cfSendBtn'), pv=g('cfPriv');
    if(b) b.classList.toggle('on',_burn); if(ta) ta.placeholder=_burn?'적고 나면 태워 줄게요. 어디에도 남지 않아요.':'한 줄만 써도 돼요.';
    if(sb) sb.textContent=_burn?'🔥 태울게요':'전할게요'; if(pv) pv.textContent=_burn?'태운 글은 어디에도 저장되지 않아요.':'쓴 글은 이 기기에만 저장돼요.'; };
  window.cfSend=function(){ if(_burn) return cfBurnSend(); const t=(document.getElementById('cfText').value||'').trim(); if(!t){ toast('한 줄만 적어 주세요'); return; }
  const k=cfKind(t,_cfChip); let r, full, by='로웨나', img=mascotImg(56,'cheer'), useMarty=false;
  if(cfMartyChance()&&cfTone(k,t)==='neu'&&k!=='tired'&&k!=='joy'){ useMarty=true; by='마티'; img=martyMascotImg(56); r=MT_CONFESS[Math.floor(Math.random()*MT_CONFESS.length)]; full=r; }
  else { r=cfReplyFor(k,t); full=r+cfWeekAware(k); }
  const eid='cf'+Date.now(); let meta=null, fq=''; try{ if(!useMarty){ meta=cfMeta(k,t); fq=cfFollowQ(k,meta); } }catch(e){ LQ.err(e); }
  let cele=false, hard=false; if(!useMarty){ if(k==='joy'||((k==='free'||k==='chat')&&meta&&meta.tn==='pos')){ cele=true; fq=''; } else if(meta&&(meta.tn==='neg'||k==='tired')) hard=true; }
  (S.confess=S.confess||[]).push({id:eid,ts:Date.now(),d:todayStr(),k:k,text:t,reply:full,by:by,fq:fq||undefined,tn:meta?meta.tn:undefined,tw:(meta&&meta.tw)||undefined,ti:(meta&&meta.ti>=0)?meta.ti:undefined}); save(); try{ cfRoomAfterSend(k); }catch(e){ LQ.err(e); }
  if(!useMarty){ try{ lwFaceTemp(({sad:'sad',lonely:'sad',angry:'angry',anxious:'worry2',joy:'smile',dessert:'smile',crave:'smile',hungry:'smile',tired:'worry'}[k]||'proud'),120000); }catch(e){ LQ.err(e); } } if(!useMarty) _say={text:r,t:Date.now(),mood:'cheer',ttl:120000}; if(!useMarty&&k!=='sad'&&!cele) setTimeout(()=>martyMaybe(.35,'confess'),700);
  cfShowTyped('<div class="mascot-row">'+img+'<div class="speech-bubble" style="white-space:pre-line">'+esc(full)+(fq?'\n\n'+esc(fq):'')+(cele?'\n\n마티를 불러서 같이 축하해도 될까요? 🎉':'')+'</div></div>'+(fq?cfFqBox(eid):'')+(cele?cfCeleBox(eid):'')+(k==='anxious'&&!useMarty?cfBreathBox():'')+'<div style="display:flex;gap:6px;margin-top:12px"><button class="cfb" style="flex:1" onclick="openConfessLog()">고해 노트 보기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>'); };
  function cfBurnSend(){ if(_burning) return; var ta=g('cfText'), t=((ta&&ta.value)||'').trim(); if(!t){ toast('한 줄만 적어 주세요'); return; }
    
    var k=cfKind(t,_cfChip), tn=cfTone(k,t), r=g('cfRoom'), rc=ta.getBoundingClientRect(), fast=reduced();
    _burning=true; ta.readOnly=true; ta.classList.add('cf-burning');
    if(!fast&&r){ var f=document.createElement('div'); f.className='cf-fire'; f.style.cssText='left:'+rc.left+'px;top:'+rc.top+'px;width:'+rc.width+'px;height:'+rc.height+'px';
      var em=document.createElement('div'); em.className='cf-embers'; em.style.cssText='left:'+rc.left+'px;top:'+rc.top+'px;width:'+rc.width+'px;height:'+rc.height+'px';
      for(var i=0;i<14;i++){ var e=document.createElement('i'); e.className='cf-ember'; e.style.cssText='left:'+Math.round(Math.random()*100)+'%;--x:'+Math.round((Math.random()-.5)*60)+'px;--d:'+(1.4+Math.random()*1.2).toFixed(2)+'s;--w:'+(Math.random()*1.1).toFixed(2)+'s'; em.appendChild(e); }
      r.appendChild(f); r.appendChild(em); setTimeout(function(){ if(f.parentNode) f.remove(); if(em.parentNode) em.remove(); },3400); }
    setTimeout(function(){ ta.classList.remove('cf-burning'); ta.readOnly=false; _burning=false;
      if(!g('cfRoom')||!g('cfRoom').classList.contains('show')) return;
      ta.value=''; cfRoomAfterSend(k,false); var line=cfPk(BURN[tn]||BURN.neu,'burn_'+tn);
      cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(line)+'</div></div><div style="margin-top:12px"><button class="cfb" style="width:100%" onclick="closeModal()">닫기</button></div>'); }, fast?1100:2500); }

  /* --- 숨 고르기: 4초 들이쉬고 · 2초 멈추고 · 6초 내쉬기 --- */
  window.cfBreathBox=function(){ return '<button class="cfb" style="width:100%;margin-top:10px" onclick="cfBreathFromModal()">🌬️ 같이 숨 쉬어요</button>'; };
  window.cfBreathFromModal=function(){ closeModal(); setTimeout(function(){ cfBreathe(); },150); };
  window.cfBreathe=function(cycles){ var r=g('cfRoom'); if(!r||!r.classList.contains('show')||_br||_sit) return; cycles=(typeof cycles==='number'&&cycles>0)?cycles:4;
    var o=document.createElement('div'); o.id='cfBreath'; o.className='cf-breath';
    o.innerHTML='<div class="cf-b-ring"><div class="cf-b-c" id="cfBc"></div></div><div class="cf-b-t" id="cfBt">편하게 앉아요. 곧 시작할게요.</div><div class="cf-b-s" id="cfBs"></div><button class="cfb" id="cfBx" onclick="cfBreathStop()">그만할래요</button>';
    r.appendChild(o); _br={T:[],done:false}; var PH=[['들이쉬어요',4,1.55],['잠깐 멈춰요',2,1.55],['천천히 내쉬어요',6,1]], cy=0, pi=0;
    function later(fn,ms){ var t=setTimeout(fn,ms); _br&&_br.T.push(t); }
    function phase(){ if(!_br) return; var c=g('cfBc'), tx=g('cfBt'), sb=g('cfBs'); if(!c||!tx) return;
      var p=PH[pi]; tx.textContent=p[0]; c.style.transition=reduced()?'none':'transform '+p[1]+'s ease-in-out'; c.style.transform='scale('+p[2]+')';
      if(sb) sb.textContent=(cy+1)+' / '+cycles; var left=p[1]; var cd=function(){ if(!_br) return; if(sb) sb.textContent=left+'초 · '+(cy+1)+' / '+cycles; left--; if(left>=0) later(cd,1000); }; cd();
      later(function(){ pi++; if(pi>=PH.length){ pi=0; cy++; } if(cy>=cycles) finish(); else phase(); },p[1]*1000); }
    function finish(){ if(!_br) return; _br.done=true; var tx=g('cfBt'), sb=g('cfBs'), x=g('cfBx'), c=g('cfBc'); if(c){ c.style.transition='transform 1.5s ease-in-out'; c.style.transform='scale(1.2)'; }
      if(tx) tx.textContent='잘했어요. 숨이 조금 느려졌길 바라요.'; if(sb) sb.textContent=''; if(x){ x.textContent='고마워요'; } }
    later(phase,1600); };
  window.cfBreathStop=function(){ var done=!!(_br&&_br.done); if(_br){ _br.T.forEach(clearTimeout); _br=null; } var o=g('cfBreath'); if(o) o.remove();
    var r=g('cfRoom'); if(r&&r.classList.contains('show')){ cfRoomFace('proud'); var h=g('cfHi'); if(h) h.textContent=done?'숨 쉬는 동안 옆에 있었어요.\n이제 천천히 써 봐요.':'괜찮아요. 준비되면 언제든 다시 해요.'; } };

  /* --- 말없이 곁에: 글 없이 촛불 곁에 머물기 --- */
  var SITL=['말하지 않아도 괜찮아요. 저는 여기 있어요.','숨은 천천히 쉬어도 돼요.','촛불 타는 소리만 들어도 충분해요.','아무것도 안 해도 되는 시간이에요.','오늘은 그냥 여기 있어요, 우리.','조금 쉬어도 세상은 그대로예요.','여기선 아무도 재촉하지 않아요.','마음이 가라앉을 때까지 기다릴게요.'];
  var SITEND=['곁에 있는 것만으로도 충분한 밤이었어요. 또 언제든 와요.','말하지 않아도 괜찮았죠? 저는 계속 여기 있을게요.','조용히 함께 있어 줘서 고마워요.'];
  function sitSay(txt){ var h=g('cfHi'); if(!h) return; h.style.opacity=0; setTimeout(function(){ if(g('cfHi')){ h.textContent=txt; h.style.opacity=1; } },800); }
  window.cfSit=function(){ var r=g('cfRoom'), inn=r&&r.querySelector('.cf-inner'); if(!r||!inn||_sit||_br||_burning) return;
    var box=document.createElement('div'); box.id='cfSitBox'; box.innerHTML='<div class="cf-sit-t" id="cfSitT">함께 있는 중…</div><button class="cfb" onclick="cfSitStop()">일어날게요</button>'; inn.appendChild(box);
    r.classList.add('cf-sit'); cfRoomFace('greet'); var h=g('cfHi'); if(h) h.textContent='말하지 않아도 돼요.\n저는 여기 있어요.'; r.scrollTop=0;
    var t0=Date.now(); window.__cfSit=_sit={t0:t0,next:t0+25000,last:-1,iv:null};
    _sit.iv=setInterval(function(){ if(!_sit) return; var m=Math.floor((Date.now()-_sit.t0)/60000), st=g('cfSitT'); if(st) st.textContent=m<1?'함께 있는 중…':m+'분째 함께 있어요';
      if(Date.now()>=_sit.next){ var i=Math.floor(Math.random()*SITL.length); if(i===_sit.last) i=(i+1)%SITL.length; _sit.last=i; sitSay(SITL[i]); _sit.next=Date.now()+70000+Math.random()*40000; } },1000); };
  window.cfSitStop=function(silent){ if(!_sit) return; var el=Date.now()-_sit.t0, m=Math.floor(el/60000); clearInterval(_sit.iv); _sit=null; window.__cfSit=null;
    var r=g('cfRoom'), bx=g('cfSitBox'); if(bx) bx.remove(); if(r) r.classList.remove('cf-sit');
    var h=g('cfHi'); if(h){ h.style.opacity=1; h.textContent=FACE_HI.greet; } cfRoomFace('greet');
    if(el<60000){ if(silent!==true) toast('언제든 다시 와요'); return; }
    var line=cfPk(SITEND,'sitend')+'\n'+m+'분 동안 함께 있었어요.';
    (S.confess=S.confess||[]).push({id:'cf'+Date.now(),ts:Date.now(),d:todayStr(),k:'sit',text:'(말없이 곁에 앉아 있었어요 · '+m+'분)',reply:line}); save(); try{ renderConfess(); }catch(e){ LQ.err(e); }
    if(silent===true) return;
    cfShowTyped('<div class="mascot-row">'+mascotImg(56,'cheer')+'<div class="speech-bubble" style="white-space:pre-line">'+esc(line)+'</div></div><div style="display:flex;gap:6px;margin-top:12px"><button class="cfb" style="flex:1" onclick="openConfessLog()">고해 노트 보기</button><button class="cfb" style="flex:1" onclick="closeModal()">닫기</button></div>'); };

  /* 방에서 나갈 때 진행 중인 것들 정리 */

  /* --- 1) 기쁜 일: 마티 축하 + 오늘의 업적 후보 --- */
  window.cfCeleBox=function(id){ return '<div style="display:flex;gap:6px;margin-top:10px"><button class="cfb" style="flex:1" onclick="cfCele(\''+id+'\')">🎉 불러 주세요</button><button class="cfb" style="flex:1" onclick="closeModal()">괜찮아요</button></div>'; };
  var CELE=['와아~ 축하해요! 마티가 달려왔어요 🎉✨','기쁜 소식이라고 해서 날아왔어요! 정말 잘했어요 👏','짜잔, 축하 요정 마티 등장! 오늘은 마음껏 기뻐해요 🌟','반짝반짝! 마티가 축하 가루 들고 왔어요 ✨🎊'];
  var CELEQ=['“{q}” — 와아~ 마티가 달려왔어요 🎉✨','“{q}” — 소식 듣고 날아왔어요! 정말 잘했어요 👏','“{q}” — 짜잔, 축하 요정 마티 등장! 오늘의 주인공이네요 🌟','“{q}”! 저도 모르게 박수가 나왔어요 🎊'];
  var WADN={'해냈':'해낸','끝냈':'끝낸','마쳤':'마친','따냈':'따낸','만들었':'만든','이겼':'이긴','붙었':'붙은','받았':'받은','만났':'만난','먹었':'먹은','찾았':'찾은','풀었':'푼','올랐':'오른','나았':'나은','뛰었':'뛴','했':'한','샀':'산','갔':'간','됐':'된','되었':'된','썼':'쓴','왔':'온','봤':'본'};
  var WRE=/^(.*?)(해냈|끝냈|마쳤|따냈|만들었|이겼|붙었|받았|만났|먹었|찾았|풀었|올랐|나았|뛰었|했|샀|갔|됐|되었|썼|왔|봤)(?:어요|어|다|음|네요|네|구나|지|는데|거든|고)?$/;
  /* “시험 합격했어” → “시험 합격한 날” */
  function winPhrase(c){ c=String(c||'').replace(/[!?.~ㅎㅋㅠ\s]+$/,'').replace(/^(오늘|방금|아까)\s*/,'').trim();
    if(/망|실패|못|안\s|싫|힘들|짜증|아프|피곤/.test(c)) return null;
    var m=c.match(WRE), ws=c.split(/\s+/), k=ws.length-1;
    while(!m&&k>=2){ m=ws.slice(0,k).join(' ').match(WRE); k--; }   /* “발표 끝냈어 다행이야” → 앞부분만으로 시도 */
    if(!m||m[1].replace(/\s/g,'').length<2) return null;
    var w=m[1]+WADN[m[2]]+' 날'; return w.length<=26?w:null; }
  var FEEL=[[/뿌듯/,'뿌듯함이 가득했던 날'],[/행복/,'행복이 번진 날'],[/기쁘|기뻐/,'기쁨이 가득했던 날'],[/설레/,'설렘이 찾아온 날'],[/신나|신났/,'신나게 웃은 날'],[/다행|안도|놓였|놓이/,'마음이 놓인 날'],[/감사|고마/,'고마움을 느낀 날'],[/재밌|재미있|즐거/,'즐겁게 보낸 날'],[/웃었|웃음/,'크게 웃은 날']];
  var CAT=['🏠 가족과 따뜻했던 날','🤝 좋은 사람들과 함께한 날','💗 설렘이 찾아온 날','💼 일터에서 빛난 날','📚 노력이 결실을 맺은 날','🧭 앞길이 열리는 날','🌿 몸이 가벼웠던 날','🌙 푹 잔 개운한 날','💰 마음이 든든해진 날','🐾 작은 친구와 웃은 날','🎨 좋아하는 걸 즐긴 날','🌤️ 날씨까지 좋았던 날','🪞 내 모습이 마음에 든 날','🤝 마음이 풀린 날','🌱 돌아보고 한 걸음 나아간 날'];
  function achIdeas(e){ var t=String(e.text||'').trim(), d=todayStr(), q=null;
    try{ q=window.cfPickQuote?cfPickQuote(t):null; }catch(x){ LQ.err(x); }
    if(!q){ var f=t.split(/[.!?\n~…]/)[0].trim(); q=(f.length>=4&&f.length<=24)?f:null; }
    var qs=q&&q.length>24?q.slice(0,24)+'…':q, ds=d+' · 밀담실에서 나눈 기쁜 순간'+(qs?' · “'+qs+'”':''), L=[], seen={};
    function add(n,desc){ if(!n||seen[n]) return; seen[n]=1; L.push([n,desc||ds]); }
    var cl=t.split(/[.!?\n~…]+/).map(function(x){ return x.trim(); }).filter(Boolean), w=null, i;
    if(q) w=winPhrase(q); for(i=0;!w&&i<cl.length;i++) w=winPhrase(cl[i]);
    if(w) add('🏅 '+w);
    for(i=0;i<FEEL.length;i++){ if(FEEL[i][0].test(t)){ add('💛 '+FEEL[i][1]); break; } }
    var ti=(e.ti!=null)?e.ti:(window.cfTopicOf?cfTopicOf(t):-1); if(ti>=0&&CAT[ti]) add(CAT[ti]);
    add('🌟 오늘의 나, 칭찬해요','스스로에게 박수 한 번 쳐 준 날 · '+d);
    add('🎉 기쁨을 나눈 날','좋은 일을 로웨나와 마티에게 들려준 날 · '+d);
    return L.slice(0,3); }
  window.cfAchDialog=function(id){ var e=(S.confess||[]).find(function(x){ return x.id===id; }); if(!e) return;
    var C=achIdeas(e); window.__cfAch={id:id,list:C,ds:(C[0]&&C[0][1])||todayStr()+' · 밀담실에서 나눈 기쁜 순간'};
    var o=document.getElementById('askOv');
    o.innerHTML='<div class="ask-box mg-box"><div class="mg-row"><img class="mg-img" src="'+MARTY_IMG+'" alt=""><div class="speech-bubble">축하해요! 🎉\n이 순간을 오늘의 업적으로 남겨 볼까요?\n마음에 드는 걸 골라 줘요.</div></div>'
      +C.map(function(c,i){ return '<button class="mg-opt" onclick="cfAchPick('+i+')"><b>'+esc(c[0])+'</b><span>'+esc(c[1])+'</span></button>'; }).join('')
      +'<input id="cfAchName" maxlength="28" placeholder="✏️ 내가 직접 이름 붙이기" style="font-size:16px;padding:8px;border:1px solid var(--gold-d);border-radius:5px;background:#d6c7a0;color:var(--ink);font-family:inherit;margin-top:2px">'
      +'<button class="mg-opt" style="margin-top:6px;align-items:center" onclick="cfAchCustom()"><b>이 이름으로 남기기</b></button>'
      +'<div class="mg-foot"><button class="ghost-btn" onclick="mgClose()">다음에 할게요</button></div></div>';
    o.classList.add('show'); };
  window.cfAchAdd=function(name,desc){ var t=todayStr(); S.achievements=S.achievements||[];
    if(S.achievements.some(function(a){ return a.name===name&&a.unlockedAt===t; })){ toast('이미 남긴 업적이에요'); mgClose(); window.__cfAch=null; return; }
    S.achievements.push({id:'a'+Date.now(),name:name,desc:desc,cond:{type:'manual'},gold:2,unlocked:true,unlockedAt:t});
    S.gold=(S.gold||0)+halfG(2); save(); mgClose(); window.__cfAch=null;
    try{ celebrate('ach',name); }catch(e){ LQ.err(e); } try{ renderAchievements(); renderHome(); }catch(e){ LQ.err(e); } };
  window.cfAchPick=function(i){ var A=window.__cfAch; if(!A||!A.list[i]) return; cfAchAdd(A.list[i][0],A.list[i][1]); };
  window.cfAchCustom=function(){ var A=window.__cfAch||{}, el=document.getElementById('cfAchName'), n=((el&&el.value)||'').trim();
    if(!n){ toast('이름을 한 줄만 적어 주세요'); return; } cfAchAdd('🏅 '+n.replace(/^🏅\s*/,''),A.ds||todayStr()+' · 밀담실에서 나눈 기쁜 순간'); };
  window.cfCele=function(id){ closeModal(); document.body.classList.add('cf-cele'); try{ sfx('ach'); }catch(e){ LQ.err(e); }
    var e=(S.confess||[]).find(function(x){ return x.id===id; }), q=null;
    try{ q=(e&&window.cfPickQuote)?cfPickQuote(e.text):null; }catch(x){ LQ.err(x); }
    var t=(q&&q.length<=24&&Math.random()<.85)?cfPk(CELEQ,'celeq').replace('{q}',q):cfPk(CELE,'cele');
    var go=function(){ document.body.classList.remove('cf-cele'); cfAchDialog(id); };
    if(S.settings.martyPop===false){ toast('마티: '+t); setTimeout(go,1300); return; }
    martyShow('cele',t);
    var n=0, seen=false, iv=setInterval(function(){ var p=document.getElementById('martyPop'), on=!!p&&p.className==='show'; if(on) seen=true; n++;
      if((seen&&!on)||n>24){ clearInterval(iv); setTimeout(go,seen?350:150); } },300); };

})();
var _cfLogFilter='all';
function cfFav(id){ const e=(S.confess||[]).find(x=>x.id===id); if(!e) return; e.fav=!e.fav; save(); openConfessLog(); }
function openConfessLog(filter){ if(filter!==undefined) _cfLogFilter=filter;
  const all=(S.confess||[]).slice().reverse();
  const kindsPresent=[...new Set(all.map(e=>e.k))];
  if(_cfLogFilter!=='all'&&_cfLogFilter!=='fav'&&!kindsPresent.includes(_cfLogFilter)) _cfLogFilter='all';
  const A=_cfLogFilter==='all'?all:_cfLogFilter==='fav'?all.filter(e=>e.fav):all.filter(e=>e.k===_cfLogFilter);
  const chip=(k,label)=>'<button class="cfb'+(_cfLogFilter===k?' on':'')+'" style="padding:5px 10px;font-size:12px" onclick="openConfessLog(\''+k+'\')">'+label+'</button>';
  const chips='<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">'+chip('all','전체')+chip('fav','⭐ 즐겨찾기')+kindsPresent.map(k=>chip(k,CF_KIND[k]||k)).join('')+'</div>';
  showModal('<h3 style="margin-bottom:6px">고해 노트</h3><div class="panel-sub" style="margin-top:0">이 기기에만 저장돼요. 백업에는 함께 들어가요.</div>'+chips+(A.length?A.map(e=>'<div class="cf-ent"><div class="m">'+esc(e.d)+' · '+esc(CF_KIND[e.k]||'')+'<button class="cf-star" onclick="cfFav(\''+e.id+'\')" title="즐겨찾기">'+(e.fav?'⭐':'☆')+'</button></div>'+(e.q?'<div style="font-size:12px;color:var(--ink-soft);font-style:italic;margin-top:2px">Q. '+esc(e.q)+'</div>':'')+'<div class="t">'+esc(e.text)+'</div><div class="r" style="white-space:pre-line">'+esc(e.by||'로웨나')+': '+esc(e.reply)+'</div>'+cfFuLog(e)+'<button class="cfb" style="margin-top:6px;padding:4px 10px;font-size:12px" onclick="cfDel(\''+e.id+'\')">삭제</button></div>').join(''):'<div class="empty">해당하는 글이 없어요</div>')+'<button class="cfb" style="width:100%;margin-top:10px" onclick="openConfess()">새로 털어놓기</button>'); }
function cfDel(id){ askOk('이 글을 지울까요?',()=>{ S.confess=(S.confess||[]).filter(e=>e.id!==id); save(); openConfessLog(); }); }
