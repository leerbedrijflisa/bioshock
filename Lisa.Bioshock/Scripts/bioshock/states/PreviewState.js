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
        $(window).on('keyup', this.onKeyUp);

        this.iframe = $('#preview')[0];
        $(this.iframe.contentWindow).on('keyup', this.onKeyUp);
    };

    PreviewState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
        $(this.iframe.contentWindow).off('keyup', this.onKeyUp);
    };
    return PreviewState;
})();
//# sourceMappingURL=PreviewState.js.map
