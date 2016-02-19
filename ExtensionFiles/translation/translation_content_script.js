
/** ***********************
**
** 翻译BGO UI
**
** ************************/

//收集文本用代码
var gathered_text_list = "";

function gather_text(iterators) {
    var i = 0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        if (text_gathered != undefined) {
            gathered_text_list += ("<SEP>" + text_gathered);
        } else {
            text_gathered = text_gathered;
        }

        i++;
    }
}

gather_text($("p[class=\"texteCarte\"]"));

localStorage["gathered_text_list"] = gathered_text_list;

//汉化帮助函数

function translateWithAgePrefix(iterators, dict) {
    var i = 0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();

        if (text_gathered != undefined) {
            if (dict[text_gathered] == undefined) {
                var slashLoc = text_gathered.indexOf("-");
                if (slashLoc < 0) {
                    slashLoc = text_gathered.indexOf("/");
                }

                if (slashLoc > 0) {
                    var card = text_gathered.substr(slashLoc + 2, text_gathered.length - slashLoc - 1);
                    var translated_text = text_gathered.substr(0, slashLoc + 2) + dict[card];
                } else {
                    translated_text = text_gathered;
                }
            } else if (dict[text_gathered] != undefined) {
                var translated_text = dict[text_gathered];
            } else {
                translated_text = text_gathered;
            }


            var j = 0;
            for (j = 0; j < iterators[i].length; j++) {
                iterators[i].removeChild(iterators[i][j]);
            }
            iterators[i].innerHTML = translated_text;

        } else {
            text_gathered = undefined;
        }

        i++;
    }
}

function translate(iterators, dict) {
    var i = 0;
    while (iterators[i] != undefined) {
        var text_gathered = $(iterators[i]).html();
        text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();
        if (text_gathered != undefined) {
            if (dict[text_gathered] != undefined) {
                var translated_text = dict[text_gathered];
                var j = 0;
                for (j = 0; j < iterators[i].length; j++) {
                    iterators[i].removeChild(iterators[i][j]);
                }
                //var translated_node = $(translated_text);
                //iterators[i].prepend(translated_node);
                iterators[i].innerHTML = translated_text;
            } else {
                text_gathered = undefined;
            }
        } else {
            text_gathered = undefined;
        }

        i++;
    }
}

var dictRequestMsg = {
    type: "bgo-translation-query"
};

