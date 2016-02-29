function listMatches(callback) {

    var username = $("span[class=\"nom\"]").text().replace(/\s/g, " ");

    $("#statistic-status")[0].innerHTML = "Listing all matches ......";

    loadDocument("http://boardgaming-online.com/index.php?cnt=14&pg=1&flt=" + username.toLowerCase(), { "page": 1, "callback": callback, "username": username },
        function (frame, document, token) {

            //获取总页数并加入token
            //numPageLien
            var pageNum=document.find('a[class="numPageLien"]')

            if (pageNum == undefined || pageNum.length <= 0) {
                //没有去往第二页的链接，检查一下本页是否是唯一的一页

                var rows = document.find("table[class='tableau2']").find("tr");

                if (rows == undefined || rows.length == 0) {
                    //第一页也没有任何一行
                    $("#statistic-status")[0].innerHTML = "Can't find any matches, check if your username only contains English characters.";
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

            $("#statistic-status")[0].innerHTML = "Listing all matches (1/"+token.maxPage+")......";

            listMatchCallback(frame, document, token);
        });

};

function listMatchCallback(frame, document, token) {

    //add current page into match list
    var listTable = document.find("table[class='tableau2']");

    var playerName = token.username;

    var rows = listTable.find("tr");

    var i = 0;
    while (rows[i] != undefined) {
        var currentRow = rows[i];

        var tds = $(currentRow).find("td");
        if (tds[0].getAttribute("rowspan") == undefined) {
            i++;
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
        }else if (myScore > highScore) {
            winOrLose = "Win";
        }else if (myScore < highScore) {
            winOrLose = "Lose";
        } else {
            winOrLose = "Tie";
        }

        var match= {
            "id": $(tds[0]).find("a").html(),
            "name": $(tds[1]).find("a").html(),
            "board":tds[2].innerHTML,
            "players": players,
            "wl": winOrLose,
            "journal": [],
            "playerColors": {}
        }


        if (match.board == "Through the Ages: A New Story of Civilization") {
            matches[matches.length] = match;
            var tr = $("#match-list-simple").first().clone();
            tr[0].removeAttribute("hidden");
            tr[0].setAttribute("aindex", (matches.length - 1));
            tr[0].setAttribute("mindex", match.id);
            tr[0].setAttribute("id", "match-list-" + (matches.length - 1));

            tr.find("#match-id")[0].innerHTML = match.id;
            tr.find("#match-name")[0].innerHTML = match.name;
            tr.find("#match-result")[0].innerHTML = match.wl;
            tr.find("#match-player-count")[0].innerHTML = match.players.length;

            $("#match-list").append(tr);
        }

        i++;

    }

    token.page += 1;

    //如果最后一页也已经完毕
    if (token.page > token.maxPage) {
        token.callback(token);
        return;
    }

    $("#statistic-status")[0].innerHTML = "Listing all matches ("+token.page+"/" + token.maxPage + ")......";
    loadDocument("http://boardgaming-online.com/index.php?cnt=14&pg=" + token.page  + "&flt=" + token.username.toLowerCase(), token, listMatchCallback);
}

