/** ***********************
**
** 解决别名问题
** 输出放置于ttaStatistics.aliasNames中
**
** ************************/

//该函数通知JS代码，游戏可能有潜在的别名问题，需要处理
(function() {
    ttaStatistics.solveAlias = function() {

        var aliasNames = {}

        for (var i = 0; ttaStatistics.aliasNamesCandicateList[i] != undefined; i++) {
            var colorLists = ttaStatistics.aliasNamesCandicateList[i];

            for (var name in colorLists) {
                if (aliasNames[name] != undefined) {
                    aliasNames[name] += 1;
                } else {
                    aliasNames[name] = 1;
                }
            }

        }

        var nameFound = false;
        for (var name in aliasNames) {
            var count = aliasNames[name];

            if (count <= 1) {
                continue;;
            }

            nameFound = true;

            var tr = $("#alias-name-simple").first().clone();
            tr[0].removeAttribute("hidden");
            tr[0].setAttribute("id", "alias-name-candidate");
            tr[0].setAttribute("onclick", 'ttaStatistics.aliasNameListCheckboxClicked();');

            tr.find("#alias-name-checked")[0].setAttribute("alias-name", name);
            tr.find("#alias-name")[0].innerHTML = name;

            $("#alias-name-list").append(tr);
        }

        ttaStatistics.aliasNamesCandicateList = [];

        return nameFound;

    }

    ttaStatistics.aliasNameListCheckboxClicked = function() {

    }

    ttaStatistics.collectAliasNameResult = function() {
        var names = [];

        var trs = $('tr[id="alias-name-candidate"]');
        for (var i = 0; trs[i] != undefined; i++) {
            var check = $(trs[i]).find("input")[0];
            if (check.checked != undefined && check.checked == true) {
                names[names.length] = check.getAttribute("alias-name").toUpperCase();
            }
        }

        ttaStatistics.aliasNames = names;

    }
}());