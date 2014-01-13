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
            }
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
        var preview = this.stateMachine.preview;

        $(window).on('keyup', this.onKeyUp);

        $(preview).on('keyup', this.onKeyUp);
    };

    EditorState.prototype.suspend = function () {
        var preview = this.stateMachine.preview;

        $(window).off('keyup', this.onKeyUp);
        $(preview).off('keyup', this.onKeyUp);
    };
    return EditorState;
})();
//# sourceMappingURL=EditorState.js.map
