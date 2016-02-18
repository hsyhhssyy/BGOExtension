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
        audioElement.setAttribute("src", chrome.extension.getURL("alert_refresh/alert.m4a"));
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