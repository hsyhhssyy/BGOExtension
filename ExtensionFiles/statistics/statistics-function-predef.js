
//注入我自己的页面
(function () {

    //初始化一些变量
    ttaStatistics.username = "";
    ttaStatistics.matches = [];
    ttaStatistics.cardStatistics = {};
    ttaStatistics.aliasNames = [];
    ttaStatistics.aliasNamesCandicateList = [];


    //定义一些Callback，让这些Callback来处理UI元素的变更

    function listMatchFinished() {
        var strMatchLoaded = ttaTranslation.getTranslatedText('[MatchCount] Matches loaded. Please select the match you want to analyze and click "Collect Journal" button.');
        $("#statistic-status")[0].innerHTML = strMatchLoaded.replaceAll("[MatchCount]", ttaStatistics.matches.length);
        $("#collect-journal-button")[0].removeAttribute("hidden");
    }

    function journalCollected() {
        var aliasProblem = false;
        if (ttaStatistics.aliasNamesCandicateList.length > 0) {
            aliasProblem = ttaStatistics.solveAlias();
        }

        if (aliasProblem) {
            //有别名问题，玩家改过名字，需要处理
            var note = ttaTranslation.getTranslatedText('Alias names found, please check on the names you ever use then click "Analyze Selected" button.');
            $("#statistic-status")[0].innerHTML = note
            $("#alias-name-list")[0].removeAttribute("hidden");

        } else {
            //没有别名问题，可以开始搜索了
            var note = ttaTranslation.getTranslatedText('Journal collected, please click "Analyze Selected" button.');
            $("#statistic-status")[0].innerHTML = note;
            $("#card-list")[0].removeAttribute("hidden");
        }

        $("#analyze-button")[0].removeAttribute("hidden");

    }


    $('p[class="important"]').remove();
    var injectUrl = "statistics/statistics.inject.html";

    extensionTools.loadLocalText(injectUrl, function(text) {
        var injectdiv = $(text)
        $('div[id="contenu"]').append(injectdiv);


        var username = $("span[class=\"nom\"]").text().replace(/\s/g, " ");

        $("#username").get(0).value = username;
        ttaStatistics.username = username;

        extensionTools.executeReady(ttaTranslation, function () {
            $("#list-match-button")[0].addEventListener('click', function () {
                ttaStatistics.username = $("#username").get(0).value;

                ttaStatistics.listMatches(listMatchFinished);
                $("#list-match-button")[0].setAttribute("hidden", "hidden");
            });

            $("#collect-journal-button")[0].addEventListener('click', function () {
                $("#statistic-status")[0].innerHTML = ttaTranslation.getTranslatedText("Collecting journal......");
                ttaStatistics.collectJournalForSelectedMatch(journalCollected);
                $("#collect-journal-button")[0].setAttribute("hidden", "hidden")
            });

            $("#analyze-button")[0].addEventListener('click', function () {
                if ($("#alias-name-list")[0].getAttribute("hidden") == undefined) {
                    ttaStatistics.aliasNames = [];
                    ttaStatistics.collectAliasNameResult();
                    $("#alias-name-list")[0].setAttribute("hidden", "true");
                }

                ttaStatistics.aliasNames[ttaStatistics.aliasNames.length] = ttaStatistics.username.toUpperCase();

                $("#statistic-status")[0].innerHTML = ttaTranslation.getTranslatedText("Analyzeing......");
                ttaStatistics.analyzeSelectedMatch();

                $("#analyze-button")[0].setAttribute("hidden", "hidden")
            });

            var dict = ttaTranslation.dictionary;

            var iterators = $('div[class="divl18n"]');
            for (var i = 0; iterators[i] != undefined; i++) {
                var pNode = $(iterators[i]).find("p")[0];
                if (pNode != undefined) {
                    var divText = "[Statistic]" + pNode.innerHTML;
                    var translated_text = dict[divText];
                    if (translated_text != undefined) {
                        pNode.innerHTML = translated_text;
                    }
                } else {
                    var divText = "[Statistic]" + iterators[i].innerHTML;
                    var translated_text = dict[divText];
                    if (translated_text != undefined) {
                        iterators[i].innerHTML = translated_text;
                    }
                }
            }
        });
    });

}());






