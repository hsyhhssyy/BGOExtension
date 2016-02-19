var playerColors = ["Unknown", "Orange", "Purple", "Green", "Red"];
var ageEnum = {
    A: 0,
    I: 1,
    II:2,
    III:3,
    IV:4
}


if (typeof String.prototype.removeCharacterEntities != 'function') {
    String.prototype.removeCharacterEntities = function () {
        var txt = this.toString();
        var convert = $("<p>" + txt + "</p>")
        txt = convert[0].innerHTML.replaceAll("&nbsp;", " ");

        var empty_obj = {};
        empty_obj[txt] = 0;
        for (var name in empty_obj) {
            txt = name;
        }
        return txt;
    };
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.indexOf(prefix) == 0;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (key, value) {
        var searchKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return this.replace(new RegExp(searchKey, 'g'), value);
    };
}
if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
    }
}

/** ***********************
**
** 获得当前玩家的相关信息，构造msg传给后台以供显示
**
** ************************/
var combo = $("form[id=\"formAction\"]");
var boardInfo = $("div").first();
var msg = {
    type: "bgo-board-information",
    playerName: $("span[class=\"nom\"]").text().replace(/\s/g, " "),
    age:$("span[class=\"infoModule\"]").text(),
    rivals: [],
    message: $("td[class=\"titre3\"]").first().text(),
    currentPlayer: $("td[class=\"titre3\"]").first().find('span').first().html(),
    lastAction: $("td[class=\"titreNote\"]").first().text(),
    listbox: combo.length,
    url: document.URL
};

//为msg填充player list
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

chrome.runtime.sendMessage(msg);

/** ***********************
**
** 修改页面标题
**
** ************************/
if (msg.rivals[0] != undefined) {
    if (document.title.indexOf("(") == 0) {
        document.title = document.title.split(" ")[0] + " vs " + msg.rivals[0] + " (Boardgaming-Online)";
    } else {
        document.title = " vs " + msg.rivals[0] + " (Boardgaming-Online)";
    }
}


/** ***********************
**
** Saved note 支持中文
**
** ************************/

var savedNote = $("textarea[name=\"noteJoueur\"]");
if (savedNote[0] != undefined) {
    var txt = savedNote[0].value
    var convert = $("<p>" + txt + "</p>")
    txt = convert[0].innerHTML;
    savedNote[0].value = txt;
}


