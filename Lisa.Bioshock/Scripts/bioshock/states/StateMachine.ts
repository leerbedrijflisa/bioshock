/// <reference path="IState.ts" />
class StateMachine {

    /**
     * Creates a new instance of the StateMachine.
     *
     * @param {IState} defaultState - The first state to be enabled.
     */
    constructor(defaultState: IState) {

        this.initialize(defaultState);
    }

    /**
     * Initializes the StateMachine.
     *
     * @param {IState} state - The first state to be enabled.
     */
    public initialize(state: IState) {
        if (this._initialized) {

            throw new Error('Already initialized!');
        } else {
            var preview = <HTMLIFrameElement>$("#preview")[0];
            this._preview = preview.contentDocument || preview.contentWindow;
            this.switchState(state);
            this._initialized = true;
        }
    }

    
    /**
     * Switch to a new state and leaves the current one.
     *
     * @param {IState} state - The new state to switch to.
     */
    public switchState(state: IState) {
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
    public pushState(state: IState) {
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
     * Gets the contentDocument/contentWindow of the preview's IFrame.
     */
    public get preview() {
        return this._preview;
    }

    /**
     * Gets the current state.
     */
    public get currentState(): IState {
        return this._stack[this._stack.length - 1];
    }


    // fields
    private _stack: IState[] = [];
    private _initialized: boolean = false;
    private _preview: any;
} 