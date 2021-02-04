/*
 Ctrl+Tab MRU (c) Daniel Calliess */
var debug = !1,
    mruTabs = [],
    active = false;
const blackUrl = "chrome-extension://ajagioghhahphknilijnoddicbkcmmie/black.png";
chrome
    .tabs
    .query({
        currentWindow: !0,
        windowType: "normal"
    }, function(a) {
        for (var b = -1, c = 0; c < a.length; c++)
            0 != a[c].url.indexOf("chrome-devtools:") && (a[c].active && (b = mruTabs.length), mruTabs.push({ id: a[c].id, img: blackUrl }), debug && console.log("initial tab add, window: " + a[c].windowId + "; tab: " + a[c].id));

        -
        1 < b && (mruTabs.push(mruTabs.splice(b, 1)[0]), debug && console.log("initial active tab: " + mruTabs[mruTabs.length - 1].id))
        mruTabs = mruTabs.filter((d) => !a[d.id].url.startsWith("chrome-extension://"));
    });

function displayMenu(a, b) {
    var c = [];
    chrome
        .tabs
        .query({
            currentWindow: !0,
            windowType: "normal"
        }, function(d) {
            d = d.filter((t) => !t.url.startsWith("chrome-extension://"));
            for (var g, e = 0; e < d.length; e++)
                for (var f = 0; f < mruTabs.length; f++)
                    mruTabs[f].id == d[e].id && (g = d[e].favIconUrl && 0 != d[e].favIconUrl.toLowerCase().indexOf("chrome://") ?
                        d[e].favIconUrl :
                        "favicon.png", c[f] = {
                            img: mruTabs[f].img,
                            favIconUrl: g,
                            title: d[e].title ?
                                d[e].title : d[e].url,
                            id: d[e].id
                        });
            debug && console.log("data", c);
            debug && console.log("displaying menu");
            chrome
                .tabs
                .sendMessage(b.id, {
                    type: "showmenu",
                    data: c
                }, function(d) {
                    debug && console.log("menu drawn", d);
                    d && "OK" == d.result && updateMenu(a, b)
                })
        })
}

function updateMenu(a, b) {
    debug && console.log("update: direction", a);
    chrome
        .tabs
        .sendMessage(b.id, {
            type: "updatemenu",
            data: {
                direction: a
            }
        }, function(a) {
            debug && console.log("menu updated", a)
        })
}
chrome
    .commands
    .onCommand
    .addListener(function(a) {
        debug && console.log("onCommand event received for message: ", a);
        chrome
            .tabs
            .query({
                currentWindow: !0,
                active: !0
            }, function(b) {
                if (b && 0 < b.length) {
                    var c = b[0];
                    active = true;
                    chrome
                        .tabs
                        .sendMessage(c.id, {
                            type: "ping"
                        }, function(d) {
                            !d || "OK" != d.result || !d.windowFocused || d.isPdf || d.isFrameset || d.isXml ?
                                chrome
                                .tabs
                                .create({
                                    url: chrome
                                        .extension
                                        .getURL("at_flansch_ctrltabmru.html?at_flansch_ctrltabmru=" + a),
                                    active: !0,
                                    index: c.index + 1
                                }, function(a) {
                                    debug && console.log("tab created")
                                }) :
                                d.menuVisible ?
                                updateMenu(a, c) :
                                displayMenu(a, c)
                        })
                }
            })
    });
chrome
    .runtime
    .onMessage
    .addListener(function(a, b, c) {
        debug && console.log("message received: " + (a && a.type ?
            a.type :
            "request object empty"));
        a && ("tabblurred" == a.type || "escapekeydown" == a.type ?
            chrome.tabs.sendMessage(b.tab.id, {
                type: "deletemenu"
            }, function(a) {
                debug && console.log("blurred tab's menu deleted", a);
                "OK" == a.result && -1 < b
                    .tab
                    .url
                    .indexOf("/at_flansch_ctrltabmru.html") && chrome
                    .tabs
                    .remove(b.tab.id)
            }) :
            chrome.tabs.query({
                currentWindow: !0,
                windowType: "normal",
                active: !0
            }, function(b) {
                if (b && 0 < b.length) {
                    var c = b[0];
                    "ctrlkeyup" == a.type ?
                        (chrome
                            .tabs
                            .sendMessage(c.id, {
                                type: "deletemenu"
                            }, function(a) {
                                debug && console.log("menu deleted", a);
                                "OK" == a.result && (chrome.tabs.update(parseInt(a.selectedItem), {
                                    selected: !0
                                }), debug && console.log("switched!"), -1 < c.url.indexOf("/at_flansch_ctrltabmru.html") && chrome.tabs.remove(c.id))
                            }), setTimeout(() => { active = false }, 50)) :
                        "tabloaded" == a.type && displayMenu(a.data.command, c)
                }
            }))
    });
chrome
    .tabs
    .onCreated
    .addListener(function(a) {
        0 != a
            .url
            .indexOf("chrome-devtools:") && -1 == a
            .url
            .indexOf("/at_flansch_ctrltabmru.html") && (debug && console.log("onCreated, window: " + a.windowId + "; tab: " + a.id), a.active ?
                mruTabs.push({ id: a.id, img: blackUrl }) :
                mruTabs.splice(mruTabs.length - 1, 0, a.id));
    });
chrome
    .tabs
    .onRemoved
    .addListener(function(a, b) {
        for (var c = 0; c < mruTabs.length; c++)
            if (mruTabs[c].id == a) {
                debug && console.log("onRemoved, window: " + b.windowId + "; tab: " + a);
                mruTabs.splice(c, 1);
                break
            }
    });
chrome
    .tabs
    .onActivated
    .addListener(function(a) {
        for (var b = 0; b < mruTabs.length; b++)
            if (mruTabs[b].id == a.tabId) {
                chrome.tabs.sendMessage(a.tabId, { type: "ping" }, (d) => {
                    chrome.tabs.captureVisibleTab((i) => {
                        debug && console.log("onActivated, window: " + a.windowId + "; tab: " + a.tabId);
                        let spl = mruTabs.splice(b, 1)[0];
                        mruTabs.push({ id: spl.id, img: (d && !d.menuVisible) ? i : spl.img });
                    });
                });
                break
            }
    });
chrome
    .runtime
    .onInstalled
    .addListener(function(a) {
        if ("install" == a.reason)
            debug && console.log("New installed"),
            InjectScripts();
        else if ("update" == a.reason) {
            var b = chrome
                .runtime
                .getManifest()
                .version;
            debug && console.log("Updated version " + a.previousVersion + " to " + b)
        }
    });
chrome.manifest = chrome
    .app
    .getDetails();
var injectIntoTab = function(a) {
    for (var b = chrome.manifest.content_scripts[0].js, c = 0, d = b.length; c < d; c++)
        chrome.tabs.executeScript(a.id, { file: b[c] })
};

function InjectScripts() {
    chrome
        .windows
        .getAll({
            populate: !0
        }, function(a) {
            for (var b = 0, c = a.length, d; b < c; b++) {
                d = a[b];
                debug && console.log("current window", d);
                for (var g = 0, e = d.tabs.length, f; g < e; g++)
                    f = d.tabs[g],
                    f.url.match(/(chrome|chrome\-extension):\/\//gi) || (debug && console.log("current tab", f), injectIntoTab(f))
            }
        })
};

setInterval(() => {
    if (!active)
        chrome.tabs.getSelected((sel) => {
            const ind = mruTabs.findIndex((tab) => sel.id == tab.id);
            chrome.tabs.captureVisibleTab((url) => {
                mruTabs[ind].img = url;
            });
        });
}, 1000);