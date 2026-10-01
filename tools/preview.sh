#!/usr/bin/env bash
# 로컬 미리보기: 앱 사본에 "날짜 가짜로 바꾸기" 코드를 넣어서 http://localhost:8765 로 열어요.
# 실제 파일(index.html 등)은 절대 건드리지 않아요. 종료는 Ctrl+C.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; OUT="${TMPDIR:-/tmp}/lq_preview"
rm -rf "$OUT"; mkdir -p "$OUT/app"
cp -R "$ROOT/." "$OUT/app/"; rm -rf "$OUT/app/.git" "$OUT/app/tools" "$OUT/app/CLAUDE.md" "$OUT/app/sw.js"
cp "$ROOT/tools/preview_dates.html" "$OUT/index.html"
python3 - "$OUT/app/index.html" <<'PY'
import sys,re
p=sys.argv[1]; h=open(p).read()
mock="""<script>(function(){var m=/^#d(\\d\\d)(\\d\\d)$/.exec(location.hash);if(!m)return;var R=Date,T=new R('2026-'+m[1]+'-'+m[2]+'T12:00:00+09:00').getTime(),s=R.now();
class D extends R{constructor(...a){if(a.length)super(...a);else super(T+(R.now()-s));}static now(){return T+(R.now()-s);}}window.Date=D;})();</script>"""
h=h.replace('<head>','<head>'+mock,1)
h=re.sub(r"navigator\.serviceWorker\.register\([^)]*\)","Promise.resolve()",h)
open(p,'w').write(h)
PY
echo "미리보기 링크: http://localhost:8765  (종료: Ctrl+C)"
cd "$OUT" && python3 -m http.server 8765
