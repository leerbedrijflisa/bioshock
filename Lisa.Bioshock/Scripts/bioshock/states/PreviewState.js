var PreviewState = (function () {
    function PreviewState(preview) {
        var _this = this;
        this.onKeyUp = function (event) {
            if (event.keyCode == 17 /* CTRL */) {
                _this.stateMachine.pushState(new EditorState());
            } else if (event.keyCode == 27 /* ESC */) {
                _this.stateMachine.pushState(new MenuState());
            }
        };
        this._preview = preview.contentDocument || preview.contentWindow;
    }
    PreviewState.prototype.enter = function () {
    };

    PreviewState.prototype.leave = function () {
    };

    PreviewState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);
        $(this._preview).on('keyup', this.onKeyUp);
    };

    PreviewState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
        $(this._preview).off('keyup', this.onKeyUp);
    };
    return PreviewState;
})();
//# sourceMappingURL=PreviewState.js.map
