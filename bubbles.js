/* ============================================================================
   말풍선 나누기 (bubbles.js)
   말풍선 안 글이 길면 2~3문장씩 나눠서 보여 줘요.
   - LQB.split(글) : 2~3문장 단위의 쪽 배열로 나눈다 (밀담실 타이핑·AI 대화가 같이 씀)
   - 그 밖의 말풍선(홈·마티·로웨나·웰라·시나·하루 마무리 등)은 여기서 자동으로 나눠요.
     말풍선을 누르면 다음 쪽으로 넘어가고, 끝나지 않은 쪽에는 ▼ 표시가 붙어요.
     잠깐 떴다 사라지는 팝업은 누르지 않아도 차례로 넘어가요.
   ============================================================================ */
(function(){
'use strict';
var MAXC=130; /* 한 쪽 글자 수가 이보다 길면 3문장 대신 2문장으로 */
function sentences(t){
  var out=[], re=/[^.!?…~\n]*(?:[.!?…~]+["')”’」』]*|\n+|$)/g, m;
  while((m=re.exec(t))){ if(!m[0]){ re.lastIndex++; if(re.lastIndex>t.length) break; continue; } out.push(m[0]); }
  /* 글자가 없는 조각("…", 빈 줄)은 앞뒤 문장에 붙인다 */
  var r=[]; out.forEach(function(s){ if(!/[0-9A-Za-z가-힣]/.test(s)&&r.length) r[r.length-1]+=s; else r.push(s); });
  for(var i=0;i<r.length-1;i++) if(!/[0-9A-Za-z가-힣]/.test(r[i])){ r[i+1]=r[i]+r[i+1]; r.splice(i,1); i--; }
  return r.filter(function(s){ return s.trim(); });
}
function split(text){
  text=String(text||''); var s=sentences(text); if(s.length<=3) return [text.trim()];
  var pages=[], i=0;
  while(i<s.length){ var n=3; if((s[i]+(s[i+1]||'')+(s[i+2]||'')).length>MAXC) n=2; if(n===2&&(s[i]+(s[i+1]||'')).length>MAXC) n=1;
    pages.push(s.slice(i,i+n)); i+=n; }
  /* 마지막 쪽이 한 문장만 남으면 앞 쪽과 고르게 나눈다 */
  var L=pages.length; if(L>1&&pages[L-1].length===1){ var p=pages[L-2]; if(p.length===3){ pages[L-1].unshift(p.pop()); } else if((p.join('')+pages[L-1][0]).length<=MAXC+30){ p.push(pages.pop()[0]); } }
  return pages.map(function(a){ return a.join('').trim(); }).filter(Boolean);
}
window.LQB={split:split};

/* ---------- 자동으로 나누는 말풍선들 ---------- */
var SEL='.speech-bubble,.nbub,.mp-bub,.rp-bub>span,.wl-b,.tc-w,.tc-s,.pb-b';
var POP='#martyPop,#lowenaPop,#trChat,#passBy,#bnCard';
function esc(t){ return String(t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
/* 이름표(<b>) 하나와 글자·줄바꿈·도트 이모지만 있는 말풍선만 나눈다 (버튼 등이 섞이면 그대로 둔다) */
function readable(el){ var label=null, txt='', ok=true;
  Array.prototype.forEach.call(el.childNodes,function(n,i){ if(!ok) return;
    if(n.nodeType===3) txt+=n.nodeValue;
    else if(n.nodeName==='BR') txt+='\n';
    else if(n.nodeType===1&&n.classList.contains('pxe')) txt+=n.textContent;
    else if(n.nodeType===1&&n.classList.contains('bp-more')) {}
    else if(n.nodeName==='B'&&!label&&!txt.trim()) label=n.outerHTML;
    else ok=false; });
  return ok?{label:label,txt:txt}:null; }
function render(el){ var st=el.__bp, pg=st.pages[st.i], more=st.i<st.pages.length-1;
  st.sig=pg; el.innerHTML=(st.label||'')+esc(pg).replace(/\n/g,'<br>')+(more?'<span class="bp-more">▼</span>':'');
  el.classList.toggle('bp-on',more);
  clearTimeout(st.t); if(more&&st.auto) st.t=setTimeout(function(){ next(el); },Math.max(2600,pg.length*85)); }
function next(el){ var st=el.__bp; if(!st||st.i>=st.pages.length-1||!el.isConnected) return false; st.i++; render(el); return true; }
function check(el){ try{
  if(!el||!el.isConnected||el.__typing||el.__bpOwn) return;
  if(el.closest('#modalBox')&&el.matches('.speech-bubble')&&el.__typedOnce) return;
  var r=readable(el); if(!r) return; var cur=r.txt.trim();
  if(el.__bp&&el.__bp.sig===cur) return; /* 방금 내가 그린 쪽(또는 도트 이모지만 바뀜) */
  var pages=split(r.txt); if(pages.length<2){ el.__bp=null; return; }
  el.__bp={pages:pages,i:0,label:r.label,auto:!!el.closest(POP)}; render(el);
}catch(e){ try{ LQ.err(e); }catch(_){} } }
var pend=new Set(), sch=false;
function flush(){ sch=false; var a=Array.from(pend); pend.clear(); a.forEach(check); }
function q(el){ pend.add(el); if(!sch){ sch=true; setTimeout(flush,0); } }
function scan(n){ if(!n) return; var e=n.nodeType===1?n:n.parentNode; if(!e||e.nodeType!==1) return;
  var c=e.closest(SEL); if(c) q(c); if(e.querySelectorAll) e.querySelectorAll(SEL).forEach(q); }
/* 말풍선을 누르면 다음 쪽 (닫히는 동작보다 먼저 가로챈다) */
document.addEventListener('click',function(ev){ var el=ev.target&&ev.target.closest&&ev.target.closest(SEL);
  if(el&&el.__bp&&el.__bp.i<el.__bp.pages.length-1){ ev.stopPropagation(); ev.preventDefault(); next(el); } },true);
var css=document.createElement('style');
css.textContent='.bp-more{display:inline-block;margin-left:6px;font-size:.7em;opacity:.65;animation:bpBob 1.1s ease-in-out infinite}.bp-on{cursor:pointer}'
  +'@keyframes bpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}'
  +'#modalBox.bp-wait>*:not(.bp-row):not(.modal-close){visibility:hidden;pointer-events:none}';
document.head.appendChild(css);
function start(){ try{ scan(document.body);
  new MutationObserver(function(ms){ ms.forEach(function(m){ if(m.type==='characterData') scan(m.target); else { scan(m.target); m.addedNodes.forEach(scan); } }); })
    .observe(document.body,{childList:true,subtree:true,characterData:true});
  }catch(e){ try{ LQ.err(e); }catch(_){} } }
if(document.body) start(); else document.addEventListener('DOMContentLoaded',start);
})();
