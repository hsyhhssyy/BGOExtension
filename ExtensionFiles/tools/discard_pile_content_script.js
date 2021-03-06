﻿
/** ***********************
**
** 把Discard Pile复制过来
**
** ************************/

extensionTools.executeReady(ttaTranslation,function() {

    var translationDictionary = ttaTranslation.dictionary;

    //先确认一下card row的修改是否执行了
    var card_row = $("div[id=\"card_row\"]").first();
    if (ttaBoardInformation.cardRow != undefined) {
        card_row = ttaBoardInformation.cardRow;
    }

    var popupParents = $("a[class=\"paquet dosCarteCivile\"]");//.parent();

    var popup = $("<ul id=\"carte\" style=\"width:20%\"><a class=\"paquet dosCarteCivile\" style=\"box-shadow:0px 6px 1px #444;\"></a></ul>");
    var messageBox = $('<p class="ageDosCarte">Loading......</p>');
    popup.find("a").first().append(messageBox);
    for(var i=0;popupParents[i] != undefined;i++) {
        $(popupParents[i]).parent().append(popup.clone());
    }

    var menuSelector = $("a");
    var discardPileFrame = undefined;

    function discardPileOperate(discardPileFrame,innerDocument) {
        if (discardPileFrame != undefined) {

            //var innerDocument = $(discardPileFrame[0].contentDocument);
            var civilCardtable = innerDocument.find("tr[id=\"civilCards\"]");

            //获得系统给出的张数
            var actualCardCount = parseInt($(popupParents[0]).parent().parent().parent().find('p[class="nombre"]').html());
            if (actualCardCount == NaN) {
                return;
            }

            //decideCurrentAge
            var ageStr = ttaBoardInformation.age;
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
                                    var ageTitle = $(card_row_cards[j]).find("p[class=\"ageCarte ageCarte1x\"]")[0];
                                    if (ageTitle == undefined || ageTitle.innerHTML == ageStr) {
                                        
                                        cardRowContent[cardRowContent.length] = ttaTranslation.getTranslatedText(cardA.innerHTML.substr(0, cardA.innerHTML.length - 4));
                                    }
                                } else {
                                    cardA = cardA;
                                }
                            }


                            j++;
                        }
                    }

                    var tableTDs = tableElement.find("td");

                    tableElement = $("<table class=\"tableau0\"></table>")
                    tableElement.append($('<tr><td width="25%" colspan="4"><p class="ageCarte ageCarte1x">Card Deck Inspector (Beta)</p></td></tr>'));

                    //重排表格，改为三列
                    var j = 0;
                    var k = 0;
                    var currentTr = $("<tr></tr>")
                    while (tableTDs[j] != undefined) {
                        if ($(tableTDs[j]).find("a")[0].getAttribute("class").indexOf("0") > 0) {
                            var cardName = ttaTranslation.getTranslatedText($(tableTDs[j]).find("a")[0].innerHTML);

                            $(tableTDs[j]).find("a")[0].innerHTML = cardName;
                            
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

                    messageBox.remove();

                    if (k != actualCardCount) {
                        messageBox[0].innerHTML = "Error";

                        popup.find("a").first().append(messageBox.clone());
                    } else {

                        popup.find("a").first().append(tableElement.clone());
                    }


                    for (var i = 0; popupParents[i] != undefined; i++) {
                        $(popupParents[i]).parent().find("ul").remove();
                        $(popupParents[i]).parent().append(popup.clone());
                    }
                }
            }
        }
    }

    var i = 0;
    while (menuSelector[i] != undefined) {
        if (menuSelector[i].innerHTML == "View discard pile") {
            var link = menuSelector[i].getAttribute("href");

            extensionTools.loadDocument(link, popupParents, discardPileOperate);
            /*
            // onload=\"discardPileOperate();\"
            discardPileFrame = $("<iframe id = \"bgo-extension-discard-pile\" src=\"" + link + "\" border=\"1\" frameborder=\"1\" width=\"0\" height=\"0\"></iframe>")
            discardPileFrame.get(0).addEventListener('load', function() {
                discardPileOperate();
                discardPileFrame.remove();
            });
            $("body").append(discardPileFrame);*/
            break;
        }
        i++;
    }
});