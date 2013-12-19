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

    public get editorValue() {
        return this.editor.getDoc().getValue();
    }

    public set editorValue(value: string) {
        this.editor.getDoc().setValue(value);
    }

    public get cursor() {
        return this.editor.getDoc().getCursor();
    }

    public set cursor(pos: CodeMirror.Position) {
        this.editor.getDoc().setCursor(pos);
    }


    public editor: CodeMirror.Editor;

    private _lastCursorPos: CodeMirror.Position;
} 