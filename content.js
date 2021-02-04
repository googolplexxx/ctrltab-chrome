/*
 Ctrl+Tab MRU (c) Daniel Calliess */
var at_flansch_ctrltabmru_debug = !1,
    at_flansch_ctrltabmru_idx = 0;
window == top && (window.addEventListener("keyup", function(b) {
    17 == b.keyCode && chrome
        .runtime
        .sendMessage({ type: "ctrlkeyup" })
}, !1), window.addEventListener("keydown", function(b) {
    27 == b.keyCode && chrome
        .runtime
        .sendMessage({ type: "escapekeydown" })
}, !1), window.addEventListener("load", function(b) {
    at_flansch_ctrltabmru_debug && console.log("tab window loaded", window.location.hash);
    window.location.search && 0 == window
        .location
        .search
        .indexOf("?at_flansch_ctrltabmru=") && chrome
        .runtime
        .sendMessage({
            type: "tabloaded",
            data: {
                command: window
                    .location
                    .search
                    .substring(window.location.search.indexOf("=") + 1)
            }
        })
}, !1), window.addEventListener("blur", function(b) {
    at_flansch_ctrltabmru_debug && console.log("tab window blurred", window.location.hash);
    chrome
        .runtime
        .sendMessage({ type: "tabblurred" })
}, !1));
chrome
    .runtime
    .onMessage
    .addListener(function(b, a, h) {
        if (!a.tab) {
            at_flansch_ctrltabmru_debug && console.log("message received", b);
            a = null;
            switch (b.type) {
                case "ping":
                    (a = null != document.xmlVersion) || document.hasFocus() || window.focus();
                    var c = document.getElementsByTagName("embed"),
                        c = 1 == c.length && "application/pdf" == c[0].getAttribute("type");
                    b = 0 < document
                        .getElementsByTagName("frameset")
                        .length;
                    a = {
                        result: "OK",
                        windowFocused: !document.hasFocus || document.hasFocus(),
                        menuVisible: null != document.getElementById("at_flansch_ctrltabmru_menu"),
                        isPdf: c,
                        isFrameset: b,
                        isXml: a
                    };
                    break;
                case "showmenu":
                    b = b.data;
                    a = document.createElement("div");
                    a.id = "at_flansch_ctrltabmru_menu";
                    c = document.createElement("ul");
                    a.appendChild(c);
                    for (var d, f, g, i, e = b.length - 1; 0 <= e; e--)
                        b[e] && (d = document.createElement("li"), d.setAttribute("data-tabid", b[e].id), d.addEventListener("click", function(a) {
                            at_flansch_ctrltabmru_debug && console.log("titleclick", Array.prototype.indexOf.call(a.target.parentElement.children, a.target));
                            at_flansch_ctrltabmru_idx = Array
                                .prototype
                                .indexOf
                                .call(a.target.parentElement.children, a.target);
                            chrome
                                .runtime
                                .sendMessage({ type: "ctrlkeyup" })
                        }), g = b[e].favIconUrl, f = document.createElement("img"), f.setAttribute("class", "at_flansch_ctrltabmru_favicon"), f.src = g, i = document.createElement("img"), i.setAttribute("class", "at_flansch_ctrltabmru_screenshot"), i.src = b[e].img, d.appendChild(i), d.appendChild(f), d.appendChild(document.createTextNode(b[e].title)), c.appendChild(d));
                    bg = document.createElement("div");
                    bg.setAttribute("style", `--bg:url(${c.childNodes[at_flansch_ctrltabmru_idx].querySelector("img.at_flansch_ctrltabmru_screenshot").src});`)
                    bg.id = "at_flansch_ctrltabmru_bg";
                    document
                        .body
                        .appendChild(a);
                    document
                        .body
                        .appendChild(bg);
                    a = {
                        result: "OK"
                    };
                    break;
                case "updatemenu":
                    (a = document.getElementById("at_flansch_ctrltabmru_menu")) ?
                    (c = a.firstChild, c.childNodes[at_flansch_ctrltabmru_idx].className = "", a = c.childNodes.length, at_flansch_ctrltabmru_idx += "next" == b.data.direction ?
                        1 :
                        -1, 0 > at_flansch_ctrltabmru_idx ?
                        at_flansch_ctrltabmru_idx = a - 1 :
                        at_flansch_ctrltabmru_idx >= a && (at_flansch_ctrltabmru_idx = 0), c.childNodes[at_flansch_ctrltabmru_idx].className = "at_flansch_ctrltabmru_selected", (document.querySelector("#at_flansch_ctrltabmru_bg") || document.createElement("div")).setAttribute("style", `--bg:url(${c.childNodes[at_flansch_ctrltabmru_idx].querySelector("img.at_flansch_ctrltabmru_screenshot").src});`), c.childNodes[at_flansch_ctrltabmru_idx].querySelector("img.at_flansch_ctrltabmru_screenshot"), a = {
                            result: "OK"
                        }) :
                    a = {
                        result: "Error: menu missing"
                    };
                    break;
                case "deletemenu":
                    (a = document.getElementById("at_flansch_ctrltabmru_menu")) ?
                    (c = a.firstChild.childNodes[at_flansch_ctrltabmru_idx].getAttribute("data-tabid"),
                        setTimeout(() => document.body.removeChild(document.querySelector("div#at_flansch_ctrltabmru_bg")), 50),
                        a.parentNode.removeChild(a),
                        a = {
                            result: "OK",
                            selectedItem: c
                        }) :
                    a = {
                            result: "Error: menu missing"
                        },
                        at_flansch_ctrltabmru_idx = 0
                    break;
            }
            a && h(a);
            return !0
        }
    });