var BioshockWorkspace = (function () {
    function BioshockWorkspace(projectID, preview) {
        this.projectID = projectID;
        this.preview = $(preview)[0];

        this._ajax = new AjaxHelper(projectID);
        this._synchronizer = new Synchronizer(preview);
        this.stateMachine = new StateMachine(new PreviewState(this.preview));
    }
    Object.defineProperty(BioshockWorkspace.prototype, "ajax", {
        /**
        * Gets the AjaxHelper instance.
        */
        get: function () {
            return this._ajax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(BioshockWorkspace.prototype, "synchronizer", {
        /**
        * Gets the Synchronizer instance.
        */
        get: function () {
            return this._synchronizer;
        },
        enumerable: true,
        configurable: true
    });
    return BioshockWorkspace;
})();
var Workspace;
//# sourceMappingURL=Workspace.js.map
