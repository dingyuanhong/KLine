var ChartManager = create_class();
ChartManager.DrawingTool = {
    Cursor: 0,
    CrossCursor: 1,
    DrawLines: 2,
    DrawFibRetrace: 3,
    DrawFibFans: 4,
    SegLine: 5,
    StraightLine: 6,
    ArrowLine: 7,
    RayLine: 8,
    HoriStraightLine: 9,
    HoriRayLine: 10,
    HoriSegLine: 11,
    VertiStraightLine: 12,
    PriceLine: 13,
    BiParallelLine: 14,
    BiParallelRayLine: 15,
    TriParallelLine: 16,
    BandLine: 17
};
ChartManager._instance = null;
ChartManager.getInstance = function(s){
    if (ChartManager._instance == null) {
        ChartManager._instance = new ChartManager(s)
    }
    return ChartManager._instance
}

ChartManager.prototype.getInstance = function() {
    return this;
};

ChartManager.prototype.__construct = function(session) {
    session.chartMgr = this;
    this._session = session;
    this._dataSources = {};
    this._dataSourceCache = {};
    this._dataProviders = {};
    this._frames = {};
    this._areas = {};
    this._timelines = {};
    this._ranges = {};
    this._plotters = {};
    this._themes = {};
    this._titles = {};
    this._frameMousePos = {};
    this._dsChartStyle = {};
    this._dragStarted = false;
    this._oldX = 0;
    this._fakeIndicators = {};
    this._captureMouseWheelDirectly = true;
    this._chart = {};
    this._chart.defaultFrame = new Chart(session);
    this._drawingTool = ChartManager.DrawingTool.CrossCursor;
    this._beforeDrawingTool = this._drawingTool;
    this._language = "zh-cn";
    this._mainCanvas = null;
    this._overlayCanvas = null;
    this._mainContext = null;
    this._overlayContext = null
};
ChartManager.prototype.redraw = function(a, b) {
    if (a == undefined || b) {
        a = "All"
    }
    if (a == "All" || a == "MainCanvas") {
        if (b) {
            this.getFrame("frame0").setChanged(true)
        }
        this.layout(this._mainContext, "frame0", 0, 0, this._mainCanvas.width, this._mainCanvas.height);
        this.drawMain("frame0", this._mainContext)
    }
    if (a == "All" || a == "OverlayCanvas") {
        this._overlayContext.clearRect(0, 0, this._overlayCanvas.width, this._overlayCanvas.height);
        this.drawOverlay("frame0", this._overlayContext)
    }
};
ChartManager.prototype.bindCanvas = function(b, a) {
    if (b == "main") {
        this._mainCanvas = a;
        this._mainContext = a.getContext("2d")
    } else {
        if (b == "overlay") {
            this._overlayCanvas = a;
            this._overlayContext = a.getContext("2d");
            if (this._captureMouseWheelDirectly) {
                $(this._overlayCanvas).bind("mousewheel", mouseWheel)
            }
        }
    }
};
ChartManager.prototype.getCaptureMouseWheelDirectly = function() {
    return this._captureMouseWheelDirectly
};
ChartManager.prototype.setCaptureMouseWheelDirectly = function(a) {
    this._captureMouseWheelDirectly = a;
    if (a) {
        $(this._overlayCanvas).bind("mousewheel", mouseWheel)
    } else {
        $(this._overlayCanvas).unbind("mousewheel")
    }
};
ChartManager.prototype.getChart = function(a) {
    return this._chart.defaultFrame
};
ChartManager.prototype.init = function() {
    delete this._ranges["frame0.k0.indic1"];
    delete this._ranges["frame0.k0.indic1Range"];
    delete this._areas["frame0.k0.indic1"];
    delete this._areas["frame0.k0.indic1Range"];
    DefaultTemplate.loadTemplate("frame0.k0", "BTC123", this);
    this.redraw("All", true)
};
ChartManager.prototype.setCurrentDrawingTool = function(a) {
    this._drawingTool = ChartManager.DrawingTool[a];
    this.setRunningMode(this._drawingTool)
};
ChartManager.prototype.getLanguage = function() {
    return this._language
};
ChartManager.prototype.setLanguage = function(a) {
    this._language = a
};
ChartManager.prototype.setThemeName = function(a, b) {
    if (b == undefined) {
        b = "Dark"
    }
    var c;
    switch (b) {
        case "Light":
            c = new LightTheme();
            break;
        default:
            b = "Dark";
            c = new DarkTheme();
            break
    }
    this._themeName = b;
    this.setTheme(a, c);
    this.getFrame(a).setChanged(true)
};
ChartManager.prototype.getChartStyle = function(b) {
    var a = this._dsChartStyle[b];
    if (a == undefined) {
        return "CandleStick"
    }
    return a
};
ChartManager.prototype.setChartStyle = function(e, c) {
    if (this._dsChartStyle[e] == c) {
        return
    }
    var g = e + ".main";
    var b = g + ".main";
    var a = g + ".main";
    var f, d;
    switch (c) {
        case "CandleStick":
        case "CandleStickHLC":
        case "OHLC":
            f = this.getDataProvider(b);
            if (f == undefined || !is_instance(f, MainDataProvider)) {
                f = new MainDataProvider(b,this);
                this.setDataProvider(b, f);
                f.updateData()
            }
            this.setMainIndicator(e, ChartSettings.get(this).charts.mIndic);
            switch (c) {
                case "CandleStick":
                    d = new CandlestickPlotter(a,this);
                    break;
                case "CandleStickHLC":
                    d = new CandlestickHLCPlotter(a,this);
                    break;
                case "OHLC":
                    d = new OHLCPlotter(a,this);
                    break
            }
            this.setPlotter(a, d);
            d = new MinMaxPlotter(g + ".decoration",this);
            this.setPlotter(d.getName(), d);
            break;
        case "Line":
            f = new IndicatorDataProvider(b,this);
            this.setDataProvider(f.getName(), f);
            f.setIndicator(new HLCIndicator(this));
            this.removeMainIndicator(e);
            d = new IndicatorPlotter(a,this);
            this.setPlotter(a, d);
            this.removePlotter(g + ".decoration");
            break
    }
    this.getArea(d.getAreaName()).setChanged(true);
    this._dsChartStyle[e] = c
};
ChartManager.prototype.setNormalMode = function() {
    this._drawingTool = this._beforeDrawingTool;
    $(".chart_dropdown_data").removeClass("chart_dropdown-hover");
    $("#chart_toolpanel .chart_toolpanel_button").removeClass("selected");
    $("#chart_CrossCursor").parent().addClass("selected");
    if (this._drawingTool == ChartManager.DrawingTool.Cursor) {
        this.showCursor();
        $("#mode a").removeClass("selected");
        $("#chart_toolpanel .chart_toolpanel_button").removeClass("selected");
        $("#chart_Cursor").parent().addClass("selected")
    } else {
        this.hideCursor()
    }
};
ChartManager.prototype.setRunningMode = function(b) {
    var c = this.getDataSource("frame0.k0");
    var a = c.getCurrentToolObject();
    if (a != null && a.state != CToolObject.state.AfterDraw) {
        c.delToolObject()
    }
    if (c.getToolObjectCount() > 10) {
        this.setNormalMode();
        return
    }
    this._drawingTool = b;
    if (b == ChartManager.DrawingTool.Cursor) {
        this.showCursor()
    } else {}
    switch (b) {
        case ChartManager.DrawingTool.Cursor:
            this._beforeDrawingTool = b;
            break;
        case ChartManager.DrawingTool.ArrowLine:
            c.addToolObject(new CArrowLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.BandLine:
            c.addToolObject(new CBandLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.BiParallelLine:
            c.addToolObject(new CBiParallelLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.BiParallelRayLine:
            c.addToolObject(new CBiParallelRayLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.CrossCursor:
            this._beforeDrawingTool = b;
            break;
        case ChartManager.DrawingTool.DrawFibFans:
            c.addToolObject(new CFibFansObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.DrawFibRetrace:
            c.addToolObject(new CFibRetraceObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.DrawLines:
            c.addToolObject(new CStraightLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.HoriRayLine:
            c.addToolObject(new CHoriRayLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.HoriSegLine:
            c.addToolObject(new CHoriSegLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.HoriStraightLine:
            c.addToolObject(new CHoriStraightLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.PriceLine:
            c.addToolObject(new CPriceLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.RayLine:
            c.addToolObject(new CRayLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.SegLine:
            c.addToolObject(new CSegLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.StraightLine:
            c.addToolObject(new CStraightLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.TriParallelLine:
            c.addToolObject(new CTriParallelLineObject("frame0.k0",this));
            break;
        case ChartManager.DrawingTool.VertiStraightLine:
            c.addToolObject(new CVertiStraightLineObject("frame0.k0",this));
            break
    }
};
ChartManager.prototype.getTitle = function(a) {
    return this._titles[a]
};
ChartManager.prototype.setTitle = function(b, a) {
    this._titles[b] = a
};
ChartManager.prototype.setCurrentDataSource = function(d, a) {
    var b = this.getCachedDataSource(a);
    if (b != null) {
        this.setDataSource(d, b, true)
    } else {
        var c = this.getDataSource(d);
        if (c != null) {
            if (is_instance(c, MainDataSource)) {
                b = new MainDataSource(a,this)
            } else {
                if (is_instance(c, CLiveOrderDataSource)) {
                    b = new CLiveOrderDataSource(a,this)
                } else {
                    if (is_instance(c, CLiveTradeDataSource)) {
                        b = new CLiveTradeDataSource(a,this)
                    }
                }
            }
            this.setDataSource(d, b, true);
            this.setCachedDataSource(a, b)
        }
    }
};
ChartManager.prototype.getDataSource = function(a) {
    return this._dataSources[a]
};
ChartManager.prototype.setDataSource = function(a, b, c) {
    this._dataSources[a] = b;
    if (c) {
        this.updateData(a, null)
    }
};
ChartManager.prototype.getCachedDataSource = function(a) {
    return this._dataSourceCache[a]
};
ChartManager.prototype.setCachedDataSource = function(a, b) {
    this._dataSourceCache[a] = b
};
ChartManager.prototype.getDataProvider = function(a) {
    return this._dataProviders[a]
};
ChartManager.prototype.setDataProvider = function(a, b) {
    this._dataProviders[a] = b
};
ChartManager.prototype.removeDataProvider = function(a) {
    delete this._dataProviders[a]
};
ChartManager.prototype.getFrame = function(a) {
    return this._frames[a]
};
ChartManager.prototype.setFrame = function(a, b) {
    this._frames[a] = b
};
ChartManager.prototype.removeFrame = function(a) {
    delete this._frames[a]
};
ChartManager.prototype.getArea = function(a) {
    return this._areas[a]
};
ChartManager.prototype.setArea = function(a, b) {
    this._areas[a] = b
};
ChartManager.prototype.removeArea = function(a) {
    delete this._areas[a]
};
ChartManager.prototype.getTimeline = function(a) {
    return this._timelines[a]
};
ChartManager.prototype.setTimeline = function(a, b) {
    this._timelines[a] = b
};
ChartManager.prototype.removeTimeline = function(a) {
    delete this._timelines[a]
};
ChartManager.prototype.getRange = function(a) {
    return this._ranges[a]
};
ChartManager.prototype.setRange = function(b, a) {
    this._ranges[b] = a
};
ChartManager.prototype.removeRange = function(a) {
    delete this._ranges[a]
};
ChartManager.prototype.getPlotter = function(a) {
    return this._plotters[a]
};
ChartManager.prototype.setPlotter = function(a, b) {
    this._plotters[a] = b
};
ChartManager.prototype.removePlotter = function(a) {
    delete this._plotters[a]
};
ChartManager.prototype.getTheme = function(a) {
    return this._themes[a]
};
ChartManager.prototype.setTheme = function(a, b) {
    this._themes[a] = b
};
ChartManager.prototype.getFrameMousePos = function(b, a) {
    if (this._frameMousePos[b] != undefined) {
        a.x = this._frameMousePos[b].x;
        a.y = this._frameMousePos[b].y
    } else {
        a.x = -1;
        a.y = -1
    }
};
ChartManager.prototype.setFrameMousePos = function(b, c, a) {
    this._frameMousePos[b] = {
        x: c,
        y: a
    }
};
ChartManager.prototype.drawArea = function(c, d, f) {
    var g = d.getNameObject().getCompAt(2);
    if (g == "timeline") {
        if (d.getHeight() < 20) {
            return
        }
    } else {
        if (d.getHeight() < 30) {
            return
        }
    }
    if (d.getWidth() < 30) {
        return
    }
    g = d.getName();
    var e;
    var b, a = f.length;
    for (b = 0; b < a; b++) {
        e = this._plotters[g + f[b]];
        if (e != undefined) {
            e.Draw(c)
        }
    }
};
ChartManager.prototype.drawAreaMain = function(a, b) {
    var c = this._dataSources[b.getDataSourceName()];
    var d;
    if (c.getDataCount() < 1) {
        d = [".background"]
    } else {
        d = [".background", ".grid", ".main", ".secondary"]
    }
    this.drawArea(a, b, d);
    b.setChanged(false)
};
ChartManager.prototype.drawAreaOverlay = function(a, b) {
    var c = this._dataSources[b.getDataSourceName()];
    var d;
    if (c.getDataCount() < 1) {
        d = [".selection"]
    } else {
        d = [".decoration", ".selection", ".info", ".tool"]
    }
    this.drawArea(a, b, d)
};
ChartManager.prototype.drawMain = function(a, c) {
    drawn = false;
    if (!drawn) {
        for (var d in this._areas) {
            if (this._areas[d].getFrameName() == a && !is_instance(this._areas[d], ChartAreaGroup)) {
                this.drawAreaMain(c, this._areas[d])
            }
        }
    }
    var f;
    for (var b in this._timelines) {
        f = this._timelines[b];
        if (f.getFrameName() == a) {
            f.setUpdated(false)
        }
    }
    for (var b in this._ranges) {
        f = this._ranges[b];
        if (f.getFrameName() == a) {
            f.setUpdated(false)
        }
    }
    for (var b in this._areas) {
        f = this._areas[b];
        if (f.getFrameName() == a) {
            f.setChanged(false)
        }
    }
};
ChartManager.prototype.drawOverlay = function(a, b) {
    for (var d in this._areas) {
        var c = this._areas[d];
        if (is_instance(c, ChartAreaGroup)) {
            if (c.getFrameName() == a) {
                c.drawGrid(b)
            }
        }
    }
    for (var d in this._areas) {
        var c = this._areas[d];
        if (is_instance(c, ChartAreaGroup) == false) {
            if (c.getFrameName() == a) {
                this.drawAreaOverlay(b, c)
            }
        }
    }
};
ChartManager.prototype.updateData = function(a, g) {
    var d = this.getDataSource(a);
    if (d == undefined) {
        return
    }
    if (g != null) {
        if (!d.update(g)) {
            return false
        }
        if (d.getUpdateMode() == DataSource.UpdateMode.DoNothing) {
            return true
        }
    } else {
        d.setUpdateMode(DataSource.UpdateMode.Refresh)
    }
    var j = this.getTimeline(a);
    if (j != undefined) {
        j.update()
    }
    if (d.getDataCount() < 1) {
        return true
    }
    var k = [".main", ".secondary"];
    var b, h;
    for (var c in this._areas) {
        b = this._areas[c];
        if (is_instance(b, ChartAreaGroup)) {
            continue
        }
        if (b.getDataSourceName() != a) {
            continue
        }
        h = b.getName();
        for (var f = 0; f < k.length; f++) {
            var e = this.getDataProvider(h + k[f]);
            if (e != undefined) {
                e.updateData()
            }
        }
    }
    return true
};
ChartManager.prototype.updateRange = function(a) {
    var d = this.getDataSource(a);
    if (d.getDataCount() < 1) {
        return
    }
    var k = [".main", ".secondary"];
    var b, h;
    for (var c in this._areas) {
        b = this._areas[c];
        if (is_instance(b, ChartAreaGroup)) {
            continue
        }
        if (b.getDataSourceName() != a) {
            continue
        }
        h = b.getName();
        for (var f = 0; f < k.length; f++) {
            var e = this.getDataProvider(h + k[f]);
            if (e != undefined) {
                e.updateRange()
            }
        }
        var j = this.getTimeline(a);
        if (j != undefined && j.getMaxItemCount() > 0) {
            var g = this.getRange(h);
            if (g != undefined) {
                g.update()
            }
        }
    }
};
ChartManager.prototype.layout = function(b, g, f, i, j, a) {
    var c = this.getFrame(g);
    c.measure(b, j - f, a - i);
    c.layout(f, i, j, a);
    for (var d in this._timelines) {
        var h = this._timelines[d];
        if (h.getFrameName() == g) {
            h.onLayout()
        }
    }
    for (var d in this._dataSources) {
        if (d.substring(0, g.length) == g) {
            this.updateRange(d)
        }
    }
};
ChartManager.prototype.SelectRange = function(b, f) {
    var c;
    for (var a in this._ranges) {
        var e = this._ranges[a].getAreaName();
        var d = b.getName();
        if (e == d) {
            this._ranges[a].selectAt(f)
        } else {
            this._ranges[a].unselect()
        }
    }
};
ChartManager.prototype.scale = function(b) {
    if (this._highlightedFrame == null) {
        return
    }
    var a = this._highlightedFrame.getHighlightedArea();
    if (this.getRange(a.getName()) != undefined) {
        var d = a.getDataSourceName();
        var c = this.getTimeline(d);
        if (c != null) {
            c.scale(b);
            this.updateRange(d)
        }
    }
};
ChartManager.prototype.showCursor = function(a) {
    if (a === undefined) {
        a = "default"
    }
    this._mainCanvas.style.cursor = a;
    this._overlayCanvas.style.cursor = a
};
ChartManager.prototype.hideCursor = function() {
    this._mainCanvas.style.cursor = "none";
    this._overlayCanvas.style.cursor = "none"
};
ChartManager.prototype.showCrossCursor = function(b, a, d) {
    var c = this.getRange(b.getName());
    if (c != undefined) {
        c.selectAt(d);
        c = this.getTimeline(b.getDataSourceName());
        if (c != undefined) {
            if (c.selectAt(a)) {
                return true
            }
        }
    }
    return false
};
ChartManager.prototype.hideCrossCursor = function(a) {
    if (a != null) {
        for (var c in this._timelines) {
            var b = this._timelines[c];
            if (b != a) {
                b.unselect()
            }
        }
    } else {
        for (var c in this._timelines) {
            this._timelines[c].unselect()
        }
    }
    for (var c in this._ranges) {
        this._ranges[c].unselect()
    }
};
ChartManager.prototype.clearHighlight = function() {
    if (this._highlightedFrame != null) {
        this._highlightedFrame.highlight(null);
        this._highlightedFrame = null
    }
};
ChartManager.prototype.onToolMouseMove = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
        if (e.indexOf(b) == 0) {
            var d = this._dataSources[e];
            if (is_instance(d, MainDataSource)) {
                if (d.toolManager.acceptMouseMoveEvent(a, f)) {
                    c = true
                }
            }
        }
    }
    return c
};
ChartManager.prototype.onToolMouseDown = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
        if (e.indexOf(b) == 0) {
            var d = this._dataSources[e];
            if (is_instance(d, MainDataSource)) {
                if (d.toolManager.acceptMouseDownEvent(a, f)) {
                    c = true
                }
            }
        }
    }
    return c
};
ChartManager.prototype.onToolMouseUp = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
        if (e.indexOf(b) == 0) {
            var d = this._dataSources[e];
            if (is_instance(d, MainDataSource)) {
                if (d.toolManager.acceptMouseUpEvent(a, f)) {
                    c = true
                }
            }
        }
    }
    return c
};
ChartManager.prototype.onToolMouseDrag = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
        if (e.indexOf(b) == 0) {
            var d = this._dataSources[e];
            if (is_instance(d, MainDataSource)) {
                if (d.toolManager.acceptMouseDownMoveEvent(a, f)) {
                    c = true
                }
            }
        }
    }
    return c
};
ChartManager.prototype.onMouseMove = function(f, k, h, g) {
    var c = this.getFrame(f);
    if (c === undefined) {
        return
    }
    this.setFrameMousePos(f, k, h);
    this.hideCrossCursor();
    if (this._highlightedFrame != c) {
        this.clearHighlight()
    }
    if (this._capturingMouseArea != null) {
        this._capturingMouseArea.onMouseMove(k, h);
        return
    }
    var b = c.contains(k, h);
    if (b == null) {
        return
    }
    var j, e, d = b.length;
    for (e = d - 1; e >= 0; e--) {
        j = b[e];
        j = j.onMouseMove(k, h);
        if (j != null) {
            if (!is_instance(j, ChartAreaGroup)) {
                c.highlight(j);
                this._highlightedFrame = c
            }
            return
        }
    }
};
ChartManager.prototype.onMouseLeave = function(c, a, e, b) {
    var d = this.getFrame(c);
    if (d == undefined) {
        return
    }
    this.setFrameMousePos(c, a, e);
    this.hideCrossCursor();
    this.clearHighlight();
    if (this._capturingMouseArea != null) {
        this._capturingMouseArea.onMouseLeave(a, e);
        this._capturingMouseArea = null
    }
    this._dragStarted = false
};
ChartManager.prototype.onMouseDown = function(d, b, j) {
    var h = this.getFrame(d);
    if (h == undefined) {
        return
    }
    var e = h.contains(b, j);
    if (e == null) {
        return
    }
    var c, g, f = e.length;
    for (g = f - 1; g >= 0; g--) {
        c = e[g];
        c = c.onMouseDown(b, j);
        if (c != null) {
            this._capturingMouseArea = c;
            return
        }
    }
};
ChartManager.prototype.onMouseUp = function(b, a, d) {
    var c = this.getFrame(b);
    if (c == undefined) {
        return
    }
    if (this._capturingMouseArea) {
        if (this._capturingMouseArea.onMouseUp(a, d) == null && this._dragStarted == false) {
            if (this._selectedFrame != null && this._selectedFrame != c) {
                this._selectedFrame.select(null)
            }
            if (this._capturingMouseArea.isSelected()) {
                if (!this._captureMouseWheelDirectly) {
                    $(this._overlayCanvas).unbind("mousewheel")
                }
                c.select(null);
                this._selectedFrame = null
            } else {
                if (this._selectedFrame != c) {
                    if (!this._captureMouseWheelDirectly) {
                        $(this._overlayCanvas).bind("mousewheel", mouseWheel)
                    }
                }
                c.select(this._capturingMouseArea);
                this._selectedFrame = c
            }
        }
        this._capturingMouseArea = null;
        this._dragStarted = false
    }
};
ChartManager.prototype.deleteToolObject = function() {
    var b = this.getDataSource("frame0.k0");
    var c = b.getSelectToolObjcet();
    if (c != null) {
        b.delSelectToolObject()
    }
    var a = b.getCurrentToolObject();
    if (a != null && a.getState() != CToolObject.state.AfterDraw) {
        b.delToolObject()
    }
    this.setNormalMode()
};
ChartManager.prototype.unloadTemplate = function(a) {
    var b = this.getFrame(a);
    if (b == undefined) {
        return
    }
    for (var c in this._dataSources) {
        if (c.match(a + ".")) {
            delete this._dataSources[c]
        }
    }
    for (var c in this._dataProviders) {
        if (this._dataProviders[c].getFrameName() == a) {
            delete this._dataProviders[c]
        }
    }
    delete this._frames[a];
    for (var c in this._areas) {
        if (this._areas[c].getFrameName() == a) {
            delete this._areas[c]
        }
    }
    for (var c in this._timelines) {
        if (this._timelines[c].getFrameName() == a) {
            delete this._timelines[c]
        }
    }
    for (var c in this._ranges) {
        if (this._ranges[c].getFrameName() == a) {
            delete this._ranges[c]
        }
    }
    for (var c in this._plotters) {
        if (this._plotters[c].getFrameName() == a) {
            delete this._plotters[c]
        }
    }
    delete this._themes[a];
    delete this._frameMousePos[a]
};
ChartManager.prototype.createIndicatorAndRange = function(e, a, c) {
    var d, b;
    switch (a) {
        case "MA":
            d = new MAIndicator(this);
            b = new PositiveRange(e,this);
            break;
        case "EMA":
            d = new EMAIndicator(this);
            b = new PositiveRange(e,this);
            break;
        case "VOLUME":
            d = new VOLUMEIndicator(this);
            b = new ZeroBasedPositiveRange(e,this);
            break;
        case "MACD":
            d = new MACDIndicator(this);
            b = new ZeroCenteredRange(e,this);
            break;
        case "DMI":
            d = new DMIIndicator(this);
            b = new PercentageRange(e,this);
            break;
        case "DMA":
            d = new DMAIndicator(this);
            b = new Range(e,this);
            break;
        case "TRIX":
            d = new TRIXIndicator(this);
            b = new Range(e,this);
            break;
        case "BRAR":
            d = new BRARIndicator(this);
            b = new Range(e,this);
            break;
        case "VR":
            d = new VRIndicator(this);
            b = new Range(e,this);
            break;
        case "OBV":
            d = new OBVIndicator(this);
            b = new Range(e,this);
            break;
        case "EMV":
            d = new EMVIndicator(this);
            b = new Range(e,this);
            break;
        case "RSI":
            d = new RSIIndicator(this);
            b = new PercentageRange(e,this);
            break;
        case "WR":
            d = new WRIndicator(this);
            b = new PercentageRange(e,this);
            break;
        case "SAR":
            d = new SARIndicator(this);
            b = new PositiveRange(e,this);
            break;
        case "KDJ":
            d = new KDJIndicator(this);
            b = new PercentageRange(e,this);
            break;
        case "ROC":
            d = new ROCIndicator(this);
            b = new Range(e,this);
            break;
        case "MTM":
            d = new MTMIndicator(this);
            b = new Range(e,this);
            break;
        case "BOLL":
            d = new BOLLIndicator(this);
            b = new Range(e,this);
            break;
        case "PSY":
            d = new PSYIndicator(this);
            b = new Range(e,this);
            break;
        case "StochRSI":
            d = new STOCHRSIIndicator(this);
            b = new PercentageRange(e,this);
            break;
        default:
            return null
    }
    if (!c) {
        d.setParameters(ChartSettings.get(this).indics[a])
    }
    return {
        indic: d,
        range: b
    }
};
ChartManager.prototype.setMainIndicator = function(e, a) {
    var h = e + ".main";
    var g = this.getDataProvider(h + ".main");
    if (g == undefined || !is_instance(g, MainDataProvider)) {
        return false
    }
    var f;
    switch (a) {
        case "MA":
            f = new MAIndicator(this);
            break;
        case "EMA":
            f = new EMAIndicator(this);
            break;
        case "BOLL":
            f = new BOLLIndicator(this);
            break;
        case "SAR":
            f = new SARIndicator(this);
            break;
        default:
            return false
    }
    f.setParameters(ChartSettings.get(this).indics[a]);
    var c = h + ".secondary";
    var b = this.getDataProvider(c);
    if (b == undefined) {
        b = new IndicatorDataProvider(c,this);
        this.setDataProvider(b.getName(), b)
    }
    b.setIndicator(f);
    var d = this.getPlotter(c);
    if (d == undefined) {
        d = new IndicatorPlotter(c,this);
        this.setPlotter(d.getName(), d)
    }
    this.getArea(h).setChanged(true);
    return true
};
ChartManager.prototype.setIndicator = function(h, a) {
    var d = this.getArea(h);
    if (d == undefined || d.getNameObject().getCompAt(2) == "main") {
        return false
    }
    var g = this.getDataProvider(h + ".secondary");
    if (g == undefined || !is_instance(g, IndicatorDataProvider)) {
        return false
    }
    var c = this.createIndicatorAndRange(h, a);
    if (c == null) {
        return false
    }
    var f = c.indic;
    var b = c.range;
    this.removeDataProvider(h + ".main");
    this.removePlotter(h + ".main");
    this.removeRange(h);
    this.removePlotter(h + "Range.decoration");
    g.setIndicator(f);
    this.setRange(h, b);
    b.setPaddingTop(20);
    b.setPaddingBottom(4);
    b.setMinInterval(20);
    if (is_instance(f, VOLUMEIndicator)) {
        var e = new LastVolumePlotter(h + "Range.decoration",this);
        this.setPlotter(e.getName(), e)
    } else {
        if (is_instance(f, BOLLIndicator) || is_instance(f, SARIndicator)) {
            var g = new MainDataProvider(h + ".main",this);
            this.setDataProvider(g.getName(), g);
            g.updateData();
            var e = new OHLCPlotter(h + ".main",this);
            this.setPlotter(e.getName(), e)
        }
    }
    return true
};
ChartManager.prototype.removeMainIndicator = function(c) {
    var d = c + ".main";
    var b = d + ".secondary";
    var a = this.getDataProvider(b);
    if (a == undefined || !is_instance(a, IndicatorDataProvider)) {
        return
    }
    this.removeDataProvider(b);
    this.removePlotter(b);
    this.getArea(d).setChanged(true)
};
ChartManager.prototype.removeIndicator = function(g) {
    var b = this.getArea(g);
    if (b == undefined || b.getNameObject().getCompAt(2) == "main") {
        return
    }
    var f = this.getDataProvider(g + ".secondary");
    if (f == undefined || !is_instance(f, IndicatorDataProvider)) {
        return
    }
    var c = g + "Range";
    var a = this.getArea(c);
    if (a == undefined) {
        return
    }
    var e = this.getArea(b.getDataSourceName() + ".charts");
    if (e == undefined) {
        return
    }
    e.removeArea(b);
    this.removeArea(g);
    e.removeArea(a);
    this.removeArea(c);
    for (var d in this._dataProviders) {
        if (this._dataProviders[d].getAreaName() == g) {
            this.removeDataProvider(d)
        }
    }
    for (var d in this._ranges) {
        if (this._ranges[d].getAreaName() == g) {
            this.removeRange(d)
        }
    }
    for (var d in this._plotters) {
        if (this._plotters[d].getAreaName() == g) {
            this.removePlotter(d)
        }
    }
    for (var d in this._plotters) {
        if (this._plotters[d].getAreaName() == c) {
            this.removePlotter(d)
        }
    }
};
ChartManager.prototype.getIndicatorParameters = function(a) {
    var f = this._fakeIndicators[a];
    if (f == undefined) {
        var b = this.createIndicatorAndRange("", a);
        if (b == null) {
            return null
        }
        this._fakeIndicators[a] = f = b.indic
    }
    var e = [];
    var d, c = f.getParameterCount();
    for (d = 0; d < c; d++) {
        e.push(f.getParameterAt(d))
    }
    return e
};
ChartManager.prototype.setIndicatorParameters = function(a, c) {
    var f, e;
    for (f in this._dataProviders) {
        var d = this._dataProviders[f];
        if (is_instance(d, IndicatorDataProvider) == false) {
            continue
        }
        e = d.getIndicator();
        if (e.getName() == a) {
            e.setParameters(c);
            d.refresh();
            this.getArea(d.getAreaName()).setChanged(true)
        }
    }
    e = this._fakeIndicators[a];
    if (e == undefined) {
        var b = this.createIndicatorAndRange("", a, true);
        if (b == null) {
            return
        }
        this._fakeIndicators[a] = e = b.indic
    }
    e.setParameters(c)
};
ChartManager.prototype.getIndicatorAreaName = function(c, a) {
    var d = this.getArea(c + ".charts");
    var b = d.getAreaCount() >> 1;
    if (a < 0 || a >= b) {
        return ""
    }
    return d.getAreaAt(a << 1).getName()
};