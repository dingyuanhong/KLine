//基础函数
function getRectCrossPt(h, c, f) {
    var b;
    var i = {
        x: -1,
        y: -1
    };
    var a = {
        x: -1,
        y: -1
    };
    var g = f.x - c.x;
    var d = f.y - c.y;
    if (Math.abs(g) < 2) {
        i = {
            x: c.x,
            y: h.top
        };
        a = {
            x: f.x,
            y: h.bottom
        };
        b = [i, a];
        return b
    }
    var e = d / g;
    a.x = h.right;
    a.y = c.y + (h.right - c.x) * e;
    i.x = h.left;
    i.y = c.y + (h.left - c.x) * e;
    b = [i, a];
    return b
}

//鼠标缩放
function mouseWheel(a, b) {
    ChartManager.getInstance().scale(b > 0 ? 1 : -1);
    ChartManager.getInstance().redraw("All", true);
    return false
}

var RefreshCounter = create_class();

RefreshCounter.prototype.__construct = function() {
    RefreshCounter.__super.__construct.call(this);
    this.count = 0;
    this.handler = setInterval(this.done.bind(this), 1000);;
}

RefreshCounter.prototype.done = function() {
    this.count++;
    var b = ChartManager.getInstance().getLanguage();

    if (this.count > 3600) {
        var a = new Number(this.count / 3600);
        if (b == "en-us") {
            $("#chart_updated_time_text").html(a.toFixed(0) + "h")
        } else {
            $("#chart_updated_time_text").html(a.toFixed(0) + "小时")
        }
    } else if (this.count > 60 && this.count <= 3600) {
        var a = new Number(this.count / 60);
        if (b == "en-us") {
            $("#chart_updated_time_text").html(a.toFixed(0) + "m")
        } else {
            $("#chart_updated_time_text").html(a.toFixed(0) + "分钟")
        }
    } else {
        if (this.count <= 60) {
            if (b == "en-us") {
                $("#chart_updated_time_text").html(this.count + "s")
            } else {
                $("#chart_updated_time_text").html(this.count + "秒")
            }
        }
    }
}

RefreshCounter.prototype.clear = function(){
    window.clearInterval(this.handler);
    this.count = 0;
    var a = ChartManager.getInstance().getLanguage();
    console.log(a);
    if (a == "en-us") {
        $("#chart_updated_time_text").html(this.count + "s")
    } else {
        $("#chart_updated_time_text").html(this.count + "秒")
    }
    this.handler = setInterval(this.done.bind(this), 1000);
}

var RequestSession = create_class(ChartSession);

RequestSession.prototype.__construct = function() {
    RequestSession.__super.__construct.call(this);
    this.HTTP_REQUEST = null;
    this.REQUEST_TIMTOUT = null;
    this.DATA = null;
    this.url = '';
    this.requestParam = '';
    this.refresh = new RefreshCounter()
    this.RequestLoading = null;
}

RequestSession.prototype.Abort = function(){
    if (this.HTTP_REQUEST && this.HTTP_REQUEST.readyState != 4) {
        this.HTTP_REQUEST.abort()
    }
}

