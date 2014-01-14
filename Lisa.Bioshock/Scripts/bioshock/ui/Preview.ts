class Preview {
    constructor(selector: string) {
        this.element = <HTMLIFrameElement> $(selector)[0];
        this.document = $(this.element.contentDocument || this.element.contentWindow);
    }

    public addKeyUpHandler(eventHandler: (JQueryKeyEventObject) => any) {
        this.document.on('keyup', eventHandler);
    }

    public removeKeyUpHandler(eventHandler: (JQueryKeyEventObject) => any) {
        this.document.off('keyup', eventHandler);
    }

    private element: HTMLIFrameElement;
    private document: JQuery;
}