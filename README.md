# LIFE QUEST (private PWA)

정적 파일만으로 동작하는 개인용 PWA예요. 서버·빌드 과정 없이 GitHub Pages 등에 그대로 올리면 돼요.

## 구성
- `index.html`, `style.css`, `manifest.json`, `sw.js`(오프라인 캐시, `V` 값을 올리면 갱신)
- `core.js` 핵심 상태·화면 / `lowena-*.js` 로웨나 대화·AI / `marty.js`, `treasure-cast.js`, `banter.js`, `cameos.js`, `extras-fx.js` 각 기능 / `lines.js` 대사 모음
- `stories/` 로웨나가 들려주는 이야기 데이터 (아래 참고)
- `assets/` 이미지

## 이야기 추가하는 법
1. `stories/` 안에 새 파일을 만들고 시리즈는 `(window.LQ_SERIES=window.LQ_SERIES||[]).push({id,t:'📚 제목',eps:[{t:'1화 · …',p:[문단 5개]}]})`, 단편은 `window.LQ_STORIES.push({id,t:'🌙 제목',p:[…]})` 형태로 써요.
2. `index.html`의 `lowena-talk.js` 앞에 `<script src="stories/새파일.js">`를 추가해요.
3. `sw.js`의 파일 목록에 `stories/새파일.js`를 넣고 캐시 버전 `V`를 올려요.
4. `lowena-talk.js`의 `ST_ALIAS`(직접 요청 인식), `ST_THEME`/`ST_FACT`(감상·질문 답), 필요하면 `BK`(책 소개)에 항목을 더해요.

## 원칙
- 저작권이 살아 있는 작가(하루키·게이고 등)의 줄거리는 다시 들려주지 않고 소개·AI 대화만 해요.
- API 키는 코드에 넣지 않아요. 앱 설정에서 기기별로 입력해요(localStorage).
