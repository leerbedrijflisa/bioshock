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
        this.initialize();
    }

    private initialize() {
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

                this.resizing.raise(event);
            },
            start: () => {
                this.$editorResizeOverlay.show();
            },
            stop: () => {
                this.$editorResizeOverlay.hide();
                this.resized.raise();
            }
        }).draggable({
            iframeFix: true,
            containment: 'window',
            handle: '#editor-header'
        });

        return this;
    }

    public clearEventListeners() {
        this.resizing.clear();
        this.resized.clear();

        this.$element.resizable('destroy');
        this.$element.draggable('destroy');

        return super.clearEventListeners();
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

    // events
    public resizing: EventDispatcher = new EventDispatcher(this);
    public resized: EventDispatcher = new EventDispatcher(this);

    private $editorResizeOverlay: JQuery;
    private $title: JQuery;
    private $errors: JQuery;
} 