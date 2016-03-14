/** ***********************
**
** 给腐败状态栏加入文本提示
**
** ************************/

//statusBar
extensionTools.executeReady(ttaTranslation, function () {

    var player_name_table = $($('div[id="contenu"] > table[class="tableau0"]'))[0];
    player_name_table = $(player_name_table);
    var player_names = player_name_table.find("ul[id=\"indJoueur\"]");

    var colorIndex = 1;
    for (var i = 0; player_names[i] != undefined; i++) {
        var name = $(player_names[i]).find("li").contents().get(0).nodeValue;

        if (name == undefined || name == null) {
            continue;
        }
        if (name.valueOf().endsWith(" ")) {
            continue;
        } else if (name.valueOf() == "Journal" || name.valueOf() == "Chat") {
            break;
        } else {
            $(player_names[i]).find("li").contents().get(0).nodeValue = name + " - " + ttaTranslation.getTranslatedText(playerColors[colorIndex]);
            colorIndex++;
        }
    }

});