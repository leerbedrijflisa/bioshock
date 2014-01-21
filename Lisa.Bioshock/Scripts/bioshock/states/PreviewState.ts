class PreviewState implements IState {

    constructor() {
    }

    public enter(): void {        
    }

    public leave(): void {
    }

    public resume(): void {
        $(window).on('keyup', this.onKeyUp);
        workspace.preview.addKeyUpHandler(this.onKeyUp);
    }

    public suspend(): void {
        $(window).off('keyup', this.onKeyUp);
        workspace.preview.removeKeyUpHandler(this.onKeyUp);
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.CTRL) {
            this.stateMachine.pushState(new EditorState());
        }
        else if (event.altKey) {
            if (event.keyCode == Keys.O) {
                this.stateMachine.pushState(new EditorState());
                this.stateMachine.pushState(new OpenFileState());
            }
            else if (event.keyCode == Keys.N) {
                this.stateMachine.pushState(new EditorState());
                this.stateMachine.pushState(new NewFileState());
            }
        }
        else if (event.keyCode == Keys.ESC) {
            this.stateMachine.pushState(new MenuState());
        }
    }


    // properties

    // fields
    public stateMachine: StateMachine;
} 