var TemplateMeasuringHandler = create_class();
TemplateMeasuringHandler.onMeasuring = function(c, b) {
    var d = b.Width;
    var a = b.Height;
    var e = c.getNameObject().getCompAt(2);
    if (e == "timeline") {
        c.setMeasuredDimension(d, 22)
    }
};
var Template = create_class();
Template.displayVolume = true;
Template.prototype.__construct = function(m) {
    this._manager = m;
}
Template.createCandlestickDataSource = function(a, manager) {
    return new MainDataSource(a, manager)
};
Template.createLiveOrderDataSource = function(a, manager) {
    return new CLiveOrderDataSource(a, manager)
};
Template.createLiveTradeDataSource = function(a, manager) {
    return new CLiveTradeDataSource(a, manager)
};
Template.createDataSource = function(d, a, c, manager) {
    var b = manager.getInstance();
    if (b.getCachedDataSource(a) == null) {
        b.setCachedDataSource(a, c(a))
    }
    b.setCurrentDataSource(d, a);
    b.updateData(d, null)
};
Template.createTableComps = function(a, manager) {
    Template.createMainChartComps(a, manager);
    if (Template.displayVolume) {
        Template.createIndicatorChartComps(a, "VOLUME", manager)
    }
    Template.createTimelineComps(a, manager)
};
Template.createMainChartComps = function(c, manager) {
    var j = manager.getInstance();
    var b = j.getArea(c + ".charts");
    var g = c + ".main";
    var h = g + "Range";
    var d = new MainArea(g,manager);
    j.setArea(g, d);
    b.addArea(d);
    var i = new MainRangeArea(h,manager);
    j.setArea(h, i);
    b.addArea(i);
    var e = new MainDataProvider(g + ".main", manager);
    j.setDataProvider(e.getName(), e);
    j.setMainIndicator(c, "MA");
    var f = new MainRange(g, manager);
    j.setRange(f.getName(), f);
    f.setPaddingTop(28);
    f.setPaddingBottom(12);
    var a = new MainAreaBackgroundPlotter(g + ".background", manager);
    j.setPlotter(a.getName(), a);
    a = new CGridPlotter(g + ".grid", manager);
    j.setPlotter(a.getName(), a);
    a = new CandlestickPlotter(g + ".main", manager);
    j.setPlotter(a.getName(), a);
    a = new MinMaxPlotter(g + ".decoration", manager);
    j.setPlotter(a.getName(), a);
    a = new MainInfoPlotter(g + ".info", manager);
    j.setPlotter(a.getName(), a);
    a = new SelectionPlotter(g + ".selection", manager);
    j.setPlotter(a.getName(), a);
    a = new CDynamicLinePlotter(g + ".tool", manager);
    j.setPlotter(a.getName(), a);
    a = new RangeAreaBackgroundPlotter(g + "Range.background", manager);
    j.setPlotter(a.getName(), a);
    a = new COrderGraphPlotter(g + "Range.grid", manager);
    j.setPlotter(a.getName(), a);
    a = new RangePlotter(g + "Range.main", manager);
    j.setPlotter(a.getName(), a);
    a = new RangeSelectionPlotter(g + "Range.selection", manager);
    j.setPlotter(a.getName(), a);
    a = new LastClosePlotter(g + "Range.decoration", manager);
    j.setPlotter(a.getName(), a)
};
Template.createIndicatorChartComps = function(d, p, manager) {
    var o = manager.getInstance();
    var c = o.getArea(d + ".charts");
    var h = d + ".indic" + c.getNextRowId();
    var n = h + "Range";
    var e = new IndicatorArea(h, manager);
    o.setArea(h, e);
    c.addArea(e);
    var k = c.getAreaCount() >> 1;
    var j = ChartSettings.get(manager).charts.areaHeight;
    if (j.length > k) {
        var l, g;
        for (g = 0; g < k; g++) {
            l = c.getAreaAt(g << 1);
            l.setTop(0);
            l.setBottom(j[g])
        }
        e.setTop(0);
        e.setBottom(j[k])
    }
    var m = new IndicatorRangeArea(n, manager);
    o.setArea(n, m);
    c.addArea(m);
    var f = new IndicatorDataProvider(h + ".secondary", manager);
    o.setDataProvider(f.getName(), f);
    if (o.setIndicator(h, p) == false) {
        o.removeIndicator(h);
        return
    }
    var b = new MainAreaBackgroundPlotter(h + ".background", manager);
    o.setPlotter(b.getName(), b);
    b = new CGridPlotter(h + ".grid", manager);
    o.setPlotter(b.getName(), b);
    b = new IndicatorPlotter(h + ".secondary", manager);
    o.setPlotter(b.getName(), b);
    b = new IndicatorInfoPlotter(h + ".info", manager);
    o.setPlotter(b.getName(), b);
    b = new SelectionPlotter(h + ".selection", manager);
    o.setPlotter(b.getName(), b);
    b = new RangeAreaBackgroundPlotter(h + "Range.background", manager);
    o.setPlotter(b.getName(), b);
    b = new RangePlotter(h + "Range.main", manager);
    o.setPlotter(b.getName(), b);
    b = new RangeSelectionPlotter(h + "Range.selection", manager);
    o.setPlotter(b.getName(), b)
};
Template.createTimelineComps = function(d, manager) {
    var b = manager.getInstance();
    var c;
    var a = new Timeline(d,manager);
    b.setTimeline(a.getName(), a);
    c = new TimelineAreaBackgroundPlotter(d + ".timeline.background", manager);
    b.setPlotter(c.getName(), c);
    c = new TimelinePlotter(d + ".timeline.main", manager);
    b.setPlotter(c.getName(), c);
    c = new TimelineSelectionPlotter(d + ".timeline.selection", manager);
    b.setPlotter(c.getName(), c)
};
Template.createLiveOrderComps = function(c, manager) {
    var a = manager.getInstance();
    var b;
    b = new BackgroundPlotter(c + ".main.background", manager);
    a.setPlotter(b.getName(), b);
    b = new CLiveOrderPlotter(c + ".main.main", manager);
    a.setPlotter(b.getName(), b)
};
Template.createLiveTradeComps = function(c, manager) {
    var a = manager.getInstance();
    var b;
    b = new BackgroundPlotter(c + ".main.background", manager);
    a.setPlotter(b.getName(), b);
    b = new CLiveTradePlotter(c + ".main.main", manager);
    a.setPlotter(b.getName(), b)
};
var DefaultTemplate = create_class(Template);
DefaultTemplate.loadTemplate = function(g, b, manager) {
    var e = manager.getInstance();
    var c = ChartSettings.get(manager);
    var a = (new CName(g)).getCompAt(0);
    e.unloadTemplate(a);
    Template.createDataSource(g, b, Template.createCandlestickDataSource, manager);
    var f = new DockableLayout(a,manager);
    e.setFrame(f.getName(), f);
    e.setArea(f.getName(), f);
    f.setGridColor(Theme.Color.Grid1);
    var d = new TimelineArea(g + ".timeline", manager);
    e.setArea(d.getName(), d);
    f.addArea(d);
    d.setDockStyle(ChartArea.DockStyle.Bottom);
    d.Measuring.addHandler(d, TemplateMeasuringHandler.onMeasuring);
    var h = new TableLayout(g + ".charts", manager);
    e.setArea(h.getName(), h);
    h.setDockStyle(ChartArea.DockStyle.Fill);
    f.addArea(h);
    Template.createTableComps(g, manager);
    e.setThemeName(a, c.theme);
    return e
};