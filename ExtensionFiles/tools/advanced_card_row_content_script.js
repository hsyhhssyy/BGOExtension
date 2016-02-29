
/** ***********************
**
** 把卡牌列复制到每个玩家的面板上
**
** ************************/

ttaBoardInformation.cardRow = undefined;

(function() {

    var cfgRequestMsg = {
        type: "bgo-configuration-query"
    };


    chrome.extension.sendMessage(cfgRequestMsg,
        function(config) {

            var card_row = $("div[id=\"card_row\"]");
            if (card_row[0] != undefined && config["chrome.bgo-extension.advanced-card-row"] == "true") {

                ttaBoardInformation.cardRow = card_row.clone();
                var temp_card_row = card_row.clone(true);

                if (config["chrome.bgo-extension.advanced-card-row-sim-next-turn"] == "true") {

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
                                    propValue = propValue.replace("carteNonPiochable", "carteMasquee")
                                    $(card_row_cards[j]).find("a")[0].setAttribute("class", propValue);
                                }
                            }
                        }
                        j++;
                    }

                    var seperator = temp_card_row.find("td[class=\"fond3\"]");
                    var pattern = $(
                        '<td class="tdMidC fond1" width="70"><p class="titre3">&nbsp;</p><ul id="carteRangee"><li><a class="tta_nocard0 "><p class="ageCarte ageCarte1x">&nbsp;</p><div class="fondCarte tta_nocard1"><p class="nomCarte" style="min-width:60">New Card<br></p></div><p class="piedCarte ageCarte1x">&nbsp;</p></a></li></ul><p>&nbsp;</p></td>');

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
                            card_row_cards[j].setAttribute("class", "tdMidC fond1")
                        }
                        if (j >= 6 && j < 10) {
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

                }

                var new_card_tr = $("<tr></tr>");
                var new_card_td = $("<td colspan=\"2\"></td>");
                new_card_td.append(temp_card_row.clone(true));
                new_card_tr.append(new_card_td.clone(true));

                var old_card_tr = $("<tr></tr>");
                var old_card_td = $("<td colspan=\"2\"></td>");
                old_card_td.append(ttaBoardInformation.cardRow.clone(true));
                old_card_tr.append(old_card_td.clone(true));

                var player2table = $("div[id=\"Plateau" + (3 - ttaBoardInformation.playerNo) + "\"]").first().find("table").first().find("tbody").first();
                var myPlayertable = $("div[id=\"Plateau" + (ttaBoardInformation.playerNo) + "\"]").first().find("table").first().find("tbody").first();
                if (ttaBoardInformation.currentPlayer != ttaBoardInformation.playerName && config["chrome.bgo-extension.advanced-card-row-active-player-disp-current"] == "true") {
                    myPlayertable.prepend(new_card_tr.clone(true));
                    card_row.remove();
                    player2table.prepend(old_card_tr.clone(true))
                } else {
                    //myPlayertable.prepend(old_card_tr.clone(true));
                    player2table.prepend(new_card_tr.clone(true))
                }
            }

        });

}());