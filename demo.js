function renderStrings(stringsTable){
    var stringkeys = Object.keys(stringsTable);
    for(var i=0 ; i<stringkeys.length;i++){
    $("#"+stringkeys[i]).text(stringsTable[stringkeys[i]]);
    }
}

function renderWidget(name) {
    var widgetSettings = settings[name];
    if (widgetSettings.renderto) {
        var $container = $("#" + widgetSettings.renderto);

        switch (name) {
            case "clock":
                $container.text(new Date().format( widgetSettings.format));
                break;
            case "logo":
                var img = new Image();
                img.src = widgetSettings.src;
                $container.append(img);
                break;
            default:
                //widget not defined
                $container.text("Missing widget " + name);
                break;
        }
    }
}

function renderContainer($targetElem, tagInfoString) {
    //if target is UL, OL need intermediate LI
    //parse tagInfo
    var tagInfo = {};
    var parser = /([a-zA-Z][a-zA-Z0-9\-_]*)?(?:#([a-zA-Z](?:[a-zA-Z0-9\-_]|\\\\[^\s])*))?((?:\.(?:(?:[a-zA-Z]|\\\\[^\s])(?:[a-zA-Z0-9\-_]|\\\\[^\s])*))*)/;
    if (tagInfoString) {
        var matches = parser.exec(tagInfoString);
        if (typeof matches[1] != "undefined") {
            tagInfo.tagName = matches[1];
        }
        if (typeof matches[2] != "undefined") {
            tagInfo.id = matches[2];
        }
        if (typeof matches[3] != "undefined") {
            tagInfo.classes = matches[3].match(/(?:\.((?:[a-zA-Z]|\\\\[^\s])(?:[a-zA-Z0-9\-_]|\\\\[^\s])*))/g);
        }
    }
    var $container;

    if (!tagInfo.tagName) {
        if ($targetElem[0].tagName == "UL" || $targetElem[0].tagName == "OL") {
            $container = $(document.createElement("li"));
        } else {
            switch ($targetElem[0].tagName.toLowerCase()) {
                case "header":
                case "footer":
                case "section":
                case "main":
                    $container = $(document.createElement("section"));
                    break;
                case "span":
                    $container = $(document.createElement("span"));
                    break;

                default:
                    $container = $(document.createElement("div"));
                    break;
            }
        }
    } else {
        $container = $(document.createElement(tagInfo.tagName));
    }

    if (tagInfo.id) {
        $container.attr("id", tagInfo.id);
    }

    if (tagInfo.classes) {
        for (var i = 0; i < tagInfo.classes.length; i++) {
            $container.addClass(tagInfo.classes[i].substring(1));
        }
    }
    $targetElem.append($container);


    console.log("new item", tagInfoString, tagInfo, $container.html());



    //if target is header, use section (html5)
    //if target is footer, use section (html5)
    //if target is section, use section (html5)
    //if target is div, use div (pre-html5)
    //if tagret is span, use span (depreciated)
    return $container;
}



function renderObject(items, $targetElem) {
    $targetElem.empty();

    for (var i = 0; i < items.length; i++) {
        if (typeof (items[i]) == "string") {
            var $container = renderContainer($targetElem, items[i]);
            //$container.text(items[i]); //debug - to remove
        } else if (items[i].length) {
            //Container for children
            
            renderObject(items[i], renderContainer($targetElem));
        } else {
            var settings = Object.keys(items[i]);
            for (var k = 0; k < settings.length; j++) {
                renderObject(items[i][settings[k]],renderContainer($targetElem, settings[k]));
                break;
            }


        }
    }
}
