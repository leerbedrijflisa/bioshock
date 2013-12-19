class Workspace {   

    constructor() {
        if (Workspace._instance !== undefined) {
            throw new Error("Instance already defined!");
        }

        this.projectID = $("#ProjectID").val();
        this.ajax = new AjaxHelper(this.projectID);

        Workspace._instance = this;
    }

    public static get instance() {
        if (Workspace._instance === undefined) {
            Workspace._instance = new Workspace();
        }

        return Workspace._instance;
    }


    // UIWindow Getters \\
    public get editorWindow() {
        if (this._windows["editor"] === undefined) {
            this._windows["editor"] = new EditorWindow("#editorWindow");
        }
        return this._windows["editor"];
    }

    public get newFileWindow() {
        if (this._windows["newFile"] === undefined) {
            this._windows["newFile"] = new NewFileWindow("#newFileWindow");
        }
        return this._windows["newFile"];
    }

    public get openFileWindow() {
        if (this._windows["openFile"] === undefined) {
            this._windows["openFile"] = new OpenFileWindow("#openFileWindow");
        }
        return this._windows["openFile"];
    }
    // End UIWindow Getters \\


    public ajax: AjaxHelper;
    public projectID: any;

    private static _instance: Workspace;
    private _windows: Object = {};
}