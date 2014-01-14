class PreviewState implements IState {

    constructor(preview: HTMLIFrameElement) {
        this._preview = preview.contentDocument || preview.contentWindow;
    }

    public enter(): void {        
    }

    public leave(): void {
    }

    public resume(): void {
        $(window).on('keyup', this.onKeyUp);
        $(this._preview).on('keyup', this.onKeyUp);            
    }

    public suspend(): void {
        $(window).off('keyup', this.onKeyUp);
        $(this._preview).off('keyup', this.onKeyUp);
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

    private _preview: any;
} 