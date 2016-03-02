/** ***********************
**
** Library: Civilopedia
**
** ************************/



(function() {

    ttaCivilopedia.cardLibrary = {};

    //load library
    extensionTools.loadLocalText("lib/civilopedia.txt",function(text) {
        var civilopediaTextSplit = text.split("\n");


        for (var i = 0; i < civilopediaTextSplit.length; i++) {
            var pediaRowText = civilopediaTextSplit[i].trim();

            var slash = pediaRowText.split("|");

            if (slash.length < 3) {
                return;
            }

            var cardName = slash[0];
            var cardProp = slash[1];
            var cardUL = $(slash[2]);

            ttaCivilopedia.cardLibrary[cardName] = {
                "cardProp": cardProp,
                "cardUL":cardUL
            }
        }

        translationDictionary[languageStr] = localDict;

        ttaCivilopedia.executeReady.onReady(ttaCivilopedia);
    });

    ttaCivilopedia.getCardPopupUL = function (cardName) {
        if (ttaCivilopedia.cardLibrary[cardName] != undefined) {
            return ttaCivilopedia.cardLibrary[cardName].cardUL;
        } else {
            return undefined;
        }
    }
})();