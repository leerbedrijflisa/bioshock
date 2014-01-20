class OpenFileState implements IState {

    constructor() {
    }

    public onOpenFile(file: IStorageItem): void {
    }

    public enter() {
        this._window = <OpenFileWindow> new OpenFileWindow('#openFileWindow')
            .open()
            .close(() => {
                if (this.stateMachine.currentState == this) {
                    this.stateMachine.popState();
                }
            });

        this._window.onOpenFile = (fileId: string) => {
            workspace.ajax.getFileContents(fileId, (file: IStorageItem) => {
                if (file.type == StorageItemType.FOLDER) {
                    throw new Error("Could not open a folder.");
                }

                this.onOpenFile(file);
                this._window.close();
            });
        };
    }

    public leave() {

        this._window.close();
        this.onOpenFile = function () { };
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