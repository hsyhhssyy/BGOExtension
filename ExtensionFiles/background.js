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
    localStorage['chrome.bgo-extension.refresh-interval'] = "3";
    localStorage['chrome.bgo-extension.auto-refresh'] = "true";

    localStorage['chrome.bgo-extension.notification-global-enabled'] = "true";
    localStorage['chrome.bgo-extension.notification-your-turn'] = "true";
    localStorage['chrome.bgo-extension.notification-action-update'] = "false";
    localStorage['chrome.bgo-extension.notification-end-of-game'] = "true";

    localStorage['chrome.bgo-extension.beep-global-enabled'] = "true";
    localStorage['chrome.bgo-extension.beep-your-turn'] = "true";
    localStorage['chrome.bgo-extension.beep-action-update'] = "false";
    localStorage['chrome.bgo-extension.beep-end-of-game'] = "false";
    localStorage['chrome.bgo-extension.translate-language'] = "enUS";
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
        var dict={};
        dict["Every time you take a technology card from the card row, you score 1 <img alt=\"science\" title=\"Science\" class=\"iconeTexte\" src=\"images/tta7/science.png\"> point."] = "每当你从卡牌列获得一张科技牌时，你获得1<img alt=\"science\" title=\"Science\" class=\"iconeTexte\" src=\"images/tta7/science.png\">";
        dict["Breakthrough<br>"] = "突破<br>";
        dict["Breakthrough"] = "突破";
        dict["II&nbsp;-&nbsp;Breakthrough"] = "II - 突破";
        sendResponse(dict);
        
        chrome.extension.getURL("dict_zhCN");
    } 
    else if (request.type == "bgo-focus-window") {
        chrome.tabs.update(null, { active: true })
    }
});

