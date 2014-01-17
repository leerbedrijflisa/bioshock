class Preview {
    constructor(selector: string) {
        this.element = <HTMLIFrameElement> $(selector)[0];
        this.document = $(this.element).contents();
    }

    public addKeyUpHandler(eventHandler: (JQueryKeyEventObject) => any) {
        this.document.on('keyup', eventHandler);
    }

    public removeKeyUpHandler(eventHandler: (JQueryKeyEventObject) => any) {
        this.document.off('keyup', eventHandler);
    }

    public addKeyDownHandler(eventHandler: (JQueryKeyEventObject) => any) {
        this.document.on('keydown', eventHandler);
    }

    public removeKeyDownHandler(eventHandler: (JQueryKeyEventObject) => any) {
        this.document.off('keydown', eventHandler);
    }

    public update(file: FileDescriptor, contents: string) {
        if (this.fileId === file.id) {
            this.applyChanges(contents);
        }
        else {
            this.reloadDependencies();
        }
    }

    private applyChanges(contents) {
        this.updateTitle(contents);
        this.updateContents(contents);
        
    }

    private updateTitle(contents: string) {
        var title = contents.match(/<title>(.*?)(<\/|$)/m);

        if (title) {
            document.title = title[1];
        }
    }

    private updateContents(contents: string) {
        var html = this.document.find("html");
        html.html(contents);
    }

    private reloadDependencies() {
        var html = this.document.find("html");
        html.html(html.html());
    }

    private get fileId() {
        return $(this.element).data('fileId');
    }

    private element: HTMLIFrameElement;
    private document: JQuery;
}