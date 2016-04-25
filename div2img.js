var div2img = function () {
	var getStyles = function(svg) {
        var cssIRIs = [],
            styleSheets = [];
        var clone = svg.cloneNode(true);
        var defs;
        var xlinkNS = "http://www.w3.org/1999/xlink",
            svgNS = 'http://www.w3.org/2000/svg';
        var getDef = function() {
            // Do we have a `<defs>` element already ?
            defs = clone.querySelector('defs') || document.createElementNS(svgNS, 'defs');
            if (!defs.parentNode) {
                clone.insertBefore(defs, clone.firstElementChild);
            }
        };
        var i;
        console.log(cssIRIs)
        // get the stylesheets of the document (ownerDocument in case svg is in <iframe> or <object>)
        var docStyles = svg.ownerDocument.styleSheets;

        // transform the live StyleSheetList to an array to avoid endless loop
        for (i = 0; i < docStyles.length; i++) {
            styleSheets.push(docStyles[i]);
        }

        if (styleSheets.length) {
            getDef();
            svg.matches = svg.matches || svg.webkitMatchesSelector || svg.mozMatchesSelector || svg.msMatchesSelector || svg.oMatchesSelector;
        }

        // iterate through all document's stylesheets
        for (i = 0; i < styleSheets.length; i++) {
        	var currentStyle = styleSheets[i]

            var rules;
            try {
                rules = currentStyle.cssRules;
            } catch (e) {
                continue;
            }
            // create a new style element
            var style = document.createElement('style');
            // some stylesheets can't be accessed and will throw a security error
            var l = rules && rules.length;
            // iterate through each cssRules of this stylesheet
            for (var j = 0; j < l; j++) {
                // get the selector of this cssRules
                var selector = rules[j].selectorText;
                // probably an external stylesheet we can't access
                if(!selector){
                	continue;
                	}
                
                // is it our svg node or one of its children ?
                if ((svg.matches && svg.matches(selector)) || svg.querySelector(selector)) {

                    var cssText = rules[j].cssText;
                    
					var reg = new RegExp(/url\((.*?)\)/g);
	                var matched = [];
					while ((matched = reg.exec(cssText)) !== null) {
                        var ext = matched[1].replace(/\"/g, '');
                        var href = currentStyle.href || location.href;
                        cssIRIs.push([ext, href]);
                        var a = tester.URL(ext, href);
                        var iri = (href===location.href && ext.indexOf('.svg')<0)? a.hash : a.href.substring(a.href.lastIndexOf('/') + 1);
                        var newId = '#' + iri.replace(/\//g, '_').replace(/\./g, '_').replace('#', '_');
                        cssText = cssText.replace(ext, newId);
					}
                    // append it to our <style> node
                    style.innerHTML += cssText + '\n';
                }
            }
            // if we got some rules
            if (style.innerHTML) {
                // append the style node to the clone's defs
                defs.appendChild(style);
            }
        }
        // small hack to avoid border and margins being applied inside the <img>
        var s = clone.style;
        console.log(s)
        s.border = s.padding = s.margin = 0;
        s.transform = 'initial';
    };

    return {
        getStyles: getStyles
    }
}();