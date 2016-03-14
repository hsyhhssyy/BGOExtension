/** ***********************
**
** 把殖民地事件和普通事件区分开
**
** ************************/

extensionTools.executeReady(ttaBoardInformation,function() {

    if (ttaBoardInformation.config["chrome.bgo-extension.option-box-enhancement"] != "true"
        || ttaBoardInformation.config["chrome.bgo-extension.option-box-enhancement-seperate-colony-event"] != "true") {
        return;
    }

    var actionSelect = $('select[name="action"]');
    var optionIterator = actionSelect.find("option");
    
    var optionToMove = [];

    for (var i = 0; optionIterator[i] != undefined; i ++) {
        var optionNode = optionIterator[i];

        var optionJQS = $(optionNode);

        var optionText = optionNode.innerHTML;

        if (optionText.indexOf("Play event") >= 0) {
            if (optionText.endsWith(" A") || optionText.endsWith(" I") || optionText.endsWith(" II") || optionText.endsWith(" III")) {
                optionToMove[optionToMove.length] = optionNode;
            }
        }

    }

    if (optionToMove.length > 0) {
        var colonyGroup = $('<optgroup label="Colony"/>');

        for (var i = 0; optionToMove[i] != undefined; i++) {
            $(optionToMove[i]).remove();
            colonyGroup.append($(optionToMove[i]).clone());
            
        }

        var optEvent = actionSelect.find('optgroup[label="Event"]');
        actionSelect[0].insertBefore(colonyGroup[0],optEvent[0]);
    }

});