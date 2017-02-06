"use strict";
var ProjectComparing_1 = require("./ProjectComparing");
var project = {
    projectName: "ThirdProject",
    projectId: "1c790420-2f3f-4559-bce4-11a8af4be8b8",
    username: "thanhtung29497@yandex.com",
    apikey: "38076341-6d3c-4a5c-8671-bc90c3dec0fb",
    branchName: ""
};
var projectUtil = new ProjectComparing_1.ProjectComparing(project);
projectUtil.compareTwoRevisions(11, 10);
