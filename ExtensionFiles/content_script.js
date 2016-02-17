var playerColors = ["Unknown", "Orange", "Purple", "Green", "Red"];


/** ***********************
**
** 获得当前玩家的相关信息，构造msg传给后台以供显示
**
** ************************/
var combo = $("form[id=\"formAction\"]");
var boardInfo = $("div").first();
var msg = {
    type: "bgo-board-information",
    playerName: $("span[class=\"nom\"]").text().replace(/\s/g, " "),
    rivals: [],
    message: $("td[class=\"titre3\"]").first().text(),
    lastAction: $("td[class=\"titreNote\"]").first().text(),
    listbox: combo.length,
    url: document.URL
};

//为msg填充player list
var player_name_table = $("table[class=\"tableau0\"]")[1];
player_name_table = $(player_name_table);
var player_names = player_name_table.find("ul[id=\"indJoueur\"]");
var i = 0;
while (player_names[i] != undefined) {
    var name = $(player_names[i]).find("li").contents().get(0).nodeValue;

    if (name.valueOf() == msg.playerName.valueOf()) {
        msg.playerNo = i / 2 + 1;
    } else {
        if (name.valueOf() != "Journal"
		&& name.valueOf() != "Chat"
		&& (!name.valueOf().endsWith(" "))) {
            msg.rivals.push(name);
        }
    }
    i++;
}

chrome.runtime.sendMessage(msg);

/** ***********************
**
** 把卡牌列复制到每个玩家的面板上
**
** ************************/
if (card_row == undefined) {
    var card_row = $("div[id=\"card_row\"]");
    var card_tr = $("<tr></tr>");
    var card_td = $("<td colspan=\"2\"></td>");
    card_td.append(card_row.clone(true));
    card_tr.append(card_td.clone(true));
    var player2table = $("div[id=\"Plateau" + (3 - msg.playerNo) + "\"]").first().find("table").first().find("tbody").first();
    player2table.prepend(card_tr.clone(true))
}

/** ***********************
**
** 自动刷新和提示
**
** ************************/

var cfgRequestMsg = {
    type: "bgo-configuration-query"
};

function jumpurl() {
    chrome.extension.sendMessage(cfgRequestMsg,
		function (config) {
		    if (config['chrome.bgo-extension.auto-refresh'] != "true") {
		        setTimeout('jumpurl()', 5000);
		    } else {
		        location = document.URL;
		    }
		});
}

chrome.extension.sendMessage(cfgRequestMsg,
function (config) {
    //Auto refresh
    if (msg.listbox == 0) {
        if (msg.message != "" && (!msg.message.startsWith("End of"))) { // check if we are in game webpage
            if (config['chrome.bgo-extension.auto-refresh'] == "true") {
                var refresh_interval = config['chrome.bgo-extension.refresh-interval'] * 1000;
                setTimeout('jumpurl()', refresh_interval);
            }
        }
    }

    var notificate = "";
    var beep = false;

    //1. Your Turn
    if (msg.listbox > 0) {
        if (msg.message.startsWith("Political Phase") ||
			msg.message.startsWith("Aggression") ||
			msg.message.startsWith("Colonize") ||
			msg.message.startsWith("Send Colonists") ||
			msg.message.startsWith("Event")
		) {
            if (config['chrome.bgo-extension.notification-your-turn'] == "true") {
                notificate = 'Your rival [' + msg.rivals[0] + "] is waiting for you.";
            }
            if (config['chrome.bgo-extension.beep-your-turn'] == "true") {
                beep = true;
            }
        }

        if (msg.message.startsWith("Action")
			&& msg.lastAction != ""
			&& (!msg.lastAction.startsWith(playerColors[msg.playerNo]))) {
            if (config['chrome.bgo-extension.notification-your-turn'] == "true") {
                notificate = msg.lastAction;
            }
            if (config['chrome.bgo-extension.beep-your-turn'] == "true") {
                beep = true;
            }
        }
    }

    //2. Action Update
    if (msg.message.startsWith("Action")
		&& msg.lastAction != ""
		&& msg.lastAction.startsWith(playerColors[msg.playerNo])) {
        if (config['chrome.bgo-extension.notification-action-update'] == "true") {
            notificate = msg.lastAction;
        }
        if (config['chrome.bgo-extension.beep-action-update'] == "true") {
            beep = true;
        }
    }

    //3.End of Game
    if (msg.message.startsWith("End of")) {
        if (config['chrome.bgo-extension.notification-end-of-game'] == "true") {
            notificate = "Your game has end. " + msg.lastAction;
        }
        if (config['chrome.bgo-extension.beep-end-of-game'] == "true") {
            beep = true;
        }
    }

    if (config['chrome.bgo-extension.notification-global-enabled'] != "true") {
        notificate = "";
    }

    if (config['chrome.bgo-extension.beep-global-enabled'] != "true") {
        beep = false;
    }

    //Beep and Notificate
    if (beep == true) {
        //(function() {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute("src", chrome.extension.getURL("Alert-08.m4a"));
        audioElement.play();
        //})();
    }

    if (notificate != "") {
        if (Notification) {
            if (Notification.permission == "granted") {
                var n_options = {
                    body: notificate,
                    icon: chrome.extension.getURL("favicon.ico")
                }
                var notification = new Notification('BGO Ready', n_options);
                notification.onclick = function () {
                    var focusRequestMsg = {
                        type: "bgo-focus-window"
                    };

                    chrome.extension.sendMessage(focusRequestMsg);
                    //	chrome.windows.update(chrome.tab.windowid,{focused:true});
                };

                setTimeout(notification.close.bind(notification), 5000);
            } else if (Notification.permission == "default") {
                Notification.requestPermission();
            }
        }
    }
}
);

