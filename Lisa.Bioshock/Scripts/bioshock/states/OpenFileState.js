var OpenFileState = (function () {
    function OpenFileState() {
        var _this = this;
        this.onKeyUp = function (event) {
            if (event.keyCode == 27 /* ESC */) {
                _this.stateMachine.popState();
            }
        };
    }
    OpenFileState.prototype.enter = function () {
        var _this = this;
        this._window = new OpenFileWindow('#openFileWindow').open().close(function () {
            if (_this.stateMachine.currentState == _this) {
                _this.stateMachine.popState();
            }
        });
    };

    OpenFileState.prototype.leave = function () {
        this._window.close();
    };

    OpenFileState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);
    };

    OpenFileState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
    };
    return OpenFileState;
})();
//# sourceMappingURL=OpenFileState.js.map
