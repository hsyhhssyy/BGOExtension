
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

        for (var i=0;iterators[i] != undefined;i++) {
            var text_gathered = $(iterators[i]).html();
            text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();

            if (text_gathered != undefined) {
                var translated_text = ttaTranslation.getTranslatedText(text_gathered)
                
                if (text_gathered == translated_text) {
                    continue;;
                }

                var j = 0;
                for (j = 0; j < iterators[i].length; j++) {
                    iterators[i].removeChild(iterators[i][j]);
                }
                iterators[i].innerHTML = translated_text;

            } else {
                text_gathered = undefined;
            }
        }
    }

    ttaTranslation.translate = function (iterators) {
        var dict = ttaTranslation.dictionary;

        var i = 0;
        while (iterators[i] != undefined) {
            var text_gathered = $(iterators[i]).html();
            text_gathered = text_gathered.replaceAll("\n", "").removeCharacterEntities();
            if (text_gathered != undefined) {
                if (dict[text_gathered] != undefined) {
                    var translated_text = dict[text_gathered];
                    var j = 0;
                    for (j = 0; j < iterators[i].length; j++) {
                        iterators[i].removeChild(iterators[i][j]);
                    }
                    //var translated_node = $(translated_text);
                    //iterators[i].prepend(translated_node);
                    iterators[i].innerHTML = translated_text;
                } else {
                    text_gathered = undefined;
                }
            } else {
                text_gathered = undefined;
            }

            i++;
        }
    }

    var dictRequestMsg = {
        type: "bgo-translation-query"
    };

// ***** 汉化主函数 *****
    chrome.extension.sendMessage(dictRequestMsg,
        function(dict) {
            if (dict == null) {
                return;
            }

            ttaTranslation.dictionary = dict;
            ttaTranslation.executeReady.onReady(ttaTranslation);

        }
    );
}());