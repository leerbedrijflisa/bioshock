class EditorState implements IState {

    public static name = 'EditorState';

    public getName() {
        return EditorState.name;
    }

    public enter() {
        this.editorWindow = new EditorWindow('#editor-window');
        this.editorWindow.onEditorResize = (type: ResizeType) => {

            if (type == ResizeType.RESIZING || type == ResizeType.STOP) {
                workspace.editor.refresh();
            }
        }

        this.editorWindow.open();

        if (workspace.editor.file === undefined) {
            this.openStartUpFile();
        } else {
            this.lastOpenedFile = workspace.editor.file;
        }

        this.monitor = new Monitor(workspace.signalR, workspace.preview, workspace.editor);
        this.synchronizer = new Synchronizer(workspace.signalR, workspace.projectID);
        this._syncInterval = setInterval(this.syncInterval, 1000);
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
        workspace.ajax.getStartUpFile({
            success: (file: StorageItem) => {
                this.lastOpenedFile = file;
                workspace.editor.openFile(file);
                workspace.preview.fileId = file.id;
                this.editorWindow.title = file.name;
            }
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
                var newFileState = new NewFileState();
                newFileState.onNewFile = this.onOpenFile;

                this.stateMachine.pushState(newFileState);
            }
            else if (event.keyCode == Keys.O) {
                var openFileState = new OpenFileState();
                openFileState.onOpenFile = this.onOpenFile;

                this.stateMachine.pushState(openFileState);
            }
            else if (event.keyCode == Keys.C) {
                if (this.lastOpenedFile !== undefined) {
                    this.onOpenFile(this.lastOpenedFile);
                }
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

        clearTimeout(this.editorChangeTimer);
        this.editorChangeTimer = setTimeout(() => {
            this.saveFile = true;
        }, 1500);

        this.editorWindow.hideErrors();
    }

    private onOpenFile = (file: StorageItem) => {
        if (FileSystemHelper.isHTML(file.name)) {
            workspace.preview.clear();
        }

        clearTimeout(this.editorChangeTimer);
        this.saveFile = false;

        var currentFile = workspace.editor.file;

        workspace.ajax.writeFile({
            fileID: currentFile.id,
            contents: currentFile.fileProps.contents
        })

        if(FileSystemHelper.isHTML(file.name)) {
            workspace.preview.fileId = file.id;
        }
        workspace.editor.openFile(file);
        this.editorWindow.title = file.name;

        if (currentFile.fileProps.contentType != this.lastOpenedFile.fileProps.contentType) {
            // Enables ALT+C functionality
            this.lastOpenedFile = currentFile;
        }
    }

    private syncInterval = () => {
        if (this.saveFile) {
            workspace.ajax.writeFile({
                fileID: workspace.editor.file.id,
                contents: workspace.editor.contents,
                success: () => {
                    if (FileSystemHelper.isCSS(workspace.editor.file.name)) {
                        this.synchronizer.processChanges({
                            fileID: workspace.editor.file.id,
                            fileName: workspace.editor.file.name,
                            contents: workspace.editor.contents
                        });
                    }
                }
            });
            this.saveFile = false;
        }
    }

    // properties

    // fields
    public stateMachine: StateMachine;
    private editorWindow: EditorWindow;
    private monitor: Monitor;
    private synchronizer: Synchronizer;
    private ignoreCtrl: boolean = false;
    private lastOpenedFile: StorageItem;
    private _syncInterval: number;
    private editorChangeTimer: number;
    private saveFile: boolean = false;
}  