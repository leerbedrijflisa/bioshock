class EditorState implements IState {

    public enter() {
        this.editorWindow = new EditorWindow('#editorWindow');
        this.editorWindow.onEditorResize = (type: ResizeType) => {

            if (type == ResizeType.RESIZING || type == ResizeType.STOP) {
                workspace.editor.refresh();
            }
        }

        this.editorWindow.open();

        if (workspace.editor.file === undefined) {
            this.openStartUpFile();
        }

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

    private openStartUpFile = () => {
        $.get('/project/getstartupfile', { projectID: workspace.projectID }, (file: IStorageItem) => {
            workspace.editor.openFile(file);
            workspace.preview.fileId = file.id;
            this.editorWindow.title = file.name;
        });
    }

    private onKeyDown = (event: JQueryKeyEventObject) => {
        this.ignoreCtrl = event.ctrlKey && event.keyCode != Keys.CTRL;
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.CTRL && !this.ignoreCtrl) {
            this.stateMachine.popState();
        }
        else if (event.keyCode == Keys.NUMLOCK) {
            var validator = new Validator();
            validator.onFileValidationFinished = (data) => {

                var errorCount = workspace.editor.renderErrors(data);
                this.editorWindow.errorCount = errorCount;
                this.editorWindow.showErrors();
            }
            validator.validateFile(workspace.editor.file.name, workspace.editor.contents);
        }
        else if (event.altKey) {
            if (event.keyCode == Keys.N) {
                this.stateMachine.pushState(new NewFileState());
            }
            else if (event.keyCode == Keys.O) {

                var openFileState = new OpenFileState();
                openFileState.onOpenFile = this.onOpenFile;

                this.stateMachine.pushState(openFileState);
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

        // TEMPORARY WRITE FILE FIX!!!
        var data = {
            projectID: workspace.projectID,
            fileID: event.fileID,
            contents: event.contents
        };

        //console.log('Editor change');
        $.post('/project/writefile', data, function (result) {
            //console.log(result);
        });

        this.editorWindow.hideErrors();
    }

    private onOpenFile = (file: IStorageItem): void => {
        if (file.name.indexOf('.html') > -1) {
            workspace.preview.fileId = file.id;
        }
        workspace.editor.openFile(file);
        this.editorWindow.title = file.name;
    }

    // properties

    // fields
    public stateMachine: StateMachine;
    private editorWindow: EditorWindow;
    private monitor: Monitor;
    private synchronizer: Synchronizer;
    private ignoreCtrl: boolean = false;
}  