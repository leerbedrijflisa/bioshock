class Workspace {

    /**
     * Creates a new BioshockWorkspace.
     * @param {string} projectID - This ID is being used by UIWindows and ajax requests.
     * @param {JQuery} preview - The selector of the preview.
     */
    constructor(projectID: string, preview: string);
    constructor(projectID: string, preview: JQuery);
    constructor(projectID: string, preview: any) {
        this.projectID = projectID;
        this.preview = new Preview(preview);

        this._ajax = new AjaxHelper(projectID);
        this._synchronizer = new Synchronizer(preview);
        this.stateMachine = new StateMachine();
    }


    /**
     * Gets the AjaxHelper instance.
     */
    public get ajax(): AjaxHelper {
        return this._ajax;
    }

    /**
     * Gets the Synchronizer instance.
     */
    public get synchronizer(): Synchronizer {
        return this._synchronizer;
    }


    // fields
    public projectID: string;
    public stateMachine: StateMachine;
    public preview: Preview;

    private _ajax: AjaxHelper;
    private _synchronizer: Synchronizer;
}

var workspace: Workspace;