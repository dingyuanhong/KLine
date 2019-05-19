var ExprEnv = create_class();
ExprEnv.get = function() {
    return ExprEnv.inst
};
ExprEnv.set = function(a) {
    ExprEnv.inst = a
};
ExprEnv.prototype.getDataSource = function() {
    return this._ds
};
ExprEnv.prototype.setDataSource = function(a) {
    return this._ds = a
};
ExprEnv.prototype.getFirstIndex = function() {
    return this._firstIndex
};
ExprEnv.prototype.setFirstIndex = function(a) {
    return this._firstIndex = a
};
var Expr = create_class();
Expr.prototype.__construct = function() {
    this._rid = 0
};
Expr.prototype.execute = function(a) {};
Expr.prototype.reserve = function(a, b) {};
Expr.prototype.clear = function() {};
var OpenExpr = create_class(Expr);
var HighExpr = create_class(Expr);
var LowExpr = create_class(Expr);
var CloseExpr = create_class(Expr);
var VolumeExpr = create_class(Expr);
OpenExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).open
};
HighExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).high
};
LowExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).low
};
CloseExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).close
};
VolumeExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).volume
};
var ConstExpr = create_class(Expr);
ConstExpr.prototype.__construct = function(a) {
    ConstExpr.__super.__construct.call(this);
    this._value = a
};
ConstExpr.prototype.execute = function(a) {
    return this._value
};
var ParameterExpr = create_class(Expr);
ParameterExpr.prototype.__construct = function(b, c, d, a) {
    ParameterExpr.__super.__construct.call(this);
    this._name = b;
    this._minValue = c;
    this._maxValue = d;
    this._value = this._defaultValue = a
};
ParameterExpr.prototype.execute = function(a) {
    return this._value
};
ParameterExpr.prototype.getMinValue = function() {
    return this._minValue
};
ParameterExpr.prototype.getMaxValue = function() {
    return this._maxValue
};
ParameterExpr.prototype.getDefaultValue = function() {
    return this._defaultValue
};
ParameterExpr.prototype.getValue = function() {
    return this._value
};
ParameterExpr.prototype.setValue = function(a) {
    if (a == 0) {
        this._value = 0
    } else {
        if (a < this._minValue) {
            this._value = this._minValue
        } else {
            if (a > this._maxValue) {
                this._value = this._maxValue
            } else {
                this._value = a
            }
        }
    }
};
var OpAExpr = create_class(Expr);
var OpABExpr = create_class(Expr);
var OpABCExpr = create_class(Expr);
var OpABCDExpr = create_class(Expr);
OpAExpr.prototype.__construct = function(b) {
    OpAExpr.__super.__construct.call(this);
    this._exprA = b
};
OpAExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        this._rid = a;
        this._exprA.reserve(a, b)
    }
};
OpAExpr.prototype.clear = function() {
    this._exprA.clear()
};
OpABExpr.prototype.__construct = function(d, c) {
    OpABExpr.__super.__construct.call(this);
    this._exprA = d;
    this._exprB = c
};
OpABExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        this._rid = a;
        this._exprA.reserve(a, b);
        this._exprB.reserve(a, b)
    }
};
OpABExpr.prototype.clear = function() {
    this._exprA.clear();
    this._exprB.clear()
};
OpABCExpr.prototype.__construct = function(e, d, f) {
    OpABCExpr.__super.__construct.call(this);
    this._exprA = e;
    this._exprB = d;
    this._exprC = f
};
OpABCExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        this._rid = a;
        this._exprA.reserve(a, b);
        this._exprB.reserve(a, b);
        this._exprC.reserve(a, b)
    }
};
OpABCExpr.prototype.clear = function() {
    this._exprA.clear();
    this._exprB.clear();
    this._exprC.clear()
};
OpABCDExpr.prototype.__construct = function(f, e, h, g) {
    OpABCDExpr.__super.__construct.call(this);
    this._exprA = f;
    this._exprB = e;
    this._exprC = h;
    this._exprD = g
};
OpABCDExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        this._rid = a;
        this._exprA.reserve(a, b);
        this._exprB.reserve(a, b);
        this._exprC.reserve(a, b);
        this._exprD.reserve(a, b)
    }
};
OpABCDExpr.prototype.clear = function() {
    this._exprA.clear();
    this._exprB.clear();
    this._exprC.clear();
    this._exprD.clear()
};
var NegExpr = create_class(OpAExpr);
NegExpr.prototype.__construct = function(b) {
    NegExpr.__super.__construct.call(this, b)
};
NegExpr.prototype.execute = function(a) {
    return -(this._exprA.execute(a))
};
var AddExpr = create_class(OpABExpr);
var SubExpr = create_class(OpABExpr);
var MulExpr = create_class(OpABExpr);
var DivExpr = create_class(OpABExpr);
AddExpr.prototype.__construct = function(d, c) {
    AddExpr.__super.__construct.call(this, d, c)
};
SubExpr.prototype.__construct = function(d, c) {
    SubExpr.__super.__construct.call(this, d, c)
};
MulExpr.prototype.__construct = function(d, c) {
    MulExpr.__super.__construct.call(this, d, c)
};
DivExpr.prototype.__construct = function(d, c) {
    DivExpr.__super.__construct.call(this, d, c)
};
AddExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) + this._exprB.execute(a)
};
SubExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) - this._exprB.execute(a)
};
MulExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) * this._exprB.execute(a)
};
DivExpr.prototype.execute = function(e) {
    var d = this._exprA.execute(e);
    var c = this._exprB.execute(e);
    if (d == 0) {
        return d
    }
    if (c == 0) {
        return (d > 0) ? 1000000 : -1000000
    }
    return d / c
};
var GtExpr = create_class(OpABExpr);
var GeExpr = create_class(OpABExpr);
var LtExpr = create_class(OpABExpr);
var LeExpr = create_class(OpABExpr);
var EqExpr = create_class(OpABExpr);
GtExpr.prototype.__construct = function(d, c) {
    GtExpr.__super.__construct.call(this, d, c)
};
GeExpr.prototype.__construct = function(d, c) {
    GeExpr.__super.__construct.call(this, d, c)
};
LtExpr.prototype.__construct = function(d, c) {
    LtExpr.__super.__construct.call(this, d, c)
};
LeExpr.prototype.__construct = function(d, c) {
    LeExpr.__super.__construct.call(this, d, c)
};
EqExpr.prototype.__construct = function(d, c) {
    EqExpr.__super.__construct.call(this, d, c)
};
GtExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) > this._exprB.execute(a) ? 1 : 0
};
GeExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) >= this._exprB.execute(a) ? 1 : 0
};
LtExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) < this._exprB.execute(a) ? 1 : 0
};
LeExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) <= this._exprB.execute(a) ? 1 : 0
};
EqExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) == this._exprB.execute(a) ? 1 : 0
};
var MaxExpr = create_class(OpABExpr);
MaxExpr.prototype.__construct = function(d, c) {
    MaxExpr.__super.__construct.call(this, d, c)
};
MaxExpr.prototype.execute = function(a) {
    return Math.max(this._exprA.execute(a), this._exprB.execute(a))
};
var AbsExpr = create_class(OpAExpr);
AbsExpr.prototype.__construct = function(b) {
    AbsExpr.__super.__construct.call(this, b)
};
AbsExpr.prototype.execute = function(a) {
    return Math.abs(this._exprA.execute(a))
};
var RefExpr = create_class(OpABExpr);
RefExpr.prototype.__construct = function(d, c) {
    RefExpr.__super.__construct.call(this, d, c);
    this._offset = -1
};
RefExpr.prototype.execute = function(b) {
    if (this._offset < 0) {
        this._offset = this._exprB.execute(b);
        if (this._offset < 0) {
            throw "offset < 0"
        }
    }
    b -= this._offset;
    if (b < 0) {
        throw "index < 0"
    }
    var a = this._exprA.execute(b);
    if (isNaN(a)) {
        throw "NaN"
    }
    return a
};
var AndExpr = create_class(OpABExpr);
var OrExpr = create_class(OpABExpr);
AndExpr.prototype.__construct = function(d, c) {
    AndExpr.__super.__construct.call(this, d, c)
};
OrExpr.prototype.__construct = function(d, c) {
    OrExpr.__super.__construct.call(this, d, c)
};
AndExpr.prototype.execute = function(a) {
    return (this._exprA.execute(a) != 0) && (this._exprB.execute(a) != 0) ? 1 : 0
};
OrExpr.prototype.execute = function(a) {
    return (this._exprA.execute(a) != 0) || (this._exprB.execute(a) != 0) ? 1 : 0
};
var IfExpr = create_class(OpABCExpr);
IfExpr.prototype.__construct = function(e, d, f) {
    IfExpr.__super.__construct.call(this, e, d, f)
};
IfExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) != 0 ? this._exprB.execute(a) : this._exprC.execute(a)
};
var AssignExpr = create_class(OpAExpr);
AssignExpr.prototype.__construct = function(c, b) {
    AssignExpr.__super.__construct.call(this, b);
    this._name = c;
    this._buf = []
};
AssignExpr.prototype.getName = function() {
    return this._name
};
AssignExpr.prototype.execute = function(a) {
    return this._buf[a]
};
AssignExpr.prototype.assign = function(a) {
    this._buf[a] = this._exprA.execute(a);
    if (ExprEnv.get()._firstIndex >= 0) {
        if (isNaN(this._buf[a]) && !isNaN(this._buf[a - 1])) {
            throw this._name + ".assign(" + a + "): NaN"
        }
    }
};
AssignExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        for (var d = b; d > 0; d--) {
            this._buf.push(NaN)
        }
    }
    AssignExpr.__super.reserve.call(this, a, b)
};
AssignExpr.prototype.clear = function() {
    AssignExpr.__super.clear.call(this);
    this._buf = []
};
var OutputStyle = {
    None: 0,
    Line: 1,
    VolumeStick: 2,
    MACDStick: 3,
    SARPoint: 4
};
var OutputExpr = create_class(AssignExpr);
OutputExpr.prototype.__construct = function(d, b, e, c) {
    OutputExpr.__super.__construct.call(this, d, b);
    this._style = (e === undefined) ? OutputStyle.Line : e;
    this._color = c
};
OutputExpr.prototype.getStyle = function() {
    return this._style
};
OutputExpr.prototype.getColor = function() {
    return this._color
};
var RangeOutputExpr = create_class(OutputExpr);
RangeOutputExpr.prototype.__construct = function(d, b, e, c) {
    RangeOutputExpr.__super.__construct.call(this, d, b, e, c)
};
RangeOutputExpr.prototype.getName = function() {
    return this._name + this._exprA.getRange()
};
var RangeExpr = create_class(OpABExpr);
RangeExpr.prototype.__construct = function(d, c) {
    RangeExpr.__super.__construct.call(this, d, c);
    this._range = -1;
    this._buf = []
};
RangeExpr.prototype.getRange = function() {
    return this._range
};
RangeExpr.prototype.initRange = function() {
    this._range = this._exprB.execute(0)
};
RangeExpr.prototype.execute = function(a) {
    if (this._range < 0) {
        this.initRange()
    }
    var c = this._buf[a].resultA = this._exprA.execute(a);
    var b = this._buf[a].result = this.calcResult(a, c);
    return b
};
RangeExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        for (var d = b; d > 0; d--) {
            this._buf.push({
                resultA: NaN,
                result: NaN
            })
        }
    }
    RangeExpr.__super.reserve.call(this, a, b)
};
RangeExpr.prototype.clear = function() {
    RangeExpr.__super.clear.call(this);
    this._range = -1;
    this._buf = []
};
var HhvExpr = create_class(RangeExpr);
var LlvExpr = create_class(RangeExpr);
HhvExpr.prototype.__construct = function(d, c) {
    HhvExpr.__super.__construct.call(this, d, c)
};
LlvExpr.prototype.__construct = function(d, c) {
    LlvExpr.__super.__construct.call(this, d, c)
};
HhvExpr.prototype.calcResult = function(b, h) {
    if (this._range == 0) {
        return NaN
    }
    var e = ExprEnv.get()._firstIndex;
    if (e < 0) {
        return h
    }
    if (b > e) {
        var g = this._range;
        var a = h;
        var f = b - g + 1;
        var c = Math.max(e, f);
        for (; c < b; c++) {
            var d = this._buf[c];
            if (a < d.resultA) {
                a = d.resultA
            }
        }
        return a
    } else {
        return h
    }
};
LlvExpr.prototype.calcResult = function(b, h) {
    if (this._range == 0) {
        return NaN
    }
    var e = ExprEnv.get()._firstIndex;
    if (e < 0) {
        return h
    }
    if (b > e) {
        var g = this._range;
        var a = h;
        var f = b - g + 1;
        var c = Math.max(e, f);
        for (; c < b; c++) {
            var d = this._buf[c];
            if (a > d.resultA) {
                a = d.resultA
            }
        }
        return a
    } else {
        return h
    }
};
var CountExpr = create_class(RangeExpr);
CountExpr.prototype.__construct = function(d, c) {
    CountExpr.__super.__construct.call(this, d, c)
};
CountExpr.prototype.calcResult = function(a, e) {
    if (this._range == 0) {
        return NaN
    }
    var c = ExprEnv.get()._firstIndex;
    if (c < 0) {
        return 0
    }
    if (a >= c) {
        var d = this._range - 1;
        if (d > a - c) {
            d = a - c
        }
        var b = 0;
        for (; d >= 0; d--) {
            if (this._buf[a - d].resultA != 0) {
                b++
            }
        }
        return b
    } else {
        return 0
    }
};
var SumExpr = create_class(RangeExpr);
SumExpr.prototype.__construct = function(d, c) {
    SumExpr.__super.__construct.call(this, d, c)
};
SumExpr.prototype.calcResult = function(a, d) {
    var b = ExprEnv.get()._firstIndex;
    if (b < 0) {
        return d
    }
    if (a > b) {
        var c = this._range;
        if (c == 0 || c >= a + 1 - b) {
            return this._buf[a - 1].result + d
        }
        return this._buf[a - 1].result + d - this._buf[a - c].resultA
    } else {
        return d
    }
};
var StdExpr = create_class(RangeExpr);
StdExpr.prototype.__construct = function(d, c) {
    StdExpr.__super.__construct.call(this, d, c)
};
StdExpr.prototype.calcResult = function(b, g) {
    if (this._range == 0) {
        return NaN
    }
    var a = this._stdBuf[b];
    var e = ExprEnv.get()._firstIndex;
    if (e < 0) {
        a.resultMA = g;
        return 0
    }
    if (b > e) {
        var f = this._range;
        if (f >= b + 1 - e) {
            f = b + 1 - e;
            a.resultMA = this._stdBuf[b - 1].resultMA * (1 - 1 / f) + (g / f)
        } else {
            a.resultMA = this._stdBuf[b - 1].resultMA + (g - this._buf[b - f].resultA) / f
        }
        var d = 0;
        for (var c = b - f + 1; c <= b; c++) {
            d += Math.pow(this._buf[c].resultA - a.resultMA, 2)
        }
        return Math.sqrt(d / f)
    }
    a.resultMA = g;
    return 0
};
StdExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        for (var d = b; d > 0; d--) {
            this._stdBuf.push({
                resultMA: NaN
            })
        }
    }
    StdExpr.__super.reserve.call(this, a, b)
};
StdExpr.prototype.clear = function() {
    StdExpr.__super.clear.call(this);
    this._stdBuf = []
};
var MaExpr = create_class(RangeExpr);
MaExpr.prototype.__construct = function(d, c) {
    MaExpr.__super.__construct.call(this, d, c)
};
MaExpr.prototype.calcResult = function(a, d) {
    if (this._range == 0) {
        return NaN
    }
    var b = ExprEnv.get()._firstIndex;
    if (b < 0) {
        return d
    }
    if (a > b) {
        var c = this._range;
        if (c >= a + 1 - b) {
            c = a + 1 - b;
            return this._buf[a - 1].result * (1 - 1 / c) + (d / c)
        }
        return this._buf[a - 1].result + (d - this._buf[a - c].resultA) / c
    } else {
        return d
    }
};
var EmaExpr = create_class(RangeExpr);
EmaExpr.prototype.__construct = function(d, c) {
    EmaExpr.__super.__construct.call(this, d, c)
};
EmaExpr.prototype.initRange = function() {
    EmaExpr.__super.initRange.call(this);
    this._alpha = 2 / (this._range + 1)
};
EmaExpr.prototype.calcResult = function(a, d) {
    if (this._range == 0) {
        return NaN
    }
    var c = ExprEnv.get()._firstIndex;
    if (c < 0) {
        return d
    }
    if (a > c) {
        var b = this._buf[a - 1];
        return this._alpha * (d - b.result) + b.result
    }
    return d
};
var ExpmemaExpr = create_class(EmaExpr);
ExpmemaExpr.prototype.__construct = function(d, c) {
    ExpmemaExpr.__super.__construct.call(this, d, c)
};
ExpmemaExpr.prototype.calcResult = function(a, e) {
    var c = ExprEnv.get()._firstIndex;
    if (c < 0) {
        return e
    }
    if (a > c) {
        var d = this._range;
        var b = this._buf[a - 1];
        if (d >= a + 1 - c) {
            d = a + 1 - c;
            return b.result * (1 - 1 / d) + (e / d)
        }
        return this._alpha * (e - b.result) + b.result
    }
    return e
};
var SmaExpr = create_class(RangeExpr);
SmaExpr.prototype.__construct = function(e, d, f) {
    SmaExpr.__super.__construct.call(this, e, d);
    this._exprC = f;
    this._mul
};
SmaExpr.prototype.initRange = function() {
    SmaExpr.__super.initRange.call(this);
    this._mul = this._exprC.execute(0)
};
SmaExpr.prototype.calcResult = function(a, d) {
    if (this._range == 0) {
        return NaN
    }
    var b = ExprEnv.get()._firstIndex;
    if (b < 0) {
        return d
    }
    if (a > b) {
        var c = this._range;
        if (c > a + 1 - b) {
            c = a + 1 - b
        }
        return ((c - 1) * this._buf[a - 1].result + d * this._mul) / c
    }
    return d
};
var SarExpr = create_class(OpABCDExpr);
SarExpr.prototype.__construct = function(f, e, h, g) {
    SarExpr.__super.__construct.call(this, f, e, h, g);
    this._buf = [];
    this._range = -1;
    this._min;
    this._step;
    this._max
};
SarExpr.prototype.execute = function(j) {
    if (this._range < 0) {
        this._range = this._exprA.execute(0);
        this._min = this._exprB.execute(0) / 100;
        this._step = this._exprC.execute(0) / 100;
        this._max = this._exprD.execute(0) / 100
    }
    var d = this._buf[j];
    var m = ExprEnv.get();
    var g = m._firstIndex;
    if (g < 0) {
        d.longPos = true;
        d.sar = m._ds.getDataAt(j).low;
        d.ep = m._ds.getDataAt(j).high;
        d.af = 0.02
    } else {
        var c = m._ds.getDataAt(j).high;
        var k = m._ds.getDataAt(j).low;
        var b = this._buf[j - 1];
        d.sar = b.sar + b.af * (b.ep - b.sar);
        if (b.longPos) {
            d.longPos = true;
            if (c > b.ep) {
                d.ep = c;
                d.af = Math.min(b.af + this._step, this._max)
            } else {
                d.ep = b.ep;
                d.af = b.af
            }
            if (d.sar > k) {
                d.longPos = false;
                var e = j - this._range + 1;
                for (e = Math.max(e, g); e < j; e++) {
                    var f = m._ds.getDataAt(e).high;
                    if (c < f) {
                        c = f
                    }
                }
                d.sar = c;
                d.ep = k;
                d.af = 0.02
            }
        } else {
            d.longPos = false;
            if (k < b.ep) {
                d.ep = k;
                d.af = Math.min(b.af + this._step, this._max)
            } else {
                d.ep = b.ep;
                d.af = b.af
            }
            if (d.sar < c) {
                d.longPos = true;
                var e = j - this._range + 1;
                for (e = Math.max(e, g); e < j; e++) {
                    var a = m._ds.getDataAt(e).low;
                    if (k > a) {
                        k = a
                    }
                }
                d.sar = k;
                d.ep = c;
                d.af = 0.02
            }
        }
    }
    return d.sar
};
SarExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
        for (var d = b; d > 0; d--) {
            this._buf.push({
                longPos: true,
                sar: NaN,
                ep: NaN,
                af: NaN
            })
        }
    }
    SarExpr.__super.reserve.call(this, a, b)
};
SarExpr.prototype.clear = function() {
    SarExpr.__super.clear.call(this);
    this._range = -1
};