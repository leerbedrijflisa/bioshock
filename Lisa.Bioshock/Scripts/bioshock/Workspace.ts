class BioshockWorkspace {

    /**
     * Creates a new BioshockWorkspace.
     * @param {string} projectID - This ID is being used by UIWindows and ajax requests.
     */
    constructor(projectID: string) {
        this.projectID = projectID;
        this._ajax = new AjaxHelper(projectID);
        this.stateMachine = new StateMachine(new PreviewState());
    }

    /**
     * Gets the AjaxHelper instance.
     */
    public get ajax(): AjaxHelper {
        return this._ajax;
    }

    public projectID: string;
    public stateMachine: StateMachine;

    private _ajax: AjaxHelper;
}
var Workspace: BioshockWorkspace;