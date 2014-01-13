class EditorState implements IState {

    constructor() {

        this.editorWindow = new EditorWindow('#editorWindow');
    }

    public enter() {
        
        this.editorWindow.open();
    }    

    public leave() {

        this.editorWindow.close();
    }

    public resume() {

        $(window).on('keyup', this.onKeyUp);

        this.iframe = <HTMLIFrameElement>$('#preview')[0];
        $(this.iframe.contentWindow).on('keyup', this.onKeyUp);
    }

    public suspend() {

        $(window).off('keyup', this.onKeyUp);
        $(this.iframe.contentWindow).off('keyup', this.onKeyUp);
    }

    private onKeyUp(event) {

        if (event.keyCode == Keys.CTRL) {

            Workspace.instance.stateMachine.popState();
        }
    }

    private editorWindow: EditorWindow;
    private iframe: HTMLIFrameElement;
}  