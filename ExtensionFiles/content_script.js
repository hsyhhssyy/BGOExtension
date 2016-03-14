/** ***********************
**
** 获得当前玩家的相关信息，构造msg传给后台以供显示
**
** ************************/

(function() {

    var combo = $("form[id=\"formAction\"]");

    var infoMsg = {
        type: "bgo-board-information",
        playerName: $("span[class=\"nom\"]").text().replace(/\s/g, " "),
        url: document.URL,
    };
    chrome.runtime.sendMessage(ttaBoardInformation);

    //账号玩家的名字
    ttaBoardInformation.playerName = $("span[class=\"nom\"]").text().replace(/\s/g, " ");
    //当前游戏的时代，A I II III IV
    ttaBoardInformation.age = $("span[class=\"infoModule\"]").text();
    //游戏中所有的玩家，按玩家行动顺序，注意不包括自己
    ttaBoardInformation.rivals = [];
    //当前最后一条标题消息，为英文
    ttaBoardInformation.message = $("td[class=\"titre3\"]").first().text();
    //当前正在行动的玩家，是根据标题解析的
    ttaBoardInformation.currentPlayer = $("td[class=\"titre3\"]").first().find('span').first().html();
    //最后一个行动的内容，也是根据标题解析的
    ttaBoardInformation.lastAction = $("td[class=\"titreNote\"]").first().text();
    //账号玩家的行动序号
    ttaBoardInformation.playerNo = null;
    //当前可用的行动数
    ttaBoardInformation.listbox = combo.length;
    //页面的url
    ttaBoardInformation.url = document.URL;


    //填充player list
    var player_name_table = $($('div[id="contenu"] > table[class="tableau0"]'))[0];
    player_name_table = $(player_name_table);
    var player_names = player_name_table.find("ul[id=\"indJoueur\"]");
    
    for (var i = 0;player_names[i] != undefined;i++) {
        var name = $(player_names[i]).find("li").contents().get(0).nodeValue;

        if (name == undefined || name == null) {
            continue;
        }
        if (name.valueOf() == ttaBoardInformation.playerName.valueOf()) {
            ttaBoardInformation.playerNo = i / 2 + 1;
        } else {
            if (name.valueOf() != "Journal"
                && name.valueOf() != "Chat"
                && (!name.valueOf().endsWith(" "))) {
                ttaBoardInformation.rivals.push(name);
            }
        }
    }

    ttaBoardInformation.players = player_names;


    var cfgRequestMsg = {
        type: "bgo-configuration-query"
    };


    chrome.extension.sendMessage(cfgRequestMsg,
        function (config) {
            ttaBoardInformation.config = config;
            ttaBoardInformation.executeReady.onReady(ttaBoardInformation);
        });
}());

/** ***********************
**
** 修改页面标题
**
** ************************/

(function() {

    if (ttaBoardInformation.rivals[0] != undefined) {
        if (document.title.indexOf("(") == 0) {
            document.title = document.title.split(" ")[0] + " vs " + ttaBoardInformation.rivals[0] + " (Boardgaming-Online)";
        } else {
            document.title = " vs " + ttaBoardInformation.rivals[0] + " (Boardgaming-Online)";
        }
    }
}());

/** ***********************
**
** Saved note 支持中文
**
** ************************/
(function() {

    var savedNote = $("textarea[name=\"noteJoueur\"]");
    if (savedNote[0] != undefined) {
        var txt = savedNote[0].value
        var convert = $("<p>" + txt + "</p>")
        txt = convert[0].innerHTML;
        savedNote[0].value = txt;
    }

}());

