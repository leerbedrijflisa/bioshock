class PreviewState implements IState {

    constructor() {
        //this.editorState = new EditorState();
    }

    public enter(): void {        
    }

    public leave(): void {
    }

    public resume(): void {
        var preview = this.stateMachine.preview;

        $(window).on('keyup', this.onKeyUp);
        $(preview).on('keyup', this.onKeyUp);            
    }

    public suspend(): void {
        var preview = this.stateMachine.preview;

        $(window).off('keyup', this.onKeyUp);
        $(preview).off('keyup', this.onKeyUp);
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.CTRL) {

            this.stateMachine.pushState(new EditorState());

        } else if (event.keyCode == Keys.ESC) {

            this.stateMachine.pushState(new MenuState());
        }
    }


    // properties

    // fields
    public stateMachine: StateMachine;
} 