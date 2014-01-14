var PreviewState = (function () {
    function PreviewState() {
        var _this = this;
        this.onKeyUp = function (event) {
            if (event.keyCode == 17 /* CTRL */) {
                _this.stateMachine.pushState(new EditorState());
            } else if (event.keyCode == 27 /* ESC */) {
                _this.stateMachine.pushState(new MenuState());
            }
        };
    }
    PreviewState.prototype.enter = function () {
    };

    PreviewState.prototype.leave = function () {
    };

    PreviewState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);
        workspace.preview.addKeyUpHandler(this.onKeyUp);
    };

    PreviewState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
        workspace.preview.removeKeyUpHandler(this.onKeyUp);
    };
    return PreviewState;
})();
//# sourceMappingURL=PreviewState.js.map
