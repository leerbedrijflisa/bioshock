/// <reference path="../../typings/codemirror/codemirror.d.ts" />
/// <reference path="../../typings/jqueryui/jqueryui.d.ts" />
class EditorWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);

        this.triggerOverlay = false;
        this.initialize();
    }

    public open(onOpen?: Function) {
        super.open(onOpen);   

        this.editor.refresh();
        this.editor.focus(); 

        return this;
    }

    public initialize() {
        super.initialize();

        this.$editor = $("#editor");
        this.$editorResizeOverlay = $('#editor-resize-overlay');
        this.$fileName = this.$element.find("#filename");

        this._currentFile = this.$editor.data('FileData');

        if (this.$element.data('CodeMirror_instance') === undefined) {
            this.editor = CodeMirror.fromTextArea(<HTMLTextAreaElement>this.$editor[0], {
                value: "abcde",
                lineNumbers: true,
                mode: "htmlmixed",
                smartIndent: false,
                tabSize: 2,
                theme: "default",
                gutters: ["Errors", "CodeMirror-linenumbers"],
                extraKeys: {
                    "Shift-Tab": "indentLess"
                }
            });
            this.editor.on('change', this.editorChange);
            this.editor.on('focus', this.editorFocus);

            this.$element.data('CodeMirror_instance', this.editor)
                .resizable({
                    minHeight: 52,
                    minWidth: 200,
                    containment: this.$editorResizeOverlay,
                    handles: 'all',
                    resize: (event, ui) => {

                        this.$element
                            .width(ui.size.width)
                            .height(ui.size.height);

                        this.editor.refresh();
                    },
                    start: () => {
                        this.$editorResizeOverlay.show();
                    },
                    stop: () => {
                        this.$editorResizeOverlay.hide();
                        this.editor.refresh();
                    }
                }).draggable({

                    iframeFix: true,
                    containment: 'window',
                    handle: 'h1'
                });            
        } else {
            this.editor = <CodeMirror.Editor>this.$element.data('CodeMirror_instance');
        }

        return this;
    }

    public get contents() {
        return this.editor.getDoc().getValue();
    }

    public set contents(value: string) {
        this.editor.getDoc().setValue(value);
        this.editor.focus();
    }

    public get cursor() {
        return this.editor.getDoc().getCursor();
    }

    public set cursor(pos: CodeMirror.Position) {
        this.editor.getDoc().setCursor(pos);
    }

    public openFile(file: IStorageItem) {
        if (file.type == StorageItemType.FOLDER) {
            throw new Error("Could not open a folder.");
        }

        this.$element.data("file-id", file.id);

        var doc = new CodeMirror.Doc('', file.fileProps.contentType);
        this.editor.swapDoc(doc);
        this.contents = file.fileProps.contents;

        this._currentFile = file;
    }


    private editorChange() {
        workspace.ajax.writeFile({
            fileID: this.fileID,
            contents: this.editor.getDoc().getValue()
        });

        if (this.fileName.indexOf(".css") > -1) {

            workspace.synchronizer.update({
                message: SynchronizeMessages.REFRESH,
                fileID: this.fileID,
                contents: this.editor.getDoc().getValue()
            });

        } else {

            workspace.synchronizer.update({
                message: SynchronizeMessages.UPDATE,
                fileID: this.fileID,
                contents: this.editor.getDoc().getValue()
            });
        }

        if (this.$errors.is(':visible')) {
            this.$errors.hide();
        }
    }

    private editorFocus() {
        workspace.synchronizer.update({
            message: SynchronizeMessages.UPDATE,
            fileID: this.fileID,
            contents: this.editor.getDoc().getValue()
        });
    }

    private keyUp() {
    }


    public get fileID() {
        return this._currentFile.id;
    }

    public get fileName(): string {
        return this._currentFile.name;
    }
    public set fileName(name: string) {
        this._currentFile.name = name;
        this.$fileName.text(name);
    }


    public editor: CodeMirror.Editor;

    private $editor: JQuery;
    private $editorResizeOverlay: JQuery;
    private $fileName: JQuery;
    private $errors
    private _currentFile: IStorageItem;
    private _lastCursorPos: CodeMirror.Position;
} 