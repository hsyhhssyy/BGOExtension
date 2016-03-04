/** ***********************
**
** 列出所有比赛
** 输出放置于ttaStatistics.matches和table#match-list中
**
** ************************/

(function() {
    ttaStatistics.listMatches=function(callback) {
        var username = $("#username").get(0).value;

        $("#statistic-status")[0].innerHTML = ttaTranslation.getTranslatedText("Listing all matches ......");

        extensionTools.loadDocument("http://boardgaming-online.com/index.php?cnt=14&pg=1&flt=" + username.toLowerCase(), { "page": 1, "callback": callback, "username": username },
            function(frame, document, token) {

                //获取总页数并加入token
                //numPageLien
                var pageNum = document.find('a[class="numPageLien"]')

                if (pageNum == undefined || pageNum.length <= 0) {
                    //没有去往第二页的链接，检查一下本页是否是唯一的一页

                    var rows = document.find("table[class='tableau2']").find("tr");

                    if (rows == undefined || rows.length == 0) {
                        //第一页也没有任何一行
                        var note = ttaTranslation.getTranslatedText("Can't find any matches, check if your username only contains English characters.");
                        $("#statistic-status")[0].innerHTML = "";
                        return;
                    } else {
                        token.maxPage = 1;
                    }
                } else {
                    var maxPageNum = 0;
                    for (var i = 0; pageNum[i] != undefined; i++) {
                        var number = parseInt(pageNum[i].innerHTML);
                        if (number > maxPageNum) {
                            maxPageNum = number;
                        }
                    }

                    token.maxPage = maxPageNum;
                }

                var note = ttaTranslation.getTranslatedText("Listing all matches ([Current]/[Total])......");
                $("#statistic-status")[0].innerHTML = note.replaceAll("[Current]", "1").replaceAll("[Total]", token.maxPage);

                listMatchCallback(frame, document, token);
            });

    };

    function listMatchCallback(frame, document, token) {

        //add current page into match list
        var listTable = document.find("table[class='tableau2']");

        var playerName = token.username;

        var rows = listTable.find("tr");

       
        for ( var i = 0;rows[i] != undefined;i++) {
            var currentRow = rows[i];

            var tds = $(currentRow).find("td");
            if (tds[0].getAttribute("rowspan") == undefined) {
                continue;
            }

            var players = [];
            players[players.length] = {
                score: tds[10].innerHTML,
                name: tds[11].innerHTML
            };

            var nextRow = i + 1;
            while (rows[nextRow] != undefined && $(rows[nextRow]).find("td")[0].getAttribute("rowspan") == undefined) {
                var opponentTds = $(rows[nextRow]).find("td");
                players[players.length] = {
                    score: opponentTds[0].innerHTML,
                    name: opponentTds[1].innerHTML
                };
                nextRow++;
            }

            var j = 0;
            var myScore;
            var highScore = 0;
            while (players[j] != undefined) {
                if (players[j].name == playerName) {
                    myScore = players[j].score;
                } else {
                    if (players[j].score != "-") {
                        if (highScore < parseInt(players[j].score)) {
                            highScore = parseInt(players[j].score);
                        }
                    }
                }
                j++;
            }
            var winOrLose = "";
            if (myScore == "-") {
                winOrLose = "Resign";
            } else if (myScore > highScore) {
                winOrLose = "Win";
            } else if (myScore < highScore) {
                winOrLose = "Lose";
            } else {
                winOrLose = "Tie";
            }

            var match = {
                "id": $(tds[0]).find("a").html(),
                "name": $(tds[1]).find("a").html(),
                "board": tds[2].innerHTML,
                "players": players,
                "wl": winOrLose,
                "journal": [],
                "playerColors": {}
            }


            if (match.board == "Through the Ages: A New Story of Civilization" && $("#option-new-story")[0].checked==true) {
                //
            }else if (match.board == "Through the Ages" && $("#option-old-story")[0].checked == true) {
                //
            } else {
                continue;
            }

            ttaStatistics.matches[ttaStatistics.matches.length] = match;
            var tr = $("#match-list-simple").first().clone();
            tr[0].removeAttribute("hidden");
            tr[0].setAttribute("aindex", (ttaStatistics.matches.length - 1));
            tr[0].setAttribute("mindex", match.id);
            tr[0].setAttribute("id", "match-list-" + (ttaStatistics.matches.length - 1));

            tr.find("#match-id")[0].innerHTML = match.id;
            tr.find("#match-name")[0].innerHTML = match.name;

            var divText = "[Statistic]" + match.wl;
            var note = ttaTranslation.getTranslatedText(divText);
            if (note == divText) {
                note = match.wl;
            }
            tr.find("#match-result")[0].innerHTML = note;
            tr.find("#match-player-count")[0].innerHTML = match.players.length;

            $("#match-list").append(tr);
        }

        token.page += 1;

        //如果最后一页也已经完毕
        if (token.page > token.maxPage) {
            token.callback(token);
            return;
        }

        var note = ttaTranslation.getTranslatedText("Listing all matches ([Current]/[Total])......");
        $("#statistic-status")[0].innerHTML = note.replaceAll("[Current]", token.page).replaceAll("[Total]", token.maxPage);

        extensionTools.loadDocument("http://boardgaming-online.com/index.php?cnt=14&pg=" + token.page + "&flt=" + token.username.toLowerCase(), token, listMatchCallback);
    }

}());