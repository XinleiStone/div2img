var div2img = function () {

    function draw(containerId) {

        SVG2Bitmap(document.getElementById(containerId), function (canvas, dataURL) {
            $("<canvas id='newCan'></canvas>")
                .attr("width", $(canvas).attr("width"))
                .attr("height", $(canvas).attr("height"))
                .prependTo("#" + containerId);

            var ctx = document.getElementById("newCan").getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, $(canvas).attr("width"), $(canvas).attr("height"));
            ctx.drawImage(canvas, 0, 0);
            canvas.id = "canvasImgId";
            var triggerDownload = $("<a>").attr("href", document.getElementById("newCan").toDataURL()).attr("download", "img.png").appendTo("body");
            triggerDownload[0].click();
            triggerDownload.remove();
            $("#newCan").remove();
        });
    }

    return {
        draw: draw
    }
}();