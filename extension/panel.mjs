import {handoff} from './context.mjs';
import {sitePattern,accessMessage} from './access.mjs';
import {selectOnPage,cancelOnPage} from './picker.mjs';
const $=id=>document.getElementById(id);
let pending=null, capturedTab=null;
function refresh(){$('context').value=handoff($('change').value,$('evidence').value);$('copy').disabled=!$('context').value;}
function busy(value){$('pick').disabled=value;$('cancel').disabled=!value;$('grant-site').disabled=value;$('revoke-site').disabled=value;}
function status(value){$('status').textContent=value;}
function clearEvidence(){capturedTab=null;$('evidence').value='';refresh();}
async function cancel(){const job=pending;if(!job)return;pending=null;busy(false);try{if(job.tab!=null)await chrome.scripting.executeScript({target:{tabId:job.tab},func:cancelOnPage,args:[job.id]});}catch{/* navigation or permission loss already invalidates the target */}}
const accessStatus=message=>{$('access-status').textContent=message;};
function showAccess(tab){$('site-access').open=true;if(tab?.url && sitePattern(tab.url))$('site-url').value=new URL(tab.url).origin;}
$('grant-site').addEventListener('click',async()=>{
  const pattern=sitePattern($('site-url').value);
  if(!pattern){accessStatus('Enter a valid HTTP or HTTPS website URL.');return;}
  try {
    const granted=await chrome.permissions.request({origins:[pattern]});
    accessStatus(granted?'Site allowed. Return to the website and click Select element.':'Access was not granted.');
  }catch{accessStatus('Could not request access. Check browser extension settings.');}
});
$('revoke-site').addEventListener('click',async()=>{
  const pattern=sitePattern($('site-url').value);
  if(!pattern){accessStatus('Enter the website URL to revoke.');return;}
  try {await chrome.permissions.remove({origins:[pattern]});accessStatus('Optional site access removed. Toolbar access may still apply to the current tab.');clearEvidence();}
  catch{accessStatus('Could not remove access. Use browser extension settings.');}
});
$('change').addEventListener('input',refresh);$('evidence').addEventListener('input',refresh);
$('clear').addEventListener('click',async()=>{await cancel();$('change').value='';clearEvidence();status('Session cleared.');});
$('cancel').addEventListener('click',async()=>{await cancel();status('Selection cancelled.');});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('context').value);status('Copied. Paste into your AI assistant.');}catch{$('context').focus();$('context').select();status('Clipboard unavailable. Copy selected text manually.');}});
$('pick').addEventListener('click',async()=>{if(pending)return;busy(true);clearEvidence();const job={id:crypto.randomUUID(),tab:null,info:null};pending=job;try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(pending!==job)return;if(tab?.id==null)throw Error('No active tab');job.tab=tab.id;job.info=tab;status('Click the element in the page. Escape cancels.');const [result]=await chrome.scripting.executeScript({target:{tabId:job.tab},func:selectOnPage,args:[job.id,{identifiers:$('identifiers').checked,path:$('path').checked,diagnostics:$('diagnostics').checked}]});if(pending!==job)return;const data=result?.result;if(data?.evidence){capturedTab=job.tab;$('evidence').value=JSON.stringify(data.evidence,null,2).slice(0,6000);refresh();status('Selected. Review evidence before copying.');}else status('Selection ended: '+(data?.reason||'page changed'));}catch(error){if(pending===job){status('Cannot access this page. '+accessMessage(error));showAccess(job.info);console.warn('WebD picker access:',String(error?.message||error));}}finally{if(pending===job){pending=null;busy(false);}}});
chrome.tabs.onActivated.addListener(()=>{if(pending){void cancel();status('Tab changed. Reopen WebD on the target tab.');}clearEvidence();});
chrome.tabs.onUpdated.addListener((id,info)=>{if(info.status==='loading'||info.url){if(pending?.tab===id){void cancel();status('Page changed. Select again.');}if(capturedTab===id){clearEvidence();status('Page changed. Select again.');}}});
window.addEventListener('pagehide',()=>{void cancel();});
