var CToolObject = create_class(NamedObject);
CToolObject.state = {
    BeforeDraw: 0,
    Draw: 1,
    AfterDraw: 2
};
CToolObject.prototype.__construct = function(a, m) {
    CToolObject.__super.__construct.call(this, a);
    this._manager = m;
    this.drawer = null;
    this.state = CToolObject.state.BeforeDraw;
    this.points = [];
    this.step = 0
};
CToolObject.prototype.getChartObjects = function() {
    var c = this._manager.getInstance();
    var e = c.getDataSource("frame0.k0");
    if (e == null || !is_instance(e, MainDataSource)) {
        return null
    }
    var d = c.getTimeline("frame0.k0");
    if (d == null) {
        return null
    }
    var a = c.getArea("frame0.k0.main");
    if (a == null) {
        return null
    }
    var b = c.getRange("frame0.k0.main");
    if (b == null) {
        return null
    }
    return {
        pMgr: c,
        pCDS: e,
        pTimeline: d,
        pArea: a,
        pRange: b
    }
};
CToolObject.prototype.isValidMouseXY = function(a, d) {
    var b = this.getChartObjects();
    var c = {
        left: b.pArea.getLeft(),
        top: b.pArea.getTop(),
        right: b.pArea.getRight(),
        bottom: b.pArea.getBottom()
    };
    if (a < c.left || a > c.right || d < c.top || d > c.bottom) {
        return false
    }
    return true
};
CToolObject.prototype.getPlotter = function() {
    return this.drawer
};
CToolObject.prototype.setState = function(a) {
    this.state = a
};
CToolObject.prototype.getState = function() {
    return this.state
};
CToolObject.prototype.addPoint = function(a) {
    this.points.push(a)
};
CToolObject.prototype.getPoint = function(a) {
    return this.points[a]
};
CToolObject.prototype.acceptMouseMoveEvent = function(a, b) {
    if (this.isValidMouseXY(a, b) == false) {
        return false
    }
    if (this.state == CToolObject.state.BeforeDraw) {
        this.setBeforeDrawPos(a, b)
    } else {
        if (this.state == CToolObject.state.Draw) {
            this.setDrawPos(a, b)
        } else {
            if (this.state == CToolObject.state.AfterDraw) {
                this.setAfterDrawPos(a, b)
            }
        }
    }
    return true
};
CToolObject.prototype.acceptMouseDownEvent = function(a, b) {
    if (this.isValidMouseXY(a, b) == false) {
        return false
    }
    if (this.state == CToolObject.state.BeforeDraw) {
        this.setDrawPos(a, b);
        this.setState(CToolObject.state.Draw)
    } else {
        if (this.state == CToolObject.state.Draw) {
            this.setAfterDrawPos(a, b);
            if (this.step == 0) {
                this.setState(CToolObject.state.AfterDraw)
            }
        } else {
            if (this.state == CToolObject.state.AfterDraw) {
                if (CToolObject.prototype.isSelected.call(this, a, b)) {
                    this.setDrawPos(a, b);
                    this.setState(CToolObject.state.Draw)
                } else {
                    this.oldx = a;
                    this.oldy = b
                }
            }
        }
    }
    return true
};
CToolObject.prototype.acceptMouseDownMoveEvent = function(g, e) {
    if (this.isValidMouseXY(g, e) == false) {
        return false
    }
    if (this.state == CToolObject.state.Draw) {
        this.setDrawPos(g, e)
    } else {
        if (this.state == CToolObject.state.AfterDraw) {
            var a = this.getChartObjects();
            var b = a.pTimeline.getItemWidth();
            var c = a.pRange;
            if (Math.abs(g - this.oldx) < b && Math.abs(e - this.oldy) == 0) {
                return true
            }
            var i = a.pTimeline.toIndex(this.oldx);
            var f = a.pRange.toValue(this.oldy);
            var j = a.pTimeline.toIndex(g);
            var h = a.pRange.toValue(e);
            this.oldx = g;
            this.oldy = e;
            var l = j - i;
            var k = h - f;
            for (var d in this.points) {
                this.points[d].pos.index += l;
                this.points[d].pos.value += k
            }
        }
    }
    return true
};
CToolObject.prototype.acceptMouseUpEvent = function(a, b) {
    if (this.isValidMouseXY(a, b) == false) {
        return false
    }
    if (this.state == CToolObject.state.Draw) {
        this.setAfterDrawPos(a, b);
        if (this.step == 0) {
            this.setState(CToolObject.state.AfterDraw)
        }
        return true
    }
    return false
};
CToolObject.prototype.setBeforeDrawPos = function(a, c) {
    for (var b in this.points) {
        this.points[b].setPosXY(a, c);
        this.points[b].setState(CPoint.state.Show)
    }
};
CToolObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
        if (this.points[b].getState() == CPoint.state.Highlight) {
            this.points[b].setPosXY(a, c)
        }
    }
};
CToolObject.prototype.setAfterDrawPos = function(a, d) {
    if (this.step != 0) {
        this.step -= 1
    }
    for (var b in this.points) {
        this.points[b].setState(CPoint.state.Hide)
    }
    if (this.step == 0) {
        var c = this.getChartObjects();
        c.pMgr.setNormalMode()
    }
};
CToolObject.prototype.isSelected = function(a, d) {
    var c = false;
    for (var b in this.points) {
        if (this.points[b].isSelected(a, d)) {
            this.points[b].setState(CPoint.state.Highlight);
            c = true;
            break
        }
    }
    if (c == true) {
        this.select();
        return true
    }
    return false
};
CToolObject.prototype.select = function() {
    for (var a in this.points) {
        if (this.points[a].getState() == CPoint.state.Hide) {
            this.points[a].setState(CPoint.state.Show)
        }
    }
};
CToolObject.prototype.unselect = function() {
    for (var a in this.points) {
        if (this.points[a].getState() != CPoint.state.Hide) {
            this.points[a].setState(CPoint.state.Hide)
        }
    }
};
CToolObject.prototype.calcDistance = function(l, i, g) {
    var a = l.getPosXY().x;
    var j = l.getPosXY().y;
    var o = i.getPosXY().x;
    var h = i.getPosXY().y;
    var n = g.getPosXY().x;
    var f = g.getPosXY().y;
    var d = a - n;
    var b = j - f;
    var m = o - n;
    var k = h - f;
    var c = Math.abs(d * k - b * m);
    var e = Math.sqrt(Math.pow((o - a), 2) + Math.pow((h - j), 2));
    return c / e
};
CToolObject.prototype.calcGap = function(b, m, k) {
    var a = b.sx;
    var i = b.sy;
    var o = b.ex;
    var h = b.ey;
    var n = m;
    var g = k;
    var e = a - n;
    var c = i - g;
    var l = o - n;
    var j = h - g;
    var d = Math.abs(e * j - c * l);
    var f = Math.sqrt(Math.pow((o - a), 2) + Math.pow((h - i), 2));
    return d / f
};
CToolObject.prototype.isWithRect = function(g, d, c) {
    var h = g.getPosXY().x;
    var f = g.getPosXY().y;
    var b = d.getPosXY().x;
    var a = d.getPosXY().y;
    var i = c.getPosXY().x;
    var e = c.getPosXY().y;
    if (h > b) {
        h += 4;
        b -= 4
    } else {
        h -= 4;
        b += 4
    }
    if (f > a) {
        f += 4;
        a -= 4
    } else {
        f -= 4;
        a += 4
    }
    if (h <= i && b >= i && f <= e && a >= e) {
        return true
    }
    if (h >= i && b <= i && f <= e && a >= e) {
        return true
    }
    if (h <= i && b >= i && f >= e && a <= e) {
        return true
    }
    if (h >= i && b <= i && f >= e && a <= e) {
        return true
    }
    return false
};
CBiToolObject = create_class(CToolObject);
CBiToolObject.prototype.__construct = function(a, m) {
    CBiToolObject.__super.__construct.call(this, a, m);
    this.addPoint(new CPoint(a, m));
    this.addPoint(new CPoint(a, m))
};
CBiToolObject.prototype.setBeforeDrawPos = function(a, b) {
    this.step = 1;
    CBiToolObject.__super.setBeforeDrawPos.call(this, a, b);
    this.getPoint(0).setState(CPoint.state.Show);
    this.getPoint(1).setState(CPoint.state.Highlight)
};
CTriToolObject = create_class(CToolObject);
CTriToolObject.prototype.__construct = function(a, m) {
    CTriToolObject.__super.__construct.call(this, a, m);
    this.addPoint(new CPoint(a, m));
    this.addPoint(new CPoint(a, m));
    this.addPoint(new CPoint(a, m))
};
CTriToolObject.prototype.setBeforeDrawPos = function(a, b) {
    this.step = 2;
    CBiToolObject.__super.setBeforeDrawPos.call(this, a, b);
    this.getPoint(0).setState(CPoint.state.Show);
    this.getPoint(1).setState(CPoint.state.Show);
    this.getPoint(2).setState(CPoint.state.Highlight)
};
CTriToolObject.prototype.setAfterDrawPos = function(a, d) {
    if (this.step != 0) {
        this.step -= 1
    }
    if (this.step == 0) {
        for (var b in this.points) {
            this.points[b].setState(CPoint.state.Hide)
        }
    } else {
        this.getPoint(0).setState(CPoint.state.Show);
        this.getPoint(1).setState(CPoint.state.Highlight);
        this.getPoint(2).setState(CPoint.state.Show)
    }
    if (this.step == 0) {
        var c = this.getChartObjects();
        c.pMgr.setNormalMode()
    }
};
var CBandLineObject = create_class(CBiToolObject);
CBandLineObject.prototype.__construct = function(a, m) {
    CBandLineObject.__super.__construct.call(this, a, m);
    this.drawer = new DrawBandLinesPlotter(a, this, m)
};
CBandLineObject.prototype.isSelected = function(l, h) {
    if (CBandLineObject.__super.isSelected.call(this, l, h) == true) {
        return true
    }
    var g = new CPoint("frame0.k0", this._manager);
    g.setPosXY(l, h);
    var k = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var f = this.getPoint(1).getPosXY().x;
    var e = this.getPoint(1).getPosXY().y;
    var a = [100, 87.5, 75, 62.5, 50, 37.5, 25, 12.5, 0];
    for (var d = 0; d < a.length; d++) {
        var b = j + (100 - a[d]) / 100 * (e - j);
        if (b < h + 4 && b > h - 4) {
            this.select();
            return true
        }
    }
    return false
};
var CBiParallelLineObject = create_class(CTriToolObject);
CBiParallelLineObject.prototype.__construct = function(a, m) {
    CBiParallelLineObject.__super.__construct.call(this, a, m);
    this.drawer = new DrawBiParallelLinesPlotter(a, this,m)
};
CBiParallelLineObject.prototype.isSelected = function(n, l) {
    if (CTriParallelLineObject.__super.isSelected.call(this, n, l) == true) {
        return true
    }
    var m = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(1).getPosXY().x;
    var d = this.getPoint(1).getPosXY().y;
    var a = this.getPoint(2).getPosXY().x;
    var o = this.getPoint(2).getPosXY().y;
    var k = {
        x: m - e,
        y: j - d
    };
    var i = {
        x: m - a,
        y: j - o
    };
    var g = {
        x: k.x + i.x,
        y: k.y + i.y
    };
    var h = m - g.x;
    var f = j - g.y;
    var c = {
        sx: m,
        sy: j,
        ex: a,
        ey: o
    };
    var b = {
        sx: e,
        sy: d,
        ex: h,
        ey: f
    };
    if (this.calcGap(c, n, l) > 4 && this.calcGap(b, n, l) > 4) {
        return false
    }
    return true
};
var CBiParallelRayLineObject = create_class(CTriToolObject);
CBiParallelRayLineObject.prototype.__construct = function(a, m) {
    CBiParallelRayLineObject.__super.__construct.call(this, a, m);
    this.drawer = new DrawBiParallelRayLinesPlotter(a, this, m)
};
CBiParallelRayLineObject.prototype.isSelected = function(n, l) {
    if (CTriParallelLineObject.__super.isSelected.call(this, n, l) == true) {
        return true
    }
    var m = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(1).getPosXY().x;
    var d = this.getPoint(1).getPosXY().y;
    var a = this.getPoint(2).getPosXY().x;
    var o = this.getPoint(2).getPosXY().y;
    var k = {
        x: m - e,
        y: j - d
    };
    var i = {
        x: m - a,
        y: j - o
    };
    var g = {
        x: k.x + i.x,
        y: k.y + i.y
    };
    var h = m - g.x;
    var f = j - g.y;
    var c = {
        sx: m,
        sy: j,
        ex: a,
        ey: o
    };
    var b = {
        sx: e,
        sy: d,
        ex: h,
        ey: f
    };
    if ((c.ex > c.sx && n > c.sx - 4) || (c.ex < c.sx && n < c.sx + 4) || (b.ex > b.sx && n > b.sx - 4) || (b.ex < b.sx && n < b.sx + 4)) {
        if (this.calcGap(c, n, l) > 4 && this.calcGap(b, n, l) > 4) {
            return false
        }
    } else {
        return false
    }
    this.select();
    return true
};
var CFibFansObject = create_class(CBiToolObject);
CFibFansObject.prototype.__construct = function(a, m) {
    CFibFansObject.__super.__construct.call(this, a, m);
    this.drawer = new DrawFibFansPlotter(a, this, m)
};
CFibFansObject.prototype.isSelected = function(h, g) {
    if (CFibFansObject.__super.isSelected.call(this, h, g) == true) {
        return true
    }
    var s = new CPoint("frame0.k0", this._manager);
    s.setPosXY(h, g);
    var n = this.getPoint(0).getPosXY().x;
    var m = this.getPoint(0).getPosXY().y;
    var r = this.getPoint(1).getPosXY().x;
    var q = this.getPoint(1).getPosXY().y;
    var j = this.getChartObjects();
    var d = {
        left: j.pArea.getLeft(),
        top: j.pArea.getTop(),
        right: j.pArea.getRight(),
        bottom: j.pArea.getBottom()
    };
    var f = [0, 38.2, 50, 61.8];
    for (var p = 0; p < f.length; p++) {
        var o = m + (100 - f[p]) / 100 * (q - m);
        var l = {
            x: n,
            y: m
        };
        var z = {
            x: r,
            y: o
        };
        var e = getRectCrossPt(d, l, z);
        var w = Math.pow((e[0].x - n), 2) + Math.pow((e[0].y - m), 2);
        var v = Math.pow((e[0].x - r), 2) + Math.pow((e[0].y - q), 2);
        var k = w > v ? {
            x: e[0].x,
            y: e[0].y
        } : {
            x: e[1].x,
            y: e[1].y
        };
        if (k.x > n && h < n) {
            continue
        }
        if (k.x < n && h > n) {
            continue
        }
        var u = new CPoint("frame0.k0",this._manager);
        u.setPosXY(n, m);
        var t = new CPoint("frame0.k0",this._manager);
        t.setPosXY(k.x, k.y);
        if (this.calcDistance(u, t, s) > 4) {
            continue
        }
        this.select();
        return true
    }
    return false
};
var CFibRetraceObject = create_class(CBiToolObject);
CFibRetraceObject.prototype.__construct = function(a, m) {
    CFibRetraceObject.__super.__construct.call(this, a, m);
    this.drawer = new DrawFibRetracePlotter(a, this, m)
};
CFibRetraceObject.prototype.isSelected = function(l, h) {
    if (CFibRetraceObject.__super.isSelected.call(this, l, h) == true) {
        return true
    }
    var g = new CPoint("frame0.k0", this._manager);
    g.setPosXY(l, h);
    var k = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var f = this.getPoint(1).getPosXY().x;
    var e = this.getPoint(1).getPosXY().y;
    var a = [100, 78.6, 61.8, 50, 38.2, 23.6, 0];
    for (var d = 0; d < a.length; d++) {
        var b = j + (100 - a[d]) / 100 * (e - j);
        if (b < h + 4 && b > h - 4) {
            this.select();
            return true
        }
    }
    return false
};
var CHoriRayLineObject = create_class(CBiToolObject);
CHoriRayLineObject.prototype.__construct = function(a, m) {
    CHoriRayLineObject.__super.__construct.call(this, a, m);
    this.drawer = new DrawHoriRayLinesPlotter(a, this, m)
};
CHoriRayLineObject.prototype.setDrawPos = function(a, b) {
    if (this.points[0].getState() == CPoint.state.Highlight) {
        this.points[0].setPosXY(a, b);
        this.points[1].setPosXYNoSnap(this.points[1].getPosXY().x, this.points[0].getPosXY().y);
        return
    }
    if (this.points[1].getState() == CPoint.state.Highlight) {
        this.points[1].setPosXY(a, b);
        this.points[0].setPosXYNoSnap(this.points[0].getPosXY().x, this.points[1].getPosXY().y)
    }
};
CHoriRayLineObject.prototype.isSelected = function(a, g) {
    if (CHoriRayLineObject.__super.isSelected.call(this, a, g) == true) {
        return true
    }
    var f = new CPoint("frame0.k0", this._manager);
    f.setPosXY(a, g);
    var d = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(0).getPosXY().x;
    var b = this.getPoint(1).getPosXY().x;
    if (g > d + 4 || g < d - 4) {
        return false
    }
    if (b > e && a < e - 4) {
        return false
    }
    if (b < e && a > e + 4) {
        return false
    }
    this.select();
    return true
};
var CHoriSegLineObject = create_class(CBiToolObject);
CHoriSegLineObject.prototype.__construct = function(a,m) {
    CHoriSegLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawHoriSegLinesPlotter(a, this,m)
};
CHoriSegLineObject.prototype.setDrawPos = function(a, b) {
    if (this.points[0].getState() == CPoint.state.Highlight) {
        this.points[0].setPosXY(a, b);
        this.points[1].setPosXYNoSnap(this.points[1].getPosXY().x, this.points[0].getPosXY().y);
        return
    }
    if (this.points[1].getState() == CPoint.state.Highlight) {
        this.points[1].setPosXY(a, b);
        this.points[0].setPosXYNoSnap(this.points[0].getPosXY().x, this.points[1].getPosXY().y)
    }
};
CHoriSegLineObject.prototype.isSelected = function(a, g) {
    if (CHoriSegLineObject.__super.isSelected.call(this, a, g) == true) {
        return true
    }
    var f = new CPoint("frame0.k0",this._manager);
    f.setPosXY(a, g);
    var d = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(0).getPosXY().x;
    var b = this.getPoint(1).getPosXY().x;
    if (g > d + 4 || g < d - 4) {
        return false
    }
    if (e > b && (a > e + 4 || a < b - 4)) {
        return false
    }
    if (e < b && (a < e - 4 || a > b + 4)) {
        return false
    }
    this.select();
    return true
};
var CHoriStraightLineObject = create_class(CBiToolObject);
CHoriStraightLineObject.prototype.__construct = function(a) {
    CHoriStraightLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawHoriStraightLinesPlotter(a, this,a)
};
CHoriStraightLineObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
        this.points[b].setPosXY(a, c)
    }
};
CHoriStraightLineObject.prototype.isSelected = function(a, e) {
    if (CHoriStraightLineObject.__super.isSelected.call(this, a, e) == true) {
        return true
    }
    var d = new CPoint("frame0.k0",this._manager);
    d.setPosXY(a, e);
    var b = this.getPoint(0).getPosXY().y;
    if (e > b + 4 || e < b - 4) {
        return false
    }
    this.select();
    return true
};
var CRayLineObject = create_class(CBiToolObject);
CRayLineObject.prototype.__construct = function(a,m) {
    CRayLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawRayLinesPlotter(a, this,m)
};
CRayLineObject.prototype.isSelected = function(a, f) {
    if (CRayLineObject.__super.isSelected.call(this, a, f) == true) {
        return true
    }
    var e = new CPoint("frame0.k0",this._manager);
    e.setPosXY(a, f);
    var d = this.getPoint(0).getPosXY().x;
    var b = this.getPoint(1).getPosXY().x;
    if (b > d && a < d - 4) {
        return false
    }
    if (b < d && a > d + 4) {
        return false
    }
    if (this.calcDistance(this.getPoint(0), this.getPoint(1), e) < 4) {
        this.select();
        return true
    }
    return false
};
var CSegLineObject = create_class(CBiToolObject);
CSegLineObject.prototype.__construct = function(a,m) {
    CSegLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawSegLinesPlotter(a, this,m)
};
CSegLineObject.prototype.isSelected = function(a, d) {
    if (CSegLineObject.__super.isSelected.call(this, a, d) == true) {
        return true
    }
    var b = new CPoint("frame0.k0",this._manager);
    b.setPosXY(a, d);
    if (this.isWithRect(this.getPoint(0), this.getPoint(1), b) == false) {
        return false
    }
    if (this.calcDistance(this.getPoint(0), this.getPoint(1), b) < 4) {
        this.select();
        return true
    }
    return false
};
var CStraightLineObject = create_class(CBiToolObject);
CStraightLineObject.prototype.__construct = function(a,m) {
    CStraightLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawStraightLinesPlotter(a, this,m)
};
CStraightLineObject.prototype.isSelected = function(a, d) {
    if (CStraightLineObject.__super.isSelected.call(this, a, d) == true) {
        return true
    }
    var b = new CPoint("frame0.k0",this._manager);
    b.setPosXY(a, d);
    if (this.calcDistance(this.getPoint(0), this.getPoint(1), b) < 4) {
        this.select();
        return true
    }
    return false
};
var CTriParallelLineObject = create_class(CTriToolObject);
CTriParallelLineObject.prototype.__construct = function(a,m) {
    CTriParallelLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawTriParallelLinesPlotter(a, this,m)
};
CTriParallelLineObject.prototype.isSelected = function(p, o) {
    if (CTriParallelLineObject.__super.isSelected.call(this, p, o) == true) {
        return true
    }
    var q = this.getChartObjects();
    var l = this.getPoint(0).getPosXY().x;
    var k = this.getPoint(0).getPosXY().y;
    var t = this.getPoint(1).getPosXY().x;
    var r = this.getPoint(1).getPosXY().y;
    var b = this.getPoint(2).getPosXY().x;
    var A = this.getPoint(2).getPosXY().y;
    var j = {
        x: l - t,
        y: k - r
    };
    var i = {
        x: l - b,
        y: k - A
    };
    var h = {
        x: j.x + i.x,
        y: j.y + i.y
    };
    var n = l - h.x;
    var m = k - h.y;
    var z = {
        sx: l,
        sy: k,
        ex: b,
        ey: A
    };
    var w = {
        sx: t,
        sy: r,
        ex: n,
        ey: m
    };
    var f = {
        x: l - t,
        y: k - r
    };
    var d = {
        x: b - n,
        y: A - m
    };
    var g = {
        x: t - l,
        y: r - k
    };
    var e = {
        x: n - b,
        y: m - A
    };
    var u = Math.abs(g.x - l);
    var s = Math.abs(g.y - k);
    var c = Math.abs(e.x - b);
    var a = Math.abs(e.y - A);
    var v = {
        sx: u,
        sy: s,
        ex: c,
        ey: a
    };
    if (this.calcGap(z, p, o) > 4 && this.calcGap(w, p, o) > 4 && this.calcGap(v, p, o) > 4) {
        return false
    }
    this.select();
    return true
};
var CVertiStraightLineObject = create_class(CBiToolObject);
CVertiStraightLineObject.prototype.__construct = function(a,m) {
    CVertiStraightLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawVertiStraightLinesPlotter(a, this,m)
};
CVertiStraightLineObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
        this.points[b].setPosXY(a, c)
    }
};
CVertiStraightLineObject.prototype.isSelected = function(a, e) {
    if (CVertiStraightLineObject.__super.isSelected.call(this, a, e) == true) {
        return true
    }
    var d = new CPoint("frame0.k0",this._manager);
    d.setPosXY(a, e);
    var b = this.getPoint(0).getPosXY().x;
    if (a > b + 4 || a < b - 4) {
        return false
    }
    this.select();
    return true
};
var CPriceLineObject = create_class(CSegLineObject);
CPriceLineObject.prototype.__construct = function(a) {
    CPriceLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawPriceLinesPlotter(a, this,m)
};
CPriceLineObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
        this.points[b].setPosXY(a, c)
    }
};
CPriceLineObject.prototype.isSelected = function(a, h) {
    if (CFibRetraceObject.__super.isSelected.call(this, a, h) == true) {
        return true
    }
    var g = new CPoint("frame0.k0",this._manager);
    g.setPosXY(a, h);
    var f = this.getPoint(0).getPosXY().x;
    var e = this.getPoint(0).getPosXY().y;
    var d = this.getPoint(1).getPosXY().x;
    var b = this.getPoint(1).getPosXY().y;
    if (a < f - 4) {
        return false
    }
    if (h >= e + 4 || h <= e - 4) {
        return false
    }
    this.select();
    return true
};
var CArrowLineObject = create_class(CSegLineObject);
CArrowLineObject.prototype.__construct = function(a,m) {
    CArrowLineObject.__super.__construct.call(this, a,m);
    this.drawer = new DrawArrowLinesPlotter(a, this,m)
};
var CToolManager = create_class(NamedObject);
CToolManager.prototype.__construct = function(a) {
    CToolManager.__super.__construct.call(this, a);
    this.selectedObject = -1;
    this.toolObjects = []
};
CToolManager.prototype.getToolObjectCount = function() {
    return this.toolObjects.length
};
CToolManager.prototype.addToolObject = function(a) {
    this.toolObjects.push(a)
};
CToolManager.prototype.getToolObject = function(a) {
    if (a < this.toolObjects.length && a >= 0) {
        return this.toolObjects[a]
    }
    return null
};
CToolManager.prototype.getCurrentObject = function() {
    return this.getToolObject(this.getToolObjectCount() - 1)
};
CToolManager.prototype.getSelectedObject = function() {
    return this.getToolObject(this.selectedObject)
};
CToolManager.prototype.delCurrentObject = function() {
    this.toolObjects.splice(this.getToolObjectCount() - 1, 1)
};
CToolManager.prototype.delSelectedObject = function() {
    this.toolObjects.splice(this.selectedObject, 1);
    this.selectedObject = -1
};
CToolManager.prototype.acceptMouseMoveEvent = function(a, e) {
    if (this.selectedObject == -1) {
        var d = this.toolObjects[this.getToolObjectCount() - 1];
        if (d != null && d.getState() != CToolObject.state.AfterDraw) {
            return d.acceptMouseMoveEvent(a, e)
        }
    } else {
        var c = this.toolObjects[this.selectedObject];
        if (c.getState() == CToolObject.state.Draw) {
            return c.acceptMouseMoveEvent(a, e)
        }
        c.unselect();
        this.selectedObject = -1
    }
    for (var b in this.toolObjects) {
        if (this.toolObjects[b].isSelected(a, e)) {
            this.selectedObject = b;
            return false
        }
    }
    return false
};
CToolManager.prototype.acceptMouseDownEvent = function(a, d) {
    this.mouseDownMove = false;
    if (this.selectedObject == -1) {
        var c = this.toolObjects[this.getToolObjectCount() - 1];
        if (c != null && c.getState() != CToolObject.state.AfterDraw) {
            return c.acceptMouseDownEvent(a, d)
        }
    } else {
        var b = this.toolObjects[this.selectedObject];
        if (b.getState() != CToolObject.state.BeforeDraw) {
            return b.acceptMouseDownEvent(a, d)
        }
    }
    return false
};
CToolManager.prototype.acceptMouseDownMoveEvent = function(b, f) {
    this.mouseDownMove = true;
    if (this.selectedObject == -1) {
        var e = this.toolObjects[this.getToolObjectCount() - 1];
        if (e != null && e.getState() == CToolObject.state.Draw) {
            return e.acceptMouseDownMoveEvent(b, f)
        }
        return false
    } else {
        var d = this.toolObjects[this.selectedObject];
        if (d.getState() != CToolObject.state.BeforeDraw) {
            if (d.acceptMouseDownMoveEvent(b, f) == true) {
                var a = this.toolObjects[this.selectedObject].points;
                for (var c = 0; c < a.length; c++) {
                    if (a[c].state == CPoint.state.Highlight || a[c].state == CPoint.state.Show) {
                        return true
                    }
                }
            }
            return true
        }
    }
};
CToolManager.prototype.acceptMouseUpEvent = function(a, d) {
    if (this.mouseDownMove == true) {
        if (this.selectedObject == -1) {
            var c = this.toolObjects[this.getToolObjectCount() - 1];
            if (c != null && c.getState() == CToolObject.state.Draw) {
                return c.acceptMouseUpEvent(a, d)
            }
            return true
        } else {
            var b = this.toolObjects[this.selectedObject];
            if (b.getState() != CToolObject.state.BeforeDraw) {
                return b.acceptMouseUpEvent(a, d)
            }
        }
    }
    if (this.selectedObject != -1) {
        return true
    }
    var c = this.toolObjects[this.getToolObjectCount() - 1];
    if (c != null) {
        if (c.getState() == CToolObject.state.Draw) {
            return true
        }
        if (!c.isValidMouseXY(a, d)) {
            return false
        }
        if (c.isSelected(a, d)) {
            return true
        }
    }
    return false
};
