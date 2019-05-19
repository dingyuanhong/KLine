var ChartSession = create_class();

ChartSession.prototype.periodMap = {
    "01w": "1week",
    "03d": "3day",
    "01d": "1day",
    "12h": "12hour",
    "06h": "6hour",
    "04h": "4hour",
    "02h": "2hour",
    "01h": "1hour",
    "30m": "30min",
    "15m": "15min",
    "05m": "5min",
    "03m": "3min",
    "01m": "1min"
};
ChartSession.prototype.tagMapPeriod = {
    "1w": "01w",
    "3d": "03d",
    "1d": "01d",
    "12h": "12h",
    "6h": "06h",
    "4h": "04h",
    "2h": "02h",
    "1h": "01h",
    "30m": "30m",
    "15m": "15m",
    "5m": "05m",
    "3m": "03m",
    "1m": "01m"
};

ChartSession.prototype.__construct = function() {
    this.chartMgr = null
    this.time_type = "15min";
    this.market_from = "1"
    this.market_from_name = 'BTC' //币种id
    this.limit = "1000"
    
    this.lastTime = null;
};
ChartSession.prototype.getInstance = function() {
    return this.chartMgr;
}
ChartSession.prototype.setParam = function(lastTime) {
    this.lastTime = lastTime;
}
ChartSession.prototype.request = function() {}

