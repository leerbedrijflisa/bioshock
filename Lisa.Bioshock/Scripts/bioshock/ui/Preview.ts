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
        if (this.fileId === file.ID) {
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
        var bodyMatch = contents.match(/<body>((.*?|[\r\n*?])*?)(<\/body(.*?)>|<\/html(.*?)>)/gmi);

        if (bodyMatch != null && bodyMatch.length > 0) {
            this.document.find('body')[0].innerHTML = bodyMatch[0];
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

    private element: HTMLIFrameElement;
    private document: JQuery;
    private oldLink: string;
}