var Workspace = (function () {
    function Workspace() {
        if (Workspace._instance !== undefined) {
            throw new Error("Instance already defined!");
        }

        this.projectID = $("#ProjectID").val();
        this.ajax = new AjaxHelper(this.projectID);

        Workspace._instance = this;
    }
    Object.defineProperty(Workspace, "instance", {
        get: function () {
            if (Workspace._instance === undefined) {
                Workspace._instance = new Workspace();
            }

            return Workspace._instance;
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
})();
//# sourceMappingURL=Workspace.js.map
