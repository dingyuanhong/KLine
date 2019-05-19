var Indicator = create_class();
Indicator.prototype.__construct = function() {
    this._exprEnv = new ExprEnv();
    this._rid = 0;
    this._params = [];
    this._assigns = [];
    this._outputs = []
};
Indicator.prototype.addParameter = function(a) {
    this._params.push(a)
};
Indicator.prototype.addAssign = function(a) {
    this._assigns.push(a)
};
Indicator.prototype.addOutput = function(a) {
    this._outputs.push(a)
};
Indicator.prototype.getParameterCount = function() {
    return this._params.length
};
Indicator.prototype.getParameterAt = function(a) {
    return this._params[a]
};
Indicator.prototype.getOutputCount = function() {
    return this._outputs.length
};
Indicator.prototype.getOutputAt = function(a) {
    return this._outputs[a]
};
Indicator.prototype.clear = function() {
    this._exprEnv.setFirstIndex(-1);
    var b, a;
    a = this._assigns.length;
    for (b = 0; b < a; b++) {
        this._assigns[b].clear()
    }
    a = this._outputs.length;
    for (b = 0; b < a; b++) {
        this._outputs[b].clear()
    }
};
Indicator.prototype.reserve = function(c) {
    this._rid++;
    var b, a;
    a = this._assigns.length;
    for (b = 0; b < a; b++) {
        this._assigns[b].reserve(this._rid, c)
    }
    a = this._outputs.length;
    for (b = 0; b < a; b++) {
        this._outputs[b].reserve(this._rid, c)
    }
};
Indicator.prototype.execute = function(d, a) {
    if (a < 0) {
        return
    }
    this._exprEnv.setDataSource(d);
    ExprEnv.set(this._exprEnv);
    try {
        var c, b;
        b = this._assigns.length;
        for (c = 0; c < b; c++) {
            this._assigns[c].assign(a)
        }
        b = this._outputs.length;
        for (c = 0; c < b; c++) {
            this._outputs[c].assign(a)
        }
        if (this._exprEnv.getFirstIndex() < 0) {
            this._exprEnv.setFirstIndex(a)
        }
    } catch (f) {
        if (this._exprEnv.getFirstIndex() >= 0) {
            alert(f);
            throw f
        }
    }
};
Indicator.prototype.getParameters = function() {
    var c = [];
    var b, a = this._params.length;
    for (b = 0; b < a; b++) {
        c.push(this._params[b].getValue())
    }
    return c
};
Indicator.prototype.setParameters = function(b) {
    if ((b instanceof Array) && b.length == this._params.length) {
        for (var a in this._params) {
            this._params[a].setValue(b[a])
        }
    }
};
var HLCIndicator = create_class(Indicator);
HLCIndicator.prototype.__construct = function() {
    HLCIndicator.__super.__construct.call(this);
    var a = new ParameterExpr("M1", 2, 1000, 60);
    this.addParameter(a);
    this.addOutput(new OutputExpr("HIGH", new HighExpr(), OutputStyle.None));
    this.addOutput(new OutputExpr("LOW", new LowExpr(), OutputStyle.None));
    this.addOutput(new OutputExpr("CLOSE", new CloseExpr(), OutputStyle.Line, Theme.Color.Indicator0));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), a), OutputStyle.Line, Theme.Color.Indicator1))
};
HLCIndicator.prototype.getName = function() {
    return "CLOSE"
};
var MAIndicator = create_class(Indicator);
MAIndicator.prototype.__construct = function() {
    MAIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("M1", 2, 1000, 7);
    var e = new ParameterExpr("M2", 2, 1000, 30);
    var d = new ParameterExpr("M3", 2, 1000, 0);
    var c = new ParameterExpr("M4", 2, 1000, 0);
    var b = new ParameterExpr("M5", 2, 1000, 0);
    var a = new ParameterExpr("M6", 2, 1000, 0);
    this.addParameter(f);
    this.addParameter(e);
    this.addParameter(d);
    this.addParameter(c);
    this.addParameter(b);
    this.addParameter(a);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), f)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), e)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), d)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), c)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), b)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), a)))
};
MAIndicator.prototype.getName = function() {
    return "MA"
};
var EMAIndicator = create_class(Indicator);
EMAIndicator.prototype.__construct = function() {
    EMAIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("M1", 2, 1000, 7);
    var e = new ParameterExpr("M2", 2, 1000, 30);
    var d = new ParameterExpr("M3", 2, 1000, 0);
    var c = new ParameterExpr("M4", 2, 1000, 0);
    var b = new ParameterExpr("M5", 2, 1000, 0);
    var a = new ParameterExpr("M6", 2, 1000, 0);
    this.addParameter(f);
    this.addParameter(e);
    this.addParameter(d);
    this.addParameter(c);
    this.addParameter(b);
    this.addParameter(a);
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), f)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), e)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), d)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), c)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), b)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), a)))
};
EMAIndicator.prototype.getName = function() {
    return "EMA"
};
var VOLUMEIndicator = create_class(Indicator);
VOLUMEIndicator.prototype.__construct = function() {
    VOLUMEIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("M1", 2, 500, 5);
    var a = new ParameterExpr("M2", 2, 500, 10);
    this.addParameter(c);
    this.addParameter(a);
    var b = new OutputExpr("VOLUME", new VolumeExpr(), OutputStyle.VolumeStick, Theme.Color.Text4);
    this.addOutput(b);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(b, c), OutputStyle.Line, Theme.Color.Indicator0));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(b, a), OutputStyle.Line, Theme.Color.Indicator1))
};
VOLUMEIndicator.prototype.getName = function() {
    return "VOLUME"
};
var MACDIndicator = create_class(Indicator);
MACDIndicator.prototype.__construct = function() {
    MACDIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("SHORT", 2, 200, 12);
    var d = new ParameterExpr("LONG", 2, 200, 26);
    var a = new ParameterExpr("MID", 2, 200, 9);
    this.addParameter(c);
    this.addParameter(d);
    this.addParameter(a);
    var b = new OutputExpr("DIF", new SubExpr(new EmaExpr(new CloseExpr(), c), new EmaExpr(new CloseExpr(), d)));
    this.addOutput(b);
    var f = new OutputExpr("DEA", new EmaExpr(b, a));
    this.addOutput(f);
    var e = new OutputExpr("MACD", new MulExpr(new SubExpr(b, f), new ConstExpr(2)), OutputStyle.MACDStick);
    this.addOutput(e)
};
MACDIndicator.prototype.getName = function() {
    return "MACD"
};
var DMIIndicator = create_class(Indicator);
DMIIndicator.prototype.__construct = function() {
    DMIIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N", 2, 90, 14);
    var h = new ParameterExpr("MM", 2, 60, 6);
    this.addParameter(c);
    this.addParameter(h);
    var j = new AssignExpr("MTR", new ExpmemaExpr(new MaxExpr(new MaxExpr(new SubExpr(new HighExpr(), new LowExpr()), new AbsExpr(new SubExpr(new HighExpr(), new RefExpr(new CloseExpr(), new ConstExpr(1))))), new AbsExpr(new SubExpr(new RefExpr(new CloseExpr(), new ConstExpr(1)), new LowExpr()))), c));
    this.addAssign(j);
    var k = new AssignExpr("HD", new SubExpr(new HighExpr(), new RefExpr(new HighExpr(), new ConstExpr(1))));
    this.addAssign(k);
    var d = new AssignExpr("LD", new SubExpr(new RefExpr(new LowExpr(), new ConstExpr(1)), new LowExpr()));
    this.addAssign(d);
    var a = new AssignExpr("DMP", new ExpmemaExpr(new IfExpr(new AndExpr(new GtExpr(k, new ConstExpr(0)), new GtExpr(k, d)), k, new ConstExpr(0)), c));
    this.addAssign(a);
    var g = new AssignExpr("DMM", new ExpmemaExpr(new IfExpr(new AndExpr(new GtExpr(d, new ConstExpr(0)), new GtExpr(d, k)), d, new ConstExpr(0)), c));
    this.addAssign(g);
    var b = new OutputExpr("PDI", new MulExpr(new DivExpr(a, j), new ConstExpr(100)));
    this.addOutput(b);
    var i = new OutputExpr("MDI", new MulExpr(new DivExpr(g, j), new ConstExpr(100)));
    this.addOutput(i);
    var f = new OutputExpr("ADX", new ExpmemaExpr(new MulExpr(new DivExpr(new AbsExpr(new SubExpr(i, b)), new AddExpr(i, b)), new ConstExpr(100)), h));
    this.addOutput(f);
    var e = new OutputExpr("ADXR", new ExpmemaExpr(f, h));
    this.addOutput(e)
};
DMIIndicator.prototype.getName = function() {
    return "DMI"
};
var DMAIndicator = create_class(Indicator);
DMAIndicator.prototype.__construct = function() {
    DMAIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N1", 2, 60, 10);
    var b = new ParameterExpr("N2", 2, 250, 50);
    var e = new ParameterExpr("M", 2, 100, 10);
    this.addParameter(c);
    this.addParameter(b);
    this.addParameter(e);
    var a = new OutputExpr("DIF", new SubExpr(new MaExpr(new CloseExpr(), c), new MaExpr(new CloseExpr(), b)));
    this.addOutput(a);
    var d = new OutputExpr("DIFMA", new MaExpr(a, e));
    this.addOutput(d)
};
DMAIndicator.prototype.getName = function() {
    return "DMA"
};
var TRIXIndicator = create_class(Indicator);
TRIXIndicator.prototype.__construct = function() {
    TRIXIndicator.__super.__construct.call(this);
    var d = new ParameterExpr("N", 2, 100, 12);
    var e = new ParameterExpr("M", 2, 100, 9);
    this.addParameter(d);
    this.addParameter(e);
    var c = new AssignExpr("MTR", new EmaExpr(new EmaExpr(new EmaExpr(new CloseExpr(), d), d), d));
    this.addAssign(c);
    var b = new OutputExpr("TRIX", new MulExpr(new DivExpr(new SubExpr(c, new RefExpr(c, new ConstExpr(1))), new RefExpr(c, new ConstExpr(1))), new ConstExpr(100)));
    this.addOutput(b);
    var a = new OutputExpr("MATRIX", new MaExpr(b, e));
    this.addOutput(a)
};
TRIXIndicator.prototype.getName = function() {
    return "TRIX"
};
var BRARIndicator = create_class(Indicator);
BRARIndicator.prototype.__construct = function() {
    BRARIndicator.__super.__construct.call(this);
    var d = new ParameterExpr("N", 2, 120, 26);
    this.addParameter(d);
    var c = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(c);
    var b = new OutputExpr("BR", new MulExpr(new DivExpr(new SumExpr(new MaxExpr(new ConstExpr(0), new SubExpr(new HighExpr(), c)), d), new SumExpr(new MaxExpr(new ConstExpr(0), new SubExpr(c, new LowExpr())), d)), new ConstExpr(100)));
    this.addOutput(b);
    var a = new OutputExpr("AR", new MulExpr(new DivExpr(new SumExpr(new SubExpr(new HighExpr(), new OpenExpr()), d), new SumExpr(new SubExpr(new OpenExpr(), new LowExpr()), d)), new ConstExpr(100)));
    this.addOutput(a)
};
BRARIndicator.prototype.getName = function() {
    return "BRAR"
};
var VRIndicator = create_class(Indicator);
VRIndicator.prototype.__construct = function() {
    VRIndicator.__super.__construct.call(this);
    var g = new ParameterExpr("N", 2, 100, 26);
    var h = new ParameterExpr("M", 2, 100, 6);
    this.addParameter(g);
    this.addParameter(h);
    var e = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(e);
    var d = new AssignExpr("TH", new SumExpr(new IfExpr(new GtExpr(new CloseExpr(), e), new VolumeExpr(), new ConstExpr(0)), g));
    this.addAssign(d);
    var b = new AssignExpr("TL", new SumExpr(new IfExpr(new LtExpr(new CloseExpr(), e), new VolumeExpr(), new ConstExpr(0)), g));
    this.addAssign(b);
    var f = new AssignExpr("TQ", new SumExpr(new IfExpr(new EqExpr(new CloseExpr(), e), new VolumeExpr(), new ConstExpr(0)), g));
    this.addAssign(f);
    var a = new OutputExpr("VR", new MulExpr(new DivExpr(new AddExpr(new MulExpr(d, new ConstExpr(2)), f), new AddExpr(new MulExpr(b, new ConstExpr(2)), f)), new ConstExpr(100)));
    this.addOutput(a);
    var c = new OutputExpr("MAVR", new MaExpr(a, h));
    this.addOutput(c)
};
VRIndicator.prototype.getName = function() {
    return "VR"
};
var OBVIndicator = create_class(Indicator);
OBVIndicator.prototype.__construct = function() {
    OBVIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("M", 2, 100, 30);
    this.addParameter(e);
    var d = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(d);
    var c = new AssignExpr("VA", new IfExpr(new GtExpr(new CloseExpr(), d), new VolumeExpr(), new NegExpr(new VolumeExpr())));
    this.addAssign(c);
    var a = new OutputExpr("OBV", new SumExpr(new IfExpr(new EqExpr(new CloseExpr(), d), new ConstExpr(0), c), new ConstExpr(0)));
    this.addOutput(a);
    var b = new OutputExpr("MAOBV", new MaExpr(a, e));
    this.addOutput(b)
};
OBVIndicator.prototype.getName = function() {
    return "OBV"
};
var EMVIndicator = create_class(Indicator);
EMVIndicator.prototype.__construct = function() {
    EMVIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("N", 2, 90, 14);
    var f = new ParameterExpr("M", 2, 60, 9);
    this.addParameter(e);
    this.addParameter(f);
    var d = new AssignExpr("VOLUME", new DivExpr(new MaExpr(new VolumeExpr(), e), new VolumeExpr()));
    this.addAssign(d);
    var b = new AssignExpr("MID", new MulExpr(new DivExpr(new SubExpr(new AddExpr(new HighExpr(), new LowExpr()), new RefExpr(new AddExpr(new HighExpr(), new LowExpr()), new ConstExpr(1))), new AddExpr(new HighExpr(), new LowExpr())), new ConstExpr(100)));
    this.addAssign(b);
    var a = new OutputExpr("EMV", new MaExpr(new DivExpr(new MulExpr(b, new MulExpr(d, new SubExpr(new HighExpr(), new LowExpr()))), new MaExpr(new SubExpr(new HighExpr(), new LowExpr()), e)), e));
    this.addOutput(a);
    var c = new OutputExpr("MAEMV", new MaExpr(a, f));
    this.addOutput(c)
};
EMVIndicator.prototype.getName = function() {
    return "EMV"
};
var RSIIndicator = create_class(Indicator);
RSIIndicator.prototype.__construct = function() {
    RSIIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("N1", 2, 120, 6);
    var b = new ParameterExpr("N2", 2, 250, 12);
    var a = new ParameterExpr("N3", 2, 500, 24);
    this.addParameter(e);
    this.addParameter(b);
    this.addParameter(a);
    var d = new AssignExpr("LC", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(d);
    var c = new AssignExpr("CLOSE_LC", new SubExpr(new CloseExpr(), d));
    this.addAssign(c);
    this.addOutput(new OutputExpr("RSI1", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(c, new ConstExpr(0)), e, new ConstExpr(1)), new SmaExpr(new AbsExpr(c), e, new ConstExpr(1))), new ConstExpr(100))));
    this.addOutput(new OutputExpr("RSI2", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(c, new ConstExpr(0)), b, new ConstExpr(1)), new SmaExpr(new AbsExpr(c), b, new ConstExpr(1))), new ConstExpr(100))));
    this.addOutput(new OutputExpr("RSI3", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(c, new ConstExpr(0)), a, new ConstExpr(1)), new SmaExpr(new AbsExpr(c), a, new ConstExpr(1))), new ConstExpr(100))))
};
RSIIndicator.prototype.getName = function() {
    return "RSI"
};
var WRIndicator = create_class(Indicator);
WRIndicator.prototype.__construct = function() {
    WRIndicator.__super.__construct.call(this);
    var h = new ParameterExpr("N", 2, 100, 10);
    var e = new ParameterExpr("N1", 2, 100, 6);
    this.addParameter(h);
    this.addParameter(e);
    var a = new AssignExpr("HHV", new HhvExpr(new HighExpr(), h));
    this.addAssign(a);
    var c = new AssignExpr("HHV1", new HhvExpr(new HighExpr(), e));
    this.addAssign(c);
    var b = new AssignExpr("LLV", new LlvExpr(new LowExpr(), h));
    this.addAssign(b);
    var g = new AssignExpr("LLV1", new LlvExpr(new LowExpr(), e));
    this.addAssign(g);
    var f = new OutputExpr("WR1", new MulExpr(new DivExpr(new SubExpr(a, new CloseExpr()), new SubExpr(a, b)), new ConstExpr(100)));
    this.addOutput(f);
    var d = new OutputExpr("WR2", new MulExpr(new DivExpr(new SubExpr(c, new CloseExpr()), new SubExpr(c, g)), new ConstExpr(100)));
    this.addOutput(d)
};
WRIndicator.prototype.getName = function() {
    return "WR"
};
var SARIndicator = create_class(Indicator);
SARIndicator.prototype.__construct = function() {
    SARIndicator.__super.__construct.call(this);
    var d = new ConstExpr(4);
    var b = new ConstExpr(2);
    var a = new ConstExpr(2);
    var c = new ConstExpr(20);
    this.addOutput(new OutputExpr("SAR", new SarExpr(d, b, a, c), OutputStyle.SARPoint))
};
SARIndicator.prototype.getName = function() {
    return "SAR"
};
var KDJIndicator = create_class(Indicator);
KDJIndicator.prototype.__construct = function() {
    KDJIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("N", 2, 90, 9);
    var c = new ParameterExpr("M1", 2, 30, 3);
    var b = new ParameterExpr("M2", 2, 30, 3);
    this.addParameter(f);
    this.addParameter(c);
    this.addParameter(b);
    var i = new AssignExpr("HHV", new HhvExpr(new HighExpr(), f));
    this.addAssign(i);
    var e = new AssignExpr("LLV", new LlvExpr(new LowExpr(), f));
    this.addAssign(e);
    var d = new AssignExpr("RSV", new MulExpr(new DivExpr(new SubExpr(new CloseExpr(), e), new SubExpr(i, e)), new ConstExpr(100)));
    this.addAssign(d);
    var g = new OutputExpr("K", new SmaExpr(d, c, new ConstExpr(1)));
    this.addOutput(g);
    var a = new OutputExpr("D", new SmaExpr(g, b, new ConstExpr(1)));
    this.addOutput(a);
    var h = new OutputExpr("J", new SubExpr(new MulExpr(g, new ConstExpr(3)), new MulExpr(a, new ConstExpr(2))));
    this.addOutput(h)
};
KDJIndicator.prototype.getName = function() {
    return "KDJ"
};
var ROCIndicator = create_class(Indicator);
ROCIndicator.prototype.__construct = function() {
    ROCIndicator.__super.__construct.call(this);
    var d = new ParameterExpr("N", 2, 120, 12);
    var e = new ParameterExpr("M", 2, 60, 6);
    this.addParameter(d);
    this.addParameter(e);
    var a = new AssignExpr("REF_CLOSE_N", new RefExpr(new CloseExpr(), d));
    this.addAssign(a);
    var b = new OutputExpr("ROC", new MulExpr(new DivExpr(new SubExpr(new CloseExpr(), a), a), new ConstExpr(100)));
    this.addOutput(b);
    var c = new OutputExpr("MAROC", new MaExpr(b, e));
    this.addOutput(c)
};
ROCIndicator.prototype.getName = function() {
    return "ROC"
};
var MTMIndicator = create_class(Indicator);
MTMIndicator.prototype.__construct = function() {
    MTMIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N", 2, 120, 12);
    var d = new ParameterExpr("M", 2, 60, 6);
    this.addParameter(c);
    this.addParameter(d);
    var b = new OutputExpr("MTM", new SubExpr(new CloseExpr(), new RefExpr(new CloseExpr(), c)));
    this.addOutput(b);
    var a = new OutputExpr("MTMMA", new MaExpr(b, d));
    this.addOutput(a)
};
MTMIndicator.prototype.getName = function() {
    return "MTM"
};
var BOLLIndicator = create_class(Indicator);
BOLLIndicator.prototype.__construct = function() {
    BOLLIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("N", 2, 120, 20);
    this.addParameter(e);
    var d = new AssignExpr("STD_CLOSE_N", new StdExpr(new CloseExpr(), e));
    this.addAssign(d);
    var a = new OutputExpr("BOLL", new MaExpr(new CloseExpr(), e));
    this.addOutput(a);
    var b = new OutputExpr("UB", new AddExpr(a, new MulExpr(new ConstExpr(2), d)));
    this.addOutput(b);
    var c = new OutputExpr("LB", new SubExpr(a, new MulExpr(new ConstExpr(2), d)));
    this.addOutput(c)
};
BOLLIndicator.prototype.getName = function() {
    return "BOLL"
};
var PSYIndicator = create_class(Indicator);
PSYIndicator.prototype.__construct = function() {
    PSYIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N", 2, 100, 12);
    var d = new ParameterExpr("M", 2, 100, 6);
    this.addParameter(c);
    this.addParameter(d);
    var b = new OutputExpr("PSY", new MulExpr(new DivExpr(new CountExpr(new GtExpr(new CloseExpr(), new RefExpr(new CloseExpr(), new ConstExpr(1))), c), c), new ConstExpr(100)));
    this.addOutput(b);
    var a = new OutputExpr("PSYMA", new MaExpr(b, d));
    this.addOutput(a)
};
PSYIndicator.prototype.getName = function() {
    return "PSY"
};
var STOCHRSIIndicator = create_class(Indicator);
STOCHRSIIndicator.prototype.__construct = function() {
    STOCHRSIIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("N", 3, 100, 14);
    var h = new ParameterExpr("M", 3, 100, 14);
    var a = new ParameterExpr("P1", 2, 50, 3);
    var g = new ParameterExpr("P2", 2, 50, 3);
    this.addParameter(f);
    this.addParameter(h);
    this.addParameter(a);
    this.addParameter(g);
    var e = new AssignExpr("LC", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(e);
    var d = new AssignExpr("CLOSE_LC", new SubExpr(new CloseExpr(), e));
    this.addAssign(d);
    var c = new AssignExpr("RSI", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(d, new ConstExpr(0)), f, new ConstExpr(1)), new SmaExpr(new AbsExpr(d), f, new ConstExpr(1))), new ConstExpr(100)));
    this.addAssign(c);
    var b = new OutputExpr("STOCHRSI", new MulExpr(new DivExpr(new MaExpr(new SubExpr(c, new LlvExpr(c, h)), a), new MaExpr(new SubExpr(new HhvExpr(c, h), new LlvExpr(c, h)), a)), new ConstExpr(100)));
    this.addOutput(b);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(b, g)))
};
STOCHRSIIndicator.prototype.getName = function() {
    return "StochRSI"
};