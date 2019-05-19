var Range = create_class(NamedObject);
Range.prototype.__construct = function(a, m) {
    Range.__super.__construct.call(this, a);
    this._manager = m;
    this._updated = true;
    this._minValue = Number.MAX_VALUE;
    this._maxValue = -Number.MAX_VALUE;
    this._outerMinValue = Number.MAX_VALUE;
    this._outerMaxValue = -Number.MAX_VALUE;
    this._ratio = 0;
    this._top = 0;
    this._bottom = 0;
    this._paddingTop = 0;
    this._paddingBottom = 0;
    this._minInterval = 36;
    this._selectedPosition = -1;
    this._selectedValue = -Number.MAX_VALUE;
    this._gradations = []
};
Range.prototype.isUpdated = function() {
    return this._updated
};
Range.prototype.setUpdated = function(a) {
    this._updated = a
};
Range.prototype.getMinValue = function() {
    return this._minValue
};
Range.prototype.getMaxValue = function() {
    return this._maxValue
};
Range.prototype.getRange = function() {
    return this._maxValue - this._minValue
};
Range.prototype.getOuterMinValue = function() {
    return this._outerMinValue
};
Range.prototype.getOuterMaxValue = function() {
    return this._outerMaxValue
};
Range.prototype.getOuterRange = function() {
    return this._outerMaxValue - this._outerMinValue
};
Range.prototype.getHeight = function() {
    return Math.max(0, this._bottom - this._top)
};
Range.prototype.getGradations = function() {
    return this._gradations
};
Range.prototype.getMinInterval = function() {
    return this._minInterval
};
Range.prototype.setMinInterval = function(a) {
    this._minInterval = a
};
Range.prototype.getSelectedPosition = function() {
    if (this._selectedPosition >= 0) {
        return this._selectedPosition
    }
    if (this._selectedValue > -Number.MAX_VALUE) {
        return this.toY(this._selectedValue)
    }
    return -1
};
Range.prototype.getSelectedValue = function() {
    if (this._selectedValue > -Number.MAX_VALUE) {
        return this._selectedValue
    }
    var b = this._manager.getInstance();
    var a = b.getArea(this.getAreaName());
    if (a == null) {
        return -Number.MAX_VALUE
    }
    if (this._selectedPosition < a.getTop() + 12 || this._selectedPosition >= a.getBottom() - 4) {
        return -Number.MAX_VALUE
    }
    return this.toValue(this._selectedPosition)
};
Range.prototype.setPaddingTop = function(a) {
    this._paddingTop = a
};
Range.prototype.setPaddingBottom = function(a) {
    this._paddingBottom = a
};
Range.prototype.toValue = function(a) {
    return this._maxValue - (a - this._top) / this._ratio
};
Range.prototype.toY = function(a) {
    if (this._ratio > 0) {
        return this._top + Math.floor((this._maxValue - a) * this._ratio + 0.5)
    }
    return this._top
};
Range.prototype.toHeight = function(a) {
    return Math.floor(a * this._ratio + 1.5)
};
Range.prototype.update = function() {
    var c = Number.MAX_VALUE;
    var a = -Number.MAX_VALUE;
    var e = this._manager.getInstance();
    var g, f = [".main", ".secondary"];
    for (var b = 0; b < f.length; b++) {
        g = e.getDataProvider(this.getName() + f[b]);
        if (g != null) {
            c = Math.min(c, g.getMinValue());
            a = Math.max(a, g.getMaxValue())
        }
    }
    var d = {
        min: c,
        max: a
    };
    this.preSetRange(d);
    this.setRange(d.min, d.max)
};
Range.prototype.select = function(a) {
    this._selectedValue = a;
    this._selectedPosition = -1
};
Range.prototype.selectAt = function(a) {
    this._selectedPosition = a;
    this._selectedValue = -Number.MAX_VALUE
};
Range.prototype.unselect = function() {
    this._selectedPosition = -1;
    this._selectedValue = -Number.MAX_VALUE
};
Range.prototype.preSetRange = function(a) {
    if (a.min == a.max) {
        a.min = -1;
        a.max = 1
    }
};
Range.prototype.setRange = function(d, f) {
    var c = this._manager.getInstance();
    var b = c.getArea(this.getAreaName());
    if (this._minValue == d && this._maxValue == f && !b.isChanged()) {
        return
    }
    this._updated = true;
    this._minValue = d;
    this._maxValue = f;
    this._gradations = [];
    var e = b.getTop() + this._paddingTop;
    var a = b.getBottom() - (this._paddingBottom + 1);
    if (e >= a) {
        this._minValue = this._maxValue;
        return
    }
    this._top = e;
    this._bottom = a;
    if (this._maxValue > this._minValue) {
        this._ratio = (a - e) / (this._maxValue - this._minValue)
    } else {
        this._ratio = 1
    }
    this._outerMinValue = this.toValue(b.getBottom());
    this._outerMaxValue = this.toValue(b.getTop());
    this.updateGradations()
};
Range.prototype.calcInterval = function() {
    var e = this.getHeight();
    var f = this.getMinInterval();
    if ((e / f) <= 1) {
        f = e >> 1
    }
    var g = this.getRange();
    var b = 0;
    while (b > -2 && Math.floor(g) < g) {
        g *= 10;
        b--
    }
    var a, j;
    for (;; b++) {
        j = Math.pow(10, b);
        a = j;
        if (this.toHeight(a) > f) {
            break
        }
        a = 2 * j;
        if (this.toHeight(a) > f) {
            break
        }
        a = 5 * j;
        if (this.toHeight(a) > f) {
            break
        }
    }
    return a
};
Range.prototype.updateGradations = function() {
    this._gradations = [];
    var b = this.calcInterval();
    if (b <= 0) {
        return
    }
    var a = Math.floor(this.getMaxValue() / b) * b;
    do {
        this._gradations.push(a);
        a -= b
    } while (a > this.getMinValue())
};
var PositiveRange = create_class(Range);
PositiveRange.prototype.__construct = function(a,m) {
    PositiveRange.__super.__construct.call(this, a,m)
};
PositiveRange.prototype.preSetRange = function(a) {
    if (a.min < 0) {
        a.min = 0
    }
    if (a.max < 0) {
        a.max = 0
    }
};
var ZeroBasedPositiveRange = create_class(Range);
ZeroBasedPositiveRange.prototype.__construct = function(a,m) {
    ZeroBasedPositiveRange.__super.__construct.call(this, a,m)
};
ZeroBasedPositiveRange.prototype.preSetRange = function(a) {
    a.min = 0;
    if (a.max < 0) {
        a.max = 0
    }
};
var MainRange = create_class(Range);
MainRange.prototype.__construct = function(a, m) {
    MainRange.__super.__construct.call(this, a, m)
};
MainRange.prototype.preSetRange = function(e) {
    var l = this._manager.getInstance();
    var n = l.getTimeline(this.getDataSourceName());
    var b = n.getMaxIndex() - n.getLastIndex();
    if (b < 25) {
        var f = l.getDataSource(this.getDataSourceName());
        var h = f.getDataAt(f.getDataCount() - 1);
        var i = ((e.max - e.min) / 4) * (1 - (b / 25));
        e.min = Math.min(e.min, Math.max(h.low - i, 0));
        e.max = Math.max(e.max, h.high + i)
    }
    if (e.min > 0) {
        var k = e.max / e.min;
        if (k < 1.016) {
            var g = (e.max + e.min) / 2;
            var j = (k - 1) * 1.5;
            e.max = g * (1 + j);
            e.min = g * (1 - j)
        } else {
            if (k < 1.048) {
                var g = (e.max + e.min) / 2;
                e.max = g * 1.024;
                e.min = g * 0.976
            }
        }
    }
    if (e.min < 0) {
        e.min = 0
    }
    if (e.max < 0) {
        e.max = 0
    }
};
var ZeroCenteredRange = create_class(Range);
ZeroCenteredRange.prototype.__construct = function(a, m) {
    ZeroCenteredRange.__super.__construct.call(this, a, m)
};
ZeroCenteredRange.prototype.calcInterval = function(d) {
    var b = this.getMinInterval();
    if (d.getHeight() / b < 2) {
        return 0
    }
    var c = this.getRange();
    var a;
    for (a = 3;; a += 2) {
        if (this.toHeight(c / a) <= b) {
            break
        }
    }
    a -= 2;
    return c / a
};
ZeroCenteredRange.prototype.updateGradations = function() {
    this._gradations = [];
    var d = this._manager.getInstance();
    var c = d.getArea(this.getAreaName());
    var b = this.calcInterval(c);
    if (b <= 0) {
        return
    }
    var a = b / 2;
    do {
        this._gradations.push(a);
        this._gradations.push(-a);
        a += b
    } while (a <= this.getMaxValue())
};
ZeroCenteredRange.prototype.preSetRange = function(b) {
    var a = Math.max(Math.abs(b.min), Math.abs(b.max));
    b.min = -a;
    b.max = a
};
var PercentageRange = create_class(Range);
PercentageRange.prototype.__construct = function(a,m) {
    PercentageRange.__super.__construct.call(this, a,m)
};
PercentageRange.prototype.updateGradations = function() {
    this._gradations = [];
    var e = this._manager.getInstance();
    var d = e.getArea(this.getAreaName());
    var b = 10;
    var c = Math.floor(this.toHeight(b));
    if ((c << 2) > d.getHeight()) {
        return
    }
    var a = Math.ceil(this.getMinValue() / b) * b;
    if (a == 0) {
        a = 0
    }
    if ((c << 2) < 24) {
        if ((c << 1) < 8) {
            return
        }
        do {
            if (a == 20 || a == 80) {
                this._gradations.push(a)
            }
            a += b
        } while (a < this.getMaxValue())
    } else {
        do {
            if (c < 8) {
                if (a == 20 || a == 50 || a == 80) {
                    this._gradations.push(a)
                }
            } else {
                if (a == 0 || a == 20 || a == 50 || a == 80 || a == 100) {
                    this._gradations.push(a)
                }
            }
            a += b
        } while (a < this.getMaxValue())
    }
};