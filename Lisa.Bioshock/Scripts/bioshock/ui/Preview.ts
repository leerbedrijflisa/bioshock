class Preview {
    constructor(selector: string) {
        this.element = <HTMLIFrameElement> $(selector)[0];
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
        if (this.fileId === file.ID) {
            this.applyChanges(contents);
        }
        else {
            this.reloadDependencies();
        }
    }

    public clear() {
        this.document.html('<html><head></head><body></body></html>');
    }

    private applyChanges(contents) {
        this.updateTitle(contents);
        this.updateContents(contents);
    }

    private updateTitle(contents: string) {
        var title = contents.match(/<title>((.*?|[\r\n*?])*?)(<\/|$)./mi);

        if (title) {
            document.title = title[1];
        } else {
            document.title = null;
        }
    }

    private updateHead(contents: string, reload = false) {
        var headMatch = contents.match(/<head>((.*?|[\r\n*?])*?)(<\/head(.*?)>|<body(.*?)>)/gmi);

        if (headMatch != null && headMatch.length > 0) {
            var link = headMatch[0].match(/<link (.*?)>/gmi);

            if (link != null && link.length > 0 && (reload || this.oldLink != link[0])) {
                this.document.find('head').html(link[0]);
                this.oldLink = link[0];
            }
        }
    }

    private updateBody(contents: string) {
        var bodyMatch = contents.match(/<body(.*?)>((.*?|[\r\n*?])*?).*?$/gi);

        if (bodyMatch != null && bodyMatch.length > 0) {
            this.document.find('body')[0].innerHTML = bodyMatch[0].replace(/<\/body>/gi, '')
                                                                  .replace(/<\/html>/gi, '');
        } else {
            this.document.find('body')[0].innerHTML = contents;
        }
    }

    private updateContents(contents: string) {
        this.updateHead(contents);
        this.updateBody(contents);
    }

    private reloadDependencies() {
        this.updateHead(this.document.find("head")[0].outerHTML, true);
    }

    public get fileId() {
        return $(this.element).data('fileId');
    }

    public set fileId(id: string) {
        $(this.element).data('fileId', id);
    }

    private get document(): JQuery {
        return $((this.element.contentDocument
            || this.element.contentWindow.document).documentElement);
    }

    private element: HTMLIFrameElement;
    private oldLink: string;
}