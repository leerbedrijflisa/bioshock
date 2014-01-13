var Workspace = (function () {
    function Workspace() {
        this._windows = {};
        if (Workspace._instance !== undefined) {
            throw new Error("Instance already defined!");
        }

        this.projectID = $("#ProjectID").val();
        this.ajax = new AjaxHelper(this.projectID);
        this.stateMachine = new StateMachine(new PreviewState());

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

    Object.defineProperty(Workspace.prototype, "newFileWindow", {
        // UIWindow Getters \\
        //public get editorWindow(): EditorWindow {
        //    if (this._windows["editor"] === undefined) {
        //        this._windows["editor"] = new EditorWindow("#editorWindow");
        //    }
        //    return this._windows["editor"];
        //}
        get: function () {
            if (this._windows["newFile"] === undefined) {
                this._windows["newFile"] = new NewFileWindow("#newFileWindow");
            }
            return this._windows["newFile"];
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Workspace.prototype, "openFileWindow", {
        get: function () {
            if (this._windows["openFile"] === undefined) {
                this._windows["openFile"] = new OpenFileWindow("#openFileWindow");
            }
            return this._windows["openFile"];
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Workspace.prototype, "menuWindow", {
        get: function () {
            if (this._windows["menu"] === undefined) {
                this._windows["menu"] = new MenuWindow('#editorMenuWindow');
            }
            return this._windows["menu"];
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
})();
//# sourceMappingURL=Workspace.js.map
