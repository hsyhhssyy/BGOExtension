
function analyzeSelectedMatch() {


    if (matches.length <= 0) {
        $("#card-list-status")[0].innerHTML = "Please list matches first.";
        return;
    }

    var matchToAnalyze = [];

    for (var i = 0; i < matches.length; i++) {
        var checkbox = $('tr[aindex="' + i+'"]').find("#analyze-this-match")[0];
        if (checkbox != undefined&&checkbox.checked==true) {
            matchToAnalyze[matchToAnalyze.length] = matches[i];
        }
    }

    cardStatistics = [];

    loadDocument("http://boardgaming-online.com/index.php?cnt=52&pl=" + matches[0].id + "&nat=-1", { "page": 1, "matches": matchToAnalyze, "index": 0 }, getJournalCallback);
}

function getJournalCallback(frame, document, token) {

    var journal = token.matches[token.index].journal;

    var journalTable = document.find("table[class='tableau']");

    var rows = journalTable.find("tr");

    if (rows == undefined || rows.length <=1) {
        loadJournalFinished(token);
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

    loadDocument("http://boardgaming-online.com/index.php?cnt=52&pl=" + token.matches[token.index].id+ "&nat=-1&pg=" + token.page + "&flt=", token, getJournalCallback);

}

var findCardTaken = /([\s\S]*?) takes ([\s\S]*?) in hand/;
var findCardPutBack = /([\s\S]*?) puts ([\s\S]*?) back/;

var findMyColor = /IS ([\s\S]*?) AS ([\s\S]*?) \(/;
var findMyColorG = /IS ([\s\S]*?) AS ([\s\S]*?) \(/g;

function analyzeFinished() {
    for(var card in cardStatistics) {
        var status = cardStatistics[card];

        var tr = $("#card-list-simple").first().clone();
        tr[0].removeAttribute("hidden");
        tr.find("#card-name")[0].innerHTML = card;
        tr.find("#card-taken")[0].innerHTML = status.taken;
        tr.find("#card-win")[0].innerHTML = status.win;
        tr.find("#card-lose")[0].innerHTML = status.lose;
        tr.find("#card-tie")[0].innerHTML = status.tie;
        tr.find("#card-resign")[0].innerHTML = status.resign;

        $("#card-list").append(tr);

    }
}

function loadJournalFinished(token) {

    var username = $("span[class=\"nom\"]").text().replace(/\s/g, " ");
    var match = token.matches[token.index];

    var journal = match.journal;

    var endGameJournal = journal[0].journal.toUpperCase();
    var myColorMatches = endGameJournal.match(findMyColorG);
    if (myColorMatches == null) {
        $("#card-list-status")[0].innerHTML = "Error reading journal.";
        return;
    }

    var color = undefined;
    for (var i = 0; myColorMatches[i] != undefined; i ++ ) {
        var colorLine = myColorMatches[i].match(findMyColor);
        if (colorLine[1] == username.toUpperCase()) {
            color = colorLine[2];
        }

    }

    if (color == undefined) {
        $("#card-list-status")[0].innerHTML = "Error reading journal.";
        return;
    }

    color = color.substr(0, 1).toUpperCase() + color.substr(1).toLowerCase();

    //Process Journal
    var i = 1;
    for(var i=1;journal[i] != undefined;i++) {
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
            if (token.matches[token.index].wl == "Win") {
                cardStatistics[card].win += num;
            } else if (token.matches[token.index].wl == "Lose") {
                cardStatistics[card].lose += num;
            } else if (token.matches[token.index].wl == "Tie") {
               cardStatistics[card].tie += num;
            } else if (token.matches[token.index].wl == "Resign") {
                cardStatistics[card].resign += num;
            }
        }
    }

    var tr = $('tr[mindex="' + token.matches[token.index].id + '"]');
    var tds = tr.find("td");

    for (var i = 0; tds[i] != undefined; i++) {
        tds[i].setAttribute("class", "batiment1 tta_military1");
    }

    $("#card-list-status")[0].innerHTML = "" + (token.index + 1) + " Matches analyzed......";

    if (token.matches.length > token.index + 1) {

        token.page = 1;
        token.index += 1;
        loadDocument("http://boardgaming-online.com/index.php?cnt=52&pl=" + token.matches[token.index].id + "&nat=-1", token, getJournalCallback);
    } else {
        analyzeFinished();
    }
}
