var MEvent = create_class();
MEvent.prototype.__construct = function() {
    this._handlers = []
};
MEvent.prototype.addHandler = function(b, a) {
    if (this._indexOf(b, a) < 0) {
        this._handlers.push({
            obj: b,
            func: a
        })
    }
};
MEvent.prototype.removeHandler = function(c, b) {
    var a = this._indexOf(c, b);
    if (a >= 0) {
        this._handlers.splice(a, 1)
    }
};
MEvent.prototype.raise = function(f, h) {
    var b = this._handlers;
    var j, d, k = b.length;
    for (d = 0; d < k; d++) {
        j = b[d];
        j.func.call(j.obj, f, h)
    }
};
MEvent.prototype._indexOf = function(j, g) {
    var b = this._handlers;
    var h, d, k = b.length;
    for (d = 0; d < k; d++) {
        h = b[d];
        if (j == h.obj && g == h.func) {
            return d
        }
    }
    return -1
};