/** ***********************
**
** Chrome Extension 帮助函数
**
** ************************/

//为JS添加功能的部分

if (typeof String.prototype.removeCharacterEntities != 'function') {
    String.prototype.removeCharacterEntities = function () {
        var txt = this.toString();
        var convert = $("<p>" + txt + "</p>")
        txt = convert[0].innerHTML.replaceAll("&nbsp;", " ");

        var empty_obj = {};
        empty_obj[txt] = 0;
        for (var name in empty_obj) {
            txt = name;
        }
        return txt;
    };
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.indexOf(prefix) == 0;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (key, value) {
        var searchKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return this.replace(new RegExp(searchKey, 'g'), value);
    };
}
if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
    }
}


//Constants

var playerColors = ["Unknown", "Orange", "Purple", "Green", "Red"];

var ageEnum = {
    A: 0,
    I: 1,
    II: 2,
    III: 3,
    IV: 4
};

//自定义工具组

var extensionTools = {};

if (typeof extensionTools.jumpurl != 'function') {
    extensionTools.jumpurl = function(url, data, callback) {
        chrome.extension.sendMessage(cfgRequestMsg,
            function(config) {
                if (config['chrome.bgo-extension.auto-refresh'] != "true") {
                    setTimeout('extensionTools.jumpurl()', 5000);
                } else {
                    location = document.URL;
                }
            });
    }
}


if (typeof extensionTools.loadDocument != 'function') {
    extensionTools.loadDocument = function(url, data, callback) {
        var currentTitle = document.title;
        var myGamesFrame = $('<iframe src="' + url + '" border="1" frameborder="1" width="0" height="0"></iframe>')
        myGamesFrame.get(0).addEventListener('load', function() {
            var doc = myGamesFrame[0].contentDocument;
            document.title = currentTitle;
            callback(myGamesFrame, $(doc), data);
            $(myGamesFrame[0]).remove();
        });
        $("body").append(myGamesFrame);
    }
}

if (typeof extensionTools.loadLocalText != 'function') {
    extensionTools.loadLocalText = function(fullname, callback) {
        var textUrl = chrome.extension.getURL(fullname);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var localText = xhr.responseText;
                callback(localText);
            }
        }
        xhr.open('GET', dtextUrlictUrl, true);
        xhr.send(null);
    }
}

//标准TTA插件对象：

var ttaTranslation = {};
ttaTranslation.getTranslatedText = function(txt) {
    return txt;
}
var ttaBoardInformation = {};