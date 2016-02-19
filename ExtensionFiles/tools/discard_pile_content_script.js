
/** ***********************
**
** 把Discard Pile复制过来
**
** ************************/

var dictRequestMsg = {
    type: "bgo-translation-query"
};

chrome.extension.sendMessage(dictRequestMsg,
    function (translationDictionary) {

        //先确认一下card row的修改是否执行了
        var card_row = $("div[id=\"card_row\"]").first();
        if (originalCardRow != undefined) {
            card_row = originalCardRow;
        }

        var menuSelector = $("a");
        var discardPileFrame = undefined;
        var currentTitle = document.title;
        function discardPileOperate() {
            if (discardPileFrame != undefined) {
                document.title = currentTitle;

                var innerDocument = $(discardPileFrame[0].contentDocument);
                var civilCardtable = innerDocument.find("tr[id=\"civilCards\"]");
                //decideCurrentAge
                var ageStr = msg.age;
                ageStr = ageStr.split(" ")[1];
                if (ageEnum[ageStr] != undefined) {
                    var ageNum = ageEnum[ageStr];
                    if (ageNum <= 3) {
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
                        var currentTr = $("<tr></tr>")
                        while (tableTDs[j] != undefined) {
                            if ($(tableTDs[j]).find("a")[0].getAttribute("class").indexOf("0") > 0) {
                                var cardName = $(tableTDs[j]).find("a")[0].innerHTML;
                                var translatedCardName = cardName;
                                if (translationDictionary != undefined) {
                                    var translatedCardName = translationDictionary[$(tableTDs[j]).find("a")[0].innerHTML];
                                    if (translatedCardName != undefined) {
                                        $(tableTDs[j]).find("a")[0].innerHTML = translatedCardName;
                                    }
                                }
                                if (cardRowContent.indexOf(cardName) >= 0 || cardRowContent.indexOf(translatedCardName)>=0) {
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
        while (menuSelector[i] != undefined) {
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



    });