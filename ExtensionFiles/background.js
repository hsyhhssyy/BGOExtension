function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if(getDomainFromUrl(tab.url).toLowerCase()=="boardgaming-online.com"){
		chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

//init plugin
if(localStorage['chrome.bgo-extension.refresh-interval']==undefined){
	localStorage['chrome.bgo-extension.refresh-interval']="3";
	localStorage['chrome.bgo-extension.auto-refresh']="true";
	
	localStorage['chrome.bgo-extension.notification-global-enabled']="true";
	localStorage['chrome.bgo-extension.notification-your-turn']="true";
	localStorage['chrome.bgo-extension.notification-action-update']="false";
	localStorage['chrome.bgo-extension.notification-end-of-game']="true";
	
	localStorage['chrome.bgo-extension.beep-global-enabled']="true";
	localStorage['chrome.bgo-extension.beep-your-turn']="true";
	localStorage['chrome.bgo-extension.beep-action-update']="false";
	localStorage['chrome.bgo-extension.beep-end-of-game']="false";
}

var bgoData = {};
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.type=="bgo-board-information"){
		bgoData = request;
	}else if(request.type=="bgo-configuration-query"){
		/*var config={
			'chrome.bgo-extension.auto-refresh':localStorage['chrome.bgo-extension.auto-refresh'],
			'chrome.bgo-extension.refresh-interval':localStorage['chrome.bgo-extension.refresh-interval'],
			'chrome.bgo-extension.notification-global-enabled':localStorage['chrome.bgo-extension.notification-global-enabled'],
			'chrome.bgo-extension.notification-your-turn':localStorage['chrome.bgo-extension.notification-your-turn'],
			'chrome.bgo-extension.notification-action-update':localStorage['chrome.bgo-extension.notification-action-update'],
			'chrome.bgo-extension.notification-end-of-game':localStorage['chrome.bgo-extension.notification-end-of-game'],
			'chrome.bgo-extension.beep-global-enabled':localStorage['chrome.bgo-extension.beep-global-enabled'],
			'chrome.bgo-extension.beep-your-turn':localStorage['chrome.bgo-extension.beep-your-turn'],
			'chrome.bgo-extension.beep-action-update':localStorage['chrome.bgo-extension.beep-action-update'],
			'chrome.bgo-extension.beep-end-of-game':localStorage['chrome.bgo-extension.beep-end-of-game']
		};*/
		var config={};
		for (var key in localStorage){
			if(key.startsWith("chrome.bgo-extension")){
  				config[key]=localStorage[key];
  			}
  		}
		sendResponse(config);
	}
});

