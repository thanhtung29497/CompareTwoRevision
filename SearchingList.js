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
    SearchingList.prototype.sort = function (start, end) {
        if (start >= end)
            return;
        var i = start, j = end;
        var pivot = this._list[start];
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
        this.sort(start, j);
        this.sort(i, end);
    };
    SearchingList.prototype.contain = function (element) {
        var start = 0, end = this._list.length - 1;
        while (start <= end) {
            var mid = Math.floor((start + end) / 2);
            if (this._isEqual(element, this._list[mid]))
                return true;
            if (this._isGreater(this._list[mid], element)) {
                end = mid - 1;
            }
            else {
                start = mid + 1;
            }
        }
        return false;
    };
    SearchingList.prototype.getList = function () {
        return this._list;
    };
    SearchingList.prototype.missingList = function (listToCompare) {
        var _this = this;
        // return a list includes all elements that appears in listToCompare but not in this list
        var missingList = [];
        if (listToCompare instanceof SearchingList)
            listToCompare = listToCompare.getList();
        listToCompare.forEach(function (element) {
            if (!_this.contain(element)) {
                missingList.push(element);
            }
        });
        return missingList;
    };
    SearchingList.prototype.commonList = function (listToCompare) {
        var _this = this;
        // return a list includes all elements that appears in both listToCompare and this list
        var commonList = [];
        if (listToCompare instanceof SearchingList)
            listToCompare = listToCompare.getList();
        listToCompare.forEach(function (element) {
            if (_this.contain(element)) {
                commonList.push(element);
            }
        });
        return new SearchingList(commonList, this._isGreater);
    };
    SearchingList.prototype.find = function (elementToFind) {
        // return the element in this list that is equal to elementToFind
        var start = 0, end = this._list.length - 1;
        while (start <= end) {
            var mid = Math.floor((start + end) / 2);
            if (this._isEqual(elementToFind, this._list[mid]))
                return this._list[mid];
            if (this._isGreater(this._list[mid], elementToFind)) {
                end = mid - 1;
            }
            else {
                start = mid + 1;
            }
        }
        return null;
    };
    return SearchingList;
}());
exports.SearchingList = SearchingList;