RequestSession.prototype.Request = function(){
    this.Abort();
    window.clearTimeout(this.REQUEST_TIMTOUT);

    if(this.RequestLoading ){
        this.RequestLoading.before();
    }

    var self = this;
    this.HTTP_REQUEST = $.ajax({
        type: "post",
        url: self.url,
        dataType: "json",
        data: self.requestParam,
        timeout: 30000,
        created: Date.now(),
        beforeSend: function() {
            this.time = self.time_type;
            this.market = self.market_from
        },
        success: function(json) {
            if (self.HTTP_REQUEST) {
                if (this.time != self.time_type || this.market != self.market_from) {
                    self.REQUEST_TIMTOUT = setTimeout(self.Retry.bind(self), 1000);
                    return
                }
                try {
                    if(!self.Parse(json)) {
                        self.REQUEST_TIMTOUT = setTimeout(self.Retry.bind(self), 2*1000);
                        return false;
                    }

                    if(this.refresh) {
                        this.refresh.clear();
                    }
                } catch (err) {
                    if (err == "data error") {
                        self.requestParam = setHttpRequestParam(GLOBAL_VAR.market_from, GLOBAL_VAR.time_type, GLOBAL_VAR.limit, null);
                        self.REQUEST_TIMTOUT = setTimeout(self.Retry.bind(self), 1000);
                        return
                    }
                }
                self.REQUEST_TIMTOUT = setTimeout(self.Retry.bind(self), 8 * 1000);
                
                if(this.RequestLoading ){
                    this.RequestLoading.end();
                    this.RequestLoading = null;
                }
                ChartManager.getInstance().redraw("All", false)
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            if (xhr.status == 200 && xhr.readyState == 4) {
                return
            }
            self.REQUEST_TIMTOUT = setTimeout(self.Retry.bind(self),1000)
        },
        complete: function() {
            self.HTTP_REQUEST = null
        }
    })
}

RequestSession.prototype.Parse = function(json){
    if (!json) {
        return false
    }
    if (!json.isSuc) {
        return false
    }
    var self = this;

    self.market_from_name = json.datas.marketName;
    var chart = ChartManager.getInstance().getChart();
    chart._contract_unit = json.datas.contractUnit;
    chart._money_type = json.datas.moneyType;
    chart._usd_cny_rate = json.datas.USDCNY;
    chart.setTitle();

    self.DATA = json.datas.data;

    if (!self.chartMgr.updateData("frame0.k0", self.DATA)) {
        //推送点下次请求
        self.REQUEST_TIMTOUT = setTimeout(self.Retry.bind(self), 2*1000);//可用
        return false;
    }
    return true;
}

RequestSession.prototype.Param = function(){
    function param(b, c, a, e) {
        var d = "needTickers=1&symbol=" + b + "&type=" + c;
        if (a != null) {
            d += "&size=" + a
        } else {
            d += "&since=" + e
        }
        return d
    }

    var a = this.chartMgr.getDataSource("frame0.k0").getLastDate();
    if (a == -1) {
        this.requestParam = param(this.market_from, this.time_type, this.limit, null)
    } else {
        this.requestParam = param(this.market_from, this.time_type, null, a.toString())
    }
}

RequestSession.prototype.Retry = function() {
    this.Param();
    this.Request();
}


var RequestLoading = create_class()
RequestLoading.prototype.before = function(){
    $("#chart_loading").addClass("activated")
}

RequestLoading.prototype.end = function(){
    $("#chart_loading").removeClass("activated");
}

//会话
var GlobalSession = create_class(RequestSession);

GlobalSession.prototype.__construct = function() {
    RequestSession.__super.__construct.call(this);

    this.button_down = false
    this.init = false

    this.RequestLoading = new RequestLoading();
}

GlobalSession.prototype.setParam = function(lastTime) {
}
GlobalSession.prototype.request = function() {
    this.Retry();
}

var GLOBAL_VAR = new GlobalSession()
ChartManager.getInstance(GLOBAL_VAR);

//循环请求数据
function RequestDataTimerLoop(session,url,market) {
    session.url = url;
    session.market_from = market;

    //每分钟开始更新图
    setInterval(function() {
        var d = new Date();
        if (d.getSeconds() == 0 && session.time_type == "1min") {
            session.Retry();
        }
    }, 1000);
    setInterval(function() {
        var d = new Date();
        if (d.getMinutes() % 3 == 0 && session.time_type == "3min") {
            //K线3分钟线即时数据
            session.Retry();
        }
        if (d.getMinutes() % 5 == 0 && session.time_type == "5min") {
            //K线5分钟线每五分钟更新
            session.Retry();
        }
        if (d.getMinutes() % 15 == 0 && session.time_type == "15min") {
            //K线15分钟线周期更新
            session.Retry();
        }
        if (d.getMinutes() % 30 == 0 && session.time_type == "30min") {
            //三十分钟线即时点
            session.Retry();
        }
        if (d.getMinutes() == 0 && session.time_type == "1hour") {
            //请求1小时线即时点
            session.Retry();
        }
    }, 1000 * 60);
}

//币种id
var biType = "@ViewBag.biType";
//var klineUrl = "http://localhost:8083/KlineTest/GetKline";
var klineUrl = "/Kline/GetKline?biType=@ViewBag.biType";

RequestDataTimerLoop(GLOBAL_VAR,klineUrl,biType);

var KLineObject = {};
KLineObject.Object = GLOBAL_VAR;
KLineObject.kline = new Kline(KLineObject);

KLineObject._setMarketFrom = function(a) {
    Template.displayVolume = false;
    KLineObject.refreshTemplate();
    KLineObject.readCookie();
    ChartManager.getInstance().getChart().setMarketFrom(a)
};
KLineObject._set_current_language = function(a) {
    switch_language(a)
};
KLineObject._set_current_depth = function(a) {
    ChartManager.getInstance().getChart().updateDepth(a)
};
KLineObject._set_current_url = function(a) {
    KLineObject.Object.url = a
};
KLineObject._set_current_contract_unit = function(a) {
    ChartManager.getInstance().getChart().setCurrentContractUnit(a)
};
KLineObject._set_money_type = function(a) {
    ChartManager.getInstance().getChart().setCurrentMoneyType(a)
};
KLineObject._set_usd_cny_rate = function(a) {
    ChartManager.getInstance().getChart()._usd_cny_rate = a
};
KLineObject._setCaptureMouseWheelDirectly = function(a) {
    ChartManager.getInstance().setCaptureMouseWheelDirectly(a)
};

KLineObject.refreshTemplate = function () {
    DefaultTemplate.loadTemplate("frame0.k0", KLineObject.Object.market_from, ChartManager.getInstance());
    ChartManager.getInstance().redraw("All", true)
}

KLineObject.readCookie = function () {
    var kline = KLineObject.kline;
    ChartSettings.get();
    ChartSettings.save();
    var b = ChartSettings.get();
    ChartManager.getInstance().setChartStyle("frame0.k0", b.charts.chartStyle);
    var e = b.charts.market_from;
    if (!KLineObject.Object.init) {
        e = kline.symbol;
        KLineObject.Object.init = true
    }
    KLineObject.Object.market_from = e;
    KLineSwitch.switch_market_selected(e);
    var d = b.charts.period;
    KLineSwitch.switch_period(d);
    $("#chart_period_" + d + "_v a").addClass("selected");
    $("#chart_period_" + d + "_h a").addClass("selected");
    if (b.charts.indicsStatus == "close") {
        KLineSwitch.switch_indic("off")
    } else {
        if (b.charts.indicsStatus == "open") {
            KLineSwitch.switch_indic("on")
        }
    }
    var a = $("#chart_select_main_indicator");
    a.find("a").each(function() {
        if ($(this).attr("name") == b.charts.mIndic) {
            $(this).addClass("selected")
        }
    });
    var c = $("#chart_select_chart_style");
    c.find("a").each(function() {
        if ($(this)[0].innerHTML == b.charts.chartStyle) {
            $(this).addClass("selected")
        }
    });
    ChartManager.getInstance().getChart().setMainIndicator(b.charts.mIndic);
    ChartManager.getInstance().setThemeName("frame0", b.theme);
    KLineSwitch.switch_tools("off");
    if (b.theme == "Dark") {
        KLineSwitch.switch_theme("dark")
    } else {
        if (b.theme == "Light") {
            KLineSwitch.switch_theme("light")
        }
    }
    KLineSwitch.switch_language(b.language || "zh-cn")
}


var KLineSwitch = {}

KLineSwitch.on_size = function () {
    //var u = window.innerWidth;
    //var t = window.innerHeight;
    var u = window.innerWidth - 250;
    var t = window.innerHeight - 41;
    var o = $("#chart_container");
    o.css({
        width: u + "px",
        height: t + "px"
    });
    var z = $("#chart_toolbar");
    var p = $("#chart_toolpanel");
    var s = $("#chart_canvasGroup");
    var B = $("#chart_tabbar");
    var G = p[0].style.display != "inline" ? false : true;
    var n = B[0].style.display != "block" ? false : true;
    var v = {};
    v.x = 0;
    v.y = 0;
    v.w = u;
    v.h = 29;
    var f = {};
    f.x = 0;
    f.y = v.h + 1;
    f.w = G ? 32 : 0;
    f.h = t - f.y;
    var A = {};
    A.w = G ? u - (f.w + 1) : u;
    A.h = n ? 22 : -1;
    A.x = u - A.w;
    A.y = t - (A.h + 1);
    var w = {};
    w.x = A.x;
    w.y = f.y;
    w.w = A.w;
    w.h = A.y - f.y;
    z.css({
        left: v.x + "px",
        top: v.y + "px",
        width: v.w + "px",
        height: v.h + "px"
    });
    if (G) {
        p.css({
            left: f.x + "px",
            top: f.y + "px",
            width: f.w + "px",
            height: f.h + "px"
        })
    }
    s.css({
        left: w.x + "px",
        top: w.y + "px",
        width: w.w + "px",
        height: w.h + "px"
    });
    var x = $("#chart_mainCanvas")[0];
    var g = $("#chart_overlayCanvas")[0];
    x.width = w.w;
    x.height = w.h;
    g.width = w.w;
    g.height = w.h;
    if (n) {
        B.css({
            left: A.x + "px",
            top: A.y + "px",
            width: A.w + "px",
            height: A.h + "px"
        })
    }
    var j = $("#chart_parameter_settings");
    j.css({
        left: (u - j.width()) >> 1,
        top: (t - j.height()) >> 1
    });
    var c = $("#chart_loading");
    c.css({
        left: (u - c.width()) >> 1,
        top: (t - c.height()) >> 2
    });
    var l = $("#chart_dom_elem_cache");
    var a = $("#chart_select_theme")[0];
    var E = $("#chart_enable_tools")[0];
    var h = $("#chart_enable_indicator")[0];
    var r = $("#chart_toolbar_periods_vert");
    var D = $("#chart_toolbar_periods_horz")[0];
    var q = $("#chart_show_indicator")[0];
    var i = $("#chart_show_tools")[0];
    var e = $("#chart_toolbar_theme")[0];
    var k = $("#chart_dropdown_settings");
    var b = r[0].offsetWidth;
    var y = b + D.offsetWidth;
    var m = y + q.offsetWidth + 4;
    var F = m + i.offsetWidth + 4;
    var C = F + e.offsetWidth;
    var d = k.find(".chart_dropdown_t")[0].offsetWidth + 150;
    b += d;
    y += d;
    m += d;
    F += d;
    C += d;
    if (u < y) {
        l.append(D)
    } else {
        r.after(D)
    }
    if (u < m) {
        l.append(q);
        h.style.display = ""
    } else {
        k.before(q);
        h.style.display = "none"
    }
    if (u < F) {
        l.append(i);
        E.style.display = ""
    } else {
        k.before(i);
        E.style.display = "none"
    }
    if (u < C) {
        l.append(e);
        a.style.display = ""
    } else {
        k.before(e);
        a.style.display = "none"
    }
    if (u < 1050) {
        $("#chart_updated_time").css("display", "none")
    } else {
        $("#chart_updated_time").css("display", "")
    }
    if (u < 900) {
        $("#chart_language_setting_div").css("display", "none")
    } else {
        $("#chart_language_setting_div").css("display", "")
    }
    if (u < 280) {
        $("#chart_exchanges_setting_div").css("display", "none")
    } else {
        $("#chart_exchanges_setting_div").css("display", "")
    }
    ChartManager.getInstance().redraw("All", true)
}

//切换语言
KLineSwitch.switch_language = function (b) {
    var a = b.replace(/-/, "_");
    $("#chart_language_switch_tmp").find("span").each(function() {
        var d = $(this).attr("name");
        var c = $(this).attr(a);
        d = "." + d;
        var e = $(d)[0];
        if (!e) {
            return
        }
        $(d).each(function() {
            $(this)[0].innerHTML = c
        })
    });
    $("#chart_language_setting_div li a[name='" + b + "']").addClass("selected");
    ChartManager.getInstance().setLanguage(b);
    ChartManager.getInstance().getChart().setTitle();
    var a = ChartSettings.get();
    a.language = b;
    ChartSettings.save()
}
//切换主题
KLineSwitch.switch_theme = function (c) {
    $("#chart_toolbar_theme a").removeClass("selected");
    $("#chart_select_theme a").removeClass("selected");
    $("#chart_toolbar_theme").find("a").each(function() {
        if ($(this).attr("name") == c) {
            $(this).addClass("selected")
        }
    });
    $("#chart_select_theme a").each(function() {
        if ($(this).attr("name") == c) {
            $(this).addClass("selected")
        }
    });
    $("#chart_container").attr("class", c);
    $(".marketName_ a").attr("class", c);
    if (c == "dark") {
        $("#trade_container").addClass("dark").removeClass("light");
        //$("#markettop").addClass("dark").removeClass("light");
        ChartManager.getInstance().setThemeName("frame0", "Dark");
        var d = ChartSettings.get();
        d.theme = "Dark";
        ChartSettings.save();
    } else {
        if (c == "light") {
            $("#trade_container").addClass("light").removeClass("dark");
            //$("#markettop").addClass("light").removeClass("dark");
            ChartManager.getInstance().setThemeName("frame0", "Light");
            var d = ChartSettings.get();
            d.theme = "Light";
            ChartSettings.save();
        }
    }
    var b = {};
    b.command = "set current theme";
    b.content = c;
    $("#chart_output_interface_text").val(JSON.stringify(b));
    $("#chart_output_interface_submit").submit();
    ChartManager.getInstance().redraw();
}
//切换工具
KLineSwitch.switch_tools = function (a) {
    $(".chart_dropdown_data").removeClass("chart_dropdown-hover");
    $("#chart_toolpanel .chart_toolpanel_button").removeClass("selected");
    $("#chart_enable_tools a").removeClass("selected");
    if (a == "on") {
        $("#chart_show_tools").addClass("selected");
        $("#chart_enable_tools a").each(function() {
            if ($(this).attr("name") == "on") {
                $(this).addClass("selected")
            }
        });
        $("#chart_toolpanel")[0].style.display = "inline";
        if (ChartManager.getInstance()._drawingTool == ChartManager.DrawingTool.Cursor) {
            $("#chart_Cursor").parent().addClass("selected")
        } else {
            if (ChartManager.getInstance()._drawingTool == ChartManager.DrawingTool.CrossCursor) {
                $("#chart_CrossCursor").parent().addClass("selected")
            }
        }
    } else {
        if (a == "off") {
            $("#chart_show_tools").removeClass("selected");
            $("#chart_enable_tools a").each(function() {
                if ($(this).attr("name") == "off") {
                    $(this).addClass("selected")
                }
            });
            $("#chart_toolpanel")[0].style.display = "none";
            ChartManager.getInstance().setRunningMode(ChartManager.getInstance()._beforeDrawingTool);
            ChartManager.getInstance().redraw("All", true)
        }
    }
    KLineSwitch.on_size()
}

KLineSwitch.switch_indic = function (a) {
    $("#chart_enable_indicator a").removeClass("selected");
    $("#chart_enable_indicator a[name='" + a + "']").addClass("selected");
    if (a == "on") {
        $("#chart_show_indicator").addClass("selected");
        var b = ChartSettings.get();
        b.charts.indicsStatus = "open";
        ChartSettings.save();
        var c = b.charts.indics[1];
        if (Template.displayVolume == false) {
            ChartManager.getInstance().getChart().setIndicator(2, c)
        } else {
            ChartManager.getInstance().getChart().setIndicator(2, c)
        }
        $("#chart_tabbar").find("a").each(function() {
            if ($(this).attr("name") == c) {
                $(this).addClass("selected")
            }
        });
        $("#chart_tabbar")[0].style.display = "block"
    } else {
        if (a == "off") {
            $("#chart_show_indicator").removeClass("selected");
            ChartManager.getInstance().getChart().setIndicator(2, "NONE");
            var b = ChartSettings.get();
            b.charts.indicsStatus = "close";
            ChartSettings.save();
            $("#chart_tabbar")[0].style.display = "none";
            $("#chart_tabbar a").removeClass("selected")
        }
    }
    KLineSwitch.on_size()
}

KLineSwitch.switch_period = function (a) {
    function calcPeriodWeight(d) {
        var a = d;
        if (d != "line") {
            a = GLOBAL_VAR.periodMap[GLOBAL_VAR.tagMapPeriod[d]]
        }
        var c = ChartSettings.get().charts.period_weight;
        for (var b in c) {
            if (c[b] > c[a]) {
                c[b] -= 1
            }
        }
        c[a] = 8;
        ChartSettings.save();
        $("#chart_toolbar_periods_horz").find("li").each(function() {
            var e = $(this).attr("name");
            var f = e;
            if (e != "line") {
                f = GLOBAL_VAR.periodMap[GLOBAL_VAR.tagMapPeriod[e]]
            }
            if (c[f] == 0) {
                $(this).css("display", "none")
            } else {
                $(this).css("display", "inline-block")
            }
        })
    };

    $("#chart_container .chart_toolbar_tabgroup a").removeClass("selected");
    $("#chart_toolbar_periods_vert ul a").removeClass("selected");
    $("#chart_container .chart_toolbar_tabgroup a").each(function() {
        if ($(this).parent().attr("name") == a) {
            $(this).addClass("selected")
        }
    });
    $("#chart_toolbar_periods_vert ul a").each(function() {
        if ($(this).parent().attr("name") == a) {
            $(this).addClass("selected")
        }
    });
    ChartManager.getInstance().showCursor();
    calcPeriodWeight(a);
    if (a == "line") {
        ChartManager.getInstance().getChart().strIsLine = true;
        ChartManager.getInstance().setChartStyle("frame0.k0", "Line");
        ChartManager.getInstance().getChart().setCurrentPeriod("01m");
        var b = ChartSettings.get();
        b.charts.period = a;
        ChartSettings.save();
        return
    }
    ChartManager.getInstance().getChart().strIsLine = false;
    var c = GLOBAL_VAR.tagMapPeriod[a];
    ChartManager.getInstance().setChartStyle("frame0.k0", ChartSettings.get().charts.chartStyle);
    ChartManager.getInstance().getChart().setCurrentPeriod(c);
    var b = ChartSettings.get();
    b.charts.period = a;
    ChartSettings.save()

    KLineObject.kline.title = ChartManager.getInstance().getTitle("frame0.k0");
    KLineObject.kline.setTitle();
}

KLineSwitch.switch_market_selected = function (b) {
    KLineObject.kline.reset(b);
    $(".market_chooser ul a").removeClass("selected");
    $(".market_chooser ul a[name='" + b + "']").addClass("selected");
    ChartManager.getInstance().getChart()._market_from = b;
    var a = ChartSettings.get();
    a.charts.market_from = b;
    ChartSettings.save()
}

KLineSwitch.switch_market = function (b) {
    KLineSwitch.switch_market_selected(b);
    var a = ChartSettings.get();
    if (a.charts.period == "line") {
        ChartManager.getInstance().getChart().strIsLine = true;
        ChartManager.getInstance().setChartStyle("frame0.k0", "Line")
    } else {
        ChartManager.getInstance().getChart().strIsLine = false;
        ChartManager.getInstance().setChartStyle("frame0.k0", ChartSettings.get().charts.chartStyle)
    }
    ChartManager.getInstance().getChart().setMarketFrom(b)
}

function KLineMouseEvent() {
    $(document).ready(function() {
        function a() {
            if (navigator.userAgent.indexOf("Firefox") >= 0) {
                setTimeout(KLineSwitch.on_size, 200)
            } else {
                KLineSwitch.on_size()
            }
        }
        a();
        $(window).resize(a);
        $("#chart_overlayCanvas").bind("contextmenu",
            function(b) {
                b.cancelBubble = true;
                b.returnValue = false;
                b.preventDefault();
                b.stopPropagation();
                return false
            });
        $("#chart_container .chart_dropdown .chart_dropdown_t").mouseover(function() {
            var b = $("#chart_container");
            var h = $(this);
            var k = h.next();
            var c = b.offset().left;
            var e = h.offset().left;
            var i = b.width();
            var j = h.width();
            var g = k.width();
            var f = ((g - j) / 2) << 0;
            if (e - f < c + 4) {
                f = e - c - 4
            } else {
                if (e + j + f > c + i - 4) {
                    f += e + j + f - (c + i - 4) + 19
                } else {
                    f += 4
                }
            }
            k.css({
                "margin-left": -f
            });
            h.addClass("chart_dropdown-hover");
            k.addClass("chart_dropdown-hover")
        }).mouseout(function() {
            $(this).next().removeClass("chart_dropdown-hover");
            $(this).removeClass("chart_dropdown-hover")
        });
        $(".chart_dropdown_data").mouseover(function() {
            $(this).addClass("chart_dropdown-hover");
            $(this).prev().addClass("chart_dropdown-hover")
        }).mouseout(function() {
            $(this).prev().removeClass("chart_dropdown-hover");
            $(this).removeClass("chart_dropdown-hover")
        });
        $("#chart_btn_parameter_settings").click(function() {
            $("#chart_parameter_settings").addClass("clicked");
            $(".chart_dropdown_data").removeClass("chart_dropdown-hover");
            $("#chart_parameter_settings").find("th").each(function() {
                var c = $(this).html();
                var b = 0;
                var d = ChartSettings.get();
                var e = d.indics[c];
                $(this.nextElementSibling).find("input").each(function() {
                    if (e != null && b < e.length) {
                        $(this).val(e[b])
                    }
                    b++
                })
            })
        });
        $("#close_settings").click(function() {
            $("#chart_parameter_settings").removeClass("clicked")
        });
        $("#chart_container .chart_toolbar_tabgroup a").click(function() {
            KLineSwitch.switch_period($(this).parent().attr("name"))
        });
        $("#chart_toolbar_periods_vert ul a").click(function() {
            KLineSwitch.switch_period($(this).parent().attr("name"))
        });
        $(".market_chooser ul a").click(function() {
            KLineSwitch.switch_market($(this).attr("name"))
        });
        $("#chart_show_tools").click(function() {
            if ($(this).hasClass("selected")) {
                KLineSwitch.switch_tools("off")
            } else {
                KLineSwitch.switch_tools("on")
            }
        });
        $("#chart_toolpanel .chart_toolpanel_button").click(function() {
            $(".chart_dropdown_data").removeClass("chart_dropdown-hover");
            $("#chart_toolpanel .chart_toolpanel_button").removeClass("selected");
            $(this).addClass("selected");
            var b = $(this).children().attr("name");
            GLOBAL_VAR.chartMgr.setRunningMode(ChartManager.DrawingTool[b])
        });
        $("#chart_show_indicator").click(function() {
            if ($(this).hasClass("selected")) {
                KLineSwitch.switch_indic("off")
            } else {
                KLineSwitch.switch_indic("on")
            }
        });
        $("#chart_tabbar li a").click(function() {
            $("#chart_tabbar li a").removeClass("selected");
            $(this).addClass("selected");
            var b = $(this).attr("name");
            var c = ChartSettings.get();
            c.charts.indics[1] = b;
            ChartSettings.save();
            if (Template.displayVolume == false) {
                ChartManager.getInstance().getChart().setIndicator(1, b)
            } else {
                ChartManager.getInstance().getChart().setIndicator(2, b)
            }
        });
        $("#chart_select_chart_style a").click(function() {
            $("#chart_select_chart_style a").removeClass("selected");
            $(this).addClass("selected");
            var b = ChartSettings.get();
            b.charts.chartStyle = $(this)[0].innerHTML;
            ChartSettings.save();
            var c = ChartManager.getInstance();
            c.setChartStyle("frame0.k0", $(this).html());
            c.redraw()
        });
        $("#chart_dropdown_themes li").click(function() {
            $("#chart_dropdown_themes li a").removeClass("selected");
            var b = $(this).attr("name");
            if (b == "chart_themes_dark") {
                KLineSwitch.switch_theme("dark")
            } else if (b == "chart_themes_light") {
                KLineSwitch.switch_theme("light")
            }
        });
        $("#chart_select_main_indicator a").click(function() {
            $("#chart_select_main_indicator a").removeClass("selected");
            $(this).addClass("selected");
            var b = $(this).attr("name");
            var c = ChartSettings.get();
            c.charts.mIndic = b;
            ChartSettings.save();
            var d = ChartManager.getInstance();
            if (!d.setMainIndicator("frame0.k0", b)) {
                d.removeMainIndicator("frame0.k0")
            }
            d.redraw()
        });
        $("#chart_toolbar_theme a").click(function() {
            $("#chart_toolbar_theme a").removeClass("selected");
            if ($(this).attr("name") == "dark") {
                KLineSwitch.switch_theme("dark")
            } else if ($(this).attr("name") == "light") {
                KLineSwitch.switch_theme("light")
            }
        });
        $("#chart_select_theme li a").click(function() {
            $("#chart_select_theme a").removeClass("selected");
            if ($(this).attr("name") == "dark") {
                KLineSwitch.switch_theme("dark")
            } else if ($(this).attr("name") == "light") {
                KLineSwitch.switch_theme("light")
            }
        });
        $("#chart_enable_tools li a").click(function() {
            $("#chart_enable_tools a").removeClass("selected");
            if ($(this).attr("name") == "on") {
                KLineSwitch.switch_tools("on")
            } else if ($(this).attr("name") == "off") {
                KLineSwitch.switch_tools("off")
            }
        });
        $("#chart_enable_indicator li a").click(function() {
            $("#chart_enable_indicator a").removeClass("selected");
            if ($(this).attr("name") == "on") {
                KLineSwitch.switch_indic("on")
            } else if ($(this).attr("name") == "off") {
                KLineSwitch.switch_indic("off")
            }
        });
        $("#chart_language_setting_div li a").click(function() {
            $("#chart_language_setting_div a").removeClass("selected");
            if ($(this).attr("name") == "zh-cn") {
                KLineSwitch.switch_language("zh-cn")
            } else {
                if ($(this).attr("name") == "en-us") {
                    KLineSwitch.switch_language("en-us")
                } else {
                    if ($(this).attr("name") == "zh-tw") {
                        KLineSwitch.switch_language("zh-tw")
                    }
                }
            }
        });
        $(document).keyup(function(b) {
            if (b.keyCode == 46) {
                ChartManager.getInstance().deleteToolObject();
                ChartManager.getInstance().redraw("OverlayCanvas", false)
            }
        });
        $("#clearCanvas").click(function() {
            var d = ChartManager.getInstance().getDataSource("frame0.k0");
            var b = d.getToolObjectCount();
            for (var c = 0; c < b; c++) {
                d.delToolObject()
            }
            ChartManager.getInstance().redraw("OverlayCanvas", false)
        });
        $("#chart_overlayCanvas").mousemove(function(f) {
            var c = f.target.getBoundingClientRect();
            var b = f.clientX - c.left;
            var g = f.clientY - c.top;
            var d = ChartManager.getInstance();
            if (GLOBAL_VAR.button_down == true) {
                d.onMouseMove("frame0", b, g, true);
                d.redraw("All", false)
            } else {
                d.onMouseMove("frame0", b, g, false);
                d.redraw("OverlayCanvas")
            }
        }).mouseleave(function(f) {
            var c = f.target.getBoundingClientRect();
            var b = f.clientX - c.left;
            var g = f.clientY - c.top;
            var d = ChartManager.getInstance();
            d.onMouseLeave("frame0", b, g, false);
            d.redraw("OverlayCanvas")
        }).mouseup(function(f) {
            if (f.which != 1) {
                return
            }
            GLOBAL_VAR.button_down = false;
            var c = f.target.getBoundingClientRect();
            var b = f.clientX - c.left;
            var g = f.clientY - c.top;
            var d = ChartManager.getInstance();
            d.onMouseUp("frame0", b, g);
            d.redraw("All")
        }).mousedown(function(d) {
            if (d.which != 1) {
                ChartManager.getInstance().deleteToolObject();
                ChartManager.getInstance().redraw("OverlayCanvas", false);
                return
            }
            GLOBAL_VAR.button_down = true;
            var c = d.target.getBoundingClientRect();
            var b = d.clientX - c.left;
            var f = d.clientY - c.top;
            ChartManager.getInstance().onMouseDown("frame0", b, f)
        });
        $("#chart_parameter_settings :input").change(function() {
            var d = $(this).attr("name");
            var c = 0;
            var f = [];
            var h = ChartManager.getInstance();
            $("#chart_parameter_settings :input").each(function() {
                if ($(this).attr("name") == d) {
                    if ($(this).val() != "" && $(this).val() != null && $(this).val() != undefined) {
                        var j = parseInt($(this).val());
                        f.push(j)
                    }
                    c++
                }
            });
            if (f.length != 0) {
                h.setIndicatorParameters(d, f);
                var g = h.getIndicatorParameters(d);
                var b = [];
                c = 0;
                $("#chart_parameter_settings :input").each(function() {
                    if ($(this).attr("name") == d) {
                        if ($(this).val() != "" && $(this).val() != null && $(this).val() != undefined) {
                            $(this).val(g[c].getValue());
                            b.push(g[c].getValue())
                        }
                        c++
                    }
                });
                var e = ChartSettings.get();
                e.indics[d] = b;
                ChartSettings.save();
                h.redraw("All", false)
            }
        });
        $("#chart_parameter_settings button").click(function() {
            var c = $(this).parents("tr").children("th").html();
            var b = 0;
            var f = ChartManager.getInstance().getIndicatorParameters(c);
            var e = [];
            $(this).parent().prev().children("input").each(function() {
                if (f != null && b < f.length) {
                    $(this).val(f[b].getDefaultValue());
                    e.push(f[b].getDefaultValue())
                }
                b++
            });
            ChartManager.getInstance().setIndicatorParameters(c, e);
            var d = ChartSettings.get();
            d.indics[c] = e;
            ChartSettings.save();
            ChartManager.getInstance().redraw("All", false)
        })
    })
}

var main = function() {
    KLineMouseEvent();

    ChartManager.getInstance().bindCanvas("main", document.getElementById("chart_mainCanvas"));
    ChartManager.getInstance().bindCanvas("overlay", document.getElementById("chart_overlayCanvas"));
    KLineObject.refreshTemplate();
    KLineObject.readCookie();
    $("#chart_container").css({
        visibility: "visible"
    })

    KLineSwitch.on_size();
}();
