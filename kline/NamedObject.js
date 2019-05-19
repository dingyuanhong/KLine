var CName = create_class();
CName.prototype.__construct = function(a) {
    this._names = [];
    this._comps = [];
    if (a instanceof CName) {
        this._names = a._names;
        this._comps = a._comps
    } else {
        var d = a.split(".");
        var c = d.length - 1;
        if (c > 0) {
            this._comps = d;
            this._names.push(d[0]);
            for (var b = 1; b <= c; b++) {
                this._names.push(this._names[b - 1] + "." + d[b])
            }
        } else {
            this._comps.push(a);
            this._names.push(a)
        }
    }
};
CName.prototype.getCompAt = function(a) {
    if (a >= 0 && a < this._comps.length) {
        return this._comps[a]
    }
    return ""
};
CName.prototype.getName = function(a) {
    if (a < 0) {
        if (this._names.length > 0) {
            return this._names[this._names.length - 1]
        }
    } else {
        if (a < this._names.length) {
            return this._names[a]
        }
    }
    return ""
};
var NamedObject = create_class();
NamedObject.prototype.__construct = function(a) {
    this._name = a;
    this._nameObj = new CName(a)
};
NamedObject.prototype.getFrameName = function() {
    return this._nameObj.getName(0)
};
NamedObject.prototype.getDataSourceName = function() {
    return this._nameObj.getName(1)
};
NamedObject.prototype.getAreaName = function() {
    return this._nameObj.getName(2)
};
NamedObject.prototype.getName = function() {
    return this._nameObj.getName(-1)
};
NamedObject.prototype.getNameObject = function() {
    return this._nameObj
};