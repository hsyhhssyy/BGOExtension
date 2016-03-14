
extensionTools.executeReady(ttaBoardInformation,function(){
	
	var config = ttaBoardInformation.config;
	
        var currentTitle = document.title;
        var myGamesFrame = null;

        //div

        var candicate = $('div[id="contenu"]').children();
        var titleTable = undefined;
        var i = 0;
        while (candicate[i] != undefined) {
            if (candicate[i].nodeName.toUpperCase() == "TABLE") {
                if (candicate[i].getAttribute("class") == "tableau0") {
                    titleTable = $(candicate[i]);
                }
            }
            i++;
        }

        if (titleTable == undefined) {
            return;
        }
        var divs = titleTable.find('div');

        var newDivNum = divs.length + 1;

        //给每个div添加新的代码
        var i = 0;
        while (divs[i] != undefined) {
            var titleDiv = divs[i];
            var attr = titleDiv.getAttribute("onclick");
            attr += "hide('Plateau" + newDivNum + "');change_style('lienPlateau" + newDivNum + "','ongletNormal ongletNormal0');";
            titleDiv.setAttribute("onclick", attr);
            i++;
        }

        //添加一个新的div

        //var table = $('<div id="lienPlateau3" class="ongletNormal ongletNormal0" onclick="hide('Plateau1');change_style('lienPlateau1','ongletNormal ongletNormal1');hide('Plateau2');change_style('lienPlateau2','ongletNormal ongletNormal2');show('Plateau3');change_style('lienPlateau3','ongletSelect ongletSelect0');hide('Plateau4');change_style('lienPlateau4','ongletNormal ongletNormal0');"><ul id="indJoueur"><li id="texteOnglet3" class="lienOngletNormal">日志</li></ul></div>');
        var newDiv = $('<td width="25%"><div id="lienPlateau' + newDivNum + '" class="ongletNormal ongletNormal0"><ul id="indJoueur"><li id="texteOnglet' + newDivNum + '" class="lienOngletNormal">My games</li></ul></div></td> ');

        var attr = "";
        for (var i = 1; i < newDivNum; i++) {
            var selectNo = (i >= newDivNum - 2) ? 0 : i;
            attr += "hide('Plateau" + i + "');change_style('lienPlateau" + i + "','ongletNormal ongletNormal" + selectNo + "');"
        }
        attr += "show('Plateau" + newDivNum + "');change_style('lienPlateau" + newDivNum + "','ongletSelect ongletSelect10');";
        newDiv.find("div")[0].setAttribute("onclick", attr);

        titleTable.find("tr").append(newDiv);

        //重调大小
        var tdWidth = titleTable.find("td");
        var newWidth = (100 / newDivNum) + "%";
        var i = 0;
        while (tdWidth[i] != undefined) {
            var tdNode = tdWidth[i];
            var width = tdNode.getAttribute("width");
            if (width != undefined) {
                tdNode.setAttribute("width", newWidth);
            }
            i++;
        }

        var myGamesDiv = $('<div id="Plateau' + newDivNum + '" style="display:none" class="plateau plateau0"/>');
        $('div[id="contenu"]').append(myGamesDiv);


        function myGameContentOperate() {
            var innerDocument = $(myGamesFrame[0].contentDocument);
            myGamesDiv.append(innerDocument.find('table[class="tableau2"]').first());
            document.title = currentTitle;
        }



        myGamesFrame = $('<iframe id ="bgo-extension-my-games" src="index.php?cnt=2" border="1" frameborder="1" width="0" height="0"></iframe>')
        myGamesFrame.get(0).addEventListener('load', function () {
            myGameContentOperate();
            myGamesFrame.remove();
        });
        $("body").append(myGamesFrame);
    });