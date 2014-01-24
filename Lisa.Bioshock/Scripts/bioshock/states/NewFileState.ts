class NewFileState implements IState {

    constructor() {
    }

    public onNewFile(file: IStorageItem) {
    }

    public enter() {
        this._window = <NewFileWindow> new NewFileWindow('#newFileWindow')
            .open()
            .close(() => {
                if (this.stateMachine.currentState == this) {
                    this.stateMachine.popState();
                }
            });
        this._window.onNewFile = (fileName: string) => {
            if (fileName.indexOf('.html') > -1 || fileName.indexOf('.css') > -1) {
                workspace.ajax.createFile({ fileName: fileName }, (data: AjaxFileResult) => {
                    if (data.result) {
                        this.onNewFile(data);
                    } else {
                        this._window.showError(data.errorMessage);
                    }
                });
            } else {
                this._window.showError('Extensie wordt niet herkend.');
            }
        }
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

    private _window: NewFileWindow;
}