/** ***********************
**
** Saved note 支持中文
**
** ************************/

var savedNote = $("textarea[name=\"noteJoueur\"]");
if (savedNote[0] != undefined) {
    var txt = savedNote[0].value
    var convert = $("<p>" + txt + "</p>")
    txt = convert[0].innerHTML;
    savedNote[0].value = txt;
}



/** ***********************
**
** 翻译BGO UI
**
** ************************/

//收集文本用代码
var gathered_text_list = "";

function gather_text(iterators){
    var i=0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        if(text_gathered != undefined){
           gathered_text_list += ("<SEP>"+text_gathered);
        }else{
            text_gathered=text_gathered;
        }
        
        i++;
    }
}

gather_text($("p[class=\"texteCarte\"]"));

localStorage["gathered_text_list"] = gathered_text_list;

//汉化帮助函数

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
    String.prototype.trim = function() {
        return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
    }
}

function translateWithAgePrefix(iterators, dict) {
    var i = 0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();

        if (text_gathered != undefined) {
            if (dict[text_gathered] == undefined) {
                var slashLoc = text_gathered.indexOf("-");
                if (slashLoc < 0) {
                    slashLoc = text_gathered.indexOf("/");
                }

                if (slashLoc > 0) {
                    var card = text_gathered.substr(slashLoc + 2, text_gathered.length - slashLoc - 1);
                    var translated_text = text_gathered.substr(0,slashLoc+2) + dict[card];
                } else {
                    translated_text = text_gathered;
                }
            }else if (dict[text_gathered] != undefined) {
                var translated_text = dict[text_gathered];
            } else {
                translated_text = text_gathered;
            }


            var j = 0;
            for (j = 0; j < iterators[i].length; j++) {
                iterators[i].removeChild(iterators[i][j]);
            }
            iterators[i].innerHTML = translated_text;

        } else {
            text_gathered = undefined;
        }

        i++;
    }
}

function translate(iterators,dict){
    var i=0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();
        if (text_gathered != undefined) {
            if (dict[text_gathered] != undefined) {
                var translated_text = dict[text_gathered];
                var j = 0;
                for (j = 0; j < iterators[i].length; j++) {
                    iterators[i].removeChild(iterators[i][j]);
                }
                //var translated_node = $(translated_text);
                //iterators[i].prepend(translated_node);
                iterators[i].innerHTML = translated_text;
            } else {
                text_gathered = undefined;
            }
        } else {
            text_gathered = undefined;
        }
        
        i++;
    }
}

