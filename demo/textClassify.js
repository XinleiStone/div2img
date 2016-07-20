var textClassify = {
    defaultWidth: 650,                      // default width
    defaultHeight: 650,                     // default height
    colors: [                               // default colors
        "rgb(255, 228, 181)",
        "rgb(205, 92, 92)",
        "rgb(238, 221, 130)",
        "rgb(244, 164, 96)",
        "rgb(135, 206, 235)",
        "rgb(102, 205, 170)",
        "rgb(238, 233, 233)",
        "rgb(154, 192, 205)",
        "rgb(238, 174, 238)",
        "rgb(105, 89, 205)"
    ],
    bgColor: "#190c01",
    fontColor: "#bcd7f0",

    draw:function(json, divid, options) {
        var width;                          // width
        var height;                         // height
        var colors;                         // colors
        var bgColor;                        // background color
        var fontColor;                      // font color

        checkOptions(options);              // check options

        var svg = d3.select("#" + divid)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        if (!svg[0][0]) {                   // check whether id is right
            console.log("div id wrong");
            return;
        }

        svg.append("rect")                  // background
            .attr("width", width)
            .attr("height", height)
            .attr("fill", bgColor);

        if ("string" == (typeof json)) {
            textClassify.fromUrl(json, width, height, colors, fontColor, svg);
        } else if ("object" == (typeof json)) {
            textClassify.fromJson(json, width, height, colors, fontColor, svg);
        } else {
            console.log("json is wrong!");
            return;
        }

        // check options function
        function checkOptions(options) {
            if (options) {
                if (options.weight) {
                    width = options.weight;
                } else {
                    width = textClassify.defaultWidth;
                }
                if (options.height) {
                    height = options.height;
                } else {
                    height = textClassify.defaultHeight;
                }
                if (options.colors) {
                    colors = options.colors;
                } else {
                    colors = textClassify.colors;
                }
                if (options.bgColor) {
                    bgColor = options.bgColor;
                } else {
                    bgColor = textClassify.bgColor;
                }
                if (options.fontColor) {
                    fontColor = options.fontColor;
                } else {
                    fontColor = textClassify.fontColor;
                }
            } else {
                width = textClassify.defaultWidth;
                height = textClassify.defaultHeight;
                colors = textClassify.colors;
                bgColor = textClassify.bgColor;
                fontColor = textClassify.fontColor;
            }
        }
    },

    /**
     * function for getting the json data from json url
     *
     */
    fromUrl:function(jsonUrl, width, height, colors, fontColor, svg) {
        d3.json(jsonUrl, function(error, json) {
            if (error) {
                console.warn(error);
                return;
            }
            textClassify._(json, width, height, colors, fontColor, svg);
        });
    },

    /**
     * function for getting the json data from json url
     *
     */
    fromJson:function(json, width, height, colors, fontColor, svg) {
        textClassify._(json, width, height, colors, fontColor, svg);
    },

    /**
     * the action function
     **/
    _:function(json, width, height, colors, fontColor, svg) {
        var wordsLength;                            // count, say length of words
        var words;                                  // object words
        var data = [];                              // container of data array
        var father;                                 // container of every cluster data
        var colorCutFlag = 0;
        var nextCut = 0;

        if (json.words) {
            words = json.words;
            if (json.words.length) {
                wordsLength = json.words.length;    // get length of words
            }
        } else {
            console.warn("json wrong");
            return;
        }

        var i;
        for (i = 0; i < wordsLength; i++) {
            if (words[i].type) {
                var typeStr = words[i].type;
                if (!data[typeStr]) {
                    data[typeStr] = [];
                }
                data[typeStr].push(words[i]);
            }
        }

        var linear = d3.scale.linear()                 // linear
            .domain([0, wordsLength])
            .rangeRound([0, 220]);

        getChild(data);

        var gCenter = svg.append("g");                 // new group for center circle and text

        gCenter.append("circle")                       // center circle
            .attr("cx", width/2)
            .attr("cy", height/2)
            .attr("r", 15)
            .style("fill", "rgb(255, 165, 0)");

        function getChild(data) {
            for (var d in data) {
                var originalLength = data[d].length;
                var changedLength = linear(originalLength);
                father = {};
                father.type = d;
                father.children = [];
                for (var i = 0; i < changedLength; i++) {
                    if (!data[d][i]) {
                        father.children.push(data[d][i-1]);
                    } else {
                        father.children.push(data[d][i]);
                    }
                }
                drawD3(father, originalLength);
            }
        }

        function drawD3(father, originalLength) {
            var changedWordsLength;
            var colorLength;
            var cut;                            // array for every random cut size
            var radius;                         // cluster radius
            var cutFlag;                        // judge whether needs cut
            var flexFlag;                       // flexFlag direction flag
            var linePoint;                      // point between node and center
            var length;
            var ratio;                          // percent of word
            var textLinear;                     // text linear
            var cluster;                        // cluster recover angle and radius
            var textWidth;
            var nodes;
            var gBundle;                        // position
            var originalColor;

            initData();
            drawPicture();
            nextCut += ratio * 360;
            colorCutFlag++;

            function initData() {
                changedWordsLength = linear(wordsLength);
                colorLength = colors.length;
                length = father.children.length;
                ratio = length / changedWordsLength;
                radius = width / 2 - 120;
                cut = [];
                linePoint = [];
                cutFlag = 0;

                textLinear = d3.scale.linear()
                    .domain([0, 1])
                    .rangeRound([10, 40]);

                cluster = d3.layout.cluster()
                    .size([ratio * 360, radius])
                    .separation(function(d) {
                        return 20 * Math.random();
                    });

                textWidth = textLinear(ratio);
                nodes = cluster.nodes(father);

                gBundle = svg.append("g")
                    .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

                if (Math.round(Math.random() * 100) % 2 == 0) {
                    flexFlag = 1;
                } else {
                    flexFlag = -1;
                }

                cut[0] = 0;
                for (var i = 1; i < nodes.length; i++) {
                    if (0 == i % 3 ) {
                        cut[i] = Math.random() * 5;
                    } else if (0 == i % 4 || 1 == i % 10) {
                        cut[i] = Math.random() * 10 + 15;
                    } else if (0 == i % 5) {
                        cut[i] = Math.random() * 40 + 65;
                    } else if (1 == i % 2) {
                        cut[i] = Math.random() * 10 + 45;
                    } else {
                        cut[i] = Math.random() * 10 + 30;
                    }
                }
            }

            function drawPicture() {
                var node = gBundle.selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", function(d, i) {
                        if (!d.children) {
                            return "rotate(" + (d.x + nextCut) + ")translate(" + (d.y - cut[i]) + ")" + "rotate("+ (d.x) +")";
                        } else {
                            return "rotate(" + (d.x) + ")translate(" + (d.y ) + ")" + "rotate("+ (d.x) +")";
                        }
                    });

                var line = d3.svg.line.radial(k)            // draw line function
                    .interpolate("basis")
                    .tension(0.85)
                    .radius(function(d, i) {
                        if ("0" == d.y) {
                            cutFlag++;
                            return (d.y);
                        } else {
                            return (d.y - cut[cutFlag]);
                        }
                    })
                    .angle(function(d) {
                        if (!d.children) {
                            return ((d.x + nextCut + 90) / 180 * Math.PI);
                        } else {
                            return ((d.x + 90) / 180 * Math.PI);
                        }
                    });



                node.append("circle")
                    .attr("d", function(d, i) {
                        linePoint[i] = [];                 // put two points between node and center
                        linePoint[i].push(
                            {
                                x: 0,
                                y: 0
                            },
                            {
                                x: (d.x - flexFlag * (Math.random() * radius / 60 + Math.random() * radius / 60 )),
                                y: radius / 2
                            },
                            {
                                x: (d.x + flexFlag * (Math.random() * radius / 60 + Math.random() * radius / 60 )),
                                y: radius / 12 * 11
                            },
                            {
                                x: d.x,
                                y: d.y
                            }
                        );
                    });

                for (var k = 1; k < linePoint.length; k++) {            // draw line
                    var link = gBundle.selectAll("path.line")
                        .data(linePoint[k])
                        .enter()
                        .append("path")
                        .attr("class", "link2")
                        .style("stroke", function() {
                            return colors[colorCutFlag % colorLength];
                        })
                        .attr("d", line(linePoint[k]));
                }

                node.append("circle")
                    .attr("r", function(d) {
                        if (!d.children) {
                            return 10;
                        }
                    })
                    .attr("class", "circle2")
                    .style("fill", function(d, i) {
                        linePoint[i] = [];
                        if (!d.children) {
                            return colors[colorCutFlag % colorLength];
                        }
                    })
                    .on("mouseover", function(d) {
                        onMouseOver(this, d);
                    })
                    .on("mouseout", function(d) {
                        onMouseOut(this, d);
                    })
                    .on("mouseup", function(d) {
                        onClick(d);
                    });

                node.append("text")
                    .attr({
                        "dy":".2em",
                        "class": "text",
                        "text-anchor": "middle",
                        "transform": function(d, i) {
                            return "rotate(" + ( -2 * d.x - nextCut) + ")";
                        },
                        "opacity": function(d) {
                            return "0";
                        }
                    })
                    .attr("fill", fontColor)
                    .text(function(d) {
                        if (!d.children) {
                            return d.name;
                        }
                    })
                    .on("mouseover", function(d) {
                        onMouseOver(this, d);
                    })
                    .on("mouseout", function(d) {
                        onMouseOut(this, d);
                    })
                    .on("mouseup", function(d) {
                        onClick(d);
                    });

                drawOuterText();

                function onMouseOver(thisTag, d) {
                    var par = thisTag.parentNode;
                    var length = par.childNodes.length;
                    for (var i = 0; i < length; i++) {
                        if ("circle" == par.childNodes[i].tagName) {
                            originalColor = par.childNodes[i].style.fill;
                            par.childNodes[i].style.fill = "yellow";
                        } else if ("text" == par.childNodes[i].tagName) {
                            par.childNodes[i].style.opacity = "0.8";
                        }
                    }
                }

                function onMouseOut(thisTag, d) {
                    var par = thisTag.parentNode;
                    var length = par.childNodes.length;
                    for (var i = 0; i < length; i++) {
                        if ("circle" == par.childNodes[i].tagName) {
                            par.childNodes[i].style.fill = originalColor;
                        } else if ("text" == par.childNodes[i].tagName) {
                            par.childNodes[i].style.opacity = "0";
                        }
                    }
                }

                function onClick(d) {
                    var url = d.url;
                    window.open(url);
                }
            }

            function drawOuterText() {
                var child = father.children[0];
                father.children = [];
                father.children.push(child);

                var cluster2 = d3.layout.cluster()
                    .size([ratio * 360, radius + 60])            // cluster recover angle and radius
                    .separation(function(d) {                    // node spacing
                        return 1;
                    });

                var nodes2 = cluster2.nodes(father);

                var node = gBundle.selectAll(".node2")
                    .data(nodes2)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", function(d, i) {
                        if (!d.children) {
                            return "rotate(" + (d.x + nextCut) + ")translate(" + (d.y) + ")" + "rotate("+ (d.x) +")";
                        } else {
                            return "rotate(" + (d.x) + ")translate(" + (d.y ) + ")" + "rotate("+ (d.x) +")";
                        }
                    });

                node.append("circle")
                    .attr("r", function(d) {
                        if (!d.children) {
                            return textWidth / 2;
                        }
                    })
                    .attr("class", "circle2")
                    .attr("transform", function(d) {
                        if (!d.children) {
                            return "rotate(" + ( - nextCut - 2 * d.x) + ")translate(" + (-(6 + ratio * 30) - 6 - ratio * 120) + "," + ( - 6 - ratio * 60 / 2 ) + ")";
                        }
                    })
                    .attr("fill", function(d, i) {
                        if (!d.children) {
                            return colors[colorCutFlag % colorLength];
                        }
                    });

                node.append("text")
                    .style("font-family", "幼圆")
                    .style("text-anchor", "start")
                    .style("dominant-baseline", "middle")
                    .style("font-size", function(d) {
                        return textWidth + "px";
                    })
                    .text(function(d) {
                        if (!d.children) {
                            return d.type;
                        }
                    })
                    .attr("class", "text-edge")
                    .attr("fill", function(d) {
                        return colors[colorCutFlag % colorLength];
                    })
                    .attr("transform", function(d) {
                        if (!d.children) {
                            return "rotate(" + ( - nextCut - 2 * d.x) + ")translate(" + ( - 6 - ratio * 120) + "," + ( - 6 - ratio * 60 / 2 ) + ")";
                        }
                    });

                node.append("text")
                    .style("font-family", "幼圆")
                    .style("text-anchor", "start")
                    .style("dominant-baseline", "middle")
                    .style("font-size", function(d) {
                        return textWidth + "px";
                    })
                    .text(function(d) {
                        if (!d.children) {
                            return "曝光次数：" + originalLength;
                        }
                    })
                    .attr("class", "text-edge")
                    .attr("fill", function(d) {
                        return colors[colorCutFlag % colorLength];
                    })
                    .attr("transform", function(d) {
                        if (!d.children) {
                            return "rotate(" + ( - nextCut - 2 * d.x) + ")translate(" + ( -(6 + ratio * 60) - 12 - ratio * 120 ) + "," + ( 6 + ratio * 60 / 2 ) + ")";
                        }
                    });
            }
        }
    }
}