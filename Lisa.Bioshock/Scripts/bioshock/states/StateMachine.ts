class StateMachine {

    constructor(defaultState: IState) {

        this.initialize(defaultState);
    }

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

    public pushState(state: IState) {
        state.stateMachine = this;

        if (this._stack.length > 0) {

            this.currentState.suspend();
        }

        this._stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    }

    public popState() {

        this.currentState.suspend();
        this.currentState.leave();
        this._stack.pop();
        this.currentState.resume();
    }

    private initialize(state: IState) {

        if (this._initialized) {

            throw new Error('Already initialized!');
        } else {
            var preview = <HTMLIFrameElement>$("#preview")[0];
            this._preview = preview.contentDocument || preview.contentWindow;
            this.switchState(state);
            this._initialized = true;
        }
    }


    // properties
    public get preview(): HTMLIFrameElement {
        return this._preview;
    }

    private get currentState(): IState {
        return this._stack[this._stack.length - 1];
    }


    // fields
    private _stack: IState[] = [];
    private _initialized: boolean = false;
    private _preview: any;
} 