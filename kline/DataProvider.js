var DataProvider = create_class(NamedObject);
DataProvider.prototype.__construct = function(a, m) {
    DataProvider.__super.__construct.call(this, a);
    this._manager = m;
    this._minValue = 0;
    this._maxValue = 0;
    this._minValueIndex = -1;
    this._maxValueIndex = -1
};
DataProvider.prototype.getMinValue = function() {
    return this._minValue
};
DataProvider.prototype.getMaxValue = function() {
    return this._maxValue
};
DataProvider.prototype.getMinValueIndex = function() {
    return this._minValueIndex
};
DataProvider.prototype.getMaxValueIndex = function() {
    return this._maxValueIndex
};
DataProvider.prototype.calcRange = function(l, h, d, j) {
    var e = Number.MAX_VALUE;
    var m = -Number.MAX_VALUE;
    var k = -1;
    var b = -1;
    var c = {};
    var f = h - 1;
    var a = l.length - 1;
    for (; a >= 0; a--) {
        var g = l[a];
        if (f < g) {
            d[a] = {
                min: e,
                max: m
            }
        } else {
            for (; f >= g; f--) {
                if (this.getMinMaxAt(f, c) == false) {
                    continue
                }
                if (e > c.min) {
                    e = c.min;
                    k = f
                }
                if (m < c.max) {
                    m = c.max;
                    b = f
                }
            }
            d[a] = {
                min: e,
                max: m
            }
        }
        if (j != null) {
            j[a] = {
                minIndex: k,
                maxIndex: b
            }
        }
    }
};
DataProvider.prototype.updateRange = function() {
    var e = this._manager.getInstance();
    var c = e.getTimeline(this.getDataSourceName());
    var b = [c.getFirstIndex()];
    var d = [{}];
    var a = [{}];
    this.calcRange(b, c.getLastIndex(), d, a);
    this._minValue = d[0].min;
    this._maxValue = d[0].max;
    this._minValueIndex = a[0].minIndex;
    this._maxValueIndex = a[0].maxIndex
};
var MainDataProvider = create_class(DataProvider);
MainDataProvider.prototype.__construct = function(a, m) {
    MainDataProvider.__super.__construct.call(this, a, m);
    this._candlestickDS = null
};
MainDataProvider.prototype.updateData = function() {
    var b = this._manager.getInstance();
    var a = b.getDataSource(this.getDataSourceName());
    if (!is_instance(a, MainDataSource)) {
        return
    }
    this._candlestickDS = a
};
MainDataProvider.prototype.getMinMaxAt = function(a, b) {
    var c = this._candlestickDS.getDataAt(a);
    b.min = c.low;
    b.max = c.high;
    return true
};
var IndicatorDataProvider = create_class(DataProvider);
IndicatorDataProvider.prototype.getIndicator = function() {
    return this._indicator
};
IndicatorDataProvider.prototype.setIndicator = function(a) {
    this._indicator = a;
    this.refresh()
};
IndicatorDataProvider.prototype.refresh = function() {
    var d = this._manager.getInstance();
    var c = d.getDataSource(this.getDataSourceName());
    if (c.getDataCount() < 1) {
        return
    }
    var e = this._indicator;
    var a, b = c.getDataCount();
    e.clear();
    e.reserve(b);
    for (a = 0; a < b; a++) {
        e.execute(c, a)
    }
};
IndicatorDataProvider.prototype.updateData = function() {
    var e = this._manager.getInstance();
    var d = e.getDataSource(this.getDataSourceName());
    if (d.getDataCount() < 1) {
        return
    }
    var g = this._indicator;
    var f = d.getUpdateMode();
    switch (f) {
        case DataSource.UpdateMode.Refresh:
            this.refresh();
            break;
        case DataSource.UpdateMode.Append:
            g.reserve(d.getAppendedCount());
        case DataSource.UpdateMode.Update:
            var b, c = d.getDataCount();
            var a = d.getUpdatedCount() + d.getAppendedCount();
            for (b = c - a; b < c; b++) {
                g.execute(d, b)
            }
            break
    }
};
IndicatorDataProvider.prototype.getMinMaxAt = function(b, f) {
    f.min = Number.MAX_VALUE;
    f.max = -Number.MAX_VALUE;
    var a, e = false;
    var d, c = this._indicator.getOutputCount();
    for (d = 0; d < c; d++) {
        a = this._indicator.getOutputAt(d).execute(b);
        if (isNaN(a) == false) {
            e = true;
            if (f.min > a) {
                f.min = a
            }
            if (f.max < a) {
                f.max = a
            }
        }
    }
    return e
};