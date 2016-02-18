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
** 把卡牌列复制到每个玩家的面板上
**
** ************************/
var card_row = $("div[id=\"card_row\"]");
if (card_row[0] != undefined) {

    var originalCardRow = card_row.clone();

    var temp_card_row = card_row.clone(true);
    var card_row_cards = temp_card_row.find("td");
    var j = 0;
    var removedCards = 3;
    while (card_row_cards[j] != undefined) {
        if ($(card_row_cards[j]).find("a")[0] != undefined) {
            if (j >= 1 && j <= 3) {
                $(card_row_cards[j]).remove();
            } else {
                var propValue = $(card_row_cards[j]).find("a")[0].getAttribute("class");
                if (propValue.indexOf("carteEnMain") >= 0) {
                    $(card_row_cards[j]).remove();
                    if (j > 3) {
                        removedCards++;
                    }
                } else {
                    propValue =  propValue.replace("carteNonPiochable", "carteMasquee")
                    $(card_row_cards[j]).find("a")[0].setAttribute("class", propValue);
                }
            }
        }
        j++;
    }

    var seperator = temp_card_row.find("td[class=\"fond3\"]");
    var pattern = $(
'<td class="tdMidC fond1" width="70"><form method="post" id="piocherCarte34" action="index.php?cnt=202&amp;msg=248&amp;pl=7305168&amp;nat=1&amp;cd=34"><input type="hidden" name="idNote" value="5"><input type="hidden" name="idMsgChat" value=""><p class="titre3">&nbsp;</p><ul id="carteRangee"><li><a class="tta_nocard0 "><p class="ageCarte ageCarte1x">&nbsp;</p><div class="fondCarte tta_nocard1"><p class="nomCarte" style="min-width:60">New Card<br></p></div><p class="piedCarte ageCarte1x">&nbsp;</p></a></li></ul><p>&nbsp;</p></form></td>');
    /*pattern.find("p[class=\"titre3\"]")[0].innerHTML = "&nbsp;";
    pattern.find("p[class=\"titre3\"]")[0].setAttribute("class", "ageCarte ageCarte1x");
    pattern.find("p[class=\"nombre\"]")[0].innerHTML = "&nbsp;";
    pattern.find("p[class=\"nombre\"]")[0].setAttribute("class", "piedCarte ageCarte1x");
    pattern.find("p[class=\"ageDosCarte\"]")[0].innerHTML = "N";
    pattern.find("p[class=\"ageDosCarte\"]")[0].setAttribute("class", "nomCarte");*/
    while (removedCards > 0) {
        var element = $("")
        pattern.clone(true).insertBefore(seperator);
        removedCards--;
    }

    //fond重算
    var j = 0;
    var card_row_cards = temp_card_row.find("td");
    while (card_row_cards[j] != undefined) {
        if (j < 6) {
            card_row_cards[j].setAttribute("class","tdMidC fond1")
        }
        if (j >= 6 && j<10) {
            card_row_cards[j].setAttribute("class", "tdMidC fond2")
        }
        if (j >= 10) {
            card_row_cards[j].setAttribute("class", "tdMidC fond3")
        }
        j++;
        if (j > 13) {
            break;
        }
    }

    var new_card_tr = $("<tr></tr>");
    var new_card_td = $("<td colspan=\"2\"></td>");
    new_card_td.append(temp_card_row.clone(true));
    new_card_tr.append(new_card_td.clone(true));

    var old_card_tr = $("<tr></tr>");
    var old_card_td = $("<td colspan=\"2\"></td>");
    old_card_td.append(originalCardRow.clone(true));
    old_card_tr.append(old_card_td.clone(true));

    var player2table = $("div[id=\"Plateau" + (3 - msg.playerNo) + "\"]").first().find("table").first().find("tbody").first();
    var myPlayertable = $("div[id=\"Plateau" + (msg.playerNo) + "\"]").first().find("table").first().find("tbody").first();
    if (msg.currentPlayer != msg.playerName) {
        myPlayertable.prepend(new_card_tr.clone(true));
        card_row.remove();
        player2table.prepend(old_card_tr.clone(true))
    } else {
        //myPlayertable.prepend(old_card_tr.clone(true));
        player2table.prepend(new_card_tr.clone(true))
    }
}


