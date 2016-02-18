
var legends = {};
var translationDictionary = {};

function replaceAll(source, key, value) {
    var searchKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return source.replace(new RegExp(searchKey, 'g'), value);
}

function convertLegend(str) {
    //var i = 0;
    //for (i = 0; i < legends.length; i++) {
    for (key in legends) {
        //var key = legends[i];
        var value = legends[key];
        str = replaceAll(str, key, value);
    }

    return str;
}

function loadDict(languageStr) {
    //get language
    var dictName = "translation/dict_" + languageStr + ".txt";
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
                }
            }

            translationDictionary[languageStr] = localDict;
        }
    }
    xhr.open('GET', dictUrl, true);
    xhr.send(null);
}
function loadLegend() {
    var legendUrl = chrome.extension.getURL("translation/translation_legend.txt");

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