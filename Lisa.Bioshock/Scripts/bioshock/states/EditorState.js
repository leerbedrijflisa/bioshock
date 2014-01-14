var EditorState = (function () {
    function EditorState() {
        var _this = this;
        this.onKeyUp = function (event) {
            if (event.keyCode == 17 /* CTRL */) {
                _this.stateMachine.popState();
            } else if (event.altKey) {
                if (event.keyCode == 78 /* N */) {
                    _this.stateMachine.pushState(new NewFileState());
                } else if (event.keyCode == 79 /* O */) {
                    _this.stateMachine.pushState(new OpenFileState());
                }
            } else if (event.keyCode == 27 /* ESC */) {
                _this.stateMachine.pushState(new MenuState());
            }
        };
        this.onEditorChange = function (event) {
        };
    }
    EditorState.prototype.enter = function () {
        this._editorWindow = new EditorWindow('#editorWindow');
        this._editorWindow.open();
    };

    EditorState.prototype.leave = function () {
        this._editorWindow.close();
    };

    EditorState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);
        workspace.preview.addKeyUpHandler(this.onKeyUp);
        workspace.editor.addChangeHandler(this.onEditorChange);
    };

    EditorState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
        workspace.preview.removeKeyUpHandler(this.onKeyUp);
    };
    return EditorState;
})();
//# sourceMappingURL=EditorState.js.map
