///<reference path = "./typings/index.d.ts"/>
import when = require ("when");
import {domainmodels, microflows, IModel} from "mendixmodelsdk";
import {Project, OnlineWorkingCopy, MendixSdkClient, Revision, Branch, loadAsPromise} from "mendixplatformsdk";
import {ProjectInfo} from "./ProjectInfo";
import MicroflowUtils = require("./MicroflowUtils");

export class RevisionUtils {
    private _project : Project;
    private _client : MendixSdkClient;
    private _info : ProjectInfo;
    private _revNo : number;
    static NEWEST_REVISION = -1;
    private _microflows : microflows.Microflow[]; 
    private _model : IModel;
    private _workingCopy : OnlineWorkingCopy;

    constructor (projectinfo : ProjectInfo, revNo : number = -1) {
        this._client = new MendixSdkClient (projectinfo.username, projectinfo.apikey);
        this._project = new Project(this._client, projectinfo.projectId, projectinfo.projectName);
        this._info = projectinfo;
        this._revNo = revNo;
    }

    load () : when.Promise<RevisionUtils> {
        return when.promise<RevisionUtils> ( (resolve, reject) => {
            this._client.platform().createOnlineWorkingCopy(this._project, 
                new Revision(this._revNo, new Branch(this._project, this._info.branchName)))
                .then ( (workingCopy : OnlineWorkingCopy) => {
                    this._workingCopy = workingCopy;
                    this._model = workingCopy.model();
                    return workingCopy.model().allMicroflows();
                })
                .then ( allMf => MicroflowUtils.loadAllMicroflows(allMf))
                .then ( (allMf : microflows.Microflow[]) => {
                    this._microflows = allMf.filter( mf => {
                        let modulename = mf.qualifiedName.split(".")[0];
                        return ["System", "NavigationLayout", "Administration"].indexOf(modulename) === -1;
                    });
                    /**
                     * this._microflows[0].objectCollection.objects.forEach( mfo => {
                     *   console.log(mfo.typeName);
                     * })
                     */
                    
                    console.log(`Successfully load revision ${this._revNo} of project ${this._info.projectName}`);
                    resolve(this);
                })
        })
    }

    allMicroflows() : microflows.Microflow[] {
        return this._microflows;
    }

    getRevNo() : number {
        return this._revNo;
    }

    commitToServer() : void {
        this._client.platform().commitToTeamServer(this._workingCopy)
            .done(
                revision => {
                    console.log("Successfully commitToTeamServer");
                },
                error => {
                    console.log("Failed to commitToTeamServer");
                }
            )
    }

    closeConnection() : void  {
        this._model.closeConnection(
            () => console.log("Close connection"),
            (error) => console.log("Something went wrong " + error)
        )
    }

    
}