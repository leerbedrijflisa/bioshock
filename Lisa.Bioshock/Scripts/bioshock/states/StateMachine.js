var StateMachine = (function () {
    function StateMachine(defaultState) {
        this.stack = [];
        this.initialized = false;
        this.initialize(defaultState);
    }
    StateMachine.prototype.switchState = function (state) {
        if (this.stack.length > 0) {
            this.currentState.suspend();
            this.currentState.leave();
            this.stack.pop();
        }

        this.stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    };

    StateMachine.prototype.pushState = function (state) {
        if (this.stack.length > 0) {
            this.currentState.suspend();
        }

        this.stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    };

    StateMachine.prototype.popState = function () {
        this.currentState.suspend();
        this.currentState.leave();
        this.stack.pop();
        this.currentState.resume();
    };

    StateMachine.prototype.initialize = function (state) {
        if (this.initialized) {
            throw new Error('Already initialized!');
        } else {
            this.switchState(state);
            this.initialized = true;
        }
    };

    Object.defineProperty(StateMachine.prototype, "currentState", {
        get: function () {
            return this.stack[this.stack.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    return StateMachine;
})();
//# sourceMappingURL=StateMachine.js.map
