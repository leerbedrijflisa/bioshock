/// <reference path="State.ts" />
class StateMachine {

    /**
     * Switch to a new state and leaves the current one.
     *
     * @param {IState} state - The new state to switch to.
     */
    public switchState(state: State) {
        state.stateMachine = this;

        if (this._stack.length > 0) {

            this.currentState.suspend();
            this.currentState.leave();
            this._stack.pop();
        }

        this._stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    }

    /**
     * Adds a state to the stack and suspends, but not leaves, the current one.
     *
     * @param {IState} state - The new state to push.
     */
    public pushState(state: State) {
        state.stateMachine = this;

        if (this._stack.length > 0) {

            this.currentState.suspend();
        }

        this._stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    }

    /**
     * Pops the current state from the stack and suspends and leaves it. The previous state will be resumed.
     */
    public popState() {
        var current = this.currentState;

        this._stack.pop();
        current.suspend();
        current.leave();

        this.currentState.resume();
    }

    /**
     * Gets the current state.
     */
    public get currentState(): State {
        return this._stack[this._stack.length - 1];
    }


    // fields
    private _stack: State[] = [];
} 