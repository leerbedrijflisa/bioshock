var Workspace = (function () {
    /**
    * Creates a new BioshockWorkspace.
    * @param {string} projectID - This ID is being used by UIWindows and ajax requests.
    */
    function Workspace(projectID) {
        this.projectID = projectID;
        this.preview = new Preview('#preview');
        this.editor = new Editor('#editor');

        this._ajax = new AjaxHelper(projectID);
        this._synchronizer = new Synchronizer('#preview');
        this.stateMachine = new StateMachine();
    }
    Object.defineProperty(Workspace.prototype, "ajax", {
        /**
        * Gets the AjaxHelper instance.
        */
        get: function () {
            return this._ajax;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Workspace.prototype, "synchronizer", {
        /**
        * Gets the Synchronizer instance.
        */
        get: function () {
            return this._synchronizer;
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
})();

var workspace;
//# sourceMappingURL=Workspace.js.map
