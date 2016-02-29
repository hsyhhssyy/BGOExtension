
//注入我自己的页面
$('p[class="important"]').remove();
var injectUrl = chrome.extension.getURL("statistics/statistics.inject.html");

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {

        var injectdiv = $(xhr.responseText)
        $('div[id="contenu"]').append(injectdiv);

        $("#list-match-button")[0].addEventListener('click', function () {
            listMatches(listMatchFinished);
        });

        $("#collect-journal-button")[0].addEventListener('click', function () {
            $("#statistic-status")[0].innerHTML = "Collecting journal......";
            collectJournalForSelectedMatch(journalCollected);
        });

        $("#analyze-button")[0].addEventListener('click', function () {
            if ($("#alias-name-list")[0].getAttribute("hidden") == undefined) {
                aliasNames = [];
                collectAliasNameResult();
                $("#alias-name-list")[0].setAttribute("hidden", "true");
            }

            aliasNames[aliasNames.length] = $("span[class=\"nom\"]").text().replace(/\s/g, " ").toUpperCase();

            $("#statistic-status")[0].innerHTML = "Analyzeing......";
            analyzeSelectedMatch();
        });
    }
}
xhr.open('GET', injectUrl, true);
xhr.send(null);

var playerColors = ["Orange","Purple","Green","Red"];

var matches = [];
var cardStatistics = {};
var aliasNames = [];
var aliasNamesCandicateList = [];

//公共的load document方法
function loadDocument(url, data, callback) {
    var currentTitle = document.title;
    var myGamesFrame = $('<iframe src="' + url + '" border="1" frameborder="1" width="0" height="0"></iframe>')
    myGamesFrame.get(0).addEventListener('load', function () {
        var doc = myGamesFrame[0].contentDocument;
        document.title = currentTitle;
        callback(myGamesFrame, $(doc), data);
        $(myGamesFrame[0]).remove();
    });
    $("body").append(myGamesFrame);
}


//一些UI元素的变更

function listMatchFinished() {
    $("#statistic-status")[0].innerHTML = "" + matches.length + " Matches loaded. Please select the match you want to analyze and click [Collect Journal] button.";

    $("#collect-journal-button")[0].removeAttribute("hidden");
}

function journalCollected() {

    var aliasProblem = false;

    if (aliasNamesCandicateList.length > 0) {
        
        aliasProblem = solveAlias();

    }

    if (aliasProblem) {
        //有别名问题，玩家改过名字，需要处理
        $("#statistic-status")[0].innerHTML = "Alias names found, please check on the names you ever use then click [Analyze Selected] button.";
        $("#alias-name-list")[0].removeAttribute("hidden");

    }else {
        //没有别名问题，可以开始搜索了
        $("#statistic-status")[0].innerHTML = "Journal collected, please click [Analyze Selected] button.";
        $("#card-list")[0].removeAttribute("hidden");
    }

    $("#analyze-button")[0].removeAttribute("hidden");

}
