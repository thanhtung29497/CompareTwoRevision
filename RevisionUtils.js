"use strict";
///<reference path = "./typings/index.d.ts"/>
var when = require("when");
var mendixplatformsdk_1 = require("mendixplatformsdk");
var MicroflowUtils = require("./MicroflowUtils");
var RevisionUtils = (function () {
    function RevisionUtils(projectinfo, revNo) {
        if (revNo === void 0) { revNo = -1; }
        this._client = new mendixplatformsdk_1.MendixSdkClient(projectinfo.username, projectinfo.apikey);
        this._project = new mendixplatformsdk_1.Project(this._client, projectinfo.projectId, projectinfo.projectName);
        this._info = projectinfo;
        this._revNo = revNo;
    }
    RevisionUtils.prototype.load = function () {
        var _this = this;
        return when.promise(function (resolve, reject) {
            _this._client.platform().createOnlineWorkingCopy(_this._project, new mendixplatformsdk_1.Revision(_this._revNo, new mendixplatformsdk_1.Branch(_this._project, _this._info.branchName)))
                .then(function (workingCopy) {
                _this._workingCopy = workingCopy;
                _this._model = workingCopy.model();
                return workingCopy.model().allMicroflows();
            })
                .then(function (allMf) { return MicroflowUtils.loadAllMicroflows(allMf); })
                .then(function (allMf) {
                _this._microflows = allMf.filter(function (mf) {
                    var modulename = mf.qualifiedName.split(".")[0];
                    return ["System", "NavigationLayout", "Administration"].indexOf(modulename) === -1;
                });
                /**
                 * this._microflows[0].objectCollection.objects.forEach( mfo => {
                 *   console.log(mfo.typeName);
                 * })
                 */
                console.log("Successfully load revision " + _this._revNo + " of project " + _this._info.projectName);
                resolve(_this);
            });
        });
    };
    RevisionUtils.prototype.allMicroflows = function () {
        return this._microflows;
    };
    RevisionUtils.prototype.getRevNo = function () {
        return this._revNo;
    };
    RevisionUtils.prototype.commitToServer = function () {
        this._client.platform().commitToTeamServer(this._workingCopy)
            .done(function (revision) {
            console.log("Successfully commitToTeamServer");
        }, function (error) {
            console.log("Failed to commitToTeamServer");
        });
    };
    RevisionUtils.prototype.closeConnection = function () {
        this._model.closeConnection(function () { return console.log("Close connection"); }, function (error) { return console.log("Something went wrong " + error); });
    };
    return RevisionUtils;
}());
RevisionUtils.NEWEST_REVISION = -1;
exports.RevisionUtils = RevisionUtils;
