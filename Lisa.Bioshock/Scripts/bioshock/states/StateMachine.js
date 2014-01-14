/// <reference path="IState.ts" />
var StateMachine = (function () {
    /**
    * Creates a new instance of the StateMachine.
    *
    * @param {IState} defaultState - The first state to be enabled.
    */
    function StateMachine(defaultState) {
        // fields
        this._stack = [];
        this._initialized = false;
        this.initialize(defaultState);
    }
    /**
    * Initializes the StateMachine.
    *
    * @param {IState} state - The first state to be enabled.
    */
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

    /**
    * Switch to a new state and leaves the current one.
    *
    * @param {IState} state - The new state to switch to.
    */
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

    /**
    * Adds a state to the stack and suspends, but not leaves, the current one.
    *
    * @param {IState} state - The new state to push.
    */
    StateMachine.prototype.pushState = function (state) {
        state.stateMachine = this;

        if (this._stack.length > 0) {
            this.currentState.suspend();
        }

        this._stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    };

    /**
    * Pops the current state from the stack and suspends and leaves it. The previous state will be resumed.
    */
    StateMachine.prototype.popState = function () {
        var current = this.currentState;

        this._stack.pop();
        current.suspend();
        current.leave();

        this.currentState.resume();
    };

    Object.defineProperty(StateMachine.prototype, "preview", {
        /**
        * Gets the contentDocument/contentWindow of the preview's IFrame.
        */
        get: function () {
            return this._preview;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(StateMachine.prototype, "currentState", {
        /**
        * Gets the current state.
        */
        get: function () {
            return this._stack[this._stack.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    return StateMachine;
})();
//# sourceMappingURL=StateMachine.js.map