var dictRequestMsg = {
    type: "bgo-translation-query"
};

// ***** 汉化主函数 *****

chrome.extension.sendMessage(dictRequestMsg,
    function(dict) {
        if (dict == null) {
            return;
        }

        //悬停弹出的卡牌完整说明
        var mouse_over = $("ul[id=\"carte\"]");
        var i = 0;
        while (mouse_over[i] != undefined) {
            var p_node = $(mouse_over[i]).find("p");
            translate(p_node, dict);
            i++;
        }

        //卡牌列上卡牌的名字
        //这里要调整一下列宽，设置最小列宽防止中文截断的过于暴力
        var card_title = $("p[class=\"nomCarte\"]");
        var i = 0;
        translate(card_title, dict);
        while (card_title[i] != undefined) {
            if (card_title[i].parentNode.nodeName == "DIV") {
                card_title[i].setAttribute("style", "min-width:60");
            }
            i++;
        }

        //手牌区，事件区等任何横条显示卡牌的地方
        translateWithAgePrefix($("a[class=\"nomCarte tta_production0 tta_production4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_leader0 tta_leader4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_urban0 tta_urban4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_military0 tta_military4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_wonder0 tta_wonder4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_government0 tta_government4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_special0 tta_special4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_action0 tta_action4\"]"), dict);

        translateWithAgePrefix($("a[class=\"nomCarte tta_event1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_aggression1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_war1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_bonus1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_pact1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_tactic1\"]"), dict);

        //建造中的奇迹
        var buildingWonder = $("a[class=\"nomCarte tta_wonder2 tta_wonder1\"]");
        if (buildingWonder[0] != undefined) {
            buildingWonder[0].setAttribute("style", "min-width:60");
            translate(buildingWonder.find("p"), dict);
        }


        //打出事件牌的对话框里事件牌的名字 I / Breakthrough
           translateWithAgePrefix($("p[class=\"tta_action0 titre3\"]"), dict);
	    //上述事件牌的文本： Develop a technology. After you pay the science cost, score 2 science.
           translate($("p[class=\"texte\"]"), dict);
	    //上述事件牌候选项的处理：
        var actionOptionIterator = $("label");
        var i = 0;
	    while (actionOptionIterator[i] != undefined) {
	        var text = $(actionOptionIterator[i]).html();
	        if (text.indexOf("Discover") == 0) {
	            //Discover Swordsmen - 4[Token]
	            var slashLoc = text.indexOf("-");
	            var card = text.substr(9, slashLoc - 9 - 1);
	            actionOptionIterator[i].innerHTML = dict["Discover"] + " " + dict[card] + " " + text.substr(slashLoc);
	        }else if (text.indexOf("Upgrade") == 0) {
	            //Upgrade Agriculture -> Irrigation (2R)
	            var toLoc = text.indexOf(" to ");
	            var arrowLoc = text.indexOf("-");

	            var card1 = dict[text.substr(8, toLoc - 8)];
	            var card2 = dict[text.substr(toLoc +4, arrowLoc - toLoc - 5)];
	            actionOptionIterator[i].innerHTML = dict["Upgrade"] + " " + card1 + " -> " + card2 + " " + text.substr(arrowLoc);
	        }
	        i++;
	    }


	    //政府的名字
        translate($("strong"), dict);

        //玩家科技板上面的科技牌名字
        translate($("li[class=\"nomCarte\"]"), dict);

	    //手牌区的悬停文字
        translate($("p[class=\"libBatiment tta_production0 tta_production4\"]"), dict);
        translate($("p[class=\"libBatiment tta_urban0 tta_urban4\"]"), dict);
        translate($("p[class=\"libBatiment tta_military0 tta_military4\"]"), dict);

	    //玩家科技板悬停时提示文字里的"Cost:"
          var i = 0;
	    var costIterator = $("li[class=\"nombreCarte\"]");
	    while (costIterator[i] != undefined) {
	        var text = $(costIterator[i]).html();
            if (text.indexOf("Cost") == 0) {
                costIterator[i].innerHTML = text.replace("Cost", dict["Cost"]);
            }
	        i++;
	    }

        //事件和牌堆的标题
	    var card_title = $("p[class=\"titre3\"]");
	    translate(card_title, dict);

        //工人区
	    var workerPool = $("div[class=\"worker_pool\"]").find("p").first();
	    if (workerPool[0] != undefined) {
	        workerPool[0].innerHTML = dict["Worker pool"];
	    }

	    //important区（其实就一个Last Turn）
	    var card_title = $("pan[class=\"important\"]");
	    translate(card_title, dict);


	    //手牌区的标题
	    var tdIterator = $("td[class=\"titre1\"]");
	    var i = 0;
	    while (tdIterator[i] != undefined) {
	        var text = $(tdIterator[i]).html();
	        if (text.indexOf("Civil&nbsp;cards") == 0) {
	            var civilCount = text.substr("Civil&nbsp;cards".length);
	            tdIterator[i].innerHTML = dict["Civil cards"] + civilCount;
	        } else if (text.indexOf("Military&nbsp;cards") == 0) {
	            var civilCount = text.substr("Military&nbsp;cards".length);
	            tdIterator[i].innerHTML = dict["Military cards"] + civilCount;
	        }
	        else if (dict[text] != undefined) {
                //Current event played/Future event played
	            tdIterator[i].innerHTML = dict[text];
	        } 
	        i++;
	    }

	    //下拉列表的内容：
	    var actionOptionIterator = $("option");
	    var i = 0;
	    while (actionOptionIterator[i] != undefined) {
	        var text = $(actionOptionIterator[i]).html();
	        if (text.indexOf("Build") == 0) {
	        	//Build关键字的出现可能有多种情况。包括
	        	//Build Iron (5R)
	        	//Build free temple/Build free warrior.
	            //Build 4 stage of Library of Alexandria (1R)
	            if (text.indexOf("stage") == 8) {
	                //Build X stage of Y (XR)
                    //Build [StageCount] stage of [WonderName] ([ResourceCount]R)
	                var resourceLoc1 = text.indexOf("(");
	                var resourceLoc2 = text.indexOf(")");

	                var resourceCount = text.substr(resourceLoc1+1, resourceLoc2 - resourceLoc1-2);
	                var stageCount = text.substr(6, 1);
	                var wonderName = dict[text.substr(17, resourceLoc1 - 17 - 1)];
	                var translatedActionText = dict["Build [StageCount] stage of [WonderName] ([ResourceCount]R)"];
	                if (translatedActionText != undefined) {
	                    actionOptionIterator[i].innerHTML = translatedActionText.replace("[StageCount]", stageCount).replace("[WonderName]", wonderName).replace("[ResourceCount]", resourceCount);
                    }
	            } else if (text.indexOf("(") > 0) {
	                var resourceLoc = text.indexOf("(");
	                var card = text.substr(6, resourceLoc - 6 - 1);
	                actionOptionIterator[i].innerHTML = dict["Build"] + " " + dict[card] + " " + text.substr(resourceLoc);
	            } else if (dict[text]!=undefined) {
	                actionOptionIterator[i].innerHTML = dict[text];
	            }
	        } else if (text.indexOf("Discover") == 0) {
	            var resourceLoc = text.indexOf("(")
	            var card = text.substr(9, resourceLoc - 9 - 1);
	            actionOptionIterator[i].innerHTML = dict["Discover"] + " " + dict[card] + " " + text.substr(resourceLoc);
	        } else if (text.indexOf("Elect") == 0) {
	            //Elect leader: Moses
	            var leaderName = text.substr(14);
	            actionOptionIterator[i].innerHTML = dict["Elect leader"] + " " + dict[leaderName];
	        } else if (text.indexOf("Upgrade") == 0) {
	            //Upgrade Agriculture -> Irrigation (2R)
	            var resourceLoc = text.indexOf("(");
	            var arrowLoc = text.indexOf("-");

	            var card1 = dict[text.substr(8, arrowLoc-9)];
	            var card2 = dict[text.substr(arrowLoc + 6, resourceLoc - arrowLoc -7)];
	            actionOptionIterator[i].innerHTML = dict["Upgrade"] + " " + card1 + " -> " + card2 + " "+text.substr(resourceLoc);
	        } else if (text.indexOf("Play") == 0) {
	        	//Play关键字的出现可能有多种情况。包括
	        	//Play A / Rich Land
	        	//Play event Pestilence
	            //Play event Developed Territory II
	            if (text.indexOf("/") > 0) {
	                //Play A / Rich Land
	                var levelLoc = text.indexOf("/");
	                var card = text.substr(levelLoc + 2);
	                actionOptionIterator[i].innerHTML = dict["Play"] + " " + text.substr(5,  levelLoc - 3) + dict[card];
	            } else if (text.indexOf("Play event") == 0) {
	                if (text.endsWith(" A") || text.endsWith(" I") || text.endsWith(" II") || text.endsWith(" III")) {
	                    var conlonySplit = text.split(" ");
	                    var conlonyName = "";
                        for (var j = 2; j < conlonySplit.length-1; j++) {
                            conlonyName += conlonySplit[j] + " ";
                        }
                        conlonyName=conlonyName.trim();
	                    actionOptionIterator[i].innerHTML = dict["Play conlony"] + " " + dict[conlonyName] + " " + conlonySplit[conlonySplit.length-1];
	                } else {
	                    var eventName = text.substr(11);
	                    actionOptionIterator[i].innerHTML = dict["Play event"] + " " + dict[eventName];
	                }
	            } 
	        } else if (text.indexOf("Declare") == 0) {
	            var warSplit = text.split(" ");
	            var warName = "";
	            for (var j = 1; j < warSplit.length - 1; j++) {
	                warName += warSplit[j] + " ";
	            }
	            warName = warName.trim();
	            actionOptionIterator[i].innerHTML = dict["Declare"] + " " + dict[warName] + " " + warSplit[warSplit.length - 1];
	        } else if (text.indexOf("Increase") == 0) {
	            var resourceLoc = text.indexOf("(")
	            actionOptionIterator[i].innerHTML = dict["Increase population"] + " " + text.substr(resourceLoc);
	        } else if (text.indexOf("Set up new tactics") == 0) {
	            var card = text.substr(21);
	            actionOptionIterator[i].innerHTML = dict["Set up new tactics"] + " " + dict[card];
	        } else if (text.indexOf("Adopt tactics") == 0) {
	            var card = text.substr(16);
	            actionOptionIterator[i].innerHTML = dict["Adopt tactics"] + " " + dict[card];
	        } else if (dict[text] != undefined) {
	            actionOptionIterator[i].innerHTML = dict[text];
	        } else if (text.endsWith(" A") || text.endsWith(" I") || text.endsWith(" II") || text.endsWith(" III")) {
	                //可能是侵略牌
	                var aggressionSplit = text.split(" ");
	                var aggressionName = "";
	                for (var j = 0; j < aggressionSplit.length - 1; j++) {
	                    aggressionName += aggressionSplit[j] + " ";
	                }
	                aggressionName=aggressionName.trim();
	                actionOptionIterator[i].innerHTML = dict[aggressionName] + " " + aggressionSplit[aggressionSplit.length - 1];
	        } else if (text.startsWith("A/") || text.startsWith("I/") || text.startsWith("II/") || text.startsWith("III/")) {
	            //是Disband/Destory的Option
	            var levelLoc = text.indexOf("/");
	            var card = text.substr(levelLoc + 2);
	            actionOptionIterator[i].innerHTML = text.substr(0, levelLoc+2) + dict[card];
	        } else{
	                actionOptionIterator[i].innerHTML = actionOptionIterator[i].innerHTML;
	            
	        }

	        i++;
	    }

	    var actionOptionIterator = $("optgroup");
	    var i = 0;
	    while (actionOptionIterator[i] != undefined) {
	        var text = actionOptionIterator[i].getAttribute("label");
	        if (dict[text] != undefined) {
	            actionOptionIterator[i].setAttribute("label", dict[text]);
	        }

	        i++;
	    }
	    //

	}
);