var Chart = create_class();
Chart.strPeriod = {
    "zh-cn": {
        line: "(分时)",
        "1min": "(1分钟)",
        "5min": "(5分钟)",
        "15min": "(15分钟)",
        "30min": "(30分钟)",
        "1hour": "(1小时)",
        "1day": "(日线)",
        "1week": "(周线)",
        "3min": "(3分钟)",
        "2hour": "(2小时)",
        "4hour": "(4小时)",
        "6hour": "(6小时)",
        "12hour": "(12小时)",
        "3day": "(3天)"
    },
    "en-us": {
        line: "(Line)",
        "1min": "(1m)",
        "5min": "(5m)",
        "15min": "(15m)",
        "30min": "(30m)",
        "1hour": "(1h)",
        "1day": "(1d)",
        "1week": "(1w)",
        "3min": "(3m)",
        "2hour": "(2h)",
        "4hour": "(4h)",
        "6hour": "(6h)",
        "12hour": "(12h)",
        "3day": "(3d)"
    },
    "zh-tw": {
        line: "(分時)",
        "1min": "(1分钟)",
        "5min": "(5分钟)",
        "15min": "(15分钟)",
        "30min": "(30分钟)",
        "1hour": "(1小時)",
        "1day": "(日线)",
        "1week": "(周线)",
        "3min": "(3分钟)",
        "2hour": "(2小時)",
        "4hour": "(4小時)",
        "6hour": "(6小時)",
        "12hour": "(12小時)",
        "3day": "(3天)"
    }
};
Chart.prototype.__construct = function(session) {
    this._data = null;
    this._charStyle = "CandleStick";
    this._depthData = {
        array: null,
        asks_count: 0,
        bids_count: 0,
        asks_si: 0,
        asks_ei: 0,
        bids_si: 0,
        bids_ei: 0
    };
    this._session = session;
    this._time = this._session.time_type;
    this._market_from = this._session.market_from;
    this._usd_cny_rate = 6.1934;
    this._money_type = "USD";
    this._contract_unit = "BTC";
    this.strIsLine = false;
    this.strCurrentMarket = 20150403001;
    this.strCurrentMarketType = 1
};
Chart.prototype.setTitle = function() {
    var b = this._session.getInstance().getLanguage();
    var a = this._session.market_from_name;
    a += " ";
    a += this.strIsLine ? Chart.strPeriod[b]["line"] : Chart.strPeriod[b][this._time];
    a += (this._contract_unit + "/" + this._money_type).toUpperCase();
    this._session.getInstance().setTitle("frame0.k0", a);
};
Chart.prototype.setCurrentList = function() {};
Chart.prototype.setMarketFrom = function(a) {
    this._market_from = a;
    this.updateDataAndDisplay()
};
Chart.prototype.updateDataAndDisplay = function() {
    this._session.market_from = this._market_from;
    this._session.time_type = this._time;
    this.setTitle();
    this._session.getInstance().setCurrentDataSource("frame0.k0", "BTC123." + this._market_from + "." + this._time);
    this._session.getInstance().setNormalMode();
    var a = this._session.getInstance().getDataSource("frame0.k0").getLastDate();
    this._session.setParam(a);
    this._session.request();
    this._session.getInstance().redraw("All", false)
};
Chart.prototype.setCurrentContractUnit = function(a) {
    this._contract_unit = a;
    this.updateDataAndDisplay()
};
Chart.prototype.setCurrentMoneyType = function(a) {
    this._money_type = a;
    this.updateDataAndDisplay()
};
Chart.prototype.setCurrentPeriod = function(a) {
    this._time = this._session.periodMap[a];
    this.updateDataAndDisplay()
};
Chart.prototype.updateDataSource = function(a) {
    this._data = a;
    this._session.getInstance().updateData("frame0.k0", this._data)
};
Chart.prototype.updateDepth = function(d) {
    if (d == null) {
        this._depthData.array = [];
        this._session.getInstance().redraw("All", false);
        return
    }
    if (!d.asks || !d.bids || d.asks == "" || d.bids == "") {
        return
    }
    var b = this._depthData;
    b.array = [];
    for (var a = 0; a < d.asks.length; a++) {
        var c = {};
        c.rate = d.asks[a][0];
        c.amount = d.asks[a][1];
        b.array.push(c)
    }
    for (var a = 0; a < d.bids.length; a++) {
        var c = {};
        c.rate = d.bids[a][0];
        c.amount = d.bids[a][1];
        b.array.push(c)
    }
    b.asks_count = d.asks.length;
    b.bids_count = d.bids.length;
    b.asks_si = b.asks_count - 1;
    b.asks_ei = 0;
    b.bids_si = b.asks_count;
    b.bids_ei = b.asks_count + b.bids_count - 1;
    for (var a = b.asks_si; a >= b.asks_ei; a--) {
        if (a == b.asks_si) {
            b.array[a].amounts = b.array[a].amount
        } else {
            b.array[a].amounts = b.array[a + 1].amounts + b.array[a].amount
        }
    }
    for (var a = b.bids_si; a <= b.bids_ei; a++) {
        if (a == b.bids_si) {
            b.array[a].amounts = b.array[a].amount
        } else {
            b.array[a].amounts = b.array[a - 1].amounts + b.array[a].amount
        }
    }
    this._session.getInstance().redraw("All", false)
};
Chart.prototype.setMainIndicator = function(a) {
    this._mainIndicator = a;
    if (a == "NONE") {
        this._session.getInstance().removeMainIndicator("frame0.k0")
    } else {
        this._session.getInstance().setMainIndicator("frame0.k0", a)
    }
    this._session.getInstance().redraw("All", true)
};
Chart.prototype.setIndicator = function(b, a) {
    if (a == "NONE") {
        var b = 2;
        if (Template.displayVolume == false) {
            b = 1
        }
        var c = this._session.getInstance().getIndicatorAreaName("frame0.k0", b);
        if (c != "") {
            this._session.getInstance().removeIndicator(c)
        }
    } else {
        var b = 2;
        if (Template.displayVolume == false) {
            b = 1
        }
        var c = this._session.getInstance().getIndicatorAreaName("frame0.k0", b);
        if (c == "") {
            Template.createIndicatorChartComps("frame0.k0", a,this._session.getInstance())
        } else {
            this._session.getInstance().setIndicator(c, a)
        }
    }
    this._session.getInstance().redraw("All", true)
};
Chart.prototype.addIndicator = function(a) {
    this._session.getInstance().addIndicator(a);
    this._session.getInstance().redraw("All", true)
};
Chart.prototype.removeIndicator = function(a) {
    var b = this._session.getInstance().getIndicatorAreaName(2);
    this._session.getInstance().removeIndicator(b);
    this._session.getInstance().redraw("All", true)
};