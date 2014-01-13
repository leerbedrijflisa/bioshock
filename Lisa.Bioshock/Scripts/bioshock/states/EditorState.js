var EditorState = (function () {
    function EditorState() {
    }
    EditorState.prototype.enter = function () {
        this._editorWindow = new EditorWindow('#editorWindow');
        this._editorWindow.open();
    };

    EditorState.prototype.leave = function () {
        this._editorWindow.close();
    };

    EditorState.prototype.resume = function () {
        var preview = this.stateMachine.preview;

        $(window).on('keyup', this.onKeyUp);

        $(preview).on('keyup', this.onKeyUp);
    };

    EditorState.prototype.suspend = function () {
        var preview = this.stateMachine.preview;

        $(window).off('keyup', this.onKeyUp);
        $(preview).off('keyup', this.onKeyUp);
    };

    EditorState.prototype.onKeyUp = function (event) {
        if (event.keyCode == 17 /* CTRL */) {
            Workspace.instance.stateMachine.popState();
        }
    };
    return EditorState;
})();
//# sourceMappingURL=EditorState.js.map
