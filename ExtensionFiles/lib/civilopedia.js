/** ***********************
**
** Library: Civilopedia
**
** ************************/


var ttaCivilopedia = {};

(function() {

    ttaCivilopedia.cardLibrary = {};

    //load library
    extensionTools.loadLocalText("lib/civilopedia.txt",function(text) {
        var civilopediaTextSplit = text.split("\n");


        for (var i = 0; i < civilopediaTextSplit.length; i++) {
            var pediaRowText = civilopediaTextSplit[i].trim();

            var slash = pediaRowText.indexOf("|");

            var cardName = "";

            var dictRowLoc = dictRowText.indexOf("|", 0);
            if (dictRowLoc < dictRowText.length - 1) {
                var key = convertLegend(dictRowText.substr(0, dictRowLoc));
                var value = convertLegend(dictRowText.substr(dictRowLoc + 1));
                localDict[key] = value;
                localDict[key + "<br>"] = value + "<br>";
            }
        }

        translationDictionary[languageStr] = localDict;
    });

    ttaCivilopedia.getCardPopupUL = function() {

    }
})();