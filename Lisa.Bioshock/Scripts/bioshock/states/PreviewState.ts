class PreviewState implements IState {

    constructor() {

        //this.editorState = new EditorState();
    }

    public enter(): void {        
    }

    public leave(): void {
    }

    public resume(): void {

        $(window).on('keyup', this.onKeyUp);

        this.iframe = <HTMLIFrameElement>$('#preview')[0];
        $(this.iframe.contentWindow).on('keyup', this.onKeyUp);            
    }

    public suspend(): void {

        $(window).off('keyup', this.onKeyUp);
        $(this.iframe.contentWindow).off('keyup', this.onKeyUp);
    }

    private onKeyUp = (event) => {

        if (event.keyCode == Keys.CTRL) {

            Workspace.instance.stateMachine.pushState(new EditorState());
        }
    }

    private iframe: HTMLIFrameElement;
    //private editorState: EditorState;
} 