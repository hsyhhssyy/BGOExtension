function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
    if (getDomainFromUrl(tab.url).toLowerCase() == "boardgaming-online.com" || getDomainFromUrl(tab.url).toLowerCase() == "www.boardgaming-online.com") {
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);


//init plugin
if (localStorage['chrome.bgo-extension.refresh-interval'] == undefined) {
    localStorage['chrome.bgo-extension.refresh-interval'] = "30";
    localStorage['chrome.bgo-extension.auto-refresh'] = "true";

    localStorage['chrome.bgo-extension.notification-global-enabled'] = "true";
    localStorage['chrome.bgo-extension.notification-your-turn'] = "true";
    localStorage['chrome.bgo-extension.notification-action-update'] = "false";
    localStorage['chrome.bgo-extension.notification-end-of-game'] = "true";

    localStorage['chrome.bgo-extension.beep-global-enabled'] = "true";
    localStorage['chrome.bgo-extension.beep-your-turn'] = "true";
    localStorage['chrome.bgo-extension.beep-action-update'] = "false";
    localStorage['chrome.bgo-extension.beep-end-of-game'] = "false";

    localStorage['chrome.bgo-extension.advanced-card-row'] = "true";
    localStorage['chrome.bgo-extension.advanced-card-row-sim-next-turn'] = "false";
    localStorage['chrome.bgo-extension.advanced-card-row-active-player-disp-current'] = "false";
    localStorage['chrome.bgo-extension.advanced-card-row-not-on-last-turn'] = "false";

    //init language

    var localLanguage = navigator.language.toLocaleLowerCase();
    if (localLanguage == "zh-cn") {
        localStorage['chrome.bgo-extension.translate-language'] = "zh-cn";
    } else {
        localStorage['chrome.bgo-extension.translate-language'] = "en-us";
    }
}

var bgoData = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "bgo-board-information") {
        bgoData = request;
    } else if (request.type == "bgo-configuration-query") {
        var config = {};
        for (var key in localStorage) {
            if (key.startsWith("chrome.bgo-extension")) {
                config[key] = localStorage[key];
            }
        }
        sendResponse(config);
    }else if (request.type == "bgo-translation-query") {
        //load dict
        var cfgLanguage = localStorage['chrome.bgo-extension.translate-language'];

        var dict = translationDictionary[cfgLanguage];

        if (dict == undefined) {
            dict = null;
        }
        sendResponse(dict);
    } 
    else if (request.type == "bgo-focus-window") {
        chrome.tabs.update(null, { active: true })
    }
});

