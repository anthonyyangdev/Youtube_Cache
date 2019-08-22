var VideoGroup = /** @class */ (function () {
    function VideoGroup() {
        this.set = {};
        this.index = 0;
        this.list = [];
    }
    VideoGroup.prototype.getSet = function () { return this.set; };
    VideoGroup.prototype.getList = function () { return this.list; };
    VideoGroup.prototype.add = function (item) {
        this.set[item.id] = item.id;
        this.list[this.index++] = item;
    };
    VideoGroup.prototype.size = function () {
        return this.index;
    };
    VideoGroup.prototype.includes = function (item) {
        return this.set[item.id] !== undefined;
    };
    return VideoGroup;
}());

module.exports = VideoGroup;
