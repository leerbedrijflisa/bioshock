class StateMachine {

    constructor(defaultState: IState) {

        this.initialize(defaultState);
    }

    public switchState(state: IState) {

        if (this.stack.length > 0) {

            this.currentState.suspend();
            this.currentState.leave();
            this.stack.pop();
        }

        this.stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    }

    public pushState(state: IState) {

        if (this.stack.length > 0) {

            this.currentState.suspend();
        }

        this.stack.push(state);
        this.currentState.enter();
        this.currentState.resume();
    }

    public popState() {

        this.currentState.suspend();
        this.currentState.leave();
        this.stack.pop();
        this.currentState.resume();
    }

    private initialize(state: IState) {

        if (this.initialized) {

            throw new Error('Already initialized!');
        } else {

            this.switchState(state);
            this.initialized = true;
        }
    }

    private get currentState(): IState {

        return this.stack[this.stack.length - 1];
    }

    private stack: IState[] = [];
    private initialized: boolean = false;
} 