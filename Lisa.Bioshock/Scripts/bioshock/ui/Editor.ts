/// <reference path="../../typings/codemirror/codemirror.d.ts" />

interface EditorEventObject {
    contents?: string;
    fileId?: string;
    fileName?: string;
}

class Editor {
    constructor(selector: string) {
        this.initialize(selector);
    }

    private initialize(selector) {
        this.codeMirror = CodeMirror.fromTextArea(<HTMLTextAreaElement> $(selector)[0], {
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
        this.codeMirror.on('change', this.onChanged);
        this.codeMirror.on('cursorActivity', this.onCaretMoved);
        this.errorRenderer = new EditorErrorRenderer();
    }

    public refresh() {
        this.codeMirror.refresh();
    }

    public focus() {
        this.codeMirror.focus();
    }

    public openFile(file: StorageItem): void {
        this.currentFile = file;
        var doc = new CodeMirror.Doc('', file.fileProps.contentType);
        this.codeMirror.swapDoc(doc);

        this.handleCursorChange = false;
        this.contents = file.fileProps.contents;

        var cursor = JSON.parse(localStorage.getItem("caret_" + file.id));
        if (cursor !== null) {
            this.codeMirror.getDoc().setCursor(cursor);
        }

        this.codeMirror.focus();
        this.handleCursorChange = true;

        this.fileOpened.raise(file);
    }

    public renderErrors(data: any): number {
        for (var j = 0; j < this.widgets.length; j++) {
            this.widgets[j].clear();
        }
        this.codeMirror.clearGutter("Errors");
        this.widgets = [];

        this.widgets = this.errorRenderer.renderErrors(data, this.codeMirror);

        return this.widgets.length;
    }

    private onChanged = () => {
        this.file.fileProps.contents = this.contents;

        var eventArgs: EditorEventObject = {
            contents: this.contents,
            fileId: this.currentFile.id,
            fileName: this.currentFile.name
        };

        this.changed.raise(eventArgs, this.contents);

        for (var i = 0; i < this.changeEventHandlers.length; i++) {
            this.changeEventHandlers[i](eventArgs);
        }
    }

    private onCaretMoved = () => {
        this.caretMoved.raise(this.codeMirror);
        if (this.handleCursorChange && this.contents !== undefined && this.contents.length > 0) {
            // save the current cursor position.
            var cursor = this.codeMirror.getDoc().getCursor();
            localStorage.setItem("caret_" + this.currentFile.id, JSON.stringify(cursor));
        }
    }

    // events
    public fileOpened: EventDispatcher = new EventDispatcher(this);
    public changed: EventDispatcher = new EventDispatcher(this);
    public caretMoved: EventDispatcher = new EventDispatcher(this);

    // properties
    public get contents() {
        return this.codeMirror.getDoc().getValue();
    }

    public set contents(value: string) {
        this.codeMirror.getDoc().setValue(value);
    }

    public get file(): StorageItem {
        return this.currentFile;
    }

    // fields
    private codeMirror: CodeMirror.Editor;
    private errorRenderer: EditorErrorRenderer;
    private changeEventHandlers: { (EditorEventObject): void }[] = [];
    private currentFile: StorageItem;
    private widgets: CodeMirror.LineWidget[] = [];
    private handleCursorChange: boolean = true;
} 