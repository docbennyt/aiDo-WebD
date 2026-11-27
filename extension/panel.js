const pick = document.querySelector('#pick');
const change = document.querySelector('#change');
const context = document.querySelector('#context');
const copy = document.querySelector('#copy');
const status = document.querySelector('#status');
let selected = null;
function refresh() {
  if (!selected) return;
  context.value = `Task: ${change.value.trim() || '[describe the intended visual change]'}\n\nSelected element (DOM evidence, not a source-file mapping):\n${JSON.stringify(selected, null, 2)}\n\nConstraints: locate the actual source before editing; preserve existing architecture, behavior and design tokens; make the smallest appropriate patch; do not rewrite unrelated files. Verify responsive layout, keyboard accessibility and relevant tests. Report changed files, checks actually run and remaining uncertainty.`;
  copy.disabled = false;
}
change.addEventListener('input', refresh);
copy.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(context.value); status.textContent = 'Copied. Paste into your AI assistant.'; }
  catch { context.focus(); context.select(); status.textContent = 'Clipboard unavailable. Copy the selected text manually.'; }
});
pick.addEventListener('click', async () => {
  pick.disabled = true; status.textContent = 'Click an element on the page. Esc cancels.';
  try {
    const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    if (!tab?.id) throw new Error('No active tab.');
    const [result] = await chrome.scripting.executeScript({target:{tabId:tab.id},func:selectOnPage});
    if (!result?.result) { status.textContent = 'Selection cancelled or timed out.'; return; }
    selected = result.result; refresh(); status.textContent = 'Selected. Describe the change and inspect the context.';
  } catch (error) { status.textContent = 'Unable to select here. Open an authorized normal web page and reopen WebD. ' + error.message; }
  finally { pick.disabled = false; }
});
function selectOnPage() {
  return new Promise(resolve => {
    const outline = document.createElement('div');
    Object.assign(outline.style,{position:'fixed',pointerEvents:'none',border:'2px solid #65a30d',background:'rgba(101,163,13,.08)',zIndex:'2147483647',display:'none',boxSizing:'border-box'});
    document.documentElement.append(outline);
    function move(e) {
      const el = e.target;
      if (!(el instanceof Element) || el === outline) return;
      const r = el.getBoundingClientRect();
      Object.assign(outline.style,{display:'block',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
    }
    function selector(el) {
      const parts = [];
      for (let node = el; node && parts.length < 12; node = node.parentElement) {
        const tag = CSS.escape(node.localName);
        if (node.id && document.querySelectorAll('#'+CSS.escape(node.id)).length === 1) {parts.unshift('#'+CSS.escape(node.id));break;}
        const siblings = node.parentElement ? [...node.parentElement.children].filter(x=>x.localName===node.localName) : [node];
        parts.unshift(tag + (siblings.length>1 ? ':nth-of-type('+(siblings.indexOf(node)+1)+')' : ''));
      }
      return parts.join(' > ');
    }
    function done(value) { clearTimeout(timer); document.removeEventListener('pointermove',move,true); document.removeEventListener('click',click,true); document.removeEventListener('keydown',key,true); outline.remove(); resolve(value); }
    function key(e) { if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();done(null);} }
    function click(e) {
      const el=e.target;
      if (!(el instanceof Element) || el===outline) return;
      e.preventDefault();e.stopImmediatePropagation();
      const r=el.getBoundingClientRect(), s=getComputedStyle(el);
      const properties=['display','position','width','height','padding','margin','gap','fontSize','fontWeight','lineHeight','color','backgroundColor','borderRadius','alignItems','justifyContent'];
      const styles=Object.fromEntries(properties.map(p=>[p,s[p]]));
      done({page:location.origin+location.pathname,selector:selector(el),tag:el.localName,classes:[...el.classList].slice(0,12),viewport:{width:innerWidth,height:innerHeight},bounds:{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)},styles});
    }
    document.addEventListener('pointermove',move,true); document.addEventListener('click',click,true); document.addEventListener('keydown',key,true);
    const timer=setTimeout(()=>done(null),45000);
  });
}
