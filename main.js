"use strict";
var ProjectUtils_1 = require("./ProjectUtils");
var project = {
    projectName: "ThirdProject",
    projectId: "1c790420-2f3f-4559-bce4-11a8af4be8b8",
    username: "thanhtung29497@yandex.com",
    apikey: "38076341-6d3c-4a5c-8671-bc90c3dec0fb",
    branchName: ""
};
var projectUtil = new ProjectUtils_1.ProjectUtils(project);
projectUtil.compareTwoRevision(11, 10);
