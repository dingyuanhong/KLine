var classId = 0;

function create_class() {
    var j = arguments.length;
    var e = function() {};
    var d;
    if (j) {
        d = arguments[0];
        for (var a in d.prototype) {
            e.prototype[a] = d.prototype[a]
        }
    }
    for (var c = 1; c < j; c++) {
        var b = arguments[c];
        var g = b.prototype.__construct;
        if (g) {
            if (!e.prototype.__featureConstructors) {
                e.prototype.__featureConstructors = []
            }
            e.prototype.__featureConstructors.push(g);
            delete b.prototype.__construct
        }
        for (var a in b.prototype) {
            e.prototype[a] = b.prototype[a]
        }
        if (g) {
            b.prototype.__construct = g
        }
    }
    var h = function() {
        if (this.__construct) {
            this.__construct.apply(this, arguments)
        }
        if (this.__featureConstructors) {
            var f = this.__featureConstructors;
            var k, l = f.length;
            for (k = 0; k < l; k++) {
                f[k].apply(this, arguments)
            }
        }
    };
    e.prototype.__classId = classId++;
    if (d != undefined) {
        h.__super = d.prototype;
        e.prototype.__super = d
    }
    h.prototype = new e();
    return h
}

function is_instance(c, a) {
    var b = a.prototype.__classId;
    if (c.__classId == b) {
        return true
    }
    var d = c.__super;
    while (d != undefined) {
        if (d.prototype.__classId == b) {
            return true
        }
        d = d.prototype.__super
    }
    return false
}

String.fromFloat = function(a, c) {
    var d = a.toFixed(c);
    for (var b = d.length - 1; b >= 0; b--) {
        if (d[b] == ".") {
            return d.substring(0, b)
        }
        if (d[b] != "0") {
            return d.substring(0, b + 1)
        }
    }
};