var playerColors = ["Unknown", "Orange", "Purple", "Green", "Red"];
//get current player
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

//find player list
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

//Copy deck row to everyone's panel
if (card_row == undefined) {
    var card_row = $("div[id=\"card_row\"]");
    var card_tr = $("<tr></tr>");
    var card_td = $("<td colspan=\"2\"></td>");
    card_td.append(card_row.clone(true));
    card_tr.append(card_td.clone(true));
    var player2table = $("div[id=\"Plateau" + (3 - msg.playerNo) + "\"]").first().find("table").first().find("tbody").first();
    player2table.prepend(card_tr.clone(true))
}

//send the package
chrome.runtime.sendMessage(msg);

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


//汉化部分
var dictionary //= localStorage["tta_dictonary"];
if(dictionary == undefined){
    dictionary = [];
}
var gathered_text_list = "";

function gather_text(iterators){
    var i=0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        if(text_gathered != undefined){
            if(dictionary.indexOf(text_gathered)<0){
                dictionary.push(text_gathered);
                gathered_text_list += ("<SEP>"+text_gathered);
            }
        }else{
            text_gathered=text_gathered;
        }
        
        i++;
    }
}
//收集原文本 <p> <li>
//卡排列 面板标题
//gather_text($("p[class=\"nomCarte\"]"));

//鼠标提示卡文本
var mouse_over=$("ul[id=\"carte\"]");
var i=0;
    while (mouse_over[i] != undefined) {
        gather_text($(mouse_over[i]).find("p"));
        i++;
}
//gather_text($("p[class=\"tta_wonder1 nomCarte nomCarteCivile\"]"));
//gather_text($("p[class=\"tta_leader1 nomCarte nomCarteCivile\"]"));
//gather_text($("p[class=\"tta_urban1 nomCarte nomCarteCivile\"]"));
//gather_text($("p[class=\"tta_action1 nomCarte nomCarteCivile\"]"));
//gather_text($("p[class=\"tta_military1 nomCarte nomCarteCivile\"]"));

localStorage["tta_dictonary"]=dictionary;
localStorage["gathered_text_list"]=gathered_text_list;