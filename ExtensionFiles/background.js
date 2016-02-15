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

var legends = {};
var translationDictionary = {};

function replaceAll(source,key, value) {
    var searchKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return source.replace(new RegExp(searchKey, 'g'), value);
}

function convertLegend(str) {
    //var i = 0;
    //for (i = 0; i < legends.length; i++) {
    for (key in legends) {
        //var key = legends[i];
        var value = legends[key];
        str=replaceAll(str,key, value);
    }

    return str;
}

function loadDict(languageStr) {
    //get language
    var dictName = "dict_"+languageStr+".txt";
    var dictUrl = chrome.extension.getURL(dictName);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var localDict = {};

            var dictText = xhr.responseText;
            var dictTextSplit = dictText.split("\n");
            var i = 0;
            for (i = 0; i < dictTextSplit.length; i++) {
                var dictRowText = dictTextSplit[i].trim();
                var dictRowLoc = dictRowText.indexOf("|", 0);
                if (dictRowLoc < dictRowText.length - 1) {
                    var key = convertLegend(dictRowText.substr(0, dictRowLoc));
                    var value = convertLegend(dictRowText.substr(dictRowLoc + 1));
                    localDict[key] = value;
                    localDict[key + "<br>"] = value + "<br>";
                    localDict["A&nbsp;-&nbsp;" + key] = "A&nbsp;-&nbsp;" + value;
                    localDict["I&nbsp;-&nbsp;" + key] = "I&nbsp;-&nbsp;" + value;
                    localDict["II&nbsp;-&nbsp;" + key] = "II&nbsp;-&nbsp;" + value;
                    localDict["III&nbsp;-&nbsp;" + key] = "III&nbsp;-&nbsp;" + value;
                }
            }

            translationDictionary[languageStr] = localDict;
        }
    }
    xhr.open('GET', dictUrl, true);
    xhr.send(null);
}
function loadLegend() {
    var legendUrl = chrome.extension.getURL("translation_legend.txt");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var legendText = xhr.responseText;
            var legendTextSplit = legendText.split("\n");
            var i = 0;
            for (i = 0; i < legendTextSplit.length; i++) {
                var legendRowText = legendTextSplit[i].trim();
                var legendRowLoc = legendRowText.indexOf("]", 0);
                var key = legendRowText.substr(0, legendRowLoc + 1);
                var value = legendRowText.substr(legendRowLoc + 1);
                legends[key] = value;
            }

            //special legend
            legends["LR"] = "\n";

            //Legend loaded
            loadDict("zh-cn");
        }
    }
    xhr.open('GET', legendUrl, true);
    xhr.send(null);
}

loadLegend();

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

