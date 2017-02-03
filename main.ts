import when = require ("when");
import {ModelSdkClient, IModel} from "mendixmodelsdk";
import {Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import {RevisionUtils} from "./RevisionUtils";
import {ProjectInfo} from "./ProjectInfo";
import {ProjectUtils} from "./ProjectUtils";

let project : ProjectInfo = {
    projectName : "ThirdProject",
    projectId : "1c790420-2f3f-4559-bce4-11a8af4be8b8",
    username : "thanhtung29497@yandex.com",
    apikey : "38076341-6d3c-4a5c-8671-bc90c3dec0fb",
    branchName : ""
}

let projectUtil = new ProjectUtils(project);
projectUtil.compareTwoRevision(11,10);