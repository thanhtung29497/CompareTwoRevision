"use strict";
///<reference path = "./typings/index.d.ts"/>
var when = require("when");
var mendixplatformsdk_1 = require("mendixplatformsdk");
var MicroflowUtils = (function () {
    function MicroflowUtils() {
    }
    MicroflowUtils.loadAllMicroflows = function (mf) {
        return when.all(mf.map(mendixplatformsdk_1.loadAsPromise));
    };
    MicroflowUtils.greaterMfById = function (first, second) {
        return first.id > second.id;
    };
    MicroflowUtils.greaterMfObjectById = function (first, second) {
        return first.id > second.id;
    };
    MicroflowUtils.twoMfEqualId = function (first, second) {
        return first.id === second.id;
    };
    MicroflowUtils.twoMfObjectEqualId = function (first, second) {
        return first.id === second.id;
    };
    return MicroflowUtils;
}());
module.exports = MicroflowUtils;
