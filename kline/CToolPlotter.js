var CToolPlotter = create_class(NamedObject);
CToolPlotter.prototype.__construct = function(a, d, m) {
    CToolPlotter.__super.__construct.call(this, a);
    this._manager = m;
    this.toolObject = d;
    var c = this._manager.getInstance();
    var b = c.getArea("frame0.k0.main");
    if (b == null) {
        this.areaPos = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        return
    }
    this.areaPos = {
        left: b.getLeft(),
        top: b.getTop(),
        right: b.getRight(),
        bottom: b.getBottom()
    };
    this.crossPt = {};
    this.normalSize = 4;
    this.selectedSize = 6;
    this.cursorLen = 4;
    this.cursorGapLen = 3;
    this.theme = this._manager.getInstance().getTheme(this.getFrameName())
};
CToolPlotter.prototype.drawCursor = function(a) {
    this.drawCrossCursor(a)
};
CToolPlotter.prototype.drawCrossCursor = function(e) {
    e.strokeStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    e.fillStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    var d = this.toolObject.getPoint(0).getPosXY();
    if (d == null) {
        return
    }
    var c = d.x;
    var f = d.y;
    var b = this.cursorLen;
    var a = this.cursorGapLen;
    e.fillRect(c, f, 1, 1);
    Plotter.drawLine(e, c - b - a, f, c - a, f);
    Plotter.drawLine(e, c + b + a, f, c + a, f);
    Plotter.drawLine(e, c, f - b - a, c, f - a);
    Plotter.drawLine(e, c, f + b + a, c, f + a)
};
CToolPlotter.prototype.drawCircle = function(c, b, a) {
    var e = b.x;
    var d = b.y;
    c.beginPath();
    c.arc(e, d, a, 0, 2 * Math.PI, false);
    c.fillStyle = this.theme.getColor(Theme.Color.CircleColorFill);
    c.fill();
    c.stroke()
};
CToolPlotter.prototype.drawCtrlPt = function(b) {
    b.strokeStyle = this.theme.getColor(Theme.Color.CircleColorStroke);
    for (var a = 0; a < this.ctrlPtsNum; a++) {
        this.drawCircle(b, this.ctrlPts[1][a], this.normalSize)
    }
};
CToolPlotter.prototype.highlightCtrlPt = function(b) {
    b.strokeStyle = this.theme.getColor(Theme.Color.CircleColorStroke);
    for (var a = 0; a < this.ctrlPtsNum; a++) {
        if (this.toolObject.getPoint(a).getState() == CPoint.state.Highlight) {
            this.drawCircle(b, this.ctrlPts[1][a], this.selectedSize)
        }
    }
};
CToolPlotter.prototype.drawFibRayLines = function(d, g, c) {
    for (var b = 0; b < this.fiboFansSequence.length; b++) {
        var a = g.y + (100 - this.fiboFansSequence[b]) / 100 * (c.y - g.y);
        var f = {
            x: g.x,
            y: g.y
        };
        var e = {
            x: c.x,
            y: a
        };
        this.drawRayLines(d, f, e)
    }
};
CToolPlotter.prototype.drawRayLines = function(c, g, b) {
    this.getAreaPos();
    var e = {
        x: g.x,
        y: g.y
    };
    var d = {
        x: b.x,
        y: b.y
    };
    var f = getRectCrossPt(this.areaPos, e, d);
    var a;
    if (b.x == g.x) {
        if (b.y == g.y) {
            a = b
        } else {
            a = b.y > g.y ? {
                x: f[1].x,
                y: f[1].y
            } : {
                x: f[0].x,
                y: f[0].y
            }
        }
    } else {
        a = b.x > g.x ? {
            x: f[1].x,
            y: f[1].y
        } : {
            x: f[0].x,
            y: f[0].y
        }
    }
    Plotter.drawLine(c, g.x, g.y, a.x, a.y)
};
CToolPlotter.prototype.lenBetweenPts = function(b, a) {
    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
};
CToolPlotter.prototype.getCtrlPts = function() {
    for (var a = 0; a < this.ctrlPtsNum; a++) {
        this.ctrlPts[0][a] = this.toolObject.getPoint(a)
    }
};
CToolPlotter.prototype.updateCtrlPtPos = function() {
    for (var a = 0; a < this.ctrlPtsNum; a++) {
        this.ctrlPts[1][a] = this.ctrlPts[0][a].getPosXY()
    }
};
CToolPlotter.prototype.getAreaPos = function() {
    var b = this._manager.getInstance();
    var a = b.getArea("frame0.k0.main");
    if (a == null) {
        this.areaPos = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        return
    }
    this.areaPos = {
        left: Math.floor(a.getLeft()),
        top: Math.floor(a.getTop()),
        right: Math.floor(a.getRight()),
        bottom: Math.floor(a.getBottom())
    }
};
CToolPlotter.prototype.updateDraw = function(a) {
    a.strokeStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    this.draw(a);
    this.drawCtrlPt(a)
};
CToolPlotter.prototype.finishDraw = function(a) {
    a.strokeStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    this.draw(a)
};
CToolPlotter.prototype.highlight = function(a) {
    a.strokeStyle = this.theme.getColor(Theme.Color.LineColorSelected);
    this.draw(a);
    this.drawCtrlPt(a);
    this.highlightCtrlPt(a)
};
var DrawStraightLinesPlotter = create_class(CToolPlotter);
DrawStraightLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawStraightLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawStraightLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        Plotter.drawLine(a, this.areaPos.left, this.startPoint.y, this.areaPos.right, this.startPoint.y)
    } else {
        this.crossPt = getRectCrossPt(this.areaPos, this.startPoint, this.endPoint);
        Plotter.drawLine(a, this.crossPt[0].x, this.crossPt[0].y, this.crossPt[1].x, this.crossPt[1].y)
    }
};
var DrawSegLinesPlotter = create_class(CToolPlotter);
DrawSegLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawSegLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawSegLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        this.endPoint.x += 1
    }
    Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y)
};
var DrawRayLinesPlotter = create_class(CToolPlotter);
DrawRayLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawRayLinesPlotter.__super.__construct.call(this, a,m);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawRayLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        this.endPoint.x += 1
    }
    this.drawRayLines(a, this.startPoint, this.endPoint)
};
var DrawArrowLinesPlotter = create_class(CToolPlotter);
DrawArrowLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawArrowLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.arrowSizeRatio = 0.03;
    this.arrowSize = 4;
    this.crossPt = {
        x: -1,
        y: -1
    };
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawArrowLinesPlotter.prototype.drawArrow = function(c, b, f) {
    var d = this.lenBetweenPts(b, f);
    var i = [f.x - b.x, f.y - b.y];
    this.crossPt.x = b.x + (1 - this.arrowSize / d) * i[0];
    this.crossPt.y = b.y + (1 - this.arrowSize / d) * i[1];
    var h = [-i[1], i[0]];
    var a = {
        x: h[0],
        y: h[1]
    };
    var g = {
        x: 0,
        y: 0
    };
    h[0] = this.arrowSize * a.x / this.lenBetweenPts(a, g);
    h[1] = this.arrowSize * a.y / this.lenBetweenPts(a, g);
    var e = [this.crossPt.x + h[0], this.crossPt.y + h[1]];
    Plotter.drawLine(c, f.x, f.y, e[0], e[1]);
    e = [this.crossPt.x - h[0], this.crossPt.y - h[1]];
    Plotter.drawLine(c, f.x, f.y, e[0], e[1])
};
DrawArrowLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        this.endPoint.x += 1
    }
    Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    this.drawArrow(a, this.startPoint, this.endPoint)
};
var DrawHoriStraightLinesPlotter = create_class(CToolPlotter);
DrawHoriStraightLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawHoriStraightLinesPlotter.__super.__construct.call(this, a,m);
    this.toolObject = b;
    this.ctrlPtsNum = 1;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawHoriStraightLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    Plotter.drawLine(a, this.areaPos.left, this.startPoint.y, this.areaPos.right, this.startPoint.y)
};
var DrawHoriRayLinesPlotter = create_class(CToolPlotter);
DrawHoriRayLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawHoriRayLinesPlotter.__super.__construct.call(this, a,m);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawHoriRayLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x) {
        Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.areaPos.right, this.startPoint.y)
    } else {
        var b = {
            x: this.endPoint.x,
            y: this.startPoint.y
        };
        this.drawRayLines(a, this.startPoint, b)
    }
};
var DrawHoriSegLinesPlotter = create_class(CToolPlotter);
DrawHoriSegLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawHoriSegLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawHoriSegLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    this.endPoint.y = this.startPoint.y;
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x + 1, this.startPoint.y)
    } else {
        Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.startPoint.y)
    }
};
var DrawVertiStraightLinesPlotter = create_class(CToolPlotter);
DrawVertiStraightLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawVertiStraightLinesPlotter.__super.__construct.call(this, a,m);
    this.toolObject = b;
    this.ctrlPtsNum = 1;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawVertiStraightLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    Plotter.drawLine(a, this.startPoint.x, this.areaPos.top, this.startPoint.x, this.areaPos.bottom)
};
var DrawPriceLinesPlotter = create_class(CToolPlotter);
DrawPriceLinesPlotter.prototype.__construct = function(a, b) {
    DrawPriceLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 1;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawPriceLinesPlotter.prototype.draw = function(a) {
    a.font = "12px Tahoma";
    a.textAlign = "left";
    a.fillStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    var b = this.ctrlPts[0][0].getPosIV().v;
    Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.areaPos.right, this.startPoint.y);
    a.fillText(b.toFixed(2), this.startPoint.x + 2, this.startPoint.y - 15)
};
var ParallelLinesPlotter = create_class(CToolPlotter);
ParallelLinesPlotter.prototype.__construct = function(a, b,m) {
    ParallelLinesPlotter.__super.__construct.call(this, a,m);
    this.toolObject = b
};
ParallelLinesPlotter.prototype.getParaPt = function() {
    var b = [];
    b[0] = this.endPoint.x - this.startPoint.x;
    b[1] = this.endPoint.y - this.startPoint.y;
    var a = [];
    a[0] = this.paraStartPoint.x - this.startPoint.x;
    a[1] = this.paraStartPoint.y - this.startPoint.y;
    this.paraEndPoint = {
        x: -1,
        y: -1
    };
    this.paraEndPoint.x = b[0] + a[0] + this.startPoint.x;
    this.paraEndPoint.y = b[1] + a[1] + this.startPoint.y
};
var DrawBiParallelLinesPlotter = create_class(ParallelLinesPlotter);
DrawBiParallelLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawBiParallelLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.ctrlPtsNum = 3;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawBiParallelLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.paraStartPoint = this.ctrlPts[1][1];
    this.endPoint = this.ctrlPts[1][2];
    this.getParaPt();
    this.getAreaPos();
    this.crossPt0 = getRectCrossPt(this.areaPos, this.startPoint, this.endPoint);
    Plotter.drawLine(a, this.crossPt0[0].x, this.crossPt0[0].y, this.crossPt0[1].x, this.crossPt0[1].y);
    this.crossPt1 = getRectCrossPt(this.areaPos, this.paraStartPoint, this.paraEndPoint);
    Plotter.drawLine(a, this.crossPt1[0].x, this.crossPt1[0].y, this.crossPt1[1].x, this.crossPt1[1].y)
};
var DrawBiParallelRayLinesPlotter = create_class(ParallelLinesPlotter);
DrawBiParallelRayLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawBiParallelRayLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.ctrlPtsNum = 3;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawBiParallelRayLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.paraStartPoint = this.ctrlPts[1][1];
    this.endPoint = this.ctrlPts[1][2];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        this.endPoint.x += 1
    }
    this.getParaPt();
    this.drawRayLines(a, this.startPoint, this.endPoint);
    this.drawRayLines(a, this.paraStartPoint, this.paraEndPoint)
};
var DrawTriParallelLinesPlotter = create_class(ParallelLinesPlotter);
DrawTriParallelLinesPlotter.prototype.__construct = function(a, b,m) {
    DrawTriParallelLinesPlotter.__super.__construct.call(this, a, b,m);
    this.toolObject = b;
    this.ctrlPtsNum = 3;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawTriParallelLinesPlotter.prototype.draw = function(c) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.paraStartPoint = this.ctrlPts[1][1];
    this.endPoint = this.ctrlPts[1][2];
    var b = [];
    b[0] = this.endPoint.x - this.startPoint.x;
    b[1] = this.endPoint.y - this.startPoint.y;
    var a = [];
    a[0] = this.paraStartPoint.x - this.startPoint.x;
    a[1] = this.paraStartPoint.y - this.startPoint.y;
    this.para1EndPoint = {
        x: -1,
        y: -1
    };
    this.para2EndPoint = {
        x: -1,
        y: -1
    };
    this.para2StartPoint = {
        x: -1,
        y: -1
    };
    this.para1EndPoint.x = b[0] + a[0] + this.startPoint.x;
    this.para1EndPoint.y = b[1] + a[1] + this.startPoint.y;
    this.para2StartPoint.x = this.startPoint.x - a[0];
    this.para2StartPoint.y = this.startPoint.y - a[1];
    this.para2EndPoint.x = this.endPoint.x - a[0];
    this.para2EndPoint.y = this.endPoint.y - a[1];
    this.getAreaPos();
    this.crossPt0 = getRectCrossPt(this.areaPos, this.startPoint, this.endPoint);
    Plotter.drawLine(c, this.crossPt0[0].x, this.crossPt0[0].y, this.crossPt0[1].x, this.crossPt0[1].y);
    this.crossPt1 = getRectCrossPt(this.areaPos, this.paraStartPoint, this.para1EndPoint);
    Plotter.drawLine(c, this.crossPt1[0].x, this.crossPt1[0].y, this.crossPt1[1].x, this.crossPt1[1].y);
    this.crossPt2 = getRectCrossPt(this.areaPos, this.para2StartPoint, this.para2EndPoint);
    Plotter.drawLine(c, this.crossPt2[0].x, this.crossPt2[0].y, this.crossPt2[1].x, this.crossPt2[1].y)
};
var BandLinesPlotter = create_class(CToolPlotter);
BandLinesPlotter.prototype.__construct = function(a, b, m) {
    BandLinesPlotter.__super.__construct.call(this, a, m);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
BandLinesPlotter.prototype.drawLinesAndInfo = function(d, f, c) {
    d.font = "12px Tahoma";
    d.textAlign = "left";
    d.fillStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    var g;
    if (this.toolObject.state == CToolObject.state.Draw) {
        this.startPtValue = this.toolObject.getPoint(0).getPosIV().v;
        this.endPtValue = this.toolObject.getPoint(1).getPosIV().v
    }
    this.getAreaPos();
    for (var b = 0; b < this.fiboSequence.length; b++) {
        var a = f.y + (100 - this.fiboSequence[b]) / 100 * (c.y - f.y);
        if (a > this.areaPos.bottom) {
            continue
        }
        var e = this.startPtValue + (100 - this.fiboSequence[b]) / 100 * (this.endPtValue - this.startPtValue);
        Plotter.drawLine(d, this.areaPos.left, a, this.areaPos.right, a);
        g = this.fiboSequence[b].toFixed(1) + "% " + e.toFixed(1);
        d.fillText(g, this.areaPos.left + 2, a - 15)
    }
};
BandLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    this.drawLinesAndInfo(a, this.startPoint, this.endPoint)
};
var DrawFibRetracePlotter = create_class(BandLinesPlotter);
DrawFibRetracePlotter.prototype.__construct = function(a, b) {
    DrawFibRetracePlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.fiboSequence = [100, 78.6, 61.8, 50, 38.2, 23.6, 0]
};
var DrawBandLinesPlotter = create_class(BandLinesPlotter);
DrawBandLinesPlotter.prototype.__construct = function(a, b, m) {
    DrawBandLinesPlotter.__super.__construct.call(this, a, b, m);
    this.toolObject = b;
    this.fiboSequence = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100]
};
var DrawFibFansPlotter = create_class(CToolPlotter);
DrawFibFansPlotter.prototype.__construct = function(a, b,m) {
    DrawFibFansPlotter.__super.__construct.call(this, a,m);
    this.toolObject = b;
    this.fiboFansSequence = [0, 38.2, 50, 61.8];
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts()
};
DrawFibFansPlotter.prototype.drawLinesAndInfo = function(b, c, a) {
    this.drawFibRayLines(b, c, a)
};
DrawFibFansPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
        this.endPoint.x += 1
    }
    this.drawLinesAndInfo(a, this.startPoint, this.endPoint)
};
var CDynamicLinePlotter = create_class(NamedObject);
CDynamicLinePlotter.prototype.__construct = function(a, m) {
    CDynamicLinePlotter.__super.__construct.call(this, a);
    this._manager = m;
    this.flag = true;
    this.context = this._manager.getInstance()._overlayContext
};
CDynamicLinePlotter.prototype.getAreaPos = function() {
    var b = this._manager.getInstance();
    var a = b.getArea("frame0.k0.main");
    if (a == null) {
        this.areaPos = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        return
    }
    this.areaPos = {
        left: Math.floor(a.getLeft()),
        top: Math.floor(a.getTop()),
        right: Math.floor(a.getRight()),
        bottom: Math.floor(a.getBottom())
    }
};
CDynamicLinePlotter.prototype.Draw = function(b) {
    this.getAreaPos();
    var g = this._manager.getInstance();
    var h = g.getDataSource(this.getDataSourceName());
    if (h == null || !is_instance(h, MainDataSource)) {
        return
    }
    this.context.save();
    this.context.rect(this.areaPos.left, this.areaPos.top, this.areaPos.right - this.areaPos.left, this.areaPos.bottom - this.areaPos.top);
    this.context.clip();
    var c = h.getToolObjectCount();
    for (var a = 0; a < c; a++) {
        var f = h.getToolObject(a);
        var e = f.getState();
        switch (e) {
            case CToolObject.state.BeforeDraw:
                f.getPlotter().theme = this._manager.getInstance().getTheme(this.getFrameName());
                f.getPlotter().drawCursor(this.context);
                break;
            case CToolObject.state.Draw:
                f.getPlotter().theme = this._manager.getInstance().getTheme(this.getFrameName());
                f.getPlotter().updateDraw(this.context);
                break;
            case CToolObject.state.AfterDraw:
                f.getPlotter().theme = this._manager.getInstance().getTheme(this.getFrameName());
                f.getPlotter().finishDraw(this.context);
                break;
            default:
                break
        }
    }
    var d = h.getSelectToolObjcet();
    if (d != null && d != CToolObject.state.Draw) {
        d.getPlotter().highlight(this.context)
    }
    this.context.restore();
    return
};