// ***** 汉化主函数 *****
chrome.extension.sendMessage(dictRequestMsg,
    function (dict) {
        if (dict == null) {
            return;
        }

        //悬停弹出的卡牌完整说明
        var mouse_over = $("ul[id=\"carte\"]");
        var i = 0;
        while (mouse_over[i] != undefined) {
            var p_node = $(mouse_over[i]).find("p");
            translate(p_node, dict);
            i++;
        }

        //卡牌列上卡牌的名字
        //这里要调整一下列宽，设置最小列宽防止中文截断的过于暴力
        var card_title = $("p[class=\"nomCarte\"]");
        var i = 0;
        translate(card_title, dict);
        while (card_title[i] != undefined) {
            if (card_title[i].parentNode.nodeName == "DIV") {
                card_title[i].setAttribute("style", "min-width:60");
            }
            i++;
        }

        //手牌区，事件区等任何横条显示卡牌的地方
        translateWithAgePrefix($("a[class=\"nomCarte tta_production0 tta_production4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_leader0 tta_leader4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_urban0 tta_urban4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_military0 tta_military4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_wonder0 tta_wonder4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_government0 tta_government4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_special0 tta_special4\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_action0 tta_action4\"]"), dict);

        translateWithAgePrefix($("a[class=\"nomCarte tta_event1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_aggression1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_war1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_bonus1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_pact1\"]"), dict);
        translateWithAgePrefix($("a[class=\"nomCarte tta_tactic1\"]"), dict);

        
        //建造中的奇迹
        var buildingWonder = $("a[class=\"nomCarte tta_wonder2 tta_wonder1\"]");
        if (buildingWonder[0] != undefined) {
            buildingWonder[0].setAttribute("style", "min-width:60");
            translate(buildingWonder.find("p"), dict);
        }


        //打出事件牌的对话框里事件牌的名字 I / Breakthrough
        translateWithAgePrefix($("p[class=\"tta_action0 titre3\"]"), dict);
        //上述事件牌的文本： Develop a technology. After you pay the science cost, score 2 science.
        translate($("p[class=\"texte\"]"), dict);
        //上述事件牌候选项的处理：
        var actionOptionIterator = $("label");
        var i = 0;
        while (actionOptionIterator[i] != undefined) {
            var text = $(actionOptionIterator[i]).html();
            if (text.indexOf("Discover") == 0) {
                //Discover Swordsmen - 4[Token]
                var slashLoc = text.indexOf("-");
                var card = text.substr(9, slashLoc - 9 - 1);
                actionOptionIterator[i].innerHTML = dict["Discover"] + " " + dict[card] + " " + text.substr(slashLoc);
            } else if (text.indexOf("Upgrade") == 0) {
                //Upgrade Agriculture -> Irrigation (2R)
                var toLoc = text.indexOf(" to ");
                var arrowLoc = text.indexOf("-");

                var card1 = dict[text.substr(8, toLoc - 8)];
                var card2 = dict[text.substr(toLoc + 4, arrowLoc - toLoc - 5)];
                actionOptionIterator[i].innerHTML = dict["Upgrade"] + " " + card1 + " -> " + card2 + " " + text.substr(arrowLoc);
            }
            i++;
        }


        //政府的名字
        translate($("strong"), dict);

        //玩家科技板上面的科技牌名字
        translate($("li[class=\"nomCarte\"]"), dict);

        //手牌区的悬停文字
        translate($("p[class=\"libBatiment tta_production0 tta_production4\"]"), dict);
        translate($("p[class=\"libBatiment tta_urban0 tta_urban4\"]"), dict);
        translate($("p[class=\"libBatiment tta_military0 tta_military4\"]"), dict);

        //玩家科技板悬停时提示文字里的"Cost:"
        var i = 0;
        var costIterator = $("li[class=\"nombreCarte\"]");
        while (costIterator[i] != undefined) {
            var text = $(costIterator[i]).html();
            if (text.indexOf("Cost") == 0) {
                costIterator[i].innerHTML = text.replace("Cost", dict["Cost"]);
            }
            i++;
        }

        //事件和牌堆的标题
        var card_title = $("p[class=\"titre3\"]");
        translate(card_title, dict);

        //工人区
        var workerPool = $("div[class=\"worker_pool\"]").find("p").first();
        if (workerPool[0] != undefined) {
            workerPool[0].innerHTML = dict["Worker pool"];
        }

        //important区（其实就一个Last Turn）
        var card_title = $("pan[class=\"important\"]");
        translate(card_title, dict);


        //手牌区的标题
        var tdIterator = $("td[class=\"titre1\"]");
        var i = 0;
        while (tdIterator[i] != undefined) {
            var text = $(tdIterator[i]).html();
            if (text.indexOf("Civil&nbsp;cards") == 0) {
                var civilCount = text.substr("Civil&nbsp;cards".length);
                tdIterator[i].innerHTML = dict["Civil cards"] + civilCount;
            } else if (text.indexOf("Military&nbsp;cards") == 0) {
                var civilCount = text.substr("Military&nbsp;cards".length);
                tdIterator[i].innerHTML = dict["Military cards"] + civilCount;
            }
            else if (dict[text] != undefined) {
                //Current event played/Future event played
                tdIterator[i].innerHTML = dict[text];
            }
            i++;
        }

        //下拉列表的内容：
        var actionOptionIterator = $("option");
        var i = 0;
        while (actionOptionIterator[i] != undefined) {
            var text = $(actionOptionIterator[i]).html();
            var translated_text = "undefined";
            if (text.indexOf("Build") == 0) {
                //Build关键字的出现可能有多种情况。包括
                //Build Iron (5R)
                //Build free temple/Build free warrior.
                //Build 1 stage of Library of Alexandria (1R)
                //Build 4 stages of Library of Alexandria (1R)
                if (text.indexOf("stage") == 8 || text.indexOf("stages") == 8) {
                    var keywordLenght = text.indexOf("stages") == 8 ? 6 : 5;
                    //Build X stage of Y (XR)
                    //Build [StageCount] stage of [WonderName] ([ResourceCount]R)
                    var resourceLoc1 = text.indexOf("(");
                    var resourceLoc2 = text.indexOf(")");

                    var resourceCount = text.substr(resourceLoc1 + 1, resourceLoc2 - resourceLoc1 - 2);
                    var stageCount = text.substr(keywordLenght+1, 1);
                    var wonderName = dict[text.substr(keywordLenght + 12, resourceLoc1 - keywordLenght -13)];
                    var translatedActionText = dict["Build [StageCount] stage of [WonderName] ([ResourceCount]R)"];
                    if (translatedActionText != undefined) {
                        translated_text = translatedActionText.replace("[StageCount]", stageCount).replace("[WonderName]", wonderName).replace("[ResourceCount]", resourceCount);
                    }
                } else if (text.indexOf("(") > 0) {
                    var resourceLoc = text.indexOf("(");
                    var card = text.substr(6, resourceLoc - 6 - 1);
                    translated_text = dict["Build"] + " " + dict[card] + " " + text.substr(resourceLoc);
                } else if (dict[text] != undefined) {
                    translated_text = dict[text];
                }
            }else if (text.indexOf("Revolution") == 0) {
                //Revolution changes to XXXX (1S)
                var resourceLoc = text.indexOf("(")
                var card = text.substr(22, resourceLoc - 22 - 1);
                translated_text = dict["Revolution changes to"] + " " + dict[card] + " " + text.substr(resourceLoc);
            }  
            else if (text.indexOf("Discover") == 0) {
                var resourceLoc = text.indexOf("(")
                var card = text.substr(9, resourceLoc - 9 - 1);
                translated_text = dict["Discover"] + " " + dict[card] + " " + text.substr(resourceLoc);
            } else if (text.indexOf("Elect") == 0) {    
                //Elect leader: Moses
                //Elect leader: Moses (for 1MA)
                var leaderName = text.substr(14);
                translated_text = dict["Elect leader"] + " " + dict[leaderName];
            } else if (text.indexOf("Upgrade") == 0) {
                //Upgrade Agriculture -> Irrigation (2R)
                var resourceLoc = text.indexOf("(");
                var arrowLoc = text.indexOf("-");

                var card1 = dict[text.substr(8, arrowLoc - 9)];
                var card2 = dict[text.substr(arrowLoc + 6, resourceLoc - arrowLoc - 7)];
                translated_text = dict["Upgrade"] + " " + card1 + " -> " + card2 + " " + text.substr(resourceLoc);
            } else if (text.indexOf("Bid") == 0) {
                //Upgrade Agriculture -> Irrigation (2R)
                var price = text.substr(4);
                translated_text = dict["Bid"] + " " + price;
            } else if (text.indexOf("Play") == 0) {
                //Play关键字的出现可能有多种情况。包括
                //Play A / Rich Land
                //Play event Pestilence
                //Play event Developed Territory II
                if (text.indexOf("/") > 0) {
                    //Play A / Rich Land
                    var levelLoc = text.indexOf("/");
                    var card = text.substr(levelLoc + 2);
                    translated_text = dict["Play"] + " " + text.substr(5, levelLoc - 3) + dict[card];
                } else if (text.indexOf("Play event") == 0) {
                    if (text.endsWith(" A") || text.endsWith(" I") || text.endsWith(" II") || text.endsWith(" III")) {
                        var conlonySplit = text.split(" ");
                        var conlonyName = "";
                        for (var j = 2; j < conlonySplit.length - 1; j++) {
                            conlonyName += conlonySplit[j] + " ";
                        }
                        conlonyName = conlonyName.trim();
                        translated_text = dict["Play conlony"] + " " + dict[conlonyName] + " " + conlonySplit[conlonySplit.length - 1];
                    } else {
                        var eventName = text.substr(11);
                        translated_text = dict["Play event"] + " " + dict[eventName];
                    }
                }
            } else if (text.indexOf("Declare") == 0) {
                var warSplit = text.split(" ");
                var warName = "";
                for (var j = 1; j < warSplit.length - 1; j++) {
                    warName += warSplit[j] + " ";
                }
                warName = warName.trim();
                translated_text = dict["Declare"] + " " + dict[warName] + " " + warSplit[warSplit.length - 1];
            } else if (text.indexOf("Increase") == 0) {
                var resourceLoc = text.indexOf("(")
                translated_text = dict["Increase population"] + " " + text.substr(resourceLoc);
            } else if (text.indexOf("Set up new tactics") == 0) {
                var card = text.substr(21);
                translated_text = dict["Set up new tactics"] + " " + dict[card];
            } else if (text.indexOf("Adopt tactics") == 0) {
                var card = text.substr(16);
                translated_text = dict["Adopt tactics"] + " " + dict[card];
            } else if (dict[text] != undefined) {
                translated_text = dict[text];
            } else if (text.endsWith(" A") || text.endsWith(" I") || text.endsWith(" II") || text.endsWith(" III")) {
                //可能是侵略牌
                var aggressionSplit = text.split(" ");
                var aggressionName = "";
                for (var j = 0; j < aggressionSplit.length - 1; j++) {
                    aggressionName += aggressionSplit[j] + " ";
                }
                aggressionName = aggressionName.trim();
                translated_text = dict[aggressionName] + " " + aggressionSplit[aggressionSplit.length - 1];
            } else if (text.startsWith("A/") || text.startsWith("I/") || text.startsWith("II/") || text.startsWith("III/")) {
                //是Disband/Destory的Option
                var levelLoc = text.indexOf("/");
                var card = text.substr(levelLoc + 2);
                translated_text = text.substr(0, levelLoc + 2) + dict[card];
            } else {
                translated_text = "undefined";

            }

            if (translated_text.indexOf("undefined") < 0) {
                actionOptionIterator[i].innerHTML = translated_text;
            }

            i++;
        }

        var actionOptionIterator = $("optgroup");
        var i = 0;
        while (actionOptionIterator[i] != undefined) {
            var text = actionOptionIterator[i].getAttribute("label");
            if (dict[text] != undefined) {
                actionOptionIterator[i].setAttribute("label", dict[text]);
            }

            i++;
        }

        //执行了某些事件后，行动选单下方出现的一堆checkbox
        var actionOptionIterator = $('tr[id="sacrificeUnites"]').first().find("label");
        var i = 0;
        while (actionOptionIterator[i] != undefined) {
            var text = actionOptionIterator[i].innerHTML;
            text = text.removeCharacterEntities().trim();

            var levelLoc = text.indexOf("-");

            if (levelLoc < 0) {
                levelLoc = -2;
            }

            var resourceLoc = text.indexOf("(")
            var card = text.substr(levelLoc + 2, resourceLoc - levelLoc - 3);
            if(dict[card]!=undefined){
                translated_text = (levelLoc > 0 ? (text.substr(0, levelLoc + 1) + " " ): "") + dict[card] + " " + text.substr(resourceLoc);
                actionOptionIterator[i].innerHTML = translated_text;
            }

            i++;
        }


        //类似国际条约的事件的牌
        var actionOptionIterator = $('tr[id="pacteActuel"]').first().find("label");
        var i = 0;
        while (actionOptionIterator[i] != undefined) {
            var text = actionOptionIterator[i].innerHTML;
            text = text.removeCharacterEntities().trim();

            var levelLoc = text.indexOf("/");

            if (levelLoc < 0) {
                levelLoc = -2;
            }

            var resourceLoc = text.indexOf("(")
            var card = text.substr(levelLoc + 2, resourceLoc - levelLoc - 3);
            if (dict[card] != undefined) {
                translated_text = (levelLoc > 0 ? (text.substr(0, levelLoc + 1) + " ") : "") + dict[card] + " " + text.substr(resourceLoc);
                actionOptionIterator[i].innerHTML = translated_text;
            }

            i++;
        }

        //弃牌阶段要弃掉的牌
        //valTRA以及Check to confirm end of turn也会被这个xpath选中
        var actionOptionIterator = $('table[class="tableau2"]').find('td[class="texte"]').find("label");
        var i = 0;
        while (actionOptionIterator[i] != undefined) {
            var text = actionOptionIterator[i].innerHTML;
            text = text.removeCharacterEntities().trim();

            var levelLoc = text.indexOf("/");

            if (levelLoc < 0) {
                levelLoc = -2;
            }
            var card = text.substr(levelLoc + 2, text.length - levelLoc - 2);
            if (dict[card] != undefined) {
                translated_text = (levelLoc > 0 ? (text.substr(0, levelLoc + 1) + " ") : "") + dict[card] ;
                actionOptionIterator[i].innerHTML = translated_text;
            }

            i++;
        }


        //Select 2 cards to discard:
        //Select 1 card to discard:
        var actionOptionIterator = $('table[class="tableau2"]').find('td[class="texte"]')[0];
        var text = actionOptionIterator.firstChild.nodeValue;
        if (text!=null&&text.indexOf(" card") >= 8) {
            var digit = text.substr(7, text.indexOf(" card") - 7);
            text = text.substr(0, 7) + "[Num]" + text.substring(text.indexOf(" card"));
            if (dict[text] != undefined) {
                translated_text = dict[text].replaceAll("[Num]",digit);
                actionOptionIterator.firstChild.nodeValue = translated_text;
            }
        }
    }
);
