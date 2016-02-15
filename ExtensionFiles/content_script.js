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
//收集文本
//gather_text($("a[class=\"nomCarte tta_war1\"]"));
//gather_text($("a[class=\"nomCarte tta_aggression1\"]"));
gather_text($("p[class=\"texteCarte\"]"));

localStorage["gathered_text_list"]=gathered_text_list;

function replaceAll(source, key, value) {
    var searchKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return source.replace(new RegExp(searchKey, 'g'), value);
}

function translate(iterators,dict){
    var i=0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        text_gathered = replaceAll(text_gathered, "\n", "");
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

chrome.extension.sendMessage(dictRequestMsg,
	function (dict){
        if(dict == null){
            return;
        }
        
           var mouse_over=$("ul[id=\"carte\"]");
	       var i=0;
            while (mouse_over[i] != undefined) {
                var p_node = $(mouse_over[i]).find("p");
                translate(p_node,dict);
           	    i++;
           }
            
           var card_title = $("p[class=\"nomCarte\"]");
           var i=0;
           translate(card_title,dict);
           while (card_title[i] != undefined) {
                if(card_title[i].parentNode.nodeName == "DIV"){
                    card_title[i].setAttribute("style","min-width:60");
                }
                i++;
           }

        //Hand
           translate($("a[class=\"nomCarte tta_production0 tta_production4\"]"), dict);
           translate($("a[class=\"nomCarte tta_leader0 tta_leader4\"]"), dict);
           translate($("a[class=\"nomCarte tta_urban0 tta_urban4\"]"), dict);
           translate($("a[class=\"nomCarte tta_military0 tta_military4\"]"), dict);
           translate($("a[class=\"nomCarte tta_wonder0 tta_wonder4\"]"), dict);
           translate($("a[class=\"nomCarte tta_government0 tta_government4\"]"), dict);
           translate($("a[class=\"nomCarte tta_special0 tta_special4\"]"), dict);
           translate($("a[class=\"nomCarte tta_action0 tta_action4\"]"), dict);

           translate($("a[class=\"nomCarte tta_event1\"]"), dict);
           translate($("a[class=\"nomCarte tta_aggression1\"]"), dict);
           translate($("a[class=\"nomCarte tta_war1\"]"), dict);
           translate($("a[class=\"nomCarte tta_bonus1\"]"), dict);
           translate($("a[class=\"nomCarte tta_pact1\"]"), dict);
           translate($("a[class=\"nomCarte tta_tactic1\"]"), dict);

	    //Gov
           translate($("strong"), dict);

           translate($("li[class=\"nomCarte\"]"), dict);

	    //Webpage element
	    //1. Cost:
          var i = 0;
	    var costIterator = $("li[class=\"nombreCarte\"]");
	    while (costIterator[i] != undefined) {
	        var text = $(costIterator[i]).html();
            if (text.indexOf("Cost") == 0) {
                costIterator[i].innerHTML = text.replace("Cost", dict["Cost"]);
            }
	        i++;
	    }

        //Card Row title
	    var card_title = $("p[class=\"titre3\"]");
	    translate(card_title, dict);

        //Worker Pool
	    var workerPool = $("div[class=\"worker_pool\"]").find("p").first();
	    workerPool[0].innerHTML = dict["Worker pool"];

	    //important
	    var card_title = $("pan[class=\"important\"]");
	    translate(card_title, dict);

        //Board Title
	    translate($("p[class=\"libBatiment tta_production0 tta_production4\"]"), dict);
	    translate($("p[class=\"libBatiment tta_urban0 tta_urban4\"]"), dict);
	    translate($("p[class=\"libBatiment tta_military0 tta_military4\"]"), dict);

	    //
	    var tdIterator = $("td[class=\"titre1\"]");
	    var i = 0;
	    while (tdIterator[i] != undefined) {
	        var text = $(tdIterator[i]).html();
	        if (text.indexOf("Civil&nbsp;cards&nbsp;") == 0) {
	            var civilCount = text.substr("Civil&nbsp;cards&nbsp;".length);
	            tdIterator[i].innerHTML = dict["Civil cards"] + " " + civilCount;
	        }
	        else if (dict[text] != undefined) {
	            tdIterator[i].innerHTML = dict[text];
	        } 
	        i++;
	    }

	    //Action  options:
	    var actionOptionIterator = $("option");
	    var i = 0;
	    while (actionOptionIterator[i] != undefined) {
	        var text = $(actionOptionIterator[i]).html();
	        if (text.indexOf("Play event") == 0) {
	            var eventName = text.substr(11);
	            actionOptionIterator[i].innerHTML = dict["Play event"] + " " + dict[eventName];
	        } else if (text.indexOf("Build") == 0) {
	            var resourceLoc = text.indexOf("(")
	            var card = text.substr(6, resourceLoc - 6 - 1);
	            actionOptionIterator[i].innerHTML = dict["Build"] + " " + dict[card] + " " + text.substr(resourceLoc);
	        } else if (text.indexOf("Discover") == 0) {
	            var resourceLoc = text.indexOf("(")
	            var card = text.substr(9, resourceLoc - 9 - 1);
	            actionOptionIterator[i].innerHTML = dict["Discover"] + " " + dict[card] + " " + text.substr(resourceLoc);
	        } else if (text.indexOf("Play") == 0) {
	            var levelLoc = text.indexOf("/")
	            var card = text.substr(levelLoc+2);
	            actionOptionIterator[i].innerHTML = dict["Play"] +" "+ text.substr(5, text.length-levelLoc ) + dict[card];
	        }  else if (text.indexOf("Set up new tactics") == 0) {
	            var card = text.substr(21);
	            actionOptionIterator[i].innerHTML = dict["Set up new tactics"] + " " + dict[card];
	        } else if (text.indexOf("Adopt tactics") == 0) {
	            var card = text.substr(16);
	            actionOptionIterator[i].innerHTML = dict["Adopt tactics"] + " " + dict[card];
	        } else if (dict[text] != undefined) {
	            actionOptionIterator[i].innerHTML = dict[text];
	        } else {
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