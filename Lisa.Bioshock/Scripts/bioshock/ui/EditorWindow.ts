/// <reference path="../../typings/codemirror/codemirror.d.ts" />
/// <reference path="../../typings/jqueryui/jqueryui.d.ts" />
enum ResizeType {
    RESIZING = 1,
    START = 2,
    STOP = 3
}

class EditorWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);

        this.triggerOverlay = false;
        //this.initialize();
    }

    public open(onOpen?: Function) {
        super.open(onOpen);   

        //this.editor.refresh();
        //this.editor.focus(); 

        return this;
    }

    public initialize() {
        super.initialize();

        this.$editorResizeOverlay = $('#editor-resize-overlay');
        this.$fileName = this.$element.find('#filename');

        this.$element.resizable({
            minHeight: 52,
            minWidth: 200,
            containment: this.$editorResizeOverlay,
            handles: 'all',
            resize: (event, ui) => {

                this.$element
                    .width(ui.size.width)
                    .height(ui.size.height);

                this.onEditorResize(ResizeType.RESIZING);
            },
            start: () => {
                this.$editorResizeOverlay.show();
                this.onEditorResize(ResizeType.START);
            },
            stop: () => {
                this.$editorResizeOverlay.hide();
                this.onEditorResize(ResizeType.STOP);
            }
        }).draggable({
            iframeFix: true,
            containment: 'window',
            handle: 'h1'
        });

        return;

        this.$editor = $("#editor");
        this.$editorResizeOverlay = $('#editor-resize-overlay');
        this.$fileName = this.$element.find("#filename");

        this._currentFile = this.$editor.data('FileData');

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

    public set title(title: string) {
        this.$fileName.text(title);
    }

    public get title(): string {
        return this.$fileName.text();
    }

    public onEditorResize(type: ResizeType): void {
    }

    private editorChange() {

        //if (this.$errors.is(':visible')) {
        //    this.$errors.hide();
        //}
    }

    private editorFocus() {
        //workspace.synchronizer.update({
        //    message: SynchronizeMessages.UPDATE,
        //    fileID: this.fileID,
        //    contents: this.editor.getDoc().getValue()
        //});
    }

    private keyUp() {
    }


    public get fileID() {
        return this._currentFile.id;
    }

    public editor: CodeMirror.Editor;

    private $editor: JQuery;
    private $editorResizeOverlay: JQuery;
    private $fileName: JQuery;
    private $errors
    private _currentFile: IStorageItem;
    private _lastCursorPos: CodeMirror.Position;
} 