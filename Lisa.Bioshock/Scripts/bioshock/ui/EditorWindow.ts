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
        this.$title = this.$element.find('#editor-title');
        this.$errors = this.$element.find('#editor-errors');

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
            handle: '#editor-header'
        });

        return this;
    }

    public set errorCount(count: number) {
        this.$element
            .find('#editor-error-count')
            .text(count == 0 ? 'Geen' : count);
    }

    public set title(title: string) {
        this.$title.text(title);
    }

    public get title(): string {
        return this.$title.text();
    }

    public hideErrors() {
        if (this.$errors.is(':visible')) {
            this.$errors.hide();
        }
    }

    public showErrors() {
        if (this.$errors.not(':visible')) {
            this.$errors.show();
        }
    }

    public onEditorResize(type: ResizeType): void {
    }

    private $editorResizeOverlay: JQuery;
    private $title: JQuery;
    private $errors: JQuery;
} 