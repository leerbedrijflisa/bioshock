var NewFileState = (function () {
    function NewFileState() {
        var _this = this;
        this.onKeyUp = function (event) {
            if (event.keyCode == 27 /* ESC */) {
                _this.stateMachine.popState();
            }
        };
    }
    NewFileState.prototype.enter = function () {
        var _this = this;
        this._window = new NewFileWindow('#newFileWindow').open().close(function () {
            if (_this.stateMachine.currentState == _this) {
                _this.stateMachine.popState();
            }
        });
    };

    NewFileState.prototype.leave = function () {
        this._window.close();
    };

    NewFileState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);
    };

    NewFileState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
    };
    return NewFileState;
})();
//# sourceMappingURL=NewFileState.js.map
