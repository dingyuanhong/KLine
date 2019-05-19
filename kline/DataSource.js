var DataSource = create_class(NamedObject);
DataSource.prototype.__construct = function(a) {
    DataSource.__super.__construct.call(this, a)
};
DataSource.UpdateMode = {
    DoNothing: 0,
    Refresh: 1,
    Update: 2,
    Append: 3
};
DataSource.prototype.getUpdateMode = function() {
    return this._updateMode
};
DataSource.prototype.setUpdateMode = function(a) {
    this._updateMode = a
};
DataSource.prototype.getCacheSize = function() {
    return 0
};
DataSource.prototype.getDataCount = function() {
    return 0
};
var MainDataSource = create_class(DataSource);
MainDataSource.prototype.__construct = function(a, m) {
    MainDataSource.__super.__construct.call(this, a);
    this._manager = m;
    this._erasedCount = 0;
    this._dataItems = [];
    this._decimalDigits = 0;
    this.toolManager = new CToolManager(a)
};
MainDataSource.prototype.getCacheSize = function() {
    return this._dataItems.length
};
MainDataSource.prototype.getDataCount = function() {
    return this._dataItems.length
};
MainDataSource.prototype.getUpdatedCount = function() {
    return this._updatedCount
};
MainDataSource.prototype.getAppendedCount = function() {
    return this._appendedCount
};
MainDataSource.prototype.getErasedCount = function() {
    return this._erasedCount
};
MainDataSource.prototype.getDecimalDigits = function() {
    return this._decimalDigits
};
MainDataSource.prototype.calcDecimalDigits = function(a) {
    var c = "" + a;
    var b = c.indexOf(".");
    if (b < 0) {
        return 0
    }
    return (c.length - 1) - b
};
MainDataSource.prototype.getLastDate = function() {
    var a = this.getDataCount();
    if (a < 1) {
        return -1
    }
    return this.getDataAt(a - 1).date
};
MainDataSource.prototype.getDataAt = function(a) {
    return this._dataItems[a]
};
MainDataSource.prototype.update = function(c) {
    this._updatedCount = 0;
    this._appendedCount = 0;
    this._erasedCount = 0;
    var h = this._dataItems.length;
    if (h > 0) {
        var g = h - 1;
        var l = this._dataItems[g];
        var j, f, b = c.length;
        for (f = 0; f < b; f++) {
            j = c[f];
            if (j[0] == l.date) { //时间相同不绘点
                this.setUpdateMode(DataSource.UpdateMode.DoNothing);
                return false;
            }
            //如果当前时间点小于图现在最新点，则不绘点
            if (l.date > j[0]) {
                this.setUpdateMode(DataSource.UpdateMode.DoNothing);
                return false;
            }
            //如果点的时间大于当前时间，则不绘点
            var timestamp = Date.parse(new Date()); //当前时间戳
            if (j[0] > timestamp) {
                this.setUpdateMode(DataSource.UpdateMode.DoNothing);
                return false;
            }
            //推送点绘制
            this.setUpdateMode(DataSource.UpdateMode.Append);
            for (; f < b; f++, this._appendedCount++) {
                j = c[f];
                this._dataItems.push({
                    date: j[0],
                    open: j[1],
                    high: j[2],
                    low: j[3],
                    close: j[4],
                    volume: j[5]
                });
            }
            return true;
            //if (j[0] == l.date) {
            //    if (l.open == j[1] && l.high == j[2] && l.low == j[3] && l.close == j[4] && l.volume == j[5]) {
            //        this.setUpdateMode(DataSource.UpdateMode.DoNothing)
            //    } else {                           
            //        this.setUpdateMode(DataSource.UpdateMode.Update);
            //        this._dataItems[g] = {
            //            date: j[0],
            //            open: j[1],
            //            high: j[2],
            //            low: j[3],
            //            close: j[4],
            //            volume: j[5]
            //        };
            //        this._updatedCount++
            //    }
            //    f++;               
            //    if (f < b) {
            //        this.setUpdateMode(DataSource.UpdateMode.Append);
            //        for (; f < b; f++, this._appendedCount++) {
            //            j = c[f];
            //            this._dataItems.push({
            //                date: j[0],
            //                open: j[1],
            //                high: j[2],
            //                low: j[3],
            //                close: j[4],
            //                volume: j[5]
            //            })
            //        }
            //    }
            //    return true
            //}
        }
        if (b < 1000) {
            this.setUpdateMode(DataSource.UpdateMode.DoNothing);
            return false
        }
    }
    this.setUpdateMode(DataSource.UpdateMode.Refresh);
    this._dataItems = [];
    var k, a, j, f, b = c.length;
    for (f = 0; f < b; f++) {
        j = c[f];
        for (a = 1; a <= 4; a++) {
            k = this.calcDecimalDigits(j[a]);
            if (this._decimalDigits < k) {
                this._decimalDigits = k
            }
        }
        //如果点的时间大于当前时间，则不绘点
        var timestamp = Date.parse(new Date()); //当前时间戳
        if (j[0] > timestamp) {
            continue;
        }
        this._dataItems.push({
            date: j[0],
            open: j[1],
            high: j[2],
            low: j[3],
            close: j[4],
            volume: j[5]
        })
    }
    return true
};
MainDataSource.prototype.select = function(a) {
    this.toolManager.selecedObject = a
};
MainDataSource.prototype.unselect = function() {
    this.toolManager.selecedObject = -1
};
MainDataSource.prototype.addToolObject = function(a) {
    this.toolManager.addToolObject(a)
};
MainDataSource.prototype.delToolObject = function() {
    this.toolManager.delCurrentObject()
};
MainDataSource.prototype.getToolObject = function(a) {
    return this.toolManager.getToolObject(a)
};
MainDataSource.prototype.getToolObjectCount = function() {
    return this.toolManager.toolObjects.length
};
MainDataSource.prototype.getCurrentToolObject = function() {
    return this.toolManager.getCurrentObject()
};
MainDataSource.prototype.getSelectToolObjcet = function() {
    return this.toolManager.getSelectedObject()
};
MainDataSource.prototype.delSelectToolObject = function() {
    this.toolManager.delSelectedObject()
};