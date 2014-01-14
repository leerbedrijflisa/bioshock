class EditorState implements IState {

    constructor() {
    }

    public enter() {
        this._editorWindow = new EditorWindow('#editorWindow');
        this._editorWindow.open();
    }    

    public leave() {

        this._editorWindow.close();
    }

    public resume() {
        var preview = this.stateMachine.preview;

        $(window).on('keyup', this.onKeyUp);

        $(preview).on('keyup', this.onKeyUp);
    }

    public suspend() {
        var preview = this.stateMachine.preview;

        $(window).off('keyup', this.onKeyUp);
        $(preview).off('keyup', this.onKeyUp);
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.CTRL) {

            this.stateMachine.popState();

        } else if (event.altKey) {

            if (event.keyCode == Keys.N) {

                this.stateMachine.pushState(new NewFileState());

            } else if (event.keyCode == Keys.O) {

                this.stateMachine.pushState(new OpenFileState());
            }

        } else if (event.keyCode == Keys.ESC) {

            this.stateMachine.pushState(new MenuState());
        }
    }


    // properties

    // fields
    public stateMachine: StateMachine;

    private _editorWindow: EditorWindow;
}  