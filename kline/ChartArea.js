var ChartArea = create_class(NamedObject);
ChartArea.prototype.__construct = function(a, m) {
    ChartArea.__super.__construct.call(this, a);
    this._manager = m;
    this._left = 0;
    this._top = 0;
    this._right = 0;
    this._bottom = 0;
    this._changed = false;
    this._highlighted = false;
    this._pressed = false;
    this._selected = false;
    this.Measuring = new MEvent()
};
ChartArea.DockStyle = {
    Left: 0,
    Top: 1,
    Right: 2,
    Bottom: 3,
    Fill: 4
};
ChartArea.prototype.getDockStyle = function() {
    return this._dockStyle
};
ChartArea.prototype.setDockStyle = function(a) {
    this._dockStyle = a
};
ChartArea.prototype.getLeft = function() {
    return this._left
};
ChartArea.prototype.getTop = function() {
    return this._top
};
ChartArea.prototype.setTop = function(a) {
    if (this._top != a) {
        this._top = a;
        this._changed = true
    }
};
ChartArea.prototype.getRight = function() {
    return this._right
};
ChartArea.prototype.getBottom = function() {
    return this._bottom
};
ChartArea.prototype.setBottom = function(a) {
    if (this._bottom != a) {
        this._bottom = a;
        this._changed = true
    }
};
ChartArea.prototype.getCenter = function() {
    return (this._left + this._right) >> 1
};
ChartArea.prototype.getMiddle = function() {
    return (this._top + this._bottom) >> 1
};
ChartArea.prototype.getWidth = function() {
    return this._right - this._left
};
ChartArea.prototype.getHeight = function() {
    return this._bottom - this._top
};
ChartArea.prototype.getRect = function() {
    return {
        X: this._left,
        Y: this._top,
        Width: this._right - this._left,
        Height: this._bottom - this._top
    }
};
ChartArea.prototype.contains = function(a, b) {
    if (a >= this._left && a < this._right) {
        if (b >= this._top && b < this._bottom) {
            return [this]
        }
    }
    return null
};
ChartArea.prototype.getMeasuredWidth = function() {
    return this._measuredWidth
};
ChartArea.prototype.getMeasuredHeight = function() {
    return this._measuredHeight
};
ChartArea.prototype.setMeasuredDimension = function(b, a) {
    this._measuredWidth = b;
    this._measuredHeight = a
};
ChartArea.prototype.measure = function(b, c, a) {
    this._measuredWidth = 0;
    this._measuredHeight = 0;
    this.Measuring.raise(this, {
        Width: c,
        Height: a
    });
    if (this._measuredWidth == 0 && this._measuredHeight == 0) {
        this.setMeasuredDimension(c, a)
    }
};
ChartArea.prototype.layout = function(e, d, c, a, b) {
    e <<= 0;
    if (this._left != e) {
        this._left = e;
        this._changed = true
    }
    d <<= 0;
    if (this._top != d) {
        this._top = d;
        this._changed = true
    }
    c <<= 0;
    if (this._right != c) {
        this._right = c;
        this._changed = true
    }
    a <<= 0;
    if (this._bottom != a) {
        this._bottom = a;
        this._changed = true
    }
    if (b) {
        this._changed = true
    }
};
ChartArea.prototype.isChanged = function() {
    return this._changed
};
ChartArea.prototype.setChanged = function(a) {
    this._changed = a
};
ChartArea.prototype.isHighlighted = function() {
    return this._highlighted
};
ChartArea.prototype.getHighlightedArea = function() {
    return this._highlighted ? this : null
};
ChartArea.prototype.highlight = function(a) {
    this._highlighted = (this == a);
    return this._highlighted ? this : null
};
ChartArea.prototype.isPressed = function() {
    return this._pressed
};
ChartArea.prototype.setPressed = function(a) {
    this._pressed = a
};
ChartArea.prototype.isSelected = function() {
    return this._selected
};
ChartArea.prototype.getSelectedArea = function() {
    return this._selected ? this : null
};
ChartArea.prototype.select = function(a) {
    this._selected = (this == a);
    return this._selected ? this : null
};
ChartArea.prototype.onMouseMove = function(a, b) {
    return null
};
ChartArea.prototype.onMouseLeave = function(a, b) {};
ChartArea.prototype.onMouseDown = function(a, b) {
    return null
};
ChartArea.prototype.onMouseUp = function(a, b) {
    return null
};
var MainArea = create_class(ChartArea);
MainArea.prototype.__construct = function(a, m) {
    MainArea.__super.__construct.call(this, a, m);
    this._dragStarted = false;
    this._oldX = 0;
    this._oldY = 0;
    this._passMoveEventToToolManager = true
};
MainArea.prototype.onMouseMove = function(a, c) {
    var b = this._manager.getInstance();
    if (b._capturingMouseArea == this) {
        if (this._dragStarted == false) {
            if (Math.abs(this._oldX - a) > 1 || Math.abs(this._oldY - c) > 1) {
                this._dragStarted = true
            }
        }
    }
    if (this._dragStarted) {
        b.hideCursor();
        if (b.onToolMouseDrag(this.getFrameName(), a, c)) {
            return this
        }
        b.getTimeline(this.getDataSourceName()).move(a - this._oldX);
        return this
    }
    if (this._passMoveEventToToolManager && b.onToolMouseMove(this.getFrameName(), a, c)) {
        b.hideCursor();
        return this
    }
    switch (b._drawingTool) {
        case ChartManager.DrawingTool.Cursor:
            b.showCursor();
            break;
        case ChartManager.DrawingTool.CrossCursor:
            if (b.showCrossCursor(this, a, c)) {
                b.hideCursor()
            } else {
                b.showCursor()
            }
            break;
        default:
            b.hideCursor();
            break
    }
    return this
};
MainArea.prototype.onMouseLeave = function(a, b) {
    this._dragStarted = false;
    this._passMoveEventToToolManager = true
};
MainArea.prototype.onMouseDown = function(a, c) {
    var b = this._manager.getInstance();
    b.getTimeline(this.getDataSourceName()).startMove();
    this._oldX = a;
    this._oldY = c;
    this._dragStarted = false;
    if (b.onToolMouseDown(this.getFrameName(), a, c)) {
        this._passMoveEventToToolManager = false
    }
    return this
};
MainArea.prototype.onMouseUp = function(a, d) {
    var c = this._manager.getInstance();
    var b = null;
    if (this._dragStarted) {
        this._dragStarted = false;
        b = this
    }
    if (c.onToolMouseUp(this.getFrameName(), a, d)) {
        b = this
    }
    this._passMoveEventToToolManager = true;
    return b
};
var IndicatorArea = create_class(ChartArea);
IndicatorArea.prototype.__construct = function(a, m) {
    IndicatorArea.__super.__construct.call(this, a, m);
    this._dragStarted = false;
    this._oldX = 0;
    this._oldY = 0
};
IndicatorArea.prototype.onMouseMove = function(a, c) {
    var b = this._manager.getInstance();
    if (b._capturingMouseArea == this) {
        if (this._dragStarted == false) {
            if (this._oldX != a || this._oldY != c) {
                this._dragStarted = true
            }
        }
    }
    if (this._dragStarted) {
        b.hideCursor();
        b.getTimeline(this.getDataSourceName()).move(a - this._oldX);
        return this
    }
    switch (b._drawingTool) {
        case ChartManager.DrawingTool.CrossCursor:
            if (b.showCrossCursor(this, a, c)) {
                b.hideCursor()
            } else {
                b.showCursor()
            }
            break;
        default:
            b.showCursor();
            break
    }
    return this
};
IndicatorArea.prototype.onMouseLeave = function(a, b) {
    this._dragStarted = false
};
IndicatorArea.prototype.onMouseDown = function(a, c) {
    var b = this._manager.getInstance();
    b.getTimeline(this.getDataSourceName()).startMove();
    this._oldX = a;
    this._oldY = c;
    this._dragStarted = false;
    return this
};
IndicatorArea.prototype.onMouseUp = function(a, b) {
    if (this._dragStarted) {
        this._dragStarted = false;
        return this
    }
    return null
};
var MainRangeArea = create_class(ChartArea);
MainRangeArea.prototype.__construct = function(a, m) {
    MainRangeArea.__super.__construct.call(this, a, m)
};
MainRangeArea.prototype.onMouseMove = function(a, b) {
    this._manager.getInstance().showCursor();
    return this
};
var IndicatorRangeArea = create_class(ChartArea);
IndicatorRangeArea.prototype.__construct = function(a, m) {
    IndicatorRangeArea.__super.__construct.call(this, a, m)
};
IndicatorRangeArea.prototype.onMouseMove = function(a, b) {
    this._manager.getInstance().showCursor();
    return this
};
var TimelineArea = create_class(ChartArea);
TimelineArea.prototype.__construct = function(a, m) {
    TimelineArea.__super.__construct.call(this, a, m)
};
TimelineArea.prototype.onMouseMove = function(a, b) {
    this._manager.getInstance().showCursor();
    return this
};
var ChartAreaGroup = create_class(ChartArea);
ChartAreaGroup.prototype.__construct = function(a, m) {
    ChartAreaGroup.__super.__construct.call(this, a, m);
    this._areas = [];
    this._highlightedArea = null;
    this._selectedArea = null
};
ChartAreaGroup.prototype.contains = function(b, g) {
    var d;
    var c, f, e = this._areas.length;
    for (f = 0; f < e; f++) {
        c = this._areas[f];
        d = c.contains(b, g);
        if (d != null) {
            d.push(this);
            return d
        }
    }
    return ChartAreaGroup.__super.contains(b, g)
};
ChartAreaGroup.prototype.getAreaCount = function() {
    return this._areas.length
};
ChartAreaGroup.prototype.getAreaAt = function(a) {
    if (a < 0 || a >= this._areas.length) {
        return null
    }
    return this._areas[a]
};
ChartAreaGroup.prototype.addArea = function(a) {
    this._areas.push(a)
};
ChartAreaGroup.prototype.removeArea = function(c) {
    var b, a = this._areas.length;
    for (b = 0; b < a; b++) {
        if (c == this._areas[b]) {
            this._areas.splice(b);
            this.setChanged(true);
            break
        }
    }
};
ChartAreaGroup.prototype.getGridColor = function() {
    return this._gridColor
};
ChartAreaGroup.prototype.setGridColor = function(a) {
    this._gridColor = a
};
ChartAreaGroup.prototype.getHighlightedArea = function() {
    if (this._highlightedArea != null) {
        return this._highlightedArea.getHighlightedArea()
    }
    return null
};
ChartAreaGroup.prototype.highlight = function(c) {
    this._highlightedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
        d = this._areas[b].highlight(c);
        if (d != null) {
            this._highlightedArea = d;
            return this
        }
    }
    return null
};
ChartAreaGroup.prototype.getSelectedArea = function() {
    if (this._selectedArea != null) {
        return this._selectedArea.getSelectedArea()
    }
    return null
};
ChartAreaGroup.prototype.select = function(c) {
    this._selectedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
        d = this._areas[b].select(c);
        if (d != null) {
            this._selectedArea = d;
            return this
        }
    }
    return null
};
ChartAreaGroup.prototype.onMouseLeave = function(a, d) {
    var c, b = this._areas.length;
    for (c = 0; c < b; c++) {
        this._areas[c].onMouseLeave(a, d)
    }
};
ChartAreaGroup.prototype.onMouseUp = function(b, f) {
    var c, e, d = this._areas.length;
    for (e = 0; e < d; e++) {
        c = this._areas[e].onMouseUp(b, f);
        if (c != null) {
            return c
        }
    }
    return null
};
var TableLayout = create_class(ChartAreaGroup);
TableLayout.prototype.__construct = function(a, m) {
    TableLayout.__super.__construct.call(this, a, m);
    this._nextRowId = 0;
    this._focusedRowIndex = -1
};
TableLayout.prototype.getNextRowId = function() {
    return this._nextRowId++
};
TableLayout.prototype.measure = function(a, u, m) {
    this.setMeasuredDimension(u, m);
    var g, p = 0,
        H = 0;
    var x, k;
    var o = [];
    var w, v = this._areas.length;
    for (w = 0; w < v; w += 2) {
        g = this._areas[w].getHeight();
        if (g == 0) {
            if (w == 0) {
                k = (v + 1) >> 1;
                var t = (k * 2) + 5;
                var d = ((m / t) * 2) << 0;
                x = m;
                for (w = k - 1; w > 0; w--) {
                    o.unshift(d);
                    x -= d
                }
                o.unshift(x);
                break
            } else {
                if (w == 2) {
                    g = p / 3
                } else {
                    g = p
                }
            }
        }
        H += g;
        p = g;
        o.push(g)
    }
    if (H > 0) {
        var J = m / H;
        k = (v + 1) >> 1;
        x = m;
        for (w = k - 1; w > 0; w--) {
            o[w] *= J;
            x -= o[w]
        }
        o[0] = x
    }
    var G = 8;
    var z = 64;
    var b = Math.min(240, u >> 1);
    var f = z;
    var I = this._manager.getInstance();
    var e = I.getTimeline(this.getDataSourceName());
    if (e.getFirstIndex() >= 0) {
        var l = [];
        for (f = z; f < b; f += G) {
            l.push(e.calcFirstIndex(e.calcColumnCount(u - f)))
        }
        var y = e.getLastIndex();
        var q = [".main", ".secondary"];
        var s = new Array(l.length);
        var C, j;
        for (C = 0, j = 0, f = z; C < this._areas.length && j < l.length; C += 2) {
            var A = this._areas[C];
            var F = I.getPlotter(A.getName() + "Range.main");
            for (var B in q) {
                var r = I.getDataProvider(A.getName() + q[B]);
                if (r == undefined) {
                    continue
                }
                r.calcRange(l, y, s, null);
                while (j < l.length) {
                    var E = F.getRequiredWidth(a, s[j].min);
                    var D = F.getRequiredWidth(a, s[j].max);
                    if (Math.max(E, D) < f) {
                        break
                    }
                    j++;
                    f += G
                }
            }
        }
    }
    for (w = 1; w < this._areas.length; w += 2) {
        this._areas[w].measure(a, f, o[w >> 1])
    }
    var c = u - f;
    for (w = 0; w < this._areas.length; w += 2) {
        this._areas[w].measure(a, c, o[w >> 1])
    }
};
TableLayout.prototype.layout = function(g, k, l, a, d) {
    TableLayout.__super.layout.call(this, g, k, l, a, d);
    if (this._areas.length < 1) {
        return
    }
    var e;
    var c = g + this._areas[0].getMeasuredWidth();
    var m = k,
        j;
    if (!d) {
        d = this.isChanged()
    }
    var h, f = this._areas.length;
    for (h = 0; h < f; h++) {
        e = this._areas[h];
        j = m + e.getMeasuredHeight();
        e.layout(g, m, c, j, d);
        h++;
        e = this._areas[h];
        e.layout(c, m, this.getRight(), j, d);
        m = j
    }
    this.setChanged(false)
};
TableLayout.prototype.drawGrid = function(c) {
    if (this._areas.length < 1) {
        return
    }
    var d = this._manager.getInstance();
    var e = d.getTheme(this.getFrameName());
    c.fillStyle = e.getColor(Theme.Color.Grid1);
    c.fillRect(this._areas[0].getRight(), this.getTop(), 1, this.getHeight());
    var b, a = this._areas.length - 2;
    for (b = 0; b < a; b += 2) {
        c.fillRect(this.getLeft(), this._areas[b].getBottom(), this.getWidth(), 1)
    }
    if (!d.getCaptureMouseWheelDirectly()) {
        for (b = 0, a += 2; b < a; b += 2) {
            if (this._areas[b].isSelected()) {
                c.strokeStyle = e.getColor(Theme.Color.Indicator1);
                c.strokeRect(this.getLeft() + 0.5, this.getTop() + 0.5, this.getWidth() - 1, this.getHeight() - 1);
                break
            }
        }
    }
};
TableLayout.prototype.highlight = function(c) {
    this._highlightedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
        d = this._areas[b];
        if (d == c) {
            b &= ~1;
            d = this._areas[b];
            d.highlight(d);
            this._highlightedArea = d;
            b++;
            d = this._areas[b];
            d.highlight(null);
            d.highlight(d)
        } else {
            d.highlight(null)
        }
    }
    return this._highlightedArea != null ? this : null
};
TableLayout.prototype.select = function(c) {
    this._selectedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
        d = this._areas[b];
        if (d == c) {
            b &= ~1;
            d = this._areas[b];
            d.select(d);
            this._selectedArea = d;
            b++;
            d = this._areas[b];
            d.select(d)
        } else {
            d.select(null)
        }
    }
    return this._selectedArea != null ? this : null
};
TableLayout.prototype.onMouseMove = function(l, k) {
    if (this._focusedRowIndex >= 0) {
        var m = this._areas[this._focusedRowIndex];
        var e = this._areas[this._focusedRowIndex + 2];
        var f = k - this._oldY;
        if (f == 0) {
            return this
        }
        var h = this._oldUpperBottom + f;
        var g = this._oldLowerTop + f;
        if (h - m.getTop() >= 60 && e.getBottom() - g >= 60) {
            m.setBottom(h);
            e.setTop(g)
        }
        return this
    }
    var c, a = this._areas.length - 2;
    for (c = 0; c < a; c += 2) {
        var j = this._areas[c].getBottom();
        if (k >= j - 4 && k < j + 4) {
            this._manager.getInstance().showCursor("n-resize");
            return this
        }
    }
    return null
};
TableLayout.prototype.onMouseLeave = function(a, b) {
    this._focusedRowIndex = -1
};
TableLayout.prototype.onMouseDown = function(c, f) {
    var e, d = this._areas.length - 2;
    for (e = 0; e < d; e += 2) {
        var a = this._areas[e].getBottom();
        if (f >= a - 4 && f < a + 4) {
            this._focusedRowIndex = e;
            this._oldY = f;
            this._oldUpperBottom = a;
            this._oldLowerTop = this._areas[e + 2].getTop();
            return this
        }
    }
    return null
};
TableLayout.prototype.onMouseUp = function(b, e) {
    if (this._focusedRowIndex >= 0) {
        this._focusedRowIndex = -1;
        var d, c = this._areas.length;
        var a = [];
        for (d = 0; d < c; d += 2) {
            a.push(this._areas[d].getHeight())
        }
        ChartSettings.get(this._manager).charts.areaHeight = a;
        ChartSettings.save()
    }
    return this
};
var DockableLayout = create_class(ChartAreaGroup);
DockableLayout.prototype.__construct = function(a, m) {
    DockableLayout.__super.__construct.call(this, a, m)
};
DockableLayout.prototype.measure = function(c, d, a) {
    DockableLayout.__super.measure.call(this, c, d, a);
    d = this.getMeasuredWidth();
    a = this.getMeasuredHeight();
    for (var b in this._areas) {
        var e = this._areas[b];
        e.measure(c, d, a);
        switch (e.getDockStyle()) {
            case ChartArea.DockStyle.left:
            case ChartArea.DockStyle.Right:
                d -= e.getMeasuredWidth();
                break;
            case ChartArea.DockStyle.Top:
            case ChartArea.DockStyle.Bottom:
                a -= e.getMeasuredHeight();
                break;
            case ChartArea.DockStyle.Fill:
                d = 0;
                a = 0;
                break
        }
    }
};
DockableLayout.prototype.layout = function(d, g, k, a, b) {
    DockableLayout.__super.layout.call(this, d, g, k, a, b);
    d = this.getLeft();
    g = this.getTop();
    k = this.getRight();
    a = this.getBottom();
    var j, f;
    if (!b) {
        b = this.isChanged()
    }
    for (var e in this._areas) {
        var c = this._areas[e];
        switch (c.getDockStyle()) {
            case ChartArea.DockStyle.left:
                j = c.getMeasuredWidth();
                c.layout(d, g, d + j, a, b);
                d += j;
                break;
            case ChartArea.DockStyle.Top:
                f = c.getMeasuredHeight();
                c.layout(d, g, k, g + f, b);
                g += f;
                break;
            case ChartArea.DockStyle.Right:
                j = c.getMeasuredWidth();
                c.layout(k - j, g, k, a, b);
                k -= j;
                break;
            case ChartArea.DockStyle.Bottom:
                f = c.getMeasuredHeight();
                c.layout(d, a - f, k, a, b);
                a -= f;
                break;
            case ChartArea.DockStyle.Fill:
                c.layout(d, g, k, a, b);
                d = k;
                g = a;
                break
        }
    }
    this.setChanged(false)
};
DockableLayout.prototype.drawGrid = function(c) {
    var j = this._manager.getInstance();
    var e = j.getTheme(this.getFrameName());
    var d = this.getLeft();
    var g = this.getTop();
    var h = this.getRight();
    var a = this.getBottom();
    c.fillStyle = e.getColor(this._gridColor);
    for (var f in this._areas) {
        var b = this._areas[f];
        switch (b.getDockStyle()) {
            case ChartArea.DockStyle.Left:
                c.fillRect(b.getRight(), g, 1, a - g);
                d += b.getWidth();
                break;
            case ChartArea.DockStyle.Top:
                c.fillRect(d, b.getBottom(), h - d, 1);
                g += b.getHeight();
                break;
            case ChartArea.DockStyle.Right:
                c.fillRect(b.getLeft(), g, 1, a - g);
                h -= b.getWidth();
                break;
            case ChartArea.DockStyle.Bottom:
                c.fillRect(d, b.getTop(), h - d, 1);
                a -= b.getHeight();
                break
        }
    }
};
