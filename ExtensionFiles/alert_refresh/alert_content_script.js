/** ***********************
**
** 自动刷新和提示
**
** ************************/


(function() {

    var cfgRequestMsg = {
        type: "bgo-configuration-query"
    };

    

    chrome.extension.sendMessage(cfgRequestMsg,
        function(config) {
            //Auto refresh
            if (ttaBoardInformation.listbox == 0) {
                if (ttaBoardInformation.message != "" && (!ttaBoardInformation.message.startsWith("End of"))) { // check if we are in game webpage
                    if (config['chrome.bgo-extension.auto-refresh'] == "true") {
                        var refresh_interval = config['chrome.bgo-extension.refresh-interval'] * 1000;
                        setTimeout('extensionTools.jumpurl()', refresh_interval);
                    }
                }
            }

            var notificate = "";
            var beep = false;

            //1. Your Turn
            if (ttaBoardInformation.listbox > 0) {
                if (ttaBoardInformation.message.startsWith("Political Phase") ||
                        ttaBoardInformation.message.startsWith("Aggression") ||
                        ttaBoardInformation.message.startsWith("Colonize") ||
                        ttaBoardInformation.message.startsWith("Send Colonists") ||
                        ttaBoardInformation.message.startsWith("Event")
                ) {
                    if (config['chrome.bgo-extension.notification-your-turn'] == "true") {
                        notificate = 'Your rival [' + ttaBoardInformation.rivals[0] + "] is waiting for you.";
                    }
                    if (config['chrome.bgo-extension.beep-your-turn'] == "true") {
                        beep = true;
                    }
                }

                if (ttaBoardInformation.message.startsWith("Action")
                    && ttaBoardInformation.lastAction != ""
                    && (!ttaBoardInformation.lastAction.startsWith(playerColors[ttaBoardInformation.playerNo]))) {
                    if (config['chrome.bgo-extension.notification-your-turn'] == "true") {
                        notificate = ttaBoardInformation.lastAction;
                    }
                    if (config['chrome.bgo-extension.beep-your-turn'] == "true") {
                        beep = true;
                    }
                }
            }

            //2. Action Update
            if (ttaBoardInformation.message.startsWith("Action")
                && ttaBoardInformation.lastAction != ""
                && ttaBoardInformation.lastAction.startsWith(playerColors[ttaBoardInformation.playerNo])) {
                if (config['chrome.bgo-extension.notification-action-update'] == "true") {
                    notificate = ttaBoardInformation.lastAction;
                }
                if (config['chrome.bgo-extension.beep-action-update'] == "true") {
                    beep = true;
                }
            }

            //3.End of Game
            if (ttaBoardInformation.message.startsWith("End of")) {
                if (config['chrome.bgo-extension.notification-end-of-game'] == "true") {
                    notificate = "Your game has end. " + ttaBoardInformation.lastAction;
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
                        notification.onclick = function() {
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

}());