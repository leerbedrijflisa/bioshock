class EditorState implements State {
    
    public enter() {
        this.editorWindow = new EditorWindow('#editor-window');
        this.editorWindow.resizing.addListener(() => workspace.editor.refresh());
        this.editorWindow.resized.addListener(() => workspace.editor.refresh());
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
        this.editorWindow.clearEventListeners().close();
    }

    public resume() {
        $(window).on('keydown', this.onKeyPressed);
        $(window).on('keyup', this.onKeyReleased);

        workspace.preview.keyPressed.addListener(this.onKeyPressed);
        workspace.preview.keyReleased.addListener(this.onKeyReleased);

        workspace.editor.changed.addListener(this.onEditorChanged);
        workspace.editor.refresh();
        workspace.editor.focus();
    }

    public suspend() {
        $(window).off('keydown', this.onKeyPressed);
        $(window).off('keyup', this.onKeyReleased);

        workspace.preview.keyPressed.removeListener(this.onKeyPressed);
        workspace.preview.keyReleased.removeListener(this.onKeyReleased);
    }

    private openStartUpFile = () => {
        workspace.ajax.getStartUpFile({
            success: (data: StorageItemAjaxResult) => {
                var file = data.items[0];

                this.lastOpenedFile = file;
                workspace.editor.openFile(file);
                workspace.preview.fileId = file.id;
                this.editorWindow.title = file.name;
                this.oldContents = file.fileProps.contents;
            }
        });
    }

    private onKeyPressed = (event: JQueryKeyEventObject) => {
        this.ignoreCtrl = event.ctrlKey && event.keyCode != Keys.CTRL;
    }

    private onKeyReleased = (event: JQueryKeyEventObject) => {

        if (this.saveFile) {
            workspace.ajax.writeFile({
                fileId: workspace.editor.file.id,
                contents: workspace.editor.contents,
                oldContents: this.oldContents,
            })
            this.saveFile = false;
            this.oldContents = workspace.editor.contents;
        }

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
                newFileState.fileCreated.addListener(this.onFileOpened);

                this.stateMachine.pushState(newFileState);
            }
            else if (event.keyCode == Keys.O) {
                var openFileState = new OpenFileState();
                openFileState.fileOpened.addListener(this.onFileOpened);

                this.stateMachine.pushState(openFileState);
            }
            else if (event.keyCode == Keys.C) {
                if (this.lastOpenedFile !== undefined) {
                    this.onFileOpened(this.lastOpenedFile);
                }
            }
            else if (event.keyCode == Keys.H) {
                var cheatSheetState = new CheatSheetState();
                cheatSheetState.enter();

                this.stateMachine.pushState(cheatSheetState);
            }
        }
        else if (event.keyCode == Keys.ESC) {
            this.stateMachine.pushState(new MenuState());
        }
 
    }

    private onEditorChanged = (event: EditorEventObject) => {
        this.synchronizer.processChanges({
            fileID: event.fileId,
            fileName: event.fileName,
            contents: event.contents
        });

        clearTimeout(this.editorChangeTimer);
        this.editorChangeTimer = setTimeout(() => {
            this.saveFile = true;
        }, 1500);

        this.editorWindow.hideErrors();
    }

    private onFileOpened = (file: StorageItem) => {
        if (FileSystemHelper.isHTML(file.name)) {
            workspace.preview.clear();
        }

        clearTimeout(this.editorChangeTimer);

        if (this.saveFile) {
            workspace.ajax.writeFile({
                fileId: currentFile.id,
                contents: currentFile.fileProps.contents,
                oldContents: this.oldContents,
            })
            this.saveFile = false;
            this.oldContents = workspace.editor.contents;
        }

        var currentFile = workspace.editor.file;
        
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
                fileId: workspace.editor.file.id,
                contents: workspace.editor.contents,
                oldContents: this.oldContents,
                success: () => {
                    if (FileSystemHelper.isCSS(workspace.editor.file.name)) {
                        this.synchronizer.processChanges({
                            fileID: workspace.editor.file.id,
                            fileName: workspace.editor.file.name,
                            contents: workspace.editor.contents,
                            oldContents: this.oldContents,
                        });
                    }
                    this.oldContents = workspace.editor.contents;
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
    public oldContents: string;
}  