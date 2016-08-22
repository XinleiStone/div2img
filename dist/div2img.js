var div2img = function (options) {
    var containerId = "";
    var colorBack = "#fff";
    var imgName = "img";
    var download = false;
    checkOption(options);
    draw(options);
    function draw(options) {

        // container div
        var dom = document.getElementById(containerId);
        // container div Coordinate
        // top, left, bottom, right, width, height
        var coor = GetElCoordinate(dom);
        // get transform left
        var widthTrans = coor.left;
        // get transform top
        var heightTrans = coor.top;
        // create a new element canvas
        var can = document.createElement("canvas");
        // set id for further usage
        can.setAttribute("id", "finalCanvas1");
        // set canvas width and height , same with container div
        can.width = coor.width;
        can.height = coor.height;
        
        // get context 2d for drawing
        var tt = can.getContext("2d");
        // background color, default white
        tt.fillStyle = colorBack;
        // draw background
        tt.fillRect(0, 0, coor.width, coor.height);
        // recursion
        var ele = reGet(dom);
        // save as image
        var interVal = window.setInterval(function() {
            if (ele == dom) {
                clearInterval(interVal);
                window.setTimeout(function() {
                    var triggerDownload = document.createElement("a");
                    triggerDownload.setAttribute("href", can.toDataURL());
                    triggerDownload.setAttribute("download", imgName + ".png");
                    document.body.appendChild(triggerDownload);
                    triggerDownload.click();
                    document.body.removeChild(triggerDownload);
                }, 1000);
            }
        }, 10);

        // recursion get element' children
        function reGet(element) {
            if (element.tagName != "svg") {
                if (0 !== element.children.length && "table" !== element.tagName) {
                    for (var i = 0; i < element.children.length; i++) {
                        reGet(element.children[i]);
                    }
                } else {
                    var coorEle = offsetFun(element);
                    html2canvas(element, {
                        onrendered: function (canvas) {
                            tt.drawImage(canvas, coorEle.left - widthTrans, coorEle.top - heightTrans);
                            document.body.appendChild(canvas);
                        }
                    });
                }
            } else if (element.tagName == "svg") {
                var coorEle = offsetFun(element);
                SVG2Bitmap(element, function (canvas, dataURL) {
                    tt.drawImage(canvas, coorEle.left - widthTrans, coorEle.top - heightTrans);
                });
            }

            return element;
        }
    }

    function checkOption(options) {
        if (options) {
            containerId = options.id || containerId;
            if (!document.getElementById(containerId)) {
                throw new Error("Id is wrong, please check the option.");
            }
            imgName = options.name || imgName;
            colorBack = options.backgroundColor || colorBack;
        } else {
            throw new Error("Option is not found, please check out the option.")
        }
    }

    function GetElCoordinate(e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        var w = e.offsetWidth;
        var h = e.offsetHeight;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }
        return {
            top: t,
            left: l,
            width: w,
            height: h,
            bottom: t + h,
            right: l + w
        };
    }

    // borrow from jQuery
    var offset = {
        setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
                position = jQuery.css(elem, "position"),
                curElem = jQuery(elem),
                props = {};

            // Set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") &&
                (curCSSTop + curCSSLeft).indexOf("auto") > -1;

            // Need to be able to calculate position if either
            // top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;

            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);

            } else {
                curElem.css(props);
            }
        }
    };

    // borrow from jQuery
    function offsetFun(dom) {

        var docElem, win,
            //elem = this[ 0 ],
            elem = dom,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        /*if ( !jQuery.contains( docElem, elem ) ) {
            return box;
        }*/
        var strundefined = typeof undefined;

        // Support: BlackBerry 5, iOS 3 (original iPhone)
        // If we don't have gBCR, just use 0,0 rather than error
        if ( typeof elem.getBoundingClientRect !== strundefined ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function isWindow(obj) {
        return obj != null && obj === obj.window;
    }

    return {
        downImg: draw
    };
};