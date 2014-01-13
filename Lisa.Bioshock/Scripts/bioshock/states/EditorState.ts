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

    private onKeyUp(event) {

        if (event.keyCode == Keys.CTRL) {

            Workspace.instance.stateMachine.popState();
        }
    }


    // properties

    // fields
    public stateMachine: StateMachine;

    private _editorWindow: EditorWindow;
}  