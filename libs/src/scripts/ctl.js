$(function () {
    decisionTree.createGraph(treesData.trees[0], treeOptions);
});

var ctl = function () {
    var options = treeOptions;
    var treeData = treesData.trees[0];

    function changeContainerWidth(obj, value) {
        value = value.replace(/[^(\d|)]/g, "");
        if (value > 950) {
            value = 950;
        }
        obj.value = value;
        options.width = value;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeContainerHeight(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        if (val > 750) {
            val = 750;
        }
        obj.value = val;
        options.height = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeNodeInterval(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        if (val > 300) {
            val = 300;
        }
        obj.value = val;
        options.edgeInterval = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeRankInterval(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        if (val > 300) {
            val = 300;
        }
        obj.value = val;
        options.rankInterval = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeTextLeft(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        obj.value = val;
        options.title = options.title || {};
        options.title.textLeft = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeTextTop(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        obj.value = val;
        options.title = options.title || {};
        options.title.textTop = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeSubTextLeft(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        obj.value = val;
        options.title = options.title || {};
        options.title.subTextLeft = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeSubTextTop(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        obj.value = val;
        options.title = options.title || {};
        options.title.subTextTop = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeTextSize(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        if (val > 40) {
            val = 40;
        }
        obj.value = val;
        options.title = options.title || {};
        options.title.textStyle = options.title.textStyle || {};
        options.title.textStyle.fontSize = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeSubTextSize(obj, value) {
        var val = value.replace(/[^(\d|)]/g, "");
        if (val > 40) {
            val = 40;
        }
        obj.value = val;
        options.title = options.title || {};
        options.title.subTextStyle = options.title.subTextStyle || {};
        options.title.subTextStyle.fontSize = val;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeHeadline(obj, text) {
        options.title = options.title || {};
        options.title.text = text.substr(0, 64);
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeSubHeadline(obj, text) {
        options.title = options.title || {};
        options.title.subText = text.substr(0, 64);
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeColorText(value) {
        options.title = options.title || {};
        options.title.textStyle = options.title.textStyle || {};
        options.title.textStyle.color = value;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeColorSubText(value) {
        options.title = options.title || {};
        options.title.subTextStyle = options.title.subTextStyle || {};
        options.title.subTextStyle.color = value;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeColorBack(value) {
        options.backgroundColor = value;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeColorLeaf(value) {
        options.leafColor = value;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeColorNotLeaf(value) {
        options.parentColor = value;
        $("#" + options.containerId).html("");
        decisionTree.createGraph(treeData, options);
    }

    function changeTextBold() {
        var radio = document.getElementsByName("bold");
        var radioLength = radio.length;
        for (var i = 0; i < radioLength; i++) {
            if (radio[i].checked) {
                var radioValue = radio[i].value;
                options.title = options.title || {};
                options.title.textStyle = options.title.textStyle || {};
                if ("yes" == radioValue) {
                    options.title.textStyle.fontWeight = "bold";
                } else {
                    options.title.textStyle.fontWeight = "normal";
                }
                $("#" + options.containerId).html("");
                decisionTree.createGraph(treeData, options);
            }
        }
    }

    function changeSubTextBold() {
        var radio = document.getElementsByName("subBold");
        var radioLength = radio.length;
        for (var i = 0; i < radioLength; i++) {
            if (radio[i].checked) {
                var radioValue = radio[i].value;
                options.title = options.title || {};
                options.title.subTextStyle = options.title.subTextStyle || {};
                if ("yes" == radioValue) {
                    options.title.subTextStyle.fontWeight = "bold";
                } else {
                    options.title.subTextStyle.fontWeight = "normal";
                }
                $("#" + options.containerId).html("");
                decisionTree.createGraph(treeData, options);
            }
        }
    }

    return {
        changeContainerWidth: changeContainerWidth,
        changeContainerHeight: changeContainerHeight,
        changeNodeInterval: changeNodeInterval,
        changeRankInterval: changeRankInterval,
        changeTextLeft: changeTextLeft,
        changeTextTop: changeTextTop,
        changeSubTextLeft: changeSubTextLeft,
        changeSubTextTop: changeSubTextTop,
        changeTextSize: changeTextSize,
        changeSubTextSize: changeSubTextSize,
        changeHeadline: changeHeadline,
        changeSubHeadline: changeSubHeadline,
        changeTextBold: changeTextBold,
        changeSubTextBold: changeSubTextBold,
        changeColorBack: changeColorBack,
        changeColorLeaf: changeColorLeaf,
        changeColorNotLeaf: changeColorNotLeaf,
        changeColorText: changeColorText,
        changeColorSubText: changeColorSubText
    }
}();