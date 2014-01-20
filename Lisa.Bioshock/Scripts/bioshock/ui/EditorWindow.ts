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

        return this;
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

    private $editorResizeOverlay: JQuery;
    private $fileName: JQuery;
    private $errors: JQuery;
} 