/** ***********************
**
** 自动勾上结束回合
**
** ************************/

var cfgRequestMsg = {
    type: "bgo-configuration-query"
};


chrome.extension.sendMessage(cfgRequestMsg,
    function(config) {

        var endTurnCheckbox = $('input[id="confirmEndTurn"]');

        if (config["chrome.bgo-extension.check-confirm-end-turn-by-default"] == "true") {

            //confirmEndTurn
            var msgLabel = $('label[for="confirmEndTurn"]');
            var msgLabelMsg = msgLabel.html();

            if (config["chrome.bgo-extension.check-confirm-end-turn-by-default-except"] != "true" || msgLabelMsg == "Check to confirm end of turn") {
                endTurnCheckbox[0].checked = true;
            }
        }

    });