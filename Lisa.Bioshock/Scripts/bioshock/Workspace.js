var BioshockWorkspace = (function () {
    /**
    * Creates a new BioshockWorkspace.
    * @param {string} projectID - This ID is being used by UIWindows and ajax requests.
    */
    function BioshockWorkspace(projectID) {
        this.projectID = projectID;
        this._ajax = new AjaxHelper(projectID);
        this.stateMachine = new StateMachine(new PreviewState());
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
    return BioshockWorkspace;
})();
var Workspace;
//# sourceMappingURL=Workspace.js.map
