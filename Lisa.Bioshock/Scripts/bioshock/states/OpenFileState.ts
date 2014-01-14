class OpenFileState implements IState {

    constructor() {
    }

    public enter() {
        this._window = <OpenFileWindow> new OpenFileWindow('#openFileWindow')
            .open()
            .close(() => {
                if (this.stateMachine.currentState == this) {
                    this.stateMachine.popState();
                }
            });
    }

    public leave() {

        this._window.close();
    }

    public resume() {

        $(window).on('keyup', this.onKeyUp);
    }

    public suspend() {

        $(window).off('keyup', this.onKeyUp);
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.ESC) {

            this.stateMachine.popState();
        }
    }

    // fields
    public stateMachine: StateMachine;

    private _window: OpenFileWindow;
} 