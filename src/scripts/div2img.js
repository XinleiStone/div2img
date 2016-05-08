var div2img = function () {

    function draw(containerId) {

        var $dom = $("#" + containerId);
        var widthTrans = $dom.offset().left;
        var heightTrans = $dom.offset().top;
        var $can = $("<canvas id='finalCanvas'></canvas>")
            .attr("width", parseInt($dom.css("width")))
            .attr("height", $dom.css("height"));
            //.prependTo("#" + containerId);
        //var finalCanvas = document.getElementById('finalCanvas');
        var tt = $can.get(0).getContext("2d");
        tt.fillStyle = "#fff";
        tt.fillRect(0, 0, parseFloat($dom.css("width")), parseFloat($dom.css("height")));

        var ele = reGet($dom);

        var interVal = window.setInterval(function() {
            if (ele == $dom) {
                clearInterval(interVal);
                var triggerDownload = $("<a>").attr("href", $can.get(0).toDataURL()).attr("download", "img.png").appendTo("body");
                triggerDownload[0].click();
                triggerDownload.remove();
            }
        }, 100);


        function reGet($element) {

            if ($element.get(0).tagName != "svg") {
                if (0 != $element.children().length) {
                    $element.children().each(function() {
                        reGet($(this));
                    })
                } else {
                    html2canvas($element.get(0), {
                        onrendered: function (canvas) {
                            tt.drawImage(canvas, $element.offset().left - widthTrans, $element.offset().top - heightTrans);
                        }
                    });
                }
            } else if ($element.get(0).tagName == "svg") {
                SVG2Bitmap($element.get(0), function (canvas, dataURL) {
                    tt.drawImage(canvas, $element.offset().left - widthTrans, $element.offset().top - heightTrans);
                });
            }

            return $element;
        }
    }

    return {
        downImg: draw
    }
}();