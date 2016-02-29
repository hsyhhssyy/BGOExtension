
function collectJournalForSelectedMatch(callback) {

    if (matches.length <= 0) {
        $("#statistic-status")[0].innerHTML = "Please list matches first.";
        return;
    }

    var matchToCollectJournal = [];

    for (var i = 0; i < matches.length; i++) {
        var checkbox = $('tr[aindex="' + i + '"]').find("#analyze-this-match")[0];
        if (checkbox != undefined && checkbox.checked == true) {
            matchToCollectJournal[matchToCollectJournal.length] = matches[i];
        }
    }

    loadDocument("http://boardgaming-online.com/index.php?cnt=52&pl=" + matches[0].id + "&nat=-1", {
        "page": 1,
        "matches": matchToCollectJournal,
        "index": 0,
        "callback": callback
    }, getJournalCallback);
}


function getJournalCallback(frame, document, token) {

    var journal = token.matches[token.index].journal;

    var journalTable = document.find("table[class='tableau']");

    var rows = journalTable.find("tr");

    if (rows == undefined || rows.length <= 1) {
        journalCollectedForOneMatch(token);
        return;
    }


    var i = 0;
    while (rows[i] != undefined) {
        var currentRow = rows[i];
        var tds = $(currentRow).find("td");

        if ($(tds[0]).find("p").length <= 0) {
            i++;
            continue;
        }

        var log = {
            player: $(tds[1]).find("p").text(),
            age: $(tds[2]).find("p").text(),
            ture: $(tds[3]).find("p").text(),
            journal: $(tds[4]).find("p").text(),

        }

        journal[journal.length] = log;

        i++;
    }

    token.matches[token.index].journal = journal;
    token.page += 1;

    loadDocument("http://boardgaming-online.com/index.php?cnt=52&pl=" + token.matches[token.index].id + "&nat=-1&pg=" + token.page + "&flt=", token, getJournalCallback);

}


var findMyColor = / IS ([\s\S]*?) AS ([\s\S]*?) \(/;
var findMyColorG = / IS ([\s\S]*?) AS ([\s\S]*?) \(/g;

function journalCollectedForOneMatch(token) {

    var match = token.matches[token.index];

    var journal = match.journal;

    var endGameJournal = journal[0].journal.toUpperCase();

    var myColorMatches = endGameJournal.match(findMyColorG);
    if (myColorMatches == null) {
        $("#statistic-status")[0].innerHTML = "Error reading journal for match [" + match.name + "]. The last journal entry is not [End Of Game]. Match skipped.";
        match.journal = [];
    } else {

        var username = $("span[class=\"nom\"]").text().replace(/\s/g, " ");

        var playerColor = {};

        for (var i = 0; myColorMatches[i] != undefined; i++) {
            var colorLine = myColorMatches[i].match(findMyColor);
            playerColor[colorLine[1]] = colorLine[2];
        }

        match.playerColors = playerColor;

        if (playerColor[username.toUpperCase()] != undefined) {
            //本局比赛有正确的id，可以不用放入alias表
        } else {
            aliasNamesCandicateList[aliasNamesCandicateList.length] = playerColor;
        }

        //收集完玩家颜色对照表，将table染红表示已经完成
        var tr = $('tr[mindex="' + token.matches[token.index].id + '"]');
        var tds = tr.find("td");

        for (var i = 0; tds[i] != undefined; i++) {
            tds[i].setAttribute("class", "batiment1 tta_military1");
        }

        //更新状态栏
        $("#statistic-status")[0].innerHTML = "" + (token.index + 1) + "/" + token.matches.length+ " Journal(s) collected......";
    }

    if (token.matches.length > token.index + 1) {
        token.page = 1;
        token.index += 1;
        token.matches[token.index].journal = [];
        loadDocument("http://boardgaming-online.com/index.php?cnt=52&pl=" + token.matches[token.index].id + "&nat=-1", token, getJournalCallback);
    } else {
        token.callback();
    }
}
