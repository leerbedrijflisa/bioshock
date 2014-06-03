class NewFileState implements State {

    public enter() {
        this.window = <NewFileWindow> new NewFileWindow('#new-file-window').open();
        this.window.closed.addListener(this.onWindowClosed);
        this.window.fileCreating.addListener(this.onFileCreating);
    }

    public leave() {
        this.window.clearEventListeners().close();
        this.window.fileCreating.removeListener(this.onFileCreating);
        this.fileCreating.clear();
        this.fileCreated.clear();
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
        } else if (event.altKey) {
            if (event.keyCode == Keys.O) {
                this.pop();
                var openFileState = new OpenFileState();

                this.stateMachine.pushState(openFileState);
            }
            else if (event.keyCode == Keys.N) {
                this.pop();
            }
            else if (event.keyCode == Keys.H) {
                this.pop();
                var cheatSheetState = new CheatSheetState();
                cheatSheetState.enter();

                this.stateMachine.pushState(cheatSheetState);
            }
        }
    }

    private onFileCreating = (fileName: string) => {
        this.fileCreating.raise(fileName);

        if (FileSystemHelper.hasValidExtension(fileName)) {
            workspace.ajax.createFile({
                fileName: fileName,
                success: (data: StorageItemAjaxResult) => {
                    this.fileCreated.raise(data.items[0]);
                    this.pop();
                },
                error: (error: AjaxResult) => {
                    this.window.showError(error.errorMessage);

                    // Return false to prevent the default error toast from showing.
                    return false;
                }
            });
        }
        else {
            if (fileName.indexOf('.') > -1) {
                this.window.showError('De extensie werd niet herkend.');
            }
            else {
                this.window.showError('Geef een extensie op.');
            }
        }
    }

    private onWindowClosed = () => {
        this.pop();
    }

    // events
    public fileCreating: EventDispatcher = new EventDispatcher(this);
    public fileCreated: EventDispatcher = new EventDispatcher(this);

    // fields
    public stateMachine: StateMachine;

    private window: NewFileWindow;
}