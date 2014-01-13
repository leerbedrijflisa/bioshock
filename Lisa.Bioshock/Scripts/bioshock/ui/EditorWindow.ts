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
        
        this.editor.swapDoc(new CodeMirror.Doc(''));
        this.editor.getDoc().setCursor(this.cursor);
        this.editor.focus(); 

        return this;
    }

    public initialize() {
        if (this.$element !== undefined) {
            this._title = this.$element.find("#filename").html();
        }

        if (this.$element.data('CodeMirror') === undefined) {
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
            this.$element.data('CodeMirror', this.editor);

            this.$element.resizable({

                minHeight: 52,
                minWidth: 200,
                containment: '#editor-resize-overlay',
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
                },
                handles: 'all'
            }).draggable({

                iframeFix: true,
                containment: 'window',
                handle: 'h1'
            });
        } else {
            this.editor = <CodeMirror.Editor>this.$element.data('CodeMirror');
        }
        return super.initialize();
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

        var doc = new CodeMirror.Doc('', file.fileProps.contentType);
        this.editor.swapDoc(doc);
        this.contents = file.fileProps.contents;
    }


    public editor: CodeMirror.Editor;

    private _title: string = "Geen bestand geopend.";
    private _lastCursorPos: CodeMirror.Position;
    private $editorResizeOverlay = $('#editor-resize-overlay');
} 