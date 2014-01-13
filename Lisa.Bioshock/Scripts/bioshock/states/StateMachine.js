var StateMachine = (function () {
    function StateMachine(defaultState) {
        // fields
        this._stack = [];
        this._initialized = false;
        this.initialize(defaultState);
    }
    StateMachine.prototype.switchState = function (state) {
        state.stateMachine = this;

        if (this._stack.length > 0) {
            this.currentState.suspend();
            this.currentState.leave();
            this._stack.pop();
        }

        this._stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    };

    StateMachine.prototype.pushState = function (state) {
        state.stateMachine = this;

        if (this._stack.length > 0) {
            this.currentState.suspend();
        }

        this._stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    };

    StateMachine.prototype.popState = function () {
        this.currentState.suspend();
        this.currentState.leave();
        this._stack.pop();
        this.currentState.resume();
    };

    StateMachine.prototype.initialize = function (state) {
        if (this._initialized) {
            throw new Error('Already initialized!');
        } else {
            var preview = $("#preview")[0];
            this._preview = preview.contentDocument || preview.contentWindow;
            this.switchState(state);
            this._initialized = true;
        }
    };

    Object.defineProperty(StateMachine.prototype, "preview", {
        // properties
        get: function () {
            return this._preview;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(StateMachine.prototype, "currentState", {
        get: function () {
            return this._stack[this._stack.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    return StateMachine;
})();
//# sourceMappingURL=StateMachine.js.map