/** ***********************
**
** 把Discard Pile复制过来
**
** ************************/

var menuSelector = $("a");
var discardPileFrame = undefined;
var currentTitle = document.title;
function discardPileOperate()
{
    if (discardPileFrame != undefined) {
        document.title = currentTitle;

        var innerDocument = $(discardPileFrame[0].contentDocument);
        var civilCardtable = innerDocument.find("tr[id=\"civilCards\"]");
        //decideCurrentAge
        var ageStr = msg.age;
        ageStr=ageStr.split(" ")[1];
        if (ageEnum[ageStr] != undefined) {
            var ageNum = ageEnum[ageStr];
            if (ageNum <=3) {
                var tdElement = civilCardtable.find("td[class=\"tdTop\"]")[ageNum];
                var tableElement = $(tdElement).find("table").first().clone(true);
                //<table width=\"80%\" class=\"tableau\"><tbody><tr id=\"civilCards\">\"</tr></tbody></table>

                var j = 0;
                var deletedUls = tableElement.find("ul[id=\"carte\"]");
                while (deletedUls[j] != undefined) {
                    $(deletedUls[j]).remove();
                    j++;
                }

                //移除表头
                tableElement.find("td").first().remove();

                //检查卡牌列
                var cardRowContent = [];
                if (card_row != undefined) {
                    var card_row_cards = card_row.find("a");
                    var j = 0;
                    while (card_row_cards[j] != undefined) {
                        if (card_row_cards[j].getAttribute("class").indexOf("carteEnMain") < 0) {
                            var cardA = $(card_row_cards[j]).find("p[class=\"nomCarte\"]")[0];
                            if (cardA != undefined) {
                                cardRowContent[cardRowContent.length] = cardA.innerHTML.substr(0, cardA.innerHTML.length - 4);
                            } else {
                                cardA = cardA;
                            }
                        }
                        j++;
                    }
                }

                var tableTDs = tableElement.find("td");
                tableElement = $("<table class=\"tableau0\"></table>")
                //重排表格，改为三列
                var j = 0;
                var k = 0;
                var currentTr=$("<tr></tr>")
                while (tableTDs[j] != undefined) {
                    if ($(tableTDs[j]).find("a")[0].getAttribute("class").indexOf("0") > 0) {
                        var cardName = $(tableTDs[j]).find("a")[0].innerHTML;
                        if (translationDictionary != undefined) {
                            var cardName = translationDictionary[$(tableTDs[j]).find("a")[0].innerHTML];
                            if (cardName != undefined) {
                                $(tableTDs[j]).find("a")[0].innerHTML = cardName;
                            }
                        }
                        if (cardRowContent.indexOf(cardName) >= 0) {
                            cardRowContent[cardRowContent.indexOf(cardName)] = "";
                        } else {
                            tableTDs[j].setAttribute("width", "25%");
                            currentTr.append(tableTDs[j]);
                            k++;
                        }
                    }

                    if (k % 4 == 0) {
                        tableElement.append(currentTr);
                        currentTr = $("<tr></tr>")
                    }
                    j++;
                }
                tableElement.append(currentTr);

                var popup = $("<ul id=\"carte\" style=\"width:20%\"><a class=\"paquet dosCarteCivile\" style=\"box-shadow:0px 6px 1px #444;\"></a></ul>");
                popup.find("a").first().append(tableElement);

                $("a[class=\"paquet dosCarteCivile\"]").parent().append(popup);


            }
        }
    }
}
    
var i = 0;
while (menuSelector[i]!=undefined) {
    if (menuSelector[i].innerHTML == "View discard pile") {
        var link = menuSelector[i].getAttribute("href");
        // onload=\"discardPileOperate();\"
        discardPileFrame = $("<iframe id = \"bgo-extension-discard-pile\" src=\"" + link + "\" border=\"1\" frameborder=\"1\" width=\"0\" height=\"0\"></iframe>")
        discardPileFrame.get(0).addEventListener('load', function () {
            discardPileOperate();
        });
        $("body").append(discardPileFrame);
        break;
    }
    i++;
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


