///<reference path = "./typings/index.d.ts"/>
import when = require ("when");
import {domainmodels, microflows} from "mendixmodelsdk";
import {Project, OnlineWorkingCopy, MendixSdkClient, loadAsPromise} from "mendixplatformsdk";
import {ProjectInfo} from "./ProjectInfo";
 var MicroflowUtils = class MicroflowUtils {
     static loadAllMicroflows (mf : microflows.IMicroflow[]) : when.Promise<microflows.Microflow[]> {
        return when.all<microflows.Microflow[]> (mf.map(loadAsPromise));
    }

    static greaterMfById( first : microflows.Microflow, second: microflows.Microflow) : boolean {
        return first.id > second.id;
    }

    static greaterMfObjectById(first : microflows.MicroflowObject, second : microflows.MicroflowObject) {
        return first.id > second.id;
    }

    static twoMfEqualId(first : microflows.Microflow, second : microflows.Microflow) : boolean {
        return first.id === second.id;
    }

    static twoMfObjectEqualId(first : microflows.MicroflowObject, second : microflows.MicroflowObject) : boolean {
        return first.id === second.id;
    }
 }
 export = MicroflowUtils;