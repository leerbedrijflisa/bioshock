var MenuState = (function () {
    function MenuState() {
        var _this = this;
        this.onKeyUp = function (event) {
            if (event.keyCode == 27 /* ESC */) {
                console.log('popping MenuState');
                _this.stateMachine.popState();
            }
        };
    }
    MenuState.prototype.enter = function () {
        var _this = this;
        this._window = new MenuWindow('#editorMenuWindow').open().close(function () {
            if (_this.stateMachine.currentState == _this) {
                _this.stateMachine.popState();
            }
        });
    };

    MenuState.prototype.leave = function () {
        this._window.close();
    };

    MenuState.prototype.resume = function () {
        $(window).on('keyup', this.onKeyUp);
    };

    MenuState.prototype.suspend = function () {
        $(window).off('keyup', this.onKeyUp);
    };
    return MenuState;
})();
//# sourceMappingURL=MenuState.js.map
