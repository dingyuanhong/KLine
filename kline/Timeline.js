var Timeline = create_class(NamedObject);
Timeline._ItemWidth = [1, 3, 3, 5, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
Timeline._SpaceWidth = [1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 7, 7, 7];
Timeline.PADDING_LEFT = 4;
Timeline.PADDING_RIGHT = 8;
Timeline.prototype.__construct = function(a, m) {
    Timeline.__super.__construct.call(this, a);
    this._manager = m;
    this._updated = false;
    this._innerLeft = 0;
    this._innerWidth = 0;
    this._firstColumnLeft = 0;
    this._scale = 3;
    this._lastScale = -1;
    this._maxItemCount = 0;
    this._maxIndex = 0;
    this._firstIndex = -1;
    this._selectedIndex = -1;
    this._savedFirstIndex = -1
};
Timeline.prototype.isLatestShown = function() {
    return this.getLastIndex() == this._maxIndex
};
Timeline.prototype.isUpdated = function() {
    return this._updated
};
Timeline.prototype.setUpdated = function(a) {
    this._updated = a
};
Timeline.prototype.getItemWidth = function() {
    return Timeline._ItemWidth[this._scale]
};
Timeline.prototype.getSpaceWidth = function() {
    return Timeline._SpaceWidth[this._scale]
};
Timeline.prototype.getColumnWidth = function() {
    return this.getSpaceWidth() + this.getItemWidth()
};
Timeline.prototype.getInnerWidth = function() {
    return this._innerWidth
};
Timeline.prototype.getItemLeftOffset = function() {
    return this.getSpaceWidth()
};
Timeline.prototype.getItemCenterOffset = function() {
    return this.getSpaceWidth() + (this.getItemWidth() >> 1)
};
Timeline.prototype.getFirstColumnLeft = function() {
    return this._firstColumnLeft
};
Timeline.prototype.getMaxItemCount = function() {
    return this._maxItemCount
};
Timeline.prototype.getFirstIndex = function() {
    return this._firstIndex
};
Timeline.prototype.getLastIndex = function() {
    return Math.min(this._firstIndex + this._maxItemCount, this._maxIndex)
};
Timeline.prototype.getSelectedIndex = function() {
    return this._selectedIndex
};
Timeline.prototype.getMaxIndex = function() {
    return this._maxIndex
};
Timeline.prototype.calcColumnCount = function(a) {
    return Math.floor(a / this.getColumnWidth()) << 0
};
Timeline.prototype.calcFirstColumnLeft = function(a) {
    return this._innerLeft + this._innerWidth - (this.getColumnWidth() * a)
};
Timeline.prototype.calcFirstIndexAlignRight = function(c, a, b) {
    return Math.max(0, c + Math.max(a, 1) - Math.max(b, 1))
};
Timeline.prototype.calcFirstIndex = function(a) {
    return this.validateFirstIndex(this.calcFirstIndexAlignRight(this._firstIndex, this._maxItemCount, a), a)
};
Timeline.prototype.updateMaxItemCount = function() {
    var a = this.calcColumnCount(this._innerWidth);
    var c;
    if (this._maxItemCount < 1) {
        c = this.calcFirstIndex(a)
    } else {
        if (this._lastScale == this._scale) {
            c = this.validateFirstIndex(this._firstIndex - (a - this._maxItemCount))
        } else {
            var b = (this._selectedIndex >= 0) ? this._selectedIndex : this.getLastIndex() - 1;
            c = this.validateFirstIndex(b - Math.round((b - this._firstIndex) * a / this._maxItemCount))
        }
    }
    this._lastScale = this._scale;
    if (this._firstIndex != c) {
        if (this._selectedIndex == this._firstIndex) {
            this._selectedIndex = c
        }
        this._firstIndex = c;
        this._updated = true
    }
    if (this._maxItemCount != a) {
        this._maxItemCount = a;
        this._updated = true
    }
    this._firstColumnLeft = this.calcFirstColumnLeft(a)
};
Timeline.prototype.validateFirstIndex = function(a, c) {
    if (this._maxIndex < 1) {
        return -1
    }
    if (a < 0) {
        return 0
    }
    var b = Math.max(0, this._maxIndex - 1);
    if (a > b) {
        return b
    }
    return a
};
Timeline.prototype.validateSelectedIndex = function() {
    if (this._selectedIndex < this._firstIndex) {
        this._selectedIndex = -1
    } else {
        if (this._selectedIndex >= this.getLastIndex()) {
            this._selectedIndex = -1
        }
    }
};
Timeline.prototype.onLayout = function() {
    var c = this._manager.getInstance();
    var b = c.getArea(this.getDataSourceName() + ".main");
    if (b != null) {
        this._innerLeft = b.getLeft() + Timeline.PADDING_LEFT;
        var a = Math.max(0, b.getWidth() - (Timeline.PADDING_LEFT + Timeline.PADDING_RIGHT));
        if (this._innerWidth != a) {
            this._innerWidth = a;
            this.updateMaxItemCount()
        }
    }
};
Timeline.prototype.toIndex = function(a) {
    return this._firstIndex + this.calcColumnCount(a - this._firstColumnLeft)
};
Timeline.prototype.toColumnLeft = function(a) {
    return this._firstColumnLeft + (this.getColumnWidth() * (a - this._firstIndex))
};
Timeline.prototype.toItemLeft = function(a) {
    return this.toColumnLeft(a) + this.getItemLeftOffset()
};
Timeline.prototype.toItemCenter = function(a) {
    return this.toColumnLeft(a) + this.getItemCenterOffset()
};
Timeline.prototype.selectAt = function(a) {
    this._selectedIndex = this.toIndex(a);
    this.validateSelectedIndex();
    return (this._selectedIndex >= 0)
};
Timeline.prototype.unselect = function() {
    this._selectedIndex = -1
};
Timeline.prototype.update = function() {
    var c = this._manager.getInstance();
    var b = c.getDataSource(this.getDataSourceName());
    var d = this._maxIndex;
    this._maxIndex = b.getDataCount();
    switch (b.getUpdateMode()) {
        case DataSource.UpdateMode.Refresh:
            if (this._maxIndex < 1) {
                this._firstIndex = -1
            } else {
                this._firstIndex = Math.max(this._maxIndex - this._maxItemCount, 0)
            }
            this._selectedIndex = -1;
            this._updated = true;
            break;
        case DataSource.UpdateMode.Append:
            var e = this.getLastIndex();
            var a = b.getErasedCount();
            if (e < d) {
                if (a > 0) {
                    this._firstIndex = Math.max(this._firstIndex - a, 0);
                    if (this._selectedIndex >= 0) {
                        this._selectedIndex -= a;
                        this.validateSelectedIndex()
                    }
                    this._updated = true
                }
            } else {
                if (e == d) {
                    this._firstIndex += (this._maxIndex - d);
                    if (this._selectedIndex >= 0) {
                        this._selectedIndex -= a;
                        this.validateSelectedIndex()
                    }
                    this._updated = true
                }
            }
            break
    }
};
Timeline.prototype.move = function(a) {
    if (this.isLatestShown()) {
        this._manager.getInstance().getArea(this.getDataSourceName() + ".mainRange").setChanged(true)
    }
    this._firstIndex = this.validateFirstIndex(this._savedFirstIndex - this.calcColumnCount(a), this._maxItemCount);
    this._updated = true;
    if (this._selectedIndex >= 0) {
        this.validateSelectedIndex()
    }
};
Timeline.prototype.startMove = function() {
    this._savedFirstIndex = this._firstIndex
};
Timeline.prototype.scale = function(a) {
    this._scale += a;
    if (this._scale < 0) {
        this._scale = 0
    } else {
        if (this._scale >= Timeline._ItemWidth.length) {
            this._scale = Timeline._ItemWidth.length - 1
        }
    }
    this.updateMaxItemCount();
    if (this._selectedIndex >= 0) {
        this.validateSelectedIndex()
    }
};