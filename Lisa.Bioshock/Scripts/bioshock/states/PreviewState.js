var PreviewState = (function () {
    function PreviewState() {
        this.onKeyUp = function (event) {
            if (event.keyCode == 17 /* CTRL */) {
                Workspace.instance.stateMachine.pushState(new EditorState());
            }
        };
        //this.editorState = new EditorState();
    }
    PreviewState.prototype.enter = function () {
    };

    PreviewState.prototype.leave = function () {
    };

    PreviewState.prototype.resume = function () {
        var preview = this.stateMachine.preview;

        $(window).on('keyup', this.onKeyUp);
        $(preview).on('keyup', this.onKeyUp);
    };

    PreviewState.prototype.suspend = function () {
        var preview = this.stateMachine.preview;

        $(window).off('keyup', this.onKeyUp);
        $(preview).off('keyup', this.onKeyUp);
    };
    return PreviewState;
})();
//# sourceMappingURL=PreviewState.js.map
