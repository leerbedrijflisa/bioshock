var EditorState = (function () {
    function EditorState() {
        this.editorWindow = new EditorWindow('#editorWindow');
    }
    EditorState.prototype.enter = function () {
        this.editorWindow.open();
    };

    EditorState.prototype.leave = function () {
        this.editorWindow.close();
    };

    EditorState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);

        this.iframe = $('#preview')[0];
        $(this.iframe.contentWindow).on('keyup', this.onKeyUp);
    };

    EditorState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
        $(this.iframe.contentWindow).off('keyup', this.onKeyUp);
    };

    EditorState.prototype.onKeyUp = function (event) {
        if (event.keyCode == 17 /* CTRL */) {
            Workspace.instance.stateMachine.popState();
        }
    };
    return EditorState;
})();
//# sourceMappingURL=EditorState.js.map
