
function setCheckboxValue(messageName) {
    $("#" + messageName).get(0).checked = (localStorage['chrome.bgo-extension.' + messageName] == "true");
}

function registerCheckBox(messageName) {
    $("#" + messageName).get(0).addEventListener('click', function () {
        localStorage['chrome.bgo-extension.' + messageName] = $("#" + messageName).get(0).checked;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    //Get background data
    var data = chrome.extension.getBackgroundPage().bgoData;
    if (data.error) {
        $("#message").text(data.error);
        $("#content").hide();
    } else {
        $("#message").hide();
        $("#content-player-name").text(data.playerName);
        $("#content-action-count").text(data.listbox);
        $("#content-player-no").text(data.playerNo);
        $("#content-message").text(data.message);
        $("#content-last-action").text(data.lastAction);
        $("#activate-refresh").get(0).checked = (localStorage['chrome.bgo-extension.auto-refresh'] == "true");
        $("#refresh-interval").get(0).value = localStorage['chrome.bgo-extension.refresh-interval'];
	    $("#translate-language").get(0).value = localStorage['chrome.bgo-extension.translate-language'];

        //$("#notification-global-enabled").get(0).checked = (localStorage['chrome.bgo-extension.notification-global-enabled'] == "true");
        setCheckboxValue("notification-global-enabled");
        setCheckboxValue("notification-your-turn");
        setCheckboxValue("notification-action-update");
        setCheckboxValue("notification-end-of-game");

        setCheckboxValue("beep-global-enabled");
        setCheckboxValue("beep-your-turn");
        setCheckboxValue("beep-action-update");
        setCheckboxValue("beep-end-of-game");

        setCheckboxValue("advanced-card-row");
        setCheckboxValue("advanced-card-row-sim-next-turn");
        setCheckboxValue("advanced-card-row-active-player-disp-current");
        setCheckboxValue("advanced-card-row-not-on-last-turn");

        setCheckboxValue("check-confirm-end-turn-by-default");
        setCheckboxValue("check-confirm-end-turn-by-default-except");
    }

    //bind actions
    $("#activate-refresh").get(0).addEventListener('click', function () {
        localStorage['chrome.bgo-extension.auto-refresh'] = $("#activate-refresh").get(0).checked;
    });
    
    $("#translate-language").get(0).addEventListener('change', function () {
        localStorage['chrome.bgo-extension.translate-language'] = $("#translate-language").get(0).value;
    });

    var refreshIntervalCheck = function () {
        var interval_value = $("#refresh-interval").get(0).value;
        interval_value = interval_value.replace(/[^\d]/g, '');
        if (interval_value != "" && interval_value > 0) {
            localStorage['chrome.bgo-extension.refresh-interval'] = interval_value;
        } else if (interval_value != "") {
            interval_value = localStorage['chrome.bgo-extension.refresh-interval'];
        }
        $("#refresh-interval").get(0).value = interval_value;
    };
    $("#refresh-interval").get(0).addEventListener('keyup', refreshIntervalCheck);
    $("#refresh-interval").get(0).addEventListener('afterpaste', refreshIntervalCheck);

    registerCheckBox("notification-global-enabled");
    registerCheckBox("notification-your-turn");
    registerCheckBox("notification-action-update");
    registerCheckBox("notification-end-of-game");

    registerCheckBox("beep-global-enabled");
    registerCheckBox("beep-your-turn");
    registerCheckBox("beep-action-update");
    registerCheckBox("beep-end-of-game");

    registerCheckBox("advanced-card-row");
    registerCheckBox("advanced-card-row-sim-next-turn");
    registerCheckBox("advanced-card-row-active-player-disp-current");
    registerCheckBox("advanced-card-row-not-on-last-turn");

    registerCheckBox("check-confirm-end-turn-by-default");
    registerCheckBox("check-confirm-end-turn-by-default-except");

});
