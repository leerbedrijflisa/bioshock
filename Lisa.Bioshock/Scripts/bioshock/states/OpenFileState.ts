class OpenFileState implements IState {

    constructor() {
    }

    public onOpenFile(file: StorageItem): void {
    }

    public enter() {
        this.window = <OpenFileWindow> new OpenFileWindow('#open-file-window')
            .open()
            .close(() => {
                if (this.stateMachine.currentState == this) {
                    this.stateMachine.popState();
                }
            });

        this.window.onOpenFile = (fileId: string) => {
            workspace.ajax.getFileContents(fileId, (file: StorageItem) => {
                if (file.type == StorageItemType.FOLDER) {
                    throw new Error("Could not open a folder.");
                }

                this.onOpenFile(file);
                this.window.close();
            });
        };
    }

    public leave() {

        this.window.close();
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

    private window: OpenFileWindow;
} 