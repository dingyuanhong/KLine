var CPoint = create_class(NamedObject);
CPoint.state = {
    Hide: 0,
    Show: 1,
    Highlight: 2
};
CPoint.prototype.__construct = function(a, m) {
    CPoint.__super.__construct.call(this, a);
    this._manager = m;
    this.pos = {
        index: -1,
        value: -1
    };
    this.state = CPoint.state.Hide
};
CPoint.prototype.getChartObjects = function() {
    var b = this._manager.getInstance();
    var d = b.getDataSource("frame0.k0");
    if (d == null || !is_instance(d, MainDataSource)) {
        return null
    }
    var c = b.getTimeline("frame0.k0");
    if (c == null) {
        return null
    }
    var a = b.getRange("frame0.k0.main");
    if (a == null) {
        return null
    }
    return {
        pMgr: b,
        pCDS: d,
        pTimeline: c,
        pRange: a
    }
};
CPoint.prototype.setPosXY = function(b, f) {
    var e = this.getChartObjects();
    var d = e.pTimeline.toIndex(b);
    var c = e.pRange.toValue(f);
    var a = this.snapValue(d, c);
    if (a != null) {
        c = a
    }
    this.setPosIV(d, c)
};
CPoint.prototype.setPosXYNoSnap = function(a, e) {
    var d = this.getChartObjects();
    var c = d.pTimeline.toIndex(a);
    var b = d.pRange.toValue(e);
    this.setPosIV(c, b)
};
CPoint.prototype.setPosIV = function(b, a) {
    this.pos = {
        index: b,
        value: a
    }
};
CPoint.prototype.getPosXY = function() {
    var c = this.getChartObjects();
    var b = c.pTimeline.toItemCenter(this.pos.index);
    var a = c.pRange.toY(this.pos.value);
    return {
        x: b,
        y: a
    }
};
CPoint.prototype.getPosIV = function() {
    return {
        i: this.pos.index,
        v: this.pos.value
    }
};
CPoint.prototype.setState = function(a) {
    this.state = a
};
CPoint.prototype.getState = function() {
    return this.state
};
CPoint.prototype.isSelected = function(a, c) {
    var b = this.getPosXY();
    if (a < b.x - 4 || a > b.x + 4 || c < b.y - 4 || c > b.y + 4) {
        return false
    }
    this.setState(CPoint.state.Highlight);
    return true
};
CPoint.prototype.snapValue = function(o, j) {
    var k = this.getChartObjects();
    var h = null;
    var c = Math.floor(k.pTimeline.getFirstIndex());
    var e = Math.floor(k.pTimeline.getLastIndex());
    if (o < c || o > e) {
        return h
    }
    var f = k.pRange.toY(j);
    var d = k.pCDS.getDataAt(o);
    if (d == null || d == undefined) {
        return h
    }
    var p = null;
    if (o > 0) {
        p = k.pCDS.getDataAt(o - 1)
    } else {
        p = k.pCDS.getDataAt(o)
    }
    var b = k.pMgr.getChartStyle(k.pCDS.getFrameName());
    var l = k.pRange.toY(d.open);
    var g = k.pRange.toY(d.high);
    var r = k.pRange.toY(d.low);
    var m = k.pRange.toY(d.close);
    if (b === "CandleStickHLC") {
        l = k.pRange.toY(p.close)
    }
    var q = Math.abs(l - f);
    var n = Math.abs(g - f);
    var s = Math.abs(r - f);
    var a = Math.abs(m - f);
    if (q <= n && q <= s && q <= a) {
        if (q < 6) {
            h = d.open
        }
    }
    if (n <= q && n <= s && n <= a) {
        if (n < 6) {
            h = d.high
        }
    }
    if (s <= q && s <= n && s <= a) {
        if (s < 6) {
            h = d.low
        }
    }
    if (a <= q && a <= n && a <= s) {
        if (a < 6) {
            h = d.close
        }
    }
    return h
};