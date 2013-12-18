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

    public ajax: AjaxHelper;
    public projectID: any;
    private static _instance : Workspace;
}