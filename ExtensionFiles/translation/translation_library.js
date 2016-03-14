
/** ***********************
**
** 翻译BGO UI
** 公共代码部分，用于填充ttaTranslation
**
** ************************/


(function() {

    //汉化帮助函数

    ttaTranslation.getTranslatedText = function (originalText) {

        var dict = ttaTranslation.dictionary;

        if (dict == undefined) {
            return originalText;
        }

        var translated_text = undefined;

        if (dict[originalText] == undefined) {
            var slashLoc = originalText.indexOf("-");
            if (slashLoc < 0) {
                slashLoc = originalText.indexOf("/");
            }

            if (slashLoc > 0) {
                var card = originalText.substr(slashLoc + 2, originalText.length - slashLoc - 1);
                translated_text = originalText.substr(0, slashLoc + 2) + dict[card];
            } else {
                translated_text = originalText;
            }
        } else if (dict[originalText] != undefined) {
            translated_text = dict[originalText];
        } else {
            translated_text = originalText;
        }

        if (translated_text.indexOf("undefined")>=0) {
            return originalText;
        } else {
            return translated_text;
        }
    }


    ttaTranslation.translateWithAgePrefix = function (iterators) {
        var dict = ttaTranslation.dictionary;

        if (dict == undefined) {
            return;
        }

        for (var i=0;iterators[i] != undefined;i++) {
            var text_gathered = $(iterators[i]).html();
            text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();

            if (text_gathered != undefined) {
                var translated_text = ttaTranslation.getTranslatedText(text_gathered)
                
                if (text_gathered == translated_text) {
                    continue;;
                }

                iterators[i].innerHTML = translated_text;

            } else {
                text_gathered = undefined;
            }
        }
    }

    ttaTranslation.translateNodeText = function (iterators) {
        var dict = ttaTranslation.dictionary;

        if (dict == undefined) {
            return;
        }

        for (var i = 0; iterators[i] != undefined; i++) {
            var outerHtml = "";
            for (var j = 0; iterators[i].childNodes[j] != undefined;j++) {
                if (iterators[i].childNodes[j].nodeType == 3) {
                    //TextNode
                    var translated_text = ttaTranslation.getTranslatedText(iterators[i].childNodes[j].data);

                    outerHtml += translated_text;
                } else {
                    outerHtml += iterators[i].childNodes[j].outerHTML;
                }
            }

            iterators[i].innerHTML = outerHtml;
        }
    }

    var dictRequestMsg = {
        type: "bgo-translation-query"
    };

// ***** 汉化主函数 *****
    chrome.extension.sendMessage(dictRequestMsg,
        function(dict) {
            if (dict != null) {
                ttaTranslation.dictionary = dict;
            }

            ttaTranslation.executeReady.onReady(ttaTranslation);

        }
    );
}());