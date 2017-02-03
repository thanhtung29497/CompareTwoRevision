"use strict";
var SearchingList = (function () {
    function SearchingList(array, isGreater, isEqual) {
        if (array === void 0) { array = null; }
        if (isEqual === void 0) { isEqual = function (a, b) { return a === b; }; }
        this._list = array;
        this._isGreater = isGreater;
        this.sort(0, this._list.length - 1);
        this._isEqual = isEqual;
    }
    SearchingList.prototype.sort = function (l, r) {
        if (l >= r)
            return;
        var i = l, j = r;
        var pivot = this._list[l];
        do {
            while (this._isGreater(this._list[j], pivot))
                j--;
            while (this._isGreater(pivot, this._list[i]))
                i++;
            if (i <= j) {
                var tmp = this._list[i];
                this._list[i] = this._list[j];
                this._list[j] = tmp;
                i++;
                j--;
            }
        } while (i <= j);
        this.sort(l, j);
        this.sort(i, r);
    };
    SearchingList.prototype.contain = function (element) {
        var l = 0, r = this._list.length - 1;
        while (l <= r) {
            var mid = Math.floor((l + r) / 2);
            if (this._isEqual(element, this._list[mid]))
                return true;
            if (this._isGreater(this._list[mid], element)) {
                r = mid - 1;
            }
            else {
                l = mid + 1;
            }
        }
        return false;
    };
    SearchingList.prototype.getList = function () {
        return this._list;
    };
    SearchingList.prototype.missingList = function (list) {
        var _this = this;
        var missingList = [];
        if (list instanceof SearchingList)
            list = list.getList();
        list.forEach(function (element) {
            if (!_this.contain(element)) {
                missingList.push(element);
            }
        });
        return missingList;
    };
    SearchingList.prototype.commonList = function (list) {
        var _this = this;
        var commonList = [];
        if (list instanceof SearchingList)
            list = list.getList();
        list.forEach(function (element) {
            if (_this.contain(element)) {
                commonList.push(element);
            }
        });
        return new SearchingList(commonList, this._isGreater);
    };
    SearchingList.prototype.find = function (element) {
        var l = 0, r = this._list.length - 1;
        while (l <= r) {
            var mid = Math.floor((l + r) / 2);
            if (this._isEqual(element, this._list[mid]))
                return this._list[mid];
            if (this._isGreater(this._list[mid], element)) {
                r = mid - 1;
            }
            else {
                l = mid + 1;
            }
        }
        return null;
    };
    return SearchingList;
}());
exports.SearchingList = SearchingList;
