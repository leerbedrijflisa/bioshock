/// <reference path="../../typings/codemirror/codemirror.d.ts" />
class EditorWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);
    }

    public open(onOpen?: Function) {
        super.open(onOpen);

        this.editor.focus();
        this.editor.getDoc().setCursor(this.cursor);

        return this;
    }

    public initialize() {
        if (this.$element !== undefined) {
            this._title = this.$element.find("#filename").html();
        }

        this.editor = CodeMirror.fromTextArea(<HTMLTextAreaElement>$("#editor")[0], {
            value: "",
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

        return super.initialize();
    }

    public get contents() {
        return this.editor.getDoc().getValue();
    }

    public set contents(value: string) {
        this.editor.getDoc().setValue(value);
    }

    public get cursor() {
        return this.editor.getDoc().getCursor();
    }

    public set cursor(pos: CodeMirror.Position) {
        this.editor.getDoc().setCursor(pos);
    }

    public get title() {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
        this.$element.find("#filename").html(this._title);
    }


    public openFile(file: IStorageItem) {
        console.log(file);
        if (file.type == StorageItemType.FOLDER) {
            throw new Error("Could not open a folder.");
        }

        this.title = file.name;
        this.$element.data("file-id", file.id);

        var doc = this.editor.getDoc().copy(false);
        this.editor.swapDoc(doc);
        this.contents = file.fileProps.contents;
    }


    public editor: CodeMirror.Editor;

    private _title: string = "Geen bestand geopend.";
    private _lastCursorPos: CodeMirror.Position;
} 