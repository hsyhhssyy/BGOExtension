/** ***********************
**
** 修改页面的默认字体
**
** ************************/

extensionTools.executeReady(ttaBoardInformation, function() {

    var fontCfg = ttaBoardInformation.config["chrome.bgo-extension.page-font"];
    if (fontCfg != undefined && fontCfg != "Default") {

        for (var sheetIndex = 0; document.styleSheets[sheetIndex] != undefined; sheetIndex++) {
            var sheet = document.styleSheets[sheetIndex];
            for (var ruleIndex = 0; sheet.rules[ruleIndex] != undefined; ruleIndex++) {
                var rule = sheet.rules[ruleIndex];

                if (rule.style.fontFamily != undefined && rule.style.fontFamily != "") {
                    rule.style.fontFamily =fontCfg+"," +rule.fontFamily ;
                }
            }
        }
    }

});