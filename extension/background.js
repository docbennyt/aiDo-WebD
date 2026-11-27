function configure(){chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:false}).catch(console.error);}
chrome.runtime.onInstalled.addListener(configure);
chrome.runtime.onStartup.addListener(configure);
configure();
chrome.action.onClicked.addListener(tab=>{
  if(tab.windowId!=null)chrome.sidePanel.open({windowId:tab.windowId}).catch(console.error);
});
