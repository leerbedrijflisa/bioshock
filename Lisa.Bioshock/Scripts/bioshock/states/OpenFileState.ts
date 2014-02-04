class OpenFileState implements State {

    public enter() {
        this.window = <OpenFileWindow> new OpenFileWindow('#open-file-window');
        this.window.opening.addListener(this.onWindowOpening);
        this.window.closed.addListener(this.onWindowClosed);
        this.window.fileSelected.addListener(this.onFileSelected);
        this.window.open();
    }

    public leave() {
        this.window.clearEventListeners().close();
        this.fileSelected.clear();
        this.fileOpened.clear();
    }

    public resume() {
        $(window).on('keyup', this.onKeyUp);
    }

    public suspend() {
        $(window).off('keyup', this.onKeyUp);
    }

    private pop = () => {
        this.window.closed.removeListener(this.onWindowClosed);
        this.window.close();
        this.stateMachine.popState();
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {
        if (event.keyCode == Keys.ESC) {
            this.pop();
        }
    }

    private onWindowOpening = () => {
        workspace.ajax.getFiles((data) => {
            this.window.setFileData(data.items);
        });
    }

    private onFileSelected = (fileId: string) => {
        this.fileSelected.raise(fileId);

        workspace.ajax.getFileContents({
            fileId: fileId,
            success: this.onFileOpened,
            error: (data: AjaxResult) => {
                console.log(data.errorMessage);
            }
        });
    }

    private onFileOpened = (data: StorageItemAjaxResult) => {
        var file = data.items[0];

        if (file.type == StorageItemType.FOLDER) {
            throw new Error("Could not open a folder.");
        }

        this.fileOpened.raise(file);
        this.pop();
    }

    private onWindowClosed = () => {
        this.pop();
    }


    // events
    public fileSelected: EventDispatcher = new EventDispatcher(this);
    public fileOpened: EventDispatcher = new EventDispatcher(this);

    // fields
    public stateMachine: StateMachine;

    private window: OpenFileWindow;
} 