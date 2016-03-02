/** ***********************
**
** 自动勾上结束回合
**
** ************************/

extensionTools.executeReady(ttaBoardInformation,
    function () {

        var endTurnCheckbox = $('input[id="confirmEndTurn"]');

        if (ttaBoardInformation.config["chrome.bgo-extension.check-confirm-end-turn-by-default"] == "true") {

            //confirmEndTurn
            var msgLabel = $('label[for="confirmEndTurn"]');
            var msgLabelMsg = msgLabel.html();

            if (ttaBoardInformation.config["chrome.bgo-extension.check-confirm-end-turn-by-default-except"] != "true" || msgLabelMsg == "Check to confirm end of turn") {
                endTurnCheckbox[0].checked = true;
            }
        }

    });