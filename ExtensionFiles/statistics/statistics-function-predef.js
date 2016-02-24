
//注入我自己的页面
$('p[class="important"]').remove();
var injectUrl = chrome.extension.getURL("statistics/statistics.inject.html");

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {

        var injectdiv = $(xhr.responseText)
        $('div[id="contenu"]').append(injectdiv);

        $("#start-button")[0].addEventListener('click', function () {
            listMatches(listMatchFinished);
        });

        $("#analyze-button")[0].addEventListener('click', function () {
            analyzeSelectedMatch();
        });
    }
}
xhr.open('GET', injectUrl, true);
xhr.send(null);

var playerColors = ["Orange","Purple","Green","Red"];

var matches = [];
var cardStatistics = {};

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

}