var decisionTree = function () {
    "use strict";

    var containerId = "";                            // container div id
    var width = 750;                                 // container widtn
    var height = 550;                                // container height
    var fill = ["#FF8C00"];                          // parents nodes colors
    var fillLeaves = "#FF3030";                      // leaf nodes color
    var nodeNumber = 0;                              // current clicked node number
    var lastNumber = 0;                              // last clicked node number
    var colorBack = "#fff";                          // default background color

    var edgeSep = 30;                                // default edge sep
    var rankSep = 40;
    var nodeSep = 30;                                // default node sep

    var headline = "";                               // headline text
    var headlineColor = "black";                     // default headline text color
    var headlineSize = 16;                           // default headline text size
    var boldFlag = "normal";                         // default headline text bold
    var headlineTopTrans = 25;                       // default headline top transform
    var headlineLeftTrans = 10;                      // default headline left transform

    var subHeadline = "";                            // subheadline text
    var subHeadlineColor = "black";                  // default subheadline text color
    var subHeadlineSize = 12;                        // default subheadline text size
    var subBoldFlag = "normal";                      // default subheadline text bold
    var subHeadlineTopTrans = 50;                    // default subheadline top transform
    var subHeadlineLeftTrans = 10;                   // default subheadline left transform

    var dragWidthEdge;                               // using for judge if drag out of horizontal edge
    var dragHeightEdge;                              // using for judge if drag out of vertical edge

    /*
     *  action function
     *  data: data object
     *  options: render options object
     *
     * */
    function createGraph(jsonData, options) {
        var svg;                                     // svg to draw
        var gTree;                                   // the tree input graph
        var gPredictPath;                            // the path input graph
        var svgGroupTree;                            // graph element to draw tree on
        var svgGroupPath;                            // graph element to draw path on

        var fillLength;                              // numbers of colors
        var nodeDataArray;                           // converted data
        var render;                                  // the renderer
        var bigWidth;                                // big nodes graph width
        var smallWidth = 300;                        // small nodes graph width, default 300
        var tfSize;                                  // transform size
        var graphHeight;                             // graph's height , not svg's
        var svgPathLabel;                            // label "预测路径"
        var dragFlag = true;                         // to charge if node click or drag

        checkOptions(options);                       // check options

        // check the container div id before init data
        if (!containerId) {
            console.log("div container wrong!");
            return;
        }

        initData();

        // check the container div id
        if (!svg[0][0]) {
            console.log("div container wrong!");
            return;
        }

        // draw big node to get width and height
        //bigNode();

        // draw small node to be final graph
        smallNode();

        // available the hover tips
        hoverTips();

        // headline
        drawHeadlines();

        // tool boxes
        appendButtons();

        // action function when drag node and edge
        dragNodeEdge();

        $("#retract").click(function () {
            retract(nodeNumber);
        });

        $("#spread").click(function () {
            spread(nodeNumber);
        });

        $("#smallNode").click(function () {
            smallNode();
        });

        $("#bigNode").click(function () {
            bigNode();
        });

        // save image
        $("#saveImg").click(function () {
            SVG2Bitmap(document.getElementById(containerId).childNodes[0], function (canvas, dataURL) {
                $("<canvas id='newCan'></canvas>")
                    .attr("width", $(canvas).attr("width"))
                    .attr("height", $(canvas).attr("height"))
                    .prependTo("#" + containerId);

                var ctx = document.getElementById("newCan").getContext("2d");
                ctx.fillStyle= colorBack;
                ctx.fillRect(0,0,$(canvas).attr("width"),$(canvas).attr("height"));
                ctx.drawImage(canvas,0,0);
                canvas.id = "canvasImgId";
                var triggerDownload = $("<a>").attr("href", document.getElementById("newCan").toDataURL()).attr("download", "img.png").appendTo("body");
                triggerDownload[0].click();
                triggerDownload.remove();
                $("#newCan").remove();
            });
        });

        // when click on the node
        svg.selectAll("g.node").on("click", function (v) {
            if (true == dragFlag) {
                nodeNumber = gTree.node(v).value;
                $("g.node rect").parent(".node").attr("class", "node node-normal");
                $("g[id^=label_]").attr("class", "edgeLabel-visible");
                $("#node"+ v).parent(".node").attr("class", "node node-click");
                $(".edgePath").attr("class", "edgePath edge-visible");
                $("path[id$=-"+ v +"]").parent(".edgePath").attr("class", "edgePath edge-high").attr("id");
                edgeHigh(v);
                drawPredictPath(nodeNumber);
                if (!svgPathLabel) {
                    svgPathLabel = svg.append("text").text(function () {
                        return "预测路径:";
                    });
                    svgPathLabel.attr("transform", "translate("+ (110 + bigWidth) +", 80)")
                        .attr("style", "font-weight: 300; " +
                            "font-family: '微软雅黑', Helvetica, Arial, sans-serf; " +
                            "font-size: 14px; text-align: center;" +
                            "fill: black;")
                        .attr("id", "svgPathLabel");
                }
                render(svgGroupPath, gPredictPath);
                lastNumber = nodeNumber;
            }

            createGPredictPath();

            function drawPredictPath(num) {
                gTree.edges().forEach(function (e) {
                    if (e.w == num) {
                        var lor = (0 == parseInt(e.w) % 2) ? gTree.node(e.v).left : gTree.node(e.v).right;  // label on path
                        var tempObj = {
                            key: gTree.node(e.w).key,
                            name: gTree.node(e.w).name,
                            label: gTree.node(e.w).label,
                            value: gTree.node(e.w).value,
                            tip: gTree.node(e.w).tip,
                            style: gTree.node(e.w).style,
                            labelStyle: "",
                            class: gTree.node(e.v).class
                        };
                        gPredictPath.setNode(e.w, tempObj);
                        tempObj = {
                            key: gTree.node(e.v).key,
                            name: gTree.node(e.v).name,
                            label: gTree.node(e.v).label,
                            value: gTree.node(e.v).value,
                            tip: gTree.node(e.v).tip,
                            style: gTree.node(e.v).style,
                            class: gTree.node(e.v).class
                        };
                        gPredictPath.setNode(e.v, tempObj);
                        gPredictPath.setEdge(e.v, e.w, {
                            label: lor,
                            lineInterpolate: "basis",
                            arrowheadStyle: "stroke: none; fill: none;",
                            style: "stroke: none; fill: none;",
                            labelpos: "c"
                        });
                        drawPredictPath(e.v);
                    }
                });
            }
        });

        function createGPredictPath() {
            gPredictPath = new dagreD3.graphlib.Graph()
                .setGraph({
                    edgesep: edgeSep - 10,
                    ranksep: rankSep - 10,
                    nodesep: nodeSep
                })
                .setDefaultEdgeLabel(function () {
                    return {};
                });
        }

        function initData() {
            fillLength = fill.length;                           // numbers of colors

            if ("object" === typeof jsonData) {
                nodeDataArray = generateNodeData(jsonData);      // convert original data
            } else {
                console.log("data type error.");
                return;
            }

            // Create the input graph
            gTree = new dagreD3.graphlib.Graph()
                .setGraph({//rankdir: "LR",
                    edgesep: edgeSep,
                    ranksep: rankSep,
                    nodesep: nodeSep})
                .setDefaultEdgeLabel(function () {
                    return {};
                });

            $("#" + containerId).html("");
            // Set up an SVG tree group to translate the final graph tree
            svg = d3.select("#" + containerId)
                .append("svg")
                .attr("width", "400px")
                .attr("height", "400px")
                .attr("class", "svg-tree");

            // scale smaller
            //svgGroupTree.attr("transform", "scale(" + 0.9 + ")");

            // Set up an SVG forecast path group to translate the final graph forecast path
            svgGroupPath = svg.append("g");

            svgGroupTree = svg.append("g");

            // Create the renderer
            render = new dagreD3.render();

            dragWidthEdge = width - 100;
            dragHeightEdge = height - 100;
        }

        // set small and simple nodes and edges
        function smallNode() {
            svg.select("#svgPathLabel").remove();
            svgPathLabel = null;
            nodeDataArray.forEach(function (n) {
                n.label = n.key;
                // color of node
                if (n.children) {
                    n.style = "fill: " + fill[n.degree % fillLength] + ";";
                } else {
                    n.style = "fill: " + fillLeaves + ";";
                }
                n.class = "node-normal";
                gTree.setNode(n.key, n);
                if (n.children) {
                    for (var i = 0; i < n.children.length; i++) {
                        var lor = (0 == n.children[i].value % 2) ? n.left : n.right;  // label on path
                        gTree.setEdge(n.key, n.children[i].value, {
                            label: lor,
                            lineInterpolate: "basis",
                            arrowheadStyle: "stroke: none",
                            class: "edge-visible",
                            labelpos: "c"
                        });
                    }
                }
            });

            gTree.nodes().forEach(function (v) {
                var node = gTree.node(v);
                node.customId = "node" + v;
            });
            gTree.edges().forEach(function (e) {
                var edge = gTree.edge(e.v, e.w);
                edge.customId = e.v + "-" + e.w
            });

            nodeNumber = null;
            lastNumber = null;
            createGPredictPath();

            // Run the renderer. This is what draws the final graph.
            render(svgGroupPath, gPredictPath);
            render(svgGroupTree, gTree);

            //give IDs to each of the nodes so that they can be accessed
            svg.selectAll("g.node rect")
                .attr("id", function (d) {
                    return "node" + d;
                });
            svg.selectAll("g.edgePath path")
                .attr("id", function (e) {
                    return e.v + "-" + e.w;
                });
            svg.selectAll("g.edgeLabel g")
                .attr("id", function (e) {
                    return "label_"+e.v + "-" + e.w;
                });

            bigWidth = gTree.graph().width;
            graphHeight = gTree.graph().height;

            if ((graphHeight + 100) < height) {
                svg.attr("height", (height - 20) + "px");
                dragHeightEdge = height - 120;
            } else {
                svg.attr("height", (graphHeight + 100) + "px");
                dragHeightEdge = graphHeight;
            }

            if ((bigWidth + 400) < width) {
                svg.attr("width", (width - 20) + "px");
                dragWidthEdge = width - 120;
            } else {
                svg.attr("width", (bigWidth +400) + "px");
                dragWidthEdge = bigWidth + 280;
            }
            svg.attr("style", "background-color: "+ colorBack +";");    // svg background color

            // div height and width
            d3.select("#" + containerId).attr("style", "width: "
                + (width) + "px; height: "
                + (height) + "px; border: 1px #d3d3d3 solid; " +
                "border-radius: 4px; overflow-x: scroll; overflow-y: scroll; position: relative; float: left;"
            );

            smallWidth = gTree.graph().width;
            tfSize = (bigWidth - smallWidth) / 2;

            // Center the graph
            svgGroupTree.attr("transform", "translate( " + (tfSize + 50) + ", 60)");
            svgGroupPath.attr("transform", "translate( " + (bigWidth + 220 ) + ", 60), scale( 1 )");
        }

        // set big and detail nodes and edges
        function bigNode() {
            svg.select("#svgPathLabel").remove();
            svgPathLabel = null;
            nodeDataArray.forEach(function (n) {
                n.label = n.name;
                // color of node
                if (n.children) {
                    n.style = "fill: " + fill[n.degree % fillLength] + ";";
                } else {
                    n.style = "fill: " + fillLeaves + ";";
                }
                n.class = "node-normal";
                gTree.setNode(n.key, n);
                if (n.children) {
                    for (var i = 0; i < n.children.length; i++) {
                        var lor = (0 == n.children[i].value % 2) ? n.left : n.right;  // label on path
                        gTree.setEdge(n.key, n.children[i].value, {
                            label: lor,
                            lineInterpolate: "basis",
                            arrowheadStyle: "stroke: none",
                            class: "edge-visible",
                            labelpos: "c"
                        });
                    }
                }
            });

            gTree.nodes().forEach(function (v) {
                var node = gTree.node(v);
                node.customId = "node" + v;
            });
            gTree.edges().forEach(function (e) {
                var edge = gTree.edge(e.v, e.w);
                edge.customId = e.v + "-" + e.w;
            });

            nodeNumber = null;
            lastNumber = null;
            createGPredictPath();

            // Run the renderer. This is what draws the final graph.
            render(svgGroupPath, gPredictPath);
            render(svgGroupTree, gTree);

            // give IDs to each of the nodes so that they can be accessed
            svg.selectAll("g.node rect")
                .attr("id", function (d) {
                    return "node" + d;
                });
            svg.selectAll("g.edgePath path")
                .attr("id", function (e) {
                    return e.v + "-" + e.w;
                });
            svg.selectAll("g.edgeLabel g")
                .attr("id", function (e) {
                    return "label_"+e.v + "-" + e.w;
                });
        }

        // hover tips
        function hoverTips() {
            var styleTooltip = function (value, tips) {
                if (tips) {
                    return "<p>value:" + value + "</p><p>" + tips + "</p>";
                } else {
                    return "<p>value:" + value + "</p>";
                }
            };
            svg.selectAll("g.node")
                .attr("title", function (v) {
                    return styleTooltip(gTree.node(v).value, gTree.node(v).tip);
                })
                .each(function () {
                    $(this).tipsy({gravity: "w", opacity: 1, html: true});
                });
        }

        function edgeHigh(v) {
            if ($("path[id$=-"+ v +"]").attr("id")) {
                var nu = $("path[id$=-"+ v +"]").attr("id").split("-")[0];
                if (nu) {
                    $("path[id$=-"+ v +"]").parent(".edgePath").attr("class", "edgePath edge-high");
                    edgeHigh(nu);
                }
            }
        }

        function nodeHidden(v) {
            $("path[id^="+ v +"-]").each(function(d) {
                $("#node"+ this.id.split("-")[1]).parent(".node").attr("class", "node node-hidden");
                nodeHidden(this.id.split("-")[1]);
            });
        }

        function nodeVisible(v) {
            $("path[id^="+ v +"-]").each(function(d) {
                $("#node"+ this.id.split("-")[1]).parent(".node").attr("class", "node node-visible");
                nodeVisible(this.id.split("-")[1]);
            });
        }

        function edgeHidden(v) {
            $("path[id^="+ v +"-]").each(function(d) {
                $("g[id^=label_"+ v + "-" + this.id.split("-")[1] +"]").attr("class", "edgeLabel-hidden");
                $("path[id^="+ this.id.split("-")[1] +"-]").parent(".edgePath").attr("class", "edgePath edge-hidden");
                edgeHidden(this.id.split("-")[1]);
            });
        }

        function edgeVisible(v) {
            $("path[id^="+ v +"-]").each(function(d) {
                $("g[id^=label_"+ v + "-" + this.id.split("-")[1] +"]").attr("class", "edgeLabel-visible");
                $("path[id^="+ this.id.split("-")[1] +"-]").parent(".edgePath").attr("class", "edgePath edge-visible");
                edgeVisible(this.id.split("-")[1]);
            });
        }

        function appendButtons() {
            $("#" + containerId).append(
                "<div style='width: 100%; padding-left: 15px'>"
                + "<button id='smallNode' class='treebtn treebtn1 treebtn-default treebtn-xs'>小节点</button> "
                + "<button id='bigNode' class='treebtn treebtn2 treebtn-default treebtn-xs'>大节点</button> "
                + "<button id='retract' class='treebtn treebtn3 treebtn-default treebtn-xs'>收  起</button> "
                + "<button id='spread' class='treebtn treebtn4 treebtn-default treebtn-xs'>展  开</button> "
                + "<img src='../libs/src/images/download.png' id='saveImg' title='保存图片' class='treebtn treebtn5'></button> "
                + "</div>"
            );
        }

        function drawHeadlines() {
            svg.append("text")
                .attr("style", "font-family: '微软雅黑', Helvetica, Arial, sans-serf; fill:"
                    + headlineColor +"; font-size: "
                    + headlineSize + "px; font-weight: " + boldFlag + ";")
                .attr("id", "headlineText")
                .text(function() {
                    return headline;
                }).attr("transform", "translate("+ headlineLeftTrans +", "+ headlineTopTrans +")");

            svg.append("text")
                .attr("style", "font-family: '微软雅黑', Helvetica, Arial, sans-serf; fill:"
                    + subHeadlineColor +"; font-size: "
                    + subHeadlineSize + "px; font-weight: " + subBoldFlag + ";")
                .attr("id", "subHeadlineText")
                .text(function() {
                    return subHeadline;
                }).attr("transform", "translate("+ subHeadlineLeftTrans +", "+ subHeadlineTopTrans +")");
        }

        // retract node's children
        function retract(nowNd) {
            if (nowNd) {
                hidden(nodeNumber);
            }
        }

        // spread node's children
        function spread(nowNd) {
            if (nowNd) {
                view(nodeNumber);
            }
        }

        function hidden(number) {
            $("path[id^="+ number +"-]").parent(".edgePath").attr("class", "edgePath edge-hidden");
            edgeHidden(number);
            nodeHidden(number);
        }

        function view(number) {
            $("path[id^="+ number +"-]").parent(".edgePath").attr("class", "edgePath edge-visible");
            edgeVisible(number);
            nodeVisible(number);
        }

        function dragNodeEdge() {
            var nodeDrag = d3.behavior.drag()
                .on("dragstart", dragstart)
                .on("drag", dragmove);

            var edgeDrag = d3.behavior.drag()
                .on("dragstart", dragstart)
                .on("drag", function (d) {
                    translateEdge(gTree.edge(d.v, d.w), d3.event.dx, d3.event.dy);
                    $("#" + gTree.edge(d.v, d.w).customId).attr("d", calcPoints(d));
                });

            nodeDrag.call(svg.selectAll(".svg-tree g.node"));
            edgeDrag.call(svg.selectAll(".svg-tree g.edgePath"));

            function dragstart(d) {
                d3.event.sourceEvent.stopPropagation();
            }

            function dragmove(d) {
                dragFlag = false;
                var node = d3.select(this),
                    selectedNode = gTree.node(d);
                var prevX = selectedNode.x,
                    prevY = selectedNode.y;

                selectedNode.x += d3.event.dx;
                if (selectedNode.x > dragWidthEdge) {
                    selectedNode.x = dragWidthEdge;
                } else if (selectedNode.x < 0) {
                    selectedNode.x = 0;
                }
                selectedNode.y += d3.event.dy;
                if (selectedNode.y > dragHeightEdge) {
                    selectedNode.y = dragHeightEdge;
                } else if (selectedNode.y < 0) {
                    selectedNode.y = 0;
                }
                node.attr("transform", "translate(" + selectedNode.x + "," + selectedNode.y + ")");

                var dx = selectedNode.x - prevX,
                    dy = selectedNode.y - prevY;

                if (dx == 0 && dy == 0) {
                    dragFlag = true;
                    return;
                }

                gTree.edges().forEach(function (e) {
                    if (e.v == d || e.w == d) {
                        var edge = gTree.edge(e.v, e.w);
                        translateEdge(gTree.edge(e.v, e.w), dx, dy);
                        $("#" + edge.customId).attr("d", calcPoints(e));
                        var label = $("#label_" + edge.customId);

                        var xforms = label.attr("transform");
                        var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
                        var X = parseInt(parts[1])+dx, Y = parseInt(parts[2])+dy;

                        label.attr("transform","translate("+X+","+Y+")");
                    }
                });

                this.onmouseup = chFlag;
                function chFlag() {
                    setTimeout(function() {
                        dragFlag = true;
                    }, 100);
                }
            }

            function translateEdge(e, dx, dy) {
                e.points.forEach(function (p) {
                    p.x = p.x + dx;
                    p.y = p.y + dy;
                });
            }

            // taken from dagre-d3 source code (not the exact same)
            function calcPoints(e) {
                var edge = gTree.edge(e.v, e.w),
                    head = gTree.node(e.v),
                    tail = gTree.node(e.w);
                var points = []; // edge.points.slice(1, edge.points.length - 1);
                points.push(edge.points[1]);
                // var afterslice = edge.points.slice(1, edge.points.length - 1)
                points.unshift(intersectRect(tail, points[0]));
                points.push(intersectRect(head, points[points.length - 1]));
                return d3.svg.line()
                    .x(function (d) {
                        if (d.x > dragWidthEdge) {
                            return dragWidthEdge;
                        } else if (d.x < 0) {
                            return 0;
                        } else {
                            return d.x;
                        }
                    })
                    .y(function (d) {
                        if (d.y > dragHeightEdge) {
                            return dragHeightEdge;
                        } else if (d.y < 0) {
                            return 0;
                        }else {
                            return d.y;
                        }
                    })
                    .interpolate("basis")
                    (points);
            }

            // taken from dagre-d3 source code (not the exact same)
            function intersectRect(node, point) {
                var x = node.x;
                var y = node.y;
                var dx = point.x - x;
                var dy = point.y - y;
                var w = $("#" + node.customId).attr("width") / 2;
                var h = $("#" + node.customId).attr("height") / 2;
                var sx = 0,
                    sy = 0;
                if (Math.abs(dy) * w > Math.abs(dx) * h) {
                    // Intersection is top or bottom of rect.
                    if (dy < 0) {
                        h = -h;
                    }
                    sx = dy === 0 ? 0 : h * dx / dy;
                    sy = h;
                } else {
                    // Intersection is left or right of rect.
                    if (dx < 0) {
                        w = -w;
                    }
                    sx = w;
                    sy = dx === 0 ? 0 : w * dy / dx;
                }
                return {
                    x: x + sx,
                    y: y + sy
                };
            }
        }
    }

    /*
     *  check options function
     *  options: render options object
     *
     * */
    function checkOptions(options) {
        if (options) {
            containerId = options.containerId || "";
            if (!containerId) {
                console.log("parameters wrong!");
                return;
            }
            width = options.width || width;
            height = options.height || height;
            if (options.parentColor) {
                fill = [];
                fill.push(options.parentColor);
            }
            fillLeaves = options.leafColor || fillLeaves;
            edgeSep = options.edgeInterval || edgeSep;
            rankSep = options.rankInterval || rankSep;
            nodeSep = options.nodeInterval || nodeSep;

            if (options.title) {
                headlineLeftTrans = options.title.textLeft || headlineLeftTrans;
                headlineTopTrans = options.title.textTop || headlineTopTrans;
                subHeadlineLeftTrans = options.title.subTextLeft || subHeadlineLeftTrans;
                subHeadlineTopTrans = options.title.subTextTop || subHeadlineTopTrans;

                if ("" != options.title.text) {
                    headline = options.title.text || headline;
                } else {
                    headline = "";
                }
                if ("" != options.title.subText) {
                    subHeadline = options.title.subText || subHeadline;
                } else {
                    subHeadline = "";
                }
                if (options.title.textStyle) {
                    headlineColor = options.title.textStyle.color || headlineColor;
                    headlineSize = options.title.textStyle.fontSize || headlineSize;
                    boldFlag = options.title.textStyle.fontWeight || boldFlag;
                }

                if (options.title.subTextStyle) {
                    subHeadlineColor = options.title.subTextStyle.color || subHeadlineColor;
                    subHeadlineSize = options.title.subTextStyle.fontSize || subHeadlineSize;
                    subBoldFlag = options.title.subTextStyle.fontWeight || subBoldFlag;
                }
            }
            colorBack = options.backgroundColor || colorBack;
        } else {
            console.log("parameters wrong!");
        }
    }

    /*
     *  convert data function
     *  dataPort: original data object
     *
     * */
    function generateNodeData(dataPort) {
        var nodeArray = [];
        var nodeData;                                       // node stack's data element
        var nodeStack = [];                                 // stack for node recursion
        var degree = 0;                                     // node degree
        var i = 0;                                          // use for loop
        var len;                                            // node children's length
        var childData;
        var nodeChildData;
        var tip;
        var featureType;                                    // featureType text
        var left;                                           // left tips
        var right;                                          // right tips
        var predict;                                        // predict tips
        var prob;                                           // prob tips
        var tempTip;

        if (null == dataPort || (0 != dataPort.value && !dataPort.value)) {
            return nodeArray;
        }

        tip = dataPort.tip;
        tempTip = tip.split("<br\/>");
        if (dataPort.children) {
            featureType = tempTip[0];
            left = tempTip[1];
            right = tempTip[2];
        } else {
            predict = tempTip[0];
            prob = tempTip[1];
        }

        if ("string" == typeof dataPort.name && dataPort.name.length > 16) {
            dataPort.name = dataPort.name.substr(0, 16);
            dataPort.name += "...";
        }
        // node root
        nodeData = {
            key: parseInt(dataPort.value),
            name: "name:" + dataPort.name,
            value: dataPort.value,
            tip: dataPort.tip,
            children: dataPort.children,
            degree: degree,
            featureType: featureType,
            left: left,
            right: right,
            predict: predict,
            prob: prob,
            style: ""
        };
        nodeStack.push(nodeData);

        while (nodeStack.length > 0) {
            nodeData = nodeStack.pop();
            nodeArray.push(nodeData);
            if (nodeData.children) {
                len = nodeData.children.length;
                for (i = len - 1; i >= 0; i--) {
                    childData = nodeData.children[i];
                    tip = childData.tip;
                    tempTip = tip.split("<br\/>");
                    if (childData.children) {
                        featureType = tempTip[0];
                        left = tempTip[1];
                        right = tempTip[2];
                    } else {
                        predict = tempTip[0];
                        prob = tempTip[1];
                    }
                    if ("string" == typeof childData.name && childData.name.length > 16) {
                        childData.name = childData.name.substr(0, 16);
                        childData.name += "...";
                    }
                    nodeChildData = {
                        key: parseInt(childData.value),
                        parent: nodeData.key,
                        name: "name:" + childData.name,
                        value: childData.value,
                        tip: childData.tip,
                        children: childData.children,
                        degree: (nodeData.degree + 1),
                        featureType: featureType,
                        left: left,
                        right: right,
                        predict: predict,
                        prob: prob,
                        style: ""
                    };
                    nodeStack.push(nodeChildData);
                }
            }
        }
        return nodeArray;
    }

    return {
        createGraph: createGraph,
        generateNodeData: generateNodeData
    }
}();