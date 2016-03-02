
(function() {

    var findCardTaken = /([\s\S]*?) takes ([\s\S]*?) in hand/;
    var findCardPutBack = /([\s\S]*?) puts ([\s\S]*?) back/;


    var totalWl = {
        "total": 0,
        "win": 0,
        "lose": 0,
        "tie": 0,
        "resign": 0
    };

    function collectTotalWl(match, color) {

        totalWl.total += 1;
        if (match.wl == "Win") {
            totalWl.win += 1;
        } else if (match.wl == "Lose") {
            totalWl.lose += 1;
        } else if (match.wl == "Tie") {
            totalWl.tie += 1;
        } else if (match.wl == "Resign") {
            totalWl.resign += 1;
        }

    }

    function collectTotalWlFinished() {

        if (totalWl.total == 0) {
            $("#statistic-status")[0].innerHTML = ttaTranslation.getTranslatedText("0 match analyzed.");
        } else {
            var note = ttaTranslation.getTranslatedText("A total of [Total] match(es) analyzed: Win [Win]([WinRate]), Lose [Lose]([LoseRate]), Tie [Tie]([TieRate]), Resign [Resign]([ResignRate])");
            $("#statistic-status")[0].innerHTML =
                note.replaceAll("[Total]", totalWl.total)
                .replaceAll("[Win]", totalWl.win).replaceAll("[WinRate]", (100 * totalWl.win / totalWl.total).toFixed(2) + "%")
                .replaceAll("[Lose]", totalWl.lose).replaceAll("[LoseRate]", (100 * totalWl.lose / totalWl.total).toFixed(2) + "%")
                .replaceAll("[Tie]", totalWl.tie).replaceAll("[TieRate]", (100 * totalWl.tie / totalWl.total).toFixed(2) + "%")
                .replaceAll("[Resign]", totalWl.resign).replaceAll("[ResignRate]", (100 * totalWl.resign / totalWl.total).toFixed(2) + "%");
        }

    }

    function collectCardTaken(match, color) {
        var journal = match.journal;


        //Process Journal
        var i = 1;
        for (var i = 1; journal[i] != undefined; i++) {
            var log = journal[i];
            var text = log.journal;

            var card = undefined;
            var num = 0;

            var arrMatches = text.match(findCardTaken)
            if (arrMatches != null) {
                var player = arrMatches[1];
                if (player == color) {
                    var card = arrMatches[2];
                    var age = log.age;
                    num = 1;
                }
            }


            arrMatches = text.match(findCardPutBack)
            if (arrMatches != null) {
                var player = arrMatches[1];
                if (player == color) {
                    var card = arrMatches[2];
                    var age = log.age;
                    num = -1;
                }
            }

            if (card != undefined) {
                if (cardStatistics[card] == undefined) {
                    cardStatistics[card] = {
                        taken: 0,
                        win: 0,
                        lose: 0,
                        tie: 0,
                        resign: 0
                    };
                }

                cardStatistics[card].taken += num;
                if (match.wl == "Win") {
                    cardStatistics[card].win += num;
                } else if (match.wl == "Lose") {
                    cardStatistics[card].lose += num;
                } else if (match.wl == "Tie") {
                    cardStatistics[card].tie += num;
                } else if (match.wl == "Resign") {
                    cardStatistics[card].resign += num;
                }
            }
        }

    }


    function collectCardTakenFinished() {

        var totalWinRate = 100 * totalWl.win / totalWl.total;

        for (var card in cardStatistics) {
            var status = cardStatistics[card];

            var tr = $("#card-list-simple").first().clone();
            tr[0].removeAttribute("hidden");
            tr.find("#card-name")[0].innerHTML = ttaTranslation.getTranslatedText(card);
            tr.find("#card-taken")[0].innerHTML = `${status.taken}`;
            tr.find("#card-taken-rate")[0].innerHTML = `${(100 * status.taken / totalWl.total).toFixed(2)}%`;
            tr.find("#card-win")[0].innerHTML = `${status.win}`;
            tr.find("#card-win-rate-taken")[0].innerHTML = `${(100 * status.win / status.taken).toFixed(2)}%`;

            if (100 * status.win / status.taken >= totalWinRate) {
                tr.find("#card-win-rate-taken")[0].parentNode.parentNode.parentNode.setAttribute("class", "batiment1 tta_leader1");
            } else {
                tr.find("#card-win-rate-taken")[0].parentNode.parentNode.parentNode.setAttribute("class", "batiment1 tta_military1");
            }
            tr.find("#card-win-rate-not-taken")[0].innerHTML =  `${(100 * (totalWl.win - status.win) / (totalWl.total - status.taken)).toFixed(2)}%`;
            if (100 * (totalWl.win - status.win) / (totalWl.total - status.taken) >= totalWinRate) {
                tr.find("#card-win-rate-not-taken")[0].parentNode.parentNode.parentNode.setAttribute("class", "batiment1 tta_leader1");
            } else {
                tr.find("#card-win-rate-not-taken")[0].parentNode.parentNode.parentNode.setAttribute("class", "batiment1 tta_military1");
            }

            tr.find("#card-lose")[0].innerHTML = status.lose;
            tr.find("#card-tie")[0].innerHTML = status.tie;
            tr.find("#card-resign")[0].innerHTML = status.resign;

            $("#card-list").append(tr);

        }

        $("#card-list")[0].removeAttribute("hidden");
    }

    function judgePlayerColor(match) {
        var colors = match.playerColors;

        var color = undefined;
        for (var name in colors) {
            if (ttaStatistics.aliasNames.indexOf(name) >= 0) {
                color = colors[name];
            }
        }

        if (color != undefined) {
            color = color.substr(0, 1).toUpperCase() + color.substr(1).toLowerCase();
        }
        return color;
    }

    ttaStatistics.analyzeSelectedMatch = function() {


        if (ttaStatistics.matches.length <= 0) {
            $("#statistic-status")[0].innerHTML = "Please list matches first.";
            return;
        }

        var matchToAnalyze = [];

        for (var i = 0; i < ttaStatistics.matches.length; i++) {
            var checkbox = $('tr[aindex="' + i + '"]').find("#analyze-this-match")[0];
            if (checkbox != undefined && checkbox.checked == true) {
                matchToAnalyze[matchToAnalyze.length] = ttaStatistics.matches[i];
            }
        }

        //重置所有分析结果
        cardStatistics = [];
        totalWl = {
            "total": 0,
            "win": 0,
            "lose": 0,
            "tie": 0,
            "resign": 0
        };

        for (var i = 0; i < matchToAnalyze.length; i++) {
            var match = matchToAnalyze[i];
            var skipMatch = false;

            var playerColor = judgePlayerColor(match);

            if (playerColor == undefined) {
                skipMatch = true;
            }

            //玩家数量过滤器
            switch (match.players.length) {
            case 2:
                if ($("#option-count-2-player")[0].checked != true) {
                    skipMatch = true;
                }
                break;
            case 3:
                if ($("#option-count-3-player")[0].checked != true) {
                    skipMatch = true;
                }
                break;
            case 4:
                if ($("#option-count-4-player")[0].checked != true) {
                    skipMatch = true;
                }
                break;
            }


            if (skipMatch == true) {
                //将有问题的比赛颜色变一下
                var tr = $('tr[mindex="' + match.id + '"]');
                var tds = tr.find("td");

                for (var j = 0; tds[j] != undefined; j++) {
                    tds[j].setAttribute("class", "batiment1 tta_production1");
                }
                continue;
            } else {
                var tr = $('tr[mindex="' + match.id + '"]');
                var tds = tr.find("td");

                for (var j = 0; tds[j] != undefined; j++) {
                    tds[j].setAttribute("class", "batiment1 tta_leader1");
                }
            }
            collectCardTaken(match, playerColor);
            collectTotalWl(match, playerColor);
        }

        collectCardTakenFinished();
        collectTotalWlFinished();
    }


}());