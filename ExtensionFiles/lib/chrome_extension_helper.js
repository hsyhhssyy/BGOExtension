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
        return txt.trim();
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

var playerColors = ["Unknown", "Orange", "Purple", "Green", "Grey"];
var ageEnum = {
    A: 0,
    I: 1,
    II: 2,
    III: 3,
    IV: 4
};

//标准TTA插件对象：

var ttaTranslation = {};

ttaTranslation.getTranslatedText = function (txt) {
    return txt;
};

var ttaBoardInformation = {};

var ttaStatistics = {};

var ttaCivilopedia = {};



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
        xhr.open('GET', textUrl, true);
        xhr.send(null);
    }
}

(function () {
    var normalInfos = [];

    var onReady= function(obj) {
        var executeReadyList = obj.executeReady;
        if (executeReadyList.ready == true) {
            return;
        } else {
            executeReadyList.ready = true;
        }

        for (var infoIndex = 0; executeReadyList.infoList[infoIndex] != undefined; infoIndex++) {
            var info = executeReadyList.infoList[infoIndex];
            var index = info.required.indexOf(obj);
            info.required.splice(index, 1);

            if (info.required.length <= 0) {
                info.func();
            }

            normalInfos.splice(normalInfos.indexOf(info), 1);
        }

        if (normalInfos.length <= 0 && obj != extensionTools.executeReady.afterAllAction) {
            extensionTools.executeReady.afterAllAction.executeReady.onReady(extensionTools.executeReady.afterAllAction);
        }
    }

    //设置支持的对象
    ttaStatistics.executeReady = {
        "infoList": [],
        "ready": false,
        "onReady": onReady,
    }
    ttaBoardInformation.executeReady = {
        "infoList": [],
        "ready": false,
        "onReady": onReady,
    }
    ttaCivilopedia.executeReady = {
        "infoList": [],
        "ready": false,
        "onReady": onReady,
    }
    ttaTranslation.executeReady = {
        "infoList": [],
        "ready": false,
        "onReady": onReady,
    }


    if (typeof extensionTools.executeReady != 'function') {
        extensionTools.executeReady = function() {
            var func = arguments[arguments.length - 1];
            if (typeof func != 'function') {
                throw new Error("executeReady function's last argument must be a function.");
            }

            var executeReadyInfo = {
                "required": [],
                "func":func
            };

            var specialFlag = { "afterAllaction": false };
            
            for (var i = 0; i <= arguments.length - 2; i++) {
                var requiredObj = arguments[i];

                if (requiredObj == extensionTools.executeReady.afterAllAction) {
                    specialFlag.afterAllaction = true;
                }

                if (requiredObj.executeReady == undefined) {

                    return;
                } else {
                    if (requiredObj.executeReady.ready == true) {
                        continue;
                    }
                }

                requiredObj.executeReady.infoList[requiredObj.executeReady.infoList.length] = executeReadyInfo;
                executeReadyInfo.required[executeReadyInfo.required.length] = requiredObj;
            }

            if (specialFlag.afterAllaction==false) {
                normalInfos[normalInfos.length] = executeReadyInfo;
            }

            if (executeReadyInfo.required.length == 0) {
                func();
            }

        }

        extensionTools.executeReady.afterAllAction = {
            "executeReady": {
                "infoList": [],
                "ready": false,
                "onReady": onReady,
            }
        }

    }
}());

