import when = require("when");
import {IModel, domainmodels, microflows} from "mendixmodelsdk";
import {Project, Revision, loadAsPromise, OnlineWorkingCopy, MendixSdkClient} from "mendixplatformsdk";
import {RevisionUtils} from "./RevisionUtils";
import {ProjectInfo} from "./ProjectInfo";
import {SearchingList, compare} from "./SearchingList";
import MicroflowUtils = require("./MicroflowUtils");

export class ProjectUtils {
    private _project : Project;
    private _client : MendixSdkClient;
    private _info : ProjectInfo;
    
    constructor (projectinfo : ProjectInfo) {
        this._client = new MendixSdkClient(projectinfo.username, projectinfo.apikey);
        this._project = new Project(this._client, projectinfo.projectId, projectinfo.projectName);
        this._info = projectinfo;
    }

    compareTwoMicroflow(newMf : microflows.Microflow, oldMf: microflows.Microflow) : boolean {
        let isChanged = false;
        let newMfObjectList = new SearchingList<microflows.MicroflowObject>(
            newMf.objectCollection.objects.map(mfo => mfo), 
            MicroflowUtils.compareTwoMfObjectById, MicroflowUtils.twoMfObjectEqualId);
        let oldMfObjectList = new SearchingList<microflows.MicroflowObject>(
            oldMf.objectCollection.objects.map(mfo => mfo), 
            MicroflowUtils.compareTwoMfObjectById, MicroflowUtils.twoMfObjectEqualId);
        let removedMfObjects = newMfObjectList.missingList(oldMfObjectList);
        let addedMfObjects = oldMfObjectList.missingList(newMfObjectList);
            if (removedMfObjects.length !== 0) {
                console.log("Some microflow objects was removed:");
                removedMfObjects.forEach(mfo => console.log(mfo.typeName));
                isChanged = true;
            }  
            if (addedMfObjects.length !== 0) {
                console.log("Some microflow objects was added:");
                addedMfObjects.forEach(mfo => console.log(mfo.typeName));
                isChanged = true;
            }                    
        return isChanged;          
    }

    compareTwoRevision(newRevNo : number = -1, oldRevNo : number) : when.Promise<any>{
        let removedMicroflows: microflows.Microflow[], addedMicroflows: microflows.Microflow[];
        //let removedMfObjects: microflows.MicroflowObject[], addedMfObjects: microflows.MicroflowObject[];
        return when.promise<any>( (resolve, reject) => {
            this.loadRevisions([newRevNo, oldRevNo])
                .then( ([newRevision, oldRevision]) => {
                    if (newRevision.getRevNo() < oldRevision.getRevNo()) {
                        [newRevision, oldRevision] = [oldRevision, newRevision];
                    }
                    console.log("Successfully load two Revison");
                    let newMfList = new SearchingList<microflows.Microflow>(newRevision.allMicroflows(), 
                        MicroflowUtils.compareTwoMfById, MicroflowUtils.twoMfEqualId);
                    let oldMfList = new SearchingList<microflows.Microflow>(oldRevision.allMicroflows(), 
                        MicroflowUtils.compareTwoMfById, MicroflowUtils.twoMfEqualId);
                    removedMicroflows = newMfList.missingList(oldMfList);
                    addedMicroflows = oldMfList.missingList(newMfList);
                    if (removedMicroflows.length !== 0) {
                        console.log(`Some microflows was removed:`);
                        removedMicroflows.forEach(mf => console.log(mf.qualifiedName));
                    }
                    console.log("");
                    if (addedMicroflows.length !== 0) {
                        console.log(`Some microflows was added:`);
                        addedMicroflows.forEach(mf => console.log(mf.qualifiedName));
                    }
                    console.log("");
                    newMfList.getList().forEach( newMf => {
                        let oldMf = oldMfList.find(newMf);
                        if (oldMf !== null) {
                            console.log(`In microflow ${oldMf.qualifiedName}`);
                            let isChanged = this.compareTwoMicroflow(newMf, oldMf);
                            if (!isChanged) {
                                console.log("Nothing was changed");
                            }
                        }
                        console.log("");
                    })
                    resolve();
                })

        }) 
    }

    loadRevisions(revNo : number[]) : when.Promise<RevisionUtils[]>{
        let revisions = revNo.map( revNo => new RevisionUtils(this._info, revNo));
        return when.all<RevisionUtils[]>(revisions.map( revision => revision.load()));
    }
}
