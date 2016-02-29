/** ***********************
**
** 给腐败状态栏加入文本提示
**
** ************************/

//statusBar
(function() {

    function addTextTip(text,title, img) {
        var parent = img.parentNode;
        img.parentNode.removeChild(img);
        var div = $('<ul class="carteMain"><li/></ul>');

        var ul = $('<ul id="carte" class="tta_event0"><p class="ageCarte ageCarte20">&nbsp;</p><li><div class="fondCarte tta_event1"><p class="ssTypeCarte tta_event3">Rule</p><p class="tta_event1 nomCarte nomCarteMilitaire">'
            + title + '</p><p class="texteCarte">' + text + '</p><p class="commentaire&quot;">&nbsp;</p></div></li><p class="prodCarte">&nbsp;</p></ul>');

        div.find("li").append($(img));
        div.find("li").append($('<b>'+title+'</b>'))
        div.find("li").append(ul);
        $(parent).append(div);
    }

    function addWarTip(warCardUL, title, img) {
        var parent = img.parentNode;
        img.parentNode.removeChild(img);
        var div = $('<ul class="carteMain"><li/></ul>');

        //var ul = $('<ul id="carte" class="tta_event0"><p class="ageCarte ageCarte20">&nbsp;</p><li><div class="fondCarte tta_event1"><p class="ssTypeCarte tta_event3">Rule</p><p class="tta_event1 nomCarte nomCarteMilitaire">'
        //    + title + '</p><p class="texteCarte">' + text + '</p><p class="commentaire&quot;">&nbsp;</p></div></li><p class="prodCarte">&nbsp;</p></ul>');

        div.find("li").append($(img));
        div.find("li").append($('<b>' + title + '</b>'))
        if (warCardUL != null) {
            div.find("li").append(warCardUL);
        }
        $(parent).append(div);
    }

    //因为使用了系统对话框，所以就不需要使用注入的css了
    //var cssInject=$('<style type="text/css">.bgoExtensionStatusBarDiv span{ position: absolute; background: rgba(0,0,0,.5); color: #fff; line-height: 50px; text-align: center; border-radius:15px;display:none; } .bgoExtensionStatusBarDiv:hover span{ display:inline; } </style>');
    //$("head").append(cssInject);

    var statusBar = $("#statusBar");

    var imgs = statusBar.find("img");

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
        } else if (title.indexOf("War")>=0) {
            addWarTip(null, title, imgs[i]);
        }
    }


})();