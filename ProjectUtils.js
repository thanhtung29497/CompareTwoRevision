"use strict";
var when = require("when");
var mendixplatformsdk_1 = require("mendixplatformsdk");
var RevisionUtils_1 = require("./RevisionUtils");
var SearchingList_1 = require("./SearchingList");
var MicroflowUtils = require("./MicroflowUtils");
var ProjectUtils = (function () {
    function ProjectUtils(projectinfo) {
        this._client = new mendixplatformsdk_1.MendixSdkClient(projectinfo.username, projectinfo.apikey);
        this._project = new mendixplatformsdk_1.Project(this._client, projectinfo.projectId, projectinfo.projectName);
        this._info = projectinfo;
    }
    ProjectUtils.prototype.compareTwoMicroflow = function (newMf, oldMf) {
        var isChanged = false;
        var newMfObjectList = new SearchingList_1.SearchingList(newMf.objectCollection.objects.map(function (mfo) { return mfo; }), MicroflowUtils.compareTwoMfObjectById, MicroflowUtils.twoMfObjectEqualId);
        var oldMfObjectList = new SearchingList_1.SearchingList(oldMf.objectCollection.objects.map(function (mfo) { return mfo; }), MicroflowUtils.compareTwoMfObjectById, MicroflowUtils.twoMfObjectEqualId);
        var removedMfObjects = newMfObjectList.missingList(oldMfObjectList);
        var addedMfObjects = oldMfObjectList.missingList(newMfObjectList);
        if (removedMfObjects.length !== 0) {
            console.log("Some microflow objects was removed:");
            removedMfObjects.forEach(function (mfo) { return console.log(mfo.typeName); });
            isChanged = true;
        }
        if (addedMfObjects.length !== 0) {
            console.log("Some microflow objects was added:");
            addedMfObjects.forEach(function (mfo) { return console.log(mfo.typeName); });
            isChanged = true;
        }
        return isChanged;
    };
    ProjectUtils.prototype.compareTwoRevision = function (newRevNo, oldRevNo) {
        var _this = this;
        if (newRevNo === void 0) { newRevNo = -1; }
        var removedMicroflows, addedMicroflows;
        //let removedMfObjects: microflows.MicroflowObject[], addedMfObjects: microflows.MicroflowObject[];
        return when.promise(function (resolve, reject) {
            _this.loadRevisions([newRevNo, oldRevNo])
                .then(function (_a) {
                var newRevision = _a[0], oldRevision = _a[1];
                if (newRevision.getRevNo() < oldRevision.getRevNo()) {
                    _b = [oldRevision, newRevision], newRevision = _b[0], oldRevision = _b[1];
                }
                console.log("Successfully load two Revison");
                var newMfList = new SearchingList_1.SearchingList(newRevision.allMicroflows(), MicroflowUtils.compareTwoMfById, MicroflowUtils.twoMfEqualId);
                var oldMfList = new SearchingList_1.SearchingList(oldRevision.allMicroflows(), MicroflowUtils.compareTwoMfById, MicroflowUtils.twoMfEqualId);
                removedMicroflows = newMfList.missingList(oldMfList);
                addedMicroflows = oldMfList.missingList(newMfList);
                if (removedMicroflows.length !== 0) {
                    console.log("Some microflows was removed:");
                    removedMicroflows.forEach(function (mf) { return console.log(mf.qualifiedName); });
                }
                console.log("");
                if (addedMicroflows.length !== 0) {
                    console.log("Some microflows was added:");
                    addedMicroflows.forEach(function (mf) { return console.log(mf.qualifiedName); });
                }
                console.log("");
                newMfList.getList().forEach(function (newMf) {
                    var oldMf = oldMfList.find(newMf);
                    if (oldMf !== null) {
                        console.log("In microflow " + oldMf.qualifiedName);
                        var isChanged = _this.compareTwoMicroflow(newMf, oldMf);
                        if (!isChanged) {
                            console.log("Nothing was changed");
                        }
                    }
                    console.log("");
                });
                resolve();
                var _b;
            });
        });
    };
    ProjectUtils.prototype.loadRevisions = function (revNo) {
        var _this = this;
        var revisions = revNo.map(function (revNo) { return new RevisionUtils_1.RevisionUtils(_this._info, revNo); });
        return when.all(revisions.map(function (revision) { return revision.load(); }));
    };
    return ProjectUtils;
}());
exports.ProjectUtils = ProjectUtils;
