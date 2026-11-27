// This function is serialized by chrome.scripting; it must be self-contained.
export function selectOnPage(id, options) {
  return new Promise(resolve => {
    const slot='__webdPicker';
    globalThis[slot]?.cancel();
    const overlay=document.createElement('div');
    overlay.setAttribute('aria-hidden','true');overlay.setAttribute('data-webd-picker','');
    overlay.style.cssText='all:initial!important;position:fixed!important;pointer-events:none!important;z-index:2147483647!important;outline:2px solid #65a30d!important;background:#84cc1614!important;display:none!important';
    document.documentElement.append(overlay);
    const controller=new AbortController();
    const listen=(target,event,fn)=>target.addEventListener(event,fn,{capture:true,signal:controller.signal});
    let point=null, timer;
    const done=(result)=>{controller.abort();clearTimeout(timer);overlay.remove();if(globalThis[slot]?.id===id)delete globalThis[slot];resolve(result);};
    globalThis[slot]={id,cancel:()=>done({reason:'cancelled'})};
    function target(){return point&&document.elementFromPoint(...point);}
    function draw(){const el=target();if(!el||el===overlay){overlay.style.setProperty('display','none','important');return;}const r=el.getBoundingClientRect();for(const [k,v] of Object.entries({left:r.x+'px',top:r.y+'px',width:r.width+'px',height:r.height+'px',display:'block'}))overlay.style.setProperty(k,v,'important');}
    function selector(el){const parts=[];for(let n=el;n&&parts.length<12;n=n.parentElement){if(options.identifiers&&n.id&&n.id.length<=120&&document.querySelectorAll('#'+CSS.escape(n.id)).length===1){parts.unshift('#'+CSS.escape(n.id));break;}const tag=CSS.escape(n.localName);const siblings=n.parentElement?[...n.parentElement.children].filter(x=>x.localName===n.localName):[n];parts.unshift(tag+(siblings.length>1?':nth-of-type('+(siblings.indexOf(n)+1)+')':''));}const value=parts.join(' > ');try{return value.length<=1000&&document.querySelectorAll(value).length===1&&document.querySelector(value)===el?value:null;}catch{return null;}}
    function pick(e){e.preventDefault();e.stopImmediatePropagation();const el=e.target;if(!(el instanceof Element)||!el.isConnected)return;try{if(el.matches('iframe,frame,object,embed'))return done({reason:'embedded frame unsupported'});const r=el.getBoundingClientRect(),s=getComputedStyle(el);const props=options.diagnostics?['display','position','width','height','padding','margin','gap','fontSize','fontWeight','lineHeight','color','backgroundColor','borderRadius','alignItems','justifyContent']:['display','width','height','padding','fontSize','borderRadius'];const evidence={tag:el.localName.slice(0,120),selector:selector(el),viewport:{width:innerWidth,height:innerHeight},bounds:{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)},styles:Object.fromEntries(props.map(p=>[p,s[p].slice(0,120)]))};if(options.identifiers)evidence.classes=[...el.classList].slice(0,12).map(c=>c.slice(0,120));if(options.path)evidence.page=(location.origin+location.pathname).slice(0,500);done({evidence});}catch{done({reason:'capture failed'});}}
    listen(window,'pointermove',e=>{point=[e.clientX,e.clientY];draw();});listen(window,'scroll',draw);listen(window,'resize',draw);listen(window,'click',pick);listen(window,'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();done({reason:'cancelled'});}});listen(window,'pagehide',()=>done({reason:'navigation'}));listen(document,'visibilitychange',()=>{if(document.hidden)done({reason:'tab hidden'});});timer=setTimeout(()=>done({reason:'timed out'}),45000);
  });
}
export function cancelOnPage(id){const session=globalThis.__webdPicker;if(session?.id===id)session.cancel();}
