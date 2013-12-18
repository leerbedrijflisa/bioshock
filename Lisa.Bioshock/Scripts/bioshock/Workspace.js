var Workspace = (function () {
    function Workspace() {
    }
    Workspace.prototype.constructor = function () {
        this.projectID = $("#project-id").val();
        this.ajax = new AjaxHelper();
    };

    Object.defineProperty(Workspace, "instance", {
        get: function () {
            if (Workspace._instance == null) {
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
