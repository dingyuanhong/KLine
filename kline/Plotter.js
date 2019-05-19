var Plotter = create_class(NamedObject);
Plotter.prototype.__construct = function(a) {
    Plotter.__super.__construct.call(this, a)
};
Plotter.isChrome = (navigator.userAgent.toLowerCase().match(/chrome/) != null);
Plotter.drawLine = function(d, b, e, a, c) {
    d.beginPath();
    d.moveTo((b << 0) + 0.5, (e << 0) + 0.5);
    d.lineTo((a << 0) + 0.5, (c << 0) + 0.5);
    d.stroke()
};
Plotter.drawLines = function(c, d) {
    var b, a = d.length;
    c.beginPath();
    c.moveTo(d[0].x, d[0].y);
    for (b = 1; b < a; b++) {
        c.lineTo(d[b].x, d[b].y)
    }
    if (Plotter.isChrome) {
        c.moveTo(d[0].x, d[0].y);
        for (b = 1; b < a; b++) {
            c.lineTo(d[b].x, d[b].y)
        }
    }
    c.stroke()
};
Plotter.drawDashedLine = function(b, c, l, a, k, g, j) {
    if (g < 2) {
        g = 2
    }
    var e = a - c;
    var d = k - l;
    b.beginPath();
    if (d == 0) {
        var h = (e / g + 0.5) << 0;
        for (var f = 0; f < h; f++) {
            b.rect(c, l, j, 1);
            c += g
        }
        b.fill()
    } else {
        var h = (Math.sqrt(e * e + d * d) / g + 0.5) << 0;
        e = e / h;
        d = d / h;
        var n = e * j / g;
        var m = d * j / g;
        for (var f = 0; f < h; f++) {
            b.moveTo(c + 0.5, l + 0.5);
            b.lineTo(c + 0.5 + n, l + 0.5 + m);
            c += e;
            l += d
        }
        b.stroke()
    }
};
Plotter.createHorzDashedLine = function(b, c, a, j, f, h) {
    if (f < 2) {
        f = 2
    }
    var d = a - c;
    var g = (d / f + 0.5) << 0;
    for (var e = 0; e < g; e++) {
        b.rect(c, j, h, 1);
        c += f
    }
};
Plotter.createRectangles = function(d, a) {
    d.beginPath();
    var f, c, b = a.length;
    for (c = 0; c < b; c++) {
        f = a[c];
        d.rect(f.x, f.y, f.w, f.h)
    }
};
Plotter.createPolygon = function(c, d) {
    c.beginPath();
    c.moveTo(d[0].x + 0.5, d[0].y + 0.5);
    var b, a = d.length;
    for (b = 1; b < a; b++) {
        c.lineTo(d[b].x + 0.5, d[b].y + 0.5)
    }
    c.closePath()
};
Plotter.drawString = function(b, d, c) {
    var a = b.measureText(d).width;
    if (c.w < a) {
        return false
    }
    b.fillText(d, c.x, c.y);
    c.x += a;
    c.w -= a;
    return true
};
var BackgroundPlotter = create_class(Plotter);
BackgroundPlotter.prototype.__construct = function(a, m) {
    BackgroundPlotter.__super.__construct.call(this, a);
    this._color = Theme.Color.Background
    this._manager = m;
};
BackgroundPlotter.prototype.getColor = function() {
    return this._color
};
BackgroundPlotter.prototype.setColor = function(a) {
    this._color = a
};
BackgroundPlotter.prototype.Draw = function(a) {
    var c = this._manager.getInstance();
    var b = c.getArea(this.getAreaName());
    var d = c.getTheme(this.getFrameName());
    a.fillStyle = d.getColor(this._color);
    a.fillRect(b.getLeft(), b.getTop(), b.getWidth(), b.getHeight())
};
var MainAreaBackgroundPlotter = create_class(BackgroundPlotter);
MainAreaBackgroundPlotter.prototype.__construct = function(a, m) {
    MainAreaBackgroundPlotter.__super.__construct.call(this, a, m)
};
MainAreaBackgroundPlotter.prototype.Draw = function(c) {
    var i = this._manager.getInstance();
    var b = i.getArea(this.getAreaName());
    var j = i.getTimeline(this.getDataSourceName());
    var f = i.getRange(this.getAreaName());
    var d = i.getTheme(this.getFrameName());
    var g = b.getRect();
    if (!b.isChanged() && !j.isUpdated() && !f.isUpdated()) {
        var e = j.getFirstIndex();
        var h = j.getLastIndex() - 2;
        var a = Math.max(e, h);
        g.X = j.toColumnLeft(a);
        g.Width = b.getRight() - g.X
    }
    c.fillStyle = d.getColor(this._color);
    c.fillRect(g.X, g.Y, g.Width, g.Height)
};
var RangeAreaBackgroundPlotter = create_class(BackgroundPlotter);
RangeAreaBackgroundPlotter.prototype.__construct = function(a, m) {
    RangeAreaBackgroundPlotter.__super.__construct.call(this, a, m)
};
RangeAreaBackgroundPlotter.prototype.Draw = function(c) {
    var e = this._manager.getInstance();
    var g = this.getAreaName();
    var d = e.getArea(g);
    var b = e.getRange(g.substring(0, g.lastIndexOf("Range")));
    var a = b.getNameObject().getCompAt(2) == "main";
    if (a) {} else {
        if (!d.isChanged() && !b.isUpdated()) {
            return
        }
    }
    var f = e.getTheme(this.getFrameName());
    c.fillStyle = f.getColor(this._color);
    c.fillRect(d.getLeft(), d.getTop(), d.getWidth(), d.getHeight())
};
var TimelineAreaBackgroundPlotter = create_class(BackgroundPlotter);
TimelineAreaBackgroundPlotter.prototype.__construct = function(a, m) {
    TimelineAreaBackgroundPlotter.__super.__construct.call(this, a, m)
};
TimelineAreaBackgroundPlotter.prototype.Draw = function(a) {
    var d = this._manager.getInstance();
    var c = d.getArea(this.getAreaName());
    var b = d.getTimeline(this.getDataSourceName());
    if (!c.isChanged() && !b.isUpdated()) {
        return
    }
    var e = d.getTheme(this.getFrameName());
    a.fillStyle = e.getColor(this._color);
    a.fillRect(c.getLeft(), c.getTop(), c.getWidth(), c.getHeight())
};
var CGridPlotter = create_class(NamedObject);
CGridPlotter.prototype.__construct = function(a, m) {
    CGridPlotter.__super.__construct.call(this, a)
    this._manager = m;
};
CGridPlotter.prototype.Draw = function(c) {
    var o = this._manager.getInstance();
    var b = o.getArea(this.getAreaName());
    var p = o.getTimeline(this.getDataSourceName());
    var j = o.getRange(this.getAreaName());
    var f = false;
    if (!b.isChanged() && !p.isUpdated() && !j.isUpdated()) {
        var i = p.getFirstIndex();
        var m = p.getLastIndex();
        var a = Math.max(i, m - 2);
        var e = p.toColumnLeft(a);
        c.save();
        c.rect(e, b.getTop(), b.getRight() - e, b.getHeight());
        c.clip();
        f = true
    }
    var h = o.getTheme(this.getFrameName());
    c.fillStyle = h.getColor(Theme.Color.Grid0);
    c.beginPath();
    var g = 4,
        k = 1;
    if (Plotter.isChrome) {
        g = 4;
        k = 1
    }
    var l = j.getGradations();
    for (var d in l) {
        Plotter.createHorzDashedLine(c, b.getLeft(), b.getRight(), j.toY(l[d]), g, k)
    }
    c.fill();
    if (f) {
        c.restore()
    }
};
var CandlestickPlotter = create_class(NamedObject);
CandlestickPlotter.prototype.__construct = function(a, m) {
    CandlestickPlotter.__super.__construct.call(this, a)
    this._manager = m
};
CandlestickPlotter.prototype.Draw = function(c) {
    var A = this._manager.getInstance();
    var s = A.getDataSource(this.getDataSourceName());
    if (s.getDataCount() < 1) {
        return
    }
    var u = A.getArea(this.getAreaName());
    var h = A.getTimeline(this.getDataSourceName());
    var p = A.getRange(this.getAreaName());
    if (p.getRange() == 0) {
        return
    }
    var y = A.getTheme(this.getFrameName());
    var a = is_instance(y, DarkTheme);
    var j = h.getFirstIndex();
    var n = h.getLastIndex();
    var g;
    if (u.isChanged() || h.isUpdated() || p.isUpdated()) {
        g = j
    } else {
        g = Math.max(j, n - 2)
    }
    var v = h.getColumnWidth();
    var x = h.getItemWidth();
    var e = h.toItemLeft(g);
    var z = h.toItemCenter(g);
    var w = [];
    var f = [];
    var b = [];
    var l = [];
    for (var t = g; t < n; t++) {
        var B = s.getDataAt(t);
        var m = p.toY(B.high);
        var C = p.toY(B.low);
        var o = B.open;
        var r = B.close;
        if (r > o) {
            var q = p.toY(r);
            var k = p.toY(o);
            var d = Math.max(k - q, 1);
            if (d > 1 && x > 1 && a) {
                w.push({
                    x: e + 0.5,
                    y: q + 0.5,
                    w: x - 1,
                    h: d - 1
                })
            } else {
                f.push({
                    x: e,
                    y: q,
                    w: Math.max(x, 1),
                    h: Math.max(d, 1)
                })
            }
            if (B.high > r) {
                m = Math.min(m, q - 1);
                f.push({
                    x: z,
                    y: m,
                    w: 1,
                    h: q - m
                })
            }
            if (o > B.low) {
                C = Math.max(C, k + 1);
                f.push({
                    x: z,
                    y: k,
                    w: 1,
                    h: C - k
                })
            }
        } else {
            if (r == o) {
                var q = p.toY(r);
                b.push({
                    x: e,
                    y: q,
                    w: Math.max(x, 1),
                    h: 1
                });
                if (B.high > r) {
                    m = Math.min(m, q - 1)
                }
                if (o > B.low) {
                    C = Math.max(C, q + 1)
                }
                if (m < C) {
                    b.push({
                        x: z,
                        y: m,
                        w: 1,
                        h: C - m
                    })
                }
            } else {
                var q = p.toY(o);
                var k = p.toY(r);
                var d = Math.max(k - q, 1);
                l.push({
                    x: e,
                    y: q,
                    w: Math.max(x, 1),
                    h: Math.max(d, 1)
                });
                if (B.high > o) {
                    m = Math.min(m, q - 1)
                }
                if (r > B.low) {
                    C = Math.max(C, k + 1)
                }
                if (m < C) {
                    l.push({
                        x: z,
                        y: m,
                        w: 1,
                        h: C - m
                    })
                }
            }
        }
        e += v;
        z += v
    }
    if (w.length > 0) {
        c.strokeStyle = y.getColor(Theme.Color.Positive);
        Plotter.createRectangles(c, w);
        c.stroke()
    }
    if (f.length > 0) {
        c.fillStyle = y.getColor(Theme.Color.Positive);
        Plotter.createRectangles(c, f);
        c.fill()
    }
    if (b.length > 0) {
        c.fillStyle = y.getColor(Theme.Color.Negative);
        Plotter.createRectangles(c, b);
        c.fill()
    }
    if (l.length > 0) {
        c.fillStyle = y.getColor(Theme.Color.Negative);
        Plotter.createRectangles(c, l);
        c.fill()
    }
};
var CandlestickHLCPlotter = create_class(Plotter);
CandlestickHLCPlotter.prototype.__construct = function(a, m) {
    CandlestickHLCPlotter.__super.__construct.call(this, a)
    this._manager = m;
};
CandlestickHLCPlotter.prototype.Draw = function(c) {
    var A = this._manager.getInstance();
    var s = A.getDataSource(this.getDataSourceName());
    if (!is_instance(s, MainDataSource) || s.getDataCount() < 1) {
        return
    }
    var u = A.getArea(this.getAreaName());
    var h = A.getTimeline(this.getDataSourceName());
    var p = A.getRange(this.getAreaName());
    if (p.getRange() == 0) {
        return
    }
    var y = A.getTheme(this.getFrameName());
    var a = is_instance(y, DarkTheme);
    var j = h.getFirstIndex();
    var n = h.getLastIndex();
    var g;
    if (u.isChanged() || h.isUpdated() || p.isUpdated()) {
        g = j
    } else {
        g = Math.max(j, n - 2)
    }
    var v = h.getColumnWidth();
    var x = h.getItemWidth();
    var e = h.toItemLeft(g);
    var z = h.toItemCenter(g);
    var w = [];
    var f = [];
    var b = [];
    var l = [];
    for (var t = g; t < n; t++) {
        var B = s.getDataAt(t);
        var m = p.toY(B.high);
        var C = p.toY(B.low);
        var o = B.open;
        if (t > 0) {
            o = s.getDataAt(t - 1).close
        }
        var r = B.close;
        if (r > o) {
            var q = p.toY(r);
            var k = p.toY(o);
            var d = Math.max(k - q, 1);
            if (d > 1 && x > 1 && a) {
                w.push({
                    x: e + 0.5,
                    y: q + 0.5,
                    w: x - 1,
                    h: d - 1
                })
            } else {
                f.push({
                    x: e,
                    y: q,
                    w: Math.max(x, 1),
                    h: Math.max(d, 1)
                })
            }
            if (B.high > r) {
                m = Math.min(m, q - 1);
                f.push({
                    x: z,
                    y: m,
                    w: 1,
                    h: q - m
                })
            }
            if (o > B.low) {
                C = Math.max(C, k + 1);
                f.push({
                    x: z,
                    y: k,
                    w: 1,
                    h: C - k
                })
            }
        } else {
            if (r == o) {
                var q = p.toY(r);
                b.push({
                    x: e,
                    y: q,
                    w: Math.max(x, 1),
                    h: 1
                });
                if (B.high > r) {
                    m = Math.min(m, q - 1)
                }
                if (o > B.low) {
                    C = Math.max(C, q + 1)
                }
                if (m < C) {
                    b.push({
                        x: z,
                        y: m,
                        w: 1,
                        h: C - m
                    })
                }
            } else {
                var q = p.toY(o);
                var k = p.toY(r);
                var d = Math.max(k - q, 1);
                l.push({
                    x: e,
                    y: q,
                    w: Math.max(x, 1),
                    h: Math.max(d, 1)
                });
                if (B.high > o) {
                    m = Math.min(m, q - 1)
                }
                if (r > B.low) {
                    C = Math.max(C, k + 1)
                }
                if (m < C) {
                    l.push({
                        x: z,
                        y: m,
                        w: 1,
                        h: C - m
                    })
                }
            }
        }
        e += v;
        z += v
    }
    if (w.length > 0) {
        c.fillStyle = y.getColor(Theme.Color.Positive);
        Plotter.createRectangles(c, w);
        c.fill(); //实心柱     
    }
    if (f.length > 0) {
        c.strokeStyle = y.getColor(Theme.Color.Positive);
        Plotter.createRectangles(c, f);
        c.stroke(); //空心柱
    }
    if (b.length > 0) {
        c.fillStyle = y.getColor(Theme.Color.Negative);
        Plotter.createRectangles(c, b);
        c.fill(); //实心柱
    }
    if (l.length > 0) {
        c.fillStyle = y.getColor(Theme.Color.Negative);
        Plotter.createRectangles(c, l);
        c.fill(); //实心柱
    }
};
var OHLCPlotter = create_class(Plotter);
OHLCPlotter.prototype.__construct = function(a, m) {
    OHLCPlotter.__super.__construct.call(this, a)
    this._manager = m
};
OHLCPlotter.prototype.Draw = function(b) {
    var z = this._manager.getInstance();
    var q = z.getDataSource(this.getDataSourceName());
    if (!is_instance(q, MainDataSource) || q.getDataCount() < 1) {
        return
    }
    var s = z.getArea(this.getAreaName());
    var g = z.getTimeline(this.getDataSourceName());
    var o = z.getRange(this.getAreaName());
    if (o.getRange() == 0) {
        return
    }
    var w = z.getTheme(this.getFrameName());
    var h = g.getFirstIndex();
    var n = g.getLastIndex();
    var f;
    if (s.isChanged() || g.isUpdated() || o.isUpdated()) {
        f = h
    } else {
        f = Math.max(h, n - 2)
    }
    var t = g.getColumnWidth();
    var v = g.getItemWidth() >> 1;
    var d = g.toItemLeft(f);
    var x = g.toItemCenter(f);
    var u = d + g.getItemWidth();
    var e = [];
    var a = [];
    var k = [];
    for (var r = f; r < n; r++) {
        var A = q.getDataAt(r);
        var m = o.toY(A.high);
        var B = o.toY(A.low);
        var c = Math.max(B - m, 1);
        if (A.close > A.open) {
            var p = o.toY(A.close);
            var j = o.toY(A.open);
            e.push({
                x: x,
                y: m,
                w: 1,
                h: c
            });
            e.push({
                x: d,
                y: p,
                w: v,
                h: 1
            });
            e.push({
                x: x,
                y: j,
                w: v,
                h: 1
            })
        } else {
            if (A.close == A.open) {
                var l = o.toY(A.close);
                a.push({
                    x: x,
                    y: m,
                    w: 1,
                    h: c
                });
                a.push({
                    x: d,
                    y: l,
                    w: v,
                    h: 1
                });
                a.push({
                    x: x,
                    y: l,
                    w: v,
                    h: 1
                })
            } else {
                var p = o.toY(A.open);
                var j = o.toY(A.close);
                k.push({
                    x: x,
                    y: m,
                    w: 1,
                    h: c
                });
                k.push({
                    x: d,
                    y: p,
                    w: v,
                    h: 1
                });
                k.push({
                    x: x,
                    y: j,
                    w: v,
                    h: 1
                })
            }
        }
        d += t;
        x += t;
        u += t
    }
    if (e.length > 0) {
        b.fillStyle = w.getColor(Theme.Color.Positive);
        Plotter.createRectangles(b, e);
        b.fill()
    }
    if (a.length > 0) {
        b.fillStyle = w.getColor(Theme.Color.Negative);
        Plotter.createRectangles(b, a);
        b.fill()
    }
    if (k.length > 0) {
        b.fillStyle = w.getColor(Theme.Color.Negative);
        Plotter.createRectangles(b, k);
        b.fill()
    }
};
var MainInfoPlotter = create_class(Plotter);
MainInfoPlotter.prototype.__construct = function(a, m) {
    MainInfoPlotter.__super.__construct.call(this, a)
    this._manager = m;
};

