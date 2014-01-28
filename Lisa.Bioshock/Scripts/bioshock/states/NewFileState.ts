class NewFileState implements IState {

    public static name = 'NewFileState';

    public getName() {
        return NewFileState.name;
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
                    this.onNewFile(data);
                    this.window.close();
                }, (error: StorageItemAjaxResult) => {
                    this.window.showError(error.errorMessage);

                    // Return false to prevent the default error toast from showing.
                    return false;
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
        this.window.onNewFile = function () { };
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