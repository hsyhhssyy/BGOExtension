/** ***********************
**
** 给腐败状态栏加入文本提示
**
** ************************/

//statusBar
extensionTools.executeReady(ttaTranslation,function() {

    function addTextTip(text,title, img) {
        var parent = img.parentNode;
        img.parentNode.removeChild(img);
        var div = $('<ul class="carteMain"><li/></ul>');

        var ul = $('<ul id="carte" class="tta_event0"><p class="ageCarte ageCarte20">&nbsp;</p><li><div class="fondCarte tta_event1"><p class="ssTypeCarte tta_event3">Rule</p><p class="tta_event1 nomCarte nomCarteMilitaire">'
            + title + '</p><p class="texteCarte">' + text + '</p><p class="commentaire&quot;">&nbsp;</p></div></li><p class="prodCarte">&nbsp;</p></ul>');

        div.find("li").append($(img));
        div.find("li").append($('<b>'+title+'</b>'))
        div.find("li").append(ul.clone());
        $(parent).append(div);
    }

    function addPopupTip(text, title, img) {
        var parent = img.parentNode;
        img.parentNode.removeChild(img);
        var div = $('<ul class="carteMain"><li/></ul>');

        var ul = $('<ul id="carte" class="tta_event0"><p class="ageCarte ageCarte20">&nbsp;</p><li><div class="fondCarte tta_event1"><p class="ssTypeCarte tta_event3">Rule</p><p class="tta_event1 nomCarte nomCarteMilitaire">'
            + title + '</p><p class="texteCarte">' + text + '</p><p class="commentaire&quot;">&nbsp;</p></div></li><p class="prodCarte">&nbsp;</p></ul>');

        div.find("li").append($(img));
        div.find("li").append(ul.clone());
        $(parent).append(div);
    }


    //因为使用了系统对话框，所以就不需要使用注入的css了
    //var cssInject=$('<style type="text/css">.bgoExtensionStatusBarDiv span{ position: absolute; background: rgba(0,0,0,.5); color: #fff; line-height: 50px; text-align: center; border-radius:15px;display:none; } .bgoExtensionStatusBarDiv:hover span{ display:inline; } </style>');
    //$("head").append(cssInject);


    var imgs = $("div[id='statusBar']").find("img");

    for (var i = 0; imgs[i] != undefined; i++) {
        var title = imgs[i].getAttribute("title");

        if (title == "Corruption") {
            var translated_text = ttaTranslation.getTranslatedText('You will lose <img alt="resource" title="Resource" class="iconeTexte" src="images/tta7/resource.png"> at the end of your turn.');
            var translated_title = ttaTranslation.getTranslatedText('Corruption');
            addTextTip(translated_text, translated_title, imgs[i]);
        } else if (title == "Civil disorder") {
            var translated_text = ttaTranslation.getTranslatedText('You will not produce/consume/corrupt any <img alt="resource" title="Resource" class="iconeTexte" src="images/tta7/resource.png">, <img alt="food" title="Food" class="iconeTexte" src="images/tta7/food.png">, <img alt="science" title="Science" class="iconeTexte" src="images/tta7/science.png"> or <img alt="culture" title="Culture" class="iconeTexte" src="images/tta7/culture.png"> at the production phase. No military card draw or discard.');
            var translated_title = ttaTranslation.getTranslatedText('Civil disorder');
            addTextTip(translated_text, translated_title, imgs[i]);
        } else if (title == "Famine") {
            var translated_text = ttaTranslation.getTranslatedText('You will lose 4<img alt="culture" title="Culture" class="iconeTexte" src="images/tta7/culture.png"> on every <img alt="food" title="Food" class="iconeTexte" src="images/tta7/food.png"> not paid in consumption.');
            var translated_title = ttaTranslation.getTranslatedText('Famine');
            addTextTip(translated_text, translated_title, imgs[i]);
        } else if (title.indexOf("War") >= 0) {
            (function () {

                var parent = imgs[i].parentNode;
                parent.removeChild(imgs[i]);
                var div = $('<ul class="carteMain"><li/></ul>');

                var onLoc = title.indexOf("against");

                var warName = title.substr(0, onLoc - 1);
                var warCardUL = ttaCivilopedia.getCardPopupUL(warName);

                warName = ttaTranslation.getTranslatedText(warName);

                var warAgainstPlayer = title.substr(onLoc + 8);

                var colorIndex = playerColors.indexOf(warAgainstPlayer)
                var translatedColor = ttaTranslation.getTranslatedText(warAgainstPlayer);
                if (colorIndex > 0) {
                    translatedColor = '<span class="ongletSelect' + colorIndex + '">' + translatedColor + '</span>';
                }
                var warAgainst = ttaTranslation.getTranslatedText("[War] against [Player]").replaceAll("[War]", warName).replaceAll("[Player]", translatedColor);
                


                div.find("li").append($(imgs[i]));
                div.find("li").append($('<b>' + warAgainst + '</b>'));
                if (warCardUL != undefined) {
                    div.find("li").append(warCardUL.clone());
                }

                $(parent).append(div);
            }());
        }
    }

    var pans = $("div[id='statusBar']").find("pan");
    for (var i = 0; pans[i] != undefined; i++) {
        for (var j = 0; pans[i].childNodes[j] != undefined; j++) {
            if (pans[i].childNodes[j].nodeType != 3) {
                $(pans[i]).parent().append($(pans[i].childNodes[j]));
            }
        }

        var translated_text = ttaTranslation.getTranslatedText('The game ends when both two conditions are satitfied:<br>1. The last civil card of Age III has been put on the card row. <br>2. All players have played at least one complete turn (Include political phase) after the first condition.');
        var translated_title = ttaTranslation.getTranslatedText('Last turn');
        addPopupTip(translated_text, translated_title, pans[i]);
    }


});