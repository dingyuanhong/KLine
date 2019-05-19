var theme_color_id = 0;
var theme_font_id = 0;
var Theme = create_class();
Theme.prototype.getColor = function(a) {
    return this._colors[a]
};
Theme.prototype.getFont = function(a) {
    return this._fonts[a]
};
Theme.Color = {
    Positive: theme_color_id++,
    Negative: theme_color_id++,
    PositiveDark: theme_color_id++,
    NegativeDark: theme_color_id++,
    Unchanged: theme_color_id++,
    Background: theme_color_id++,
    Cursor: theme_color_id++,
    RangeMark: theme_color_id++,
    Indicator0: theme_color_id++,
    Indicator1: theme_color_id++,
    Indicator2: theme_color_id++,
    Indicator3: theme_color_id++,
    Indicator4: theme_color_id++,
    Indicator5: theme_color_id++,
    Grid0: theme_color_id++,
    Grid1: theme_color_id++,
    Grid2: theme_color_id++,
    Grid3: theme_color_id++,
    Grid4: theme_color_id++,
    TextPositive: theme_color_id++,
    TextNegative: theme_color_id++,
    Text0: theme_color_id++,
    Text1: theme_color_id++,
    Text2: theme_color_id++,
    Text3: theme_color_id++,
    Text4: theme_color_id++,
    LineColorNormal: theme_color_id++,
    LineColorSelected: theme_color_id++,
    CircleColorFill: theme_color_id++,
    CircleColorStroke: theme_color_id++
};
Theme.Font = {
    Default: theme_font_id++
};
var DarkTheme = create_class(Theme);
//黑色背景
DarkTheme.prototype.__construct = function() {
    this._colors = [];
    this._colors[Theme.Color.Positive] = "#FF3232"; //涨价 红色
    this._colors[Theme.Color.Negative] = "#00ba53"; //跌价 绿色
    this._colors[Theme.Color.PositiveDark] = "#004718";
    this._colors[Theme.Color.NegativeDark] = "#3b0e08";
    this._colors[Theme.Color.Unchanged] = "#fff";
    this._colors[Theme.Color.Background] = "#0a0a0a";
    this._colors[Theme.Color.Cursor] = "#aaa";
    this._colors[Theme.Color.RangeMark] = "#f9ee30";
    this._colors[Theme.Color.Indicator0] = "#ddd";
    this._colors[Theme.Color.Indicator1] = "#f9ee30";
    this._colors[Theme.Color.Indicator2] = "#f600ff";
    this._colors[Theme.Color.Indicator3] = "#6bf";
    this._colors[Theme.Color.Indicator4] = "#a5cf81";
    this._colors[Theme.Color.Indicator5] = "#e18b89";
    this._colors[Theme.Color.Grid0] = "#333";
    this._colors[Theme.Color.Grid1] = "#444";
    this._colors[Theme.Color.Grid2] = "#666";
    this._colors[Theme.Color.Grid3] = "#888";
    this._colors[Theme.Color.Grid4] = "#aaa";
    this._colors[Theme.Color.TextPositive] = "#1bd357";
    this._colors[Theme.Color.TextNegative] = "#ff6f5e";
    this._colors[Theme.Color.Text0] = "#444";
    this._colors[Theme.Color.Text1] = "#666";
    this._colors[Theme.Color.Text2] = "#888";
    this._colors[Theme.Color.Text3] = "#aaa";
    this._colors[Theme.Color.Text4] = "#ccc";
    this._colors[Theme.Color.LineColorNormal] = "#a6a6a6";
    this._colors[Theme.Color.LineColorSelected] = "#ffffff";
    this._colors[Theme.Color.CircleColorFill] = "#000000";
    this._colors[Theme.Color.CircleColorStroke] = "#ffffff";
    this._fonts = [];
    this._fonts[Theme.Font.Default] = "12px Tahoma"
};
var LightTheme = create_class(Theme);
//白色背景
LightTheme.prototype.__construct = function() {
    this._colors = [];
    this._colors[Theme.Color.Positive] = "#db5542"; //红色，涨价
    this._colors[Theme.Color.Negative] = "#53b37b"; //绿色，跌价
    this._colors[Theme.Color.PositiveDark] = "#66d293";
    this._colors[Theme.Color.NegativeDark] = "#ffadaa";
    this._colors[Theme.Color.Unchanged] = "#fff";
    this._colors[Theme.Color.Background] = "#fff";
    this._colors[Theme.Color.Cursor] = "#aaa";
    this._colors[Theme.Color.RangeMark] = "#f27935";
    this._colors[Theme.Color.Indicator0] = "#2fd2b2";
    this._colors[Theme.Color.Indicator1] = "#ffb400";
    this._colors[Theme.Color.Indicator2] = "#e849b9";
    this._colors[Theme.Color.Indicator3] = "#1478c8";
    this._colors[Theme.Color.Grid0] = "#eee";
    this._colors[Theme.Color.Grid1] = "#afb1b3";
    this._colors[Theme.Color.Grid2] = "#ccc";
    this._colors[Theme.Color.Grid3] = "#bbb";
    this._colors[Theme.Color.Grid4] = "#aaa";
    this._colors[Theme.Color.TextPositive] = "#53b37b";
    this._colors[Theme.Color.TextNegative] = "#db5542";
    this._colors[Theme.Color.Text0] = "#ccc";
    this._colors[Theme.Color.Text1] = "#aaa";
    this._colors[Theme.Color.Text2] = "#888";
    this._colors[Theme.Color.Text3] = "#666";
    this._colors[Theme.Color.Text4] = "#444";
    this._colors[Theme.Color.LineColorNormal] = "#8c8c8c";
    this._colors[Theme.Color.LineColorSelected] = "#393c40";
    this._colors[Theme.Color.CircleColorFill] = "#ffffff";
    this._colors[Theme.Color.CircleColorStroke] = "#393c40";
    this._fonts = [];
    this._fonts[Theme.Font.Default] = "12px Tahoma"
};