function format_time(a) {
    return (a < 10) ? "0" + a.toString() : a.toString()
}
MainInfoPlotter.prototype.Draw = function(c) {
    var B = this._manager.getInstance();
    var w = B.getArea(this.getAreaName());
    var e = B.getTimeline(this.getDataSourceName());
    var m = B.getDataSource(this.getDataSourceName());
    var y = B.getTheme(this.getFrameName());
    c.font = y.getFont(Theme.Font.Default);
    c.textAlign = "left";
    c.textBaseline = "top";
    c.fillStyle = y.getColor(Theme.Color.Text4);
    var a = {
        x: w.getLeft() + 4,
        y: w.getTop() + 2,
        w: w.getWidth() - 8,
        h: 20
    };
    var s = e.getSelectedIndex();
    if (s < 0) {
        return
    }
    var C = m.getDataAt(s);
    var i = m.getDecimalDigits();
    var g = new Date(C.date);
    var k = g.getFullYear();
    var A = format_time(g.getMonth() + 1);
    var z = format_time(g.getDate());
    var f = format_time(g.getHours());
    var l = format_time(g.getMinutes());
    var D = B.getLanguage();
    if (D == "zh-cn") {
        if (!Plotter.drawString(c, "时间: " + k + "-" + A + "-" + z + "  " + f + ":" + l, a)) {
            return
        }
        if (!Plotter.drawString(c, "  开: " + C.open.toFixed(i), a)) {
            return
        }
        if (!Plotter.drawString(c, "  高: " + C.high.toFixed(i), a)) {
            return
        }
        if (!Plotter.drawString(c, "  低: " + C.low.toFixed(i), a)) {
            return
        }
        if (!Plotter.drawString(c, "  收: " + C.close.toFixed(i), a)) {
            return
        }
    } else {
        if (D == "en-us") {
            if (!Plotter.drawString(c, "DATE: " + k + "-" + A + "-" + z + "  " + f + ":" + l, a)) {
                return
            }
            if (!Plotter.drawString(c, "  O: " + C.open.toFixed(i), a)) {
                return
            }
            if (!Plotter.drawString(c, "  H: " + C.high.toFixed(i), a)) {
                return
            }
            if (!Plotter.drawString(c, "  L: " + C.low.toFixed(i), a)) {
                return
            }
            if (!Plotter.drawString(c, "  C: " + C.close.toFixed(i), a)) {
                return
            }
        } else {
            if (D == "zh-tw") {
                if (!Plotter.drawString(c, "時間: " + k + "-" + A + "-" + z + "  " + f + ":" + l, a)) {
                    return
                }
                if (!Plotter.drawString(c, "  開: " + C.open.toFixed(i), a)) {
                    return
                }
                if (!Plotter.drawString(c, "  高: " + C.high.toFixed(i), a)) {
                    return
                }
                if (!Plotter.drawString(c, "  低: " + C.low.toFixed(i), a)) {
                    return
                }
                if (!Plotter.drawString(c, "  收: " + C.close.toFixed(i), a)) {
                    return
                }
            }
        }
    }
    if (s > 0) {
        if (D == "zh-cn") {
            if (!Plotter.drawString(c, "  涨幅: ", a)) {
                return
            }
        } else {
            if (D == "en-us") {
                if (!Plotter.drawString(c, "  CHANGE: ", a)) {
                    return
                }
            } else {
                if (D == "zh-tw") {
                    if (!Plotter.drawString(c, "  漲幅: ", a)) {
                        return
                    }
                }
            }
        }
        var o = m.getDataAt(s - 1);
        var h = (C.close - o.close) / o.close * 100;
        if (h >= 0) {
            h = " " + h.toFixed(2);
            c.fillStyle = y.getColor(Theme.Color.TextPositive)
        } else {
            h = h.toFixed(2);
            c.fillStyle = y.getColor(Theme.Color.TextNegative)
        }
        if (!Plotter.drawString(c, h, a)) {
            return
        }
        c.fillStyle = y.getColor(Theme.Color.Text4);
        if (!Plotter.drawString(c, " %", a)) {
            return
        }
    }
    var d = (C.high - C.low) / C.low * 100;
    if (D == "zh-cn") {
        if (!Plotter.drawString(c, "  振幅: " + d.toFixed(2) + " %", a)) {
            return
        }
        if (!Plotter.drawString(c, "  量: " + C.volume.toFixed(2), a)) {
            return
        }
    } else {
        if (D == "en-us") {
            if (!Plotter.drawString(c, "  AMPLITUDE: " + d.toFixed(2) + " %", a)) {
                return
            }
            if (!Plotter.drawString(c, "  V: " + C.volume.toFixed(2), a)) {
                return
            }
        } else {
            if (D == "zh-tw") {
                if (!Plotter.drawString(c, "  振幅: " + d.toFixed(2) + " %", a)) {
                    return
                }
                if (!Plotter.drawString(c, "  量: " + C.volume.toFixed(2), a)) {
                    return
                }
            }
        }
    }
    var q = B.getDataProvider(this.getAreaName() + ".secondary");
    if (q == undefined) {
        return
    }
    var b = q.getIndicator();
    var p, t = b.getOutputCount();
    for (p = 0; p < t; p++) {
        var u = b.getOutputAt(p);
        var j = u.execute(s);
        if (isNaN(j)) {
            continue
        }
        var x = "  " + u.getName() + ": " + j.toFixed(i);
        var r = u.getColor();
        if (r === undefined) {
            r = Theme.Color.Indicator0 + p
        }
        c.fillStyle = y.getColor(r);
        if (!Plotter.drawString(c, x, a)) {
            return
        }
    }
};
var IndicatorPlotter = create_class(NamedObject);
IndicatorPlotter.prototype.__construct = function(a, m) {
    IndicatorPlotter.__super.__construct.call(this, a)
    this._manager = m
};
IndicatorPlotter.prototype.Draw = function(a) {
    var A = this._manager.getInstance();
    var u = A.getArea(this.getAreaName());
    var e = A.getTimeline(this.getDataSourceName());
    var k = A.getRange(this.getAreaName());
    if (k.getRange() == 0) {
        return
    }
    var l = A.getDataProvider(this.getName());
    if (!is_instance(l, IndicatorDataProvider)) {
        return
    }
    var y = A.getTheme(this.getFrameName());
    var w = e.getColumnWidth();
    var f = e.getFirstIndex();
    var g = e.getLastIndex();
    var d;
    if (u.isChanged() || e.isUpdated() || k.isUpdated()) {
        d = f
    } else {
        d = Math.max(f, g - 2)
    }
    var b = l.getIndicator();
    var s, m, o = b.getOutputCount();
    for (m = 0; m < o; m++) {
        s = b.getOutputAt(m);
        var t = s.getStyle();
        if (t == OutputStyle.VolumeStick) {
            this.drawVolumeStick(a, y, A.getDataSource(this.getDataSourceName()), d, g, e.toItemLeft(d), w, e.getItemWidth(), k)
        } else {
            if (t == OutputStyle.MACDStick) {
                this.drawMACDStick(a, y, s, d, g, e.toItemLeft(d), w, e.getItemWidth(), k)
            } else {
                if (t == OutputStyle.SARPoint) {
                    this.drawSARPoint(a, y, s, d, g, e.toItemCenter(d), w, e.getItemWidth(), k)
                }
            }
        }
    }
    var c = e.toColumnLeft(d);
    var z = e.toItemCenter(d);
    a.save();
    a.rect(c, u.getTop(), u.getRight() - c, u.getHeight());
    a.clip();
    a.translate(0.5, 0.5);
    for (m = 0; m < o; m++) {
        var h = z;
        s = b.getOutputAt(m);
        if (s.getStyle() == OutputStyle.Line) {
            var j, r = [];
            if (d > f) {
                j = s.execute(d - 1);
                if (isNaN(j) == false) {
                    r.push({
                        x: h - w,
                        y: k.toY(j)
                    })
                }
            }
            for (var q = d; q < g; q++, h += w) {
                j = s.execute(q);
                if (isNaN(j) == false) {
                    r.push({
                        x: h,
                        y: k.toY(j)
                    })
                }
            }
            if (r.length > 0) {
                var p = s.getColor();
                if (p == undefined) {
                    p = Theme.Color.Indicator0 + m
                }
                a.strokeStyle = y.getColor(p);
                Plotter.drawLines(a, r)
            }
        }
    }
    a.restore()
};
IndicatorPlotter.prototype.drawVolumeStick = function(b, s, m, f, j, o, p, r, k) {
    var a = is_instance(s, DarkTheme);
    var d = o;
    var h = k.toY(0);
    var q = [];
    var e = [];
    var g = [];
    for (var n = f; n < j; n++) {
        var t = m.getDataAt(n);
        var l = k.toY(t.volume);
        var c = k.toHeight(t.volume);
        if (t.close > t.open) {
            if (c > 1 && r > 1 && a) {
                q.push({
                    x: d + 0.5,
                    y: l + 0.5,
                    w: r - 1,
                    h: c - 1
                })
            } else {
                e.push({
                    x: d,
                    y: l,
                    w: Math.max(r, 1),
                    h: Math.max(c, 1)
                })
            }
        } else {
            if (t.close == t.open) {
                if (n > 0 && t.close >= m.getDataAt(n - 1).close) {
                    if (c > 1 && r > 1 && a) {
                        q.push({
                            x: d + 0.5,
                            y: l + 0.5,
                            w: r - 1,
                            h: c - 1
                        })
                    } else {
                        e.push({
                            x: d,
                            y: l,
                            w: Math.max(r, 1),
                            h: Math.max(c, 1)
                        })
                    }
                } else {
                    g.push({
                        x: d,
                        y: l,
                        w: Math.max(r, 1),
                        h: Math.max(c, 1)
                    })
                }
            } else {
                g.push({
                    x: d,
                    y: l,
                    w: Math.max(r, 1),
                    h: Math.max(c, 1)
                })
            }
        }
        d += p
    }
    if (q.length > 0) {
        b.strokeStyle = s.getColor(Theme.Color.Positive);
        Plotter.createRectangles(b, q);
        b.stroke()
    }
    if (e.length > 0) {
        b.fillStyle = s.getColor(Theme.Color.Positive);
        Plotter.createRectangles(b, e);
        b.fill()
    }
    if (g.length > 0) {
        b.fillStyle = s.getColor(Theme.Color.Negative);
        Plotter.createRectangles(b, g);
        b.fill()
    }
};
IndicatorPlotter.prototype.drawMACDStick = function(a, r, g, e, h, n, o, q, k) {
    var c = n;
    var s = k.toY(0);
    var p = [];
    var t = [];
    var d = [];
    var f = [];
    var j = (e > 0) ? g.execute(e - 1) : NaN;
    for (var l = e; l < h; l++) {
        var m = g.execute(l);
        if (m >= 0) {
            var b = k.toHeight(m);
            if ((l == 0 || m >= j) && b > 1 && q > 1) {
                p.push({
                    x: c + 0.5,
                    y: s - b + 0.5,
                    w: q - 1,
                    h: b - 1
                })
            } else {
                d.push({
                    x: c,
                    y: s - b,
                    w: Math.max(q, 1),
                    h: Math.max(b, 1)
                })
            }
        } else {
            var b = k.toHeight(-m);
            if ((l == 0 || m >= j) && b > 1 && q > 1) {
                t.push({
                    x: c + 0.5,
                    y: s + 0.5,
                    w: q - 1,
                    h: b - 1
                })
            } else {
                f.push({
                    x: c,
                    y: s,
                    w: Math.max(q, 1),
                    h: Math.max(b, 1)
                })
            }
        }
        j = m;
        c += o
    }
    if (p.length > 0) {
        a.strokeStyle = r.getColor(Theme.Color.Positive);
        Plotter.createRectangles(a, p);
        a.stroke()
    }
    if (t.length > 0) {
        a.strokeStyle = r.getColor(Theme.Color.Negative);
        Plotter.createRectangles(a, t);
        a.stroke()
    }
    if (d.length > 0) {
        a.fillStyle = r.getColor(Theme.Color.Positive);
        Plotter.createRectangles(a, d);
        a.fill()
    }
    if (f.length > 0) {
        a.fillStyle = r.getColor(Theme.Color.Negative);
        Plotter.createRectangles(a, f);
        a.fill()
    }
};
IndicatorPlotter.prototype.drawSARPoint = function(c, g, e, j, p, k, n, l, h) {
    var b = l >> 1;
    if (b < 0.5) {
        b = 0.5
    }
    if (b > 4) {
        b = 4
    }
    var a = k;
    var o = a + b;
    var d = 2 * Math.PI;
    c.save();
    c.translate(0.5, 0.5);
    c.strokeStyle = g.getColor(Theme.Color.Indicator3);
    c.beginPath();
    for (var f = j; f < p; f++) {
        var m = h.toY(e.execute(f));
        c.moveTo(o, m);
        c.arc(a, m, b, 0, d);
        a += n;
        o += n
    }
    c.stroke();
    c.restore()
};
var IndicatorInfoPlotter = create_class(Plotter);
IndicatorInfoPlotter.prototype.__construct = function(a, m) {
    IndicatorInfoPlotter.__super.__construct.call(this, a)
    this._manager = m
};
IndicatorInfoPlotter.prototype.Draw = function(c) {
    var p = this._manager.getInstance();
    var b = p.getArea(this.getAreaName());
    var q = p.getTimeline(this.getDataSourceName());
    var h = p.getDataProvider(this.getAreaName() + ".secondary");
    var j = p.getTheme(this.getFrameName());
    c.font = j.getFont(Theme.Font.Default);
    c.textAlign = "left";
    c.textBaseline = "top";
    c.fillStyle = j.getColor(Theme.Color.Text4);
    var l = {
        x: b.getLeft() + 4,
        y: b.getTop() + 2,
        w: b.getWidth() - 8,
        h: 20
    };
    var a = h.getIndicator();
    var m;
    switch (a.getParameterCount()) {
        case 0:
            m = a.getName();
            break;
        case 1:
            m = a.getName() + "(" + a.getParameterAt(0).getValue() + ")";
            break;
        case 2:
            m = a.getName() + "(" + a.getParameterAt(0).getValue() + "," + a.getParameterAt(1).getValue() + ")";
            break;
        case 3:
            m = a.getName() + "(" + a.getParameterAt(0).getValue() + "," + a.getParameterAt(1).getValue() + "," + a.getParameterAt(2).getValue() + ")";
            break;
        case 4:
            m = a.getName() + "(" + a.getParameterAt(0).getValue() + "," + a.getParameterAt(1).getValue() + "," + a.getParameterAt(2).getValue() + "," + a.getParameterAt(3).getValue() + ")";
            break;
        default:
            return
    }
    if (!Plotter.drawString(c, m, l)) {
        return
    }
    var k = q.getSelectedIndex();
    if (k < 0) {
        return
    }
    var i, o, f, g;
    var e, d = a.getOutputCount();
    for (e = 0; e < d; e++) {
        i = a.getOutputAt(e);
        o = i.execute(k);
        if (isNaN(o)) {
            continue
        }
        f = "  " + i.getName() + ": " + o.toFixed(2);
        g = i.getColor();
        if (g === undefined) {
            g = Theme.Color.Indicator0 + e
        }
        c.fillStyle = j.getColor(g);
        if (!Plotter.drawString(c, f, l)) {
            return
        }
    }
};
var MinMaxPlotter = create_class(NamedObject);
MinMaxPlotter.prototype.__construct = function(a, m) {
    MinMaxPlotter.__super.__construct.call(this, a)
    this._manager = m
};
MinMaxPlotter.prototype.Draw = function(b) {
    var i = this._manager.getInstance();
    var d = i.getDataSource(this.getDataSourceName());
    if (d.getDataCount() < 1) {
        return
    }
    var j = i.getTimeline(this.getDataSourceName());
    if (j.getInnerWidth() < j.getColumnWidth()) {
        return
    }
    var h = i.getRange(this.getAreaName());
    if (h.getRange() == 0) {
        return
    }
    var e = i.getDataProvider(this.getAreaName() + ".main");
    var g = j.getFirstIndex();
    var a = (g + j.getLastIndex()) >> 1;
    var f = i.getTheme(this.getFrameName());
    b.font = f.getFont(Theme.Font.Default);
    b.textBaseline = "middle";
    b.fillStyle = f.getColor(Theme.Color.Text4);
    b.strokeStyle = f.getColor(Theme.Color.Text4);
    var c = d.getDecimalDigits();
    this.drawMark(b, e.getMinValue(), c, h.toY(e.getMinValue()), g, a, e.getMinValueIndex(), j);
    this.drawMark(b, e.getMaxValue(), c, h.toY(e.getMaxValue()), g, a, e.getMaxValueIndex(), j)
};
MinMaxPlotter.prototype.drawMark = function(d, k, e, j, g, a, h, l) {
    var f, c, b;
    var i;
    if (h > a) {
        d.textAlign = "right";
        f = l.toItemCenter(h) - 4;
        c = f - 7;
        b = f - 3;
        i = c - 4
    } else {
        d.textAlign = "left";
        f = l.toItemCenter(h) + 4;
        c = f + 7;
        b = f + 3;
        i = c + 4
    }
    Plotter.drawLine(d, f, j, c, j);
    Plotter.drawLine(d, f, j, b, j + 2);
    Plotter.drawLine(d, f, j, b, j - 2);
    d.fillText(String.fromFloat(k, e), i, j)
};
var TimelinePlotter = create_class(Plotter);
TimelinePlotter.prototype.__construct = function(a, m) {
    TimelinePlotter.__super.__construct.call(this, a)
    this._manager = m
};
TimelinePlotter.TP_MINUTE = 60 * 1000;
TimelinePlotter.TP_HOUR = 60 * TimelinePlotter.TP_MINUTE;
TimelinePlotter.TP_DAY = 24 * TimelinePlotter.TP_HOUR;
TimelinePlotter.TIME_INTERVAL = [5 * TimelinePlotter.TP_MINUTE, 10 * TimelinePlotter.TP_MINUTE, 15 * TimelinePlotter.TP_MINUTE, 30 * TimelinePlotter.TP_MINUTE, TimelinePlotter.TP_HOUR, 2 * TimelinePlotter.TP_HOUR, 3 * TimelinePlotter.TP_HOUR, 6 * TimelinePlotter.TP_HOUR, 12 * TimelinePlotter.TP_HOUR, TimelinePlotter.TP_DAY, 2 * TimelinePlotter.TP_DAY];
TimelinePlotter.MonthConvert = {
    1: "Jan.",
    2: "Feb.",
    3: "Mar.",
    4: "Apr.",
    5: "May.",
    6: "Jun.",
    7: "Jul.",
    8: "Aug.",
    9: "Sep.",
    10: "Oct.",
    11: "Nov.",
    12: "Dec."
};
TimelinePlotter.prototype.Draw = function(b) {
    var G = this._manager.getInstance();
    var z = G.getArea(this.getAreaName());
    var e = G.getTimeline(this.getDataSourceName());
    if (!z.isChanged() && !e.isUpdated()) {
        return
    }
    var s = G.getDataSource(this.getDataSourceName());
    if (s.getDataCount() < 2) {
        return
    }
    var t = s.getDataAt(1).date - s.getDataAt(0).date;
    var u, w = TimelinePlotter.TIME_INTERVAL.length;
    for (u = 0; u < w; u++) {
        if (t < TimelinePlotter.TIME_INTERVAL[u]) {
            break
        }
    }
    for (; u < w; u++) {
        if (TimelinePlotter.TIME_INTERVAL[u] % t == 0) {
            if ((TimelinePlotter.TIME_INTERVAL[u] / t) * e.getColumnWidth() > 60) {
                break
            }
        }
    }
    var h = e.getFirstIndex();
    var k = e.getLastIndex();
    var A = new Date();
    var c = A.getTimezoneOffset() * 60 * 1000;
    var C = G.getTheme(this.getFrameName());
    b.font = C.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    var I = G.getLanguage();
    var j = [];
    var q = z.getTop();
    var H = z.getMiddle();
    for (var y = h; y < k; y++) {
        var F = s.getDataAt(y).date;
        var a = F - c;
        var g = new Date(F);
        var o = g.getFullYear();
        var E = g.getMonth() + 1;
        var B = g.getDate();
        var f = g.getHours();
        var r = g.getMinutes();
        var p = "";
        if (u < w) {
            var v = Math.max(TimelinePlotter.TP_DAY, TimelinePlotter.TIME_INTERVAL[u]);
            if (a % v == 0) {
                if (I == "zh-cn") {
                    p = E.toString() + "月" + B.toString() + "日"
                } else {
                    if (I == "zh-tw") {
                        p = E.toString() + "月" + B.toString() + "日"
                    } else {
                        if (I == "en-us") {
                            p = TimelinePlotter.MonthConvert[E] + " " + B.toString()
                        }
                    }
                }
                b.fillStyle = C.getColor(Theme.Color.Text4)
            } else {
                if (a % TimelinePlotter.TIME_INTERVAL[u] == 0) {
                    var D = r.toString();
                    if (r < 10) {
                        D = "0" + D
                    }
                    p = f.toString() + ":" + D;
                    b.fillStyle = C.getColor(Theme.Color.Text2)
                }
            }
        } else {
            if (B == 1 && (f < (t / TimelinePlotter.TP_HOUR))) {
                if (E == 1) {
                    p = o.toString();
                    if (I == "zh-cn") {
                        p += "年"
                    } else {
                        if (I == "zh-tw") {
                            p += "年"
                        }
                    }
                } else {
                    if (I == "zh-cn") {
                        p = E.toString() + "月"
                    } else {
                        if (I == "zh-tw") {
                            p = E.toString() + "月"
                        } else {
                            if (I == "en-us") {
                                p = TimelinePlotter.MonthConvert[E]
                            }
                        }
                    }
                }
                b.fillStyle = C.getColor(Theme.Color.Text4)
            }
        }
        if (p.length > 0) {
            var l = e.toItemCenter(y);
            j.push({
                x: l,
                y: q,
                w: 1,
                h: 4
            });
            b.fillText(p, l, H)
        }
    }
    if (j.length > 0) {
        b.fillStyle = C.getColor(Theme.Color.Grid1);
        Plotter.createRectangles(b, j);
        b.fill()
    }
};
var RangePlotter = create_class(NamedObject);
RangePlotter.prototype.__construct = function(a, m) {
    RangePlotter.__super.__construct.call(this, a)
    this._manager = m
};
RangePlotter.prototype.getRequiredWidth = function(b, a) {
    var c = this._manager.getInstance();
    var d = c.getTheme(this.getFrameName());
    b.font = d.getFont(Theme.Font.Default);
    return b.measureText((Math.floor(a) + 0.88).toString()).width + 16
};
RangePlotter.prototype.Draw = function(c) {
    var p = this._manager.getInstance();
    var h = this.getAreaName();
    var b = p.getArea(h);
    var m = h.substring(0, h.lastIndexOf("Range"));
    var i = p.getRange(m);
    if (i.getRange() == 0) {
        return
    }
    var j = i.getNameObject().getCompAt(2) == "main";
    if (j) {} else {
        if (!b.isChanged() && !i.isUpdated()) {
            return
        }
    }
    var l = i.getGradations();
    if (l.length == 0) {
        return
    }
    var e = b.getLeft();
    var o = b.getRight();
    var a = b.getCenter();
    var g = p.getTheme(this.getFrameName());
    c.font = g.getFont(Theme.Font.Default);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = g.getColor(Theme.Color.Text2);
    var f = [];
    for (var d in l) {
        var k = i.toY(l[d]);
        f.push({
            x: e,
            y: k,
            w: 6,
            h: 1
        });
        f.push({
            x: o - 6,
            y: k,
            w: 6,
            h: 1
        });
        c.fillText(String.fromFloat(l[d], 2), a, k)
    }
    if (f.length > 0) {
        c.fillStyle = g.getColor(Theme.Color.Grid1);
        Plotter.createRectangles(c, f);
        c.fill()
    }
};
var COrderGraphPlotter = create_class(NamedObject);
COrderGraphPlotter.prototype.__construct = function(a, m) {
    COrderGraphPlotter.__super.__construct.call(this, a)
    this._manager = m
};
COrderGraphPlotter.prototype.Draw = function(a) {
    return this._Draw_(a)
};
COrderGraphPlotter.prototype._Draw_ = function(a) {
    if (this.Update() == false) {
        return
    }
    if (this.updateData() == false) {
        return
    }
    this.m_top = this.m_pArea.getTop();
    this.m_bottom = this.m_pArea.getBottom();
    this.m_left = this.m_pArea.getLeft();
    this.m_right = this.m_pArea.getRight();
    a.save();
    a.rect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top);
    a.clip();
    var c = this._manager.getInstance().getChart()._depthData;
    this.x_offset = 0;
    this.y_offset = 0;
    var b = {};
    var d = {};
    b.x = this.m_left + c.array[this.m_ask_si].amounts * this.m_Step;
    b.y = this.m_pRange.toY(c.array[this.m_ask_si].rate);
    d.x = this.m_left + c.array[this.m_bid_si].amounts * this.m_Step;
    d.y = this.m_pRange.toY(c.array[this.m_bid_si].rate);
    if (Math.abs(b.y - d.y) < 1) {
        this.y_offset = 1
    }
    this.x_offset = 1;
    this.DrawBackground(a);
    this.UpdatePoints();
    this.FillBlack(a);
    this.DrawGradations(a);
    this.DrawLine(a);
    a.restore()
};
COrderGraphPlotter.prototype.DrawBackground = function(b) {
    b.fillStyle = this.m_pTheme.getColor(Theme.Color.Background);
    b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top);
    var c = this._manager.getInstance().getChart()._depthData;
    if (this.m_mode == 0) {
        var f = this.m_pRange.toY(c.array[this.m_ask_si].rate) - this.y_offset;
        var a = this.m_pRange.toY(c.array[this.m_bid_si].rate) + this.y_offset;
        var e = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
        e.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
        e.addColorStop(1, this.m_pTheme.getColor(Theme.Color.PositiveDark));
        b.fillStyle = e;
        b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, f - this.m_top);
        var d = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
        d.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
        d.addColorStop(1, this.m_pTheme.getColor(Theme.Color.NegativeDark));
        b.fillStyle = d;
        b.fillRect(this.m_left, a, this.m_right - this.m_left, this.m_bottom - a)
    } else {
        if (this.m_mode == 1) {
            var e = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
            e.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
            e.addColorStop(1, this.m_pTheme.getColor(Theme.Color.PositiveDark));
            b.fillStyle = e;
            b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top)
        } else {
            if (this.m_mode == 2) {
                var d = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
                d.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
                d.addColorStop(1, this.m_pTheme.getColor(Theme.Color.NegativeDark));
                b.fillStyle = d;
                b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top)
            }
        }
    }
};
COrderGraphPlotter.prototype.DrawLine = function(b) {
    if (this.m_mode == 0 || this.m_mode == 1) {
        b.strokeStyle = this.m_pTheme.getColor(Theme.Color.Positive);
        b.beginPath();
        b.moveTo(Math.floor(this.m_ask_points[0].x) + 0.5, Math.floor(this.m_ask_points[0].y) + 0.5);
        for (var a = 1; a < this.m_ask_points.length; a++) {
            b.lineTo(Math.floor(this.m_ask_points[a].x) + 0.5, Math.floor(this.m_ask_points[a].y) + 0.5)
        }
        b.stroke()
    }
    if (this.m_mode == 0 || this.m_mode == 2) {
        b.strokeStyle = this.m_pTheme.getColor(Theme.Color.Negative);
        b.beginPath();
        b.moveTo(this.m_bid_points[0].x + 0.5, this.m_bid_points[0].y + 0.5);
        for (var a = 1; a < this.m_bid_points.length; a++) {
            b.lineTo(this.m_bid_points[a].x + 0.5, this.m_bid_points[a].y + 0.5)
        }
        b.stroke()
    }
};
COrderGraphPlotter.prototype.UpdatePoints = function() {
    var f = this._manager.getInstance().getChart()._depthData;
    this.m_ask_points = [];
    var g = {};
    g.x = Math.floor(this.m_left);
    g.y = Math.floor(this.m_pRange.toY(f.array[this.m_ask_si].rate) - this.y_offset);
    this.m_ask_points.push(g);
    var b = 0;
    for (var e = this.m_ask_si; e >= this.m_ask_ei; e--) {
        var a = {};
        var h = {};
        if (e == this.m_ask_si) {
            a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
            a.y = Math.floor(this.m_pRange.toY(f.array[e].rate) - this.y_offset);
            this.m_ask_points.push(a);
            b = 1
        } else {
            a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
            a.y = Math.floor(this.m_ask_points[b].y);
            h.x = Math.floor(a.x);
            h.y = Math.floor(this.m_pRange.toY(f.array[e].rate) - this.y_offset);
            this.m_ask_points.push(a);
            b++;
            this.m_ask_points.push(h);
            b++
        }
    }
    this.m_bid_points = [];
    var c = {};
    c.x = Math.floor(this.m_left);
    c.y = Math.ceil(this.m_pRange.toY(f.array[this.m_bid_si].rate) + this.y_offset);
    this.m_bid_points.push(c);
    var d = 0;
    for (var e = this.m_bid_si; e <= this.m_bid_ei; e++) {
        var a = {};
        var h = {};
        if (e == this.m_bid_si) {
            a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
            a.y = Math.ceil(this.m_pRange.toY(f.array[e].rate) + this.y_offset);
            this.m_bid_points.push(a);
            d = 1
        } else {
            a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
            a.y = Math.ceil(this.m_bid_points[d].y);
            h.x = Math.floor(a.x);
            h.y = Math.ceil(this.m_pRange.toY(f.array[e].rate) + this.x_offset);
            this.m_bid_points.push(a);
            d++;
            this.m_bid_points.push(h);
            d++
        }
    }
};
COrderGraphPlotter.prototype.updateData = function() {
    var d = this._manager.getInstance().getChart()._depthData;
    if (d.array == null) {
        return false
    }
    if (d.array.length <= 50) {
        return false
    }
    var a = this.m_pRange.getOuterMinValue();
    var b = this.m_pRange.getOuterMaxValue();
    this.m_ask_si = d.asks_si;
    this.m_ask_ei = d.asks_si;
    for (var c = d.asks_si; c >= d.asks_ei; c--) {
        if (d.array[c].rate < b) {
            this.m_ask_ei = c
        } else {
            break
        }
    }
    this.m_bid_si = d.bids_si;
    this.m_bid_ei = d.bids_si;
    for (var c = d.bids_si; c <= d.bids_ei; c++) {
        if (d.array[c].rate > a) {
            this.m_bid_ei = c
        } else {
            break
        }
    }
    if (this.m_ask_ei == this.m_ask_si) {
        this.m_mode = 2
    } else {
        if (this.m_bid_ei == this.m_bid_si) {
            this.m_mode = 1
        } else {
            this.m_mode = 0
        }
    }
    this.m_Step = this.m_pArea.getWidth();
    if (this.m_mode == 0) {
        if (this.m_ask_ei == d.asks_ei && this.m_bid_ei == d.bids_ei) {
            this.m_Step /= Math.min(d.array[this.m_ask_ei].amounts, d.array[this.m_bid_ei].amounts)
        } else {
            if (this.m_ask_ei != d.asks_ei && this.m_bid_ei == d.bids_ei) {
                this.m_Step /= d.array[this.m_bid_ei].amounts
            } else {
                if (this.m_ask_ei == d.asks_ei && this.m_bid_ei != d.bids_ei) {
                    this.m_Step /= d.array[this.m_ask_ei].amounts
                } else {
                    if (this.m_ask_ei != d.asks_ei && this.m_bid_ei != d.bids_ei) {
                        this.m_Step /= Math.max(d.array[this.m_ask_ei].amounts, d.array[this.m_bid_ei].amounts)
                    }
                }
            }
        }
    } else {
        if (this.m_mode == 1) {
            this.m_Step /= d.array[this.m_ask_ei].amounts
        } else {
            if (this.m_mode == 2) {
                this.m_Step /= d.array[this.m_bid_ei].amounts
            }
        }
    }
    return true
};
COrderGraphPlotter.prototype.Update = function() {
    this.m_pMgr = this._manager.getInstance();
    var b = this.getAreaName();
    this.m_pArea = this.m_pMgr.getArea(b);
    if (this.m_pArea == null) {
        return false
    }
    var a = b.substring(0, b.lastIndexOf("Range"));
    this.m_pRange = this.m_pMgr.getRange(a);
    if (this.m_pRange == null || this.m_pRange.getRange() == 0) {
        return false
    }
    this.m_pTheme = this.m_pMgr.getTheme(this.getFrameName());
    if (this.m_pTheme == null) {
        return false
    }
    return true
};
COrderGraphPlotter.prototype.DrawGradations = function(b) {
    var m = this._manager.getInstance();
    var g = this.getAreaName();
    var a = m.getArea(g);
    var k = g.substring(0, g.lastIndexOf("Range"));
    var h = m.getRange(k);
    if (h.getRange() == 0) {
        return
    }
    var j = h.getGradations();
    if (j.length == 0) {
        return
    }
    var d = a.getLeft();
    var l = a.getRight();
    var e = [];
    for (var c in j) {
        var i = h.toY(j[c]);
        e.push({
            x: d,
            y: i,
            w: 6,
            h: 1
        });
        e.push({
            x: l - 6,
            y: i,
            w: 6,
            h: 1
        })
    }
    if (e.length > 0) {
        var f = m.getTheme(this.getFrameName());
        b.fillStyle = f.getColor(Theme.Color.Grid1);
        Plotter.createRectangles(b, e);
        b.fill()
    }
};
COrderGraphPlotter.prototype.FillBlack = function(f) {
    var c = this.m_ask_points;
    var g = this.m_bid_points;
    var a = {};
    var d = {};
    a.x = this.m_right;
    a.y = c[0].y;
    d.x = this.m_right;
    d.y = c[c.length - 1].y;
    var h = {};
    var b = {};
    h.x = this.m_right;
    h.y = g[0].y - 1;
    b.x = this.m_right;
    b.y = g[g.length - 1].y;
    c.unshift(a);
    c.push(d);
    g.unshift(h);
    g.push(b);
    f.fillStyle = this.m_pTheme.getColor(Theme.Color.Background);
    f.beginPath();
    f.moveTo(Math.floor(c[0].x) + 0.5, Math.floor(c[0].y) + 0.5);
    for (var e = 1; e < c.length; e++) {
        f.lineTo(Math.floor(c[e].x) + 0.5, Math.floor(c[e].y) + 0.5)
    }
    f.fill();
    f.beginPath();
    f.moveTo(Math.floor(g[0].x) + 0.5, Math.floor(g[0].y) + 0.5);
    for (var e = 1; e < g.length; e++) {
        f.lineTo(Math.floor(g[e].x) + 0.5, Math.floor(g[e].y) + 0.5)
    }
    f.fill();
    c.shift();
    c.pop();
    g.shift();
    g.pop()
};
COrderGraphPlotter.prototype.DrawTickerGraph = function(c) {
    return;
    var j = this._manager.getInstance();
    var d = j.getDataSource(this.getDataSourceName());
    var i = d._dataItems[d._dataItems.length - 1].close;
    var b = this.m_left + 1;
    var a = this.m_pRange.toY(i);
    var h = b + 5;
    var g = a + 2.5;
    var f = b + 5;
    var e = a - 2.5;
    c.fillStyle = this.m_pTheme.getColor(Theme.Color.Mark);
    c.strokeStyle = this.m_pTheme.getColor(Theme.Color.Mark)
};
var LastVolumePlotter = create_class(Plotter);
LastVolumePlotter.prototype.__construct = function(a, m) {
    LastVolumePlotter.__super.__construct.call(this, a)
    this._manager = m
};
LastVolumePlotter.prototype.Draw = function(b) {
    var k = this._manager.getInstance();
    var l = k.getTimeline(this.getDataSourceName());
    var f = this.getAreaName();
    var a = k.getArea(f);
    var i = f.substring(0, f.lastIndexOf("Range"));
    var g = k.getRange(i);
    if (g.getRange() == 0) {
        return
    }
    var c = k.getDataSource(this.getDataSourceName());
    if (c.getDataCount() < 1) {
        return
    }
    var e = k.getTheme(this.getFrameName());
    b.font = e.getFont(Theme.Font.Default);
    b.textAlign = "left";
    b.textBaseline = "middle";
    b.fillStyle = e.getColor(Theme.Color.RangeMark);
    b.strokeStyle = e.getColor(Theme.Color.RangeMark);
    var j = c.getDataAt(c.getDataCount() - 1).volume;
    var h = g.toY(j);
    var d = a.getLeft() + 1;
    Plotter.drawLine(b, d, h, d + 7, h);
    Plotter.drawLine(b, d, h, d + 3, h + 2);
    Plotter.drawLine(b, d, h, d + 3, h - 2);
    b.fillText(String.fromFloat(j, 2), d + 10, h)
};
var LastClosePlotter = create_class(Plotter);
LastClosePlotter.prototype.__construct = function(a, m) {
    LastClosePlotter.__super.__construct.call(this, a)
    this._manager = m
};
LastClosePlotter.prototype.Draw = function(b) {
    var k = this._manager.getInstance();
    var l = k.getTimeline(this.getDataSourceName());
    var f = this.getAreaName();
    var a = k.getArea(f);
    var i = f.substring(0, f.lastIndexOf("Range"));
    var g = k.getRange(i);
    if (g.getRange() == 0) {
        return
    }
    var c = k.getDataSource(this.getDataSourceName());
    if (c.getDataCount() < 1) {
        return
    }
    var j = c._dataItems[c._dataItems.length - 1].close;
    if (j <= g.getMinValue() || j >= g.getMaxValue()) {
        return
    }
    var e = k.getTheme(this.getFrameName());
    b.font = e.getFont(Theme.Font.Default);
    b.textAlign = "left";
    b.textBaseline = "middle";
    b.fillStyle = e.getColor(Theme.Color.RangeMark);
    b.strokeStyle = e.getColor(Theme.Color.RangeMark);
    var h = g.toY(j);
    var d = a.getLeft() + 1;
    Plotter.drawLine(b, d, h, d + 7, h);
    Plotter.drawLine(b, d, h, d + 3, h + 2);
    Plotter.drawLine(b, d, h, d + 3, h - 2);
    b.fillText(String.fromFloat(j, c.getDecimalDigits()), d + 10, h)
};
var SelectionPlotter = create_class(Plotter);
SelectionPlotter.prototype.__construct = function(a, m) {
    SelectionPlotter.__super.__construct.call(this, a)
    this._manager = m;
};
SelectionPlotter.prototype.Draw = function(c) {
    var f = this._manager.getInstance();
    if (f._drawingTool != ChartManager.DrawingTool.CrossCursor) {
        return
    }
    var e = f.getArea(this.getAreaName());
    var d = f.getTimeline(this.getDataSourceName());
    if (d.getSelectedIndex() < 0) {
        return
    }
    var b = f.getRange(this.getAreaName());
    var g = f.getTheme(this.getFrameName());
    c.strokeStyle = g.getColor(Theme.Color.Cursor);
    var a = d.toItemCenter(d.getSelectedIndex());
    Plotter.drawLine(c, a, e.getTop() - 1, a, e.getBottom());
    var h = b.getSelectedPosition();
    if (h >= 0) {
        Plotter.drawLine(c, e.getLeft(), h, e.getRight(), h)
    }
};
var TimelineSelectionPlotter = create_class(NamedObject);
TimelineSelectionPlotter.MonthConvert = {
    1: "Jan.",
    2: "Feb.",
    3: "Mar.",
    4: "Apr.",
    5: "May.",
    6: "Jun.",
    7: "Jul.",
    8: "Aug.",
    9: "Sep.",
    10: "Oct.",
    11: "Nov.",
    12: "Dec."
};
TimelineSelectionPlotter.prototype.__construct = function(a, m) {
    TimelineSelectionPlotter.__super.__construct.call(this, a)
    this._manager = m
};
TimelineSelectionPlotter.prototype.Draw = function(b) {
    var q = this._manager.getInstance();
    var l = q.getArea(this.getAreaName());
    var c = q.getTimeline(this.getDataSourceName());
    if (c.getSelectedIndex() < 0) {
        return
    }
    var j = q.getDataSource(this.getDataSourceName());
    if (!is_instance(j, MainDataSource)) {
        return
    }
    var m = q.getTheme(this.getFrameName());
    var r = q.getLanguage();
    var g = c.toItemCenter(c.getSelectedIndex());
    b.fillStyle = m.getColor(Theme.Color.Background);
    b.fillRect(g - 52.5, l.getTop() + 2.5, 106, 18);
    b.strokeStyle = m.getColor(Theme.Color.Grid3);
    b.strokeRect(g - 52.5, l.getTop() + 2.5, 106, 18);
    b.font = m.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.fillStyle = m.getColor(Theme.Color.Text4);
    var f = new Date(j.getDataAt(c.getSelectedIndex()).date);
    var o = f.getMonth() + 1;
    var n = f.getDate();
    var e = f.getHours();
    var i = f.getMinutes();
    var a = o.toString();
    var d = n.toString();
    var k = e.toString();
    var p = i.toString();
    if (i < 10) {
        p = "0" + p
    }
    var h = "";
    if (r == "zh-cn") {
        h = a + "月" + d + "日  " + k + ":" + p
    } else {
        if (r == "zh-tw") {
            h = a + "月" + d + "日  " + k + ":" + p
        } else {
            if (r == "en-us") {
                h = TimelineSelectionPlotter.MonthConvert[o] + " " + d + "  " + k + ":" + p
            }
        }
    }
    b.fillText(h, g, l.getMiddle())
};
var RangeSelectionPlotter = create_class(NamedObject);
RangeSelectionPlotter.prototype.__construct = function(a, m) {
    RangeSelectionPlotter.__super.__construct.call(this, a)
    this._manager = m
};
RangeSelectionPlotter.prototype.Draw = function(b) {
    var j = this._manager.getInstance();
    var e = this.getAreaName();
    var a = j.getArea(e);
    var k = j.getTimeline(this.getDataSourceName());
    if (k.getSelectedIndex() < 0) {
        return
    }
    var h = e.substring(0, e.lastIndexOf("Range"));
    var f = j.getRange(h);
    if (f.getRange() == 0 || f.getSelectedPosition() < 0) {
        return
    }
    var i = f.getSelectedValue();
    if (i == -Number.MAX_VALUE) {
        return
    }
    var g = f.getSelectedPosition();
    Plotter.createPolygon(b, [{
            x: a.getLeft(),
            y: g
        },
        {
            x: a.getLeft() + 5,
            y: g + 10
        },
        {
            x: a.getRight() - 3,
            y: g + 10
        },
        {
            x: a.getRight() - 3,
            y: g - 10
        },
        {
            x: a.getLeft() + 5,
            y: g - 10
        }
    ]);
    var d = j.getTheme(this.getFrameName());
    b.fillStyle = d.getColor(Theme.Color.Background);
    b.fill();
    b.strokeStyle = d.getColor(Theme.Color.Grid4);
    b.stroke();
    b.font = d.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.fillStyle = d.getColor(Theme.Color.Text3);
    var c = 2;
    if (f.getNameObject().getCompAt(2) == "main") {
        c = j.getDataSource(this.getDataSourceName()).getDecimalDigits()
    }
    b.fillText(String.fromFloat(i, c), a.getCenter(), g)
};