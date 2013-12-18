class Workspace {   

    private constructor() {
        this.projectID = $("#project-id").val();
        this.ajax = new AjaxHelper();
    }

    public static get instance() {
        if (Workspace._instance == null) {
            Workspace._instance = new Workspace();
        }

        return Workspace._instance;
    }

    public ajax: AjaxHelper;
    public projectID: any;
    private static _instance: Workspace;
}