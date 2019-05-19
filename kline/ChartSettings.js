var ChartSettings = {};
ChartSettings.checkVersion = function() {
    if (ChartSettings._data.ver < 2) {
        ChartSettings._data.ver = 2;
        var a = ChartSettings._data.charts;
        a.period_weight = {};
        a.period_weight.line = 8;
        a.period_weight["1min"] = 7;
        a.period_weight["5min"] = 6;
        a.period_weight["15min"] = 5;
        a.period_weight["30min"] = 4;
        a.period_weight["1hour"] = 3;
        a.period_weight["1day"] = 2;
        a.period_weight["1week"] = 1;
        a.period_weight["3min"] = 0;
        a.period_weight["2hour"] = 0;
        a.period_weight["4hour"] = 0;
        a.period_weight["6hour"] = 0;
        a.period_weight["12hour"] = 0;
        a.period_weight["3day"] = 0
    }
    if (ChartSettings._data.ver < 3) {
        ChartSettings._data.ver = 3;
        var a = ChartSettings._data.charts;
        a.areaHeight = []
    }
};
ChartSettings.get = function(m) {
    if (ChartSettings._data == undefined) {
        ChartSettings.init(m);
        ChartSettings.load();
        ChartSettings.checkVersion()
    }
    return ChartSettings._data
};
ChartSettings.init = function(manager) {
    var f = {};
    var k = new Array("MA", "EMA", "VOLUME", "MACD", "KDJ", "StochRSI", "RSI", "DMI", "OBV", "BOLL", "DMA", "TRIX", "BRAR", "VR", "EMV", "WR", "ROC", "MTM", "PSY");
    for (var g = 0; g < k.length; g++) {
        var m = manager.getInstance().createIndicatorAndRange("", k[g], true);
        if (m == null) {
            continue
        }
        f[k[g]] = [];
        var b = m.indic.getParameters();
        for (var e = 0; e < b.length; e++) {
            f[k[g]].push(b[e])
        }
    }
    var h = "CandleStick";
    var c = "MA";
    var a = new Array("VOLUME", "MACD");
    var l = "15m";
    var d = {};
    d.chartStyle = h;
    d.mIndic = c;
    d.indics = a;
    d.indicsStatus = "open";
    d.period = l;
    ChartSettings._data = {
        ver: 1,
        charts: d,
        indics: f,
        theme: "Dark"
    };
    ChartSettings.checkVersion()
};
ChartSettings.load = function() {
    if (document.cookie.length <= 0) {
        return
    }
    var c = document.cookie.indexOf("chartSettings=");
    if (c < 0) {
        return
    }
    c += "chartSettings=".length;
    var a = document.cookie.indexOf(";", c);
    if (a < 0) {
        a = document.cookie.length
    }
    var b = unescape(document.cookie.substring(c, a));
    ChartSettings._data = JSON.parse(b)
};
ChartSettings.save = function() {
    var a = new Date();
    a.setDate(a.getDate() + 2);
    document.cookie = "chartSettings=" + escape(JSON.stringify(ChartSettings._data)) + ";expires=" + a.toGMTString()
};