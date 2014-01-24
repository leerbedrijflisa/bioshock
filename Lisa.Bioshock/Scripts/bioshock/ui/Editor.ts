/// <reference path="../../typings/codemirror/codemirror.d.ts" />

interface EditorEventObject {
    contents?: string;
    fileID?: string;
    fileName?: string;
}

class Editor {
    constructor(selector: string) {
        this.editor = CodeMirror.fromTextArea(<HTMLTextAreaElement> $(selector)[0], {
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
        this.editor.on('change', this.onChange);
        this.editor.on('cursorActivity', this.onCursorChange);
        this.codeMirrorEditor = new CodeMirrorEditor();
    }

    public addChangeHandler(eventHandler: (EditorEventObject) => void) {
        this.changeEventHandlers.push(eventHandler);
    }

    public removeChangeEventHandler(eventHandler: (EditorEventObject) => void) {
        var index = this.changeEventHandlers.indexOf(eventHandler);
        this.changeEventHandlers.splice(index);
    }

    public refresh() {
        this.editor.refresh();
    }

    public focus() {
        this.editor.focus();
    }

    public get contents() {
        return this.editor.getDoc().getValue();
    }

    public set contents(value: string) {
        this.editor.getDoc().setValue(value);
    }

    public openFile(file: IStorageItem): void {
        this.currentFile = file;
        var doc = new CodeMirror.Doc('', file.fileProps.contentType);
        this.editor.swapDoc(doc);

        this.handleCursorChange = false;
        this.contents = file.fileProps.contents;

        var cursor = JSON.parse(localStorage.getItem("caret_" + file.id));
        if (cursor !== undefined) {
            this.editor.getDoc().setCursor(cursor);
        }

        this.editor.focus();
        this.handleCursorChange = true;
    }

    public newFile(contentType): void {
        this.handleCursorChange = false;
        var doc = new CodeMirror.Doc('', contentType);
        this.editor.swapDoc(doc);
        this.handleCursorChange = true;
    }

    public renderErrors(data: any): number {
        for (var j = 0; j < this.widgets.length; j++) {
            this.widgets[j].clear();
        }
        this.editor.clearGutter("Errors");
        this.widgets = [];

        this.widgets = this.codeMirrorEditor.generateErrors(data, this.editor);

        return this.widgets.length;
    }

    private onChange = () => {
        var eventArgs: EditorEventObject = {
            contents: this.contents,
            fileID: this.currentFile.id,
            fileName: this.currentFile.name
        };

        for (var i = 0; i < this.changeEventHandlers.length; i++) {
            this.changeEventHandlers[i](eventArgs);
        }
    }

    private onCursorChange = () => {
        if (this.handleCursorChange && this.contents !== undefined && this.contents.length > 0) {
            // save the current cursor position.
            var cursor = this.editor.getDoc().getCursor();
            localStorage.setItem("caret_" + this.currentFile.id, JSON.stringify(cursor));
        }
    }

    public get file(): IStorageItem {
        return this.currentFile;
    }

    private editor: CodeMirror.Editor;
    private codeMirrorEditor: CodeMirrorEditor;
    private changeEventHandlers: { (EditorEventObject): void }[] = [];
    private currentFile: IStorageItem;
    private widgets: CodeMirror.LineWidget[] = [];
    private handleCursorChange: boolean = true;
} 