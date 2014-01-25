class NewFileState implements IState {

    public static name = 'NewFileState';

    public getName() {
        return self.name;
    }

    public onNewFile(file: StorageItem) {
    }

    public enter() {
        this.window = <NewFileWindow> new NewFileWindow('#new-file-window')
            .open()
            .close(() => {
                if (this.stateMachine.currentState == this) {
                    this.stateMachine.popState();

                    if (this.stateMachine.currentState.getName() != EditorState.name) {
                        this.stateMachine.pushState(new EditorState());
                    }
                }
            });

        this.window.onNewFile = (fileName: string) => {
            if(FileSystemHelper.hasValidExtension(fileName)) {
                workspace.ajax.createFile({ fileName: fileName }, (data: StorageItemAjaxResult) => {
                    if (data.result) {
                        this.onNewFile(data);
                        this.window.close();
                    } else {
                        this.window.showError(data.errorMessage);
                    }
                });
            } else {
                if (fileName.indexOf('.') > -1) {
                    this.window.showError('De extensie werd niet herkend.');
                } else {
                    this.window.showError('Geef een extensie op.');
                }
            }
        }
    }

    public leave() {
        this.window.close();
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

    private window: NewFileWindow;
}