class EditorState implements IState {

    public enter() {
        this.editorWindow = new EditorWindow('#editorWindow');
        this.editorWindow.open();

        this.monitor = new Monitor(workspace.signalR, workspace.preview, workspace.editor);
        this.synchronizer = new Synchronizer(workspace.signalR, workspace.projectID);
    }    

    public leave() {

        this.editorWindow.close();
    }

    public resume() {
        $(window).on('keyup', this.onKeyUp);
        $(window).on('keydown', this.onKeyDown);
        workspace.preview.addKeyUpHandler(this.onKeyUp);
        workspace.preview.addKeyDownHandler(this.onKeyDown);
        workspace.editor.addChangeHandler(this.onEditorChange);
        workspace.editor.refresh();
        workspace.editor.focus();
    }

    public suspend() {
        $(window).off('keyup', this.onKeyUp);
        $(window).off('keydown', this.onKeyDown);
        workspace.preview.removeKeyUpHandler(this.onKeyUp);
        workspace.preview.removeKeyDownHandler(this.onKeyDown);
    }

    private onKeyDown = (event: JQueryKeyEventObject) => {
        this.ignoreCtrl = event.ctrlKey && event.keyCode != Keys.CTRL;
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.CTRL && !this.ignoreCtrl) {
            this.stateMachine.popState();
        }
        else if (event.altKey) {
            if (event.keyCode == Keys.N) {
                this.stateMachine.pushState(new NewFileState());
            }
            else if (event.keyCode == Keys.O) {
                this.stateMachine.pushState(new OpenFileState());
            }
        }
        else if (event.keyCode == Keys.ESC) {
            this.stateMachine.pushState(new MenuState());
        }
    }

    private onEditorChange = (event: EditorEventObject) => {
        this.synchronizer.processChanges({
            fileID: event.fileID,
            fileName: event.fileName,
            contents: event.contents
        });
    }

    // properties

    // fields
    public stateMachine: StateMachine;
    private editorWindow: EditorWindow;
    private monitor: Monitor;
    private synchronizer: Synchronizer;
    private ignoreCtrl: boolean = false;
}  