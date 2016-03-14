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
    	extensionTools.executeReady(ttaBoardInformation,function(){
                if (ttaBoardInformation.config['chrome.bgo-extension.auto-refresh'] != "true") {
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
    var allRequestToken = [];

    function checkSpecialFlags() {

        var afterAllAction = true;

        for (var i = 0; i < allRequestToken.length; i ++ ) {
            var token = allRequestToken[i];

            for (var j = 0; j < token.required.length; j++) {
                
                if (token.required[j] != extensionTools.executeReady.afterAllAction) {
                    afterAllAction = false;
                }
            }
        }

        if (afterAllAction) {
            extensionTools.executeReady.afterAllAction.executeReady.onReady(extensionTools.executeReady.afterAllAction);
        }
    }

    var onReady= function(obj) {
        var executeReadyToken = obj.executeReady;
        if (executeReadyToken.ready == true) {
            return;
        } else {
            executeReadyToken.ready = true;
        }

        for (var infoIndex = 0; executeReadyToken.requestTokenList[infoIndex] != undefined; infoIndex++) {
            var requestToken = executeReadyToken.requestTokenList[infoIndex];
            var index = requestToken.required.indexOf(obj);
            requestToken.required.splice(index, 1);

            if (requestToken.required.length <= 0) {
                requestToken.func();
                allRequestToken.splice(allRequestToken.indexOf(requestToken), 1);
                
            }

        }

        checkSpecialFlags()
    }

    //设置支持的对象
    ttaStatistics.executeReady = {
        "requestTokenList": [],
        "ready": false,
        "onReady": onReady,
    }
    ttaBoardInformation.executeReady = {
        "requestTokenList": [],
        "ready": false,
        "onReady": onReady,
    }
    ttaCivilopedia.executeReady = {
        "requestTokenList": [],
        "ready": false,
        "onReady": onReady,
    }
    ttaTranslation.executeReady = {
        "requestTokenList": [],
        "ready": false,
        "onReady": onReady,
    }


    if (typeof extensionTools.executeReady != 'function') {
        extensionTools.executeReady = function() {
            var func = arguments[arguments.length - 1];
            if (typeof func != 'function') {
                throw new Error("executeReady function's last argument must be a function.");
            }

            var requestToken = {
                "required": [],
                "func":func
            };

            
            for (var i = 0; i <= arguments.length - 2; i++) {
                var requiredObj = arguments[i];

                if (requiredObj.executeReady == undefined) {
                    return;
                } else {
                    if (requiredObj.executeReady.ready == true) {
                        continue;
                    }
                }

                requiredObj.executeReady.requestTokenList[requiredObj.executeReady.requestTokenList.length] = requestToken;
                requestToken.required[requestToken.required.length] = requiredObj;
            }

            

            if (requestToken.required.length == 0) {
                func();
            }
            else
            {
                allRequestToken[allRequestToken.length] = requestToken;
            }

        }

        extensionTools.executeReady.afterAllAction = {
            "executeReady": {
                "requestTokenList": [],
                "ready": false,
                "onReady": onReady,
            }
        }

    }
}());

